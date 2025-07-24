"use client";

import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { ClassificationHistorySelect } from "@/database/schema";

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

export const description = "Diagram garis yang menunjukkan tren klasifikasi";

const chartConfig = {
  totalRecords: {
    label: "Total Data",
    color: "var(--chart-1)",
  },
  accuracy: {
    label: "Akurasi (%)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface ChartLineLabelProps {
  classificationHistory: ClassificationHistorySelect[];
}

export function ChartLineLabel({ classificationHistory }: ChartLineLabelProps) {
  if (!classificationHistory || classificationHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tren Klasifikasi</CardTitle>
          <CardDescription>
            Data yang diproses dan akurasi dari klasifikasi terbaru
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">
            Riwayat klasifikasi tidak tersedia
          </p>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Belum ada klasifikasi yang dilakukan
          </div>
          <div className="text-muted-foreground leading-none">
            Mulai dengan melakukan klasifikasi
          </div>
        </CardFooter>
      </Card>
    );
  }

  const chartData = classificationHistory
    .slice(0, 6)
    .reverse()
    .map((item, index) => ({
      period: `Periode ${index + 1}`,
      totalRecords: item.totalRecords || 0,
      accuracy: item.accuracy ? Math.round(item.accuracy * 100) : 0,
    }));

  const avgAccuracy =
    chartData.length > 0
      ? chartData.reduce((sum, item) => sum + item.accuracy, 0) /
        chartData.length
      : 0;

  return (
    <Card className="border border-border/40">
      <CardHeader>
        <CardTitle>Tren Klasifikasi</CardTitle>
        <CardDescription>
          Data yang diproses dan akurasi dari klasifikasi terbaru
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="records"
              orientation="left"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="accuracy"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              yAxisId="records"
              dataKey="totalRecords"
              type="natural"
              stroke="var(--color-totalRecords)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-totalRecords)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
            <Line
              yAxisId="accuracy"
              dataKey="accuracy"
              type="natural"
              stroke="var(--color-accuracy)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{
                fill: "var(--color-accuracy)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Rata-rata akurasi: {avgAccuracy.toFixed(1)}%{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Menampilkan tren klasifikasi untuk {chartData.length} periode terakhir
        </div>
      </CardFooter>
    </Card>
  );
}
