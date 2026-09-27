'use client';

import * as React from 'react';
import Image from 'next/image';
import { PROFIL_MURID } from '@/lib/data';
import { GpsAttendanceDialog } from '@/components/modals/GpsAttendanceDialog';
import { DigitalStudentCardDialog } from '@/components/modals/DigitalStudentCardDialog';
import { Sparkles, Check } from 'lucide-react';

/* ============================================================
   ORNAMEN DOODLE LUAR ANGKASA (SVG Custom Cosmic Space Doodles)
   Persis seperti gambar referensi pengguna:
   - Planet cincin neon hijau di kiri atas
   - Network nodes oranye di kanan atas
   - Topi koboi / pesawat doodle oranye di kiri
   - Bintang 4-sudut kuning, berlian cyan, lingkaran ungu
============================================================ */
function CosmicDoodles() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full select-none"
      viewBox="0 0 400 320"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Planet bercincin neon hijau - kiri atas */}
      <g transform="translate(42, 42)">
        <circle r="13" fill="#13151b" stroke="#4ade80" strokeWidth="2.2" />
        <ellipse
          rx="22"
          ry="6"
          fill="none"
          stroke="#4ade80"
          strokeWidth="2.2"
          transform="rotate(-20)"
        />
        <circle cx="-4" cy="-3" r="2" fill="#4ade80" opacity="0.8" />
        <circle cx="5" cy="4" r="1.5" fill="#4ade80" opacity="0.6" />
      </g>

      {/* Jaringan node network oranye-pink - kanan atas */}
      <g transform="translate(325, 48)" stroke="#f97316" strokeWidth="2" fill="none">
        <line x1="0" y1="0" x2="20" y2="-12" />
        <line x1="20" y1="-12" x2="34" y2="6" />
        <line x1="0" y1="0" x2="16" y2="16" />
        <line x1="16" y1="16" x2="34" y2="6" />
        <circle cx="0" cy="0" r="4.5" fill="#f97316" />
        <circle cx="20" cy="-12" r="4" fill="#fb923c" />
        <circle cx="34" cy="6" r="4.5" fill="#f97316" />
        <circle cx="16" cy="16" r="4" fill="#fb923c" />
        {/* Person icon inside main node */}
        <circle cx="0" cy="-1" r="1.8" fill="#13151b" />
        <path d="M-3 3 Q0 1 3 3" stroke="#13151b" strokeWidth="1" />
      </g>

      {/* Topi koboi / pesawat doodle oranye - kiri */}
      <g transform="translate(30, 150)" stroke="#fb923c" strokeWidth="2.2" fill="none" strokeLinecap="round">
        <path d="M-14 0 Q0 -14 14 0" />
        <path d="M-18 2 L18 2" />
        <path d="M-10 2 L-10 8 M10 2 L10 8" />
      </g>

      {/* Bintang 4-sudut kuning & emas */}
      <g fill="#facc15">
        <path d="M125 32 L128 40 L136 43 L128 46 L125 54 L122 46 L114 43 L122 40 Z" />
        <path d="M295 195 L297 201 L303 203 L297 205 L295 211 L293 205 L287 203 L293 201 Z" opacity="0.85" />
        <path d="M65 240 L67 246 L73 248 L67 250 L65 256 L63 250 L57 248 L63 246 Z" opacity="0.75" />
      </g>

      {/* Berlian cyan & spark */}
      <g fill="#22d3ee">
        <path d="M335 140 L342 147 L335 154 L328 147 Z" opacity="0.9" />
        <path d="M175 60 L180 65 L175 70 L170 65 Z" opacity="0.75" />
        <path d="M88 150 L91 153 L88 156 L85 153 Z" opacity="0.8" />
      </g>

      {/* Lingkaran cincin ungu / pink */}
      <g>
        <circle cx="280" cy="95" r="5" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.85" />
        <circle cx="48" cy="95" r="3.5" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.7" />
        <circle cx="330" cy="210" r="7" fill="none" stroke="#a855f7" strokeWidth="2.2" opacity="0.7" />
        <circle cx="85" cy="115" r="2.5" fill="#f43f5e" opacity="0.7" />
      </g>

      {/* Bintang-bintang kecil putih tersebar */}
      <g fill="#ffffff" opacity="0.6">
        <circle cx="155" cy="98" r="1.3" />
        <circle cx="225" cy="38" r="1.1" />
        <circle cx="275" cy="155" r="1.4" />
        <circle cx="50" cy="215" r="1.1" />
        <circle cx="195" cy="225" r="1.3" />
        <circle cx="355" cy="175" r="1.2" />
        <circle cx="115" cy="275" r="1.1" />
        <circle cx="310" cy="115" r="1" />
        <circle cx="15" cy="100" r="1.2" />
      </g>
    </svg>
  );
}

