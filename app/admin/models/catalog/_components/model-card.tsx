"use client";

import { ModelsWithMetrics } from "@/database/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteModel } from "@/_actions";
import Link from "next/link";
import {
  Calendar,
  TrendingUp,
  Trash2,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";
import { useConfirmationDialog } from "@/hooks/use-dialog";

export function ModelCard({ model }: { model: ModelsWithMetrics }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { openDialog, ConfirmationDialog } = useConfirmationDialog();

  const handleDeleteModel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openDialog({
      title: "Hapus Model",
      description: `Apakah Anda yakin ingin menghapus model "${model.modelName}"? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait.`,
      confirmText: "Hapus Model",
      cancelText: "Batal",
      variant: "destructive",
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          const success = await deleteModel(model.modelName);
          if (!success) {
            toast.error("Gagal menghapus model. Silakan coba lagi.");
          } else {
            toast.success(`Model ${model.modelName} berhasil dihapus.`);
          }
        } catch (error) {
          console.error("Error deleting model:", error);
          toast.error("Terjadi kesalahan saat menghapus model.");
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  const accuracy = model.accuracy;
  const accuracyPercentage = (accuracy * 100).toFixed();

  return (
    <Card className="h-full border border-border/40 shadow-sm hover:shadow-lg transition-all duration-300 bg-card hover:bg-accent/5 overflow-hidden">
      <CardHeader className="pb-4 min-w-0 border-b border-border">
        <div className="flex items-start justify-between gap-2 min-w-0">
          <CardTitle
            className="text-lg font-semibold text-foreground truncate min-w-0 pr-2"
            title={model.modelName}
          >
            {model.modelName}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-sm text-muted-foreground">Akurasi</span>
          <span className="text-lg font-bold text-green-600 ml-auto">
            {accuracyPercentage}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-muted-foreground">Ditambahkan</span>
          <span className="text-sm font-medium text-foreground ml-auto">
            {model.createdAt
              ? format(model.createdAt, "d MMMM yyyy", { locale: localeId })
              : "Tidak diketahui"}
          </span>
        </div>
        <div className="pt-2 border-t border-border/20">
          <div className="text-xs text-muted-foreground">
            Target:{" "}
            <span className="font-medium text-foreground">
              {model.targetColumn}
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Fitur:{" "}
            <span className="font-medium text-foreground">
              {model.featureColumns.length}
            </span>
          </div>
        </div>
        <div className="pt-2 border-t border-border/20 flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteModel}
            disabled={isDeleting}
            className="text-destructive h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors rounded-sm disabled:opacity-50"
            aria-label="Hapus Model"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
          <Link
            href={`/admin/models/${encodeURIComponent(model.modelName)}`}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md bg-accent/50 hover:bg-accent/60 flex items-center justify-center h-8 w-8"
            aria-label="Lihat Detail Model"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </CardContent>
      <ConfirmationDialog />
    </Card>
  );
}
