import { fetchDatasetRecords } from "@/_actions";
import { PageHeader } from "@/components/page-header";
import { DatasetRecordsSelect } from "@/database/schema";
import { DatasetRecords } from "@/app/admin/passengers/_components/dataset-records";
import { Metadata } from "next";

export const revalidate = 300;
export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Catatan Dataset - Klasifikasi Naive Bayes",
    description:
      "Kelola catatan dataset dari file CSV yang diunggah dan klasifikasi",
    openGraph: {
      title: "Catatan Dataset - Klasifikasi Naive Bayes",
      description:
        "Kelola catatan dataset dari file CSV yang diunggah dan klasifikasi",
    },
  };
}

export default async function DatasetRecordsPage() {
  const records: DatasetRecordsSelect[] = await fetchDatasetRecords();

  const totalRecords = records.length;

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Catatan Dataset (Penumpang)"
        description="Kelola catatan dataset penumpang"
        badge={{
          text: `${totalRecords} total catatan${totalRecords !== 1 ? "" : ""}`,
          variant: totalRecords > 0 ? "success" : "secondary",
        }}
      />

      <DatasetRecords records={records} />
    </div>
  );
}
