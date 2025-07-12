import { LoadingState } from "@/components/loading-state";

export default function PassengersLoading() {
  return (
    <LoadingState
      title="Loading Dataset Records..."
      description="Fetching passenger data and statistics"
      variant="fullpage"
    />
  );
}
