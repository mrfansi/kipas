"use client";

import { useTranslations } from "next-intl";
import {
  Plus,
  FileSpreadsheet,
  Globe,
  PenLine,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/layout/page-hero";

const typeIcons = { csv: FileSpreadsheet, api: Globe, manual: PenLine };
const statusConfig = {
  active: { color: "bg-notion-bg-green text-notion-green", icon: CheckCircle2 },
  error: { color: "bg-notion-bg-red text-notion-red", icon: AlertCircle },
  disabled: { color: "bg-notion-bg-gray text-notion-gray", icon: AlertCircle },
};

interface DataSourceItem {
  id: string;
  name: string;
  type: "csv" | "api" | "manual";
  status: "active" | "error" | "disabled";
  lastSyncAt: string | null;
  kpisLinked: number;
}

interface DataContentProps {
  sources: DataSourceItem[];
}

export function DataContent({ sources }: DataContentProps) {
  const t = useTranslations("data");

  return (
    <div className="space-y-5 lg:space-y-6">
      <PageHero
        marker="Integration"
        badge={`${sources.length} sources`}
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
        {sources.length > 0 ? (
          sources.map((source) => {
            const TypeIcon = typeIcons[source.type];
            const status = statusConfig[source.status];
            const StatusIcon = status.icon;
            return (
              <Card key={source.id} className="panel-card">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <TypeIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {source.name}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] h-5 gap-1 ${status.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {t(source.status)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 ml-auto"
                        >
                          {source.type.toUpperCase()}
                        </Badge>
                      </div>
                      {source.lastSyncAt && (
                        <p className="text-xs text-muted-foreground mt-1.5">
                          Sinkronisasi terakhir:{" "}
                          {new Date(source.lastSyncAt).toLocaleDateString(
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
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="panel-card">
            <CardContent className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Belum ada sumber data.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
