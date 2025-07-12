import { LoadingState } from "@/components/loading-state";

export default function ClassifyLoading() {
  return (
    <LoadingState
      title="Memuat Alat Klasifikasi..."
      description="Menyiapkan model dan antarmuka klasifikasi"
      variant="fullpage"
    />
  );
}
