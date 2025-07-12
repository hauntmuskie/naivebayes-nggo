import { Button } from "@/components/ui/button";
import { LucideIcon, Zap } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  disabled: boolean;
  onSubmit: (e: React.FormEvent) => void;
  loadingText?: string;
  submitText?: string;
  icon?: LucideIcon;
  className?: string;
}

export function SubmitButton({
  isLoading,
  disabled,
  onSubmit,
  loadingText = "Memproses...",
  submitText = "Kirim",
  icon: Icon = Zap,
  className = "",
}: SubmitButtonProps) {
  return (
    <form onSubmit={onSubmit}>
      <Button
        type="submit"
        className={`w-full h-11 sm:h-12 ${className}`}
        disabled={disabled}
        size="lg"
      >
        {isLoading ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
            <span className="text-sm sm:text-base">{loadingText}</span>
          </>
        ) : (
          <>
            <Icon className="h-4 w-4 mr-2" />
            <span className="text-sm sm:text-base">{submitText}</span>
          </>
        )}
      </Button>
    </form>
  );
}
