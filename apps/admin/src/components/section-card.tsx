import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "flex flex-col rounded-2xl border border-slate-200 bg-white shadow-card",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold tracking-tight text-slate-900">
            {title}
          </h2>
          {description ? (
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div className={cn("flex-1 p-5", bodyClassName)}>{children}</div>
    </section>
  );
}
