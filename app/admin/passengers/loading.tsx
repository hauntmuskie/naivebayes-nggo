import { LoadingState } from "@/components/loading-state";

export default function PassengersLoading() {
  return (
    <LoadingState
      title="Memuat Data Penumpang..."
      description="Mengambil data penumpang dan statistik"
      variant="fullpage"
    />
  );
}
