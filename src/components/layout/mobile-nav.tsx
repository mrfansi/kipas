"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  Target,
  Bell,
  Settings,
} from "lucide-react";

const mobileNavItems = [
  { key: "dashboard", href: "/", icon: LayoutDashboard },
  { key: "kpi", href: "/kpi", icon: BarChart3 },
  { key: "goals", href: "/goals", icon: Target },
  { key: "alerts", href: "/alerts", icon: Bell },
  { key: "settings", href: "/settings", icon: Settings },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-border/80 bg-background/90 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-5 gap-1 px-2 py-1.5">
        {mobileNavItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{t(item.key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
