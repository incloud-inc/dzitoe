'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  GraduationCap,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  BookOpen,
  ChevronRight,
  Camera,
  Coffee,
  Check,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AttendanceHeatmap } from './AttendanceHeatmap';
import { PhotoUploadModal } from './PhotoUploadModal';

interface TeacherHomeViewProps {
  user?: {
    id?: string;
    name?: string;
    username?: string;
    email?: string;
    role?: string;
    avatar?: string | null;
    nip?: string | null;
    kelas?: string | null;
  } | null;
}

export function TeacherHomeView({ user }: TeacherHomeViewProps) {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  );

  const teacherName = user?.name || 'Drs. Budi Santoso, M.Pd';
  const teacherNip = user?.nip || '197508122005011003';
  const waliKelas = user?.kelas || 'Wali Kelas X.1';

  // Jadwal Mengajar Hari Ini
  const teachingSchedules = [
    {
      id: 1,
      time: '07.15 - 08.45 WIB',
      subject: 'Matematika Wajib',
      className: 'Kelas X.1',
      room: 'Ruang Teori 101',
      status: 'active',
      totalStudents: 36,
      attendedStudents: 34,
    },
    {
      id: 2,
      time: '10.15 - 11.45 WIB',
      subject: 'Matematika Peminatan',
      className: 'Kelas XI IPA 2',
      room: 'Lab Komputer 1',
      status: 'upcoming',
      totalStudents: 35,
      attendedStudents: 0,
    },
    {
      id: 3,
      time: '13.00 - 14.30 WIB',
      subject: 'Matematika Wajib',
      className: 'Kelas XII IPS 1',
      room: 'Ruang Teori 302',
      status: 'upcoming',
      totalStudents: 36,
      attendedStudents: 0,
    },
  ];

  return (
    <div className="space-y-4 pb-24">
      {/* 1. Header Guru & Card Identitas */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#087f5b] via-[#0ca678] to-[#12b886] p-6 text-white shadow-xl shadow-[#087f5b]/15">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            {/* Foto Profil dengan fitur Tap to Change Photo */}
            <div className="relative group cursor-pointer" onClick={() => setIsPhotoModalOpen(true)}>
              <div className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-white/40 bg-white/20 shadow-md">
                <Image
                  src={avatarUrl}
                  alt={teacherName}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  unoptimized
                />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#087f5b] shadow-md ring-2 ring-[#087f5b]">
                <Camera className="h-3.5 w-3.5" />
              </div>
            </div>

            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                <GraduationCap className="h-3 w-3" />
                Pendidik & Tendik
              </span>
              <h1 className="mt-1 text-base font-black tracking-tight text-white leading-snug">
                {teacherName}
              </h1>
              <p className="text-xs text-white/80 font-mono">NIP: {teacherNip}</p>
            </div>
          </div>
        </div>

        {/* Status Perwalian & Waktu WIB */}
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/10 p-3 backdrop-blur-md border border-white/15 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-300 animate-ping" />
            <span className="font-semibold text-white">{waliKelas}</span>
          </div>
          <div className="text-[11px] text-white/90 font-medium">
            Senin, 28 September 2026
          </div>
        </div>
      </div>

      {/* 2. Presensi Guru Hari Ini (A9.2 / B2.2) */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Presensi Guru Hari Ini</h3>
              <p className="text-[11px] text-slate-400">Verifikasi GPS Sekolah & Foto</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Hadir di Kampus
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Jam Masuk
            </span>
            <div className="mt-0.5 text-sm font-black text-slate-900 tabular-nums">
              06.35 WIB
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
              <Check className="w-3 h-3 text-emerald-600" />
              <span>Tepat Waktu</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Jam Pulang
            </span>
            <div className="mt-0.5 text-sm font-black text-slate-900 tabular-nums">
              15.30 WIB
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
              <Clock className="w-3 h-3" />
              <span>Aktif Sore Hari</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50/80 px-3 py-2 rounded-xl">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Radius GPS: 15m dari Gerbang SMAN 20</span>
          </span>
          <span className="font-bold text-emerald-700">Valid</span>
        </div>
      </div>

      {/* 3. Monitoring Siswa Kelas Perwalian (Wali Kelas Overview) */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900">Rekap Kelas Perwalian ({waliKelas})</h3>
            <p className="text-[11px] text-slate-400">Kehadiran 36 Siswa Hari Ini</p>
          </div>
          <button className="text-[11px] font-bold text-[#087f5b] hover:underline flex items-center gap-0.5">
            <span>Detail</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2.5 rounded-2xl bg-[#e6fcf5] border border-[#c3fae8]">
            <div className="text-[10px] font-bold text-[#087f5b]">Hadir</div>
            <div className="text-base font-black text-[#087f5b] tabular-nums mt-0.5">34</div>
            <div className="text-[9px] text-[#099268]">94.4%</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="text-[10px] font-bold text-amber-700">Sakit</div>
            <div className="text-base font-black text-amber-800 tabular-nums mt-0.5">1</div>
            <div className="text-[9px] text-amber-600">Surat Dokter</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-sky-50 border border-sky-200">
            <div className="text-[10px] font-bold text-sky-700">Izin</div>
            <div className="text-base font-black text-sky-800 tabular-nums mt-0.5">1</div>
            <div className="text-[9px] text-sky-600">Dispensasi</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200">
            <div className="text-[10px] font-bold text-rose-700">Alpha</div>
            <div className="text-base font-black text-rose-800 tabular-nums mt-0.5">0</div>
            <div className="text-[9px] text-rose-600">Nihil</div>
          </div>
        </div>
      </div>

      {/* 4. Jadwal KBM Mengajar Hari Ini */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <BookOpen className="h-4 w-4" />
            </span>
            <h3 className="text-xs font-bold text-slate-900">Jadwal Mengajar Hari Ini</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400">3 Sesi KBM</span>
        </div>

        <div className="space-y-2.5">
          {teachingSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className={cn(
                'p-3.5 rounded-2xl border transition-all',
                schedule.status === 'active'
                  ? 'bg-emerald-50/70 border-emerald-200 shadow-xs'
                  : 'bg-slate-50/80 border-slate-100 hover:border-slate-200'
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{schedule.subject}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white border border-slate-200 text-slate-700">
                      {schedule.className}
                    </span>
                    {schedule.status === 'active' && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-600 text-white animate-pulse">
                        Sedang Berlangsung
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {schedule.time}
                    </span>
                    <span>•</span>
                    <span>{schedule.room}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer',
                    schedule.status === 'active'
                      ? 'bg-[#087f5b] text-white shadow-xs hover:bg-[#0ca678]'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Absen Kelas</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Aksi Cepat Guru (Quick Actions) */}
      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          className="p-3 rounded-2xl bg-white border border-slate-200/80 text-center flex flex-col items-center gap-1 shadow-card hover:border-brand-300 transition cursor-pointer"
        >
          <div className="h-9 w-9 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center">
            <ClipboardList className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-700 mt-1">Input Nilai</span>
        </button>

        <button
          type="button"
          className="p-3 rounded-2xl bg-white border border-slate-200/80 text-center flex flex-col items-center gap-1 shadow-card hover:border-brand-300 transition cursor-pointer"
        >
          <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-700 mt-1">Jurnal KBM</span>
        </button>

        <button
          type="button"
          className="p-3 rounded-2xl bg-white border border-slate-200/80 text-center flex flex-col items-center gap-1 shadow-card hover:border-brand-300 transition cursor-pointer"
        >
          <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Coffee className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-700 mt-1">Izin / Cuti</span>
        </button>

        <button
          type="button"
          className="p-3 rounded-2xl bg-white border border-slate-200/80 text-center flex flex-col items-center gap-1 shadow-card hover:border-brand-300 transition cursor-pointer"
        >
          <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-700 mt-1">Konseling BK</span>
        </button>
      </div>

      {/* 6. Komponen Heatmap Kehadiran Guru (Task B2.6) */}
      <AttendanceHeatmap
        title="Heatmap Kehadiran Mengajar"
        subtitle="Konsistensi presensi guru semester ini"
      />

      {/* Modal Upload / Ganti Foto Guru */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentAvatar={avatarUrl}
        userName={teacherName}
        userRole="GURU"
        studentId={teacherNip}
        onPhotoUpdated={(newUrl) => setAvatarUrl(newUrl)}
        onUploadSuccess={(newUrl) => setAvatarUrl(newUrl)}
      />
    </div>
  );
}

export default TeacherHomeView;
