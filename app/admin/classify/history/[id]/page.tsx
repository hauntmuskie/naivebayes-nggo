import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  Target,
  Clock,
  Database,
  CheckCircle,
} from "lucide-react";
import { ClassificationHistorySelect } from "@/database/schema";
import { fetchClassificationById } from "@/_actions";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";

export const revalidate = 300;
export const dynamic = "force-static";

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const classification = await fetchClassificationById(id);
    if (!classification) {
      return {
        title: "Detail Klasifikasi",
        description: "Lihat hasil dan metrik klasifikasi",
      };
    }
    return {
      title: `${classification.fileName} - Detail Klasifikasi`,
      description: `Lihat hasil detail untuk klasifikasi ${classification.fileName} menggunakan ${classification.modelName}`,
      openGraph: {
        title: `${classification.fileName} - Detail Klasifikasi`,
        description: `Lihat hasil detail untuk klasifikasi ${classification.fileName} menggunakan ${classification.modelName}`,
      },
    };
  } catch {
    return {
      title: "Detail Klasifikasi",
      description: "Lihat hasil dan metrik klasifikasi",
    };
  }
}

export default async function ClassificationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let classification: ClassificationHistorySelect | null;

  try {
    const { id } = await params;
    classification = await fetchClassificationById(id);
    if (!classification) {
      notFound();
    }
  } catch (error) {
    console.error("Error fetching classification:", error);
    notFound();
  }

  const results = (() => {
    try {
      const parsed = JSON.parse(classification.results);
      return parsed.results || [];
    } catch {
      return [];
    }
  })();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <Button variant="secondary" className="w-fit mb-3" asChild>
          <Link
            href="/admin/classify/history"
            className="inline-flex items-center gap-2"
            aria-label="Kembali"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-accent/40 px-3 py-1.5 rounded-md">
            <FileText className="h-6 w-6 text-purple-500" />
            <span className="text-base sm:text-lg font-semibold text-muted-foreground">
              File:
            </span>
            <span className="text-base sm:text-lg font-medium tracking-tight">
              {classification.fileName}
            </span>
          </div>
        </div>
      </div>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Model Digunakan</span>
            </div>
            <div className="text-lg font-bold mt-1 truncate">
              {classification.modelName}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Total Record</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {classification.totalRecords.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Diproses</span>
            </div>
            <div className="text-sm font-medium mt-1">
              {format(classification.createdAt, "MMMM d, yyyy 'at' h:mm a")}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Results Summary */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Ringkasan Hasil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4"></div>

          {/* Results */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Prediksi</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.slice(0, 10).map((result: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-muted-foreground">
                      #{index + 1}
                    </span>
                    <Badge
                      variant={
                        result.actualClass === result.predictedClass
                          ? "default"
                          : "destructive"
                      }
                    >
                      {result.predictedClass}
                    </Badge>
                  </div>
                  <div className="text-sm font-medium">
                    {(result.confidence * 100).toFixed()}%
                  </div>
                </div>
              ))}
              {results.length > 10 && (
                <div className="text-center text-sm text-muted-foreground py-2">
                  ... dan {results.length - 10} hasil lainnya
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
