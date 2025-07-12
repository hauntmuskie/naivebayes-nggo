"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ClassificationHistorySelect } from "@/database/schema";
import { HistoryCard } from "./history-card";
import { deleteClassificationHistory } from "@/_actions";

interface HistoryGridProps {
  history: ClassificationHistorySelect[];
}

export function HistoryGrid({ history }: HistoryGridProps) {
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  const deleteItem = async (id: string) => {
    if (deletingIds.has(id)) return;
    
    setDeletingIds(prev => new Set(prev).add(id));
    try {
      await deleteClassificationHistory(id);
      toast.success("Classification deleted");
      router.refresh();
    } catch (error) {
      console.error("Error deleting classification history:", error);
      toast.error("Failed to delete classification");
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {history.map((item) => (
        <HistoryCard 
          key={item.id} 
          item={item} 
          onDelete={deleteItem}
          isDeleting={deletingIds.has(item.id)}
        />
      ))}
    </div>
  );
}
