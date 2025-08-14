"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description =
  "Diagram batang yang menunjukkan distribusi kelas prediksi";

const chartConfig = {
  count: {
    label: "Jumlah",
    color: "var(--chart-1)",
  },
  ya: {
    label: "Ya",
    color: "var(--chart-1)",
  },
  tidak: {
    label: "Tidak",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface ClassificationResultsChartProps {
  results: any[];
}

interface ChartDataItem {
  class: string;
  count: number;
  fill: string;
}

export function ClassificationResultsChart({
  results,
}: ClassificationResultsChartProps) {
  if (!results || results.length === 0) {
    return (
      <Card className="border-border/40">
        <CardContent className="flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">Tidak ada data hasil tersedia</p>
        </CardContent>
      </Card>
    );
  }

  const classCounts: Record<string, number> = results.reduce((acc, result) => {
    const predictedClass = result.predictedClass?.toLowerCase() || "unknown";
    acc[predictedClass] = (acc[predictedClass] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData: ChartDataItem[] = Object.entries(classCounts).map(
    ([className, count], index) => ({
      class: className.charAt(0).toUpperCase() + className.slice(1),
      count,
      fill: `var(--chart-${index + 1})`,
    })
  );

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="class"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value.toString()}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="count" strokeWidth={2} radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
