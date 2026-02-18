"use client";

import { useTranslations } from "next-intl";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Upload,
  Target,
  ClipboardCheck,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Link from "next/link";

interface DashboardContentProps {
  userName?: string;
}

// Demo data
const trendData = [
  { month: "Jan", kpi: 65, target: 70 },
  { month: "Feb", kpi: 72, target: 70 },
  { month: "Mar", kpi: 68, target: 72 },
  { month: "Apr", kpi: 78, target: 75 },
  { month: "Mei", kpi: 82, target: 78 },
  { month: "Jun", kpi: 85, target: 80 },
  { month: "Jul", kpi: 79, target: 82 },
  { month: "Agu", kpi: 88, target: 85 },
];

const teamPerformanceData = [
  { name: "Penjualan", value: 87 },
  { name: "Marketing", value: 72 },
  { name: "Engineering", value: 91 },
  { name: "Operasional", value: 68 },
  { name: "SDM", value: 79 },
];

const categoryData = [
  { name: "Tercapai", value: 12, color: "#0f7b6c" },
  { name: "Sesuai Target", value: 8, color: "#2383e2" },
  { name: "Berisiko", value: 4, color: "#d9730d" },
  { name: "Terlambat", value: 2, color: "#e03e3e" },
];

const recentActivities = [
  {
    type: "kpi_update",
    user: "Ari Pratama",
    action: "memperbarui KPI Revenue Q3",
    time: "2 menit lalu",
    icon: BarChart3,
  },
  {
    type: "goal_complete",
    user: "Siti Nurhaliza",
    action: "menyelesaikan tujuan Sprint 12",
    time: "1 jam lalu",
    icon: CheckCircle2,
  },
  {
    type: "checkin",
    user: "Budi Santoso",
    action: "mengirim check-in mingguan",
    time: "3 jam lalu",
    icon: ClipboardCheck,
  },
  {
    type: "alert",
    user: "Sistem",
    action: "Peringatan: Customer Churn naik 15%",
    time: "5 jam lalu",
    icon: AlertTriangle,
  },
  {
    type: "kpi_update",
    user: "Dewi Lestari",
    action: "menambahkan data NPS Februari",
    time: "6 jam lalu",
    icon: BarChart3,
  },
];

export function DashboardContent({ userName }: DashboardContentProps) {
  const t = useTranslations("dashboard");

  const stats = [
    {
      label: t("totalKpis"),
      value: "26",
      change: "+3",
      trend: "up" as const,
      icon: BarChart3,
      color: "text-chart-1",
      bg: "bg-notion-bg-green",
    },
    {
      label: t("onTrack"),
      value: "18",
      change: "+2",
      trend: "up" as const,
      icon: TrendingUp,
      color: "text-chart-2",
      bg: "bg-notion-bg-blue",
    },
    {
      label: t("atRisk"),
      value: "5",
      change: "-1",
      trend: "down" as const,
      icon: AlertTriangle,
      color: "text-chart-4",
      bg: "bg-notion-bg-orange",
    },
    {
      label: t("completed"),
      value: "12",
      change: "+4",
      trend: "up" as const,
      icon: CheckCircle2,
      color: "text-chart-1",
      bg: "bg-notion-bg-green",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          {t("title")}, {userName} 👋
        </h1>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm" className="gap-1.5 h-8">
          <Link href="/kpi/new">
            <Plus className="w-3.5 h-3.5" />
            {t("addKpi")}
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="gap-1.5 h-8">
          <Link href="/data">
            <Upload className="w-3.5 h-3.5" />
            {t("importData")}
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="gap-1.5 h-8">
          <Link href="/goals/new">
            <Target className="w-3.5 h-3.5" />
            {t("createGoal")}
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="gap-1.5 h-8">
          <Link href="/checkins">
            <ClipboardCheck className="w-3.5 h-3.5" />
            {t("weeklyCheckin")}
          </Link>
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="border-border/50 shadow-none hover:shadow-sm transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className="flex items-center gap-0.5">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-3 h-3 text-chart-1" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-chart-4" />
                    )}
                    <span
                      className={`text-xs font-medium ${stat.trend === "up" ? "text-chart-1" : "text-chart-4"}`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trend Chart */}
        <Card className="lg:col-span-2 border-border/50 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              {t("trendAnalysis")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="kpiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--chart-2)"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--chart-2)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="var(--muted-foreground)"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="var(--muted-foreground)"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="kpi"
                    stroke="var(--chart-2)"
                    fillOpacity={1}
                    fill="url(#kpiGrad)"
                    strokeWidth={2}
                    name="KPI Aktual"
                  />
                  <Area
                    type="monotone"
                    dataKey="target"
                    stroke="var(--muted-foreground)"
                    fill="transparent"
                    strokeDasharray="5 5"
                    strokeWidth={1.5}
                    name="Target"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Pie Chart */}
        <Card className="border-border/50 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("kpiOverview")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {categoryData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Team Performance */}
        <Card className="border-border/50 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("teamPerformance")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {teamPerformanceData.map((team) => (
                <div key={team.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{team.name}</span>
                    <span className="font-medium">{team.value}%</span>
                  </div>
                  <Progress value={team.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("recentActivity")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {recentActivities.map((activity, i) => {
                const Icon = activity.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 rounded-md bg-muted">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{" "}
                        <span className="text-muted-foreground">
                          {activity.action}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
