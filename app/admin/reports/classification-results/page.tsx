import { fetchClassifications, fetchModels } from "@/_actions";
import { ReportLayout } from "@/app/admin/reports/_components/report-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Users, BarChart3 } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 300;
export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Laporan Hasil Klasifikasi - Pengklasifikasi Naive Bayes",
    description:
      "Laporan analisis hasil klasifikasi kepuasan penumpang menggunakan model Naive Bayes",
  };
}

export default async function ClassificationResultsPage() {
  const [classifications, models] = await Promise.all([
    fetchClassifications(),
    fetchModels(),
  ]);

  // Analysis calculations
  const totalClassifications = classifications.length;
  const avgConfidence =
    classifications.length > 0
      ? (classifications.reduce((sum, c) => sum + c.confidence, 0) /
          classifications.length) *
        100
      : 0;

  const satisfiedCount = classifications.filter(
    (c) => c.predictedClass === "satisfied"
  ).length;
  const dissatisfiedCount = classifications.filter(
    (c) => c.predictedClass === "dissatisfied"
  ).length;
  const neutralCount = classifications.filter(
    (c) => c.predictedClass === "neutral"
  ).length;

  const highConfidenceCount = classifications.filter(
    (c) => c.confidence > 0.8
  ).length;
  const mediumConfidenceCount = classifications.filter(
    (c) => c.confidence >= 0.6 && c.confidence <= 0.8
  ).length;
  const lowConfidenceCount = classifications.filter(
    (c) => c.confidence < 0.6
  ).length;

  const recentClassifications = classifications.filter(
    (c) =>
      new Date(c.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;

  // Model usage analysis
  const modelUsage = models
    .map((model) => ({
      name: model.modelName,
      usage: classifications.filter((c) => c.modelId === model.id).length,
      avgConfidence:
        classifications
          .filter((c) => c.modelId === model.id)
          .reduce((sum, c, _, arr) => sum + c.confidence / arr.length, 0) * 100,
    }))
    .sort((a, b) => b.usage - a.usage);

  return (
    <ReportLayout
      title="LAPORAN HASIL KLASIFIKASI KEPUASAN PENUMPANG"
      subtitle="Analisis Komprehensif Hasil Prediksi Sistem Naive Bayes"
    >
      {/* Classification Overview */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          IKHTISAR KLASIFIKASI
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-blue-700 font-medium">
                    Total Klasifikasi
                  </div>
                  <div className="text-2xl font-bold text-blue-800">
                    {totalClassifications.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-emerald-700 font-medium">
                    Rata-rata Kepercayaan
                  </div>
                  <div className="text-2xl font-bold text-emerald-800">
                    {avgConfidence.toFixed(1)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-500 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-violet-700 font-medium">
                    Kepercayaan Tinggi
                  </div>
                  <div className="text-2xl font-bold text-violet-800">
                    {highConfidenceCount}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-amber-700 font-medium">
                    Bulan Ini
                  </div>
                  <div className="text-2xl font-bold text-amber-800">
                    {recentClassifications}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Classification Distribution */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          DISTRIBUSI KLASIFIKASI
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* By Satisfaction Level */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-green-800">
                Berdasarkan Tingkat Kepuasan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-2 text-green-700">
                    Puas
                  </span>
                  <span className="text-sm font-bold text-green-800">
                    {satisfiedCount} (
                    {((satisfiedCount / totalClassifications) * 100).toFixed(1)}
                    %)
                  </span>
                </div>
                <Progress
                  value={(satisfiedCount / totalClassifications) * 100}
                  className="h-3 bg-green-100"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-2 text-green-700">
                    Tidak Puas
                  </span>
                  <span className="text-sm font-bold text-green-800">
                    {dissatisfiedCount} (
                    {((dissatisfiedCount / totalClassifications) * 100).toFixed(
                      1
                    )}
                    %)
                  </span>
                </div>
                <Progress
                  value={(dissatisfiedCount / totalClassifications) * 100}
                  className="h-3 bg-red-100"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-2 text-green-700">
                    Netral
                  </span>
                  <span className="text-sm font-bold text-green-800">
                    {neutralCount} (
                    {((neutralCount / totalClassifications) * 100).toFixed(1)}%)
                  </span>
                </div>
                <Progress
                  value={(neutralCount / totalClassifications) * 100}
                  className="h-3 bg-blue-100"
                />
              </div>
            </CardContent>
          </Card>

          {/* By Confidence Level */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">
                Berdasarkan Tingkat Kepercayaan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-2 text-purple-700">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    Tinggi (&gt;80%)
                  </span>
                  <span className="text-sm font-bold text-purple-800">
                    {highConfidenceCount} (
                    {(
                      (highConfidenceCount / totalClassifications) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                </div>
                <Progress
                  value={(highConfidenceCount / totalClassifications) * 100}
                  className="h-3 bg-emerald-100"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-2 text-purple-700">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    Sedang (60-80%)
                  </span>
                  <span className="text-sm font-bold text-purple-800">
                    {mediumConfidenceCount} (
                    {(
                      (mediumConfidenceCount / totalClassifications) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                </div>
                <Progress
                  value={(mediumConfidenceCount / totalClassifications) * 100}
                  className="h-3 bg-yellow-100"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-2 text-purple-700">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Rendah (&lt;60%)
                  </span>
                  <span className="text-sm font-bold text-purple-800">
                    {lowConfidenceCount} (
                    {(
                      (lowConfidenceCount / totalClassifications) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                </div>
                <Progress
                  value={(lowConfidenceCount / totalClassifications) * 100}
                  className="h-3 bg-red-100"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Model Usage Analysis */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          ANALISIS PENGGUNAAN MODEL
        </h2>
        <div className="space-y-4">
          {modelUsage.map((model, index) => (
            <Card
              key={model.name}
              className={`border shadow-md ${
                index === 0
                  ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-amber-200"
                  : "bg-gradient-to-r from-slate-50 to-gray-50 border-gray-200"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3
                      className={`font-semibold text-lg ${
                        index === 0 ? "text-amber-800" : "text-gray-800"
                      }`}
                    >
                      {model.name}
                    </h3>
                    <p
                      className={`text-sm ${
                        index === 0 ? "text-amber-600" : "text-gray-600"
                      }`}
                    >
                      {model.usage.toLocaleString("id-ID")} prediksi • Avg.
                      Confidence: {model.avgConfidence.toFixed(1)}%
                    </p>
                  </div>
                  <Badge
                    variant={index === 0 ? "default" : "secondary"}
                    className={index === 0 ? "bg-amber-500 text-white" : ""}
                  >
                    {index === 0
                      ? "Paling Digunakan"
                      : `${model.usage} prediksi`}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span
                      className={
                        index === 0 ? "text-amber-700" : "text-gray-700"
                      }
                    >
                      Penggunaan Model
                    </span>
                    <span
                      className={`font-medium ${
                        index === 0 ? "text-amber-800" : "text-gray-800"
                      }`}
                    >
                      {((model.usage / totalClassifications) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={(model.usage / totalClassifications) * 100}
                    className={`h-2 ${
                      index === 0 ? "bg-amber-100" : "bg-gray-100"
                    }`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Detailed Analysis */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          ANALISIS DETAIL
        </h2>
        <div className="bg-gray-50 border rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Kualitas Prediksi:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>
                  • <strong>High Confidence (≥80%):</strong>{" "}
                  {highConfidenceCount} prediksi (
                  {((highConfidenceCount / totalClassifications) * 100).toFixed(
                    1
                  )}
                  %)
                </li>
                <li>
                  • <strong>Medium Confidence (60-79%):</strong>{" "}
                  {mediumConfidenceCount} prediksi (
                  {(
                    (mediumConfidenceCount / totalClassifications) *
                    100
                  ).toFixed(1)}
                  %)
                </li>
                <li>
                  • <strong>Low Confidence (&lt;60%):</strong>{" "}
                  {lowConfidenceCount} prediksi (
                  {((lowConfidenceCount / totalClassifications) * 100).toFixed(
                    1
                  )}
                  %)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Distribusi Kepuasan Penumpang:
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>
                  • <strong>Penumpang Puas:</strong> {satisfiedCount} (
                  {((satisfiedCount / totalClassifications) * 100).toFixed(1)}%)
                  - Indikator layanan baik
                </li>
                <li>
                  • <strong>Penumpang Tidak Puas:</strong> {dissatisfiedCount} (
                  {((dissatisfiedCount / totalClassifications) * 100).toFixed(
                    1
                  )}
                  %) - Perlu perhatian khusus
                </li>
                <li>
                  • <strong>Penumpang Netral:</strong> {neutralCount} (
                  {((neutralCount / totalClassifications) * 100).toFixed(1)}%) -
                  Potensi peningkatan layanan
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Rekomendasi Berdasarkan Hasil:
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {(satisfiedCount / totalClassifications) * 100 > 60 && (
                  <li>
                    • Tingkat kepuasan penumpang tergolong baik, pertahankan
                    kualitas layanan
                  </li>
                )}
                {(dissatisfiedCount / totalClassifications) * 100 > 30 && (
                  <li>
                    • Persentase ketidakpuasan tinggi, evaluasi aspek layanan
                    yang bermasalah
                  </li>
                )}
                {(highConfidenceCount / totalClassifications) * 100 > 70 && (
                  <li>
                    • Tingkat confidence prediksi tinggi, model bekerja dengan
                    baik
                  </li>
                )}
                {(lowConfidenceCount / totalClassifications) * 100 > 20 && (
                  <li>
                    • Terdapat prediksi dengan confidence rendah, pertimbangkan
                    retraining model
                  </li>
                )}
                <li>
                  • Lakukan monitoring berkala untuk tren kepuasan penumpang
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-gray-800">KESIMPULAN</h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-gray-700 leading-relaxed">
            Berdasarkan {totalClassifications.toLocaleString("id-ID")} prediksi
            yang telah dilakukan,
            {(satisfiedCount / totalClassifications) * 100 > 50
              ? `mayoritas penumpang (${(
                  (satisfiedCount / totalClassifications) *
                  100
                ).toFixed(1)}%) merasa puas dengan layanan`
              : `tingkat kepuasan penumpang masih perlu ditingkatkan dengan ${(
                  (satisfiedCount / totalClassifications) *
                  100
                ).toFixed(1)}% penumpang puas`}
            . Sistem prediksi menunjukkan performa yang{" "}
            {avgConfidence > 80
              ? "sangat baik"
              : avgConfidence > 70
              ? "baik"
              : "memerlukan improvement"}
            dengan rata-rata confidence {avgConfidence.toFixed(1)}%. Disarankan
            untuk terus memantau tren kepuasan dan melakukan tindakan perbaikan
            layanan berdasarkan area yang mendapat feedback negatif.
          </p>
        </div>
      </section>
    </ReportLayout>
  );
}
