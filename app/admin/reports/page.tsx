import {
  fetchModels,
  fetchClassifications,
  fetchDatasetRecords,
} from "@/_actions";
import { PageHeader } from "@/components/page-header";
import { ReportCard } from "@/app/admin/reports/_components/report-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  BarChart3,
  Database,
  TrendingUp,
  Download,
  Calendar,
  Activity,
  Users,
} from "lucide-react";
import { Metadata } from "next";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const revalidate = 300;
export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Laporan - Pengklasifikasi Naive Bayes",
    description:
      "Buat dan lihat laporan komprehensif untuk model pembelajaran mesin dan klasifikasi Anda",
    openGraph: {
      title: "Laporan - Pengklasifikasi Naive Bayes",
      description:
        "Buat dan lihat laporan komprehensif untuk model pembelajaran mesin dan klasifikasi Anda",
    },
  };
}

export default async function ReportsPage() {
  const [models, classifications, datasetRecords] = await Promise.all([
    fetchModels(),
    fetchClassifications(),
    fetchDatasetRecords(),
  ]);

  const totalModels = models.length;
  const totalClassifications = classifications.length;
  const totalDatasetRecords = datasetRecords.length;
  const avgAccuracy =
    models.length > 0
      ? (
          (models.reduce((sum, model) => sum + model.accuracy, 0) /
            models.length) *
          100
        ).toFixed(2)
      : "0";

  const recentClassifications = classifications.filter(
    (c) =>
      new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  const highConfidenceClassifications = classifications.filter(
    (c) => c.confidence > 0.8
  ).length;

  const currentDate = format(new Date(), "dd MMMM yyyy", { locale: id });

  const reports = [
    {
      id: "model-performance",
      title: "Laporan Performa Model Naive Bayes",
      description:
        "Analisis lengkap performa semua model Naive Bayes untuk klasifikasi kepuasan penumpang termasuk akurasi, precision, recall, dan F1-score",
      icon: BarChart3,
      color: "blue" as const,
      stats: `${totalModels} model terlatih`,
      href: "/reports/model-performance",
      features: [
        "Metrics Performa",
        "Confusion Matrix",
        "Analisis Akurasi",
        "Perbandingan Model",
      ],
    },
    {
      id: "classification-results",
      title: "Laporan Hasil Klasifikasi Kepuasan",
      description:
        "Ringkasan komprehensif hasil klasifikasi kepuasan penumpang dengan distribusi prediksi dan tingkat confidence",
      icon: TrendingUp,
      color: "green" as const,
      stats: `${totalClassifications} prediksi`,
      href: "/reports/classification-results",
      features: [
        "Distribusi Kelas",
        "Confidence Analysis",
        "Hasil per Model",
        "Tren Prediksi",
      ],
    },
    {
      id: "dataset-analysis",
      title: "Laporan Analisis Dataset Penumpang",
      description:
        "Analisis mendalam dataset penumpang yang digunakan untuk training dan testing model klasifikasi kepuasan",
      icon: Database,
      color: "purple" as const,
      stats: `${totalDatasetRecords} record`,
      href: "/reports/dataset-analysis",
      features: [
        "Distribusi Data",
        "Feature Analysis",
        "Data Quality",
        "Pattern Recognition",
      ],
    },
    {
      id: "system-summary",
      title: "Laporan Ringkasan Sistem Klasifikasi",
      description:
        "Overview menyeluruh sistem klasifikasi Naive Bayes termasuk penggunaan, performa keseluruhan, dan statistik operasional",
      icon: FileText,
      color: "orange" as const,
      stats: `Akurasi rata-rata: ${avgAccuracy}%`,
      href: "/reports/system-summary",
      features: [
        "Statistik Keseluruhan",
        "Usage Analytics",
        "Performance Trends",
        "System Health",
      ],
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Sistem Pelaporan Klasifikasi Kepuasan Penumpang"
        description="Generate dan kelola laporan komprehensif untuk sistem klasifikasi Naive Bayes analisis kepuasan penumpang"
        badge={{
          text: `${reports.length} jenis laporan tersedia`,
          variant: "success",
        }}
      />

      {/* Report Generation Info */}
      <Card className="border-2 border-dashed border-border/60 bg-muted/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Informasi Laporan</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Laporan dibuat berdasarkan data terkini per {currentDate}. Semua
                laporan dapat di-export dalam format PDF untuk keperluan
                dokumentasi dan presentasi.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="gap-1">
                  <Activity className="h-3 w-3" />
                  Data Real-time
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Users className="h-3 w-3" />
                  Analisis Kepuasan Penumpang
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <BarChart3 className="h-3 w-3" />
                  Machine Learning Insights
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/40 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Model Naive Bayes
                </span>
                <div className="text-2xl font-bold text-blue-600">
                  {totalModels}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Total Klasifikasi
                </span>
                <div className="text-2xl font-bold text-green-600">
                  {totalClassifications}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 border border-purple-200 rounded-lg">
                <Database className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Dataset Records
                </span>
                <div className="text-2xl font-bold text-purple-600">
                  {totalDatasetRecords}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 border border-orange-200 rounded-lg">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Akurasi Rata-rata
                </span>
                <div className="text-2xl font-bold text-orange-600">
                  {avgAccuracy}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Aktivitas Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Klasifikasi 7 hari terakhir
                </span>
                <Badge variant="secondary">{recentClassifications}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  High Confidence ({">"}80%)
                </span>
                <Badge variant="secondary">
                  {highConfidenceClassifications}
                </Badge>
              </div>
              <Separator />
              <div className="text-xs text-muted-foreground">
                Update terakhir: {currentDate}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Kualitas Sistem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Status Model
                </span>
                <Badge variant={totalModels > 0 ? "default" : "destructive"}>
                  {totalModels > 0 ? "Aktif" : "Tidak Ada"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Kualitas Prediksi
                </span>
                <Badge
                  variant={
                    parseFloat(avgAccuracy) > 70 ? "default" : "secondary"
                  }
                >
                  {parseFloat(avgAccuracy) > 70 ? "Baik" : "Perlu Improvement"}
                </Badge>
              </div>
              <Separator />
              <div className="text-xs text-muted-foreground">
                Threshold: Akurasi {">"}70% untuk kualitas baik
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>

      {/* Enhanced Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Aksi Cepat Cetak Laporan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Unduh laporan dalam format PDF untuk keperluan dokumentasi,
              presentasi, atau arsip sistem.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button variant="outline" asChild className="justify-start">
                <a href="/reports/model-performance?print=true" target="_blank">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Cetak Laporan Performa Model
                </a>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <a
                  href="/reports/classification-results?print=true"
                  target="_blank"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Cetak Laporan Hasil Klasifikasi
                </a>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <a href="/reports/dataset-analysis?print=true" target="_blank">
                  <Database className="h-4 w-4 mr-2" />
                  Cetak Laporan Analisis Dataset
                </a>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <a href="/reports/system-summary?print=true" target="_blank">
                  <FileText className="h-4 w-4 mr-2" />
                  Cetak Ringkasan Sistem
                </a>
              </Button>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>
                Tip: Klik tombol di atas untuk membuka laporan dalam tab baru
              </span>
              <Badge variant="outline">PDF Ready</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
