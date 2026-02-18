"use client";

import { useTranslations } from "next-intl";
import {
  Plus,
  FileSpreadsheet,
  Globe,
  PenLine,
  Clock,
  CheckCircle2,
  AlertCircle,
  Database,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const typeConfig = {
  csv: { icon: FileSpreadsheet, color: "bg-notion-bg-green text-notion-green" },
  api: { icon: Globe, color: "bg-notion-bg-blue text-notion-blue" },
  manual: { icon: PenLine, color: "bg-notion-bg-yellow text-notion-yellow" },
};

const statusConfig = {
  active: { color: "text-chart-1", icon: CheckCircle2 },
  error: { color: "text-destructive", icon: AlertCircle },
  disabled: { color: "text-muted-foreground", icon: Clock },
};

const demoSources = [
  {
    id: "1",
    name: "Laporan Penjualan Harian",
    type: "csv" as const,
    status: "active" as const,
    lastSyncAt: "2026-02-18T08:00:00",
    kpisLinked: 4,
  },
  {
    id: "2",
    name: "Google Analytics API",
    type: "api" as const,
    status: "active" as const,
    lastSyncAt: "2026-02-18T07:30:00",
    kpisLinked: 3,
  },
  {
    id: "3",
    name: "HR Input Manual",
    type: "manual" as const,
    status: "active" as const,
    lastSyncAt: "2026-02-15T10:00:00",
    kpisLinked: 5,
  },
  {
    id: "4",
    name: "CRM Integration",
    type: "api" as const,
    status: "error" as const,
    lastSyncAt: "2026-02-14T12:00:00",
    kpisLinked: 2,
  },
];

export function DataContent() {
  const t = useTranslations("data");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
        </div>
        <Button size="sm" className="gap-1.5 h-8">
          <Plus className="w-3.5 h-3.5" />
          {t("addSource")}
        </Button>
      </div>

      {/* Source Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="border-border/50 shadow-none hover:shadow-sm transition-shadow cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-notion-bg-green">
              <FileSpreadsheet className="w-5 h-5 text-notion-green" />
            </div>
            <div>
              <p className="text-sm font-medium">{t("csvUpload")}</p>
              <p className="text-xs text-muted-foreground">Unggah file CSV</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-none hover:shadow-sm transition-shadow cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-notion-bg-blue">
              <Globe className="w-5 h-5 text-notion-blue" />
            </div>
            <div>
              <p className="text-sm font-medium">{t("apiConnect")}</p>
              <p className="text-xs text-muted-foreground">
                Hubungkan API eksternal
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-none hover:shadow-sm transition-shadow cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-notion-bg-yellow">
              <PenLine className="w-5 h-5 text-notion-yellow" />
            </div>
            <div>
              <p className="text-sm font-medium">{t("manual")}</p>
              <p className="text-xs text-muted-foreground">
                Input data secara manual
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sources List */}
      <div className="space-y-3">
        {demoSources.map((source) => {
          const config = typeConfig[source.type];
          const status = statusConfig[source.status];
          const TypeIcon = config.icon;
          const StatusIcon = status.icon;
          return (
            <Card
              key={source.id}
              className="border-border/50 shadow-none hover:shadow-sm transition-shadow cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.color}`}>
                    <TypeIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{source.name}</span>
                      <StatusIcon className={`w-3.5 h-3.5 ${status.color}`} />
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {t("lastSync")}:{" "}
                        {new Date(source.lastSyncAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {source.kpisLinked} KPI
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {source.type.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
