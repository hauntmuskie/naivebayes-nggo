import { fetchDatasetRecords } from "@/_actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Database, FileText, BarChart3, Tag } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DatasetRecordsSelect } from "@/database/schema";

export const dynamic = "force-dynamic";

interface SearchParams {
  print?: string;
}

export default async function DatasetAnalysisReportPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const isPrintMode = params.print === "true";

  const datasetRecords = await fetchDatasetRecords();

  const totalRecords = datasetRecords.length;
  const uniqueDatasetTypes = [
    ...new Set(
      datasetRecords
        .map((r: DatasetRecordsSelect) => r.datasetType)
        .filter(Boolean)
    ),
  ];
  const uniqueFileNames = [
    ...new Set(
      datasetRecords
        .map((r: DatasetRecordsSelect) => r.fileName)
        .filter(Boolean)
    ),
  ];

  // Group by dataset type
  const recordsByType = datasetRecords.reduce(
    (
      acc: Record<string, DatasetRecordsSelect[]>,
      record: DatasetRecordsSelect
    ) => {
      const type = record.datasetType || "unknown";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(record);
      return acc;
    },
    {} as Record<string, DatasetRecordsSelect[]>
  );

  // Group by file name
  const recordsByFile = datasetRecords.reduce(
    (
      acc: Record<string, DatasetRecordsSelect[]>,
      record: DatasetRecordsSelect
    ) => {
      const fileName = record.fileName || "unknown";
      if (!acc[fileName]) {
        acc[fileName] = [];
      }
      acc[fileName].push(record);
      return acc;
    },
    {} as Record<string, DatasetRecordsSelect[]>
  );

  const reportDate = format(new Date(), "dd MMMM yyyy", { locale: id });
  const reportTime = format(new Date(), "HH:mm:ss");

  if (isPrintMode) {
    return (
      <div className="min-h-screen bg-white p-8 print:p-0">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center border-b border-gray-300 pb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              LAPORAN ANALISIS DATASET
            </h1>
            <p className="text-gray-600 mt-2">
              Sistem Klasifikasi Kepuasan Penumpang
            </p>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <span>Tanggal: {reportDate}</span>
              <span>Waktu: {reportTime}</span>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-300 p-4">
              <h3 className="font-semibold text-gray-900">Total Records</h3>
              <p className="text-2xl font-bold text-blue-600">{totalRecords}</p>
            </div>
            <div className="border border-gray-300 p-4">
              <h3 className="font-semibold text-gray-900">Jenis Dataset</h3>
              <p className="text-2xl font-bold text-green-600">
                {uniqueDatasetTypes.length}
              </p>
            </div>
            <div className="border border-gray-300 p-4">
              <h3 className="font-semibold text-gray-900">File Berbeda</h3>
              <p className="text-2xl font-bold text-purple-600">
                {uniqueFileNames.length}
              </p>
            </div>
            <div className="border border-gray-300 p-4">
              <h3 className="font-semibold text-gray-900">Kolom per Record</h3>
              <p className="text-2xl font-bold text-orange-600">
                {datasetRecords.length > 0
                  ? datasetRecords[0].columns?.length || 0
                  : 0}
              </p>
            </div>
          </div>

          {/* Records by Type */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Distribusi per Jenis Dataset
            </h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2 text-left">
                    Jenis Dataset
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Jumlah Records
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Persentase
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(recordsByType).map(([type, records]) => (
                  <tr key={type}>
                    <td className="border border-gray-300 p-2 capitalize">
                      {type}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {records.length}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {((records.length / totalRecords) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Records by File */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Distribusi per File
            </h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2 text-left">
                    Nama File
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Jumlah Records
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Tanggal Upload
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(recordsByFile)
                  .slice(0, 10)
                  .map(([fileName, records]) => (
                    <tr key={fileName}>
                      <td className="border border-gray-300 p-2">{fileName}</td>
                      <td className="border border-gray-300 p-2">
                        {records.length}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {format(new Date(records[0].createdAt), "dd/MM/yyyy", {
                          locale: id,
                        })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 border-t border-gray-300 pt-4">
            <p>
              Laporan ini dibuat secara otomatis oleh Sistem Klasifikasi Naive
              Bayes
            </p>
            <p>© 2025 - Naive Bayes Classifier System</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Laporan Analisis Dataset</h1>
          <p className="text-muted-foreground">
            Analisis komprehensif dari dataset yang digunakan untuk training dan
            testing
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <a href="/admin/reports/dataset-analysis?print=true" target="_blank">
              <Database className="h-4 w-4 mr-2" />
              Cetak Laporan
            </a>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total Records</span>
            </div>
            <div className="text-2xl font-bold mt-1">{totalRecords}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Jenis Dataset</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {uniqueDatasetTypes.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">File Berbeda</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {uniqueFileNames.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Kolom per Record</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {datasetRecords.length > 0
                ? datasetRecords[0].columns?.length || 0
                : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dataset Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribusi per Jenis Dataset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(recordsByType).map(([type, records], index) => (
              <div key={type}>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-1">
                    <h3 className="font-semibold capitalize">{type}</h3>
                    <p className="text-sm text-muted-foreground">
                      {records.length} records (
                      {((records.length / totalRecords) * 100).toFixed(1)}%)
                    </p>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {records.length}
                  </Badge>
                </div>
                {index < Object.entries(recordsByType).length - 1 && (
                  <Separator />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Files Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribusi per File</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(recordsByFile)
              .slice(0, 10)
              .map(([fileName, records]) => (
                <div
                  key={fileName}
                  className="flex items-center justify-between p-3 rounded-lg border-l-4 border-l-purple-500 bg-gray-50"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{fileName}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Records: {records.length}</span>
                      <span>
                        Upload:{" "}
                        {format(
                          new Date(records[0].createdAt),
                          "dd MMMM yyyy",
                          { locale: id }
                        )}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary">{records.length}</Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Sample Data Preview */}
      {datasetRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview Sample Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {datasetRecords
                .slice(0, 5)
                .map((record: DatasetRecordsSelect, index: number) => (
                  <div
                    key={record.id}
                    className="p-3 rounded-lg border bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium">
                        Record #{index + 1}
                      </span>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {record.datasetType}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {record.fileName}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Kolom: {record.columns?.join(", ") || "N/A"}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
