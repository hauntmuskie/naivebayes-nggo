import { fetchModels } from "@/_actions";
import { ModelCard } from "@/components/model-card";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export const revalidate = 300;
export const dynamic = "force-static";

export async function generateMetadata() {
  return {
    title: "Katalog Model - Pengklasifikasi Naive Bayes",
    description: "Jelajahi dan kelola model pembelajaran mesin terlatih Anda",
    other: {
      "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
    },
  };
}

export default async function ModelsCatalogPage() {
  const models = await fetchModels();
  const hasModels = models.length > 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Katalog Model"
        description="Jelajahi dan kelola model Naive Bayes terlatih Anda"
        badge={{
          text: `${models.length} model${
            models.length !== 1 ? "" : ""
          } tersedia`,
          variant: models.length > 0 ? "default" : "secondary",
        }}
      />

      {hasModels ? (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {models.map((model) => (
            <ModelCard key={model.modelName} model={model} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Tidak Ada Model di Katalog"
          description="Katalog model Anda kosong. Latih model Naive Bayes pertama Anda untuk memulai."
          action={{
            label: "Latih Model Baru",
            href: "/models",
          }}
        />
      )}
    </div>
  );
}
