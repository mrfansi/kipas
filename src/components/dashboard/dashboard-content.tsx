"use client";

import { useTranslations } from "next-intl";
import {
  BarChart3,
  TrendingUp,
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
import { Progress } from "@/components/ui/progress";
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
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";

interface DashboardStats {
  totalKpis: number;
  onTrack: number;
  atRisk: number;
  completed: number;
  totalKpisChange: string;
  onTrackChange: string;
  atRiskChange: string;
  completedChange: string;
}

interface TrendDataPoint {
  month: string;
  kpi: number;
  target: number;
}

interface TeamPerformance {
  name: string;
  value: number;
}

interface CategoryBreakdown {
  name: string;
  value: number;
  color: string;
}

interface RecentActivity {
  type: string;
  user: string;
  action: string;
  time: string;
  createdAt: string;
}

interface DashboardContentProps {
  userName?: string;
  stats: DashboardStats;
  trendData: TrendDataPoint[];
  teamPerformance: TeamPerformance[];
  categoryBreakdown: CategoryBreakdown[];
  recentActivities: RecentActivity[];
}

const activityIcons: Record<string, typeof BarChart3> = {
  kpi_update: BarChart3,
  goal_complete: CheckCircle2,
  checkin: ClipboardCheck,
  alert: AlertTriangle,
  feedback: TrendingUp,
};

export function DashboardContent({
  userName,
  stats,
  trendData,
  teamPerformance,
  categoryBreakdown,
  recentActivities,
}: DashboardContentProps) {
  const t = useTranslations("dashboard");

  const statCards = [
    {
      label: t("totalKpis"),
      value: String(stats.totalKpis),
      change: stats.totalKpisChange,
      trend: stats.totalKpisChange.startsWith("+")
        ? ("up" as const)
        : ("down" as const),
      icon: BarChart3,
      color: "text-chart-1",
      bg: "bg-notion-bg-green",
    },
    {
      label: t("onTrack"),
      value: String(stats.onTrack),
      change: stats.onTrackChange,
      trend: stats.onTrackChange.startsWith("+")
        ? ("up" as const)
        : ("down" as const),
      icon: TrendingUp,
      color: "text-chart-2",
      bg: "bg-notion-bg-blue",
    },
    {
      label: t("atRisk"),
      value: String(stats.atRisk),
      change: stats.atRiskChange,
      trend: stats.atRiskChange.startsWith("-")
        ? ("down" as const)
        : ("up" as const),
      icon: AlertTriangle,
      color: "text-chart-4",
      bg: "bg-notion-bg-orange",
    },
    {
      label: t("completed"),
      value: String(stats.completed),
      change: stats.completedChange,
      trend: stats.completedChange.startsWith("+")
        ? ("up" as const)
        : ("down" as const),
      icon: CheckCircle2,
      color: "text-chart-1",
      bg: "bg-notion-bg-green",
    },
  ];

  return (
    <div className="space-y-5 lg:space-y-6">
      <PageHero
        marker="Command Center"
        badge="Live 02/2026"
        title={`${t("title")}, ${userName ?? "Tim"} `}
        subtitle={t("subtitle")}
        actions={
          <>
            <Button
              asChild
              size="sm"
              className="h-9 gap-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100"
            >
              <Link href="/kpi/new">
                <Plus className="w-3.5 h-3.5" />
                {t("addKpi")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 rounded-xl border-white/40 bg-white/10 text-white hover:bg-white/20"
            >
              <Link href="/data">
                <Upload className="w-3.5 h-3.5" />
                {t("importData")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 rounded-xl border-white/40 bg-white/10 text-white hover:bg-white/20"
            >
              <Link href="/goals/new">
                <Target className="w-3.5 h-3.5" />
                {t("createGoal")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 rounded-xl border-white/40 bg-white/10 text-white hover:bg-white/20"
            >
              <Link href="/checkins">
                <ClipboardCheck className="w-3.5 h-3.5" />
                {t("weeklyCheckin")}
              </Link>
            </Button>
          </>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="metric-tile">
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
        <Card className="panel-card lg:col-span-2">
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
        <Card className="panel-card">
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
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, i) => (
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
              {categoryBreakdown.map((item) => (
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
        <Card className="panel-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("teamPerformance")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {teamPerformance.length > 0 ? (
                teamPerformance.map((team) => (
                  <div key={team.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{team.name}</span>
                      <span className="font-medium">{team.value}%</span>
                    </div>
                    <Progress value={team.value} className="h-2" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Belum ada data performa tim
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="panel-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("recentActivity")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, i) => {
                  const Icon = activityIcons[activity.type] || BarChart3;
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
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Belum ada aktivitas terbaru
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
