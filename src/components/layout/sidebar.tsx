"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  Target,
  MessageSquareMore,
  ClipboardCheck,
  Database,
  Bell,
  Settings,
  ChevronLeft,
  Search,
  Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

const navItems = [
  { key: "dashboard", href: "/", icon: LayoutDashboard },
  { key: "kpi", href: "/kpi", icon: BarChart3 },
  { key: "goals", href: "/goals", icon: Target },
  { key: "checkins", href: "/checkins", icon: ClipboardCheck },
  { key: "feedback", href: "/feedback", icon: MessageSquareMore },
  { key: "data", href: "/data", icon: Database },
  { key: "alerts", href: "/alerts", icon: Bell },
] as const;

const bottomNavItems = [
  { key: "settings", href: "/settings", icon: Settings },
] as const;

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200 ease-in-out",
        collapsed ? "w-[60px]" : "w-[240px]",
        className,
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center h-14 border-b border-sidebar-border px-3",
          collapsed ? "justify-center" : "gap-2",
        )}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground text-background">
          <Wind className="w-4 h-4" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
              KIPAS
            </span>
            <span className="text-[10px] text-muted-foreground leading-none">
              Performance System
            </span>
          </div>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 py-2">
          <button className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-muted-foreground rounded-md hover:bg-sidebar-accent transition-colors">
            <Search className="w-4 h-4" />
            <span>{t("search")}</span>
            <kbd className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
              ⌘K
            </kbd>
          </button>
        </div>
      )}

      {/* Main Nav */}
      <nav className="flex-1 px-2 py-1 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          const linkContent = (
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors duration-75",
                collapsed && "justify-center px-0",
                active
                  ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  active && "text-sidebar-foreground",
                )}
              />
              {!collapsed && <span>{t(item.key)}</span>}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.key} delayDuration={0}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  {t(item.key)}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.key}>{linkContent}</div>;
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="px-2 pb-2 space-y-0.5">
        {bottomNavItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors duration-75",
                collapsed && "justify-center px-0",
                active
                  ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{t(item.key)}</span>}
            </Link>
          );
        })}

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full justify-center text-muted-foreground hover:text-foreground",
            !collapsed && "justify-start px-2",
          )}
        >
          <ChevronLeft
            className={cn(
              "w-4 h-4 transition-transform",
              collapsed && "rotate-180",
            )}
          />
          {!collapsed && <span className="text-sm ml-2">Tutup Sidebar</span>}
        </Button>
      </div>
    </aside>
  );
}
