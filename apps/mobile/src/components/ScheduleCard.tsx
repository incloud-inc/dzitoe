import { MapPin, UserRound } from 'lucide-react';

import { JADWAL_HARI_INI } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function ScheduleCard() {
  if (JADWAL_HARI_INI.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-center">
        <p className="text-sm font-medium text-slate-600">
          Belum ada jadwal fasilitasi belajar hari ini.
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Manfaatkan waktu untuk literasi dan jaga Disiplin Positif.
        </p>
      </div>
    );
  }

  return (
    <ol className="space-y-2.5">
      {JADWAL_HARI_INI.map((item) => (
        <li
          key={item.id}
          className="flex gap-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3 shadow-card"
        >
          <span
            aria-hidden
            className={cn('w-1.5 shrink-0 rounded-full', item.warna)}
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="truncate text-sm font-semibold text-slate-900">
                {item.mataFasilitasi}
              </p>
              <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                {item.jamMulai}–{item.jamSelesai}
              </span>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <UserRound className="h-3.5 w-3.5" aria-hidden />
                {item.pendidik}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {item.ruang}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
