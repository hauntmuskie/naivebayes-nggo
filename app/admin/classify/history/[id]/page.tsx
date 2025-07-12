import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  Target,
  TrendingUp,
  Clock,
  Database,
  BarChart3,
  CheckCircle,
  Activity,
} from "lucide-react";
import { ClassificationHistorySelect } from "@/database/schema";
import { ConfusionMatrix } from "@/components/confusion-matrix";
import { fetchClassificationById } from "@/_actions";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";

export const revalidate = 300;
export const dynamic = "force-static";

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const classification = await fetchClassificationById(id);
    if (!classification) {
      return {
        title: "Detail Klasifikasi",
        description: "Lihat hasil dan metrik klasifikasi",
      };
    }
    return {
      title: `${classification.fileName} - Detail Klasifikasi`,
      description: `Lihat hasil detail untuk klasifikasi ${classification.fileName} menggunakan ${classification.modelName}`,
      openGraph: {
        title: `${classification.fileName} - Detail Klasifikasi`,
        description: `Lihat hasil detail untuk klasifikasi ${classification.fileName} menggunakan ${classification.modelName}`,
      },
    };
  } catch {
    return {
      title: "Detail Klasifikasi",
      description: "Lihat hasil dan metrik klasifikasi",
    };
  }
}

export default async function ClassificationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let classification: ClassificationHistorySelect | null;

  try {
    const { id } = await params;
    classification = await fetchClassificationById(id);
    if (!classification) {
      notFound();
    }
  } catch (error) {
    console.error("Error fetching classification:", error);
    notFound();
  }

  const results = (() => {
    try {
      const parsed = JSON.parse(classification.results);
      return parsed.results || [];
    } catch {
      return [];
    }
  })();

  const metrics = (() => {
    try {
      const parsed = JSON.parse(classification.results);
      return parsed.metrics;
    } catch {
      return null;
    }
  })();

  const correctPredictions = results.filter(
    (r: { actualClass: string; predictedClass: string }) =>
      r.actualClass === r.predictedClass
  ).length;
  const accuracyFromResults =
    results.length > 0 ? correctPredictions / results.length : 0;
  const confidenceAvg =
    results.length > 0
      ? results.reduce(
          (sum: number, r: { confidence: number }) => sum + r.confidence,
          0
        ) / results.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/classify/history">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-purple-500" />
              {classification.fileName}
            </h1>
            <p className="text-muted-foreground">Detail Hasil Klasifikasi</p>
          </div>
        </div>
      </div>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Model Digunakan</span>
            </div>
            <div className="text-lg font-bold mt-1 truncate">
              {classification.modelName}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Total Record</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {classification.totalRecords.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Akurasi</span>
            </div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {classification.accuracy
                ? `${(classification.accuracy * 100).toFixed(1)}%`
                : `${(accuracyFromResults * 100).toFixed(1)}%`}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Diproses</span>
            </div>
            <div className="text-sm font-medium mt-1">
              {format(classification.createdAt, "MMMM d, yyyy 'at' h:mm a")}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Metrics Section */}
      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="h-full flex flex-col border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Metrik Klasifikasi
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full flex flex-col">
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex flex-col justify-center items-center h-full">
                  <div className="text-2xl font-bold text-green-600">
                    {(metrics.accuracy * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Akurasi</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex flex-col justify-center items-center h-full">
                  <div className="text-2xl font-bold text-blue-600">
                    {(metrics.precision * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Presisi</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex flex-col justify-center items-center h-full">
                  <div className="text-2xl font-bold text-purple-600">
                    {(metrics.recall * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Recall</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex flex-col justify-center items-center h-full">
                  <div className="text-2xl font-bold text-orange-600">
                    {(metrics.f1Score * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Skor F1</div>
                </div>
              </div>
            </CardContent>
          </Card>
          {metrics.confusionMatrix && (
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-500" />
                  Matriks Konfusi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ConfusionMatrix
                  metrics={metrics}
                  classes={Object.keys(metrics.classMetrics).filter(
                    (key) =>
                      !["accuracy", "macro avg", "weighted avg"].includes(key)
                  )}
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}
      {/* Results Summary */}{" "}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Ringkasan Hasil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <div className="text-2xl font-bold">{results.length}</div>
              <div className="text-sm text-muted-foreground">
                Total Prediksi
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {correctPredictions}
              </div>
              <div className="text-sm text-muted-foreground">
                Prediksi Benar
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {(confidenceAvg * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Rata-rata Keyakinan
              </div>
            </div>
          </div>

          {/* Sample Results */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Contoh Prediksi</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.slice(0, 10).map(
                (
                  result: {
                    actualClass: string;
                    predictedClass: string;
                    confidence: number;
                  },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-muted-foreground">
                        #{index + 1}
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
                      {result.actualClass && (
                        <span className="text-sm text-muted-foreground">
                          Aktual: {result.actualClass}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-medium">
                      {(result.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                )
              )}
              {results.length > 10 && (
                <div className="text-center text-sm text-muted-foreground py-2">
                  ... dan {results.length - 10} hasil lainnya
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
