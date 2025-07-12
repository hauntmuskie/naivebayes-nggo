import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/dal";
import { NavBar } from "@/components/nav-bar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login");
  }

  return (
    <>
      <NavBar authenticated={authenticated} />
      <div className="lg:ml-64">
        <div className="p-3 lg:p-5 pb-20 lg:pb-6">{children}</div>
      </div>
    </>
  );
}
