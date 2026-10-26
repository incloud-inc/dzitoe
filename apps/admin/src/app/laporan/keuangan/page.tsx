'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Printer,
  Download,
  School,
  QrCode,
  Loader2,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  Wallet,
  Calendar,
  Filter,
  PlusCircle,
  X
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function LaporanKeuanganPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tahunAjaran, setTahunAjaran] = useState('2025/2026');
  
  // Rekomendasi 36: Form tanggal (Date picker) yang mendukung input manual via keyboard typing
  const [startDate, setStartDate] = useState('2025-07-01');
  const [endDate, setEndDate] = useState('2026-06-30');

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'NERACA' | 'ARUS_KAS' | 'TRANSAKSI'>('NERACA');

  // Form Catat Kas Masuk / BOS
  const [txForm, setTxForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    nomorBukti: `BKM/BOS/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
    tipe: 'MASUK' as 'MASUK' | 'KELUAR',
    sumberDana: 'BOS' as 'BOS' | 'KOMITE' | 'MANDIRI',
    posId: 'pos-in-02',
    posNama: 'Dana BOS Reguler Kemendikdasmen (30 Rombel)',
    uraian: '',
    nominal: '',
    pj: 'Bendahara BOS SMAN 20',
  });
  const [submittingTx, setSubmittingTx] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/laporan/keuangan?tahunAjaran=${tahunAjaran}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tahunAjaran]);

  const rekap = data?.rekap;
  const rawTransaksi = data?.transaksi || [];

  // Filter transaksi berdasarkan rentang tanggal yang diketik manual
  const filteredTransaksi = useMemo(() => {
    if (!startDate && !endDate) return rawTransaksi;
    return rawTransaksi.filter((t: any) => {
      if (!t.tanggal) return true;
      if (startDate && t.tanggal < startDate) return false;
      if (endDate && t.tanggal > endDate) return false;
      return true;
    });
  }, [rawTransaksi, startDate, endDate]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleExportExcel = () => {
    if (!rekap) return;

    // Sheet 1: Penerimaan
    const wsIn = XLSX.utils.json_to_sheet(
      rekap.posPenerimaan.map((p: any, idx: number) => ({
        No: idx + 1,
        Kode: p.kode,
        'Pos Penerimaan': p.nama,
        Kategori: p.kategori,
        'Target Anggaran (Rp)': p.targetWajib,
        'Realisasi Diterima (Rp)': p.realisasi,
        'Sisa Tunggakan (Rp)': p.sisa,
        'Capaian (%)': `${p.persentase}%`,
      }))
    );

    // Sheet 2: Pengeluaran
    const wsOut = XLSX.utils.json_to_sheet(
      rekap.posPengeluaran.map((p: any, idx: number) => ({
        No: idx + 1,
        Kode: p.kode,
        'Pos Belanja': p.nama,
        Kategori: p.kategori,
        'Alokasi Anggaran (Rp)': p.targetWajib,
        'Realisasi Belanja (Rp)': p.realisasi,
        'Sisa Alokasi (Rp)': p.sisa,
        'Serapan (%)': `${p.persentase}%`,
      }))
    );

    // Sheet 3: Arus Kas Bulanan
    const wsCashflow = XLSX.utils.json_to_sheet(
      rekap.arusKasBulanan.map((c: any, idx: number) => ({
        No: idx + 1,
        Bulan: c.namaBulan,
        'Penerimaan (Rp)': c.masuk,
        'Pengeluaran (Rp)': c.keluar,
        'Surplus / Saldo (Rp)': c.saldo,
      }))
    );

    // Sheet 4: BKU Transaksi Filtered
    const wsTransaksi = XLSX.utils.json_to_sheet(
      filteredTransaksi.map((t: any, idx: number) => ({
        No: idx + 1,
        Tanggal: t.tanggal,
        'No. Bukti': t.nomorBukti,
        Sumber: t.sumberDana,
        Pos: t.posNama,
        Uraian: t.uraian,
        Tipe: t.tipe,
        'Nominal (Rp)': t.nominal,
        'Penanggung Jawab': t.pj,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, wsIn, 'Penerimaan_Sekolah');
    XLSX.utils.book_append_sheet(workbook, wsOut, 'Pengeluaran_Sekolah');
    XLSX.utils.book_append_sheet(workbook, wsCashflow, 'Arus_Kas_Bulanan');
    XLSX.utils.book_append_sheet(workbook, wsTransaksi, 'BKU_Transaksi');

    const fileName = `Laporan_Keuangan_Tahunan_SMAN20_${tahunAjaran.replace('/', '-')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const handleSubmitTx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txForm.nominal || !txForm.uraian || !txForm.nomorBukti) {
      alert('Nominal, uraian transaksi, dan nomor bukti wajib diisi');
      return;
    }
    setSubmittingTx(true);
    try {
      const res = await fetch('/api/laporan/keuangan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(txForm),
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message || 'Transaksi penerimaan kas berhasil disimpan!');
        setShowAddTxModal(false);
        setTxForm((prev) => ({
          ...prev,
          uraian: '',
          nominal: '',
          nomorBukti: `BKM/BOS/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
        }));
        fetchData();
      } else {
        alert(json.error || 'Gagal menyimpan transaksi');
      }
    } catch {
      alert('Terjadi kesalahan koneksi');
    } finally {
      setSubmittingTx(false);
    }
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
            Laporan Keuangan & Neraca Realisasi APBS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pertanggungjawaban anggaran BOS & Komite untuk Inspektorat dengan filter tanggal manual (Rekomendasi 36).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTxForm((prev) => ({
                ...prev,
                tipe: 'MASUK',
                sumberDana: 'BOS',
                posId: 'pos-in-02',
                posNama: 'Dana BOS Reguler Kemendikdasmen (30 Rombel)',
                uraian: 'Penerimaan Dana BOS Reguler Tahap ' + (new Date().getMonth() < 6 ? '1' : '2'),
              }));
              setShowAddTxModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-2xs transition"
          >
            <PlusCircle className="w-3.5 h-3.5 text-teal-400" /> + Catat Penerimaan (BOS / Komite)
          </button>
          <select
            value={tahunAjaran}
            onChange={(e) => setTahunAjaran(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white font-medium"
          >
            <option value="2025/2026">T.A 2025/2026 (Aktif)</option>
            <option value="2024/2025">T.A 2024/2025</option>
          </select>
          <button 
            onClick={() => setShowPrintModal(true)}
            disabled={!rekap}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" /> Cetak Neraca
          </button>
          <button 
            onClick={handleExportExcel}
            disabled={!rekap}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-2xs transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" /> Export Excel
          </button>
        </div>
      </div>

      {/* Date Filter Bar: Keyboard Typing Date Inputs (Rekomendasi 36) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Filter Rentang Tanggal BKU:</span>
          </div>

          {/* Input Tanggal Mulai (Mendukung Ketik Manual) */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="input-tgl-mulai" className="text-slate-500 text-[11px]">Dari:</label>
            <input
              id="input-tgl-mulai"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="YYYY-MM-DD"
              aria-label="Tanggal Mulai (Ketik Manual YYYY-MM-DD)"
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-teal-500 bg-slate-50/50"
            />
          </div>

          {/* Input Tanggal Akhir (Mendukung Ketik Manual) */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="input-tgl-akhir" className="text-slate-500 text-[11px]">Sampai:</label>
            <input
              id="input-tgl-akhir"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="YYYY-MM-DD"
              aria-label="Tanggal Akhir (Ketik Manual YYYY-MM-DD)"
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-teal-500 bg-slate-50/50"
            />
          </div>

          {/* Tombol Preset Rentang Cepat */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setStartDate('2025-07-01');
                setEndDate('2025-12-31');
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition"
            >
              Semester 1
            </button>
            <button
              onClick={() => {
                setStartDate('2026-01-01');
                setEndDate('2026-06-30');
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition"
            >
              Semester 2
            </button>
            <button
              onClick={() => {
                setStartDate('2025-07-01');
                setEndDate('2026-06-30');
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition"
            >
              1 Tahun Penuh
            </button>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          {filteredTransaksi.length} transaksi dalam rentang aktif
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-16 bg-white border border-slate-200 rounded-2xl">
          <Loader2 className="w-7 h-7 animate-spin text-teal-600" />
        </div>
      ) : !rekap ? (
        <div className="text-center p-12 text-slate-500 bg-white rounded-2xl border border-slate-200 text-xs">
          Gagal memuat rekapitulasi data keuangan.
        </div>
      ) : (
        <>
          {/* Top KPI Cards (Accessible Palettes) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Total Penerimaan</span>
                <span className="p-1 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                  <TrendingUp className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums mt-2">
                {formatRupiah(rekap.totalPenerimaan)}
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-teal-700 font-medium">
                <CheckCircle className="w-3 h-3" />
                <span>Realisasi {rekap.persenRealisasi}% dari target</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Total Realisasi Belanja</span>
                <span className="p-1 rounded-md bg-slate-100 text-slate-700">
                  <TrendingDown className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums mt-2">
                {formatRupiah(rekap.totalRealisasi)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Sarpras, GTT, Operasional & KBM
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Sisa Tunggakan Belum Masuk</span>
                <span className="p-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-xl font-extrabold text-amber-800 font-mono tabular-nums mt-2">
                {formatRupiah(rekap.totalTunggakan)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Akumulasi komite & DSP murid
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Saldo Kas Bersih Kumulatif</span>
                <span className="p-1 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                  <Wallet className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-xl font-extrabold text-teal-800 font-mono tabular-nums mt-2">
                {formatRupiah(rekap.totalPenerimaan - rekap.totalRealisasi)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Rekening Kas Sekolah Bank BJB
              </p>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-6 text-xs">
            <button
              onClick={() => setActiveTab('NERACA')}
              className={`pb-2.5 font-bold border-b-2 transition ${
                activeTab === 'NERACA'
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Neraca & Rincian Pos Anggaran (APBS)
            </button>
            <button
              onClick={() => setActiveTab('ARUS_KAS')}
              className={`pb-2.5 font-bold border-b-2 transition ${
                activeTab === 'ARUS_KAS'
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Komparasi BOS vs Komite & Arus Kas
            </button>
            <button
              onClick={() => setActiveTab('TRANSAKSI')}
              className={`pb-2.5 font-bold border-b-2 transition ${
                activeTab === 'TRANSAKSI'
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Buku Kas Umum (BKU Transaksi)
            </button>
          </div>

          {/* Content: Neraca & Pos Anggaran */}
          {activeTab === 'NERACA' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pos Penerimaan */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      I. Rekap Pos Penerimaan Sekolah
                    </h3>
                    <p className="text-[11px] text-slate-500">Target vs Realisasi Kas Masuk</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-50 text-teal-800 rounded-full border border-teal-200">
                    Penerimaan
                  </span>
                </div>

                <div className="space-y-3">
                  {rekap.posPenerimaan.map((pos: any) => (
                    <div key={pos.id} className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400">{pos.kode}</span>
                          <h4 className="text-xs font-bold text-slate-900">{pos.nama}</h4>
                        </div>
                        <span className="text-xs font-bold font-mono text-teal-700">
                          {pos.persentase}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="bg-teal-700 h-full rounded-full" 
                          style={{ width: `${pos.persentase}%` }} 
                        />
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-600 mt-2 font-mono tabular-nums">
                        <span>Target: {formatRupiah(pos.targetWajib)}</span>
                        <span className="font-semibold text-slate-900">Masuk: {formatRupiah(pos.realisasi)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pos Pengeluaran */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      II. Rekap Pos Belanja & Pengeluaran
                    </h3>
                    <p className="text-[11px] text-slate-500">Alokasi vs Realisasi Serapan</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                    Pengeluaran
                  </span>
                </div>

                <div className="space-y-3">
                  {rekap.posPengeluaran.map((pos: any) => (
                    <div key={pos.id} className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400">{pos.kode}</span>
                          <h4 className="text-xs font-bold text-slate-900">{pos.nama}</h4>
                        </div>
                        <span className="text-xs font-bold font-mono text-slate-800">
                          {pos.persentase}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="bg-slate-700 h-full rounded-full" 
                          style={{ width: `${pos.persentase}%` }} 
                        />
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-600 mt-2 font-mono tabular-nums">
                        <span>Alokasi: {formatRupiah(pos.targetWajib)}</span>
                        <span className="font-semibold text-slate-900">Serapan: {formatRupiah(pos.realisasi)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Content: Arus Kas & BOS vs Komite */}
          {activeTab === 'ARUS_KAS' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" />
                    Rekapitulasi Dana BOS (Pemerintah)
                  </h4>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-500">Penerimaan</p>
                      <p className="text-xs font-bold text-teal-800 font-mono tabular-nums mt-0.5">{formatRupiah(rekap.komiteVsBos.bos.masuk)}</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-500">Belanja</p>
                      <p className="text-xs font-bold text-slate-900 font-mono tabular-nums mt-0.5">{formatRupiah(rekap.komiteVsBos.bos.keluar)}</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-500">Sisa Saldo</p>
                      <p className="text-xs font-bold text-slate-800 font-mono tabular-nums mt-0.5">{formatRupiah(rekap.komiteVsBos.bos.saldo)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    Rekapitulasi Dana Komite & Sumbangan Masyarakat
                  </h4>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-500">Penerimaan</p>
                      <p className="text-xs font-bold text-amber-800 font-mono tabular-nums mt-0.5">{formatRupiah(rekap.komiteVsBos.komite.masuk)}</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-500">Belanja</p>
                      <p className="text-xs font-bold text-slate-900 font-mono tabular-nums mt-0.5">{formatRupiah(rekap.komiteVsBos.komite.keluar)}</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-500">Sisa Saldo</p>
                      <p className="text-xs font-bold text-slate-800 font-mono tabular-nums mt-0.5">{formatRupiah(rekap.komiteVsBos.komite.saldo)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabel Arus Kas Bulanan */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Arus Kas Bulanan (T.A {tahunAjaran})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3">Bulan</th>
                        <th className="py-2.5 px-3 text-right">Penerimaan Masuk</th>
                        <th className="py-2.5 px-3 text-right">Pengeluaran Belanja</th>
                        <th className="py-2.5 px-3 text-right font-bold">Saldo Kumulatif</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rekap.arusKasBulanan.map((c: any) => (
                        <tr key={c.bulan} className="hover:bg-slate-50/60 transition">
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{c.namaBulan}</td>
                          <td className="py-2.5 px-3 text-right text-teal-700 font-mono tabular-nums">{formatRupiah(c.masuk)}</td>
                          <td className="py-2.5 px-3 text-right text-slate-600 font-mono tabular-nums">{formatRupiah(c.keluar)}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono tabular-nums">{formatRupiah(c.saldo)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Content: BKU Transaksi */}
          {activeTab === 'TRANSAKSI' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Buku Kas Umum (BKU) — Daftar Transaksi Sesuai Rentang Tanggal
                </h3>
                <span className="text-[11px] text-slate-500">
                  Periode: <strong className="font-mono">{startDate}</strong> s/d <strong className="font-mono">{endDate}</strong>
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Tanggal</th>
                      <th className="py-2.5 px-3">No. Bukti</th>
                      <th className="py-2.5 px-3">Sumber</th>
                      <th className="py-2.5 px-3">Pos Anggaran</th>
                      <th className="py-2.5 px-3">Uraian Transaksi</th>
                      <th className="py-2.5 px-3 text-right">Nominal</th>
                      <th className="py-2.5 px-3">PJ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTransaksi.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          Tidak ada transaksi kas dalam rentang tanggal yang dipilih.
                        </td>
                      </tr>
                    ) : (
                      filteredTransaksi.map((t: any) => (
                        <tr key={t.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 font-mono">{t.tanggal}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-800 font-semibold">{t.nomorBukti}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              t.sumberDana === 'BOS' 
                                ? 'bg-teal-50 text-teal-800 border-teal-200' 
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                              {t.sumberDana}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">{t.posNama}</td>
                          <td className="py-2.5 px-3 text-slate-600 max-w-sm truncate" title={t.uraian}>{t.uraian}</td>
                          <td className={`py-2.5 px-3 text-right font-mono tabular-nums font-bold ${
                            t.tipe === 'MASUK' ? 'text-teal-700' : 'text-slate-800'
                          }`}>
                            {t.tipe === 'MASUK' ? '+' : '-'}{formatRupiah(t.nominal)}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{t.pj}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Modal Cetak Format Resmi Inspektorat & Komite */}
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
                    Laporan Pertanggungjawaban Realisasi Keuangan Tahunan (APBS)
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Buku Neraca & Komparasi Realisasi Tahun Ajaran {tahunAjaran}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 my-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs">
                  <div>
                    <span className="text-slate-500">Total Penerimaan:</span>
                    <p className="text-sm font-bold text-teal-800 font-mono mt-1">{formatRupiah(rekap.totalPenerimaan)}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Total Belanja Realisasi:</span>
                    <p className="text-sm font-bold text-slate-900 font-mono mt-1">{formatRupiah(rekap.totalRealisasi)}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Saldo Akhir Buku Kas:</span>
                    <p className="text-sm font-bold text-slate-800 font-mono mt-1">{formatRupiah(rekap.totalPenerimaan - rekap.totalRealisasi)}</p>
                  </div>
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
                    Kirim ke Printer / PDF
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Catat Transaksi Penerimaan Kas (BOS / Komite / Mandiri) */}
          {showAddTxModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in overflow-y-auto">
              <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Catat Penerimaan Kas Sekolah (BOS / Komite / BKU)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Entri penerimaan kas masuk ke pembukuan APBS dan BKU resmi sekolah
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddTxModal(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmitTx} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tanggal Transaksi</label>
                      <input
                        type="date"
                        value={txForm.tanggal}
                        onChange={(e) => setTxForm({ ...txForm, tanggal: e.target.value })}
                        required
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nomor Bukti Kas (BKM)</label>
                      <input
                        type="text"
                        value={txForm.nomorBukti}
                        onChange={(e) => setTxForm({ ...txForm, nomorBukti: e.target.value })}
                        placeholder="Contoh: BKM/BOS/04/2026"
                        required
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Sumber Dana</label>
                      <select
                        value={txForm.sumberDana}
                        onChange={(e) => {
                          const s = e.target.value as 'BOS' | 'KOMITE' | 'MANDIRI';
                          setTxForm({
                            ...txForm,
                            sumberDana: s,
                            posId: s === 'BOS' ? 'pos-in-02' : s === 'KOMITE' ? 'pos-in-01' : 'pos-in-04',
                            posNama: s === 'BOS' 
                              ? 'Dana BOS Reguler Kemendikdasmen (30 Rombel)' 
                              : s === 'KOMITE' 
                              ? 'Iuran Komite & Sumbangan Pendidikan (SPP)' 
                              : 'Sumbangan Sarana Belajar & Digitalisasi Sekolah',
                          });
                        }}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs bg-white font-medium"
                      >
                        <option value="BOS">Dana BOS (Pemerintah)</option>
                        <option value="KOMITE">Dana Komite Sekolah</option>
                        <option value="MANDIRI">Sumbangan Mandiri / CSR</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Pos Rekening APBS</label>
                      <select
                        value={txForm.posId}
                        onChange={(e) => {
                          const pId = e.target.value;
                          const found = rekap?.posPenerimaan?.find((p: any) => p.id === pId);
                          setTxForm({
                            ...txForm,
                            posId: pId,
                            posNama: found?.nama || txForm.posNama,
                          });
                        }}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs bg-white font-medium"
                      >
                        {rekap?.posPenerimaan?.map((p: any) => (
                          <option key={p.id} value={p.id}>
                            {p.kode} - {p.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Uraian / Deskripsi Kas Masuk</label>
                    <input
                      type="text"
                      value={txForm.uraian}
                      onChange={(e) => setTxForm({ ...txForm, uraian: e.target.value })}
                      placeholder="Contoh: Pencairan Dana BOS Reguler Tahap 1 T.A 2025/2026"
                      required
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nominal Penerimaan (Rp)</label>
                      <input
                        type="number"
                        value={txForm.nominal}
                        onChange={(e) => setTxForm({ ...txForm, nominal: e.target.value })}
                        placeholder="Contoh: 150000000"
                        min="1000"
                        required
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Penanggung Jawab (PJ)</label>
                      <input
                        type="text"
                        value={txForm.pj}
                        onChange={(e) => setTxForm({ ...txForm, pj: e.target.value })}
                        required
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddTxModal(false)}
                      className="px-4 py-2 font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={submittingTx}
                      className="px-4 py-2 font-bold rounded-xl bg-teal-700 hover:bg-teal-800 text-white shadow-2xs transition disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {submittingTx ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      Simpan Penerimaan Kas
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
