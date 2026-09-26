import { ChevronRight, Megaphone } from 'lucide-react';

import { PENGUMUMAN, type KategoriPengumuman } from '@/lib/data';
import { cn } from '@/lib/utils';

const WARNA_KATEGORI: Record<KategoriPengumuman, string> = {
  Akademik: 'bg-sky-50 text-sky-700',
  'Disiplin Positif': 'bg-brand-50 text-brand-700',
  Asesmen: 'bg-violet-50 text-violet-700',
  Umum: 'bg-slate-100 text-slate-600',
};

export default function AnnouncementList() {
  return (
    <ul className="space-y-2.5">
      {PENGUMUMAN.map((item) => (
        <li key={item.id}>
          <article className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-card">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <Megaphone className="h-4 w-4" aria-hidden />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      WARNA_KATEGORI[item.kategori],
                    )}
                  >
                    {item.kategori}
                  </span>
                  <span className="text-[10px] text-slate-400">{item.waktu}</span>
                </div>

                <h3 className="mt-1 text-sm font-semibold leading-snug text-slate-900">
                  {item.judul}
                </h3>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                  {item.ringkas}
                </p>
              </div>

              <ChevronRight
                className="mt-1 h-4 w-4 shrink-0 text-slate-300"
                aria-hidden
              />
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
