import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelsWithMetrics } from "@/database/schema";
import { Database } from "lucide-react";

interface ModelSelectorProps {
  models: ModelsWithMetrics[];
  selectedModel: string;
  onModelSelect: (modelName: string) => void;
}

export function ModelSelector({
  models,
  selectedModel,
  onModelSelect,
}: ModelSelectorProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Database className="h-4 w-4" />
        Pilih Model
      </Label>
      <Select value={selectedModel} onValueChange={onModelSelect} required>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Pilih model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.modelName} value={model.modelName}>
              {model.modelName} • {model.targetColumn} •{" "}
              {(model.accuracy * 100).toFixed(1)}% akurasi
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
