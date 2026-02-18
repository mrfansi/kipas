"use client";

import { useState, useTransition } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createGoal } from "@/lib/actions/goals";
import { toast } from "sonner";

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

interface GoalItem {
  id: string;
  title: string;
  description: string | null;
  status: "not_started" | "in_progress" | "at_risk" | "completed" | "cancelled";
  progress: number;
  owner: string;
  ownerId: string | null;
  dueDate: string | null;
  startDate: string | null;
  linkedKpis: number;
}

interface UserOption {
  id: string;
  name: string;
}

interface GoalsContentProps {
  goals: GoalItem[];
  users: UserOption[];
}

export function GoalsContent({ goals, users }: GoalsContentProps) {
  const t = useTranslations("goals");
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [isPending, startTransition] = useTransition();
  const completedGoals = goals.filter(
    (goal) => goal.status === "completed",
  ).length;

  async function handleCreateGoal(formData: FormData) {
    startTransition(async () => {
      const result = await createGoal(formData);
      if (result.success) {
        toast.success("Tujuan berhasil dibuat");
        setShowNewDialog(false);
      }
    });
  }

  return (
    <div className="space-y-5 lg:space-y-6">
      <PageHero
        marker="Planning"
        badge={`${completedGoals}/${goals.length} closed`}
        title={t("title")}
        subtitle={t("subtitle")}
        actions={
          <Button
            size="sm"
            className="h-9 gap-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100"
            onClick={() => setShowNewDialog(true)}
          >
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
            const count = goals.filter((g) => g.status === key).length;
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
        {goals.length > 0 ? (
          goals.map((goal) => {
            const config = statusConfig[goal.status];
            const StatusIcon = config.icon;
            const isOverdue =
              goal.dueDate &&
              new Date(goal.dueDate) < new Date() &&
              goal.status !== "completed";

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
                        {goal.dueDate && (
                          <div
                            className={`flex items-center gap-1.5 text-xs ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}
                          >
                            <Calendar className="w-3 h-3" />
                            {new Date(goal.dueDate).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </div>
                        )}
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
          })
        ) : (
          <Card className="panel-card">
            <CardContent className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Belum ada tujuan. Buat tujuan pertama Anda!
              </p>
              <Button
                size="sm"
                className="mt-4 gap-1.5"
                onClick={() => setShowNewDialog(true)}
              >
                <Plus className="w-3.5 h-3.5" /> {t("addNew")}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* New Goal Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Buat Tujuan Baru</DialogTitle>
          </DialogHeader>
          <form action={handleCreateGoal}>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label>Judul</Label>
                <Input
                  name="title"
                  placeholder="Contoh: Meningkatkan Revenue 20%"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Deskripsi</Label>
                <Textarea
                  name="description"
                  placeholder="Deskripsi tujuan..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Tanggal Mulai</Label>
                  <Input name="startDate" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label>Tanggal Selesai</Label>
                  <Input name="dueDate" type="date" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Pemilik</Label>
                <Select name="ownerId">
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pemilik" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewDialog(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
