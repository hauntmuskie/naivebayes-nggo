import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-7xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Halaman Tidak Ditemukan</h2>
      <p className="text-muted-foreground mt-2">
        Halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <Button className="mt-6" asChild>
        <Link href="/">Kembali ke Dasbor</Link>
      </Button>
    </div>
  );
}
