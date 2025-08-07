import { ModelMetricsSelect } from "@/database/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPercentage } from "@/lib/utils";

interface ConfusionMatrixProps {
  metrics: ModelMetricsSelect;
  classes: string[];
}

function MatrixCell({
  value,
  isCorrect,
  percentage,
}: {
  value: number;
  isCorrect: boolean;
  percentage: string;
}) {
  const bgColor = isCorrect
    ? "bg-green-900/30"
    : value > 0
    ? "bg-red-900/30"
    : "bg-muted";

  return (
    <TableCell className={`text-center min-w-16 ${bgColor}`}>
      <div className="text-sm font-mono font-semibold">{value}</div>
      {/* <div className="text-xs text-muted-foreground">{percentage}%</div> */}
    </TableCell>
  );
}

export function ConfusionMatrix({ metrics, classes }: ConfusionMatrixProps) {
  return (
    <>
      {!metrics.confusionMatrix || !classes ? null : (
        <Card className="w-full border border-muted">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Confusion Matrix
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Klasifikasi Aktual vs Prediksi
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Prediksi
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center h-full pt-8">
                <span className="text-sm font-medium text-muted-foreground -rotate-90 whitespace-nowrap">
                  Aktual
                </span>
              </div>

              <div className="flex-1 overflow-x-auto">
                <div className="min-w-max">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="bg-muted font-medium w-20 min-w-20"></TableHead>
                        {classes.map((className, index) => (
                          <TableHead
                            key={index}
                            className="bg-muted font-medium text-center min-w-20 max-w-24"
                          >
                            <div className="truncate" title={className}>
                              {className}
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metrics.confusionMatrix.map((row, rowIndex) => {
                        const rowTotal = row.reduce(
                          (sum: number, val: number) => sum + val,
                          0
                        );
                        return (
                          <TableRow key={rowIndex}>
                            <TableHead className="bg-muted font-medium min-w-20">
                              <div
                                className="truncate"
                                title={classes[rowIndex]}
                              >
                                {classes[rowIndex]}
                              </div>
                            </TableHead>
                            {row.map((cell: number, colIndex: number) => (
                              <MatrixCell
                                key={colIndex}
                                value={cell}
                                isCorrect={rowIndex === colIndex}
                                percentage={formatPercentage(cell / rowTotal)}
                              />
                            ))}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <div className="mt-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-900/30 border border-border"></div>
                  <span>Prediksi benar</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-900/30 border border-border"></div>
                  <span>Prediksi salah</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
