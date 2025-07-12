import { fetchModels } from "@/_actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Target,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const dynamic = "force-dynamic";

interface SearchParams {
  print?: string;
}

export default async function ModelPerformanceReportPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const isPrintMode = params.print === "true";

  const models = await fetchModels();

  const totalModels = models.length;
  const avgAccuracy =
    models.length > 0
      ? (models.reduce((sum, model) => sum + model.accuracy, 0) /
          models.length) *
        100
      : 0;
  const bestModel =
    models.length > 0
      ? models.reduce((best, current) =>
          current.accuracy > best.accuracy ? current : best
        )
      : null;
  const worstModel =
    models.length > 0
      ? models.reduce((worst, current) =>
          current.accuracy < worst.accuracy ? current : worst
        )
      : null;

  const reportDate = format(new Date(), "dd MMMM yyyy", { locale: id });
  const reportTime = format(new Date(), "HH:mm:ss");

  if (isPrintMode) {
    return (
      <div className="min-h-screen bg-white p-8 print:p-0">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center border-b border-gray-300 pb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              LAPORAN PERFORMA MODEL NAIVE BAYES
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
              <h3 className="font-semibold text-gray-900">Total Model</h3>
              <p className="text-2xl font-bold text-blue-600">{totalModels}</p>
            </div>
            <div className="border border-gray-300 p-4">
              <h3 className="font-semibold text-gray-900">Rata-rata Akurasi</h3>
              <p className="text-2xl font-bold text-green-600">
                {avgAccuracy.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Best and Worst Models */}
          {bestModel && worstModel && (
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-300 p-4">
                <h3 className="font-semibold text-green-700">Model Terbaik</h3>
                <p className="font-medium">{bestModel.modelName}</p>
                <p className="text-sm text-gray-600">
                  Akurasi: {(bestModel.accuracy * 100).toFixed(2)}%
                </p>
              </div>
              <div className="border border-gray-300 p-4">
                <h3 className="font-semibold text-red-700">Model Terlemah</h3>
                <p className="font-medium">{worstModel.modelName}</p>
                <p className="text-sm text-gray-600">
                  Akurasi: {(worstModel.accuracy * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          )}

          {/* Models Table */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Detail Model
            </h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2 text-left">No</th>
                  <th className="border border-gray-300 p-2 text-left">
                    Nama Model
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Target
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Jumlah Fitur
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Akurasi
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Tanggal Dibuat
                  </th>
                </tr>
              </thead>
              <tbody>
                {models.map((model, index) => (
                  <tr key={model.id}>
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">
                      {model.modelName}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {model.targetColumn}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {model.featureColumns.length}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {(model.accuracy * 100).toFixed(2)}%
                    </td>
                    <td className="border border-gray-300 p-2">
                      {format(new Date(model.createdAt), "dd/MM/yyyy", {
                        locale: id,
                      })}
                    </td>
                  </tr>
                ))}
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
          <h1 className="text-2xl font-bold">Laporan Performa Model</h1>
          <p className="text-muted-foreground">
            Analisis lengkap performa semua model Naive Bayes
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <a href="/reports/model-performance?print=true" target="_blank">
              <BarChart3 className="h-4 w-4 mr-2" />
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
              <span className="text-sm font-medium">Total Model</span>
            </div>
            <div className="text-2xl font-bold mt-1">{totalModels}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Rata-rata Akurasi</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {avgAccuracy.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium">Model Terbaik</span>
            </div>
            <div className="text-lg font-bold mt-1">
              {bestModel ? (bestModel.accuracy * 100).toFixed(2) + "%" : "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Tanggal Laporan</span>
            </div>
            <div className="text-sm font-medium mt-1">{reportDate}</div>
          </CardContent>
        </Card>
      </div>

      {/* Best and Worst Models */}
      {bestModel && worstModel && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Model Terbaik
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold">{bestModel.modelName}</p>
                <p className="text-sm text-muted-foreground">
                  Target: {bestModel.targetColumn}
                </p>
                <p className="text-sm text-muted-foreground">
                  Fitur: {bestModel.featureColumns.length} kolom
                </p>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Akurasi: {(bestModel.accuracy * 100).toFixed(2)}%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-orange-700 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Model Perlu Perbaikan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold">{worstModel.modelName}</p>
                <p className="text-sm text-muted-foreground">
                  Target: {worstModel.targetColumn}
                </p>
                <p className="text-sm text-muted-foreground">
                  Fitur: {worstModel.featureColumns.length} kolom
                </p>
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800"
                >
                  Akurasi: {(worstModel.accuracy * 100).toFixed(2)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Models List */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Semua Model</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {models.map((model, index) => (
              <div key={model.id}>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{model.modelName}</h3>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Target: {model.targetColumn}</span>
                      <span>Fitur: {model.featureColumns.length}</span>
                      <span>Kelas: {model.classes.length}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Dibuat:{" "}
                      {format(new Date(model.createdAt), "dd MMMM yyyy", {
                        locale: id,
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        model.accuracy >= 0.8
                          ? "default"
                          : model.accuracy >= 0.6
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-sm"
                    >
                      {(model.accuracy * 100).toFixed(2)}%
                    </Badge>
                  </div>
                </div>
                {index < models.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
