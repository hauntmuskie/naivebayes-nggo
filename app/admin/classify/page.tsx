import { fetchModels } from "@/_actions";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ClassifyForm } from "@/app/admin/classify/_components/classify-form";
import { ModelsWithMetrics } from "@/database/schema";

export default async function ClassifyDataPage({
  searchParams,
}: {
  searchParams: Promise<{ model?: string | string[] }>;
}) {
  const models: ModelsWithMetrics[] = await fetchModels();
  const initialModelParam = await searchParams;

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Klasifikasi Data"
        description="Unggah data Anda dan dapatkan prediksi dari model terlatih"
        badge={{
          text: `${models.length} model${
            models.length !== 1 ? "" : ""
          } tersedia`,
          variant: models.length > 0 ? "success" : "secondary",
        }}
      />

      {models.length === 0 ? (
        <EmptyState
          title="Tidak ada model tersedia"
          description="Anda perlu melatih setidaknya satu model sebelum dapat mengklasifikasi data. Mulai dengan membuat model pertama Anda."
          action={{
            label: "Latih Model Pertama Anda",
            href: "/admin/models",
          }}
        />
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <ClassifyForm
            models={models}
            initialSelectedModel={
              Array.isArray(initialModelParam.model)
                ? initialModelParam.model[0]
                : initialModelParam.model || ""
            }
          />
        </div>
      )}
    </div>
  );
}
