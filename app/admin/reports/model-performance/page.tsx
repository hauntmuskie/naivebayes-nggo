import { fetchModels } from "@/_actions";
import { ReportLayout } from "@/app/admin/reports/_components/report-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Target, TrendingUp, CheckCircle } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 300;
export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Laporan Performa Model - Pengklasifikasi Naive Bayes",
    description:
      "Laporan analisis performa model Naive Bayes untuk klasifikasi kepuasan penumpang",
  };
}

export default async function ModelPerformancePage() {
  const models = await fetchModels();

  const avgAccuracy =
    models.length > 0
      ? (models.reduce((sum, model) => sum + model.accuracy, 0) /
          models.length) *
        100
      : 0;

  const topPerformingModel = models.reduce(
    (best, current) => (current.accuracy > best.accuracy ? current : best),
    models[0] || { accuracy: 0, modelName: "N/A" }
  );

  const modelsByPerformance = models.sort((a, b) => b.accuracy - a.accuracy);

  return (
    <ReportLayout
      title="LAPORAN PERFORMA MODEL NAIVE BAYES"
      subtitle="Analisis Komprehensif Performa Model Klasifikasi Kepuasan Penumpang"
    >
      {/* Performance Overview */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          IKHTISAR PERFORMA
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
                    Total Model
                  </div>
                  <div className="text-2xl font-bold text-blue-800">
                    {models.length}
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
                    Akurasi Rata-rata
                  </div>
                  <div className="text-2xl font-bold text-emerald-800">
                    {avgAccuracy.toFixed(2)}%
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
                    Model Terbaik
                  </div>
                  <div className="text-xl font-bold text-violet-800">
                    {(topPerformingModel.accuracy * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-amber-700 font-medium">
                    Model Aktif
                  </div>
                  <div className="text-2xl font-bold text-amber-800">
                    {models.filter((m) => m.accuracy > 0.7).length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Detailed Model Performance */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          DETAIL PERFORMA MODEL
        </h2>
        <div className="space-y-4">
          {modelsByPerformance.map((model, index) => (
            <Card
              key={model.id}
              className={`border shadow-md ${
                index === 0
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-emerald-200"
                  : model.accuracy > 0.8
                  ? "bg-gradient-to-r from-blue-50 to-blue-50 border-blue-200"
                  : model.accuracy > 0.7
                  ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-amber-200"
                  : "bg-gradient-to-r from-red-50 to-rose-50 border-rose-200"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle
                      className={`text-lg ${
                        index === 0
                          ? "text-emerald-800"
                          : model.accuracy > 0.8
                          ? "text-blue-800"
                          : model.accuracy > 0.7
                          ? "text-amber-800"
                          : "text-rose-800"
                      }`}
                    >
                      {model.modelName}
                    </CardTitle>
                    <p
                      className={`text-sm mt-1 ${
                        index === 0
                          ? "text-emerald-600"
                          : model.accuracy > 0.8
                          ? "text-blue-600"
                          : model.accuracy > 0.7
                          ? "text-amber-600"
                          : "text-rose-600"
                      }`}
                    >
                      Dibuat pada:{" "}
                      {new Date(model.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant={index === 0 ? "default" : "secondary"}
                      className={index === 0 ? "bg-emerald-500 text-white" : ""}
                    >
                      {index === 0 ? "Terbaik" : `Peringkat ${index + 1}`}
                    </Badge>
                    <Badge
                      variant={
                        model.accuracy > 0.8
                          ? "default"
                          : model.accuracy > 0.7
                          ? "secondary"
                          : "destructive"
                      }
                      className={
                        model.accuracy > 0.8
                          ? "bg-blue-500 text-white"
                          : model.accuracy > 0.7
                          ? "bg-amber-500 text-white"
                          : "bg-rose-500 text-white"
                      }
                    >
                      {model.accuracy > 0.8
                        ? "Sangat Baik"
                        : model.accuracy > 0.7
                        ? "Baik"
                        : "Perlu Improvement"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-800">
                        Akurasi
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {(model.accuracy * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          model.accuracy >= 0.8
                            ? "bg-gradient-to-r from-green-500 to-emerald-500"
                            : model.accuracy >= 0.7
                            ? "bg-gradient-to-r from-blue-500 to-blue-600"
                            : model.accuracy >= 0.6
                            ? "bg-gradient-to-r from-yellow-500 to-amber-500"
                            : "bg-gradient-to-r from-red-500 to-rose-500"
                        }`}
                        style={{ width: `${model.accuracy * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-800 font-medium">
                        Model Accuracy
                      </div>
                      <div className="font-semibold text-gray-900">
                        {(model.accuracy * 100).toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-800 font-medium">
                        Target Column
                      </div>
                      <div className="font-semibold text-gray-900">
                        {model.targetColumn}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-800 font-medium">Classes</div>
                      <div className="font-semibold text-gray-900">
                        {model.classes.length}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-800 font-medium">Features</div>
                      <div className="font-semibold text-gray-900">
                        {model.featureColumns.length}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-800 font-medium mb-1">
                      Features yang digunakan:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {model.featureColumns
                        .slice(0, 6)
                        .map((feature: string) => (
                          <Badge
                            key={feature}
                            variant="outline"
                            className="text-xs border-gray-400 text-gray-800"
                          >
                            {feature}
                          </Badge>
                        ))}
                      {model.featureColumns.length > 6 && (
                        <Badge
                          variant="outline"
                          className="text-xs border-gray-400 text-gray-800"
                        >
                          +{model.featureColumns.length - 6} lainnya
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-800 font-medium mb-1">
                      Classes:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {model.classes.map((cls: string) => (
                        <Badge
                          key={cls}
                          variant="outline"
                          className="text-xs border-gray-400 text-gray-800"
                        >
                          {cls}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Performance Analysis */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          ANALISIS PERFORMA
        </h2>
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-gray-800">
                Kualitas Model Berdasarkan Akurasi:
              </h3>
              <ul className="space-y-1 text-sm text-gray-800">
                <li>
                  • <strong>Sangat Baik (≥80%):</strong>{" "}
                  {models.filter((m) => m.accuracy >= 0.8).length} model
                </li>
                <li>
                  • <strong>Baik (70-79%):</strong>{" "}
                  {
                    models.filter((m) => m.accuracy >= 0.7 && m.accuracy < 0.8)
                      .length
                  }{" "}
                  model
                </li>
                <li>
                  • <strong>Perlu Improvement (&lt;70%):</strong>{" "}
                  {models.filter((m) => m.accuracy < 0.7).length} model
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-gray-800">Rekomendasi:</h3>
              <ul className="space-y-1 text-sm text-gray-800">
                {avgAccuracy >= 80 && (
                  <li>
                    • Performa sistem sangat baik, pertahankan kualitas training
                    data
                  </li>
                )}
                {avgAccuracy >= 70 && avgAccuracy < 80 && (
                  <li>
                    • Performa sistem baik, dapat ditingkatkan dengan feature
                    engineering
                  </li>
                )}
                {avgAccuracy < 70 && (
                  <li>
                    • Performa sistem perlu improvement, evaluasi ulang dataset
                    dan features
                  </li>
                )}
                <li>
                  • Gunakan model &quot;{topPerformingModel.modelName}&quot;
                  untuk prediksi optimal
                </li>
                <li>• Lakukan retraining berkala untuk menjaga akurasi</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-gray-800">KESIMPULAN</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-gray-700 leading-relaxed">
            Sistem klasifikasi Naive Bayes menunjukkan performa yang{" "}
            {avgAccuracy >= 80
              ? "sangat baik"
              : avgAccuracy >= 70
              ? "baik"
              : "memerlukan improvement"}
            dengan rata-rata akurasi {avgAccuracy.toFixed(2)}%. Model &quot;
            {topPerformingModel.modelName}&quot; menjadi model terbaik dengan
            akurasi {(topPerformingModel.accuracy * 100).toFixed(2)}%. Untuk
            optimalisasi lebih lanjut, disarankan untuk melakukan feature
            selection yang lebih baik dan pengumpulan data training yang lebih
            beragam.
          </p>
        </div>
      </section>
    </ReportLayout>
  );
}
