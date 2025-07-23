import { NavBar } from "@/components/nav-bar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
      <div className="lg:ml-64 print:ml-0">
        <div className="p-3 lg:p-5 pb-20 lg:pb-6">{children}</div>
      </div>
    </>
  );
}
