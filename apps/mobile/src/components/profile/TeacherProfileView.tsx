'use client';

import React from 'react';
import Image from 'next/image';
import {
  GraduationCap,
  Mail,
  School,
  LogOut,
  CalendarCheck,
  Shield,
} from 'lucide-react';

interface TeacherProfileViewProps {
  user?: {
    id?: string;
    name?: string;
    username?: string;
    email?: string;
    role?: string;
    nip?: string | null;
    kelas?: string | null;
    avatar?: string | null;
  } | null;
}

export default function TeacherProfileView({ user }: TeacherProfileViewProps) {
  const teacherName = user?.name || 'Drs. Budi Santoso, M.Pd';
  const teacherNip = user?.nip || '197508122005011003';
  const teacherEmail = user?.email || 'budi.santoso@sman20kabtangerang.sch.id';
  const waliKelas = user?.kelas || 'Wali Kelas X.1';
  const avatar = user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150';

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
      <div className="relative rounded-3xl bg-gradient-to-br from-[#087f5b] via-[#0ca678] to-[#12b886] p-6 text-white shadow-xl shadow-[#087f5b]/15 text-center">
        <div className="mx-auto h-20 w-20 overflow-hidden rounded-2xl border-4 border-white/40 shadow-lg mb-3">
          <Image
            src={avatar}
            alt={teacherName}
            width={80}
            height={80}
            className="h-full w-full object-cover"
            unoptimized
          />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
          <GraduationCap className="h-3 w-3" />
          Pendidik & Tenaga Kependidikan
        </span>
        <h1 className="mt-2 text-lg font-black tracking-tight">{teacherName}</h1>
        <p className="text-xs text-white/80 font-mono mt-0.5">NIP: {teacherNip}</p>
      </div>

      {/* 2. Informasi Kepegawaian & Tugas */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
          Informasi Kedinasan & Penugasan
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <School className="w-4 h-4 text-[#087f5b]" />
              <span>Satuan Pendidikan</span>
            </span>
            <span className="font-bold text-slate-900">SMAN 20 Kab. Tangerang</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-[#087f5b]" />
              <span>Tugas Tambahan</span>
            </span>
            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              {waliKelas}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-[#087f5b]" />
              <span>Email Resmi</span>
            </span>
            <span className="font-mono text-slate-800 text-[11px] truncate max-w-[180px]">
              {teacherEmail}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#087f5b]" />
              <span>Status Akun</span>
            </span>
            <span className="font-bold text-emerald-700">Aktif (Dapodik PTK)</span>
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
        <span>Keluar dari Akun Pendidik</span>
      </button>
    </div>
  );
}
