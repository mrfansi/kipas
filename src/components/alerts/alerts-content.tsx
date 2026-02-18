"use client";

import { useTransition } from "react";
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
import { toggleAlert } from "@/lib/actions/alerts";

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

interface AlertItem {
  id: string;
  kpiName: string;
  kpiId: string;
  type: "threshold_above" | "threshold_below" | "trend_change" | "no_data";
  severity: "low" | "medium" | "high" | "critical";
  thresholdValue: number | null;
  message: string | null;
  isActive: boolean;
  lastTriggered: string | null;
}

interface AlertsContentProps {
  alerts: AlertItem[];
  kpis: { id: string; name: string }[];
}

export function AlertsContent({ alerts }: AlertsContentProps) {
  const t = useTranslations("alerts");
  const [isPending, startTransition] = useTransition();
  const activeCount = alerts.filter((a) => a.isActive).length;

  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      await toggleAlert(id, !current);
    });
  }

  return (
    <div className="space-y-5 lg:space-y-6">
      <PageHero
        marker="Risk Monitor"
        badge={`${activeCount} active`}
        title={t("title")}
        subtitle={t("subtitle")}
        actions={
          <Button
            size="sm"
            className="h-9 gap-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100"
          >
            <Plus className="w-3.5 h-3.5" />
            {t("addNew")}
          </Button>
        }
      />
      <div className="space-y-3">
        {alerts.length > 0 ? (
          alerts.map((alert) => {
            const TypeIcon = typeIcons[alert.type];
            const sev = severityConfig[alert.severity];
            return (
              <Card key={alert.id} className="panel-card">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${sev.color}`}>
                      <TypeIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {alert.kpiName}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] h-5 ${sev.color}`}
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
                          Terakhir:{" "}
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
                    <Switch
                      checked={alert.isActive}
                      disabled={isPending}
                      onCheckedChange={() =>
                        handleToggle(alert.id, alert.isActive)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="panel-card">
            <CardContent className="p-8 text-center">
              <p className="text-sm text-muted-foreground">Belum ada alert.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
