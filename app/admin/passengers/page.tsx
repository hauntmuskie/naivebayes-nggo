import { fetchDatasetRecords } from "@/_actions";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { DatasetRecordsSelect } from "@/database/schema";
import { DatasetRecords } from "@/app/admin/passengers/_components/dataset-records";
import { Metadata } from "next";
import { Database, FileText, Tag } from "lucide-react";

export const revalidate = 300;
export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Catatan Dataset - Pengklasifikasi Naive Bayes",
    description:
      "Kelola catatan dataset dari file CSV yang diunggah dan klasifikasi",
    openGraph: {
      title: "Catatan Dataset - Pengklasifikasi Naive Bayes",
      description:
        "Kelola catatan dataset dari file CSV yang diunggah dan klasifikasi",
    },
  };
}

export default async function DatasetRecordsPage() {
  const records: DatasetRecordsSelect[] = await fetchDatasetRecords();

  const uniqueDatasetTypes = [
    ...new Set(records.map((r) => r.datasetType).filter(Boolean)),
  ];
  const uniqueFileNames = [
    ...new Set(records.map((r) => r.fileName).filter(Boolean)),
  ];

  const totalRecords = records.length;
  const uniqueDatasets = uniqueDatasetTypes.length;
  const uniqueFiles = uniqueFileNames.length;

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Catatan Dataset"
        description="Kelola catatan dataset dari file CSV yang diunggah dan klasifikasi"
        badge={{
          text: `${totalRecords} total catatan${totalRecords !== 1 ? "" : ""}`,
          variant: totalRecords > 0 ? "success" : "secondary",
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {" "}
        <Card className="border border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total Catatan</span>
            </div>
            <div className="text-2xl font-bold mt-1">{totalRecords}</div>
          </CardContent>
        </Card>
        <Card className="border border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Jenis Dataset</span>
            </div>
            <div className="text-2xl font-bold mt-1">{uniqueDatasets}</div>
          </CardContent>
        </Card>
        <Card className="border border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">File Unik</span>
            </div>
            <div className="text-2xl font-bold mt-1">{uniqueFiles}</div>
          </CardContent>
        </Card>
      </div>

      <DatasetRecords records={records} />
    </div>
  );
}
