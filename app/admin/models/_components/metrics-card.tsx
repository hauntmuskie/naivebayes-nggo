import {
  ModelsSelect,
  ModelsWithMetrics,
  ModelMetricsSelect,
} from "@/database/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPercentage, cn } from "@/lib/utils";
import { deleteModel } from "@/_actions";
import Link from "next/link";
import {
  TrendingUp,
  Target,
  Search,
  RotateCcw,
  Scale,
  Brain,
  Database,
  Eye,
  Trash2,
  BarChart3,
} from "lucide-react";

export function MetricsCard({
  metrics,
  title,
  model,
  showActions = false,
}: {
  metrics: ModelMetricsSelect;
  title: string;
  model?: ModelsSelect | ModelsWithMetrics;
  showActions?: boolean;
}) {
  const metricsData = [
    {
      label: "Accuracy",
      value: metrics.accuracy,
      description: "Overall model correctness",
      color: "from-blue-500/20 to-blue-600/30",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
      icon: Target,
      bgGlow: "bg-blue-500/5",
    },
    {
      label: "Precision",
      value: metrics.precision,
      description: "Positive prediction accuracy",
      color: "from-emerald-500/20 to-emerald-600/30",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-400",
      icon: Search,
      bgGlow: "bg-emerald-500/5",
    },
    {
      label: "Recall",
      value: metrics.recall,
      description: "True positive detection rate",
      color: "from-purple-500/20 to-purple-600/30",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400",
      icon: RotateCcw,
      bgGlow: "bg-purple-500/5",
    },
    {
      label: "F1 Score",
      value: metrics.f1Score,
      description: "Balanced precision & recall",
      color: "from-amber-500/20 to-amber-600/30",
      borderColor: "border-amber-500/30",
      textColor: "text-amber-400",
      icon: Scale,
      bgGlow: "bg-amber-500/5",
    },
  ];

  const getScoreLevel = (value: number) => {
    if (value >= 0.9) return { level: "Excellent", color: "text-emerald-400" };
    if (value >= 0.8) return { level: "Good", color: "text-green-400" };
    if (value >= 0.7) return { level: "Fair", color: "text-yellow-400" };
    return { level: "Poor", color: "text-red-400" };
  };

  const handleDeleteModel = async () => {
    if (
      model &&
      confirm(`Are you sure you want to delete model ${model.modelName}?`)
    ) {
      await deleteModel(model.modelName);
    }
  };

  return (
    <Card className="w-full border border-border/40 shadow-2xl bg-gradient-to-br from-card/60 to-background/80 overflow-hidden hover:border-border/60 transition-all duration-500 hover:shadow-xl group">
      <CardHeader className="pb-6 border-b border-border relative">
        {/* Subtle glow effect */}
        <div className="absolute inset-0 " />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center border border-border/30 shadow-lg">
              <BarChart3 className="h-6 w-6 text-foreground/90" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground tracking-tight">
                {title}
              </CardTitle>
              <p className="text-sm text-muted-foreground/80 mt-1 tracking-wide">
                {model
                  ? `${model.modelName} • Performance Analysis`
                  : "Performance metrics analysis"}
              </p>
            </div>
          </div>
          {showActions && model && (
            <div className="flex items-center space-x-3 relative z-10">
              <Link
                href={`/models/${encodeURIComponent(model.modelName)}`}
                className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium rounded-xl border border-border/40 bg-background/80 hover:bg-accent/80 hover:text-accent-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Eye className="h-4 w-4 mr-2" />
                Details
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteModel}
                className="h-10 px-4 text-sm rounded-xl hover:scale-105 transition-all duration-300 bg-red-500/90 hover:bg-red-600 border border-red-500/40 shadow-lg"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        {/* Model Information Section */}
        {model && (
          <div className="space-y-6 pb-8 border-b border-border/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-border/30">
                <Brain className="h-4 w-4 text-blue-400" />
              </div>
              <h3 className="text-base font-bold text-foreground uppercase tracking-wider">
                Model Configuration
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3 p-4 bg-gradient-to-br from-accent/30 to-muted/20 rounded-xl border border-border/30">
                <p className="text-xs uppercase tracking-widest text-muted-foreground/80 font-bold">
                  Target Column
                </p>
                <div className="flex items-center space-x-3">
                  <Target className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-bold text-foreground bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/20">
                    {model.targetColumn}
                  </span>
                </div>
              </div>

              <div className="space-y-3 p-4 bg-gradient-to-br from-accent/30 to-muted/20 rounded-xl border border-border/30">
                <p className="text-xs uppercase tracking-widest text-muted-foreground/80 font-bold">
                  Classes ({model.classes.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {model.classes.slice(0, 3).map((cls) => (
                    <span
                      key={cls}
                      className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium"
                    >
                      {cls}
                    </span>
                  ))}
                  {model.classes.length > 3 && (
                    <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      +{model.classes.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-gradient-to-br from-accent/30 to-muted/20 rounded-xl border border-border/30">
              <p className="text-xs uppercase tracking-widest text-muted-foreground/80 font-bold">
                Feature Columns ({model.featureColumns.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {model.featureColumns.slice(0, 8).map((feature: string) => (
                  <span
                    key={feature}
                    className="text-xs px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium"
                  >
                    {feature}
                  </span>
                ))}
                {model.featureColumns.length > 8 && (
                  <span className="text-xs px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                    +{model.featureColumns.length - 8} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Performance Metrics Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-lg flex items-center justify-center border border-border/30">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-foreground uppercase tracking-wider">
              Performance Metrics
            </h3>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {metricsData.map((metric, index) => {
              const scoreLevel = getScoreLevel(metric.value);
              const percentage = formatPercentage(metric.value);
              const IconComponent = metric.icon;

              return (
                <div
                  key={metric.label}
                  className={cn(
                    "relative group p-6 rounded-xl border transition-all duration-500 hover:scale-[1.03] hover:shadow-xl",
                    metric.borderColor,
                    metric.bgGlow,
                    "hover:border-opacity-60"
                  )}
                >
                  {/* Enhanced background gradient overlay */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-5 rounded-xl transition-all duration-500 group-hover:opacity-20",
                      metric.color
                    )}
                  />

                  {/* Subtle glow effect on hover */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500",
                      metric.color.replace("/20", "/10").replace("/30", "/15")
                    )}
                  />

                  {/* Content */}
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className={cn(
                          "p-3 rounded-xl border border-border/30",
                          metric.bgGlow
                        )}
                      >
                        <IconComponent
                          className={cn("h-5 w-5", metric.textColor)}
                        />
                      </div>
                      <div className="flex-1">
                        <h3
                          className={cn(
                            "text-base font-bold",
                            metric.textColor
                          )}
                        >
                          {metric.label}
                        </h3>
                        <p className="text-sm text-muted-foreground/70 mt-1">
                          {metric.description}
                        </p>
                      </div>
                    </div>

                    {/* Enhanced score display */}
                    <div className="flex items-baseline space-x-3">
                      <span
                        className={cn(
                          "text-3xl font-mono font-black",
                          metric.textColor
                        )}
                      >
                        {percentage}
                      </span>
                      <span
                        className={cn("text-lg font-bold", metric.textColor)}
                      >
                        %
                      </span>
                      <span
                        className={cn(
                          "text-sm font-bold ml-auto px-2 py-1 rounded-lg bg-opacity-20",
                          scoreLevel.color,
                          scoreLevel.color.replace("text-", "bg-")
                        )}
                      >
                        {scoreLevel.level}
                      </span>
                    </div>

                    {/* Enhanced progress bar */}
                    <div className="w-full bg-border/20 rounded-full h-2 overflow-hidden">
                      <div
                        className={cn(
                          "h-full bg-gradient-to-r rounded-full transition-all duration-1000 ease-out relative",
                          metric.color.replace("/20", "").replace("/30", "")
                        )}
                        style={{
                          width: `${Math.min(metric.value * 100, 100)}%`,
                        }}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                      </div>
                    </div>

                    {/* Raw value with better styling */}
                    <div className="text-xs text-muted-foreground/60 font-mono bg-background/30 px-2 py-1 rounded-md border border-border/20">
                      Raw: {metric.value.toFixed(4)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Summary section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-accent/20 via-muted/30 to-secondary/20 rounded-xl border border-border/20 relative overflow-hidden">
          {/* Subtle animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 animate-pulse" />

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg flex items-center justify-center border border-border/30">
                <Database className="h-4 w-4 text-amber-400" />
              </div>
              <h4 className="font-bold text-foreground text-base tracking-wide">
                Performance Summary
              </h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This model demonstrates{" "}
              <span
                className={cn(
                  "font-bold px-2 py-1 rounded-md",
                  getScoreLevel(metrics.accuracy).color,
                  getScoreLevel(metrics.accuracy).color.replace(
                    "text-",
                    "bg-"
                  ) + "/20"
                )}
              >
                {getScoreLevel(metrics.accuracy).level.toLowerCase()}
              </span>{" "}
              overall performance with {formatPercentage(metrics.accuracy)}%
              accuracy. The F1 score of {formatPercentage(metrics.f1Score)}%
              indicates{" "}
              <span
                className={cn(
                  "font-bold px-2 py-1 rounded-md",
                  getScoreLevel(metrics.f1Score).color,
                  getScoreLevel(metrics.f1Score).color.replace("text-", "bg-") +
                    "/20"
                )}
              >
                {getScoreLevel(metrics.f1Score).level.toLowerCase()}
              </span>{" "}
              precision-recall balance.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
