'use client';

import * as React from 'react';
import { Bell, User, LogOut, Settings } from 'lucide-react';
import TodayGreeting from '@/components/TodayGreeting';
import { PROFIL_MURID, KEHADIRAN_HARI_INI } from '@/lib/data';
import { DigitalStudentCardDialog } from '@/components/modals/DigitalStudentCardDialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function AppHeader() {
  const inisial = PROFIL_MURID.nama
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  return (
    <header className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-emerald-600 via-brand-700 to-indigo-950 px-4.5 pt-4 pb-16 text-white shadow-xl shadow-brand-950/20">
      {/* Ambient background blur spheres */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 -left-12 h-40 w-40 rounded-full bg-emerald-400/20 blur-2xl"
      />

      {/* Identitas SMAN 20 & Dropdown Akun */}
      <div className="relative mb-3.5 flex items-center justify-between border-b border-white/10 pb-2.5 text-[11px]">
        <div className="flex items-center gap-2 text-white/95">
          <div className="grid h-6 w-6 place-items-center rounded-lg bg-white/20 font-black text-[10px] shadow-inner">
            20
          </div>
          <div>
            <span className="font-bold tracking-tight">SMAN 20 Kab. Tangerang</span>
            <span className="ml-1.5 rounded-full bg-emerald-400/20 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-200">
              Fase F
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Notifikasi, 2 pengumuman baru"
            className="relative grid h-8 w-8 place-items-center rounded-full bg-white/10 transition-transform active:scale-95 hover:bg-white/20 dz-interactive-mobile"
          >
            <Bell className="h-4 w-4 text-white" />
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-rose-400 ring-2 ring-emerald-800" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="outline-none ring-offset-2 focus:ring-2 focus:ring-emerald-400 rounded-full active:scale-95 transition"
              >
                <Avatar className="h-7 w-7 ring-1 ring-white/60">
                  <AvatarFallback className="bg-white/20 text-[10px] font-bold text-white">
                    {inisial}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Akun Murid</DropdownMenuLabel>
              <div className="px-2.5 pb-2">
                <p className="text-xs font-bold text-slate-800 truncate">{PROFIL_MURID.nama}</p>
                <p className="text-[10px] text-slate-500 font-mono">NISN: {PROFIL_MURID.nisn}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <User className="h-3.5 w-3.5 text-slate-500" />
                <span>Lihat Profil Lengkap</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Settings className="h-3.5 w-3.5 text-slate-500" />
                <span>Pengaturan PWA</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-rose-600 focus:text-rose-700">
                <LogOut className="h-3.5 w-3.5" />
                <span>Keluar Sesi</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Profil Murid & Salam & Tombol Kartu Pelajar */}
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-12 w-12 ring-2 ring-white/40 shadow-md">
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-700 text-sm font-bold text-white">
              {inisial}
            </AvatarFallback>
          </Avatar>
          <TodayGreeting nama={PROFIL_MURID.nama} />
        </div>

        <DigitalStudentCardDialog />
      </div>

      {/* Status Presensi Hari Ini Badge Banner */}
      <div className="relative mt-3.5 flex items-center justify-between rounded-2xl bg-white/15 px-3 py-2 text-xs backdrop-blur-md border border-white/10">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/90 text-[11px]">
            Presensi: <strong className="text-emerald-200">Hadir</strong> ({KEHADIRAN_HARI_INI.jamMasuk} WIB)
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-200/90 font-medium">
          {KEHADIRAN_HARI_INI.metode}
        </span>
      </div>
    </header>
  );
}
