import { clampPercent, cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number;
  className?: string;
  barClassName?: string;
  label?: string;
}

export function ProgressBar({
  value,
  className,
  barClassName,
  label,
}: ProgressBarProps) {
  const safe = clampPercent(value);

  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-slate-100",
        className,
      )}
      role="progressbar"
      aria-label={label}
      aria-valuenow={safe}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full bg-gradient-to-r from-brand-600 to-violet-500 transition-[width] duration-700 ease-out-expo",
          barClassName,
        )}
        style={{ width: `${safe}%` }}
      />
    </div>
  );
}
