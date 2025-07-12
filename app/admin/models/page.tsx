import { fetchModels } from "@/_actions";
import { TrainForm } from "@/app/admin/models/_components/train-form";
import { PageHeader } from "@/components/page-header";
import { ModelsWithMetrics } from "@/database/schema";
import { Metadata } from "next";

export const revalidate = 300;
export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Latih Model - Pengklasifikasi Naive Bayes",
    description: "Latih model pembelajaran mesin baru menggunakan dataset Anda",
    openGraph: {
      title: "Latih Model - Pengklasifikasi Naive Bayes",
      description:
        "Latih model pembelajaran mesin baru menggunakan dataset Anda",
    },
  };
}

export default async function ModelsPage() {
  const models: ModelsWithMetrics[] = await fetchModels();

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Latih Model"
        description="Buat model pembelajaran mesin baru dan kelola model yang sudah ada"
        badge={{
          text: `${models.length} model${
            models.length !== 1 ? "" : ""
          } terlatih`,
          variant: models.length > 0 ? "default" : "secondary",
        }}
      />

      <TrainForm />
    </div>
  );
}
