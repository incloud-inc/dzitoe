import { Bell, CheckCircle2, GraduationCap } from 'lucide-react';

import Avatar from '@/components/Avatar';
import TodayGreeting from '@/components/TodayGreeting';
import { KEHADIRAN_HARI_INI, PROFIL_MURID } from '@/lib/data';

export default function AppHeader() {
  return (
    <header className="relative overflow-hidden rounded-b-4xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 px-4 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] pb-20 text-white">
      {/* Dekorasi latar */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-16 -left-12 h-40 w-40 rounded-full bg-brand-400/20 blur-2xl"
      />

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar
            nama={PROFIL_MURID.nama}
            className="h-11 w-11 text-sm ring-2 ring-white/30"
          />
          <TodayGreeting nama={PROFIL_MURID.nama} />
        </div>

        <button
          type="button"
          aria-label="Notifikasi"
          className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <Bell className="h-5 w-5" aria-hidden />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-brand-700" />
        </button>
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-2 text-[11px] font-medium">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">
          <GraduationCap className="h-3.5 w-3.5" aria-hidden />
          {PROFIL_MURID.kelas}
        </span>

        <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">
          NISN {PROFIL_MURID.nisn}
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/25 px-2.5 py-1 text-emerald-50 backdrop-blur">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
          {KEHADIRAN_HARI_INI.label} · {KEHADIRAN_HARI_INI.jamMasuk}
        </span>
      </div>
    </header>
  );
}
