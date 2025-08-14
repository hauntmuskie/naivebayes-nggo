"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ResultsListProps {
  results: any[];
}

export function ResultsList({ results }: ResultsListProps) {
  const [showAll, setShowAll] = useState(false);
  const displayResults = showAll ? results : results.slice(0, 10);

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {displayResults.map((result: any, index: number) => {
        let airlineName = "";
        try {
          const parsedData = result.data ? JSON.parse(result.data) : {};
          airlineName = parsedData["Maskapai"] || "";
        } catch {}
        return (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-muted-foreground">
                #{index + 1}
                {airlineName ? ` - ${airlineName}` : ""}
              </span>
              <Badge
                variant={
                  result.actualClass === result.predictedClass
                    ? "default"
                    : "destructive"
                }
              >
                {result.predictedClass}
              </Badge>
            </div>
            <div className="text-sm font-medium">
              {(result.confidence * 100).toFixed()}%
            </div>
          </div>
        );
      })}
      {results.length > 10 && !showAll && (
        <div className="text-center py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(true)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ... dan {results.length - 10} hasil lainnya (klik untuk lihat semua)
          </Button>
        </div>
      )}
      {showAll && results.length > 10 && (
        <div className="text-center py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(false)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sembunyikan hasil tambahan
          </Button>
        </div>
      )}
    </div>
  );
}
