"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  Send,
  Star,
  Lightbulb,
  AlertCircle,
  Eye,
  EyeOff,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/layout/page-hero";
import { sendFeedback } from "@/lib/actions/feedback";
import { toast } from "sonner";

const feedbackTypes = [
  {
    key: "praise",
    icon: Star,
    color: "bg-notion-bg-yellow text-notion-yellow",
    label: "Pujian",
  },
  {
    key: "suggestion",
    icon: Lightbulb,
    color: "bg-notion-bg-blue text-notion-blue",
    label: "Saran",
  },
  {
    key: "concern",
    icon: AlertCircle,
    color: "bg-notion-bg-orange text-notion-orange",
    label: "Kekhawatiran",
  },
] as const;

interface FeedbackItem {
  id: string;
  from: string;
  type: "praise" | "suggestion" | "concern";
  content: string;
  isAnonymous: boolean;
  createdAt: string;
}

interface UserOption {
  id: string;
  name: string;
}

interface FeedbackContentProps {
  userId: string;
  receivedFeedback: FeedbackItem[];
  sentFeedback: FeedbackItem[];
  users: UserOption[];
}

export function FeedbackContent({
  userId,
  receivedFeedback,
  sentFeedback,
  users,
}: FeedbackContentProps) {
  const t = useTranslations("feedback");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const getTypeConfig = (type: string) => {
    return feedbackTypes.find((ft) => ft.key === type) || feedbackTypes[0];
  };

  async function handleSendFeedback() {
    if (!selectedType || !message || !selectedRecipient) return;

    const formData = new FormData();
    formData.set("fromUserId", userId);
    formData.set("toUserId", selectedRecipient);
    formData.set("type", selectedType);
    formData.set("content", message);
    formData.set("isAnonymous", String(isAnonymous));

    startTransition(async () => {
      const result = await sendFeedback(formData);
      if (result.success) {
        toast.success("Umpan balik berhasil dikirim!");
        setSelectedType(null);
        setMessage("");
        setSelectedRecipient("");
        setIsAnonymous(false);
      }
    });
  }

  return (
    <div className="space-y-5 lg:space-y-6">
      <PageHero
        marker="People Ops"
        badge="Culture Signals"
        title={t("title")}
        subtitle={t("subtitle")}
      />

      {/* Give Feedback */}
      <Card className="panel-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">{t("give")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Type Selection */}
          <div className="flex gap-2">
            {feedbackTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.key}
                  onClick={() => setSelectedType(type.key)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all text-sm",
                    selectedType === type.key
                      ? type.color
                      : "border-transparent hover:bg-muted",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              );
            })}
          </div>

          {/* Recipient */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("to")}</label>
            <Select
              value={selectedRecipient}
              onValueChange={setSelectedRecipient}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih penerima" />
              </SelectTrigger>
              <SelectContent>
                {users
                  .filter((u) => u.id !== userId)
                  .map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("message")}</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis umpan balik Anda..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={cn(
                "flex items-center gap-2 text-sm px-3 py-1.5 rounded-md transition-colors",
                isAnonymous
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {isAnonymous ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
              {t("anonymous")}
            </button>
            <Button
              className="gap-1.5"
              disabled={
                !selectedType || !message || !selectedRecipient || isPending
              }
              onClick={handleSendFeedback}
            >
              <Send className="w-3.5 h-3.5" />
              {isPending ? "Mengirim..." : "Kirim"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Received/Sent Feedback */}
      <Tabs defaultValue="received">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="received">{t("received")}</TabsTrigger>
          <TabsTrigger value="sent">{t("sent")}</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-3 mt-3">
          {receivedFeedback.length > 0 ? (
            receivedFeedback.map((fb) => {
              const config = getTypeConfig(fb.type);
              const Icon = config.icon;
              return (
                <Card key={fb.id} className="panel-card">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-[10px] bg-muted">
                          {fb.isAnonymous
                            ? "?"
                            : fb.from
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{fb.from}</span>
                          <Badge
                            variant="outline"
                            className={`text-[10px] h-5 gap-1 ${config.color}`}
                          >
                            <Icon className="w-3 h-3" />
                            {config.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {new Date(fb.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                              },
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1.5">
                          {fb.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-3 rounded-full bg-muted mb-3">
                <MessageSquare className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm">
                Belum ada umpan balik diterima
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-3 mt-3">
          {sentFeedback.length > 0 ? (
            sentFeedback.map((fb) => {
              const config = getTypeConfig(fb.type);
              const Icon = config.icon;
              return (
                <Card key={fb.id} className="panel-card">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-[10px] bg-muted">
                          {fb.from
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            Ke: {fb.from}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-[10px] h-5 gap-1 ${config.color}`}
                          >
                            <Icon className="w-3 h-3" />
                            {config.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {new Date(fb.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                              },
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1.5">
                          {fb.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-3 rounded-full bg-muted mb-3">
                <MessageSquare className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm">
                Belum ada umpan balik terkirim
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Mulai dengan memberikan umpan balik di atas
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
