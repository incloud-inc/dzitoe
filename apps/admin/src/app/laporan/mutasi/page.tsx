'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Printer,
  Download,
  Search,
  School,
  QrCode,
  Loader2,
  ChevronLeft,
  ArrowLeftRight,
  UserMinus,
  UserPlus,
  Award,
  AlertTriangle,
  BookOpen,
  Filter
} from 'lucide-react';
import * as XLSX from 'xlsx';

export interface MutationReportItem {
  id: string;
  muridNama: string;
  nis: string;
  nisn: string;
  kelasAsal: string;
  jenisMutasi: 'PINDAH_KELUAR' | 'PINDAH_MASUK' | 'LULUS' | 'DROP_OUT';
  tanggalMutasi: string;
  nomorSurat: string;
  sekolahTujuan?: string;
  sekolahAsal?: string;
  alasan: string;
  catatan?: string;
  statusApproval: string;
  operatorNama?: string;
}

export default function LaporanMutasiPage() {
  const [data, setData] = useState<MutationReportItem[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pindahKeluar: 0,
    pindahMasuk: 0,
    lulus: 0,
    dropOut: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState('ALL');
  const [tahunAjaran, setTahunAjaran] = useState('2025/2026');
  const [showPrintModal, setShowPrintModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = `/api/laporan/mutasi?tahunAjaran=${tahunAjaran}&jenis=${filterJenis}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        if (json.stats) setStats(json.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tahunAjaran, filterJenis]);

  const filteredData = data.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.muridNama.toLowerCase().includes(q) ||
      item.nis.includes(q) ||
      item.nisn.includes(q) ||
      item.nomorSurat.toLowerCase().includes(q) ||
      (item.sekolahTujuan && item.sekolahTujuan.toLowerCase().includes(q)) ||
      (item.sekolahAsal && item.sekolahAsal.toLowerCase().includes(q))
    );
  });

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert('Tidak ada data untuk diekspor');
      return;
    }

    const exportRows = filteredData.map((m, idx) => ({
      No: idx + 1,
      'Nama Peserta Didik': m.muridNama,
      NIS: m.nis,
      NISN: m.nisn,
      'Kelas Terakhir': m.kelasAsal,
      'Jenis Mutasi': m.jenisMutasi,
      'Tanggal Efektif': m.tanggalMutasi,
      'No. SK / Surat Keterangan': m.nomorSurat,
      'Sekolah Asal / Tujuan': m.sekolahTujuan || m.sekolahAsal || '-',
      'Alasan Mutasi': m.alasan,
      'Pejabat Pengesah': m.operatorNama || 'Waka Kesiswaan',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Buku_Induk_Mutasi');

    const fileName = `Buku_Induk_Mutasi_Murid_SMAN20_${tahunAjaran.replace('/', '-')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link 
              href="/laporan" 
              className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Kembali ke Portal Laporan
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Laporan Buku Induk Registrasi Mutasi Murid
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tabel rekapitulasi mutasi berkala (masuk, keluar, lulus, DO) untuk pengawas sekolah & sinkronisasi Dapodik (Rekomendasi 37).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/murid/mutasi"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition"
          >
            Kelola Input Mutasi
          </Link>
          <button 
            onClick={() => setShowPrintModal(true)}
            disabled={filteredData.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" /> Cetak Buku Induk
          </button>
          <button 
            onClick={handleExportExcel}
            disabled={filteredData.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-2xs transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" /> Export Excel
          </button>
        </div>
      </div>

      {/* KPI Stats (Summary Standard) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Catatan</span>
            <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums mt-1.5">{stats.total}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Semua data register</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Pindah Keluar</span>
            <UserMinus className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-800 font-mono tabular-nums mt-1.5">{stats.pindahKeluar}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Siswa mutasi keluar</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Pindah Masuk</span>
            <UserPlus className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-xl font-extrabold text-teal-800 font-mono tabular-nums mt-1.5">{stats.pindahMasuk}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Siswa mutasi masuk</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Tamat / Lulus</span>
            <Award className="w-3.5 h-3.5 text-slate-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums mt-1.5">{stats.lulus}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Alumni terverifikasi</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Drop Out</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-extrabold text-rose-700 font-mono tabular-nums mt-1.5">{stats.dropOut}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Putus sekolah / undur diri</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap flex-1">
          <div className="relative min-w-[260px] max-w-sm flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, NISN, surat, sekolah..."
              className="pl-8 pr-3 py-1.5 w-full text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
          >
            <option value="ALL">Semua Jenis Mutasi</option>
            <option value="PINDAH_KELUAR">Pindah Keluar</option>
            <option value="PINDAH_MASUK">Pindah Masuk</option>
            <option value="LULUS">Lulus</option>
            <option value="DROP_OUT">Drop Out</option>
          </select>

          <select
            value={tahunAjaran}
            onChange={(e) => setTahunAjaran(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
          >
            <option value="2025/2026">T.A 2025/2026 (Aktif)</option>
            <option value="2024/2025">T.A 2024/2025</option>
          </select>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          {filteredData.length} arsip mutasi
        </span>
      </div>

      {/* Table Section (Dense & Tabular-nums) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Buku Register Mutasi Murid SMAN 20 Tangerang
            </h3>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
            Standar Dapodik & Pengawas
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-7 h-7 animate-spin text-teal-600" />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center p-12 text-slate-400 text-xs">
            Tidak ada arsip mutasi yang sesuai dengan filter pencarian.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">No</th>
                  <th className="py-2.5 px-3">Nama Peserta Didik</th>
                  <th className="py-2.5 px-3">NIS / NISN</th>
                  <th className="py-2.5 px-3">Kelas</th>
                  <th className="py-2.5 px-3 text-center">Jenis Mutasi</th>
                  <th className="py-2.5 px-3">Tanggal Efektif</th>
                  <th className="py-2.5 px-3">No. SK Keterangan</th>
                  <th className="py-2.5 px-3">Sekolah Asal / Tujuan</th>
                  <th className="py-2.5 px-3">Alasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-2.5 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{item.muridNama}</td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600">{item.nis} / {item.nisn}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">{item.kelasAsal}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                          item.jenisMutasi === 'PINDAH_MASUK'
                            ? 'bg-teal-50 text-teal-800 border-teal-200'
                            : item.jenisMutasi === 'PINDAH_KELUAR'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : item.jenisMutasi === 'LULUS'
                            ? 'bg-slate-100 text-slate-800 border-slate-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {item.jenisMutasi.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600 whitespace-nowrap">{item.tanggalMutasi}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700">{item.nomorSurat}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      {item.sekolahTujuan || item.sekolahAsal || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={item.alasan}>
                      {item.alasan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Cetak Format Resmi Buku Induk Pengawas */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-5xl p-8 shadow-2xl border border-slate-200 my-8">
            <div className="border-b-4 border-double border-slate-900 pb-4 text-center">
              <div className="flex items-center justify-center gap-4 mb-2">
                <School className="w-12 h-12 text-slate-800" />
                <div>
                  <h3 className="text-sm font-bold tracking-wider text-slate-800 uppercase">
                    Pemerintah Provinsi Banten — Dinas Pendidikan
                  </h3>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    SMA Negeri 20 Kabupaten Tangerang
                  </h2>
                  <p className="text-xs text-slate-600 font-serif italic">
                    Jl. Raya Pakuhaji No. 12, Kab. Tangerang, Banten 15570 | NPSN: 20613840 | info@sman20tangerang.sch.id
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center my-6">
              <h4 className="text-base font-bold underline uppercase text-slate-900">
                Buku Induk Registrasi Mutasi Murid (Masuk, Keluar, Tamat, DO)
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Laporan Berkala Pengawas Sekolah — Tahun Ajaran {tahunAjaran}
              </p>
            </div>

            <div className="overflow-x-auto my-4 max-h-80 border border-slate-300 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                  <tr>
                    <th className="p-2 text-center">No</th>
                    <th className="p-2">Nama Murid</th>
                    <th className="p-2">NISN</th>
                    <th className="p-2">Kelas</th>
                    <th className="p-2 text-center">Jenis Mutasi</th>
                    <th className="p-2">Tgl Mutasi</th>
                    <th className="p-2">No. Surat Keterangan</th>
                    <th className="p-2">Sekolah Asal/Tujuan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredData.map((m, i) => (
                    <tr key={m.id}>
                      <td className="p-2 text-center font-mono">{i + 1}</td>
                      <td className="p-2 font-bold">{m.muridNama}</td>
                      <td className="p-2 font-mono">{m.nisn}</td>
                      <td className="p-2">{m.kelasAsal}</td>
                      <td className="p-2 text-center font-semibold">{m.jenisMutasi}</td>
                      <td className="p-2 font-mono">{m.tanggalMutasi}</td>
                      <td className="p-2 font-mono">{m.nomorSurat}</td>
                      <td className="p-2">{m.sekolahTujuan || m.sekolahAsal || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-2xs"
              >
                Cetak ke PDF / Printer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
