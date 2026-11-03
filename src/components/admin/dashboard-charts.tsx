"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const projectChartConfig = {
  published: { label: "Published", color: "var(--chart-2)" },
  draft: { label: "Draft", color: "var(--chart-4)" },
} satisfies ChartConfig;

const messageChartConfig = {
  unread: { label: "Belum dibaca", color: "var(--chart-2)" },
  read: { label: "Sudah dibaca", color: "var(--chart-3)" },
  archived: { label: "Diarsipkan", color: "var(--chart-5)" },
} satisfies ChartConfig;

type DashboardChartsProps = {
  projects: { published: number; draft: number };
  messages: { unread: number; read: number; archived: number };
};

export function DashboardCharts({ projects, messages }: DashboardChartsProps) {
  const totalProjects = projects.published + projects.draft;
  const totalMessages = messages.unread + messages.read + messages.archived;

  if (totalProjects === 0 && totalMessages === 0) {
    return (
      <p className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
        Grafik akan tampil setelah ada data proyek atau pesan.
      </p>
    );
  }

  const projectData = [
    {
      name: "Proyek",
      published: projects.published,
      draft: projects.draft,
    },
  ];

  const messageData = [
    { key: "unread", name: "Belum dibaca", value: messages.unread },
    { key: "read", name: "Sudah dibaca", value: messages.read },
    { key: "archived", name: "Diarsipkan", value: messages.archived },
  ].filter((item) => item.value > 0);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {totalProjects > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Status Proyek</CardTitle>
            <CardDescription>
              Perbandingan proyek published dan draft.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={projectChartConfig}
              className="aspect-auto h-56 w-full"
            >
              <BarChart data={projectData} margin={{ left: -16, right: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={32}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="published"
                  fill="var(--color-published)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={56}
                />
                <Bar
                  dataKey="draft"
                  fill="var(--color-draft)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={56}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : null}

      {totalMessages > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Status Pesan</CardTitle>
            <CardDescription>
              Distribusi pesan berdasarkan statusnya.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={messageChartConfig}
              className="mx-auto aspect-square max-h-56"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="key" hideLabel />}
                />
                <Pie
                  data={messageData}
                  dataKey="value"
                  nameKey="key"
                  innerRadius={45}
                  strokeWidth={4}
                >
                  {messageData.map((item) => (
                    <Cell
                      key={item.key}
                      fill={`var(--color-${item.key})`}
                    />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="key" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
