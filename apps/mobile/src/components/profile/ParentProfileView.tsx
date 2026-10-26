'use client';

import React from 'react';
import {
  HeartHandshake,
  Phone,
  GraduationCap,
  School,
  LogOut,
  ShieldCheck,
  User,
} from 'lucide-react';

interface ParentProfileViewProps {
  user?: {
    id?: string;
    name?: string;
    username?: string;
    email?: string;
    role?: string;
  } | null;
}

export default function ParentProfileView({ user }: ParentProfileViewProps) {
  const parentName = user?.name || 'H. Bambang Sudirman, S.E. (Wali Siswa)';
  const parentPhone = user?.username || '081288991122';
  const studentName = 'Aisyah Putri Ramadhani';
  const studentClass = 'Kelas X.1';
  const studentNisn = '0067891234';

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      window.location.href = '/login';
    }
  };

  return (
    <div className="space-y-4 px-4 pt-4 pb-24 font-sans max-w-md mx-auto">
      {/* 1. Header Profile Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 p-6 text-white shadow-xl shadow-emerald-900/15 text-center">
        <div className="mx-auto h-16 w-16 overflow-hidden rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center mb-3">
          <HeartHandshake className="w-8 h-8 text-emerald-100" />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
          Portal Orang Tua & Wali Murid
        </span>
        <h1 className="mt-2 text-lg font-black tracking-tight">{parentName}</h1>
        <p className="text-xs text-emerald-100 font-mono mt-0.5">Kontak WA: {parentPhone}</p>
      </div>

      {/* 2. Informasi Siswa Asuhan */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
          Data Putra / Putri yang Dipantau
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Nama Murid</span>
            </span>
            <span className="font-extrabold text-slate-900">{studentName}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Rombongan Belajar</span>
            </span>
            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              {studentClass}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <School className="w-4 h-4 text-emerald-600" />
              <span>NISN Nasional</span>
            </span>
            <span className="font-mono font-bold text-slate-800">{studentNisn}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Notifikasi Otomatis</span>
            </span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Aktif via WhatsApp</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Tombol Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white border border-rose-200 text-rose-600 font-bold text-xs shadow-xs hover:bg-rose-50 transition active:scale-[0.99] cursor-pointer"
      >
        <LogOut className="h-4 w-4" />
        <span>Keluar dari Portal Orang Tua</span>
      </button>
    </div>
  );
}
