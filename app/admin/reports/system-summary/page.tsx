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
import { fetchModels, fetchClassifications } from "@/_actions";

interface SystemMetric {
  metric: string;
  value: string | number;
}

export default function SystemSummaryReportPage() {
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
          <span className="text-lg text-gray-600">Tunggu Sebentar...</span>
        </div>
      </div>
    );
  }

  return (
    <ReportLayout title="LAPORAN RINGKASAN SISTEM KLASIFIKASI">
      <div className="mb-4">
        <p className="font-semibold">Statistik Sistem:</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-orange-600 *:text-white">
              <TableHead className="border border-black text-center">
                No
              </TableHead>
              <TableHead className="border border-black text-center">
                Metrik
              </TableHead>
              <TableHead className="border border-black text-center">
                Nilai
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow key={item.metric} className="hover:bg-transparent">
                <TableCell className="border border-black text-center">
                  {idx + 1}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.metric}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ReportLayout>
  );
}
