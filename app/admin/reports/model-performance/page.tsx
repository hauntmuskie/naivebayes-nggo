"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReportLayout } from "../_components/report-layout";
import { fetchModels } from "@/_actions";

export default function ModelPerformanceReportPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const models = await fetchModels();
        const mapped = models.map((m: any) => {
          const metric =
            Array.isArray(m.metrics) && m.metrics.length > 0
              ? m.metrics[0]
              : null;
          return {
            id: m.id,
            name: m.modelName,
            trainedAt: m.createdAt
              ? new Date(m.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "-",
            accuracy: metric ? metric.accuracy : m.accuracy,
            precision: metric ? metric.precision : 0,
            recall: metric ? metric.recall : 0,
            f1: metric ? metric.f1Score : 0,
          };
        });
        setData(mapped);
      } catch (e) {
        setData([]);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-lg text-white">Tunggu Sebentar...</span>
        </div>
      </div>
    );
  }

  const avgAccuracy =
    data.length > 0
      ? (data.reduce((sum, m) => sum + (m.accuracy || 0), 0) / data.length) *
        100
      : 0;

  return (
    <ReportLayout
      title="LAPORAN PERFORMA MODEL NAIVE BAYES"
      onBack={() => router.back()}
    >
      <div className="bg-white text-black p-4">
        <div className="mb-4">
          <p className="font-semibold">
            Akurasi rata-rata: {avgAccuracy.toFixed(2)}%
          </p>
          <p>Total Model: {data.length}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-black text-center">No</th>
                <th className="border border-black text-center">Nama Model</th>
                <th className="border border-black text-center">
                  Tanggal Pelatihan
                </th>
                <th className="border border-black text-center">Akurasi</th>
                <th className="border border-black text-center">Precision</th>
                <th className="border border-black text-center">Recall</th>
                <th className="border border-black text-center">F1-Score</th>
                {/* <th className="border border-black text-center">Confusion Matrix</th> */}
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={item.id} className="hover:bg-transparent">
                  <td className="border border-black text-center">{idx + 1}</td>
                  <td className="border border-black text-center">
                    {item.name}
                  </td>
                  <td className="border border-black text-center">
                    {item.trainedAt}
                  </td>
                  <td className="border border-black text-center">
                    {(item.accuracy * 100).toFixed(2)}%
                  </td>
                  <td className="border border-black text-center">
                    {(item.precision * 100).toFixed(2)}%
                  </td>
                  <td className="border border-black text-center">
                    {(item.recall * 100).toFixed(2)}%
                  </td>
                  <td className="border border-black text-center">
                    {(item.f1 * 100).toFixed(2)}%
                  </td>
                  {/* <td className="border border-black text-center"><ConfusionMatrix matrix={item.confusionMatrix} /></td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ReportLayout>
  );
}
