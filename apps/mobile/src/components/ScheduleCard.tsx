import { MapPin, Radio, UserRound } from 'lucide-react';

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
      {JADWAL_HARI_INI.map((item, index) => {
        const isOngoing = index === 1; // Sesi ke-2 sebagai simulasi sesi aktif saat ini

        return (
          <li
            key={item.id}
            className={cn(
              'group relative flex gap-3 overflow-hidden rounded-2xl border bg-white p-3.5 shadow-card transition-all dz-interactive-mobile',
              isOngoing
                ? 'border-brand-300 bg-brand-50/20 ring-1 ring-brand-400/30'
                : 'border-slate-200/90 hover:border-slate-300',
            )}
          >
            <span
              aria-hidden="true"
              className={cn('w-1.5 shrink-0 rounded-full', item.warna)}
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {item.mataFasilitasi}
                  </p>
                  {isOngoing && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      <Radio className="h-2.5 w-2.5 animate-pulse text-emerald-600" />
                      Aktif Sekarang
                    </span>
                  )}
                </div>

                <span
                  className={cn(
                    'shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold tabular-nums',
                    isOngoing
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600',
                  )}
                >
                  {item.jamMulai}–{item.jamSelesai}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <UserRound className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  <span>{item.pendidik}</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  <span>{item.ruang}</span>
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
