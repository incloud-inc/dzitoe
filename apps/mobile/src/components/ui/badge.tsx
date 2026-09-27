import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'danger' | 'purple' | 'outline';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-800 border-slate-200/60',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/60',
    info: 'bg-sky-50 text-sky-700 border-sky-200/60',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/60',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/60',
    outline: 'border-slate-300 text-slate-700',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
