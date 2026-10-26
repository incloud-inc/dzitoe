'use client';

import React from 'react';
import {
  HeartHandshake,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { AttendanceHeatmap } from './AttendanceHeatmap';

interface ParentHomeViewProps {
  user?: {
    id?: string;
    name?: string;
    username?: string;
    email?: string;
    role?: string;
  } | null;
}

export function ParentHomeView({ user }: ParentHomeViewProps) {
  const parentName = user?.name || 'H. Bambang Sudirman, S.E. (Wali Siswa)';
  const studentName = 'Aisyah Putri Ramadhani';
  const studentClass = 'Kelas X.1';
  const studentNisn = '0067891234';

  return (
    <div className="space-y-4 pb-24">
      {/* Header Orang Tua */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 p-6 text-white shadow-xl shadow-emerald-900/15">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/25">
            <HeartHandshake className="w-6 h-6 text-emerald-100" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              Portal Orang Tua / Wali
            </span>
            <h1 className="text-base font-black tracking-tight mt-0.5">{parentName}</h1>
          </div>
        </div>

        {/* Info Anak yang Diasuh */}
        <div className="mt-4 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs">
          <div>
            <div className="text-[10px] text-white/70">Memantau Siswa:</div>
            <div className="font-extrabold text-white text-sm">{studentName}</div>
            <div className="text-[11px] text-white/80 font-mono">
              {studentClass} • NISN: {studentNisn}
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-xl bg-white/20 font-bold text-[11px] text-white">
            Semester Genap
          </span>
        </div>
      </div>

      {/* 1. Status Presensi GPS Anak Hari Ini */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Kehadiran Anak Hari Ini</h3>
              <p className="text-[11px] text-slate-400">Verifikasi Geofence SMAN 20</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Hadir di Sekolah
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Tiba di Sekolah
            </span>
            <div className="mt-0.5 text-sm font-black text-slate-900 tabular-nums">
              06.42 WIB
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Selfie GPS Valid</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Estimasi Pulang
            </span>
            <div className="mt-0.5 text-sm font-black text-slate-900 tabular-nums">
              15.30 WIB
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
              <Clock className="w-3 h-3" />
              <span>Sesuai Jam KBM</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50/80 px-3 py-2 rounded-xl">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Lokasi: Lapangan & Gerbang Utama SMAN 20</span>
          </span>
          <span className="font-bold text-emerald-700">100% Aman</span>
        </div>
      </div>

      {/* 2. Kontak Cepat Wali Kelas */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold">
            BK
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Drs. Budi Santoso, M.Pd</div>
            <div className="text-[11px] text-slate-400">Wali Kelas {studentClass}</div>
          </div>
        </div>
        <a
          href="https://wa.me/6281288991122?text=Halo%20Bapak%20Budi,%20saya%20orang%20tua%20dari%20Aisyah"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Chat WA</span>
        </a>
      </div>

      {/* 3. Heatmap Kehadiran Anak (Task B2.6) */}
      <AttendanceHeatmap
        title="Heatmap Kehadiran Anak"
        subtitle={`Rekap presensi KBM semester ini (${studentName})`}
      />
    </div>
  );
}

export default ParentHomeView;
