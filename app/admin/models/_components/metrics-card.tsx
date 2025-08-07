"use client";

import {
  ModelsSelect,
  ModelsWithMetrics,
  ModelMetricsSelect,
} from "@/database/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { formatPercentage } from "@/lib/utils";
import { ConfusionMatrix } from "@/components/confusion-matrix";
import { deleteModel } from "@/_actions";
import Link from "next/link";
import { Target, Brain, Eye, Trash2, BarChart3 } from "lucide-react";
import { useConfirmationDialog } from "@/hooks/use-dialog";

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
  const { openDialog, ConfirmationDialog } = useConfirmationDialog();

  const handleDeleteModel = () => {
    if (!model) return;

    openDialog({
      title: "Hapus Model",
      description: `Apakah Anda yakin ingin menghapus model "${model.modelName}"? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data dan metrik terkait.`,
      confirmText: "Hapus Model",
      cancelText: "Batal",
      variant: "destructive",
      onConfirm: async () => {
        await deleteModel(model.modelName);
      },
    });
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
                  ? `${model.modelName} • Analisis Performa`
                  : "Analisis metrik performa"}
              </p>
            </div>
          </div>
          {showActions && model && (
            <div className="flex items-center space-x-3 relative z-10">
              <Link
                href={`/admin/models/${encodeURIComponent(model.modelName)}`}
                className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium rounded-xl border border-border/40 bg-background/80 hover:bg-accent/80 hover:text-accent-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Eye className="h-4 w-4 mr-2" />
                Detail
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteModel}
                className="h-10 px-4 text-sm rounded-xl hover:scale-105 transition-all duration-300 bg-red-500/90 hover:bg-red-600 border border-red-500/40 shadow-lg"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      {/* Model Information Section */}
      <CardContent className="p-8 space-y-8">
        {model && (
          <div className="space-y-6 pb-8 border-b border-border/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-border/30">
                <Brain className="h-4 w-4 text-blue-400" />
              </div>
              <h3 className="text-base font-bold text-foreground uppercase tracking-wider">
                Konfigurasi Model
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3 p-4 bg-gradient-to-br from-accent/30 to-muted/20 rounded-xl border border-border/30">
                <p className="text-xs uppercase tracking-widest text-muted-foreground/80 font-bold">
                  Kolom Target
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
                  Kelas ({model.classes.length})
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
                Kolom Fitur ({model.featureColumns.length})
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
                    +{model.featureColumns.length - 8} lainnya
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Class-Specific Metrics Section */}
        {metrics.classMetrics &&
          Object.keys(metrics.classMetrics).length > 0 && (
            <div className="space-y-6 pb-8 border-b border-border/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-lg flex items-center justify-center border border-border/30">
                    <BarChart3 className="h-4 w-4 text-cyan-400" />
                  </div>
                  <h3 className="text-base font-bold text-foreground uppercase tracking-wider">
                    Performa Per Kelas
                  </h3>
                </div>
                <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 px-4 py-2 rounded-lg border border-blue-500/20">
                  <Target className="h-4 w-4 text-blue-400" />
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-400">
                      {Math.round(Number(formatPercentage(metrics.accuracy)))}%
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      Akurasi Keseluruhan
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border/40">
                      <TableHead className="text-left py-3 px-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                        Kelas
                      </TableHead>
                      <TableHead className="text-right py-3 px-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                        Presisi
                      </TableHead>
                      <TableHead className="text-right py-3 px-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                        Recall
                      </TableHead>
                      <TableHead className="text-right py-3 px-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                        Skor F1
                      </TableHead>
                      <TableHead className="text-right py-3 px-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                        Dukungan (Support)
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(metrics.classMetrics)
                      .filter(
                        ([key]) =>
                          !["accuracy", "macro avg", "weighted avg"].includes(
                            key
                          )
                      )
                      .map(([className, classData]: [string, any]) => {
                        const precision = classData.precision || 0;
                        const recall = classData.recall || 0;
                        const f1Score = classData["f1-score"] || 0;
                        const support = classData.support || 0;

                        return (
                          <TableRow
                            key={className}
                            className="border-b border-border/20 hover:bg-accent/20 transition-colors"
                          >
                            <TableCell className="py-4 px-4">
                              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium text-sm">
                                {className}
                              </span>
                            </TableCell>
                            <TableCell className="py-4 px-4 text-right">
                              <div className="flex flex-col items-end space-y-1">
                                <span className="text-sm font-mono font-bold text-emerald-400">
                                  {Math.round(
                                    Number(formatPercentage(precision))
                                  )}
                                  %
                                </span>
                                <span className="text-xs text-muted-foreground font-mono">
                                  {precision.toFixed(2)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 px-4 text-right">
                              <div className="flex flex-col items-end space-y-1">
                                <span className="text-sm font-mono font-bold text-purple-400">
                                  {Math.round(Number(formatPercentage(recall)))}
                                  %
                                </span>
                                <span className="text-xs text-muted-foreground font-mono">
                                  {recall.toFixed(2)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 px-4 text-right">
                              <div className="flex flex-col items-end space-y-1">
                                <span className="text-sm font-mono font-bold text-amber-400">
                                  {Math.round(
                                    Number(formatPercentage(f1Score))
                                  )}
                                  %
                                </span>
                                <span className="text-xs text-muted-foreground font-mono">
                                  {f1Score.toFixed(2)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 px-4 text-right">
                              <span className="text-sm font-mono font-bold text-cyan-400">
                                {support}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
      </CardContent>

      {/* Confusion Matrix Section */}
      {metrics.confusionMatrix && model?.classes && (
        <div className="px-8 pb-8">
          <ConfusionMatrix metrics={metrics} classes={model.classes} />
        </div>
      )}
      <ConfirmationDialog />
    </Card>
  );
}
