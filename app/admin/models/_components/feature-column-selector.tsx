import { CheckSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FeatureColumnSelectorProps {
  columns: string[];
  selectedFeatures: Record<string, boolean>;
  targetColumn: string;
  onToggleFeature: (column: string) => void;
  selectedCount: number;
  required?: boolean;
}

export function FeatureColumnSelector({
  columns,
  selectedFeatures,
  targetColumn,
  onToggleFeature,
  selectedCount,
  required = true,
}: FeatureColumnSelectorProps) {
  if (columns.length === 0) return null;

  return (
    <div className="mt-4 sm:mt-5">
     
      <Label className="text-sm font-medium flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4" />
          Kolom Fitur {required && <span className="text-red-500">*</span>}
        </span>
        <span className="text-xs text-muted-foreground">
          {selectedCount} terpilih
        </span>
      </Label>
      <div className="mt-2 max-h-[150px] sm:max-h-[200px] overflow-y-auto border border-border rounded-sm bg-input p-2">
        {columns.map((column) => {
          const isTarget = column === targetColumn;
          const isSelected = !!selectedFeatures[column] && !isTarget;

          return (
            <div key={column} className="flex items-center mb-1.5">
              <Input
                type="checkbox"
                id={`feature-${column}`}
                checked={isSelected}
                onChange={() => onToggleFeature(column)}
                disabled={isTarget}
                className={`mr-2 h-4 w-4 rounded border-gray-300 ${
                  isTarget ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              />
              <Label
                htmlFor={`feature-${column}`}
                className={`text-xs sm:text-sm break-all ${
                  isTarget ? "line-through text-muted-foreground" : ""
                }`}
              >
                {column}
                {isTarget && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    (target)
                  </span>
                )}
              </Label>
            </div>
          );
        })}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Pilih kolom yang akan digunakan sebagai fitur untuk pelatihan
      </p>
    </div>
  );
}
