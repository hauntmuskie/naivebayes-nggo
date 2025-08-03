import {
  fetchModels,
  fetchClassifications,
  fetchDatasetRecords,
} from "@/_actions";

import { PageHeader } from "@/components/page-header";
import { ReportCard } from "@/app/admin/reports/_components/report-card";
import { Card, CardContent } from "@/components/ui/card";

import { FileText, BarChart3, Database, TrendingUp } from "lucide-react";
import { Metadata } from "next";

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

  const reports = [
    {
      id: "model-performance",
      title: "Laporan Performa Model Naive Bayes",
      description:
        "Analisis lengkap performa semua model Naive Bayes untuk klasifikasi kepuasan penumpang termasuk akurasi, precision, recall, dan F1-score",
      icon: BarChart3,
      color: "blue" as const,
      stats: `${totalModels} model terlatih`,
      href: "/admin/reports/model-performance",
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
      href: "/admin/reports/classification-results",
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
      href: "/admin/reports/dataset-analysis",
      features: [
        "Distribusi Data",
        "Feature Analysis",
        "Data Quality",
        "Pattern Recognition",
      ],
    },
    {
      id: "passenger-data",
      title: "Laporan Data Penumpang",
      description:
        "Laporan komprehensif mengenai data penumpang yang digunakan dalam sistem klasifikasi, termasuk statistik dan analisis",
      icon: FileText,
      color: "orange" as const,
      stats: `Akurasi rata-rata: ${avgAccuracy}%`,
      href: "/admin/reports/passenger-data",
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
        description="Lelola laporan untuk sistem klasifikasi Naive Bayes"
        badge={{
          text: `${reports.length} jenis laporan tersedia`,
          variant: "success",
        }}
      />

      {/* Reports Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
