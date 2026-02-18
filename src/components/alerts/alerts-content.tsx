"use client";

import { useTranslations } from "next-intl";
import {
  Plus,
  BellRing,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Ban,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PageHero } from "@/components/layout/page-hero";

const severityConfig = {
  low: { color: "bg-notion-bg-gray text-notion-gray" },
  medium: { color: "bg-notion-bg-yellow text-notion-yellow" },
  high: { color: "bg-notion-bg-orange text-notion-orange" },
  critical: { color: "bg-notion-bg-red text-notion-red" },
};

const typeIcons = {
  threshold_above: TrendingUp,
  threshold_below: TrendingDown,
  trend_change: AlertTriangle,
  no_data: Ban,
};

const demoAlerts = [
  {
    id: "1",
    kpiName: "Customer Churn Rate",
    type: "threshold_above" as const,
    severity: "high" as const,
    thresholdValue: 8,
    message: "Churn rate melebihi batas 8%",
    isActive: true,
    lastTriggered: "2026-02-17T08:30:00",
  },
  {
    id: "2",
    kpiName: "Revenue Bulanan",
    type: "threshold_below" as const,
    severity: "critical" as const,
    thresholdValue: 400000000,
    message: "Revenue di bawah Rp 400 juta",
    isActive: true,
    lastTriggered: null,
  },
  {
    id: "3",
    kpiName: "NPS Score",
    type: "trend_change" as const,
    severity: "medium" as const,
    thresholdValue: null,
    message: "Perubahan tren NPS yang signifikan",
    isActive: true,
    lastTriggered: "2026-02-10T14:00:00",
  },
  {
    id: "4",
    kpiName: "Sprint Velocity",
    type: "no_data" as const,
    severity: "low" as const,
    thresholdValue: null,
    message: "Tidak ada data selama 7 hari",
    isActive: false,
    lastTriggered: null,
  },
];

export function AlertsContent() {
  const t = useTranslations("alerts");
  const activeCount = demoAlerts.filter((alert) => alert.isActive).length;

  return (
    <div className="space-y-5 lg:space-y-6">
      <PageHero
        marker="Risk Monitor"
        badge={`${activeCount} active alerts`}
        title={t("title")}
        subtitle={t("subtitle")}
        actions={
          <Button size="sm" className="h-9 gap-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100">
            <Plus className="w-3.5 h-3.5" />
            {t("addNew")}
          </Button>
        }
      />

      <div className="space-y-3">
        {demoAlerts.map((alert) => {
          const TypeIcon = typeIcons[alert.type];
          const severity = severityConfig[alert.severity];
          return (
            <Card key={alert.id} className="panel-card">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${severity.color}`}>
                    <TypeIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {alert.kpiName}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] h-5 ${severity.color}`}
                      >
                        {t(alert.severity)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {alert.message}
                    </p>
                    {alert.lastTriggered && (
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <BellRing className="w-3 h-3" />
                        Terakhir dipicu:{" "}
                        {new Date(alert.lastTriggered).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    )}
                  </div>
                  <Switch checked={alert.isActive} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
