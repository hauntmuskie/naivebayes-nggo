import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { LucideIcon, Printer, Eye } from "lucide-react";

interface ReportCardProps {
  report: {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    color: "blue" | "green" | "purple" | "orange";
    stats: string;
    href: string;
    features?: string[];
  };
}

const colorMap = {
  blue: "bg-blue-50 border-blue-200 text-blue-900",
  green: "bg-green-50 border-green-200 text-green-900",
  purple: "bg-purple-50 border-purple-200 text-purple-900",
  orange: "bg-orange-50 border-orange-200 text-orange-900",
};

const iconColorMap = {
  blue: "text-blue-600",
  green: "text-green-600",
  purple: "text-purple-600",
  orange: "text-orange-600",
};

export function ReportCard({ report }: ReportCardProps) {
  const IconComponent = report.icon;
  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-border/40 h-full flex flex-col w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colorMap[report.color]}`}>
              <IconComponent
                className={`h-5 w-5 ${iconColorMap[report.color]}`}
              />
            </div>
            <div>
              <CardTitle className="text-lg text-center">
                {report.title}
              </CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex gap-2">
          <Link
            href={`/admin/reports/${report.id}`}
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex-1"
          >
            <Eye className="h-4 w-4" />
            Lihat Laporan
          </Link>
          <Link
            href={`/admin/reports/${report.id}?print=true`}
            target="_blank"
            className="flex items-center justify-center p-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            title="Print Laporan"
          >
            <Printer className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
