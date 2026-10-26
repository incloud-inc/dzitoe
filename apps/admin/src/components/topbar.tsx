"use client";

import {
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/lib/auth-context";

function getInitials(name?: string): string {
  if (!name) return "AD";
  const parts = name.trim().split(/\s+/);
  const first = parts[0] || "A";
  if (parts.length === 1) return first.slice(0, 2).toUpperCase();
  const last = parts[parts.length - 1] || first;
  return ((first[0] || "A") + (last[0] || "D")).toUpperCase();
}

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
  const { user, roleLabel } = useAuth();
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center border-b border-slate-200/80",
        "bg-white/80 backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-white/75",
        "transition-colors",
      )}
    >
      <div className="flex flex-1 min-w-0 items-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1240px] flex items-center justify-between gap-3">
          {/* Toggle sidebar (mobile/tablet) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Buka menu navigasi"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition-transform active:scale-95 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex-1 max-w-3xl mx-2 md:mx-4">
        {/* Search bar dihapus sesuai instruksi audit */}
      </div>

      {/* Aksi kanan */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Dark Mode Toggle (Task A4.12) */}
        <ThemeToggle />

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
                ? "bg-brand-50 text-brand-900 ring-1 ring-brand-300 shadow-xs"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <Bell className="h-5 w-5" />
            <span
              aria-hidden="true"
              className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-warm-600 ring-2 ring-white"
            />
          </button>
        )}

        <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

        {/* Profil Admin & Logout */}
        <div className="flex items-center gap-1">
          <div
            className="flex items-center gap-2.5 rounded-xl p-1 pr-2 transition-colors hover:bg-slate-100"
            aria-label="Informasi akun administrator"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-900 to-brand-600 text-xs font-bold text-white shadow-xs">
              {getInitials(user?.name)}
            </span>
            <span className="hidden min-w-0 flex-col items-start text-left xl:flex">
              <span className="truncate text-xs font-bold text-slate-900">
                {user?.name || "Administrator IT"}
              </span>
              <span className="truncate text-[11px] text-slate-500">
                {roleLabel} · SMAN 20
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              window.location.href = '/login';
            }}
            title="Keluar dari sesi"
            className="flex h-9 items-center gap-1.5 px-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition border border-transparent hover:border-red-100 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
        </div>
      </div>

      {/* Kolom Penyeimbang Right Activity Panel pada layar 2xl (>= 1440px) */}
      <div className="hidden 2xl:block 2xl:w-[320px] 2xl:shrink-0" />
    </header>
  );
}

export default Topbar;
