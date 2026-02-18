"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Plus,
  Upload,
  Search,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
  History,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KpiImportDialog } from "./kpi-import-dialog";
import { PageHero } from "@/components/layout/page-hero";

// Demo KPI data
const demoKpis = [
  {
    id: "1",
    name: "Revenue Bulanan",
    category: "Penjualan",
    unit: "currency",
    target: 500000000,
    current: 425000000,
    progress: 85,
    status: "active" as const,
    frequency: "monthly" as const,
    owner: "Ari Pratama",
    trend: "up" as const,
    weight: 3,
  },
  {
    id: "2",
    name: "Customer Satisfaction Score",
    category: "Layanan",
    unit: "percentage",
    target: 90,
    current: 87,
    progress: 97,
    status: "active" as const,
    frequency: "monthly" as const,
    owner: "Siti Nurhaliza",
    trend: "up" as const,
    weight: 2,
  },
  {
    id: "3",
    name: "Employee Retention Rate",
    category: "SDM",
    unit: "percentage",
    target: 95,
    current: 88,
    progress: 93,
    status: "active" as const,
    frequency: "quarterly" as const,
    owner: "Budi Santoso",
    trend: "down" as const,
    weight: 2,
  },
  {
    id: "4",
    name: "Time to Market",
    category: "Engineering",
    unit: "number",
    target: 14,
    current: 18,
    progress: 78,
    status: "active" as const,
    frequency: "weekly" as const,
    owner: "Dewi Lestari",
    trend: "flat" as const,
    weight: 1,
  },
  {
    id: "5",
    name: "Lead Conversion Rate",
    category: "Marketing",
    unit: "percentage",
    target: 25,
    current: 21,
    progress: 84,
    status: "active" as const,
    frequency: "monthly" as const,
    owner: "Fajar Hidayat",
    trend: "up" as const,
    weight: 2,
  },
  {
    id: "6",
    name: "Cost per Acquisition",
    category: "Marketing",
    unit: "currency",
    target: 150000,
    current: 180000,
    progress: 83,
    status: "active" as const,
    frequency: "monthly" as const,
    owner: "Rina Wati",
    trend: "down" as const,
    weight: 1,
  },
  {
    id: "7",
    name: "Net Promoter Score",
    category: "Layanan",
    unit: "number",
    target: 70,
    current: 65,
    progress: 93,
    status: "paused" as const,
    frequency: "quarterly" as const,
    owner: "Siti Nurhaliza",
    trend: "flat" as const,
    weight: 1,
  },
];

function formatValue(value: number, unit: string) {
  if (unit === "currency") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  }
  if (unit === "percentage") return `${value}%`;
  return value.toLocaleString("id-ID");
}

function TrendIcon({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "up")
    return <TrendingUp className="w-3.5 h-3.5 text-chart-1" />;
  if (trend === "down")
    return <TrendingDown className="w-3.5 h-3.5 text-destructive" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
}

function StatusBadge({ status }: { status: "active" | "paused" | "archived" }) {
  const t = useTranslations("kpi");
  const variants: Record<string, "default" | "secondary" | "outline"> = {
    active: "default",
    paused: "secondary",
    archived: "outline",
  };
  return (
    <Badge variant={variants[status]} className="text-[10px] h-5">
      {t(status)}
    </Badge>
  );
}

