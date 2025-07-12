import { Input } from "@/components/ui/input";
import { Brain } from "lucide-react";

interface ModelNameInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function ModelNameInput({ value, onChange, required = true }: ModelNameInputProps) {
  return (
    <div>
      <label
        htmlFor="model-name"
        className="text-sm font-medium flex items-center gap-2"
      >
        <Brain className="h-4 w-4" />
        Model Name {required && <span className="text-red-500">*</span>}
      </label>
      <Input
        id="model-name"
        placeholder="Enter a unique model name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1.5 rounded-none bg-input focus-visible:ring-0 border-border text-sm"
      />
    </div>
  );
}
