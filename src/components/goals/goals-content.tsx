"use client";

import { useTranslations } from "next-intl";
import {
  Plus,
  Calendar,
  User,
  Link2,
  CheckCircle2,
  AlertTriangle,
  Circle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHero } from "@/components/layout/page-hero";

const statusConfig = {
  not_started: {
    label: "notStarted",
    color: "bg-notion-bg-gray text-notion-gray",
    icon: Circle,
  },
  in_progress: {
    label: "inProgress",
    color: "bg-notion-bg-blue text-notion-blue",
    icon: ArrowRight,
  },
  at_risk: {
    label: "atRisk",
    color: "bg-notion-bg-orange text-notion-orange",
    icon: AlertTriangle,
  },
  completed: {
    label: "completed",
    color: "bg-notion-bg-green text-notion-green",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "cancelled",
    color: "bg-notion-bg-red text-notion-red",
    icon: XCircle,
  },
};

const demoGoals = [
  {
    id: "1",
    title: "Meningkatkan Revenue 20% di Q1",
    description:
      "Target peningkatan pendapatan tahunan melalui diversifikasi produk dan ekspansi pasar.",
    status: "in_progress" as const,
    progress: 65,
    owner: "Ari Pratama",
    dueDate: "2026-03-31",
    linkedKpis: 3,
  },
  {
    id: "2",
    title: "Kurangi Customer Churn < 5%",
    description:
      "Menurunkan tingkat kehilangan pelanggan dengan meningkatkan kualitas layanan.",
    status: "at_risk" as const,
    progress: 40,
    owner: "Siti Nurhaliza",
    dueDate: "2026-06-30",
    linkedKpis: 2,
  },
  {
    id: "3",
    title: "Launch Fitur Mobile App v2",
    description:
      "Rilis versi baru aplikasi mobile dengan fitur offline dan notifikasi push.",
    status: "in_progress" as const,
    progress: 78,
    owner: "Dewi Lestari",
    dueDate: "2026-02-28",
    linkedKpis: 4,
  },
  {
    id: "4",
    title: "Sertifikasi ISO 27001",
    description: "Mendapatkan sertifikasi keamanan informasi ISO 27001.",
    status: "not_started" as const,
    progress: 0,
    owner: "Budi Santoso",
    dueDate: "2026-09-30",
    linkedKpis: 1,
  },
  {
    id: "5",
    title: "Onboarding 50 Karyawan Baru",
    description:
      "Proses rekrutmen dan onboarding untuk mendukung pertumbuhan tim.",
    status: "completed" as const,
    progress: 100,
    owner: "Rina Wati",
    dueDate: "2026-01-31",
    linkedKpis: 2,
  },
];

export function GoalsContent() {
  const t = useTranslations("goals");
  const completedGoals = demoGoals.filter((goal) => goal.status === "completed").length;

  return (
    <div className="space-y-5 lg:space-y-6">
      <PageHero
        marker="Planning"
        badge={`${completedGoals}/${demoGoals.length} closed`}
        title={t("title")}
        subtitle={t("subtitle")}
        actions={
          <Button size="sm" className="h-9 gap-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100">
            <Plus className="w-3.5 h-3.5" />
            {t("addNew")}
          </Button>
        }
      />

      {/* Status Summary */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map(
          (key) => {
            const config = statusConfig[key];
            const count = demoGoals.filter((g) => g.status === key).length;
            return (
              <Badge
                key={key}
                variant="outline"
                className={`gap-1.5 px-2.5 py-1 ${config.color}`}
              >
                <config.icon className="w-3 h-3" />
                {t(config.label)} ({count})
              </Badge>
            );
          },
        )}
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        {demoGoals.map((goal) => {
          const config = statusConfig[goal.status];
          const StatusIcon = config.icon;
          const isOverdue =
            new Date(goal.dueDate) < new Date() && goal.status !== "completed";

          return (
            <Card key={goal.id} className="panel-card cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-md ${config.color} mt-0.5`}>
                    <StatusIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-sm">{goal.title}</h3>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {goal.progress}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {goal.description}
                    </p>

                    <div className="mt-3">
                      <Progress value={goal.progress} className="h-1.5" />
                    </div>

                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        {goal.owner}
                      </div>
                      <div
                        className={`flex items-center gap-1.5 text-xs ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}
                      >
                        <Calendar className="w-3 h-3" />
                        {new Date(goal.dueDate).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Link2 className="w-3 h-3" />
                        {goal.linkedKpis} {t("linkedKpis")}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
