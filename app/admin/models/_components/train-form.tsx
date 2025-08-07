"use client";

import { trainModel } from "@/_actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";

import { ModelNameInput } from "./model-name-input";
import { TargetColumnSelector } from "./target-column-selector";
import { FeatureColumnSelector } from "./feature-column-selector";
import { TrainingDataUpload } from "./training-data-upload";
import { BatchRangeSelector } from "./batch-range-selector";

interface FormState {
  file: File | null;
  modelName: string;
  targetColumn: string;
  columns: string[];
  selectedFeatures: Record<string, boolean>;
  isLoading: boolean;
  isParsingCsv: boolean;
  error: string | null;
  totalRows: number;
  startRow: number;
  endRow: number;
}

const useCSVParser = () => {
  const parseColumns = async (file: File): Promise<string[]> => {
    const text = await file.text();
    const firstLine = text.split("\n")[0];
    return firstLine ? firstLine.split(",").map((h) => h.trim()) : [];
  };

  const createBatchFile = async (
    file: File,
    startRow: number,
    endRow: number
  ): Promise<File> => {
    const text = await file.text();
    const lines = text.split("\n");
    const header = lines[0];

    const selectedLines = lines.slice(startRow, endRow + 1);
    const batchContent = [header, ...selectedLines].join("\n");

    const batchBlob = new Blob([batchContent], { type: "text/csv" });
    const originalName = file.name.replace(".csv", "");
    const batchFileName = `${originalName}_batch_${startRow}-${endRow}.csv`;

    return new File([batchBlob], batchFileName, { type: "text/csv" });
  };

  return { parseColumns, createBatchFile };
};

export function TrainForm() {
  const router = useRouter();
  const { parseColumns, createBatchFile } = useCSVParser();

  const [state, setState] = useState<FormState>({
    file: null,
    modelName: "",
    targetColumn: "",
    columns: [],
    selectedFeatures: {},
    isLoading: false,
    isParsingCsv: false,
    error: null,
    totalRows: 0,
    startRow: 1,
    endRow: 1,
  });

  const updateState = (updates: Partial<FormState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const selectedFeatureCount = Object.values(state.selectedFeatures).filter(
    Boolean
  ).length;

  const selectedFeaturesList = Object.entries(state.selectedFeatures)
    .filter(
      ([column, isSelected]) => isSelected && column !== state.targetColumn
    )
    .map(([column]) => column);

  const isFormValid =
    state.file &&
    state.modelName.trim() &&
    state.targetColumn &&
    selectedFeaturesList.length > 0;

  const handleFileChange = async (file: File | null, rowCount?: number) => {
    updateState({
      file,
      columns: [],
      targetColumn: "",
      selectedFeatures: {},
      error: null,
      totalRows: rowCount || 0,
      startRow: 1,
      endRow: rowCount || 1,
    });

    if (!file) return;

    updateState({ isParsingCsv: true });
    try {
      const columns = await parseColumns(file);
      if (columns.length > 0) {
        const lastColumn = columns[columns.length - 1];
        const features = columns.reduce(
          (acc: Record<string, boolean>, col: string) => {
            acc[col] = col !== lastColumn;
            return acc;
          },
          {}
        );

        updateState({
          columns,
          targetColumn: lastColumn,
          selectedFeatures: features,
        });
      }
    } catch (err) {
      console.error("Error parsing CSV:", err);
      updateState({ error: "Error saat memproses file CSV" });
    } finally {
      updateState({ isParsingCsv: false });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      updateState({ error: "Mohon isi semua field yang diperlukan" });
      return;
    }

    if (selectedFeaturesList.length === 0) {
      updateState({ error: "Mohon pilih setidaknya satu kolom fitur" });
      return;
    }

    const isValidBatchRange =
      state.startRow <= state.endRow &&
      state.startRow >= 1 &&
      state.endRow <= state.totalRows;

    if (!isValidBatchRange) {
      updateState({ error: "Rentang baris tidak valid" });
      return;
    }

    updateState({ isLoading: true, error: null });

    try {
      const batchFile = await createBatchFile(
        state.file!,
        state.startRow,
        state.endRow
      );

      const formData = new FormData();
      formData.append("file", batchFile);
      formData.append("model_name", state.modelName);
      formData.append("target_column", state.targetColumn);
      formData.append("feature_columns", JSON.stringify(selectedFeaturesList));

      const result = await trainModel(formData);
      const batchSize = state.endRow - state.startRow + 1;

      toast.success("Model berhasil dilatih!", {
        description: `Model "${state.modelName}" telah dilatih menggunakan ${batchSize} baris data (baris ${state.startRow}-${state.endRow}) dan siap digunakan.`,
      });
      router.push(`/admin/models/${encodeURIComponent(result.modelName)}`);
    } catch (err: any) {
      updateState({ error: err.message || "Gagal melatih model" });
    } finally {
      updateState({ isLoading: false });
    }
  };

  const toggleFeatureSelection = (column: string) => {
    if (column === state.targetColumn) return;

    setState((prev) => ({
      ...prev,
      selectedFeatures: {
        ...prev.selectedFeatures,
        [column]: !prev.selectedFeatures[column],
      },
    }));
  };

  const handleTargetColumnChange = (newTarget: string) => {
    updateState({
      targetColumn: newTarget,
      selectedFeatures: {
        ...state.selectedFeatures,
        [state.targetColumn]: false,
        [newTarget]: false,
      },
    });
  };

  const handleStartRowChange = (startRow: number) => {
    updateState({ startRow });
  };

  const handleEndRowChange = (endRow: number) => {
    updateState({ endRow });
  };

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-border">
        <CardTitle className="font-medium text-base sm:text-lg">
          Latih Model Baru
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-5">
            <div className="lg:w-2/5 space-y-4 sm:space-y-5">
              <ModelNameInput
                value={state.modelName}
                onChange={(value) => updateState({ modelName: value })}
              />

              <TargetColumnSelector
                value={state.targetColumn}
                onChange={handleTargetColumnChange}
                columns={state.columns}
                hasFile={!!state.file}
              />

              <FeatureColumnSelector
                columns={state.columns}
                selectedFeatures={state.selectedFeatures}
                targetColumn={state.targetColumn}
                onToggleFeature={toggleFeatureSelection}
                selectedCount={selectedFeatureCount}
              />

              {state.totalRows > 0 && (
                <BatchRangeSelector
                  totalRows={state.totalRows}
                  startRow={state.startRow}
                  endRow={state.endRow}
                  onStartRowChange={handleStartRowChange}
                  onEndRowChange={handleEndRowChange}
                  disabled={state.isLoading || state.isParsingCsv}
                />
              )}
            </div>

            {/* Right column - File upload */}
            <div className="lg:w-3/5 h-full">
              <TrainingDataUpload onFileChange={handleFileChange} />
            </div>
          </div>
        </form>
        <SubmitButton
          isLoading={state.isLoading}
          disabled={state.isLoading || state.isParsingCsv || !isFormValid}
          onSubmit={handleSubmit}
          loadingText={state.isParsingCsv ? "Memproses CSV..." : "Melatih..."}
          submitText="Latih Model"
          icon={Brain}
          className="w-full mt-4 sm:mt-6 rounded-none font-normal border border-border hover:bg-accent text-foreground bg-secondary"
        />

        {state.error && (
          <div className="mt-4 p-3 bg-red-950/20 border border-red-400/30 rounded-lg">
            <p className="text-red-400 text-sm">{state.error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
