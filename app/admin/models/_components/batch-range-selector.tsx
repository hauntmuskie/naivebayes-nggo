"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rows } from "lucide-react";

interface BatchRangeSelectorProps {
  totalRows: number;
  startRow: number;
  endRow: number;
  onStartRowChange: (value: number) => void;
  onEndRowChange: (value: number) => void;
  disabled?: boolean;
}

export function BatchRangeSelector({
  totalRows,
  startRow,
  endRow,
  onStartRowChange,
  onEndRowChange,
  disabled = false,
}: BatchRangeSelectorProps) {
  startRow <= endRow && startRow >= 1 && endRow <= totalRows;

  const handleStartRowChange = (value: string) => {
    const num = parseInt(value) || 1;
    const clampedValue = Math.max(1, Math.min(num, totalRows));
    onStartRowChange(clampedValue);
  };

  const handleEndRowChange = (value: string) => {
    const num = parseInt(value) || totalRows;
    const clampedValue = Math.max(1, Math.min(num, totalRows));
    onEndRowChange(clampedValue);
  };

  if (totalRows === 0) {
    return null;
  }

  return (
    <Card className="border border-border">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Rows className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Rentang Data Pelatihan</Label>
          <Badge variant="secondary" className="text-xs">
            {totalRows} baris tersedia
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label
              htmlFor="start-row"
              className="text-xs text-muted-foreground"
            >
              Baris Mulai
            </Label>
            <Input
              id="start-row"
              type="number"
              min={1}
              max={totalRows}
              value={startRow}
              onChange={(e) => handleStartRowChange(e.target.value)}
              disabled={disabled}
              className="text-sm"
              placeholder="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-row" className="text-xs text-muted-foreground">
              Baris Akhir
            </Label>
            <Input
              id="end-row"
              type="number"
              min={1}
              max={totalRows}
              value={endRow}
              onChange={(e) => handleEndRowChange(e.target.value)}
              disabled={disabled}
              className="text-sm"
              placeholder={totalRows.toString()}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
