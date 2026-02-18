"use client";

import { useTranslations } from "next-intl";
import { Sun, Moon, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/hooks/use-theme";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/layout/page-hero";

export function SettingsContent() {
  const t = useTranslations("settings");
  const { theme, setTheme } = useTheme();
  const { locale, setLocale } = useLocale();

  const themeOptions = [
    { key: "light", icon: Sun, label: t("lightMode") },
    { key: "dark", icon: Moon, label: t("darkMode") },
  ] as const;

  const languageOptions = [
    { key: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
    { key: "en", label: "English", flag: "🇺🇸" },
  ] as const;

  return (
    <div className="space-y-5 lg:space-y-6">
      <PageHero
        marker="Control Room"
        badge="Workspace Config"
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <Tabs defaultValue="general">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="general">{t("general")}</TabsTrigger>
          <TabsTrigger value="organization">{t("organization")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("notifications")}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          {/* Theme */}
          <Card className="panel-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                {t("theme")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.key}
                      onClick={() => setTheme(option.key)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all text-sm",
                        theme === option.key
                          ? "border-foreground bg-muted"
                          : "border-transparent hover:bg-muted",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card className="panel-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {t("language")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                {languageOptions.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setLocale(option.key as "id" | "en")}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all text-sm",
                      locale === option.key
                        ? "border-foreground bg-muted"
                        : "border-transparent hover:bg-muted",
                    )}
                  >
                    <span className="text-lg">{option.flag}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="space-y-4 mt-4">
          <Card className="panel-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                {t("organization")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Nama Organisasi</Label>
                <Input defaultValue="PT KIPAS Digital Indonesia" />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input defaultValue="admin@kipas.co.id" type="email" />
              </div>
              <Button size="sm">
                {t("general") === "Umum" ? "Simpan" : "Save"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card className="panel-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                {t("notifications")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Konfigurasi notifikasi akan tersedia di versi berikutnya.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
