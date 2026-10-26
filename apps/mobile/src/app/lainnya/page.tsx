'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

type MenuItem = {
  id: string;
  label: string;
  keterangan: string;
  icon: LucideIcon;
  aksen: string;
  href?: string;
};

const MENU_UTAMA: MenuItem[] = [
  {
    id: 'fasilitasi-belajar',
    label: 'Materi KBM',
    keterangan: 'Modul belajar',
    icon: BookOpen,
    aksen: 'bg-emerald-50 text-emerald-800 border-emerald-100',
  },
  {
    id: 'asesmen',
    label: 'Asesmen',
    keterangan: 'Nilai ujian',
    icon: ClipboardList,
    aksen: 'bg-sky-50 text-sky-800 border-sky-100',
  },
  {
    id: 'disiplin-positif',
    label: 'Disiplin',
    keterangan: 'Poin karakter',
    icon: ShieldCheck,
    aksen: 'bg-amber-50 text-amber-800 border-amber-100',
  },
  {
    id: 'perpustakaan',
    label: 'Perpustakaan',
    keterangan: 'Buku digital',
    icon: Library,
    aksen: 'bg-indigo-50 text-indigo-800 border-indigo-100',
  },
  {
    id: 'ekstrakurikuler',
    label: 'Ekskul',
    keterangan: 'Katalog kegiatan',
    icon: Trophy,
    aksen: 'bg-rose-50 text-rose-800 border-rose-100',
    href: '/ekstra',
  },
  {
    id: 'pengumuman',
    label: 'Pengumuman',
    keterangan: 'Warta sekolah',
    icon: Megaphone,
    aksen: 'bg-teal-50 text-teal-800 border-teal-100',
  },
];

const MENU_LAIN: MenuItem[] = [
  {
    id: 'pengaturan',
    label: 'Pengaturan Profil & Akun',
    keterangan: 'Preferensi kependudukan & sandi',
    icon: Settings,
    aksen: 'bg-slate-100 text-slate-700',
    href: '/profil',
  },
  {
    id: 'bantuan',
    label: 'Pusat Bantuan & Panduan',
    keterangan: 'Bantuan teknis aplikasi Dapodik',
    icon: LifeBuoy,
    aksen: 'bg-slate-100 text-slate-700',
  },
];

export default function LainnyaPage() {
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);

  return (
    <>
      <PageHeader title="Menu Ekstra" subtitle="Layanan Mandiri Siswa DZITOE" />

      {/* Modal Informasi Fitur */}
      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full border border-slate-200 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`p-2 rounded-xl ${modalItem.aksen}`}>
                  <modalItem.icon className="w-4 h-4" strokeWidth={1.5} />
                </span>
                <h3 className="font-bold text-sm text-slate-900">{modalItem.label}</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalItem(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Modul <strong>{modalItem.label}</strong> terintegrasi dengan Dapodik dan disiapkan untuk semester berjalan di SMAN 20 Kabupaten Tangerang.
            </p>
            <button
              type="button"
              onClick={() => setModalItem(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6 px-4 pt-4 pb-24 font-sans">
        {/* REKOMENDASI 50: Menu Grid 3-Kolom dengan Stroke Seragam (Lucide 1.5) */}
        <section aria-labelledby="menu-utama-heading">
          <div className="mb-2.5 px-1">
            <h2 id="menu-utama-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Layanan Pembelajaran
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {MENU_UTAMA.map((item) => {
              const Icon = item.icon;
              const content = (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white p-3 text-center shadow-xs transition hover:border-[#087f5b] hover:bg-emerald-50/20 active:scale-[0.98]">
                  <span className={`grid h-11 w-11 place-items-center rounded-xl border ${item.aksen}`}>
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="text-xs font-bold leading-tight text-slate-900 mt-0.5">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-slate-400 line-clamp-1">
                    {item.keterangan}
                  </span>
                </div>
              );

              if (item.href) {
                return (
                  <Link key={item.id} href={item.href} className="block cursor-pointer">
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setModalItem(item)}
                  className="block w-full cursor-pointer text-left"
                >
                  {content}
                </button>
              );
            })}
          </div>
        </section>

        {/* List Tipe Pengaturan (Native Setting Style) */}
        <section aria-labelledby="menu-lain-heading">
          <div className="mb-2.5 px-1">
            <h2 id="menu-lain-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pengaturan & Bantuan
            </h2>
          </div>

          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            {MENU_LAIN.map((item) => {
              const Icon = item.icon;
              const itemContent = (
                <div className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${item.aksen}`}>
                    <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-slate-800">
                      {item.label}
                    </span>
                    <span className="block text-[11px] text-slate-400">
                      {item.keterangan}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                </div>
              );

              if (item.href) {
                return (
                  <li key={item.id}>
                    <Link href={item.href} className="block cursor-pointer">
                      {itemContent}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setModalItem(item)}
                    className="block w-full cursor-pointer"
                  >
                    {itemContent}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <p className="pb-2 text-center text-[11px] text-slate-400 font-mono">
          DZITOE Mobile v1.0.0 • SMAN 20 Kabupaten Tangerang
        </p>
      </div>
    </>
  );
}
