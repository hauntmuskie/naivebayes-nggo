"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReportLayout } from "../_components/report-layout";
import { fetchClassifications, fetchModels } from "@/_actions";

export default function ClassificationResultsReportPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [classifications, models] = await Promise.all([
          fetchClassifications(),
          fetchModels(),
        ]);
        const modelMap = Object.fromEntries(
          models.map((m: any) => [m.id, m.modelName])
        );
        const mapped = classifications.map((c: any) => ({
          id: c.id,
          model: modelMap[c.modelId] || c.modelId,
          predictedClass: c.predictedClass,
          confidence: c.confidence,
          date: c.createdAt
            ? new Date(c.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "-",
        }));
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
          <div className="w-6 h-6 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
          <span className="text-lg text-white">Tunggu Sebentar...</span>
        </div>
      </div>
    );
  }

  const classDist = data.reduce((acc, cur) => {
    acc[cur.predictedClass] = (acc[cur.predictedClass] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <ReportLayout
      title="LAPORAN HASIL KLASIFIKASI KEPUASAN PENUMPANG"
      onBack={() => router.back()}
    >
      <div className="bg-white text-black p-4">
        <div className="mb-4">
          <p className="font-semibold">Distribusi Kelas:</p>
          <ul className="list-disc ml-6">
            {Object.entries(classDist).map(([cls, count]) => (
              <li key={String(cls)}>
                {String(cls)}: {Number(count)}
              </li>
            ))}
          </ul>
          <p>Total Prediksi: {data.length}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-black text-center">No</th>
                <th className="border border-black text-center">Model</th>
                <th className="border border-black text-center">
                  Prediksi Kelas
                </th>
                <th className="border border-black text-center">
                  Tingkat Kepercayaan
                </th>
                <th className="border border-black text-center">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={item.id} className="hover:bg-transparent">
                  <td className="border border-black text-center">{idx + 1}</td>
                  <td className="border border-black text-center">
                    {item.model}
                  </td>
                  <td className="border border-black text-center">
                    {item.predictedClass}
                  </td>
                  <td className="border border-black text-center">
                    {(item.confidence * 100).toFixed(2)}%
                  </td>
                  <td className="border border-black text-center">
                    {item.date}
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
