"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, PieChart as PieChartIcon, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrendDataPoint {
  month: string;
  kpi: number;
  target: number;
}

interface CategoryBreakdown {
  name: string;
  value: number;
  color: string;
}

interface InteractiveChartsProps {
  trendData: TrendDataPoint[];
  categoryBreakdown: CategoryBreakdown[];
}

export function InteractiveCharts({
  trendData,
  categoryBreakdown,
}: InteractiveChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Trend Chart */}
      <Card className="panel-card lg:col-span-2 group">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-500" />
            Trend Analysis
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Maximize2 className="h-3 w-3 text-muted-foreground" />
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="kpiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-2)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-2)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  stroke="transparent"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  stroke="transparent"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{ fontSize: "12px", fontWeight: 500 }}
                  labelStyle={{
                    fontSize: "12px",
                    color: "var(--muted-foreground)",
                    marginBottom: "4px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="kpi"
                  stroke="var(--chart-2)"
                  fillOpacity={1}
                  fill="url(#kpiGrad)"
                  strokeWidth={3}
                  name="Actual"
                  activeDot={{ r: 6, strokeWidth: 0, fill: "white" }}
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="var(--muted-foreground)"
                  fill="transparent"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  name="Target"
                  dot={false}
                  activeDot={false}
                  opacity={0.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Pie Chart */}
      <Card className="panel-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-cyan-500" />
            KPI Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[180px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={4}
                  stroke="none"
                >
                  {categoryBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <span className="text-2xl font-bold block">
                  {categoryBreakdown.reduce((a, b) => a + b.value, 0)}
                </span>
                <span className="text-[10px] uppercase text-muted-foreground tracking-widest">
                  Total
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            {categoryBreakdown.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs group cursor-pointer hover:bg-muted/50 p-1.5 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full ring-2 ring-opacity-20 transition-all group-hover:ring-4"
                    style={
                      {
                        backgroundColor: item.color,
                        "--tw-ring-color": item.color,
                      } as any
                    }
                  />
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {item.name}
                  </span>
                </div>
                <span className="font-medium font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
