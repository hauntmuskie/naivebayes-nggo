export default async function ReportsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="p-0 m-0 my-0 min-h-0">{children}</div>
    </>
  );
}
