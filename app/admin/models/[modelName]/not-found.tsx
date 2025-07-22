import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ModelNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-2xl font-semibold">Model Tidak Ditemukan</h1>
      <p className="text-muted-foreground mt-2">
        Model yang Anda cari tidak ada atau telah dihapus.
      </p>
      <div className="flex gap-4 mt-6">
        <Button variant="outline" asChild>
          <Link href="/admin/models">Lihat Semua Model</Link>
        </Button>
        <Button asChild>
          <Link href="/train">Latih Model Baru</Link>
        </Button>
      </div>
    </div>
  );
}
