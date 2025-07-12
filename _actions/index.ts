import {
  ModelsSelect,
  ModelsInsert,
  ModelsWithMetrics,
  ClassificationsSelect,
  ClassificationsInsert,
  ModelMetricsSelect,
  ModelMetricsInsert,
  ClassificationHistorySelect,
  ClassificationHistoryInsert,
  DatasetRecordsSelect,
  DatasetRecordsInsert,
  models,
  modelMetrics,
  classifications,
  classificationHistory,
  datasetRecords,
} from "@/database/schema";
import database from "@/database";
import { desc, eq } from "drizzle-orm";
import { revalidateTag, revalidatePath } from "next/cache";
import { unstable_cache } from "next/cache";
import { login as authLogin, logout as authLogout } from "./auth";
import {
  verifySession as authRequireAuth,
  isAuthenticated as authIsAuthenticated,
} from "@/lib/dal";

export const login = authLogin;
export const logout = authLogout;
export const isAuthenticated = authIsAuthenticated;
export const requireAuth = authRequireAuth;

const BACKEND_URL = process.env.BACKEND_URL;

type HealthStatus = {
  status: "online" | "offline" | "loading";
  version: string;
};

type ClassificationResponse = {
  results: ClassificationsSelect[];
  metrics?: ModelMetricsSelect;
};

export async function checkHealth(): Promise<HealthStatus> {
  if (!BACKEND_URL) {
    return { status: "offline", version: "0.0.0" };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      next: {
        tags: ["health"],
        revalidate: 60,
      },
    });
    if (!response.ok) {
      throw new Error();
    }
    const healthData = await response.json();
    return { status: "online", version: healthData.version };
  } catch (error) {
    console.error("Health check error:", error);
    return { status: "offline", version: "0.0.0" };
  }
}

export const fetchModels = unstable_cache(
  async (): Promise<ModelsWithMetrics[]> => {
    try {
      const result = await database.query.models.findMany({
        orderBy: [desc(models.createdAt)],
        with: {
          metrics: true,
          classifications: true,
        },
      });
      return result as ModelsWithMetrics[];
    } catch (error) {
      throw error;
    }
  },
  ["models"],
  {
    tags: ["models"],
    revalidate: 300,
  }
);

async function saveDatasetRecordsFromCSV(
  file: File,
  datasetType: string,
  maxRecords: number = 100
): Promise<void> {
  try {
    const text = await file.text();
    const lines = text.trim().split("\n");
    if (lines.length < 2) return;
    const headers = lines[0].split(",").map((h) => h.trim());
    const dataRows = lines.slice(1);
    const recordsToSave = dataRows.slice(0, maxRecords);
    const recordsToInsert: DatasetRecordsInsert[] = recordsToSave.map(
      (row, index) => {
        const values = row.split(",").map((v) => v.trim());
        const rowData: Record<string, any> = {};
        headers.forEach((header, i) => {
          rowData[header] = values[i] || "";
        });
        return {
          recordId:
            rowData.id ||
            rowData.record_id ||
            rowData.RecordId ||
            `${datasetType}_${Date.now()}_${index}`,
          fileName: file.name,
          datasetType: datasetType as "training" | "testing" | "validation",
          rawData: rowData,
          columns: headers,
        };
      }
    );
    const batchSize = 10;
    for (let i = 0; i < recordsToInsert.length; i += batchSize) {
      const batch = recordsToInsert.slice(i, i + batchSize);
      const uniqueBatch = [];
      for (const record of batch) {
        const isDuplicate = await checkRecordDuplicate(record.recordId);
        if (!isDuplicate) {
          uniqueBatch.push(record);
        }
      }
      if (uniqueBatch.length > 0) {
        await database.insert(datasetRecords).values(uniqueBatch);
      }
    }
  } catch (error) {}
}

