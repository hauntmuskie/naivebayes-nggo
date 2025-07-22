import { ModelsWithMetrics } from "@/database/schema";
import { BarChart3 } from "lucide-react";

interface ModelPerformanceCardProps {
  model: ModelsWithMetrics | null;
}

export function ModelPerformanceCard({ model }: ModelPerformanceCardProps) {
  if (!model) return null;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        Performa Model
      </label>
      <div className="p-3 bg-muted/50 rounded-lg">
        <div className="text-xl sm:text-2xl font-bold text-green-400">
          {(model.accuracy * 100).toFixed(1)}%
        </div>
        <div className="text-xs text-muted-foreground">Akurasi Model</div>
      </div>
    </div>
  );
}
