"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Clock,
  FileText,
  Target,
  Trash2,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { ClassificationHistorySelect } from "@/database/schema";
import { format } from "date-fns";
import { useConfirmationDialog } from "@/hooks/use-dialog";

interface HistoryCardProps {
  item: ClassificationHistorySelect;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function HistoryCard({
  item,
  onDelete,
  isDeleting = false,
}: HistoryCardProps) {
  const { openDialog, ConfirmationDialog } = useConfirmationDialog();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    openDialog({
      title: "Hapus Riwayat Klasifikasi",
      description: `Apakah Anda yakin ingin menghapus riwayat klasifikasi untuk file "${item.fileName}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Hapus Riwayat",
      cancelText: "Batal",
      variant: "destructive",
      onConfirm: () => onDelete(item.id),
    });
  };

  const parsedResults = (() => {
    try {
      return JSON.parse(item.results);
    } catch {
      return { results: [] };
    }
  })();

  return (
    <Card className="h-full border border-border/40 shadow-sm hover:shadow-lg transition-all duration-300 bg-card hover:bg-accent/5 overflow-hidden">
      <CardHeader className="pb-4 min-w-0">
        <div className="flex items-start justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
            <FileText className="h-4 w-4 text-purple-500 flex-shrink-0" />
            <CardTitle
              className="text-lg font-semibold text-foreground truncate min-w-0 cursor-default overflow-hidden text-ellipsis whitespace-nowrap"
              title={item.fileName}
            >
              {item.fileName}
            </CardTitle>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs w-fit">
          {item.modelName}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Diproses</span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {format(item.createdAt, "MMM d, yyyy h:mm a")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-orange-500" />
          <span className="text-sm text-muted-foreground">Record</span>
          <span className="text-lg font-bold text-foreground ml-auto">
            {item.totalRecords.toLocaleString()}
          </span>
        </div>
        {item.accuracy && (
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Akurasi</span>
            <span className="text-lg font-bold text-green-600 ml-auto">
              {(item.accuracy * 100).toFixed(1)}%
            </span>
          </div>
        )}
        <div className="pt-2 border-t border-border/20">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Prediksi:{" "}
              <span className="font-medium text-foreground">
                {parsedResults.results?.length || 0}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors rounded-sm disabled:opacity-50"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
              <Link
                href={`/admin/classify/history/${item.id}`}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md bg-accent/50 hover:bg-accent/60 flex items-center justify-center h-6 w-6"
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
      <ConfirmationDialog />
    </Card>
  );
}
