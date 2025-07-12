import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <Card className="group hover:shadow-lg transition-all duration-200 border-border/40">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colorMap[report.color]}`}>
              <IconComponent
                className={`h-5 w-5 ${iconColorMap[report.color]}`}
              />
            </div>
            <div>
              <CardTitle className="text-lg">{report.title}</CardTitle>
              <Badge variant="secondary" className="mt-1">
                {report.stats}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {report.description}
        </p>

        {report.features && report.features.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Fitur Laporan
            </p>
            <div className="flex flex-wrap gap-1">
              {report.features.map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button size="sm" asChild className="flex-1">
            <Link href={report.href}>
              <Eye className="h-4 w-4 mr-2" />
              Lihat Laporan
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={`${report.href}?print=true`} target="_blank">
              <Printer className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
