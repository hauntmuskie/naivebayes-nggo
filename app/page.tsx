import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/dal";

export default async function HomePage() {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    redirect("/admin/dashboard");
  } else {
    redirect("/login");
  }
}
