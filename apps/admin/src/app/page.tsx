"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpenCheck,
  CalendarCheck,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  Clock,
  Download,
  Filter,
  GraduationCap,
  HeartHandshake,
  Info,
  Megaphone,
  Plus,
  Radio,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { TrendChart } from "@/components/trend-chart";

import { DashboardShell } from "@/components/dashboard-shell";
import { ProgressBar } from "@/components/progress-bar";
import { SectionCard } from "@/components/section-card";
import { StatCard } from "@/components/stat-card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateID, getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

const AGENDA_HARI_INI = [
  {
    waktu: "07.00",
    judul: "Pembiasaan Disiplin Positif & Apresiasi Pagi",
    lokasi: "Lapangan Utama SMAN 20",
    tag: "Karakter",
  },
  {
    waktu: "10.15",
    judul: "Fasilitasi Belajar — Bahasa Indonesia (Literasi)",
    lokasi: "Ruang Kelas XI-3",
    tag: "Akademik",
  },
  {
    waktu: "13.00",
    judul: "Rapat Refleksi Perkembangan Murid Bersama Wali Kelas",
    lokasi: "Ruang Guru & Multimedia",
    tag: "Evaluasi",
  },
];

const tagTone: Record<string, string> = {
  Karakter: "bg-brand-50 text-brand-900 ring-1 ring-brand-200/60 font-semibold",
  Asesmen: "bg-warm-50 text-warm-900 ring-1 ring-warm-200/60 font-semibold",
  Akademik: "bg-brand-100/60 text-brand-800 ring-1 ring-brand-200/60 font-semibold",
  Evaluasi: "bg-neutral-100 text-neutral-800 ring-1 ring-neutral-200/60 font-semibold",
};

export default function AdminDashboardPage() {
  const [selectedKelas, setSelectedKelas] = useState("Semua Kelas");
  const hariIni = formatDateID(new Date());

  return (
    <TooltipProvider delayDuration={150}>
      <DashboardShell>
        <div className="space-y-6">
          {/* Header Dashboard & Quick Action Bar */}
          <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-900 ring-1 ring-brand-200">
                  <CalendarDays className="h-3.5 w-3.5 text-brand-600" />
                  {hariIni}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-900 ring-1 ring-brand-200">
                  <Radio className="h-2.5 w-2.5 animate-pulse text-brand-600" />
                  Tahun Ajaran 2025/2026 Aktif
                </span>
              </div>

              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
                Dashboard Tata Kelola Sekolah
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Pusat data operasional harian <strong>SMAN 20 Kabupaten Tangerang</strong> sesuai{" "}
                <strong className="font-semibold text-slate-700">Permendikdasmen No. 1–6 Tahun 2026</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Radix Dropdown Filter Kelas */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="dz-btn-ghost text-xs">
                    <Filter className="h-3.5 w-3.5 text-slate-400" />
                    <span>{selectedKelas}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedKelas("Semua Kelas")}>
                    Semua Tingkat Kelas
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedKelas("Kelas X (Fase E)")}>
                    Kelas X (Fase E)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedKelas("Kelas XI (Fase F)")}>
                    Kelas XI (Fase F)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedKelas("Kelas XII (Fase F)")}>
                    Kelas XII (Fase F)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button type="button" className="dz-btn-ghost text-xs">
                <Download className="h-3.5 w-3.5" />
                <span>Unduh Laporan</span>
              </button>

              <button type="button" className="dz-btn-primary text-xs">
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Murid</span>
              </button>
            </div>
          </div>

          {/* Stat Cards Grid (3 Cards dengan Radix Tooltip) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <StatCard
                    label="Total Murid (Siswa)"
                    value="1.250"
                    hint="Tahun Ajaran 2025/2026"
                    icon={Users}
                    tone="brand"
                    trend={{ value: "+3,2%", direction: "up", label: "vs semester lalu" }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                1.250 Murid aktif terverifikasi NISN & Dapodik SMAN 20
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <StatCard
                    label="Guru & Tenaga Kependidikan"
                    value="85"
                    hint="Pendidik & Tendik Sekolah"
                    icon={GraduationCap}
                    tone="violet"
                    trend={{ value: "+2", direction: "up", label: "guru baru" }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                85 Pendidik siap memfasilitasi belajar kurikulum 2026
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/presensi" className="block transition hover:scale-[1.01] active:scale-[0.99]">
                  <StatCard
                    label="Kehadiran Hari Ini"
                    value="94,6"
                    unit="%"
                    hint="1.183 dari 1.250 Murid Hadir"
                    icon={CalendarCheck}
                    tone="emerald"
                    progress={94.6}
                    trend={{ value: "+1,4%", direction: "up", label: "vs kemarin" }}
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                Klik untuk membuka Monitoring Presensi Real-Time SMAN 20
              </TooltipContent>
            </Tooltip>

          </div>

          {/* Bagian Tabs telah dihapus sesuai instruksi audit fitur */}

          {/* Agenda & Pengumuman Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <SectionCard
              className="lg:col-span-2"
              title="Agenda Terjadwal Hari Ini"
              description="SMAN 20 Kabupaten Tangerang · Waktu Indonesia Barat"
              action={
                <span className="dz-chip bg-slate-100 text-slate-600 font-bold ring-1 ring-slate-200">
                  <Clock className="h-3.5 w-3.5" />
                  WIB
                </span>
              }
            >
              <ol className="relative space-y-4 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-slate-200">
                {AGENDA_HARI_INI.map((agenda) => (
                  <li key={agenda.judul} className="relative flex gap-3 pl-1">
                    <span
                      aria-hidden="true"
                      className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white bg-brand-900 ring-2 ring-brand-200"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold tabular-nums text-slate-900">{agenda.waktu}</span>
                        <span className={cn("dz-chip px-2 py-0.5 text-[10px] font-bold", tagTone[agenda.tag])}>
                          {agenda.tag}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-bold text-slate-800">{agenda.judul}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{agenda.lokasi}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </SectionCard>

            <SectionCard title="Pengumuman Internal" description="Informasi Pendidik & Tendik">
              <div className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-warm-50 text-warm-800 ring-1 ring-warm-200">
                  <Megaphone className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 leading-snug">
                    Sinkronisasi Asesmen Sumatif Ganjil
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Seluruh Guru diminta melengkapi rubrik <strong>Perkembangan Murid</strong> sebelum batas akhir penyerahan laporan capaian belajar.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-3.5 py-3">
                <span className="text-xs font-semibold text-slate-600">Kesiapan Pengisian Sekolah</span>
                <span className="text-xs font-extrabold tabular-nums text-brand-900">78%</span>
              </div>
              <ProgressBar className="mt-2" value={78} />
            </SectionCard>
          </div>
        </div>
      </DashboardShell>
    </TooltipProvider>
  );
}
