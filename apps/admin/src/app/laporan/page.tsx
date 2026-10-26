'use client';

import React from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  ArrowLeftRight,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Printer,
  FileText
} from 'lucide-react';

export default function LaporanIndexPage() {
  const reportingModules = [
    {
      id: 'absensi',
      title: 'Rekap Presensi Bulanan Kedinasan',
      desc: 'Agregasi kehadiran bulanan murid & tenaga pendidik berformat resmi Dinas Pendidikan Prov. Banten dengan pratinjau split-screen dan cetak kop dinas.',
      href: '/laporan/absensi',
      icon: CalendarCheck,
      badge: 'Dinas Pendidikan',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
      actionText: 'Buka Cetak Absensi',
      exportType: 'Format Presensi Bulanan (.xlsx / PDF)',
      features: ['Filter Periode & Rombel', 'Pratinjau Cetak Berkop', 'Format Resmi Pengawas'],
    },
    {
      id: 'mutasi',
      title: 'Buku Induk Registrasi Mutasi Murid',
      desc: 'Buku register induk siswa mutasi keluar, mutasi masuk, tamat belajar/lulus, dan putus sekolah untuk keperluan sinkronisasi Dapodik dan pengawas sekolah.',
      href: '/laporan/mutasi',
      icon: ArrowLeftRight,
      badge: 'Buku Induk Kesiswaan',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      actionText: 'Buka Buku Mutasi',
      exportType: 'Rekapitulasi Mutasi (.xlsx)',
      features: ['Statistik 5 Kategori Mutasi', 'Pencarian NISN & No. SK', 'Arsip Historis'],
    },
    {
      id: 'keuangan',
      title: 'Laporan Keuangan & Neraca Realisasi',
      desc: 'Neraca pembukuan realisasi anggaran tahunan sekolah (APBS), perbandingan dana BOS vs Komite, arus kas bulanan, dan audit pengawas inspektorat.',
      href: '/laporan/keuangan',
      icon: DollarSign,
      badge: 'Inspektorat & Komite',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      actionText: 'Buka Neraca Keuangan',
      exportType: 'Neraca APBS & BKU (.xlsx)',
      features: ['Date Picker Ketik Manual', 'Neraca Serapan Anggaran', 'Buku Kas Umum (BKU)'],
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Bersih Tanpa Eyebrow Berlebih */}
      <div className="flex justify-between items-start flex-wrap gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Pusat Pelaporan Terpadu & Arsip Kedinasan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pusat pelaporan berkala, buku induk registrasi, dan akuntabilitas anggaran resmi SMAN 20 Kabupaten Tangerang (Rekomendasi 35).
          </p>
        </div>
      </div>

      {/* Card Grid Modul Pelaporan (Fungsional & Tanpa Eyebrow) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reportingModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${mod.badgeColor}`}>
                    {mod.badge}
                  </span>
                </div>

                <h2 className="text-base font-bold text-slate-900 mb-1.5">
                  {mod.title}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {mod.desc}
                </p>

                <div className="space-y-1.5 mb-5 pb-4 border-b border-slate-100">
                  {mod.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
                    {mod.exportType}
                  </span>
                </div>
                <Link
                  href={mod.href}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-2xs"
                >
                  <span>{mod.actionText}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ringkasan Regulasi Kedinasan */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 space-y-0.5">
          <p className="font-bold text-slate-900">
            Kepatuhan Format Standar Permendikdasmen & Badan Pemeriksa
          </p>
          <p className="text-[11px] leading-relaxed">
            Format laporan absensi bulanan, register mutasi siswa, dan neraca realisasi anggaran mengikuti tata persuratan dinas resmi bertanda barcode pengesahan digital dan mendukung ekspor data terstruktur ke format Dapodikdasmen.
          </p>
        </div>
      </div>
    </div>
  );
}
