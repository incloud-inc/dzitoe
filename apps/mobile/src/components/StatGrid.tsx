import { Award, CalendarCheck, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type StatItem = {
  id: string;
  label: string;
  nilai: string;
  keterangan: string;
  icon: LucideIcon;
  aksen: string;
};

const STATS: StatItem[] = [
  {
    id: 'kehadiran',
    label: 'Kehadiran',
    nilai: '96%',
    keterangan: 'Bulan ini',
    icon: CalendarCheck,
    aksen: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50',
  },
  {
    id: 'disiplin-positif',
    label: 'Disiplin Positif',
    nilai: '128',
    keterangan: 'Poin apresiasi',
    icon: Award,
    aksen: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/50',
  },
  {
    id: 'asesmen',
    label: 'Asesmen Murid',
    nilai: '88,4',
    keterangan: 'Rata-rata formatif',
    icon: TrendingUp,
    aksen: 'bg-brand-50 text-brand-700 ring-1 ring-brand-200/50',
  },
];

export default function StatGrid() {
  return (
    <ul className="grid grid-cols-3 gap-2.5">
      {STATS.map((item) => {
        const Icon = item.icon;
        return (
          <li
            key={item.id}
            className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-card transition-all dz-interactive-mobile hover:border-slate-300"
          >
            <span
              className={cn(
                'grid h-8 w-8 place-items-center rounded-xl shadow-2xs',
                item.aksen,
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="mt-2 text-base font-bold leading-none text-slate-900 tabular-nums">
              {item.nilai}
            </p>
            <p className="mt-1 text-[11px] font-semibold leading-tight text-slate-700 truncate">
              {item.label}
            </p>
            <p className="mt-0.5 text-[10px] leading-tight text-slate-400 truncate">
              {item.keterangan}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
