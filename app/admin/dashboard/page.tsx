import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { ChartBarActive } from "@/components/charts/chart-bar-active";
import { ChartLineLabel } from "@/components/charts/chart-line-label";
import { ChartRadialLabel } from "@/components/charts/chart-radial-label";
import {
  checkHealth,
  fetchModels,
  fetchClassificationHistory,
  fetchDatasetRecords,
} from "@/_actions";
import { Metadata } from "next";

export const revalidate = 300;

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "PT Gapura Angkasa - Dasbor",
    description:
      "Gambaran umum model pembelajaran mesin dan metrik kinerja Anda",
    other: {
      "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
    },
  };
}

export default async function DashboardPage() {
  try {
    const [healthStatus, models, classificationHistory, datasetRecords] =
      await Promise.all([
        checkHealth(),
        fetchModels().catch(() => []),
        fetchClassificationHistory().catch(() => []),
        fetchDatasetRecords().catch(() => []),
      ]);

    return (
      <div className="space-y-6 sm:space-y-8 pb-3">
        <PageHeader
          title="Dasbor"
          description="Gambaran umum model pembelajaran mesin dan metrik kinerja Anda"
          badge={{
            text:
              healthStatus.status === "online"
                ? "API Terhubung"
                : "API Terputus",
            variant: healthStatus.status === "online" ? "success" : "error",
          }}
        />

        {/* Analytics Charts Section */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <ChartBarActive models={models || []} />
          <ChartLineLabel classificationHistory={classificationHistory || []} />
          <ChartRadialLabel datasetRecords={datasetRecords || []} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return (
      <div className="space-y-6 sm:space-y-8 pb-3">
        <PageHeader
          title="Dasbor"
          description="Gambaran umum model pembelajaran mesin dan metrik kinerja Anda"
          badge={{
            text: "Error Loading",
            variant: "error",
          }}
        />
        <Card>
          <CardContent className="py-6 sm:py-8 text-center">
            <p className="text-sm sm:text-base text-muted-foreground">
              Terjadi kesalahan saat memuat dashboard. Silakan coba lagi.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}
