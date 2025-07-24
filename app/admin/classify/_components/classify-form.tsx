"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import {
  ModelsWithMetrics,
  ClassificationsSelect,
  ModelMetricsSelect,
} from "@/database/schema";
import { classifyData, saveClassificationHistory } from "@/_actions";

import { ModelSelector } from "./model-selector";
import { ModelPerformanceCard } from "./model-performance-card";
import { FileUpload } from "@/components/file-upload";
import { ErrorDisplay } from "@/components/error-display";
import { SubmitButton } from "@/components/submit-button";

type ClassificationResponse = {
  results: ClassificationsSelect[];
  metrics?: ModelMetricsSelect;
};

interface ClassifyFormProps {
  models: ModelsWithMetrics[];
  initialSelectedModel?: string;
}

export function ClassifyForm({
  models,
  initialSelectedModel,
}: ClassifyFormProps) {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [missingColumns, setMissingColumns] = useState<string[]>([]);
  const [currentModel, setCurrentModel] = useState<ModelsWithMetrics | null>(
    null
  );
  const [classifyLoading, setClassifyLoading] = useState(false);

  useEffect(() => {
    if (
      initialSelectedModel &&
      models.some((m) => m.modelName === initialSelectedModel)
    ) {
      setSelectedModel(initialSelectedModel);
      setCurrentModel(
        models.find((m) => m.modelName === initialSelectedModel) || null
      );
    } else if (models.length > 0) {
      setSelectedModel(models[0].modelName);
      setCurrentModel(models[0]);
    }
  }, [initialSelectedModel, models]);

  useEffect(() => {
    if (selectedModel && models.length > 0) {
      const model = models.find((m) => m.modelName === selectedModel);
      setCurrentModel(model || null);
      setError(null);
      setMissingColumns([]);
    }
  }, [selectedModel, models]);

  const saveToHistory = async (
    results: ClassificationResponse,
    modelName: string,
    fileName: string
  ): Promise<string> => {
    try {
      const historyId = await saveClassificationHistory(
        fileName,
        modelName,
        results.results?.length || 0,
        results,
        results.metrics?.accuracy
      );
      return historyId;
    } catch (err) {
      console.warn("Failed to save to classification history:", err);
      throw err;
    }
  };

  const validateCsvColumns = async (
    file: File
  ): Promise<{ valid: boolean; missingColumns?: string[] }> => {
    if (!currentModel) return { valid: true };

    try {
      const text = await file.text();
      const lines = text.split("\n");
      if (lines.length === 0)
        return { valid: false, missingColumns: currentModel.featureColumns };

      const headers = lines[0].split(",").map((h) => h.trim());
      const missingColumns = currentModel.featureColumns.filter(
        (col) => !headers.includes(col)
      );

      return {
        valid: missingColumns.length === 0,
        missingColumns: missingColumns.length > 0 ? missingColumns : undefined,
      };
    } catch (err) {
      console.error("Error validating CSV columns:", err);
      return { valid: false };
    }
  };

  const handleModelSelect = useCallback((modelName: string) => {
    setSelectedModel(modelName);
  }, []);

  const handleFileChange = useCallback((newFile: File | null) => {
    setFile(newFile);
    setError(null);
    setMissingColumns([]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedModel) {
      setError("Harap pilih model dan unggah file");
      return;
    }

    if (!models.some((m) => m.modelName === selectedModel)) {
      setError(
        `Model "${selectedModel}" tidak ditemukan. Harap pilih model yang ada.`
      );
      return;
    }

    const validation = await validateCsvColumns(file);
    if (!validation.valid && validation.missingColumns) {
      setMissingColumns(validation.missingColumns);
      setError(`Kolom fitur yang diperlukan tidak ada dalam file CSV`);
      return;
    }

    setClassifyLoading(true);
    setError(null);
    setMissingColumns([]);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model_name", selectedModel);

      const classificationResults = await classifyData(formData);

      const historyId = await saveToHistory(
        classificationResults,
        selectedModel,
        file.name
      );
      toast.success("Klasifikasi berhasil diselesaikan!", {
        description: `Berhasil mengklasifikasi ${
          classificationResults.results?.length || 0
        } record menggunakan model "${selectedModel}".`,
      });

      router.push(`/admin/classify/history/${historyId}`);
    } catch (err: any) {
      let errorMessage = err.message || "Klasifikasi gagal";
      let missingCols: string[] = [];

      try {
        if (errorMessage.includes("detail")) {
          const errorDetail = JSON.parse(
            errorMessage.substring(errorMessage.indexOf("{"))
          );
          if (errorDetail.missing_columns) {
            missingCols = errorDetail.missing_columns;
            errorMessage = errorDetail.message;
          }
        }
      } catch (parseError) {
        console.error("Failed to parse error details:", parseError);
      }

      setError(errorMessage);
      if (missingCols.length > 0) {
        setMissingColumns(missingCols);
      }
    } finally {
      setClassifyLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-border">
        <CardTitle className="flex items-center gap-2 font-medium text-base sm:text-lg">
          <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
          Pengaturan Klasifikasi
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-5">
            {/* Left column - Model selection and performance */}
            <div className="lg:w-2/5 space-y-4 sm:space-y-5">
              <ModelSelector
                models={models}
                selectedModel={selectedModel}
                onModelSelect={handleModelSelect}
              />

              <ModelPerformanceCard model={currentModel} />
            </div>

            {/* Right column - File upload */}
            <div className="lg:w-3/5 h-full">
              {" "}
              <FileUpload
                accept=".csv"
                label="Unggah Data"
                description="File CSV Anda harus berisi kolom fitur yang sama seperti yang digunakan saat pelatihan"
                onFileChange={handleFileChange}
                required
              />
            </div>
          </div>
        </form>
        <ErrorDisplay error={error} missingColumns={missingColumns} />{" "}
        <SubmitButton
          isLoading={classifyLoading}
          disabled={classifyLoading || !selectedModel || !file}
          onSubmit={handleSubmit}
          loadingText="Memproses Klasifikasi..."
          submitText="Klasifikasi Data"
          icon={Settings}
          className="w-full mt-4 sm:mt-6 rounded-none font-normal border border-border hover:bg-accent text-foreground bg-secondary"
        />
      </CardContent>
    </Card>
  );
}
