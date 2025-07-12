import { LoadingState } from "@/components/loading-state";

export default function ClassificationDetailLoading() {
  return (
    <LoadingState
      title="Memuat Detail Klasifikasi..."
      description="Mengambil hasil dan metrik detail"
      variant="fullpage"
    />
  );
}
