import {
  fetchModels,
  fetchClassifications,
  fetchDatasetRecords,
} from "@/_actions";
import { ReportLayout } from "@/app/admin/reports/_components/report-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Target,
  TrendingUp,
  Users,
  Database,
  Activity,
} from "lucide-react";
import { Metadata } from "next";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const revalidate = 300;
export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Laporan Ringkasan Sistem - Pengklasifikasi Naive Bayes",
    description:
      "Laporan komprehensif ringkasan keseluruhan sistem klasifikasi kepuasan penumpang",
  };
}

export default async function SystemSummaryPage() {
  const [models, classifications, datasetRecords] = await Promise.all([
    fetchModels(),
    fetchClassifications(),
    fetchDatasetRecords(),
  ]);

  // System statistics
  const totalModels = models.length;
  const totalClassifications = classifications.length;
  const totalDatasetRecords = datasetRecords.length;

  const avgAccuracy =
    models.length > 0
      ? (models.reduce((sum, model) => sum + model.accuracy, 0) /
          models.length) *
        100
      : 0;

  const avgConfidence =
    classifications.length > 0
      ? (classifications.reduce((sum, c) => sum + c.confidence, 0) /
          classifications.length) *
        100
      : 0;

  // Model performance analysis
  const highPerformingModels = models.filter((m) => m.accuracy > 0.8).length;
  const activeModels = models.filter((m) => m.accuracy > 0.7).length;
  const topModel = models.reduce(
    (best, current) => (current.accuracy > best.accuracy ? current : best),
    models[0] || { accuracy: 0, modelName: "N/A" }
  );

  // Classification analysis
  const satisfiedClassifications = classifications.filter(
    (c) => c.predictedClass === "satisfied"
  ).length;
  const dissatisfiedClassifications = classifications.filter(
    (c) => c.predictedClass === "dissatisfied"
  ).length;
  const neutralClassifications = classifications.filter(
    (c) => c.predictedClass === "neutral"
  ).length;

  const highConfidenceClassifications = classifications.filter(
    (c) => c.confidence > 0.8
  ).length;
  const recentClassifications = classifications.filter(
    (c) =>
      new Date(c.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;

  // Dataset analysis
  const dataQuality =
    datasetRecords.length > 0
      ? (datasetRecords.filter(
          (r) =>
            r.rawData.satisfaction &&
            r.rawData.gender &&
            r.rawData.age &&
            r.rawData.customer_type &&
            r.rawData.class &&
            r.rawData.type_of_travel &&
            r.rawData.flight_distance !== null
        ).length /
          datasetRecords.length) *
        100
      : 0;

  // System health indicators
  const systemHealth = {
    modelPerformance:
      avgAccuracy > 80
        ? "Excellent"
        : avgAccuracy > 70
        ? "Good"
        : avgAccuracy > 60
        ? "Fair"
        : "Poor",
    predictionQuality:
      avgConfidence > 80 ? "High" : avgConfidence > 70 ? "Medium" : "Low",
    dataQuality:
      dataQuality > 95
        ? "Excellent"
        : dataQuality > 90
        ? "Good"
        : dataQuality > 80
        ? "Fair"
        : "Poor",
    systemUsage:
      totalClassifications > 1000
        ? "High"
        : totalClassifications > 100
        ? "Medium"
        : "Low",
  };

  const currentDate = format(new Date(), "dd MMMM yyyy", { locale: id });

  return (
    <ReportLayout
      title="LAPORAN RINGKASAN SISTEM KLASIFIKASI"
      subtitle="Overview Komprehensif Sistem Naive Bayes untuk Analisis Kepuasan Penumpang"
    >
      {/* System Health Dashboard */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          DASHBOARD KESEHATAN SISTEM
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 border border-blue-300 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <div className="text-sm text-blue-700 font-medium">
                    Model Performance
                  </div>
                  <div className="text-lg font-bold text-blue-800">
                    {systemHealth.modelPerformance}
                  </div>
                  <div className="text-xs text-blue-600">
                    {avgAccuracy.toFixed(1)}% akurasi
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 border border-green-300 rounded-lg">
                  <Target className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <div className="text-sm text-green-700 font-medium">
                    Prediction Quality
                  </div>
                  <div className="text-lg font-bold text-green-800">
                    {systemHealth.predictionQuality}
                  </div>
                  <div className="text-xs text-green-600">
                    {avgConfidence.toFixed(1)}% confidence
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 border border-purple-300 rounded-lg">
                  <Database className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <div className="text-sm text-purple-700 font-medium">
                    Data Quality
                  </div>
                  <div className="text-lg font-bold text-purple-800">
                    {systemHealth.dataQuality}
                  </div>
                  <div className="text-xs text-purple-600">
                    {dataQuality.toFixed(1)}% complete
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 border border-orange-300 rounded-lg">
                  <Activity className="h-5 w-5 text-orange-700" />
                </div>
                <div>
                  <div className="text-sm text-orange-700 font-medium">
                    System Usage
                  </div>
                  <div className="text-lg font-bold text-orange-800">
                    {systemHealth.systemUsage}
                  </div>
                  <div className="text-xs text-orange-600">
                    {totalClassifications} prediksi
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Metrics Overview */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          METRIK UTAMA SISTEM
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-700 font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Model Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-800">Total Models</span>
                <span className="font-semibold text-blue-900">
                  {totalModels}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-800">High Performance (≥80%)</span>
                <span className="font-semibold text-blue-900">
                  {highPerformingModels}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-800">Active Models (≥70%)</span>
                <span className="font-semibold text-blue-900">
                  {activeModels}
                </span>
              </div>
              <div className="text-xs text-blue-600 pt-1">
                Best: {topModel.modelName} (
                {(topModel.accuracy * 100).toFixed(1)}%)
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-700 font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Classification Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-800">Total Predictions</span>
                <span className="font-semibold text-green-900">
                  {totalClassifications.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-800">High Confidence (≥80%)</span>
                <span className="font-semibold text-green-900">
                  {highConfidenceClassifications}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-800">This Month</span>
                <span className="font-semibold text-green-900">
                  {recentClassifications}
                </span>
              </div>
              <div className="text-xs text-green-600 pt-1">
                Avg. Confidence: {avgConfidence.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-700 font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Satisfaction Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-purple-800">Satisfied</span>
                <span className="font-semibold text-green-700">
                  {satisfiedClassifications} (
                  {(
                    (satisfiedClassifications / totalClassifications) *
                    100
                  ).toFixed(1)}
                  %)
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-800">Dissatisfied</span>
                <span className="font-semibold text-red-700">
                  {dissatisfiedClassifications} (
                  {(
                    (dissatisfiedClassifications / totalClassifications) *
                    100
                  ).toFixed(1)}
                  %)
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-800">Neutral</span>
                <span className="font-semibold text-gray-700">
                  {neutralClassifications} (
                  {(
                    (neutralClassifications / totalClassifications) *
                    100
                  ).toFixed(1)}
                  %)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-orange-700 font-semibold flex items-center gap-2">
                <Database className="h-4 w-4" />
                Dataset Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-orange-800">Total Records</span>
                <span className="font-semibold text-orange-900">
                  {totalDatasetRecords.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-orange-800">Data Quality</span>
                <span className="font-semibold text-orange-900">
                  {dataQuality.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-orange-800">Training Ready</span>
                <span className="font-semibold text-green-700">Yes</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Performance Trends */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          ANALISIS PERFORMA DAN TREN
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-800 font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-emerald-700" />
                Distribusi Performa Model
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-emerald-800">
                    Excellent (≥80%)
                  </span>
                  <span className="text-sm font-bold text-emerald-900">
                    {highPerformingModels} model
                  </span>
                </div>
                <Progress
                  value={(highPerformingModels / totalModels) * 100}
                  className="h-3 bg-green-100"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-emerald-800">
                    Good (70-79%)
                  </span>
                  <span className="text-sm font-bold text-emerald-900">
                    {activeModels - highPerformingModels} model
                  </span>
                </div>
                <Progress
                  value={
                    ((activeModels - highPerformingModels) / totalModels) * 100
                  }
                  className="h-3 bg-yellow-100"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-emerald-800">
                    Needs Improvement (&lt;70%)
                  </span>
                  <span className="text-sm font-bold text-emerald-900">
                    {totalModels - activeModels} model
                  </span>
                </div>
                <Progress
                  value={((totalModels - activeModels) / totalModels) * 100}
                  className="h-3 bg-red-100"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg text-cyan-800 font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-cyan-700" />
                Kualitas Prediksi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-cyan-800">
                    High Confidence (&gt;80%)
                  </span>
                  <span className="text-sm font-bold text-cyan-900">
                    {highConfidenceClassifications} (
                    {(
                      (highConfidenceClassifications / totalClassifications) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                </div>
                <Progress
                  value={
                    (highConfidenceClassifications / totalClassifications) * 100
                  }
                  className="h-3 bg-emerald-100"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-cyan-800">
                    Medium Confidence (60-80%)
                  </span>
                  <span className="text-sm font-bold text-cyan-900">
                    {
                      classifications.filter(
                        (c) => c.confidence >= 0.6 && c.confidence <= 0.8
                      ).length
                    }{" "}
                    (
                    {(
                      (classifications.filter(
                        (c) => c.confidence >= 0.6 && c.confidence <= 0.8
                      ).length /
                        totalClassifications) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                </div>
                <Progress
                  value={
                    (classifications.filter(
                      (c) => c.confidence >= 0.6 && c.confidence <= 0.8
                    ).length /
                      totalClassifications) *
                    100
                  }
                  className="h-3 bg-yellow-100"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-cyan-800">
                    Low Confidence (&lt;60%)
                  </span>
                  <span className="text-sm font-bold text-cyan-900">
                    {classifications.filter((c) => c.confidence < 0.6).length} (
                    {(
                      (classifications.filter((c) => c.confidence < 0.6)
                        .length /
                        totalClassifications) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                </div>
                <Progress
                  value={
                    (classifications.filter((c) => c.confidence < 0.6).length /
                      totalClassifications) *
                    100
                  }
                  className="h-3 bg-red-100"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </ReportLayout>
  );
}
