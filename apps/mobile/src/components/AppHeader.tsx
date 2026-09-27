import { Bell, CheckCircle2, GraduationCap } from 'lucide-react';

import Avatar from '@/components/Avatar';
import TodayGreeting from '@/components/TodayGreeting';
import { KEHADIRAN_HARI_INI, PROFIL_MURID } from '@/lib/data';

export default function AppHeader() {
  return (
    <header className="relative overflow-hidden rounded-b-4xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-900 px-4 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] pb-20 text-white shadow-xl shadow-brand-950/20">
      {/* Dekorasi latar glassmorphism */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 -left-12 h-40 w-40 rounded-full bg-emerald-400/20 blur-2xl"
      />

      {/* Identitas Sekolah Baris Atas */}
      <div className="relative mb-3 flex items-center justify-between border-b border-white/10 pb-2.5 text-[11px]">
        <div className="flex items-center gap-1.5 text-white/90">
          <div className="grid h-5 w-5 place-items-center rounded-md bg-white/20 font-bold text-[10px]">
            20
          </div>
          <span className="font-semibold tracking-wide">SMAN 20 Kab. Tangerang</span>
        </div>
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-emerald-200 backdrop-blur-xs">
          DZITOE Mobile
        </span>
      </div>

      {/* Profil Murid & Notifikasi */}
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative">
            <Avatar
              nama={PROFIL_MURID.nama}
              className="h-12 w-12 text-sm ring-2 ring-white/40 shadow-sm"
            />
            <span
              className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-brand-700"
              title="Online"
              aria-hidden="true"
            />
          </div>
          <TodayGreeting nama={PROFIL_MURID.nama} />
        </div>

        <button
          type="button"
          aria-label="Notifikasi, 2 pesan baru"
          className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 transition-transform active:scale-95 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 dz-interactive-mobile"
        >
          <Bell className="h-5 w-5 text-white" aria-hidden="true" />
          <span
            className="absolute top-2 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-brand-700"
            aria-hidden="true"
          >
            2
          </span>
        </button>
      </div>

      {/* Chips Informasi Murid */}
      <div className="relative mt-4 flex flex-wrap items-center gap-2 text-[11px] font-medium">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-xs">
          <GraduationCap className="h-3.5 w-3.5 text-white/80" aria-hidden="true" />
          Kelas {PROFIL_MURID.kelas}
        </span>

        <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-xs">
          NISN: {PROFIL_MURID.nisn}
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/25 px-2.5 py-1 text-emerald-100 backdrop-blur-xs">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
          {KEHADIRAN_HARI_INI.label} · {KEHADIRAN_HARI_INI.jamMasuk}
        </span>
      </div>
    </header>
  );
}
