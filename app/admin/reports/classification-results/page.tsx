import { fetchClassifications, fetchModels } from "@/_actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Target, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ClassificationsSelect } from "@/database/schema";

export const dynamic = "force-dynamic";

interface SearchParams {
  print?: string;
}

export default async function ClassificationResultsReportPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const isPrintMode = params.print === "true";

  const [classifications, models] = await Promise.all([
    fetchClassifications(),
    fetchModels(),
  ]);

  const totalClassifications = classifications.length;
  const avgConfidence =
    classifications.length > 0
      ? (classifications.reduce(
          (sum: number, cls: ClassificationsSelect) => sum + cls.confidence,
          0
        ) /
          classifications.length) *
        100
      : 0;

  const highConfidenceCount = classifications.filter(
    (cls: ClassificationsSelect) => cls.confidence >= 0.8
  ).length;
  const lowConfidenceCount = classifications.filter(
    (cls: ClassificationsSelect) => cls.confidence < 0.5
  ).length;

  const classificationsByModel = classifications.reduce(
    (
      acc: Record<string, ClassificationsSelect[]>,
      cls: ClassificationsSelect
    ) => {
      const model = models.find((m: { id: string }) => m.id === cls.modelId);
      const modelName = model?.modelName || "Unknown Model";
      if (!acc[modelName]) {
        acc[modelName] = [];
      }
      acc[modelName].push(cls);
      return acc;
    },
    {} as Record<string, ClassificationsSelect[]>
  );

  const reportDate = format(new Date(), "dd MMMM yyyy", { locale: id });
  const reportTime = format(new Date(), "HH:mm:ss");

  if (isPrintMode) {
    return (
      <div className="min-h-screen bg-white p-8 print:p-0">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center border-b border-gray-300 pb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              LAPORAN HASIL KLASIFIKASI
            </h1>
            <p className="text-gray-600 mt-2">
              Sistem Klasifikasi Kepuasan Penumpang
            </p>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <span>Tanggal: {reportDate}</span>
              <span>Waktu: {reportTime}</span>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-300 p-4">
              <h3 className="font-semibold text-gray-900">Total Klasifikasi</h3>
              <p className="text-2xl font-bold text-blue-600">
                {totalClassifications}
              </p>
            </div>
            <div className="border border-gray-300 p-4">
              <h3 className="font-semibold text-gray-900">
                Rata-rata Confidence
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {avgConfidence.toFixed(2)}%
              </p>
            </div>
            <div className="border border-gray-300 p-4">
              <h3 className="font-semibold text-gray-900">High Confidence</h3>
              <p className="text-2xl font-bold text-emerald-600">
                {highConfidenceCount}
              </p>
            </div>
            <div className="border border-gray-300 p-4">
              <h3 className="font-semibold text-gray-900">Low Confidence</h3>
              <p className="text-2xl font-bold text-orange-600">
                {lowConfidenceCount}
              </p>
            </div>
          </div>

          {/* Classification by Model */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Klasifikasi per Model
            </h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2 text-left">
                    Model
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Total Klasifikasi
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Avg Confidence
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    High Confidence
                  </th>
                </tr>
              </thead>
              <tbody>
                {" "}
                {Object.entries(classificationsByModel).map(
                  ([modelName, modelClassifications]) => {
                    const avgConf =
                      (modelClassifications.reduce(
                        (sum: number, cls: ClassificationsSelect) =>
                          sum + cls.confidence,
                        0
                      ) /
                        modelClassifications.length) *
                      100;
                    const highConf = modelClassifications.filter(
                      (cls: ClassificationsSelect) => cls.confidence >= 0.8
                    ).length;

                    return (
                      <tr key={modelName}>
                        <td className="border border-gray-300 p-2">
                          {modelName}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {modelClassifications.length}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {avgConf.toFixed(2)}%
                        </td>
                        <td className="border border-gray-300 p-2">
                          {highConf}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>

          {/* Recent Classifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Klasifikasi Terbaru (10 Terakhir)
            </h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2 text-left">No</th>
                  <th className="border border-gray-300 p-2 text-left">
                    Model
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Hasil Prediksi
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Confidence
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody>
                {" "}
                {classifications
                  .slice(0, 10)
                  .map(
                    (classification: ClassificationsSelect, index: number) => {
                      const model = models.find(
                        (m: { id: string }) => m.id === classification.modelId
                      );
                      return (
                        <tr key={classification.id}>
                          <td className="border border-gray-300 p-2">
                            {index + 1}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {model?.modelName || "Unknown"}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {classification.predictedClass}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {(classification.confidence * 100).toFixed(2)}%
                          </td>
                          <td className="border border-gray-300 p-2">
                            {format(
                              new Date(classification.createdAt),
                              "dd/MM/yyyy HH:mm",
                              { locale: id }
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 border-t border-gray-300 pt-4">
            <p>
              Laporan ini dibuat secara otomatis oleh Sistem Klasifikasi Naive
              Bayes
            </p>
            <p>© 2025 - Naive Bayes Classifier System</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Laporan Hasil Klasifikasi</h1>
          <p className="text-muted-foreground">
            Ringkasan hasil klasifikasi dan prediksi yang telah dilakukan
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <a
              href="/admin/reports/classification-results?print=true"
              target="_blank"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Cetak Laporan
            </a>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total Klasifikasi</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {totalClassifications}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Avg Confidence</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {avgConfidence.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium">High Confidence</span>
            </div>
            <div className="text-2xl font-bold mt-1">{highConfidenceCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Low Confidence</span>
            </div>
            <div className="text-2xl font-bold mt-1">{lowConfidenceCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Classification by Model */}
      <Card>
        <CardHeader>
          <CardTitle>Klasifikasi per Model</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {" "}
            {Object.entries(classificationsByModel).map(
              ([modelName, modelClassifications], index) => {
                const avgConfidence =
                  (modelClassifications.reduce(
                    (sum: number, cls: ClassificationsSelect) =>
                      sum + cls.confidence,
                    0
                  ) /
                    modelClassifications.length) *
                  100;
                const highConfidenceCount = modelClassifications.filter(
                  (cls: ClassificationsSelect) => cls.confidence >= 0.8
                ).length;

                return (
                  <div key={modelName}>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{modelName}</h3>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Total: {modelClassifications.length}</span>
                          <span>High Confidence: {highConfidenceCount}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            avgConfidence >= 80
                              ? "default"
                              : avgConfidence >= 60
                              ? "secondary"
                              : "destructive"
                          }
                          className="text-sm"
                        >
                          Avg: {avgConfidence.toFixed(2)}%
                        </Badge>
                      </div>
                    </div>
                    {index <
                      Object.entries(classificationsByModel).length - 1 && (
                      <Separator />
                    )}
                  </div>
                );
              }
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Classifications */}
      <Card>
        <CardHeader>
          <CardTitle>Klasifikasi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {classifications
              .slice(0, 10)
              .map((classification: ClassificationsSelect, index: number) => {
                const model = models.find(
                  (m: { id: string }) => m.id === classification.modelId
                );
                return (
                  <div
                    key={classification.id}
                    className="flex items-center justify-between p-3 rounded-lg border-l-4 border-l-blue-500 bg-gray-50"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          #{index + 1}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {model?.modelName || "Unknown Model"}
                        </span>
                      </div>
                      <p className="font-medium">
                        {classification.predictedClass}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(
                          new Date(classification.createdAt),
                          "dd MMMM yyyy, HH:mm",
                          { locale: id }
                        )}
                      </p>
                    </div>
                    <Badge
                      variant={
                        classification.confidence >= 0.8
                          ? "default"
                          : classification.confidence >= 0.6
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {(classification.confidence * 100).toFixed(1)}%
                    </Badge>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