export async function trainModel(formData: FormData): Promise<ModelsSelect> {
  await authRequireAuth();

  if (!BACKEND_URL) {
    throw new Error();
  }

  try {
    const file = formData.get("file") as File;

    if (file) {
      await saveDatasetRecordsFromCSV(file, "training");
    }

    const response = await fetch(`${BACKEND_URL}/api/train`, {
      method: "POST",
      body: formData,
      cache: "no-store",
      signal: AbortSignal.timeout(60000),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to train model");
    }
    const modelInfo = await response.json();

    const modelInsert: ModelsInsert = {
      modelName: modelInfo.modelName,
      targetColumn: modelInfo.targetColumn,
      featureColumns: modelInfo.featureColumns,
      classes: modelInfo.classes,
      accuracy: modelInfo.accuracy,
      modelData: modelInfo.modelData || "",
      encodersData: modelInfo.encodersData || "",
      labelEncoderData: modelInfo.labelEncoderData || "",
    };

    const [insertedModel] = await database
      .insert(models)
      .values(modelInsert)
      .returning();

    if (modelInfo.metrics) {
      const metricsInsert: ModelMetricsInsert = {
        modelId: insertedModel.id,
        accuracy: modelInfo.metrics.accuracy,
        precision: modelInfo.metrics.precision,
        recall: modelInfo.metrics.recall,
        f1Score: modelInfo.metrics.f1Score,
        classMetrics: modelInfo.metrics.classMetrics,
        confusionMatrix: modelInfo.metrics.confusionMatrix,
      };
      await database.insert(modelMetrics).values(metricsInsert);
    }

    revalidateTag("models");
    revalidateTag("dataset-records");
    revalidatePath("/models");
    revalidatePath("/");

    return insertedModel;
  } catch (error: any) {
    throw new Error(error.message || "Failed to train model");
  }
}

export async function deleteModel(modelName: string): Promise<boolean> {
  await authRequireAuth();

  try {
    const model = await database.query.models.findFirst({
      where: eq(models.modelName, modelName),
    });

    if (!model) {
      throw new Error(`Model "${modelName}" not found in database`);
    }

    if (BACKEND_URL) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/models/${modelName}`, {
          method: "DELETE",
          cache: "no-store",
          signal: AbortSignal.timeout(5000),
        });
      } catch (apiError) {}
    }

    await Promise.all([
      database.delete(models).where(eq(models.modelName, modelName)),
      database.delete(modelMetrics).where(eq(modelMetrics.modelId, model.id)),
      database
        .delete(classifications)
        .where(eq(classifications.modelId, model.id)),
    ]);

    revalidateTag("models");
    revalidateTag("classifications");
    revalidatePath("/models");
    revalidatePath("/");

    return true;
  } catch (error) {
    return false;
  }
}

export async function classifyData(
  formData: FormData
): Promise<ClassificationResponse> {
  await authRequireAuth();

  if (!BACKEND_URL) {
    throw new Error();
  }

  try {
    const file = formData.get("file") as File;

    if (file) {
      await saveDatasetRecordsFromCSV(file, "testing");
    }
    const response = await fetch(`${BACKEND_URL}/api/classify`, {
      method: "POST",
      body: formData,
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) {
      const errorData = await response.json();
      if (typeof errorData.detail === "object" && errorData.detail.message) {
        throw new Error(JSON.stringify(errorData.detail));
      } else if (
        response.status === 404 &&
        errorData.detail &&
        errorData.detail.includes("Model")
      ) {
        const modelName = errorData.detail.match(/'([^']*)'/)?.[1] || "unknown";
        throw new Error(
          `Model not found: "${modelName}". Please select an existing model.`
        );
      } else {
        throw new Error(errorData.detail || "Failed to classify data");
      }
    }
    const results: ClassificationResponse = await response.json();
    const modelName = formData.get("model_name") as string;
    const model = await database.query.models.findFirst({
      where: eq(models.modelName, modelName),
    });

    if (model && results.results) {
      const classificationsToInsert: ClassificationsInsert[] =
        results.results.map((result) => ({
          modelId: model.id,
          data: JSON.stringify(result),
          predictedClass: result.predictedClass,
          actualClass: result.actualClass || null,
          confidence: result.confidence,
        }));
      await database.insert(classifications).values(classificationsToInsert);
      if (results.metrics) {
        const metricsInsert: ModelMetricsInsert = {
          modelId: model.id,
          accuracy: results.metrics.accuracy,
          precision: results.metrics.precision,
          recall: results.metrics.recall,
          f1Score: results.metrics.f1Score,
          classMetrics: results.metrics.classMetrics,
          confusionMatrix: results.metrics.confusionMatrix,
        };
        await database.insert(modelMetrics).values(metricsInsert);
      }
    }

    revalidateTag("classifications");
    revalidateTag("dataset-records");
    revalidateTag("models");

    return results;
  } catch (error: any) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(error.message || "Failed to classify data");
    }
  }
}

export async function saveClassificationHistory(
  fileName: string,
  modelName: string,
  totalRecords: number,
  results: ClassificationResponse,
  accuracy?: number
): Promise<string> {
  try {
    const historyInsert: ClassificationHistoryInsert = {
      fileName,
      modelName,
      totalRecords,
      accuracy: accuracy || null,
      results: JSON.stringify(results),
    };
    const [inserted] = await database
      .insert(classificationHistory)
      .values(historyInsert)
      .returning();
    revalidateTag("classification-history");
    revalidatePath("/classify/history");
    return inserted.id;
  } catch (error) {
    throw error;
  }
}

export const fetchClassificationHistory = unstable_cache(
  async (): Promise<ClassificationHistorySelect[]> => {
    try {
      return await database.query.classificationHistory.findMany({
        orderBy: [desc(classificationHistory.createdAt)],
      });
    } catch (error) {
      throw error;
    }
  },
  ["classification-history"],
  {
    tags: ["classification-history"],
    revalidate: 60,
  }
);

export async function deleteClassificationHistory(id: string): Promise<void> {
  await authRequireAuth();

  try {
    await database
      .delete(classificationHistory)
      .where(eq(classificationHistory.id, id));
    revalidateTag("classification-history");
    revalidatePath("/classify/history");
  } catch (error) {
    throw error;
  }
}

export const fetchClassificationById = unstable_cache(
  async (id: string): Promise<ClassificationHistorySelect | null> => {
    try {
      const result = await database.query.classificationHistory.findFirst({
        where: eq(classificationHistory.id, id),
      });
      return result || null;
    } catch (error) {
      throw error;
    }
  },
  ["classification-by-id"],
  {
    tags: ["classification-history"],
    revalidate: 300,
  }
);

export const fetchDatasetRecords = unstable_cache(
  async (): Promise<DatasetRecordsSelect[]> => {
    try {
      return await database.query.datasetRecords.findMany({
        orderBy: [desc(datasetRecords.createdAt)],
      });
    } catch (error) {
      throw error;
    }
  },
  ["dataset-records"],
  {
    tags: ["dataset-records"],
    revalidate: 60,
  }
);

export async function checkRecordDuplicate(recordId: string): Promise<boolean> {
  try {
    const existingRecord = await database.query.datasetRecords.findFirst({
      where: eq(datasetRecords.recordId, recordId),
    });
    return !!existingRecord;
  } catch (error) {
    throw error;
  }
}

export const fetchClassifications = unstable_cache(
  async (): Promise<ClassificationsSelect[]> => {
    try {
      return await database.query.classifications.findMany({
        orderBy: [desc(classifications.createdAt)],
      });
    } catch (error) {
      throw error;
    }
  },
  ["classifications"],
  {
    tags: ["classifications"],
    revalidate: 60,
  }
);
