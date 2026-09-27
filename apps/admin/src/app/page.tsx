"use client";

import { useState } from "react";
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
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

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

const TREND_DATA = [
  { bulan: "Jul", asesmen: 74, kehadiran: 93 },
  { bulan: "Agu", asesmen: 78, kehadiran: 95 },
  { bulan: "Sep", asesmen: 82, kehadiran: 94 },
  { bulan: "Okt", asesmen: 80, kehadiran: 96 },
  { bulan: "Nov", asesmen: 86, kehadiran: 95 },
  { bulan: "Des", asesmen: 89, kehadiran: 97 },
];

const KEHADIRAN_MINGGUAN = [
  { hari: "Sen", persentase: 92, hadir: 1150 },
  { hari: "Sel", persentase: 95, hadir: 1188 },
  { hari: "Rab", persentase: 89, hadir: 1113 },
  { hari: "Kam", persentase: 96, hadir: 1200 },
  { hari: "Jum", persentase: 94, hadir: 1175 },
];

const DISIPLIN_POSITIF = [
  { label: "Apresiasi Kehadiran Tepat Waktu", value: 96, detail: "1.183 Murid" },
  { label: "Partisipasi Fasilitasi Belajar", value: 88, detail: "1.045 Murid" },
  { label: "Kepatuhan Kesepakatan Kelas", value: 92, detail: "1.098 Murid" },
  { label: "Refleksi Diri & Restitusi Karakter", value: 74, detail: "918 Murid" },
];

const PERKEMBANGAN_MURID = [
  {
    nis: "2026001",
    nama: "Adinda Prameswari",
    kelas: "X-1",
    predikat: "Sangat Berkembang",
    nilai: 92,
    kehadiran: 98,
    catatan: "Aktif memimpin diskusi kelompok matematika",
  },
  {
    nis: "2026002",
    nama: "Bagas Nurwansyah",
    kelas: "XI-3",
    predikat: "Berkembang Baik",
    nilai: 84,
    kehadiran: 95,
    catatan: "Peningkatan signifikan dalam literasi ilmiah",
  },
  {
    nis: "2026003",
    nama: "Chika Rahmadani",
    kelas: "XII-2",
    predikat: "Sangat Berkembang",
    nilai: 90,
    kehadiran: 97,
    catatan: "Konsisten menjalankan pembiasaan disiplin positif",
  },
  {
    nis: "2026004",
    nama: "Dimas Aryasatya",
    kelas: "X-4",
    predikat: "Mulai Berkembang",
    nilai: 71,
    kehadiran: 88,
    catatan: "Memerlukan pendampingan tambahan topik aljabar",
  },
  {
    nis: "2026005",
    nama: "Elvira Kusumawardhani",
    kelas: "XI-1",
    predikat: "Berkembang Baik",
    nilai: 86,
    kehadiran: 94,
    catatan: "Karya portofolio sains terpilih tingkat sekolah",
  },
];

