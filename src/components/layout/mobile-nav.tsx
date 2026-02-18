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
  Bell,
  MoreHorizontal,
} from "lucide-react";

const mobileNavItems = [
  { key: "dashboard", href: "/", icon: LayoutDashboard },
  { key: "kpi", href: "/kpi", icon: BarChart3 },
  { key: "goals", href: "/goals", icon: Target },
  { key: "checkins", href: "/checkins", icon: ClipboardCheck },
  { key: "alerts", href: "/alerts", icon: Bell },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around border-t border-border bg-background/95 backdrop-blur-sm safe-bottom">
      {mobileNavItems.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 py-2 px-3 text-[10px] transition-colors",
              active ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <Icon className={cn("w-5 h-5", active && "text-foreground")} />
            <span>{t(item.key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
