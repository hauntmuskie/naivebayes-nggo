export default async function ReportsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="p-0 m-0 bg-white">{children}</main>
    </>
  );
}
