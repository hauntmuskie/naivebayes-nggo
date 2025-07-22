import { NavBar } from "@/components/nav-bar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
      <div className="lg:ml-64 print:ml-0 --font-inter">
        <div className="p-3 lg:p-5 pb-20 lg:pb-6 print:p-0">{children}</div>
      </div>
    </>
  );
}
