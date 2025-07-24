"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
} from "recharts";
import { ModelsWithMetrics } from "@/database/schema";

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

export const description = "Diagram batang yang menunjukkan akurasi model";

const chartConfig = {
  accuracy: {
    label: "Akurasi (%)",
  },
  model1: {
    label: "Model 1",
    color: "var(--chart-1)",
  },
  model2: {
    label: "Model 2",
    color: "var(--chart-2)",
  },
  model3: {
    label: "Model 3",
    color: "var(--chart-3)",
  },
  model4: {
    label: "Model 4",
    color: "var(--chart-4)",
  },
  model5: {
    label: "Model 5",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

interface ChartBarActiveProps {
  models: ModelsWithMetrics[];
}

export function ChartBarActive({ models }: ChartBarActiveProps) {
  if (!models || models.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Perbandingan Akurasi Model</CardTitle>
          <CardDescription>
            Perbandingan performa model yang telah dilatih
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">Tidak ada model tersedia</p>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Belum ada model yang dilatih
          </div>
          <div className="text-muted-foreground leading-none">
            Mulai dengan melatih model pertama Anda
          </div>
        </CardFooter>
      </Card>
    );
  }

  const chartData = models.slice(0, 5).map((model, index) => ({
    model:
      model.modelName && model.modelName.length > 10
        ? model.modelName.substring(0, 10) + "..."
        : model.modelName || `Model ${index + 1}`,
    accuracy: Math.round((model.accuracy || 0) * 100),
    fill: `var(--chart-${index + 1})`,
  }));

  const bestModelIndex =
    chartData.length > 0
      ? chartData.reduce(
          (maxIndex, current, index) =>
            current.accuracy > chartData[maxIndex].accuracy ? index : maxIndex,
          0
        )
      : 0;

  return (
    <Card className="border border-border/40">
      <CardHeader>
        <CardTitle>Perbandingan Akurasi Model</CardTitle>
        <CardDescription>
          Perbandingan performa model yang telah dilatih
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="model"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="accuracy"
              strokeWidth={2}
              radius={8}
              activeIndex={bestModelIndex}
              activeBar={({ ...props }) => {
                return (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    stroke={props.payload.fill}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                );
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Model terbaik: {chartData[bestModelIndex]?.accuracy}% akurasi{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Menampilkan akurasi untuk {chartData.length} model terbaru
        </div>
      </CardFooter>
    </Card>
  );
}
