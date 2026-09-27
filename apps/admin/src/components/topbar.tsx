"use client";

import {
  Bell,
  ChevronDown,
  HelpCircle,
  Menu,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TopbarProps {
  onMenuClick: () => void;
  onToggleActivityPanel?: () => void;
  activityPanelOpen?: boolean;
}

export function Topbar({
  onMenuClick,
  onToggleActivityPanel,
  activityPanelOpen = false,
}: TopbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200/80",
        "bg-white/80 px-4 backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-white/75",
        "sm:px-6 lg:px-8 transition-colors",
      )}
    >
      {/* Toggle sidebar (mobile/tablet) */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Buka menu navigasi"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition-transform active:scale-95 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Judul konteks / Breadcrumb */}
        <div className="hidden min-w-0 flex-col sm:flex">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-bold tracking-tight text-slate-900">
              Dashboard Tata Kelola
            </span>
            <span className="inline-flex items-center rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
              Admin Utama
            </span>
          </div>
          <span className="truncate text-[11px] text-slate-500">
            SMAN 20 Kabupaten Tangerang · Permendikdasmen 2026
          </span>
        </div>
      </div>

      {/* Pencarian Global Modern dengan shortcut */}
      <div className="relative hidden w-full max-w-md md:block mx-4">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Cari Murid (Siswa), Guru, Fasilitasi Belajar…"
          aria-label="Pencarian global"
          className={cn(
            "h-10 w-full rounded-xl border border-slate-200/90 bg-slate-50/80 pl-9 pr-16",
            "text-sm text-slate-800 placeholder:text-slate-400",
            "transition-all duration-200",
            "hover:border-slate-300 hover:bg-white",
            "focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20",
          )}
        />
        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 hidden items-center gap-0.5 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:flex">
          <kbd>Ctrl</kbd>
          <span>+</span>
          <kbd>K</kbd>
        </div>
      </div>

      {/* Aksi kanan */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          aria-label="Pusat bantuan"
          title="Dokumentasi & Bantuan"
          className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:flex"
        >
          <HelpCircle className="h-5 w-5" />
        </button>

        {/* Toggle Panel Aktivitas / Notifikasi */}
        {onToggleActivityPanel && (
          <button
            type="button"
            onClick={onToggleActivityPanel}
            aria-label={activityPanelOpen ? "Tutup panel aktivitas" : "Buka panel aktivitas"}
            title="Panel Notifikasi & Aktivitas"
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-xl transition-all",
              activityPanelOpen
                ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <Bell className="h-5 w-5" />
            <span
              aria-hidden="true"
              className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"
            />
          </button>
        )}

        <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

        {/* Profil Admin */}
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-xl p-1 pr-2 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label="Menu akun administrator"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-indigo-600 text-xs font-bold text-white shadow-xs">
            AD
          </span>
          <span className="hidden min-w-0 flex-col items-start text-left xl:flex">
            <span className="truncate text-xs font-bold text-slate-900">
              Administrator IT
            </span>
            <span className="truncate text-[11px] text-slate-500">
              Super Admin · SMAN 20
            </span>
          </span>
          <ChevronDown className="hidden h-4 w-4 shrink-0 text-slate-400 xl:block" />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
