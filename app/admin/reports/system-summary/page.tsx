"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReportLayout } from "../_components/report-layout";
import { fetchModels, fetchClassifications } from "@/_actions";

interface SystemMetric {
  metric: string;
  value: string | number;
}

export default function SystemSummaryReportPage() {
  const router = useRouter();
  const [data, setData] = useState<SystemMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [models, classifications] = await Promise.all([
          fetchModels(),
          fetchClassifications(),
        ]);
        const totalModels = models.length;
        const totalClassifications = classifications.length;
        const avgAccuracy =
          models.length > 0
            ? (
                (models.reduce(
                  (sum: number, m: any) =>
                    sum +
                    (m.accuracy || (m.metrics && m.metrics[0]?.accuracy) || 0),
                  0
                ) /
                  models.length) *
                100
              ).toFixed(2) + "%"
            : "-";
        const lastTrained =
          models.length > 0
            ? models.reduce((latest: string, m: any) => {
                const date = m.createdAt ? new Date(m.createdAt) : null;
                if (!date) return latest;
                return !latest || date > new Date(latest)
                  ? date.toISOString().slice(0, 10)
                  : latest;
              }, "")
            : "-";
        setData([
          { metric: "Total Model", value: totalModels },
          { metric: "Total Klasifikasi", value: totalClassifications },
          { metric: "Akurasi Rata-rata", value: avgAccuracy },
          { metric: "Tanggal Training Terakhir", value: lastTrained },
          { metric: "System Uptime", value: "N/A" },
        ]);
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
          <div className="w-6 h-6 border-2 border-gray-300 border-t-orange-600 rounded-full animate-spin"></div>
          <span className="text-lg text-white">Tunggu Sebentar...</span>
        </div>
      </div>
    );
  }

  return (
    <ReportLayout
      title="LAPORAN RINGKASAN SISTEM KLASIFIKASI"
      onBack={() => router.back()}
    >
      <div className="bg-white text-black p-4">
        <div className="mb-4">
          <p className="font-semibold">Statistik Sistem:</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-black text-center">No</th>
                <th className="border border-black text-center">Metrik</th>
                <th className="border border-black text-center">Nilai</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={item.metric} className="hover:bg-transparent">
                  <td className="border border-black text-center">{idx + 1}</td>
                  <td className="border border-black text-center">
                    {item.metric}
                  </td>
                  <td className="border border-black text-center">
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ReportLayout>
  );
}
