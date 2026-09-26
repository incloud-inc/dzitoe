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
}

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200",
        "bg-white/85 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-white/70",
        "sm:px-6 lg:px-8",
      )}
    >
      {/* Toggle sidebar (mobile) */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Buka menu navigasi"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Judul konteks */}
      <div className="hidden min-w-0 flex-col lg:flex">
        <span className="truncate text-sm font-semibold tracking-tight text-slate-900">
          Ruang Kerja Admin
        </span>
        <span className="truncate text-[11px] text-slate-500">
          DZITOE · SMAN 20 Kabupaten Tangerang
        </span>
      </div>

      {/* Pencarian */}
      <div className="relative ml-auto hidden w-full max-w-sm md:block lg:mx-6">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Cari Murid (Siswa), Guru, Asesmen…"
          aria-label="Pencarian global"
          className={cn(
            "h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-4",
            "text-sm text-slate-800 placeholder:text-slate-400",
            "transition-all duration-200",
            "hover:border-slate-300 hover:bg-white",
            "focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20",
          )}
        />
      </div>

      {/* Aksi kanan */}
      <div className="ml-auto flex items-center gap-1.5 md:ml-0">
        <button
          type="button"
          aria-label="Pusat bantuan"
          className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:flex"
        >
          <HelpCircle className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Notifikasi"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <Bell className="h-5 w-5" />
          <span
            aria-hidden="true"
            className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"
          />
        </button>

        <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl p-1 pr-2 transition-colors hover:bg-slate-100"
          aria-label="Menu akun"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-violet-600 text-xs font-bold text-white">
            AD
          </span>
          <span className="hidden min-w-0 flex-col items-start text-left lg:flex">
            <span className="truncate text-xs font-semibold text-slate-900">
              Administrator
            </span>
            <span className="truncate text-[11px] text-slate-500">
              Super Admin
            </span>
          </span>
          <ChevronDown className="hidden h-4 w-4 shrink-0 text-slate-400 lg:block" />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
