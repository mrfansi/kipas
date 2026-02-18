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
  PanelLeftClose,
  PanelLeftOpen,
  Orbit,
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

const navGroups = [
  {
    label: "Execution",
    items: [
      { key: "dashboard", href: "/", icon: LayoutDashboard },
      { key: "kpi", href: "/kpi", icon: BarChart3 },
      { key: "goals", href: "/goals", icon: Target },
      { key: "alerts", href: "/alerts", icon: Bell },
      { key: "data", href: "/data", icon: Database },
    ],
  },
  {
    label: "People Ops",
    items: [
      { key: "checkins", href: "/checkins", icon: ClipboardCheck },
      { key: "feedback", href: "/feedback", icon: MessageSquareMore },
    ],
  },
] as const;

const bottomNavItems = [{ key: "settings", href: "/settings", icon: Settings }] as const;

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
        "relative hidden md:flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-out",
        collapsed ? "w-[82px]" : "w-[268px]",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center h-16 border-b border-sidebar-border px-4",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <Orbit className="w-4 h-4" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <p className="text-[11px] uppercase tracking-[0.16em] text-sidebar-foreground/70">
                Executive Suite
              </p>
              <p className="text-sm font-semibold tracking-tight">KIPAS HQ</p>
            </div>
          )}
        </div>

        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(true)}
            className="h-8 w-8 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        )}

        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(false)}
            className="absolute top-4 right-2 h-7 w-7 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <PanelLeftOpen className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-1.5">
            {!collapsed && (
              <p className="px-2 text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/50">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              const linkContent = (
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center rounded-xl text-sm transition-all px-2.5 py-2",
                    collapsed ? "justify-center" : "gap-2.5",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
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
          </div>
        ))}
      </nav>

      <div className="px-3 pb-4">
        {bottomNavItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex items-center rounded-xl text-sm transition-colors px-2.5 py-2",
                collapsed ? "justify-center" : "gap-2.5",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{t(item.key)}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