const AGENDA_HARI_INI = [
  {
    waktu: "07.00",
    judul: "Pembiasaan Disiplin Positif & Apresiasi Pagi",
    lokasi: "Lapangan Utama SMAN 20",
    tag: "Karakter",
  },
  {
    waktu: "08.30",
    judul: "Asesmen Formatif — Matematika Peminatan",
    lokasi: "Laboratorium Komputer & Kelas X-1",
    tag: "Asesmen",
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

const FASILITASI_AKTIF = [
  { label: "Matematika", kelas: 8, murid: 296, value: 88, pendidik: "Dra. Siti Aminah" },
  { label: "Bahasa Indonesia", kelas: 7, murid: 254, value: 78, pendidik: "Budi Pratama, S.Pd" },
  { label: "IPA Terpadu", kelas: 6, murid: 218, value: 68, pendidik: "Dr. Hendra Gunawan" },
];

const predikatTone: Record<string, string> = {
  "Sangat Berkembang": "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60",
  "Berkembang Baik": "bg-brand-50 text-brand-700 ring-1 ring-brand-200/60",
  "Mulai Berkembang": "bg-amber-50 text-amber-700 ring-1 ring-amber-200/60",
};

const tagTone: Record<string, string> = {
  Karakter: "bg-violet-50 text-violet-700",
  Asesmen: "bg-amber-50 text-amber-700",
  Akademik: "bg-brand-50 text-brand-700",
  Evaluasi: "bg-sky-50 text-sky-700",
};

export default function AdminDashboardPage() {
  const [selectedKelas, setSelectedKelas] = useState("Semua Kelas");
  const hariIni = formatDateID(new Date());

  return (
    <TooltipProvider delayDuration={150}>
      <DashboardShell>
        <div className="space-y-6">
          {/* Header Dashboard & Quick Action Bar */}
          <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-gradient-to-r from-white via-slate-50 to-brand-50/30 p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {hariIni}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                  <Radio className="h-2.5 w-2.5 animate-pulse text-emerald-500" />
                  Tahun Ajaran 2025/2026 Aktif
                </span>
              </div>

              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
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

          {/* Stat Cards Grid (4 Cards dengan Radix Tooltip) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                <div>
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
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Presensi realtime diverifikasi biometrik & geolokasi mobile
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <StatCard
                    label="Asesmen Berjalan"
                    value="12"
                    hint="4 Sumatif · 8 Formatif"
                    icon={ClipboardCheck}
                    tone="amber"
                    trend={{ value: "+3", direction: "up", label: "minggu ini" }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Asesmen kurikulum 2026 memprioritaskan pemahaman bermakna
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Radix UI Interactive Tabs Section */}
          <Tabs defaultValue="perkembangan" className="w-full">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-3">
              <TabsList>
                <TabsTrigger value="perkembangan">
                  <TrendingUp className="h-4 w-4" />
                  <span>Perkembangan Murid & Asesmen</span>
                </TabsTrigger>
                <TabsTrigger value="kehadiran">
                  <CalendarCheck className="h-4 w-4" />
                  <span>Kehadiran & Disiplin Positif</span>
                </TabsTrigger>
                <TabsTrigger value="fasilitasi">
                  <BookOpenCheck className="h-4 w-4" />
                  <span>Fasilitasi Belajar Aktif</span>
                </TabsTrigger>
              </TabsList>

              <span className="text-xs text-slate-500 font-medium">
                Pembaruan otomatis tiap 5 menit
              </span>
            </div>

            {/* TAB 1: Perkembangan Murid & Tren Asesmen */}
            <TabsContent value="perkembangan" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Grafik Tren Capaian Asesmen (Recharts AreaChart) */}
                <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card lg:col-span-2">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Tren Asesmen & Kehadiran Semester Ini
                      </h2>
                      <p className="text-xs text-slate-500">
                        Rata-rata capaian kompetensi Murid (Siswa) SMAN 20
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-brand-700">
                        <span className="h-3 w-3 rounded-full bg-brand-600" />
                        Capaian Asesmen (%)
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <span className="h-3 w-3 rounded-full bg-emerald-500" />
                        Kehadiran (%)
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorAsesmen" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorKehadiran" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="bulan" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                        <YAxis domain={[50, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderRadius: "12px",
                            border: "none",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                        />
                        <Area type="monotone" dataKey="asesmen" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAsesmen)" name="Asesmen" />
                        <Area type="monotone" dataKey="kehadiran" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorKehadiran)" name="Kehadiran" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Highlight Disiplin Positif Card */}
                <div className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-gradient-to-br from-brand-600 via-indigo-600 to-violet-700 p-6 text-white shadow-card">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
                      <Sparkles className="h-3.5 w-3.5" />
                      Penguatan Karakter
                    </span>
                    <h3 className="mt-4 text-xl font-bold">Disiplin Positif Murid</h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/80">
                      Pendekatan pembiasaan mandiri tanpa hukuman fisik/verbal, berfokus pada restitusi dan kesepakatan kelas.
                    </p>
                  </div>

                  <div className="mt-6 rounded-2xl bg-white/10 p-4 backdrop-blur-xs">
                    <p className="text-[11px] uppercase tracking-wider text-white/70">Total Poin Apresiasi</p>
                    <p className="mt-1 text-3xl font-extrabold tabular-nums">12.480</p>
                    <p className="mt-1 text-xs text-emerald-200">
                      ↑ 8,4% peningkatan perilaku positif bulan ini
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabel Perkembangan Murid Terbaru */}
              <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-card">
                <div className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Data Perkembangan Murid (Siswa) Terbaru
                    </h3>
                    <p className="text-xs text-slate-500">
                      Diperbarui real-time dari guru mata pelajaran & asesmen formatif
                    </p>
                  </div>
                  <button type="button" className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700">
                    <span>Lihat Semua 1.250 Murid</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="scrollbar-thin overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="px-5 py-3">Murid</th>
                        <th className="px-5 py-3">Kelas</th>
                        <th className="px-5 py-3">Predikat Capaian</th>
                        <th className="px-5 py-3">Nilai Asesmen</th>
                        <th className="px-5 py-3">Kehadiran</th>
                        <th className="px-5 py-3">Catatan Pembiasaan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {PERKEMBANGAN_MURID.map((m) => (
                        <tr key={m.nis} className="transition-colors hover:bg-slate-50/80">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xs font-bold text-brand-700">
                                {getInitials(m.nama)}
                              </span>
                              <div>
                                <p className="font-bold text-slate-800">{m.nama}</p>
                                <p className="text-[11px] text-slate-400">NIS: {m.nis}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-slate-600">{m.kelas}</td>
                          <td className="px-5 py-3.5">
                            <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", predikatTone[m.predikat])}>
                              {m.predikat}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <ProgressBar value={m.nilai} className="h-1.5 w-16" />
                              <span className="text-xs font-bold tabular-nums text-slate-700">{m.nilai}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-xs font-bold tabular-nums text-slate-700">{m.kehadiran}%</td>
                          <td className="px-5 py-3.5 text-xs text-slate-500 max-w-xs truncate">{m.catatan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: Kehadiran & Disiplin Positif */}
            <TabsContent value="kehadiran" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <SectionCard
                  className="lg:col-span-2"
                  title="Rekap Kehadiran Mingguan Murid"
                  description="5 hari kerja terakhir · rata-rata 93,2%"
                  action={
                    <span className="dz-chip bg-emerald-50 text-emerald-700 font-bold">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Tren Positif
                    </span>
                  }
                >
                  <div className="flex items-end gap-3 sm:gap-6 pt-4">
                    {KEHADIRAN_MINGGUAN.map((item) => (
                      <div key={item.hari} className="group flex flex-1 flex-col items-center gap-2">
                        <span className="text-xs font-bold tabular-nums text-slate-700">{item.persentase}%</span>
                        <div className="relative flex h-36 w-full items-end overflow-hidden rounded-xl bg-slate-100">
                          <div
                            className="w-full rounded-xl bg-gradient-to-t from-brand-600 via-brand-500 to-indigo-400 transition-all duration-500 group-hover:from-brand-700 group-hover:to-indigo-500"
                            style={{ height: `${item.persentase}%` }}
                          />
                        </div>
                        <div className="text-center">
                          <span className="block text-xs font-bold text-slate-700">{item.hari}</span>
                          <span className="block text-[11px] tabular-nums text-slate-400">{item.hadir}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-sky-100 bg-sky-50/70 p-3.5">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                    <p className="text-xs leading-relaxed text-sky-900/90">
                      Kehadiran murid dipantau via Mobile PWA (:3001) berbasis verifikasi GPS dan swafoto. Murid yang tidak hadir didampingi secara suportif melalui pendekatan <strong>Disiplin Positif</strong>.
                    </p>
                  </div>
                </SectionCard>

                <SectionCard
                  title="Indikator Disiplin Positif"
                  description="4 Dimensi Penguatan Karakter"
                  action={
                    <span className="dz-chip bg-violet-50 text-violet-700 font-bold">
                      <HeartHandshake className="h-3.5 w-3.5" />
                      Bulan Ini
                    </span>
                  }
                >
                  <ul className="space-y-4 pt-2">
                    {DISIPLIN_POSITIF.map((item) => (
                      <li key={item.label}>
                        <div className="flex items-center justify-between gap-3">
                          <span className="truncate text-xs font-semibold text-slate-700">{item.label}</span>
                          <span className="shrink-0 text-xs font-bold tabular-nums text-slate-900">{item.value}%</span>
                        </div>
                        <ProgressBar className="mt-2" value={item.value} label={item.label} />
                        <p className="mt-1 text-[11px] text-slate-400">{item.detail}</p>
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              </div>
            </TabsContent>

            {/* TAB 3: Fasilitasi Belajar Aktif */}
            <TabsContent value="fasilitasi" className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {FASILITASI_AKTIF.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-card transition-all hover:border-brand-300">
                    <div className="flex items-center gap-2">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
                        <Target className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{item.label}</p>
                        <p className="text-[11px] text-slate-400">{item.pendidik}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-2xl font-extrabold tabular-nums text-slate-900">
                      {item.kelas} <span className="text-xs font-normal text-slate-500">sesi kelas</span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{item.murid} Murid berpartisipasi</p>
                    <ProgressBar className="mt-3" value={item.value} />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Agenda & Pengumuman Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <SectionCard
              className="lg:col-span-2"
              title="Agenda Terjadwal Hari Ini"
              description="SMAN 20 Kabupaten Tangerang · Waktu Indonesia Barat"
              action={
                <span className="dz-chip bg-slate-100 text-slate-600 font-bold">
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
                      className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white bg-brand-600 ring-2 ring-brand-200"
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
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
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
                <span className="text-xs font-extrabold tabular-nums text-brand-700">78%</span>
              </div>
              <ProgressBar className="mt-2" value={78} />
            </SectionCard>
          </div>
        </div>
      </DashboardShell>
    </TooltipProvider>
  );
}
