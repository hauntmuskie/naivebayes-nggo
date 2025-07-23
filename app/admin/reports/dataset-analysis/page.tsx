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
    const missing = values.length - nonNull.length;
   
    const numericVals = nonNull.map(Number).filter((v) => !isNaN(v));
    const isNumeric =
      numericVals.length === nonNull.length && nonNull.length > 0;
    let min, max, mean, topCategories;
    if (isNumeric) {
      min = Math.min(...numericVals);
      max = Math.max(...numericVals);
      mean = numericVals.reduce((a, b) => a + b, 0) / numericVals.length;
    } else {
      topCategories = unique.slice(0, 5);
    }
    return {
      name: col,
      type: isNumeric ? "Numerik" : "Kategorikal",
      missing,
      unique: unique.length,
      min,
      max,
      mean: mean ? Number(mean.toFixed(2)) : undefined,
      topCategories,
    };
  });
  return features;
}

export default function DatasetAnalysisReportPage() {
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
          <span className="text-lg text-gray-600">Tunggu Sebentar...</span>
        </div>
      </div>
    );
  }

  return (
    <ReportLayout title="LAPORAN ANALISIS DATASET PENUMPANG">
      <div className="mb-4">
        <p className="font-semibold">Total Fitur: {data.length}</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-purple-600 *:text-white">
              <TableHead className="border border-black text-center">
                No
              </TableHead>
              <TableHead className="border border-black text-center">
                Nama Fitur
              </TableHead>
              <TableHead className="border border-black text-center">
                Tipe
              </TableHead>
              <TableHead className="border border-black text-center">
                Missing
              </TableHead>
              <TableHead className="border border-black text-center">
                Unique
              </TableHead>
              <TableHead className="border border-black text-center">
                Min
              </TableHead>
              <TableHead className="border border-black text-center">
                Max
              </TableHead>
              <TableHead className="border border-black text-center">
                Mean
              </TableHead>
              <TableHead className="border border-black text-center">
                Top Kategori
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow key={item.name} className="hover:bg-transparent">
                <TableCell className="border border-black text-center">
                  {idx + 1}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.name}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.type}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.missing}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.unique}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.min ?? "-"}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.max ?? "-"}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.mean ?? "-"}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {item.topCategories ? item.topCategories.join(", ") : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ReportLayout>
  );
}
