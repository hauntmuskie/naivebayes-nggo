"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReportLayout } from "../_components/report-layout";
import { fetchClassificationHistory } from "@/_actions";

interface AirlineCounts {
  [key: string]: number;
}

interface ClassificationData {
  id: string;
  fileName: string;
  modelName: string;
  totalRecords: number;
  accuracy: number | null;
  date: string;
  airlineCounts: AirlineCounts;
}

export default function ClassificationResultsReportPage() {
  const router = useRouter();
  const [data, setData] = useState<ClassificationData[]>([]);
  const [allAirlines, setAllAirlines] = useState<AirlineCounts>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const classificationHistory = await fetchClassificationHistory();
        const mapped = classificationHistory.map((c: any) => {
          let airlineCounts: AirlineCounts = {};
          try {
            const results = JSON.parse(c.results);
            if (results && results.results && Array.isArray(results.results)) {
              results.results.forEach((result: any) => {
                try {
                  const dataString = result.data;
                  if (dataString) {
                    const dataObj = JSON.parse(dataString);
                    const airline = dataObj.Maskapai || "Unknown";
                    airlineCounts[airline] = (airlineCounts[airline] || 0) + 1;
                  }
                } catch (dataError) {
                  console.error("Error parsing data field:", dataError);
                  airlineCounts["Unknown"] =
                    (airlineCounts["Unknown"] || 0) + 1;
                }
              });
            }
          } catch (e) {
            console.error("Error parsing results:", e);
          }

          return {
            id: c.id,
            fileName: c.fileName || "Unknown",
            modelName: c.modelName || "Unknown",
            totalRecords: c.totalRecords || 0,
            accuracy: c.accuracy,
            date: c.createdAt
              ? new Date(c.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "-",
            airlineCounts,
          };
        });
        setData(mapped);

        const totalAirlineCounts: AirlineCounts = {};
        mapped.forEach((item) => {
          Object.entries(item.airlineCounts).forEach(([airline, count]) => {
            totalAirlineCounts[airline] =
              (totalAirlineCounts[airline] || 0) + count;
          });
        });
        setAllAirlines(totalAirlineCounts);
      } catch (e) {
        setData([]);
        setAllAirlines({});
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

  return (
    <ReportLayout
      title="LAPORAN HASIL KLASIFIKASI"
      onBack={() => router.back()}
    >
      <div className="bg-white text-black p-4">
        <div className="mb-4">
          <p className="text-gray-600 mb-4">
            Laporan hasil klasifikasi dengan distribusi maskapai per hasil
            klasifikasi:
          </p>
        </div>

        {data.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Belum ada hasil klasifikasi</p>
            <p className="text-gray-400 text-sm">
              Lakukan klasifikasi terlebih dahulu untuk melihat laporan
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-black text-center p-2">No</th>
                  <th className="border border-black text-center p-2">
                    Nama File
                  </th>
                  <th className="border border-black text-center p-2">Model</th>
                  <th className="border border-black text-center p-2">
                    Total Record
                  </th>
                  <th className="border border-black text-center p-2">
                    Akurasi
                  </th>
                  <th className="border border-black text-center p-2">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => {
                  const airlines = Object.entries(item.airlineCounts)
                    .filter(([name, count]) => name && count > 0)
                    .map(
                      ([name, count]) =>
                        `${name}${count > 1 ? ` (${count})` : ""}`
                    )
                    .join(", ");
                  const airlinesSummary = airlines ? (
                    <>
                      Maskapai:{" "}
                      <span className="font-semibold">{airlines}</span>, total:{" "}
                      <span className="font-bold">
                        {Object.values(item.airlineCounts).reduce(
                          (a, b) => a + b,
                          0
                        )}
                      </span>
                    </>
                  ) : (
                    "-"
                  );
                  return (
                    <React.Fragment key={item.id}>
                      <tr>
                        <td className="border border-black text-center p-2">
                          {idx + 1}
                        </td>
                        <td className="border border-black text-center p-2">
                          {item.fileName}
                        </td>
                        <td className="border border-black text-center p-2">
                          {item.modelName}
                        </td>
                        <td className="border border-black text-center p-2">
                          {(item.totalRecords || 0).toLocaleString()}
                        </td>
                        <td className="border border-black text-center p-2">
                          {item.accuracy
                            ? `${(item.accuracy * 100).toFixed(1)}%`
                            : "-"}
                        </td>
                        <td className="border border-black text-center p-2">
                          {item.date}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={6}
                          className="border border-black bg-gray-50 text-center p-2 text-sm text-gray-700 italic"
                        >
                          {airlinesSummary}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Airlines Distribution Section */}
        {Object.keys(allAirlines).length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Distribusi Maskapai dari Semua Hasil Klasifikasi
            </h3>
            <ul className="space-y-2">
              {Object.entries(allAirlines)
                .sort(([, a], [, b]) => b - a)
                .map(([airline, count], idx) => (
                  <li
                    key={airline}
                    className="flex items-center gap-2 text-base text-gray-800"
                  >
                    <span className="text-gray-500 font-mono">#{idx + 1}</span>
                    <span className="font-semibold">{airline}</span>
                    <span className="text-blue-700 font-bold">
                      {count.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">records</span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </ReportLayout>
  );
}
