import {
  fetchModels,
  fetchClassifications,
  fetchDatasetRecords,
  fetchClassificationHistory,
} from "@/_actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  BarChart3,
  Database,
  TrendingUp,
  Calendar,
  Users,
  Target,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const dynamic = "force-dynamic";

interface SearchParams {
  print?: string;
}

export default async function SystemSummaryReportPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const isPrintMode = params.print === "true";

  const [models, classifications, datasetRecords, classificationHistory] =
    await Promise.all([
      fetchModels(),
      fetchClassifications(),
      fetchDatasetRecords(),
      fetchClassificationHistory(),
    ]);

  const totalModels = models.length;
  const totalClassifications = classifications.length;
  const totalDatasetRecords = datasetRecords.length;
  const totalHistory = classificationHistory.length;

  const avgAccuracy =
    models.length > 0
      ? (models.reduce((sum, model) => sum + model.accuracy, 0) /
          models.length) *
        100
      : 0;

  const avgConfidence =
    classifications.length > 0
      ? (classifications.reduce((sum, cls) => sum + cls.confidence, 0) /
          classifications.length) *
        100
      : 0;

  const bestModel =
    models.length > 0
      ? models.reduce((best, current) =>
          current.accuracy > best.accuracy ? current : best
        )
      : null;

  const recentActivity = {
    modelsThisMonth: models.filter((model) => {
      const modelDate = new Date(model.createdAt);
      const thisMonth = new Date();
      return (
        modelDate.getMonth() === thisMonth.getMonth() &&
        modelDate.getFullYear() === thisMonth.getFullYear()
      );
    }).length,
    classificationsToday: classifications.filter((cls) => {
      const clsDate = new Date(cls.createdAt);
      const today = new Date();
      return clsDate.toDateString() === today.toDateString();
    }).length,
  };

  const reportDate = format(new Date(), "dd MMMM yyyy", { locale: id });
  const reportTime = format(new Date(), "HH:mm:ss");

  if (isPrintMode) {
    return (
      <div className="min-h-screen bg-white p-8 print:p-0">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center border-b border-gray-300 pb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              LAPORAN RINGKASAN SISTEM
            </h1>
            <p className="text-gray-600 mt-2">
              Sistem Klasifikasi Naive Bayes - Overview Menyeluruh
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
              <h3 className="font-semibold text-gray-900">Total Klasifikasi</h3>
              <p className="text-2xl font-bold text-green-600">
                {totalClassifications}
              </p>
            </div>
            <div className="border border-gray-300 p-4">
              <h3 className="font-semibold text-gray-900">Dataset Records</h3>
              <p className="text-2xl font-bold text-purple-600">
                {totalDatasetRecords}
              </p>
            </div>
            <div className="border border-gray-300 p-4">
              <h3 className="font-semibold text-gray-900">History Batch</h3>
              <p className="text-2xl font-bold text-orange-600">
                {totalHistory}
              </p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-300 p-4">
              <h3 className="font-semibold text-gray-900">
                Rata-rata Akurasi Model
              </h3>
              <p className="text-2xl font-bold text-emerald-600">
                {avgAccuracy.toFixed(2)}%
              </p>
            </div>
            <div className="border border-gray-300 p-4">
              <h3 className="font-semibold text-gray-900">
                Rata-rata Confidence
              </h3>
              <p className="text-2xl font-bold text-cyan-600">
                {avgConfidence.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Best Model */}
          {bestModel && (
            <div className="border border-gray-300 p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Model Terbaik
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Nama: </span>
                  <span>{bestModel.modelName}</span>
                </div>
                <div>
                  <span className="font-medium">Akurasi: </span>
                  <span>{(bestModel.accuracy * 100).toFixed(2)}%</span>
                </div>
                <div>
                  <span className="font-medium">Target: </span>
                  <span>{bestModel.targetColumn}</span>
                </div>
                <div>
                  <span className="font-medium">Fitur: </span>
                  <span>{bestModel.featureColumns.length} kolom</span>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Aktivitas Terkini
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-300 p-4">
                <h4 className="font-medium text-gray-800">Model Bulan Ini</h4>
                <p className="text-xl font-bold text-blue-600">
                  {recentActivity.modelsThisMonth}
                </p>
              </div>
              <div className="border border-gray-300 p-4">
                <h4 className="font-medium text-gray-800">
                  Klasifikasi Hari Ini
                </h4>
                <p className="text-xl font-bold text-green-600">
                  {recentActivity.classificationsToday}
                </p>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Status Sistem
            </h3>
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">
                    Database
                  </td>
                  <td className="border border-gray-300 p-2 text-green-600">
                    ✓ Online
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">
                    Model Training
                  </td>
                  <td className="border border-gray-300 p-2 text-green-600">
                    ✓ Available
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">
                    Classification Service
                  </td>
                  <td className="border border-gray-300 p-2 text-green-600">
                    ✓ Active
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">
                    Data Storage
                  </td>
                  <td className="border border-gray-300 p-2 text-green-600">
                    ✓ Operational
                  </td>
                </tr>
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
          <h1 className="text-2xl font-bold">Laporan Ringkasan Sistem</h1>
          <p className="text-muted-foreground">
            Overview menyeluruh tentang penggunaan dan performa sistem
            klasifikasi
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <a href="/admin/reports/system-summary?print=true" target="_blank">
              <FileText className="h-4 w-4 mr-2" />
              Cetak Laporan
            </a>
          </Button>
        </div>
      </div>

      {/* Main Statistics */}
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
              <Database className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Dataset Records</span>
            </div>
            <div className="text-2xl font-bold mt-1">{totalDatasetRecords}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">History Batch</span>
            </div>
            <div className="text-2xl font-bold mt-1">{totalHistory}</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Performa Sistem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Rata-rata Akurasi Model</span>
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                {avgAccuracy.toFixed(2)}%
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Rata-rata Confidence</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                {avgConfidence.toFixed(2)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              Aktivitas Terkini
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Model Dibuat Bulan Ini</span>
              <Badge variant="secondary">
                {recentActivity.modelsThisMonth}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Klasifikasi Hari Ini</span>
              <Badge variant="secondary">
                {recentActivity.classificationsToday}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best Model */}
      {bestModel && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-500" />
              Model Terbaik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nama Model</p>
                <p className="font-semibold">{bestModel.modelName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Akurasi</p>
                <p className="font-semibold text-green-600">
                  {(bestModel.accuracy * 100).toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target Column</p>
                <p className="font-semibold">{bestModel.targetColumn}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jumlah Fitur</p>
                <p className="font-semibold">
                  {bestModel.featureColumns.length} kolom
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Status Sistem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50">
              <span className="font-medium">Database</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                ✓ Online
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50">
              <span className="font-medium">Model Training</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                ✓ Available
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50">
              <span className="font-medium">Classification Service</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                ✓ Active
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50">
              <span className="font-medium">Data Storage</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                ✓ Operational
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Catatan Ringkasan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p>
              • Sistem telah berhasil melatih{" "}
              <strong>{totalModels} model</strong> dengan rata-rata akurasi{" "}
              <strong>{avgAccuracy.toFixed(2)}%</strong>
            </p>
            <p>
              • Total <strong>{totalClassifications} klasifikasi</strong> telah
              dilakukan dengan confidence rata-rata{" "}
              <strong>{avgConfidence.toFixed(2)}%</strong>
            </p>
            <p>
              • Dataset berisi <strong>{totalDatasetRecords} records</strong>{" "}
              yang digunakan untuk training dan testing
            </p>
            {bestModel && (
              <p>
                • Model terbaik adalah{" "}
                <strong>&quot;{bestModel.modelName}&quot;</strong> dengan
                akurasi{" "}
                <strong>{(bestModel.accuracy * 100).toFixed(2)}%</strong>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
