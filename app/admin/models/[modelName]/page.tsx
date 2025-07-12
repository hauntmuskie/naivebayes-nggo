import { fetchModels } from "@/_actions";
import { MetricsCard } from "@/components/metrics-card";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const revalidate = 600;
export const dynamic = "force-static";

export async function generateStaticParams() {
  const models = await fetchModels();
  return models.map((model) => ({
    modelName: encodeURIComponent(model.modelName),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ modelName: string }>;
}) {
  const modelName = decodeURIComponent((await params).modelName);
  return {
    title: `${modelName} - Detail Model`,
    description: `Metrik kinerja dan detail untuk model ${modelName}`,
    other: {
      "Cache-Control": "public, max-age=600, stale-while-revalidate=1200",
    },
  };
}

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ modelName: string }>;
}) {
  const modelName = decodeURIComponent((await params).modelName);
  const models = await fetchModels();
  const model = models.find((m) => m.modelName === modelName);

  if (!model) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          asChild
        >
          <Link href="/admin/models/catalog">
            <ChevronLeft size={18} />
          </Link>
        </Button>
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
            {model.modelName}
          </h1>
          <Button className="ml-auto" asChild>
            <Link
              href={`/admin/classify?model=${encodeURIComponent(
                model.modelName
              )}`}
            >
              Klasifikasi Data
            </Link>
          </Button>
        </div>
      </div>

      {model.metrics && model.metrics.length > 0 && (
        <MetricsCard
          metrics={model.metrics[0]}
          title="Kinerja Model"
          model={model}
        />
      )}
    </div>
  );
}
