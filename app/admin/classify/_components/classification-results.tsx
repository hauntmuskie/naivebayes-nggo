import { ClassificationsSelect, ModelMetricsSelect } from "@/database/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricsCard } from "@/app/admin/models/_components/metrics-card";
import { ConfusionMatrix } from "@/components/confusion-matrix";
import { hasActualClasses, formatConfidence } from "@/lib/utils";
import { BarChart3, Target, CheckCircle, XCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type ClassificationResponse = {
  results: ClassificationsSelect[];
  metrics?: ModelMetricsSelect;
};

interface ClassificationResultsProps {
  results: ClassificationResponse;
  classes?: string[];
}

export function ClassificationResults({
  results,
  classes,
}: ClassificationResultsProps) {
  const showActualClass = hasActualClasses(results.results);
  const [filterClass, setFilterClass] = useState<string>("");
  const [sortBy, setSortBy] = useState<"confidence" | "id">("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  let filteredResults = results.results;
  if (filterClass) {
    filteredResults = results.results.filter(
      (result) => result.predictedClass === filterClass
    );
  }

  filteredResults = [...filteredResults].sort((a, b) => {
    let valueA, valueB;
    if (sortBy === "confidence") {
      valueA = a.confidence;
      valueB = b.confidence;
    } else {
      valueA = a.id;
      valueB = b.id;
    }

    if (sortOrder === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  return (
    <div className="space-y-6">
      {/* Metrics Section */}
      {results.metrics && (
        <div className="space-y-6">
          <MetricsCard metrics={results.metrics} title="Performa Klasifikasi" />
          {results.metrics.confusionMatrix && classes && (
            <ConfusionMatrix metrics={results.metrics} classes={classes} />
          )}
        </div>
      )}

      {/* Results Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Hasil Klasifikasi ({filteredResults.length} dari{" "}
              {results.results.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              {/* Filter by Class */}
              {classes && classes.length > 0 && (
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="px-2 py-1 text-sm border border-border rounded bg-background"
                  >
                    {" "}
                    <option value="">Semua Kelas</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <button
                        onClick={() => {
                          setSortBy("id");
                          setSortOrder(
                            sortBy === "id" && sortOrder === "asc"
                              ? "desc"
                              : "asc"
                          );
                        }}
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        ID
                        {sortBy === "id" && (
                          <span className="text-xs">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </button>
                    </TableHead>{" "}
                    <TableHead>Kelas Prediksi</TableHead>
                    {showActualClass && <TableHead>Kelas Aktual</TableHead>}
                    <TableHead>
                      <button
                        onClick={() => {
                          setSortBy("confidence");
                          setSortOrder(
                            sortBy === "confidence" && sortOrder === "asc"
                              ? "desc"
                              : "asc"
                          );
                        }}
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        Kepercayaan
                        {sortBy === "confidence" && (
                          <span className="text-xs">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result, index: number) => (
                    <TableRow key={result.id || index}>
                      <TableCell className="font-mono text-sm">
                        {result.id || index + 1}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-medium">
                          {result.predictedClass}
                        </Badge>
                      </TableCell>
                      {showActualClass && (
                        <TableCell>
                          {result.actualClass ? (
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  result.actualClass === result.predictedClass
                                    ? "success"
                                    : "error"
                                }
                                className="font-medium"
                              >
                                {result.actualClass}
                              </Badge>
                              {result.actualClass === result.predictedClass ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="font-mono text-sm">
                            {formatConfidence(result.confidence)}
                          </div>
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${result.confidence * 100}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {filteredResults.length === 0 && filterClass && (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>
                Tidak ada hasil ditemukan untuk kelas &quot;{filterClass}&quot;
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterClass("")}
                className="mt-2"
              >
                Hapus filter
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
