"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/layout/page-hero";
import { submitCheckin } from "@/lib/actions/checkins";
import { toast } from "sonner";

const moodOptions = [
  {
    key: "great",
    emoji: "🤩",
    color: "bg-notion-bg-green border-notion-green",
  },
  { key: "good", emoji: "😊", color: "bg-notion-bg-blue border-notion-blue" },
  {
    key: "okay",
    emoji: "😐",
    color: "bg-notion-bg-yellow border-notion-yellow",
  },
  {
    key: "struggling",
    emoji: "😰",
    color: "bg-notion-bg-orange border-notion-orange",
  },
  { key: "bad", emoji: "😞", color: "bg-notion-bg-red border-notion-red" },
] as const;

interface CheckinItem {
  id: string;
  weekStart: string;
  mood: string | null;
  accomplishments: string | null;
  blockers: string | null;
  plans: string | null;
  submittedAt: string | null;
  createdAt: string;
}

interface CheckinsContentProps {
  userId: string;
  pastCheckins: CheckinItem[];
}

function getCurrentWeekStart(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  return monday.toISOString().split("T")[0];
}

function getCurrentWeekRange(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const format = (d: Date) =>
    d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  return `${format(monday).split(" ").slice(0, 2).join(" ")} - ${format(friday)}`;
}

export function CheckinsContent({
  userId,
  pastCheckins,
}: CheckinsContentProps) {
  const t = useTranslations("checkins");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [accomplishments, setAccomplishments] = useState("");
  const [blockers, setBlockers] = useState("");
  const [plans, setPlans] = useState("");
  const [privateNotes, setPrivateNotes] = useState("");
  const [isPending, startTransition] = useTransition();

  const getMoodEmoji = (mood: string) => {
    return moodOptions.find((m) => m.key === mood)?.emoji || "😐";
  };

  async function handleSubmit() {
    if (!selectedMood) {
      toast.error("Pilih mood Anda terlebih dahulu");
      return;
    }

    const formData = new FormData();
    formData.set("userId", userId);
    formData.set("weekStart", getCurrentWeekStart());
    formData.set("mood", selectedMood);
    formData.set("accomplishments", accomplishments);
    formData.set("blockers", blockers);
    formData.set("plans", plans);
    formData.set("privateNotes", privateNotes);

    startTransition(async () => {
      const result = await submitCheckin(formData);
      if (result.success) {
        toast.success("Check-in berhasil dikirim!");
        setSelectedMood(null);
        setAccomplishments("");
        setBlockers("");
        setPlans("");
        setPrivateNotes("");
      }
    });
  }

  return (
    <div className="space-y-5 lg:space-y-6">
      <PageHero
        marker="People Ops"
        badge="Weekly Ritual"
        title={t("title")}
        subtitle={t("subtitle")}
      />

      {/* Current Week Check-in */}
      <Card className="panel-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            📝 {t("thisWeek")}
            <Badge variant="outline" className="ml-auto text-[10px]">
              {getCurrentWeekRange()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mood */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("mood")}</label>
            <div className="flex gap-2">
              {moodOptions.map((mood) => (
                <button
                  key={mood.key}
                  onClick={() => setSelectedMood(mood.key)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all",
                    selectedMood === mood.key
                      ? mood.color
                      : "border-transparent hover:bg-muted",
                  )}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {t(mood.key)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Accomplishments */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("accomplishments")}
            </label>
            <Textarea
              value={accomplishments}
              onChange={(e) => setAccomplishments(e.target.value)}
              placeholder="Apa yang berhasil Anda capai minggu ini?"
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Blockers */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("blockers")}</label>
            <Textarea
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              placeholder="Apakah ada hambatan yang menghalangi kemajuan Anda?"
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Plans */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("plans")}</label>
            <Textarea
              value={plans}
              onChange={(e) => setPlans(e.target.value)}
              placeholder="Apa rencana Anda untuk minggu depan?"
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Private Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5">
              🔒 {t("privateNotes")}
            </label>
            <Textarea
              value={privateNotes}
              onChange={(e) => setPrivateNotes(e.target.value)}
              placeholder="Catatan pribadi (hanya Anda yang dapat melihat)"
              rows={2}
              className="resize-none"
            />
          </div>

          <Button
            className="gap-1.5"
            onClick={handleSubmit}
            disabled={isPending}
          >
            <Send className="w-3.5 h-3.5" />
            {isPending ? "Mengirim..." : t("submit")}
          </Button>
        </CardContent>
      </Card>

      {/* Past Check-ins */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Riwayat Check-in
        </h2>
        {pastCheckins.length > 0 ? (
          pastCheckins.map((checkin) => (
            <Card key={checkin.id} className="panel-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">
                    {getMoodEmoji(checkin.mood ?? "okay")}
                  </span>
                  <span className="text-sm font-medium">
                    Minggu{" "}
                    {new Date(checkin.weekStart).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  {checkin.submittedAt && (
                    <span className="text-xs text-muted-foreground ml-auto">
                      Dikirim{" "}
                      {new Date(checkin.submittedAt).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  {checkin.accomplishments && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">
                        ✅ Pencapaian
                      </span>
                      <p className="text-sm mt-0.5">
                        {checkin.accomplishments}
                      </p>
                    </div>
                  )}
                  {checkin.blockers && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">
                        🚧 Hambatan
                      </span>
                      <p className="text-sm mt-0.5">{checkin.blockers}</p>
                    </div>
                  )}
                  {checkin.plans && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">
                        📋 Rencana
                      </span>
                      <p className="text-sm mt-0.5">{checkin.plans}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="panel-card">
            <CardContent className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Belum ada riwayat check-in. Kirim check-in pertama Anda!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
