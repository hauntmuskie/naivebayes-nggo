import { fetchModels } from "@/_actions";
import { MetricsCard } from "@/app/admin/models/_components/metrics-card";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { ChevronLeft, BrainCircuit } from "lucide-react";
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
      <div className="mb-6 flex flex-col gap-2">
        <Button variant="secondary" className="w-fit mb-3" asChild>
          <Link
            href="/admin/models"
            className="inline-flex items-center gap-2"
            aria-label="Kembali"
          >
            <ChevronLeft size={18} />
            Kembali
          </Link>
        </Button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-accent/40 px-3 py-1.5 rounded-md">
            <BrainCircuit className="h-6 w-6 text-purple-500" />
            <span className="text-base sm:text-lg font-semibold text-muted-foreground">
              Model:
            </span>
            <span className="text-base sm:text-lg font-medium tracking-tight">
              {model.modelName}
            </span>
          </div>
        </div>
      </div>

      {model.metrics && model.metrics.length > 0 && (
        <>
          <MetricsCard
            metrics={model.metrics[0]}
            title="Kinerja Model"
            model={model}
          />
        </>
      )}
    </div>
  );
}
