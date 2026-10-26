'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  ArrowLeft,
  Clock,
  ShieldAlert,
  Info,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';

const PHASE_DETAILS: Record<
  string,
  { phase: string; title: string; description: string }
> = {
  '/keuangan': {
    phase: 'Fase 3: Tata Kelola Keuangan',
    title: 'Portal Keuangan Sekolah',
    description:
      'Pusat tata kelola keuangan sekolah mencakup billing tagihan murid, pengelolaan cicilan komite, kasir kas pembayaran resmi, dan rekapitulasi piutang/tunggakan.',
  },
  '/kurikulum': {
    phase: 'Fase 4: Bank Soal Siap Cetak',
    title: 'Manajemen Kurikulum Merdeka',
    description:
      'Database Capaian Pembelajaran (CP), Tujuan Pembelajaran (TP), Alur Tujuan Pembelajaran (ATP), dan materi pokok Fase E & F.',
  },
  '/bank-soal': {
    phase: 'Fase 4: Bank Soal Siap Cetak',
    title: 'Bank Soal & Naskah Siap Cetak',
    description:
      'Repositori butir soal manual 9 tipe (LaTeX formula, stimulus teks paragraf) dan generator naskah ujian cetak fisik (A4/Folio).',
  },
  '/bk': {
    phase: 'Fase 5: Layanan & Karakter Murid',
    title: 'Bimbingan Konseling & Disiplin Positif',
    description:
      'Pencatatan konseling murid, pembinaan karakter disiplin positif berbasis pendekatan restitusi (Permendikdasmen 2026), dan jadwal konseling tatap muka.',
  },
  '/kesehatan': {
    phase: 'Fase 5: Layanan & Karakter Murid',
    title: 'Rekam Medis & Kesehatan Siswa UKS',
    description:
      'Manajemen kunjungan ruang UKS, telemetri tanda vital, live occupancy kasur rawat tidur UKS, dan cetak surat izin pulang/istirahat medis.',
  },
  '/alumni': {
    phase: 'Fase 6: Alumni & Portal PPID',
    title: 'Database Alumni & Tracer Study',
    description:
      'Direktori lulusan angkatan, survei tracer study kelulusan ke PTN/PTS, dunia kerja, wirausaha, serta pelaporan akreditasi sekolah.',
  },
  '/ppid': {
    phase: 'Fase 6: Alumni & Portal PPID',
    title: 'Portal Keterbukaan Informasi Publik (PPID)',
    description:
      'Pengelolaan keterbukaan informasi publik sekolah, disposisi tiket permohonan informasi warga (UU KIP No. 14/2008), dan arsip publikasi dokumen berkala.',
  },
};

function ComingSoonContent() {
  const searchParams = useSearchParams();
  const fromRoute = searchParams.get('from') || '';

  // Match info based on prefix
  const matchedKey = Object.keys(PHASE_DETAILS).find((key) =>
    fromRoute.startsWith(key)
  );
  const info = matchedKey
    ? PHASE_DETAILS[matchedKey]
    : {
        phase: 'Roadmap Pengembangan DZITOE',
        title: 'Fitur Segera Hadir',
        description:
          'Modul ini telah dijadwalkan pada roadmap rilis bertahap SMAN 20 Kabupaten Tangerang dan sedang dalam tahap pengujian integrasi.',
      };

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-900/10 text-center">
        {/* Top Header Glow */}
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-indigo-950 px-6 pt-10 pb-8 text-white text-center">
          <div className="absolute -top-12 -left-12 h-36 w-36 rounded-full bg-brand-500/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />

          {/* Badge Icon */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner text-amber-300">
            <Sparkles className="h-8 w-8 text-amber-300 animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-300/30 px-3.5 py-1 text-xs font-bold text-amber-200 tracking-wide">
            <span>COMING SOON · SEGERA HADIR</span>
          </div>

          <p className="mt-2 text-xs font-semibold tracking-wide text-brand-200/90">
            {info.phase}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-5 text-left">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {info.title}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              SMAN 20 Kabupaten Tangerang · Rilis Bertahap 2026
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 text-xs leading-relaxed text-slate-600">
            <p className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Info className="h-4 w-4 text-brand-600 shrink-0" />
              Tentang Fitur Ini:
            </p>
            <p>{info.description}</p>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4">
            <span className="relative flex h-3 w-3 mt-0.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <div className="text-xs text-amber-900 leading-snug">
              <p className="font-bold">Status: Dijadwalkan untuk Rilis Bertahap</p>
              <p className="mt-1 text-amber-800/90 text-[11px] leading-relaxed">
                Akses langsung ke rute ini sementara dialihkan demi menjaga stabilitas
                dan keamanan data sekolah sesuai fase prioritas.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-900 px-5 py-3 text-sm font-bold text-white shadow-md shadow-brand-900/20 transition-all hover:bg-brand-800 active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Dashboard Utama</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComingSoonPage() {
  return (
    <DashboardShell>
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-900 border-t-transparent" />
          </div>
        }
      >
        <ComingSoonContent />
      </Suspense>
    </DashboardShell>
  );
}
