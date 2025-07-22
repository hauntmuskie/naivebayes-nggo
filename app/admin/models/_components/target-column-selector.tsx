import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Target } from "lucide-react";

interface TargetColumnSelectorProps {
  value: string;
  onChange: (value: string) => void;
  columns: string[];
  hasFile: boolean;
  required?: boolean;
}

export function TargetColumnSelector({
  value,
  onChange,
  columns,
  hasFile,
  required = true,
}: TargetColumnSelectorProps) {
  return (
    <div>
      {" "}
      <Label
        htmlFor="target-column"
        className="text-sm font-medium flex items-center gap-2"
      >
        <Target className="h-4 w-4" />
        Kolom Target {required && <span className="text-red-500">*</span>}
      </Label>
      {columns.length > 0 ? (
        <Select value={value} onValueChange={onChange}>
          {" "}
          <SelectTrigger
            id="target-column"
            className="w-full mt-1.5 rounded-none bg-input focus-visible:ring-0 border-border text-sm"
          >
            <SelectValue placeholder="Pilih kolom target" />
          </SelectTrigger>
          <SelectContent>
            {columns.map((column) => (
              <SelectItem key={column} value={column}>
                {column}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id="target-column"
          placeholder="Upload CSV untuk memilih kolom"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={!hasFile}
          className="mt-1.5 rounded-none bg-input focus-visible:ring-0 border-border text-sm"
        />
      )}{" "}
      <p className="mt-1 text-xs text-muted-foreground">
        Kolom yang berisi label kelas
      </p>
    </div>
  );
}
