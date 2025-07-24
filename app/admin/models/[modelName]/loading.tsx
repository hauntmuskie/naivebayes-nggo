import { LoadingState } from "@/components/loading-state";

export default function ModelDetailLoading() {
  return (
    <LoadingState
      title="Memuat Detail Model..."
      description="Mengambil metrik model dan data performa"
      variant="fullpage"
    />
  );
}
