import { LoadingState } from "@/components/loading-state";

export default function ModelCatalogLoading() {
  return (
    <LoadingState
      title="Memuat Katalog Model..."
      description="Mengambil koleksi model Anda"
      variant="fullpage"
    />
  );
}
