"use client";

import { useEffect, useState } from "react";
import { ReportLayout } from "../_components/report-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchClassifications, fetchModels } from "@/_actions";

export default function ClassificationResultsReportPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Fetch classifications and models for model name lookup
        const [classifications, models] = await Promise.all([
          fetchClassifications(),
          fetchModels(),
        ]);
        // Map modelId to modelName
        const modelMap = Object.fromEntries(
          models.map((m: any) => [m.id, m.modelName])
        );
        const mapped = classifications.map((c: any) => ({
          id: c.id,
          model: modelMap[c.modelId] || c.modelId,
          predictedClass: c.predictedClass,
          confidence: c.confidence,
          date: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-",
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
          <span className="text-lg text-gray-600">Tunggu Sebentar...</span>
        </div>
      </div>
    );
  }

  const classDist = data.reduce((acc, cur) => {
    acc[cur.predictedClass] = (acc[cur.predictedClass] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <ReportLayout title="LAPORAN HASIL KLASIFIKASI KEPUASAN PENUMPANG">
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
        <Table>
          <TableHeader>
            <TableRow className="bg-green-600 *:text-white">
              <TableHead className="border border-black text-center">
                No
              </TableHead>
              <TableHead className="border border-black text-center">
                Model
              </TableHead>
              <TableHead className="border border-black text-center">
                Prediksi Kelas
              </TableHead>
              <TableHead className="border border-black text-center">
                Confidence
              </TableHead>
              <TableHead className="border border-black text-center">
                Tanggal
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow key={item.id} className="hover:bg-transparent">
                <TableCell className="border border-black text-center">
                  {idx + 1}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.model}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.predictedClass}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {(item.confidence * 100).toFixed(2)}%
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ReportLayout>
  );
}
