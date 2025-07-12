import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModelCard } from "@/components/model-card";
import { PageHeader } from "@/components/page-header";
import { checkHealth, fetchModels } from "../../../_actions";
import { Metadata } from "next";

export const revalidate = 300;

export const dynamic = "force-dynamic";

export const experimental_ppr = true;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Dasbor - Pengklasifikasi Naive Bayes",
    description:
      "Gambaran umum model pembelajaran mesin dan metrik kinerja Anda",
    other: {
      "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
    },
  };
}

export default async function DashboardPage() {
  const [healthStatus, models] = await Promise.all([
    checkHealth(),
    fetchModels(),
  ]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-3">
      <PageHeader
        title="Dasbor"
        description="Gambaran umum model pembelajaran mesin dan metrik kinerja Anda"
        badge={{
          text:
            healthStatus.status === "online"
              ? "Sistem Online"
              : "Sistem Offline",
          variant: healthStatus.status === "online" ? "default" : "destructive",
        }}
      />
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {" "}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base">Total Model</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold">{models.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base">
              Akurasi Terbaik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold">
              {models.length > 0
                ? `${(Math.max(...models.map((m) => m.accuracy)) * 100).toFixed(
                    2
                  )}%`
                : "N/A"}
            </p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base">
              Kelas Tersedia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold">
              {models.length > 0
                ? new Set(models.flatMap((m) => m.classes)).size
                : "0"}
            </p>
          </CardContent>
        </Card>
      </div>{" "}
      <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8">
        Model Terbaru
      </h2>
      {models.length > 0 ? (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {models.slice(0, 3).map((model) => (
            <ModelCard key={model.modelName} model={model} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-6 sm:py-8 text-center">
            <p className="text-sm sm:text-base text-muted-foreground">
              Tidak ada model tersedia. Mulai dengan melatih model baru.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
