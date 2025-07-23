import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain } from "lucide-react";

interface ModelNameInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function ModelNameInput({
  value,
  onChange,
  required = true,
}: ModelNameInputProps) {
  return (
    <>
      <Label
        htmlFor="model-name"
        className="text-sm font-medium flex items-center gap-2"
      >
        <Brain className="h-4 w-4" />
        Nama Model {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id="model-name"
        placeholder="Masukkan nama model yang unik"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1.5 rounded-none bg-input focus-visible:ring-0 border-border text-sm"
      />
    </>
  );
}
