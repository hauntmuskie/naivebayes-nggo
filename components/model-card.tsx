"use client";

import { ModelsWithMetrics } from "@/database/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteModel } from "@/_actions";
import Link from "next/link";
import { Calendar, TrendingUp, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { useConfirmationDialog } from "@/hooks/use-dialog";

export function ModelCard({ model }: { model: ModelsWithMetrics }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { openDialog, ConfirmationDialog } = useConfirmationDialog();

  const handleDeleteModel = async (e: React.MouseEvent) => {
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
  const accuracyPercentage = (accuracy * 100).toFixed(1);

  return (
    <Link
      href={`/admin/models/${encodeURIComponent(model.modelName)}`}
      className="group block transition-transform hover:scale-[1.02]"
    >
      <Card className="h-full overflow-hidden border border-border/40 shadow-sm hover:shadow-lg transition-all duration-300 bg-card hover:bg-accent/5">
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold text-foreground truncate pr-2">
              {model.modelName}
            </CardTitle>{" "}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteModel}
              disabled={isDeleting}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {" "}
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
                ? format(model.createdAt, "MMM d, yyyy")
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
        </CardContent>
      </Card>
      <ConfirmationDialog />
    </Link>
  );
}
