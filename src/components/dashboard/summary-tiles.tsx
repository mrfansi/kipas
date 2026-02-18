"use client";

import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

interface SummaryTilesProps {
  stats: DashboardStats;
}

export function SummaryTiles({ stats }: SummaryTilesProps) {
  const tiles = [
    {
      label: "Total KPIs",
      value: stats.totalKpis,
      change: stats.totalKpisChange,
      trend: stats.totalKpisChange.startsWith("+") ? "up" : "down",
      icon: BarChart3,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      description: "MoM",
    },
    {
      label: "On Track",
      value: stats.onTrack,
      change: stats.onTrackChange,
      trend: stats.onTrackChange.startsWith("+") ? "up" : "down",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      description: "from last month",
    },
    {
      label: "At Risk",
      value: stats.atRisk,
      change: stats.atRiskChange,
      trend: stats.atRiskChange.startsWith("-")
        ? "down"
        : stats.atRiskChange.startsWith("+")
          ? "up"
          : "neutral",
      icon: AlertTriangle,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      description: "needs attention",
    },
    {
      label: "Completed Goals",
      value: stats.completed,
      change: stats.completedChange,
      trend: stats.completedChange.startsWith("+") ? "up" : "neutral",
      icon: CheckCircle2,
      color: "text-cyan-500",
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
      description: "quarterly goals",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tiles.map((tile) => {
        const Icon = tile.icon;
        const isPositive = tile.trend === "up";
        const isNegative = tile.trend === "down";

        return (
          <Card key={tile.label} className="metric-tile card-hover-effect">
            <CardContent className="p-0">
              <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-xl ${tile.bg}`}>
                  <Icon className={`w-5 h-5 ${tile.color}`} />
                </div>
                {tile.change !== "0" && (
                  <div
                    className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      tile.label === "At Risk"
                        ? isPositive
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : isPositive
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : isNegative ? (
                      <ArrowDownRight className="w-3 h-3" />
                    ) : (
                      <Minus className="w-3 h-3" />
                    )}
                    {tile.change}
                  </div>
                )}
              </div>

              <div>
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  {tile.value}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {tile.label}
                  </p>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
                    {tile.description}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
