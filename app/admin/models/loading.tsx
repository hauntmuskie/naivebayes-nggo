import { LoadingState } from "@/components/loading-state";

export default function ModelsLoading() {
  return (
    <LoadingState
      title="Memuat Model..."
      description="Mengambil model terlatih dan metrik Anda"
      variant="fullpage"
    />
  );
}
