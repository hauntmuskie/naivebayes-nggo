"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReportLayout } from "../_components/report-layout";
import { fetchDatasetRecords } from "@/_actions";

function analyzeFeatures(records: any[]): any[] {
  if (!records || records.length === 0) return [];
  const columns = records[0].columns || Object.keys(records[0].rawData || {});
  const features = columns.map((col: string) => {
    const values = records.map((r) => (r.rawData ? r.rawData[col] : undefined));
    const nonNull = values.filter(
      (v) => v !== undefined && v !== null && v !== ""
    );
    const unique = Array.from(new Set(nonNull));
    const numericVals = nonNull.map(Number).filter((v) => !isNaN(v));
    const isNumeric =
      numericVals.length === nonNull.length && nonNull.length > 0;
    let topCategories;
    if (!isNumeric) {
      topCategories = unique.slice(0, 5);
    }
    return {
      name: col,
      type: isNumeric ? "Numerik" : "Kategorikal",
      unique: unique.length,
      topCategories,
    };
  });
  return features;
}

export default function DatasetAnalysisReportPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const records = await fetchDatasetRecords();
        setData(analyzeFeatures(records));
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
          <div className="w-6 h-6 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
          <span className="text-lg text-white">Tunggu Sebentar...</span>
        </div>
      </div>
    );
  }

  return (
    <ReportLayout
      title="LAPORAN ANALISIS DATASET PENUMPANG"
      onBack={() => router.back()}
    >
      <div className="bg-white text-black p-4">
        <div className="mb-4">
          <p className="font-semibold">Total Fitur: {data.length}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-black text-center">No</th>
                <th className="border border-black text-center">Nama Fitur</th>
                <th className="border border-black text-center">Tipe</th>
                <th className="border border-black text-center">Keunikan</th>
                <th className="border border-black text-center">
                  Top Kategori
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={item.name} className="hover:bg-transparent">
                  <td className="border border-black text-center">{idx + 1}</td>
                  <td className="border border-black text-center">
                    {item.name}
                  </td>
                  <td className="border border-black text-center">
                    {item.type}
                  </td>
                  <td className="border border-black text-center">
                    {item.unique}
                  </td>
                  <td className="border border-black text-center">
                    {item.topCategories ? item.topCategories.join(", ") : "-"}
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
