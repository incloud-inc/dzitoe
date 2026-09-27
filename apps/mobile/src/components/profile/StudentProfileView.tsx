'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Settings,
  Check,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  MapPin,
  Calendar,
  X,
} from 'lucide-react';
import {
  STUDENT_PROFILE,
  STUDENT_METRICS,
  generateSemesterHeatmap,
  ATTENDANCE_LOGS,
  CLASS_SCHEDULES,
  type HeatmapDay,
} from '@/lib/profile-data';

export default function StudentProfileView() {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'jadwal'>('overview');
  const [selectedDay, setSelectedDay] = React.useState<HeatmapDay | null>(null);

  const heatmapDays = React.useMemo(() => generateSemesterHeatmap(), []);
  const weeksCount = 15;

  // Level color class mapping based on blueprint:
  // - Hijau Gelap: Sesuai durasi (Tepat waktu)
  // - Hijau Muda: Durasi parsial (Terlambat / pulang awal)
  // - Kuning: Izin / Sakit
  // - Merah: Alpa
  // - Abu-abu: Libur
  const getSquareColor = (level: HeatmapDay['level']) => {
    switch (level) {
      case 'exact':
        return 'bg-emerald-600 hover:bg-emerald-700';
      case 'partial':
        return 'bg-emerald-300 hover:bg-emerald-400';
      case 'excused':
        return 'bg-amber-400 hover:bg-amber-500';
      case 'absent':
        return 'bg-rose-500 hover:bg-rose-600';
      case 'weekend':
      default:
        return 'bg-slate-100 hover:bg-slate-200';
    }
  };

  return (
    <div className="min-h-full bg-white text-slate-900 pb-24 select-none">
      {/* ============================================================
          1. HEADER SECTION (Gradien Ungu/Biru Banner + Avatar Overlapping)
      ============================================================ */}
      <div className="relative">
        {/* Background Banner Gradien Ungu/Biru */}
        <div className="relative h-36 w-full overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 shadow-sm">
          {/* Subtle blur mesh glow decoration */}
          <div className="absolute -top-12 -left-12 h-36 w-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute top-6 right-8 h-28 w-28 rounded-full bg-cyan-400/20 blur-xl pointer-events-none" />

          {/* Tombol Settings (Pojok Kanan Atas Banner) */}
          <button
            type="button"
            aria-label="Pengaturan profil"
            className="absolute top-3.5 right-3.5 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/30 active:scale-95 dz-interactive-mobile shadow-sm"
          >
            <Settings className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Avatar Siswa: Overlapping di Tengah antara Banner dan Konten Bawah */}
        <div className="relative -mt-12 flex justify-center">
          <div className="relative">
            <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-white shadow-xl bg-gradient-to-tr from-indigo-500 to-purple-600">
              <Image
                src={STUDENT_PROFILE.avatarUrl}
                alt={STUDENT_PROFILE.name}
                fill
                sizes="96px"
                className="object-cover"
                priority
                unoptimized
              />
            </div>

            {/* Badge Centang/Bintang Siswa Aktif Berprestasi (Pojok Kanan Bawah) */}
            <span
              className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white shadow-md text-white"
              title="Siswa Aktif Berprestasi"
            >
              <Check className="h-4 w-4 stroke-[3]" />
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================
          2. INFORMASI PROFIL UTAMA
      ============================================================ */}
      <div className="mt-2.5 px-4 text-center">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          {STUDENT_PROFILE.name}
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 font-medium">
          NISN: {STUDENT_PROFILE.nisn} | {STUDENT_PROFILE.className} · {STUDENT_PROFILE.school}
        </p>
      </div>

      {/* ============================================================
          3. METRIK UTAMA (4 Kolom Horizontal Teks Tebal)
      ============================================================ */}
      <div className="mt-5 border-y border-slate-100 bg-white py-3.5 px-2">
        <div className="grid grid-cols-4 divide-x divide-slate-100">
          {STUDENT_METRICS.map((metric, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center px-1 text-center">
              <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
                {metric.value}
              </span>
              <span className="mt-1 text-[10px] text-slate-400 font-medium capitalize">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
          4. TAB NAVIGATION (Sticky Tab Bar dengan Garis Indikator Aktif)
      ============================================================ */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="flex px-4">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`relative flex-1 py-3 text-center text-xs font-bold transition-colors ${
              activeTab === 'overview'
                ? 'text-emerald-700'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>Overview Absensi</span>
            {activeTab === 'overview' && (
              <span className="absolute bottom-0 left-4 right-4 h-[2.5px] rounded-full bg-emerald-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('jadwal')}
            className={`relative flex-1 py-3 text-center text-xs font-bold transition-colors ${
              activeTab === 'jadwal'
                ? 'text-emerald-700'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>Jadwal Kelas</span>
            {activeTab === 'jadwal' && (
              <span className="absolute bottom-0 left-4 right-4 h-[2.5px] rounded-full bg-emerald-600" />
            )}
          </button>
        </div>
      </div>

      {/* ============================================================
          5. CONTENT AREA
      ============================================================ */}
      <div className="p-4 space-y-5">
        {/* ----------------- TAB 1: OVERVIEW ABSENSI ----------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-5 animate-in fade-in-50 duration-200">
            {/* Section Title */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">
                  Rekap Durasi Kehadiran (Semester Ini)
                </h2>
                <span className="text-[10px] text-slate-400 font-medium">91 Hari Pembelajaran</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Ketuk kotak pada kalender untuk melihat detail check-in & check-out harian.
              </p>
            </div>

            {/* HEATMAP ABSENSI */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 shadow-xs">
              {/* Legend Indikator Warna */}
              <div className="mb-3 flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-200/60 pb-2 text-[10px] text-slate-600 font-medium">
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-[2px] bg-emerald-600" />
                  <span>Tepat Waktu</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-[2px] bg-emerald-300" />
                  <span>Parsial</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-[2px] bg-amber-400" />
                  <span>Izin/Sakit</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-[2px] bg-rose-500" />
                  <span>Alpa</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-[2px] bg-slate-200" />
                  <span>Libur</span>
                </span>
              </div>

              {/* Matriks Grid Kotak-kotak Kecil (15 Minggu x 7 Hari) */}
              <div className="flex gap-1.5">
                {/* Kolom Nama Hari */}
                <div className="flex flex-col justify-between py-0.5 text-[9px] text-slate-400 font-semibold leading-none">
                  <span>Min</span>
                  <span>Sen</span>
                  <span>Sel</span>
                  <span>Rab</span>
                  <span>Kam</span>
                  <span>Jum</span>
                  <span>Sab</span>
                </div>

                {/* Kolom Minggu */}
                <div className="flex flex-1 gap-[3px] overflow-x-auto no-scrollbar">
                  {Array.from({ length: weeksCount }).map((_, w) => (
                    <div key={w} className="flex flex-1 flex-col gap-[3px]">
                      {Array.from({ length: 7 }).map((_, d) => {
                        const dayData = heatmapDays[w * 7 + d];
                        if (!dayData) return null;
                        const isSelected = selectedDay?.id === dayData.id;

                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setSelectedDay(dayData)}
                            className={`aspect-square w-full rounded-[2px] transition-transform active:scale-95 ${getSquareColor(
                              dayData.level
                            )} ${isSelected ? 'ring-2 ring-slate-900 scale-125 z-10' : ''}`}
                            aria-label={`${dayData.dateStr}: ${dayData.statusLabel}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Interaktif: Tooltip/Pop-up Detail Hari yang Dipilih */}
              {selectedDay ? (
                <div className="mt-3 rounded-xl bg-white p-3 shadow-md border border-slate-200 animate-in fade-in-50 zoom-in-95">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2.5 w-2.5 rounded-[2px] ${getSquareColor(selectedDay.level)}`} />
                        <span className="text-xs font-bold text-slate-900">{selectedDay.dateStr}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] font-semibold text-emerald-700">
                        {selectedDay.statusLabel}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedDay(null)}
                      className="text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {selectedDay.checkIn && selectedDay.checkOut ? (
                    <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-600 font-medium">
                      <span>Masuk: <strong className="text-slate-900 font-mono">{selectedDay.checkIn}</strong></span>
                      <span>Pulang: <strong className="text-slate-900 font-mono">{selectedDay.checkOut}</strong></span>
                      <span>Durasi: <strong className="text-emerald-700 font-mono">{selectedDay.duration}</strong></span>
                    </div>
                  ) : (
                    <div className="mt-2 border-t border-slate-100 pt-1.5 text-[11px] text-slate-500">
                      {selectedDay.level === 'weekend' ? 'Tidak ada kegiatan belajar mengajar.' : 'Tidak ada rekaman tap hadir.'}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-2 text-center text-[10px] text-slate-400">
                  💡 Ketuk salah satu kotak untuk rincian jam masuk, pulang, dan durasi harian
                </div>
              )}
            </div>

            {/* LOG PRESENSI HARIAN (Minimalist List View) */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Log Presensi Hari Ini
              </h3>

              <div className="space-y-2">
                {ATTENDANCE_LOGS.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs transition hover:border-slate-300"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid h-10 w-10 place-items-center rounded-xl shadow-xs ${
                          log.type === 'in'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {log.type === 'in' ? (
                          <ArrowDownLeft className="h-5 w-5" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{log.title}</h4>
                        <p className="text-[11px] text-slate-400 font-medium">{log.location}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-bold font-mono ${
                          log.recorded ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      >
                        {log.time}
                      </span>
                      <p
                        className={`text-[10px] font-semibold mt-0.5 ${
                          log.recorded ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {log.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 2: JADWAL KELAS ----------------- */}
        {activeTab === 'jadwal' && (
          <div className="space-y-3 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Jadwal Pelajaran Hari Ini</h2>
                <p className="text-[11px] text-slate-500">Kelas XII IPA 1 · Semester Ganjil</p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                <Calendar className="h-3 w-3" />
                5 Sesi
              </span>
            </div>

            <div className="space-y-2.5">
              {CLASS_SCHEDULES.map((item) => {
                const isCurrent = item.status === 'Sedang Berlangsung';
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl p-3.5 border transition-all ${
                      isCurrent
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-1 ring-emerald-500/30'
                        : 'border-slate-200 bg-white shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                            <Clock className="h-3 w-3" />
                            {item.time}
                          </span>
                          {isCurrent && (
                            <span className="rounded-full bg-emerald-500 px-1.5 py-0.2 text-[9px] font-bold text-white uppercase tracking-wider animate-pulse">
                              Berlangsung
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mt-1">{item.subject}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.teacher}</p>
                      </div>

                      <div className="shrink-0 flex items-center gap-1 rounded-xl bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{item.room}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
