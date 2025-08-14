"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReportLayout } from "../_components/report-layout";
import { fetchModels } from "@/_actions";

export default function ModelPerformanceReportPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [classNames, setClassNames] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const models = await fetchModels();
        let detectedClassNames: string[] = [];
        const mapped = models.map((m: any) => {
          const metric =
            Array.isArray(m.metrics) && m.metrics.length > 0
              ? m.metrics[0]
              : null;

          // Extract class-specific metrics
          let classMetrics: Record<string, any> = {};
          if (metric && metric.classMetrics) {
            const classEntries = Object.entries(metric.classMetrics).filter(
              ([key]) =>
                !["accuracy", "macro avg", "weighted avg"].includes(key)
            );
            classEntries.forEach(([className, data]) => {
              classMetrics[className] = data;
            });
            // Collect class names for table header
            if (classEntries.length > 0) {
              detectedClassNames = Array.from(
                new Set([
                  ...detectedClassNames,
                  ...classEntries.map(([className]) => className),
                ])
              );
            }
          }

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
            classMetrics,
          };
        });
        setData(mapped);
        setClassNames(detectedClassNames);
      } catch (e) {
        setData([]);
        setClassNames([]);
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
            Akurasi rata-rata: {avgAccuracy.toFixed()}%
          </p>
          <p>Total Model: {data.length}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-black text-center" rowSpan={2}>
                  No
                </th>
                <th className="border border-black text-center" rowSpan={2}>
                  Nama Model
                </th>
                <th className="border border-black text-center" rowSpan={2}>
                  Akurasi
                </th>
                <th
                  className="border border-black text-center"
                  colSpan={classNames.length}
                >
                  Precision
                </th>
                <th
                  className="border border-black text-center"
                  colSpan={classNames.length}
                >
                  Recall
                </th>
                <th
                  className="border border-black text-center"
                  colSpan={classNames.length}
                >
                  F1-Score
                </th>
                <th
                  className="border border-black text-center"
                  colSpan={classNames.length}
                >
                  Support
                </th>
                <th className="border border-black text-center" rowSpan={2}>
                  Tanggal Pelatihan
                </th>
                {/* <th className="border border-black text-center" rowSpan={2}>Confusion Matrix</th> */}
              </tr>
              <tr>
                {["Precision", "Recall", "F1-Score", "Support"].flatMap(
                  (metric) =>
                    classNames.map((className) => (
                      <th
                        key={metric + "-" + className}
                        className="border border-black text-center"
                      >
                        {className}
                      </th>
                    ))
                )}
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
                    {(item.accuracy * 100).toFixed()}%
                  </td>
                  {/* Precision cells */}
                  {classNames.map((className) => (
                    <td
                      key={item.id + "-precision-" + className}
                      className="border border-black text-center"
                    >
                      {item.classMetrics[className]?.precision !== undefined
                        ? Math.round(
                            item.classMetrics[className].precision * 100
                          ) + "%"
                        : "-"}
                    </td>
                  ))}
                  {/* Recall cells */}
                  {classNames.map((className) => (
                    <td
                      key={item.id + "-recall-" + className}
                      className="border border-black text-center"
                    >
                      {item.classMetrics[className]?.recall !== undefined
                        ? Math.round(
                            item.classMetrics[className].recall * 100
                          ) + "%"
                        : "-"}
                    </td>
                  ))}
                  {/* F1-Score cells */}
                  {classNames.map((className) => (
                    <td
                      key={item.id + "-f1-" + className}
                      className="border border-black text-center"
                    >
                      {item.classMetrics[className]?.["f1-score"] !== undefined
                        ? Math.round(
                            item.classMetrics[className]["f1-score"] * 100
                          ) + "%"
                        : "-"}
                    </td>
                  ))}
                  {/* Support cells */}
                  {classNames.map((className) => (
                    <td
                      key={item.id + "-support-" + className}
                      className="border border-black text-center"
                    >
                      {item.classMetrics[className]?.support !== undefined
                        ? item.classMetrics[className].support
                        : "-"}
                    </td>
                  ))}
                  <td className="border border-black text-center">
                    {item.trainedAt}
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
