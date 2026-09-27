"use client";

import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  FileCheck2,
  HeartHandshake,
  Radio,
  Server,
  Sparkles,
  UserCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityPanelProps {
  open?: boolean;
  onClose?: () => void;
  className?: string;
}

interface NotificationItem {
  id: string;
  type: "asesmen" | "disiplin" | "kehadiran" | "sistem";
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

interface ActivityItem {
  id: string;
  user: string;
  role: string;
  action: string;
  target: string;
  time: string;
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "asesmen",
    title: "Asesmen Formatif Masuk",
    description: "Nilai kelas X-1 Matematika telah disinkronkan oleh Dra. Siti Aminah.",
    time: "10 mnt lalu",
    unread: true,
  },
  {
    id: "notif-2",
    type: "disiplin",
    title: "Apresiasi Disiplin Positif",
    description: "12 Murid kelas XI-2 mencatatkan poin pembiasaan kepedulian lingkungan.",
    time: "25 mnt lalu",
    unread: true,
  },
  {
    id: "notif-3",
    type: "kehadiran",
    title: "Pengajuan Izin Murid",
    description: "Adinda Prameswari (X-1) mengajukan izin surat dokter terverifikasi.",
    time: "1 jam lalu",
    unread: false,
  },
  {
    id: "notif-4",
    type: "sistem",
    title: "Sinkronisasi PWA Mobile",
    description: "Layanan apps/mobile (:3001) tersinkronisasi sempurna.",
    time: "2 jam lalu",
    unread: false,
  },
];

const ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    user: "Budi Pratama, S.Pd",
    role: "Guru Bahasa",
    action: "Memperbarui materi",
    target: "Fasilitasi Belajar XI-3",
    time: "5 mnt lalu",
  },
  {
    id: "act-2",
    user: "Dewi Lestari, M.Pd",
    role: "Wali Kelas X-1",
    action: "Memvalidasi rubrik",
    target: "Perkembangan Murid",
    time: "18 mnt lalu",
  },
  {
    id: "act-3",
    user: "Ahmad Zaelani",
    role: "Operator IT",
    action: "Backup database",
    target: "Port 5433 (PostgreSQL)",
    time: "42 mnt lalu",
  },
];

export function ActivityPanel({ onClose, className }: ActivityPanelProps) {
  const [activeTab, setActiveTab] = useState<"notifikasi" | "aktivitas">("notifikasi");

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <aside
      aria-label="Panel Aktivitas dan Notifikasi"
      className={cn(
        "flex h-full w-full flex-col border-l border-slate-200/90 bg-white/95 backdrop-blur-md",
        className
      )}
    >
      {/* Header Panel */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 px-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Panel Terpadu</h2>
            <p className="text-[11px] text-slate-500">SMAN 20 Kab. Tangerang</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            <Radio className="h-2.5 w-2.5 animate-pulse text-emerald-500" />
            Live
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
              aria-label="Tutup panel aktivitas"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="border-b border-slate-100 px-4 py-2.5">
        <div className="flex rounded-xl bg-slate-100/90 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("notifikasi")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all",
              activeTab === "notifikasi"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            <span>Notifikasi</span>
            {unreadCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("aktivitas")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all",
              activeTab === "aktivitas"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            <span>Aktivitas</span>
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-200 px-1 text-[10px] font-bold text-slate-600">
              {ACTIVITIES.length}
            </span>
          </button>
        </div>
      </div>

      {/* Content List */}
      <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto p-4">
        {activeTab === "notifikasi" ? (
          <div className="space-y-2.5">
            {NOTIFICATIONS.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "group relative rounded-xl border p-3.5 transition-all dz-interactive",
                  item.unread
                    ? "border-brand-200/80 bg-brand-50/40 hover:bg-brand-50/70"
                    : "border-slate-100 bg-white hover:border-slate-200"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {item.type === "asesmen" && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-700">
                        <FileCheck2 className="h-3.5 w-3.5" />
                      </span>
                    )}
                    {item.type === "disiplin" && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-100 text-violet-700">
                        <HeartHandshake className="h-3.5 w-3.5" />
                      </span>
                    )}
                    {item.type === "kehadiran" && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                        <UserCheck className="h-3.5 w-3.5" />
                      </span>
                    )}
                    {item.type === "sistem" && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-100 text-sky-700">
                        <Server className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <h3 className="text-xs font-bold text-slate-800">{item.title}</h3>
                  </div>

                  <span className="flex items-center gap-1 text-[10px] tabular-nums text-slate-400">
                    <Clock className="h-3 w-3" />
                    {item.time}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <ol className="relative space-y-4 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-px before:bg-slate-200">
              {ACTIVITIES.map((act) => (
                <li key={act.id} className="relative flex gap-3 pl-1">
                  <span className="relative z-10 mt-1 h-5 w-5 shrink-0 rounded-full border-2 border-white bg-brand-600 text-white grid place-items-center shadow-xs">
                    <Sparkles className="h-2.5 w-2.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="truncate text-xs font-bold text-slate-900">{act.user}</p>
                      <span className="text-[10px] text-slate-400 tabular-nums">{act.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{act.role}</p>
                    <p className="mt-1 rounded-lg bg-slate-50 p-2 text-xs text-slate-700 border border-slate-100">
                      {act.action}: <strong className="font-semibold text-slate-900">{act.target}</strong>
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* System Status Footer Card */}
      <div className="border-t border-slate-200/80 bg-slate-50/70 p-4">
        <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700">Status DZITOE</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              Stabil
            </span>
          </div>
          <div className="mt-2 space-y-1 text-[11px] text-slate-500">
            <div className="flex justify-between">
              <span>Admin Dashboard:</span>
              <span className="font-mono font-semibold text-slate-800">:3000</span>
            </div>
            <div className="flex justify-between">
              <span>Mobile PWA:</span>
              <span className="font-mono font-semibold text-slate-800">:3001</span>
            </div>
            <div className="flex justify-between">
              <span>Database (PostgreSQL):</span>
              <span className="font-mono font-semibold text-slate-800">:5433</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default ActivityPanel;
