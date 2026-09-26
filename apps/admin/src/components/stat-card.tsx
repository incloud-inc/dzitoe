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
  brand: "bg-brand-50 text-brand-600 ring-brand-100",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  amber: "bg-amber-50 text-amber-600 ring-amber-100",
  sky: "bg-sky-50 text-sky-600 ring-sky-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
  rose: "bg-rose-50 text-rose-600 ring-rose-100",
};

const glowTone: Record<StatTone, string> = {
  brand: "bg-brand-400",
  emerald: "bg-emerald-400",
  amber: "bg-amber-400",
  sky: "bg-sky-400",
  violet: "bg-violet-400",
  rose: "bg-rose-400",
};

const barTone: Record<StatTone, string> = {
  brand: "from-brand-600 to-brand-400",
  emerald: "from-emerald-600 to-emerald-400",
  amber: "from-amber-600 to-amber-400",
  sky: "from-sky-600 to-sky-400",
  violet: "from-violet-600 to-violet-400",
  rose: "from-rose-600 to-rose-400",
};

const trendTone = {
  up: "bg-emerald-50 text-emerald-700",
  down: "bg-rose-50 text-rose-700",
  flat: "bg-slate-100 text-slate-600",
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
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-card",
        "transition-all duration-300 ease-out-expo",
        "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-card-hover",
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
