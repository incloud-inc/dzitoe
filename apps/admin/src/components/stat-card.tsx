import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { clampPercent, cn } from "@/lib/utils";

export type StatTone =
  | "brand"
  | "emerald"
  | "amber"
  | "sky"
  | "violet"
  | "rose";

export interface StatTrend {
  value: string;
  direction: "up" | "down" | "flat";
  label?: string;
}

export interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  icon: LucideIcon;
  tone?: StatTone;
  trend?: StatTrend;
  progress?: number;
}

const iconTone: Record<StatTone, string> = {
  brand: "bg-brand-50 text-brand-900 ring-brand-200",
  emerald: "bg-brand-50 text-brand-700 ring-brand-200",
  amber: "bg-warm-50 text-warm-900 ring-warm-200",
  sky: "bg-brand-50 text-brand-800 ring-brand-100",
  violet: "bg-brand-100/70 text-brand-900 ring-brand-200",
  rose: "bg-warm-100 text-warm-900 ring-warm-200",
};

const glowTone: Record<StatTone, string> = {
  brand: "bg-brand-400",
  emerald: "bg-brand-300",
  amber: "bg-warm-400",
  sky: "bg-brand-200",
  violet: "bg-brand-400",
  rose: "bg-warm-400",
};

const barTone: Record<StatTone, string> = {
  brand: "from-brand-900 via-brand-600 to-brand-400",
  emerald: "from-brand-700 via-brand-500 to-brand-300",
  amber: "from-warm-700 via-warm-600 to-warm-400",
  sky: "from-brand-600 to-brand-300",
  violet: "from-brand-800 to-brand-500",
  rose: "from-warm-800 to-warm-400",
};

const trendTone = {
  up: "bg-brand-50 text-brand-900 font-bold ring-1 ring-brand-200",
  down: "bg-warm-50 text-warm-900 font-bold ring-1 ring-warm-200",
  flat: "bg-neutral-100 text-neutral-700 font-bold ring-1 ring-neutral-200",
} as const;

function TrendIcon({ direction }: { direction: StatTrend["direction"] }) {
  if (direction === "up") return <ArrowUpRight className="h-3.5 w-3.5" />;
  if (direction === "down") return <ArrowDownRight className="h-3.5 w-3.5" />;
  return <Minus className="h-3.5 w-3.5" />;
}

export function StatCard({
  label,
  value,
  unit,
  hint,
  icon: Icon,
  tone = "brand",
  trend,
  progress,
}: StatCardProps) {
  const safeProgress =
    typeof progress === "number" ? clampPercent(progress) : undefined;

  return (
    <article
      role="region"
      aria-label={`Statistik ${label}`}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
        "transition-all duration-300 ease-out-expo dz-interactive",
        "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md",
        "animate-fade-in-up",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-[0.10] blur-2xl transition-opacity duration-300 group-hover:opacity-20",
          glowTone[tone],
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            {label}
          </p>

          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums sm:text-[1.75rem]">
              {value}
            </span>
            {unit ? (
              <span className="text-sm font-semibold text-slate-500">
                {unit}
              </span>
            ) : null}
          </div>

          {hint ? (
            <p className="mt-1 text-xs text-slate-500">{hint}</p>
          ) : null}
        </div>

        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1",
            iconTone[tone],
          )}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" strokeWidth={2.25} />
        </span>
      </div>

      <div className="relative mt-4 flex items-center gap-2">
        {trend ? (
          <span
            className={cn(
              "dz-chip",
              trendTone[trend.direction],
            )}
          >
            <TrendIcon direction={trend.direction} />
            {trend.value}
          </span>
        ) : null}

        {trend?.label ? (
          <span className="truncate text-xs text-slate-500">
            {trend.label}
          </span>
        ) : null}
      </div>

      {typeof safeProgress === "number" ? (
        <div className="relative mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={cn(
                "h-full rounded-full bg-gradient-to-r transition-[width] duration-700 ease-out-expo",
                barTone[tone],
              )}
              style={{ width: `${safeProgress}%` }}
            />
          </div>
        </div>
      ) : null}
    </article>
  );
}
