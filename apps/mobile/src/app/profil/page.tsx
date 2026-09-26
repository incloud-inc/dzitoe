import type { Metadata } from 'next';
import {
  BellRing,
  ChevronRight,
  Fingerprint,
  LogOut,
  Mail,
  Phone,
  School,
  Settings,
  UserRound,
} from 'lucide-react';

import Avatar from '@/components/Avatar';
import PageHeader from '@/components/PageHeader';
import SectionHeader from '@/components/SectionHeader';
import { PROFIL_MURID } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Profil',
  description: 'Profil Murid DZITOE SMAN 20 Kabupaten Tangerang.',
};

const INFO_PROFIL = [
  { label: 'NISN', value: PROFIL_MURID.nisn, icon: Fingerprint },
  { label: 'Kelas', value: PROFIL_MURID.kelas, icon: School },
  { label: 'Wali Kelas', value: PROFIL_MURID.waliKelas, icon: UserRound },
  { label: 'Surel', value: PROFIL_MURID.email, icon: Mail },
  { label: 'Telepon', value: PROFIL_MURID.telepon, icon: Phone },
];

const MENU_PROFIL = [
  { id: 'pengaturan', label: 'Pengaturan Akun', icon: Settings },
  { id: 'notifikasi', label: 'Preferensi Notifikasi', icon: BellRing },
];

export default function ProfilPage() {
  return (
    <>
      <PageHeader title="Profil" subtitle="Akun Murid" />

      <div className="space-y-6 px-4 pt-4">
        <section className="rounded-3xl border border-slate-200/80 bg-white p-4 text-center shadow-card">
          <Avatar
            nama={PROFIL_MURID.nama}
            className="mx-auto h-20 w-20 text-xl shadow-lg shadow-brand-600/20 ring-4 ring-brand-50"
          />
          <h2 className="mt-3 text-base font-semibold text-slate-900">
            {PROFIL_MURID.nama}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {PROFIL_MURID.kelas} · NISN {PROFIL_MURID.nisn}
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold text-brand-700">
            Murid Aktif
          </span>
        </section>

        <section aria-labelledby="data-murid-heading">
          <SectionHeader id="data-murid-heading" title="Data Murid" />
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
            {INFO_PROFIL.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label} className="flex items-center gap-3 px-4 py-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-slate-500">{item.label}</p>
                    <p className="truncate text-sm font-medium text-slate-900">
                      {item.value}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="pengaturan-heading">
          <SectionHeader id="pengaturan-heading" title="Pengaturan" />
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
            {MENU_PROFIL.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="flex-1 text-sm font-medium text-slate-800">
                      {item.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 active:scale-[0.99]"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Keluar dari Akun
        </button>

        <p className="pb-2 text-center text-[11px] text-slate-400">
          DZITOE Mobile v0.1.0 · SMAN 20 Kabupaten Tangerang
        </p>
      </div>
    </>
  );
}
