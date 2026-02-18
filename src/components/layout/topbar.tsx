"use client";

import { useTranslations } from "next-intl";
import { Bell, Globe, Moon, Search, Sparkles, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";
import { useLocale } from "@/hooks/use-locale";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";

interface TopbarProps {
  userEmail?: string;
  userName?: string;
}

const titleByPath: Record<string, string> = {
  "/": "Executive Dashboard",
  "/kpi": "KPI Command",
  "/goals": "Goal Delivery",
  "/checkins": "Weekly Pulse",
  "/feedback": "Feedback Loop",
  "/data": "Data Connectors",
  "/alerts": "Alert Watch",
  "/settings": "Control Room",
};

export function Topbar({ userEmail, userName }: TopbarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale } = useLocale();

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const pageTitle = titleByPath[pathname] ?? "Operations";

  return (
    <header className="glass-topbar flex h-[70px] items-center gap-3 px-4 sm:px-6">
      <div className="hidden min-w-0 lg:block">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Active Workspace
        </p>
        <h2 className="truncate text-base font-semibold">{pageTitle}</h2>
      </div>

      <div className="relative min-w-0 flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("search")}
          className="h-10 rounded-xl border-border/80 bg-background/65 pl-9"
        />
      </div>

      <Button variant="outline" size="sm" className="hidden gap-1.5 rounded-xl lg:flex">
        <Sparkles className="h-3.5 w-3.5" /> Brief
      </Button>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocale(locale === "id" ? "en" : "id")}
          className="h-9 gap-1.5 rounded-xl px-2.5 text-muted-foreground hover:text-foreground"
        >
          <Globe className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase">{locale}</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-9 gap-2 rounded-xl pl-1.5 pr-2.5">
              <Avatar className="w-7 h-7">
                <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {userName && <span className="text-xs font-semibold hidden sm:inline">{userName}</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t("profile")}</DropdownMenuItem>
            <DropdownMenuItem>{t("settings")}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">{t("logout")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
