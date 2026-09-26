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
    aksen: 'bg-brand-50 text-brand-700',
  },
  {
    id: 'disiplin-positif',
    label: 'Disiplin Positif',
    nilai: '128',
    keterangan: 'Poin apresiasi',
    icon: Award,
    aksen: 'bg-amber-50 text-amber-600',
  },
  {
    id: 'asesmen',
    label: 'Nilai Asesmen',
    nilai: '88,4',
    keterangan: 'Formatif & sumatif',
    icon: TrendingUp,
    aksen: 'bg-sky-50 text-sky-600',
  },
];

export default function StatGrid() {
  return (
    <ul className="grid grid-cols-3 gap-3">
      {STATS.map((item) => {
        const Icon = item.icon;
        return (
          <li
            key={item.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-card"
          >
            <span
              className={cn(
                'grid h-8 w-8 place-items-center rounded-xl',
                item.aksen,
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <p className="mt-2 text-base font-semibold leading-none text-slate-900">
              {item.nilai}
            </p>
            <p className="mt-1 text-[11px] font-medium leading-tight text-slate-600">
              {item.label}
            </p>
            <p className="mt-0.5 text-[10px] leading-tight text-slate-400">
              {item.keterangan}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
