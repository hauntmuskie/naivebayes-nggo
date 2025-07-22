import { fetchClassificationHistory } from "@/_actions";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { HistoryGrid } from "./_components/history-grid";
import { HistoryActions } from "./_components/history-actions";

export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: "Riwayat Klasifikasi - Pengklasifikasi Naive Bayes",
    description: "Lihat dan kelola hasil klasifikasi masa lalu Anda",
    other: {
      "Cache-Control": "public, max-age=60, stale-while-revalidate=120",
    },
  };
}

export default async function ClassifyHistoryPage() {
  const history = await fetchClassificationHistory();
  const hasHistory = history.length > 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Riwayat Klasifikasi"
        description="Lihat dan kelola hasil klasifikasi masa lalu Anda"
        badge={{
          text: `${history.length} klasifikasi${
            history.length !== 1 ? "" : ""
          }`,
          variant: history.length > 0 ? "success" : "secondary",
        }}
        action={<HistoryActions hasHistory={hasHistory} />}
      />

      {hasHistory ? (
        <HistoryGrid history={history} />
      ) : (
        <EmptyState
          title="Tidak ada riwayat klasifikasi"
          description="Anda belum melakukan klasifikasi apapun. Mulai klasifikasi data untuk melihat riwayat di sini."
          action={{
            label: "Mulai Klasifikasi",
            href: "/admin/classify",
          }}
        />
      )}
    </div>
  );
}
