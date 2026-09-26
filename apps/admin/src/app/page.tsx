import {
  ArrowUpRight,
  BookOpenCheck,
  CalendarCheck,
  CalendarDays,
  ClipboardCheck,
  Clock,
  Download,
  GraduationCap,
  HeartHandshake,
  Info,
  Megaphone,
  Plus,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard-shell";
import { ProgressBar } from "@/components/progress-bar";
import { SectionCard } from "@/components/section-card";
import { StatCard } from "@/components/stat-card";
import { formatDateID, getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const KEHADIRAN_MINGGUAN = [
  { hari: "Sen", persentase: 92, hadir: 1150 },
  { hari: "Sel", persentase: 95, hadir: 1188 },
  { hari: "Rab", persentase: 89, hadir: 1113 },
  { hari: "Kam", persentase: 96, hadir: 1200 },
  { hari: "Jum", persentase: 94, hadir: 1175 },
] as const;

const DISIPLIN_POSITIF = [
  { label: "Apresiasi Kehadiran Tepat Waktu", value: 96, detail: "1.183 Murid" },
  { label: "Partisipasi Pengalaman Belajar", value: 88, detail: "1.045 Murid" },
  { label: "Kepatuhan Kesepakatan Kelas", value: 92, detail: "1.098 Murid" },
  { label: "Refleksi Diri & Restitusi", value: 74, detail: "918 Murid" },
] as const;

const PERKEMBANGAN_MURID = [
  {
    nama: "Adinda Prameswari",
    kelas: "X-1",
    predikat: "Sangat Berkembang",
    nilai: 92,
    kehadiran: 98,
  },
  {
    nama: "Bagas Nurwansyah",
    kelas: "XI-3",
    predikat: "Berkembang Baik",
    nilai: 84,
    kehadiran: 95,
  },
  {
    nama: "Chika Rahmadani",
    kelas: "XII-2",
    predikat: "Sangat Berkembang",
    nilai: 90,
    kehadiran: 97,
  },
  {
    nama: "Dimas Aryasatya",
    kelas: "X-4",
    predikat: "Mulai Berkembang",
    nilai: 71,
    kehadiran: 88,
  },
  {
    nama: "Elvira Kusumawardhani",
    kelas: "XI-1",
    predikat: "Berkembang Baik",
    nilai: 86,
    kehadiran: 94,
  },
] as const;

const AGENDA_HARI_INI = [
  {
    waktu: "07.00",
    judul: "Pembiasaan Disiplin Positif",
    lokasi: "Lapangan Utama",
    tag: "Karakter",
  },
  {
    waktu: "08.30",
    judul: "Asesmen Formatif — Matematika",
    lokasi: "Kelas X-1",
    tag: "Asesmen",
  },
  {
    waktu: "10.15",
    judul: "Fasilitasi Belajar — Bahasa Indonesia",
    lokasi: "Kelas XI-3",
    tag: "Akademik",
  },
  {
    waktu: "13.00",
    judul: "Refleksi Perkembangan Murid",
    lokasi: "Ruang Guru",
    tag: "Evaluasi",
  },
] as const;

const FASILITASI_AKTIF = [
  { label: "Matematika", kelas: 8, murid: 296, value: 88 },
  { label: "Bahasa Indonesia", kelas: 7, murid: 254, value: 78 },
  { label: "IPA Terpadu", kelas: 6, murid: 218, value: 68 },
] as const;

const predikatTone: Record<string, string> = {
  "Sangat Berkembang": "bg-emerald-50 text-emerald-700",
  "Berkembang Baik": "bg-brand-50 text-brand-700",
  "Mulai Berkembang": "bg-amber-50 text-amber-700",
};

const tagTone: Record<string, string> = {
  Karakter: "bg-violet-50 text-violet-700",
  Asesmen: "bg-amber-50 text-amber-700",
  Akademik: "bg-brand-50 text-brand-700",
  Evaluasi: "bg-sky-50 text-sky-700",
};

export default function AdminDashboardPage() {
  const hariIni = formatDateID(new Date());

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
              <CalendarDays className="h-3.5 w-3.5" />
              {hariIni}
            </p>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Dashboard Admin
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">
              Ringkasan operasional harian DZITOE SMAN 20 Kabupaten Tangerang —
              mencakup <strong className="font-semibold text-slate-700">Murid</strong>{" "}
              (Siswa), <strong className="font-semibold text-slate-700">Guru</strong>,{" "}
              <strong className="font-semibold text-slate-700">
                Fasilitasi Belajar
              </strong>{" "}
              (Pembelajaran),{" "}
              <strong className="font-semibold text-slate-700">Asesmen</strong>, dan{" "}
              <strong className="font-semibold text-slate-700">
                Disiplin Positif
              </strong>
              .
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button type="button" className="dz-btn-ghost">
              <Download className="h-4 w-4" />
              Unduh Laporan
            </button>
            <button type="button" className="dz-btn-primary">
              <Plus className="h-4 w-4" />
              Tambah Murid
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Murid (Siswa)"
            value="1.250"
            hint="Tahun Ajaran 2025/2026"
            icon={Users}
            tone="brand"
            trend={{ value: "+3,2%", direction: "up", label: "vs bulan lalu" }}
          />
          <StatCard
            label="Total Guru"
            value="85"
            hint="Guru & Tenaga Kependidikan"
            icon={GraduationCap}
            tone="violet"
            trend={{ value: "+2", direction: "up", label: "penerimaan baru" }}
          />
          <StatCard
            label="Kehadiran Hari Ini"
            value="94,6"
            unit="%"
            hint="1.183 dari 1.250 Murid"
            icon={CalendarCheck}
            tone="emerald"
            progress={94.6}
            trend={{ value: "+1,4%", direction: "up", label: "vs kemarin" }}
          />
          <StatCard
            label="Asesmen Berjalan"
            value="12"
            hint="4 Sumatif · 8 Formatif"
            icon={ClipboardCheck}
            tone="amber"
            trend={{ value: "+3", direction: "up", label: "minggu ini" }}
          />
        </div>

        {/* Kehadiran & Disiplin Positif */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <SectionCard
            className="lg:col-span-2"
            title="Kehadiran Murid (Siswa)"
            description="Rekap 5 hari kerja terakhir · rata-rata 93,2%"
            action={
              <span className="dz-chip bg-emerald-50 text-emerald-700">
                <TrendingUp className="h-3.5 w-3.5" />
                Tren Positif
              </span>
            }
          >
            <div className="flex items-end gap-3 sm:gap-5">
              {KEHADIRAN_MINGGUAN.map((item) => (
                <div
                  key={item.hari}
                  className="group flex flex-1 flex-col items-center gap-2"
                >
                  <span className="text-xs font-semibold tabular-nums text-slate-700">
                    {item.persentase}%
                  </span>
                  <div className="relative flex h-32 w-full items-end overflow-hidden rounded-lg bg-slate-100/80 sm:h-40">
                    <div
                      className="w-full rounded-lg bg-gradient-to-t from-brand-600 via-brand-500 to-brand-400 transition-all duration-500 ease-out-expo group-hover:from-brand-700 group-hover:to-brand-500"
                      style={{ height: `${item.persentase}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <span className="block text-xs font-medium text-slate-600">
                      {item.hari}
                    </span>
                    <span className="block text-[10px] tabular-nums text-slate-400">
                      {item.hadir}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-start gap-2 rounded-xl border border-sky-100 bg-sky-50/70 p-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
              <p className="text-xs leading-relaxed text-sky-900/80">
                Penurunan kehadiran ditindaklanjuti secara suportif melalui pendekatan{" "}
                <strong className="font-semibold">Disiplin Positif</strong>{" "}
                dan pendampingan wali kelas.
              </p>
            </div>
          </SectionCard>

          <SectionCard
            title="Disiplin Positif"
            description="Indikator penguatan karakter murid"
            action={
              <span className="dz-chip bg-violet-50 text-violet-700">
                <HeartHandshake className="h-3.5 w-3.5" />
                Bulan Ini
              </span>
            }
          >
            <ul className="space-y-4">
              {DISIPLIN_POSITIF.map((item) => (
                <li key={item.label}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-xs font-medium text-slate-700">
                      {item.label}
                    </span>
                    <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-900">
                      {item.value}%
                    </span>
                  </div>
                  <ProgressBar
                    className="mt-2"
                    value={item.value}
                    label={item.label}
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    {item.detail}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 p-4 text-white">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/70">
                Total Poin Positif
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums">12.480</p>
              <p className="mt-1 text-xs text-white/80">
                Terkumpul dari 1.250 Murid bulan ini
              </p>
            </div>
          </SectionCard>
        </div>

        {/* Perkembangan Murid & Agenda */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <SectionCard
            className="lg:col-span-2"
            title="Perkembangan Murid (Siswa) Terbaru"
            description="Diperbarui otomatis dari hasil Asesmen terakhir"
            bodyClassName="p-0"
            action={
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 transition-colors hover:text-brand-700"
              >
                Lihat semua
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            }
          >
            <div className="scrollbar-thin overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] uppercase tracking-[0.08em] text-slate-400">
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Murid
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Kelas
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Predikat
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Capaian
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Kehadiran
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PERKEMBANGAN_MURID.map((murid) => (
                    <tr
                      key={murid.nama}
                      className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600">
                            {getInitials(murid.nama)}
                          </span>
                          <span className="truncate font-medium text-slate-800">
                            {murid.nama}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 tabular-nums">
                        {murid.kelas}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            "dz-chip",
                            predikatTone[murid.predikat] ??
                              "bg-slate-100 text-slate-600",
                          )}
                        >
                          {murid.predikat}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <ProgressBar
                            value={murid.nilai}
                            className="h-1.5 w-20"
                            label={`Capaian ${murid.nama}`}
                          />
                          <span className="text-xs font-semibold tabular-nums text-slate-700">
                            {murid.nilai}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs font-semibold tabular-nums text-slate-600">
                        {murid.kehadiran}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard
            title="Agenda Hari Ini"
            description="4 kegiatan terjadwal"
            action={
              <span className="dz-chip bg-slate-100 text-slate-600">
                <Clock className="h-3.5 w-3.5" />
                WIB
              </span>
            }
          >
            <ol className="relative space-y-4 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-slate-200">
              {AGENDA_HARI_INI.map((agenda) => (
                <li key={agenda.judul} className="relative flex gap-3">
                  <span
                    aria-hidden="true"
                    className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white bg-brand-600 ring-1 ring-brand-200"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold tabular-nums text-slate-900">
                        {agenda.waktu}
                      </span>
                      <span
                        className={cn(
                          "dz-chip px-2 py-0.5",
                          tagTone[agenda.tag] ?? "bg-slate-100 text-slate-600",
                        )}
                      >
                        {agenda.tag}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium leading-snug text-slate-800">
                      {agenda.judul}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {agenda.lokasi}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </SectionCard>
        </div>

        {/* Fasilitasi Belajar & Pengumuman */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <SectionCard
            className="lg:col-span-2"
            title="Fasilitasi Belajar (Pembelajaran) Aktif"
            description="Mata pelajaran dengan sesi berjalan minggu ini"
            action={
              <span className="dz-chip bg-brand-50 text-brand-700">
                <BookOpenCheck className="h-3.5 w-3.5" />
                21 Sesi
              </span>
            }
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {FASILITASI_AKTIF.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition-colors hover:border-slate-200 hover:bg-white"
                >
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 shrink-0 text-brand-600" />
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {item.label}
                    </p>
                  </div>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">
                    {item.kelas}
                    <span className="ml-1 text-xs font-medium text-slate-500">
                      kelas
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {item.murid} Murid terlibat
                  </p>
                  <ProgressBar className="mt-3" value={item.value} />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Pengumuman Internal"
            description="Informasi terbaru untuk Guru"
          >
            <div className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
                <Megaphone className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-snug text-slate-800">
                  Sinkronisasi Asesmen Sumatif Ganjil
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Seluruh Guru diminta melengkapi rubrik{" "}
                  <strong className="font-semibold text-slate-600">
                    Perkembangan Murid
                  </strong>{" "}
                  sebelum 20 Desember 2026.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-3">
              <span className="text-xs font-medium text-slate-600">
                Kesiapan pengisian
              </span>
              <span className="text-xs font-bold tabular-nums text-brand-700">
                78%
              </span>
            </div>
            <ProgressBar className="mt-2" value={78} />
          </SectionCard>
        </div>
      </div>
    </DashboardShell>
  );
}
