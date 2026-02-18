"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface KpiImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ImportStep = "upload" | "preview" | "importing" | "done";

export function KpiImportDialog({ open, onOpenChange }: KpiImportDialogProps) {
  const t = useTranslations("kpi");
  const [step, setStep] = useState<ImportStep>("upload");
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".csv")) {
        setFileName(file.name);
        setStep("preview");
      }
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        setFileName(e.target.files[0].name);
        setStep("preview");
      }
    },
    [],
  );

  const handleImport = useCallback(() => {
    setStep("importing");
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 20;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setStep("done"), 500);
      }
      setProgress(Math.min(p, 100));
    }, 300);
  }, []);

  const handleClose = useCallback(() => {
    setStep("upload");
    setFileName(null);
    setProgress(0);
    onOpenChange(false);
  }, [onOpenChange]);

  const demoPreviewData = [
    {
      name: "Revenue Q4",
      category: "Penjualan",
      target: "600.000.000",
      unit: "IDR",
    },
    { name: "Customer Churn", category: "Layanan", target: "5", unit: "%" },
    {
      name: "Sprint Velocity",
      category: "Engineering",
      target: "45",
      unit: "pts",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            {t("import")}
          </DialogTitle>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-4">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors ${
                dragActive
                  ? "border-foreground bg-muted"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <Upload className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Seret file CSV ke sini</p>
              <p className="text-xs text-muted-foreground mt-1">
                atau klik untuk memilih file
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer"
                style={{ position: "relative", marginTop: "12px" }}
              />
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs font-medium mb-1">
                Format CSV yang didukung:
              </p>
              <p className="text-xs text-muted-foreground">
                Kolom: name, category, unit, target, description, frequency
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Contoh: &quot;Revenue Q4&quot;, &quot;Penjualan&quot;,
                &quot;currency&quot;, &quot;600000000&quot;, &quot;Target
                revenue kuartal 4&quot;, &quot;quarterly&quot;
              </p>
            </div>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm flex-1">{fileName}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {
                  setStep("upload");
                  setFileName(null);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2 font-medium">Nama</th>
                    <th className="text-left p-2 font-medium">Kategori</th>
                    <th className="text-right p-2 font-medium">Target</th>
                    <th className="text-left p-2 font-medium">Satuan</th>
                  </tr>
                </thead>
                <tbody>
                  {demoPreviewData.map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="p-2">{row.name}</td>
                      <td className="p-2 text-muted-foreground">
                        {row.category}
                      </td>
                      <td className="p-2 text-right font-mono">{row.target}</td>
                      <td className="p-2 text-muted-foreground">{row.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">
              3 KPI ditemukan. Klik impor untuk melanjutkan.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setStep("upload");
                  setFileName(null);
                }}
              >
                {t("cancel")}
              </Button>
              <Button onClick={handleImport}>Impor 3 KPI</Button>
            </div>
          </div>
        )}

        {step === "importing" && (
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted-foreground border-t-transparent" />
              <p className="text-sm font-medium">Mengimpor data...</p>
              <Progress value={progress} className="w-full h-2" />
              <p className="text-xs text-muted-foreground">
                {Math.round(progress)}%
              </p>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 rounded-full bg-notion-bg-green">
                <CheckCircle2 className="w-6 h-6 text-chart-1" />
              </div>
              <p className="text-sm font-medium">Impor berhasil!</p>
              <p className="text-xs text-muted-foreground">
                3 KPI berhasil diimpor ke sistem.
              </p>
            </div>
            <div className="flex justify-center">
              <Button onClick={handleClose}>Selesai</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
