import { NavBar } from "@/components/nav-bar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
      <div className="lg:ml-64">
        <div className="p-5 pb-20 lg:pb-6">{children}</div>
      </div>
    </>
  );
}
