"use client";

import { useTranslations } from "next-intl";
import {
  BarChart3,
  CheckCircle2,
  Plus,
  Upload,
  Target,
  ClipboardCheck,
  TrendingUp,
  AlertTriangle,
  Camera,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { PivotFilter } from "@/components/dashboard/pivot-filter";
import { SummaryTiles } from "@/components/dashboard/summary-tiles";
import { InteractiveCharts } from "@/components/dashboard/interactive-charts";
import { toast } from "sonner"; // Assuming sonner is used as per package.json

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
  mode?: "default" | "presentation";
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
  mode = "default",
}: DashboardContentProps) {
  const t = useTranslations("dashboard");

  const handleSnapshot = () => {
    toast.success("Snapshot taken! (Mock)");
    // TODO: Implement actual snapshot logic
  };

  const isPresentation = mode === "presentation";

  return (
    <div
      className={`space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ${isPresentation ? "p-8 max-w-[1600px] mx-auto" : ""}`}
    >
      <PageHero
        marker={isPresentation ? "Breezy View" : "Command Center"}
        badge="Live 02/2026"
        title={`${t("title")}, ${userName ?? "Tim"} `}
        subtitle={isPresentation ? "Presentation Mode" : t("subtitle")}
        actions={
          !isPresentation ? (
            <>
              <Button
                asChild
                size="sm"
                variant="secondary"
                className="h-9 gap-1.5 rounded-xl bg-white/90 text-slate-900 hover:bg-white shadow-sm"
              >
                <Link href="/kpi/new">
                  <Plus className="w-3.5 h-3.5" />
                  {t("addKpi")}
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSnapshot}
                className="h-9 gap-1.5 rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <Camera className="w-3.5 h-3.5" />
                Snapshot
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <Link href="/presentation" target="_blank">
                  <Activity className="w-3.5 h-3.5" />
                  Breezy View
                </Link>
              </Button>
              <div className="h-6 w-[1px] bg-white/20 mx-1 hidden sm:block" />
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-9 gap-1.5 rounded-xl text-cyan-100 hover:text-white hover:bg-white/10"
              >
                <Link href="/data">
                  <Upload className="w-3.5 h-3.5" />
                  {t("importData")}
                </Link>
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.close()}
              className="h-9 gap-1.5 rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              Exit Presentation
            </Button>
          )
        }
      />

      <div className="flex flex-col space-y-4">
        <PivotFilter />

        {/* Summary Tiles */}
        <SummaryTiles stats={stats} />

        {/* Interactive Charts */}
        <InteractiveCharts
          trendData={trendData}
          categoryBreakdown={categoryBreakdown}
        />

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
              <div className="space-y-4">
                {teamPerformance.length > 0 ? (
                  teamPerformance.map((team) => (
                    <div key={team.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-muted-foreground">
                          {team.name}
                        </span>
                        <span className="font-bold">{team.value}%</span>
                      </div>
                      <Progress
                        value={team.value}
                        className="h-2 bg-muted/60"
                        indicatorClassName="bg-cyan-500"
                      />
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
              <div className="space-y-0 divide-y divide-border/40">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, i) => {
                    const Icon = activityIcons[activity.type] || BarChart3;
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                      >
                        <div className="mt-0.5 p-2 rounded-lg bg-muted/50">
                          <Icon className="w-3.5 h-3.5 text-foreground/70" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <span className="font-semibold text-foreground">
                              {activity.user}
                            </span>{" "}
                            <span className="text-muted-foreground">
                              {activity.action}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 font-mono">
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
    </div>
  );
}