export function KpiContent() {
  const t = useTranslations("kpi");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const filteredKpis = demoKpis.filter((kpi) => {
    const matchesSearch =
      kpi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kpi.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || kpi.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5 lg:space-y-6">
      <PageHero
        marker="Execution"
        badge={`${filteredKpis.length} KPI`}
        title={t("title")}
        subtitle={t("subtitle")}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 rounded-xl border-white/40 bg-white/10 text-white hover:bg-white/20"
              onClick={() => setShowImportDialog(true)}
            >
              <Upload className="w-3.5 h-3.5" />
              {t("import")}
            </Button>
            <Button
              size="sm"
              className="h-9 gap-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100"
              onClick={() => setShowNewDialog(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              {t("addNew")}
            </Button>
          </>
        }
      />

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-9">
              <Filter className="w-3.5 h-3.5 mr-1.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="active">{t("active")}</SelectItem>
              <SelectItem value="paused">{t("paused")}</SelectItem>
              <SelectItem value="archived">{t("archived")}</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5"
            onClick={() => setShowImportDialog(true)}
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("import")}</span>
          </Button>
          <Button
            size="sm"
            className="h-9 gap-1.5"
            onClick={() => setShowNewDialog(true)}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("addNew")}</span>
          </Button>
        </div>
      </div>

      {/* KPI Table */}
      <Card className="panel-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px]">{t("name")}</TableHead>
                <TableHead>{t("category")}</TableHead>
                <TableHead className="text-right">{t("current")}</TableHead>
                <TableHead className="text-right">{t("target")}</TableHead>
                <TableHead className="w-[160px]">{t("progress")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("owner")}</TableHead>
                <TableHead className="w-[40px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKpis.map((kpi) => (
                <TableRow key={kpi.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TrendIcon trend={kpi.trend} />
                      <span className="font-medium text-sm">{kpi.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-[10px] h-5 font-normal"
                    >
                      {kpi.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatValue(kpi.current, kpi.unit)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-muted-foreground">
                    {formatValue(kpi.target, kpi.unit)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={kpi.progress} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground w-8 text-right">
                        {kpi.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={kpi.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {kpi.owner}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="gap-2">
                          <Pencil className="w-3.5 h-3.5" /> {t("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <History className="w-3.5 h-3.5" /> {t("viewHistory")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="w-3.5 h-3.5" /> {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredKpis.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-3 rounded-full bg-muted mb-3">
                <BarChart3 className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm">{t("noKpis")}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("noKpisDesc")}
              </p>
              <Button
                size="sm"
                className="mt-4 gap-1.5"
                onClick={() => setShowNewDialog(true)}
              >
                <Plus className="w-3.5 h-3.5" /> {t("addNew")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New KPI Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>{t("formTitle")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>{t("name")}</Label>
              <Input placeholder="Contoh: Revenue Bulanan" />
            </div>
            <div className="grid gap-2">
              <Label>{t("description")}</Label>
              <Textarea placeholder="Deskripsi singkat KPI ini..." rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>{t("category")}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Penjualan</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="hr">SDM</SelectItem>
                    <SelectItem value="operations">Operasional</SelectItem>
                    <SelectItem value="finance">Keuangan</SelectItem>
                    <SelectItem value="service">Layanan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>{t("unit")}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih satuan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="number">Angka</SelectItem>
                    <SelectItem value="percentage">Persentase (%)</SelectItem>
                    <SelectItem value="currency">Mata Uang (IDR)</SelectItem>
                    <SelectItem value="custom">Kustom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>{t("target")}</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="grid gap-2">
                <Label>{t("frequency")}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Frekuensi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">{t("daily")}</SelectItem>
                    <SelectItem value="weekly">{t("weekly")}</SelectItem>
                    <SelectItem value="monthly">{t("monthly")}</SelectItem>
                    <SelectItem value="quarterly">{t("quarterly")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>{t("weight")}</Label>
                <Input type="number" placeholder="1" min={1} max={5} />
              </div>
              <div className="grid gap-2">
                <Label>{t("owner")}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pemilik" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ari">Ari Pratama</SelectItem>
                    <SelectItem value="siti">Siti Nurhaliza</SelectItem>
                    <SelectItem value="budi">Budi Santoso</SelectItem>
                    <SelectItem value="dewi">Dewi Lestari</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={() => setShowNewDialog(false)}>{t("save")}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import CSV Dialog */}
      <KpiImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
      />
    </div>
  );
}
