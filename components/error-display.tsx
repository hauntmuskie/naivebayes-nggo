import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface ErrorDisplayProps {
  error: string | null;
  missingColumns: string[];
}

export function ErrorDisplay({ error, missingColumns }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-medium text-sm sm:text-base">{error}</p>
          {missingColumns.length > 0 && (
            <div>
              <p className="text-sm mb-2">Missing required columns:</p>
              <div className="flex flex-wrap gap-1">
                {missingColumns.map((col) => (
                  <Badge key={col} variant="destructive" className="text-xs">
                    {col}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
