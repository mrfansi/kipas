"use client";

import { useTranslations } from "next-intl";
import { Bell, Globe, Moon, Sun } from "lucide-react";
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

interface TopbarProps {
  userEmail?: string;
  userName?: string;
}

export function Topbar({ userEmail, userName }: TopbarProps) {
  const t = useTranslations("nav");
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

  return (
    <header className="flex items-center h-12 px-4 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex-1" />

      <div className="flex items-center gap-1">
        {/* Language Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocale(locale === "id" ? "en" : "id")}
          className="text-muted-foreground hover:text-foreground h-8 px-2 gap-1.5"
        >
          <Globe className="w-4 h-4" />
          <span className="text-xs font-medium uppercase">{locale}</span>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground h-8 w-8"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground h-8 w-8 relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 h-8 pl-1 pr-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {userName && (
                <span className="text-xs font-medium hidden sm:inline">
                  {userName}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t("profile")}</DropdownMenuItem>
            <DropdownMenuItem>{t("settings")}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
