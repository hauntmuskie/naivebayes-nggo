"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface HistoryActionsProps {
  hasHistory: boolean;
}

export function HistoryActions({ hasHistory }: HistoryActionsProps) {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const refreshHistory = async () => {
    setRefreshing(true);
    try {
      router.refresh();
      toast.success("History refreshed successfully");
    } catch (error) {
      console.error("Error refreshing history:", error);
      toast.error("Failed to refresh history");
    } finally {
      setRefreshing(false);
    }
  };

  if (!hasHistory) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={refreshHistory}
      disabled={refreshing}
      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
    >
      <RefreshCw
        className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
      />
      Refresh
    </Button>
  );
}
