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

interface FormState {
  file: File | null;
  modelName: string;
  targetColumn: string;
  columns: string[];
  selectedFeatures: Record<string, boolean>;
  isLoading: boolean;
  isParsingCsv: boolean;
  error: string | null;
}

const useCSVParser = () => {
  const parseColumns = async (file: File): Promise<string[]> => {
    const text = await file.text();
    const firstLine = text.split("\n")[0];
    return firstLine ? firstLine.split(",").map((h) => h.trim()) : [];
  };

  return { parseColumns };
};

export function TrainForm() {
  const router = useRouter();
  const { parseColumns } = useCSVParser();

  const [state, setState] = useState<FormState>({
    file: null,
    modelName: "",
    targetColumn: "",
    columns: [],
    selectedFeatures: {},
    isLoading: false,
    isParsingCsv: false,
    error: null,
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

  const handleFileChange = async (file: File | null) => {
    updateState({
      file,
      columns: [],
      targetColumn: "",
      selectedFeatures: {},
      error: null,
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
      updateState({ error: "Error parsing CSV file" });
    } finally {
      updateState({ isParsingCsv: false });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      updateState({ error: "Please fill in all required fields" });
      return;
    }

    if (selectedFeaturesList.length === 0) {
      updateState({ error: "Please select at least one feature column" });
      return;
    }

    updateState({ isLoading: true, error: null });

    try {
      const formData = new FormData();
      formData.append("file", state.file!);
      formData.append("model_name", state.modelName);
      formData.append("target_column", state.targetColumn);
      formData.append("feature_columns", JSON.stringify(selectedFeaturesList));

      const result = await trainModel(formData);
      toast.success("Model trained successfully!", {
        description: `Model "${state.modelName}" has been trained and is ready to use.`,
      });
      router.push(`/admin/models/${encodeURIComponent(result.modelName)}`);
    } catch (err: unknown) {
      updateState({ error: (err as Error).message || "Failed to train model" });
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

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-border">
        <CardTitle className="font-medium text-base sm:text-lg">
          Train New Model
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-5">
            {/* Left column - Form inputs */}
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
          loadingText={state.isParsingCsv ? "Parsing CSV..." : "Training..."}
          submitText="Train Model"
          icon={Brain}
          className="w-full mt-4 sm:mt-6 rounded-none font-normal border border-border hover:bg-accent text-foreground bg-secondary"
        />
      </CardContent>
    </Card>
  );
}
