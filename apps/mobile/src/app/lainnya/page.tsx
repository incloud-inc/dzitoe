import type { Metadata } from 'next';
import {
  BookOpen,
  ChevronRight,
  ClipboardList,
  LifeBuoy,
  Library,
  Megaphone,
  Settings,
  ShieldCheck,
  Trophy,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import PageHeader from '@/components/PageHeader';
import SectionHeader from '@/components/SectionHeader';

export const metadata: Metadata = {
  title: 'Lainnya',
  description: 'Menu layanan DZITOE Mobile untuk Murid.',
};

type MenuItem = {
  id: string;
  label: string;
  keterangan: string;
  icon: LucideIcon;
  aksen: string;
};

const MENU_UTAMA: MenuItem[] = [
  {
    id: 'fasilitasi-belajar',
    label: 'Fasilitasi Belajar',
    keterangan: 'Materi & modul',
    icon: BookOpen,
    aksen: 'bg-brand-50 text-brand-700',
  },
  {
    id: 'asesmen',
    label: 'Asesmen',
    keterangan: 'Formatif & sumatif',
    icon: ClipboardList,
    aksen: 'bg-sky-50 text-sky-600',
  },
  {
    id: 'disiplin-positif',
    label: 'Disiplin Positif',
    keterangan: 'Poin & apresiasi',
    icon: ShieldCheck,
    aksen: 'bg-amber-50 text-amber-600',
  },
  {
    id: 'perpustakaan',
    label: 'Perpustakaan',
    keterangan: 'Katalog digital',
    icon: Library,
    aksen: 'bg-violet-50 text-violet-600',
  },
  {
    id: 'ekstrakurikuler',
    label: 'Ekstrakurikuler',
    keterangan: 'Pendaftaran & jadwal',
    icon: Trophy,
    aksen: 'bg-rose-50 text-rose-600',
  },
  {
    id: 'pengumuman',
    label: 'Pengumuman',
    keterangan: 'Informasi sekolah',
    icon: Megaphone,
    aksen: 'bg-teal-50 text-teal-600',
  },
];

const MENU_LAIN: MenuItem[] = [
  {
    id: 'pengaturan',
    label: 'Pengaturan',
    keterangan: 'Preferensi aplikasi',
    icon: Settings,
    aksen: 'bg-slate-100 text-slate-600',
  },
  {
    id: 'bantuan',
    label: 'Bantuan',
    keterangan: 'Panduan & dukungan',
    icon: LifeBuoy,
    aksen: 'bg-slate-100 text-slate-600',
  },
];

export default function LainnyaPage() {
  return (
    <>
      <PageHeader title="Lainnya" subtitle="Layanan DZITOE Mobile" />

      <div className="space-y-6 px-4 pt-4">
        <section aria-labelledby="menu-utama-heading">
          <SectionHeader id="menu-utama-heading" title="Layanan Murid" />

          <ul className="grid grid-cols-2 gap-3">
            {MENU_UTAMA.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className="flex h-full w-full flex-col items-start gap-2 rounded-2xl border border-slate-200/80 bg-white p-3.5 text-left shadow-card transition hover:border-brand-200 hover:bg-brand-50/40 active:scale-[0.99]"
                  >
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-xl ${item.aksen}`}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="text-[13px] font-semibold leading-snug text-slate-900">
                      {item.label}
                    </span>
                    <span className="text-[11px] leading-tight text-slate-500">
                      {item.keterangan}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="menu-lain-heading">
          <SectionHeader id="menu-lain-heading" title="Lainnya" />

          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
            {MENU_LAIN.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                  >
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${item.aksen}`}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-slate-800">
                        {item.label}
                      </span>
                      <span className="block text-[11px] text-slate-500">
                        {item.keterangan}
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <p className="pb-2 text-center text-[11px] text-slate-400">
          DZITOE Mobile v0.1.0 · SMAN 20 Kabupaten Tangerang
        </p>
      </div>
    </>
  );
}