/* ============================================================
   HEATMAP GRID (GitHub-style Commit / Attendance Heatmap)
============================================================ */
export function ContributionHeatmap() {
  const weeks = 24;
  const days = 7;
  const levels = [
    'bg-slate-100',
    'bg-[#bbf7d0]',
    'bg-[#86efac]',
    'bg-[#22c55e]',
    'bg-[#15803d]',
  ];

  // Deterministik seed agar pola heatmap konsisten dan indah
  const getLevel = (r: number, c: number) => {
    const v = Math.abs(Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 1;
    if (v > 0.82) return 4;
    if (v > 0.62) return 3;
    if (v > 0.38) return 2;
    if (v > 0.18) return 1;
    return 0;
  };

  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

  return (
    <div className="bg-white px-4 pt-4 pb-6">
      {/* Judul & Legend Skala Hijau */}
      <div className="mb-2.5 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-800">
          2,560 kegiatan belajar tahun ini
        </span>
        <div className="flex items-center gap-1 text-[10px] text-slate-400">
          <span>Less</span>
          {levels.map((lvl, i) => (
            <span key={i} className={`h-2.5 w-2.5 rounded-[2px] ${lvl}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Label Bulan */}
      <div className="mb-1 flex justify-between pl-6 pr-1 text-[10px] text-slate-400 font-medium">
        {months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>

      {/* Grid Matriks Heatmap */}
      <div className="flex gap-1.5">
        {/* Label Hari */}
        <div className="flex flex-col justify-between py-[1px] text-[9px] text-slate-400 font-medium leading-none">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        {/* Kolom Minggu */}
        <div className="flex flex-1 gap-[3px]">
          {Array.from({ length: weeks }).map((_, c) => (
            <div key={c} className="flex flex-1 flex-col gap-[3px]">
              {Array.from({ length: days }).map((_, r) => {
                const lvl = getLevel(r, c);
                return (
                  <span
                    key={r}
                    className={`aspect-square w-full rounded-[2px] transition-transform hover:scale-125 ${levels[lvl]}`}
                    title={`Aktivitas belajar minggu ke-${c + 1}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   KOMPONEN UTAMA COSMIC HEADER
============================================================ */
interface CosmicHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function CosmicHeader({
  activeTab,
  onTabChange,
}: CosmicHeaderProps) {
  const [isFollowed, setIsFollowed] = React.useState(false);

  const stats = [
    { value: '50', label: 'aktivitas' },
    { value: '26k', label: 'poin apresiasi' },
    { value: '10k', label: 'jam belajar' },
    { value: '20k', label: 'reputasi' },
  ];

  const tabs = ['Overview', 'Jadwal', 'Tugas & Asesmen', 'Disiplin'];

  return (
    <div className="w-full select-none bg-white">
      {/* ================= 1. HEADER GELAP KOSMIK ================= */}
      <div className="relative overflow-hidden bg-[#13151b] pt-8 pb-7 text-center">
        {/* Ornamen Doodle Luar Angkasa */}
        <CosmicDoodles />

        <div className="relative z-10 flex flex-col items-center px-4">
          {/* Avatar Lingkaran Besar dengan White Ring & Purple Star Badge */}
          <div className="relative">
            <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-white shadow-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-purple-600">
              <Image
                src="/avatars/student_avatar.jpg"
                alt="Avatar Ksatria Chibi"
                fill
                sizes="96px"
                className="object-cover"
                priority
              />
            </div>

            {/* Badge Bintang Ungu Kecil di Pojok Kanan Bawah */}
            <div className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#7c3aed] ring-2 ring-white shadow-md">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-white">
                <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.2L2 10l7.1-1.1L12 2z" />
              </svg>
            </div>
          </div>

          {/* Identitas Murid / Profil */}
          <h1 className="mt-3.5 text-xl font-bold tracking-tight text-white">
            {PROFIL_MURID.nama}
          </h1>
          <p className="mt-0.5 text-xs text-slate-400 font-medium">
            @{PROFIL_MURID.nama.toLowerCase().replace(/\s+/g, '')}
          </p>
          <p className="mt-1.5 max-w-xs text-xs text-slate-300 leading-snug">
            Talk is cheap. Show me the code. · XII MIPA 3 SMAN 20
          </p>

          {/* Tombol Aksi Utama Pil Hijau Cerah */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setIsFollowed(!isFollowed)}
              className="flex items-center justify-center gap-1.5 rounded-full bg-[#22c55e] px-9 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#22c55e]/25 transition-all hover:bg-[#16a34a] active:scale-95 dz-interactive-mobile"
            >
              {isFollowed ? (
                <>
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  <span>Following</span>
                </>
              ) : (
                <span>Follow</span>
              )}
            </button>

            {/* Shortcut Cepat ke Presensi GPS atau Kartu QR */}
            <GpsAttendanceDialog>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95 dz-interactive-mobile"
                title="Presensi GPS"
              >
                <Sparkles className="h-4 w-4 text-emerald-400" />
              </button>
            </GpsAttendanceDialog>

            <DigitalStudentCardDialog />
          </div>
        </div>
      </div>

      {/* ================= 2. STATISTIK 4 KOLOM ================= */}
      <div className="border-b border-slate-100 bg-white shadow-xs">
        <div className="grid grid-cols-4 py-3.5">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`flex flex-col items-center justify-center ${
                i < stats.length - 1 ? 'border-r border-slate-100' : ''
              }`}
            >
              <span className="text-base font-extrabold text-slate-900 leading-none">
                {s.value}
              </span>
              <span className="mt-1 text-[10px] text-slate-400 font-medium">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 3. TAB BAR DENGAN UNDERLINE INDIKATOR HIJAU ================= */}
      <div className="border-b border-slate-200 bg-white">
        <div className="flex overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`relative shrink-0 px-4 py-3 text-xs font-bold transition-colors ${
                  isActive ? 'text-[#16a34a]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span>{tab}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-[#22c55e]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
