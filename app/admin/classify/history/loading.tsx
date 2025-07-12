import { LoadingState } from "@/components/loading-state";

export default function ClassifyHistoryLoading() {
  return (
    <LoadingState
      title="Memuat Riwayat Klasifikasi..."
      description="Mengambil hasil klasifikasi masa lalu Anda"
      variant="fullpage"
    />
  );
}
