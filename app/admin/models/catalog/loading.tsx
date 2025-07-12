import { LoadingState } from "@/components/loading-state";

export default function ModelCatalogLoading() {
  return (
    <LoadingState
      title="Loading Model Catalog..."
      description="Fetching your model collection"
      variant="fullpage"
    />
  );
}
