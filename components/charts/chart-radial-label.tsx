"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, RadialBar, RadialBarChart } from "recharts";
import { DatasetRecordsSelect } from "@/database/schema";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description =
  "Diagram radial yang menunjukkan distribusi tipe dataset";

const chartConfig = {
  count: {
    label: "Data",
  },
  training: {
    label: "Pelatihan",
    color: "var(--chart-1)",
  },
  testing: {
    label: "Pengujian",
    color: "var(--chart-2)",
  },
  validation: {
    label: "Validasi",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

interface ChartRadialLabelProps {
  datasetRecords: DatasetRecordsSelect[];
}

export function ChartRadialLabel({ datasetRecords }: ChartRadialLabelProps) {
  if (!datasetRecords || datasetRecords.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Distribusi Dataset</CardTitle>
          <CardDescription>
            Distribusi data berdasarkan tipe dataset
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[250px]">
          <p className="text-muted-foreground">
            Tidak ada data dataset tersedia
          </p>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            Tidak ada data
          </div>
          <div className="text-muted-foreground leading-none">
            Mulai dengan mengunggah data dataset
          </div>
        </CardFooter>
      </Card>
    );
  }

  const datasetCounts = datasetRecords.reduce((acc, record) => {
    if (record && record.datasetType) {
      acc[record.datasetType] = (acc[record.datasetType] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(datasetCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  const chartData = Object.entries(datasetCounts).map(
    ([type, count], index) => ({
      datasetType: type,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      fill: `var(--chart-${index + 1})`,
    })
  );

  const maxDatasetType =
    chartData.length > 0
      ? chartData.reduce(
          (max, current) => (current.count > max.count ? current : max),
          chartData[0]
        )
      : { datasetType: "none", count: 0 };

  return (
    <Card className="flex flex-col border border-border/40">
      <CardHeader className="items-center pb-0">
        <CardTitle>Distribusi Dataset</CardTitle>
        <CardDescription>
          Distribusi data berdasarkan tipe dataset
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="datasetType" />}
            />
            <RadialBar dataKey="count" background>
              <LabelList
                position="insideStart"
                dataKey="datasetType"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Dataset terbesar: {maxDatasetType.datasetType} ({maxDatasetType.count}{" "}
          data) <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Total {total} data pada {chartData.length} tipe dataset
        </div>
      </CardFooter>
    </Card>
  );
}
