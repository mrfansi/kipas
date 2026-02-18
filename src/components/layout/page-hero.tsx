import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  subtitle: string;
  marker?: string;
  badge?: string;
  actions?: ReactNode;
}

export function PageHero({ title, subtitle, marker, badge, actions }: PageHeroProps) {
  return (
    <section className="hero-panel p-5 sm:p-6">
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {marker && (
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/75">
                {marker}
              </p>
            )}
            {badge && (
              <Badge className="rounded-full border-white/25 bg-white/12 text-[10px] text-white hover:bg-white/20">
                {badge}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[30px]">{title}</h1>
          <p className="max-w-2xl text-sm text-slate-100/90">{subtitle}</p>
        </div>
        {actions && <div className={cn("flex flex-wrap gap-2")}>{actions}</div>}
      </div>
    </section>
  );
}
