'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  FileText,
  Clock,
  Printer,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Receipt,
  Users,
  BarChart3,
  Calendar,
  HelpCircle,
  ArrowUpRight,
} from 'lucide-react';

export default function KeuanganIndexPage() {
  const [activeTimeframe, setActiveTimeframe] = useState<'bulan' | 'semester'>('bulan');

  // Accessible Data: Realistis untuk SMAN 20 Kab. Tangerang (30 Rombel, ~1.080 siswa)
  const monthlyData = [
    { bulan: 'Jul', masuk: 128_400_000, target: 145_000_000, piutang: 16_600_000 },
    { bulan: 'Agt', masuk: 135_200_000, target: 145_000_000, piutang: 9_800_000 },
    { bulan: 'Sep', masuk: 141_000_000, target: 145_000_000, piutang: 4_000_000 },
    { bulan: 'Okt', masuk: 119_800_000, target: 145_000_000, piutang: 25_200_000 },
    { bulan: 'Nov', masuk: 130_500_000, target: 145_000_000, piutang: 14_500_000 },
    { bulan: 'Des', masuk: 142_800_000, target: 145_000_000, piutang: 2_200_000 },
  ];

  const maxVal = 160_000_000;

  const financeModules = [
    {
      id: 'A14',
      title: 'Master Jenis Tagihan',
      desc: 'Konfigurasi pos biaya iuran SPP komite, paket seragam, dana gedung DSP, batas maksimal termin cicilan & tanggal jatuh tempo.',
      href: '/keuangan/jenis',
      icon: CreditCard,
      badge: 'Master Biaya',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      status: 'Selesai 100% (A14.1 - A14.4)',
      features: ['Periode Sekali/Bulan/Semester', 'Batas Angsuran', 'Pengaturan Nominal'],
    },
    {
      id: 'A15',
      title: 'Daftar Tagihan Siswa (Billing)',
      desc: 'Penerbitan tagihan siswa, batch invoicing massal per rombel/tingkat jenjang kelas, filter status & export Excel piutang.',
      href: '/keuangan/tagihan',
      icon: FileText,
      badge: 'Penagihan Massal',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      status: 'Selesai 100% (A15.1 - A15.6)',
      features: ['Generate Massal 30 Rombel', 'Filter Kelunasan', 'Export Data Tagihan'],
    },
    {
      id: 'A16',
      title: 'Skema Cicilan & Angsuran',
      desc: 'Monitoring jadwal angsuran per termin, visualisasi progress bar kelunasan, dan gateway notifikasi WhatsApp jatuh tempo.',
      href: '/keuangan/cicilan',
      icon: Clock,
      badge: 'Termin Angsuran',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      status: 'Selesai 100% (A16.1 - A16.5)',
      features: ['Progress Bar Kelunasan', 'Kartu Angsuran Termin', 'Quick Pay Termin'],
    },
    {
      id: 'A17',
      title: 'Transaksi & Kwitansi Resmi',
      desc: 'Pencatatan kas loket TU, multi-metode (Tunai, Transfer, QRIS, VA) & cetak kwitansi tanda bukti resmi ber-QR verifikasi.',
      href: '/keuangan/pembayaran',
      icon: Receipt,
      badge: 'Loket & Kwitansi',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      status: 'Selesai 100% (A17.1 - A17.7)',
      features: ['Multi-Metode Pembayaran', 'Cetak Kwitansi Ber-QR', 'Register Kas Masuk'],
    },
    {
      id: 'A18',
      title: 'Monitoring Tunggakan Siswa',
      desc: 'Deteksi dini piutang murid berjalan, rekap tunggakan per rombel kelas, dan fitur blast WhatsApp pengingat SPP otomatis.',
      href: '/keuangan/tunggakan',
      icon: AlertTriangle,
      badge: 'Piutang & Blast WA',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      status: 'Selesai 100% (A18.1 - A18.5)',
      features: ['Rekap Per Rombel', 'Daftar Siswa Menunggak', 'Blast Pengingat WA'],
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tata Kelola Keuangan Sekolah SMAN 20 Kabupaten Tangerang</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard Perbendaharaan & Kas Sekolah
          </h1>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
            Pusat pemantauan arus kas komite, penerimaan iuran berkala, realisasi target pendapatan, dan mitigasi risiko tunggakan siswa.
          </p>
        </div>
      </div>

      {/* Widget Metrics (Colorblind-Safe: Teal & Amber-Slate, High Contrast) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Realisasi Masuk */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Realisasi Kas
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-3 font-mono tabular-nums">
            Rp 797.700.000
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
              91.7% Terkumpul
            </span>
            <span className="text-[11px] text-slate-400">dari target semester</span>
          </div>
        </div>

        {/* Metric 2: Sisa Piutang / Tunggakan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sisa Piutang Berjalan
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-3 font-mono tabular-nums">
            Rp 72.300.000
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              8.3% Belum Lunas
            </span>
            <span className="text-[11px] text-slate-400">142 siswa menunggak</span>
          </div>
        </div>

        {/* Metric 3: Target Anggaran */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Target Anggaran (TA 26/27)
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-3 font-mono tabular-nums">
            Rp 870.000.000
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] text-slate-500 font-medium">
              30 Rombel • 1.080 Murid Aktif
            </span>
          </div>
        </div>

        {/* Metric 4: Transaksi Bulan Ini */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Transaksi Bulan Berjalan
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-3 font-mono tabular-nums">
            938 Kwitansi
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] text-indigo-700 font-bold">
              68% Non-Tunai (QRIS/VA)
            </span>
          </div>
        </div>
      </div>

      {/* Accessible Bar Chart Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-600" />
              <span>Tren Penerimaan Kas & Piutang per Bulan</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Grafik komparatif realisasi kas masuk vs sisa piutang (Skema warna aksesibel untuk semua guru & komite).
            </p>
          </div>

          {/* Accessible Legend */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-sm bg-teal-600 inline-block shadow-2xs" />
              <span className="text-slate-700">Realisasi Kas Masuk</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-sm bg-amber-500 inline-block shadow-2xs" />
              <span className="text-slate-700">Sisa Piutang</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-4">
          <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-52 pb-2 border-b border-slate-200">
            {monthlyData.map((d, i) => {
              const masukHeight = (d.masuk / maxVal) * 100;
              const piutangHeight = (d.piutang / maxVal) * 100;
              return (
                <div key={i} className="flex flex-col items-center h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition mb-1 text-center font-bold">
                    {(d.masuk / 1_000_000).toFixed(0)}M
                  </div>

                  {/* Dual Bar Stack */}
                  <div className="w-full max-w-[42px] flex items-end justify-center gap-1.5 h-full">
                    {/* Bar Kas Masuk (Teal) */}
                    <div
                      style={{ height: `${masukHeight}%` }}
                      className="w-1/2 bg-teal-600 rounded-t-md hover:bg-teal-500 transition-all cursor-pointer relative"
                      title={`${d.bulan}: Realisasi Rp ${d.masuk.toLocaleString('id-ID')}`}
                    />
                    {/* Bar Piutang (Warm Amber) */}
                    <div
                      style={{ height: `${Math.max(piutangHeight, 6)}%` }}
                      className="w-1/2 bg-amber-500 rounded-t-md hover:bg-amber-400 transition-all cursor-pointer relative"
                      title={`${d.bulan}: Piutang Rp ${d.piutang.toLocaleString('id-ID')}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Month Labels & Numbers */}
          <div className="grid grid-cols-6 gap-3 sm:gap-6 pt-3 text-center">
            {monthlyData.map((d, i) => (
              <div key={i} className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 block">{d.bulan} 2026</span>
                <span className="text-[10px] font-mono text-teal-700 font-bold block tabular-nums">
                  Rp {(d.masuk / 1_000_000).toFixed(1)} jt
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Sub-Modul */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900">Modul Operasional Keuangan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {financeModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-105 transition">
                      <Icon className="w-5 h-5 text-teal-700" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${mod.badgeColor}`}>
                      {mod.badge}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono font-bold text-slate-400 mb-0.5">
                    MODUL {mod.id}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">{mod.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{mod.desc}</p>

                  <div className="space-y-1.5 mb-6">
                    {mod.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-teal-700 mb-3 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{mod.status}</span>
                  </div>
                  <Link
                    href={mod.href}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-2xs"
                  >
                    <span>Buka Modul</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-4">
        <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-900">
            Akuntabilitas Transaksi Keuangan Siswa & Komite SMAN 20 Kabupaten Tangerang
          </p>
          <p>
            Semua pembayaran terverifikasi secara realtime, otomatis mengurangi saldo piutang siswa, dan terintegrasi langsung dengan Modul Pelaporan Keuangan Tahunan (A28) serta buku kas umum (BKU).
          </p>
        </div>
      </div>
    </div>
  );
}
