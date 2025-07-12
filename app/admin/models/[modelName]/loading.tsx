import { LoadingState } from "@/components/loading-state";

export default function ModelDetailLoading() {
  return (
    <LoadingState
      title="Loading Model Details..."
      description="Fetching model metrics and performance data"
      variant="fullpage"
    />
  );
}
