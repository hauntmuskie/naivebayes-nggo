"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReportLayout } from "../_components/report-layout";
import { fetchDatasetRecords } from "@/_actions";

interface PassengerData {
  id: string;
  recordId: string;
  fileName: string;
  datasetType: "training" | "testing" | "validation";
  rawData: Record<string, any>;
  columns: string[];
  createdAt: Date;
}

export default function SystemSummaryReportPage() {
  const router = useRouter();
  const [data, setData] = useState<PassengerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const records = await fetchDatasetRecords();
        setData(records as PassengerData[]);
      } catch (e) {
        console.error("Error loading passenger data:", e);
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
    <ReportLayout title="LAPORAN DATA PENUMPANG" onBack={() => router.back()}>
      <div className="bg-white text-black p-4">
        <div className="mb-4">
          <p className="font-semibold">Data Penumpang (Training & Testing):</p>
          <p className="text-sm mt-1">Total: {data.length} record</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-black text-center px-1 py-0.5">
                  No
                </th>
                <th className="border border-black text-center px-1 py-0.5">
                  ID Record
                </th>
                <th className="border border-black text-center px-1 py-0.5">
                  Nama File
                </th>
                <th className="border border-black text-center px-1 py-0.5">
                  Jenis Dataset
                </th>
                <th className="border border-black text-center px-1 py-0.5">
                  Tanggal Upload
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border border-black text-center px-1 py-0.5">
                    {idx + 1}
                  </td>
                  <td className="border border-black text-center px-1 py-0.5">
                    {item.recordId}
                  </td>
                  <td className="border border-black text-center px-1 py-0.5">
                    {item.fileName}
                  </td>
                  <td className="border border-black text-center px-1 py-0.5">
                    {item.datasetType === "training"
                      ? "Training"
                      : item.datasetType === "testing"
                      ? "Testing"
                      : "Validation"}
                  </td>
                  <td className="border border-black text-center px-1 py-0.5 text-xs">
                    {new Date(item.createdAt).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="border border-black text-center px-1 py-2 text-gray-500"
                  >
                    Tidak ada data penumpang
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ReportLayout>
  );
}
