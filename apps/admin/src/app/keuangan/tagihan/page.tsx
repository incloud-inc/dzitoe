'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  Loader2,
  Calendar,
  Layers,
  ChevronLeft,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Printer,
  Users
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface Tagihan {
  id: string;
  jenisId: string;
  jenisNama: string;
  siswaId: string;
  siswaNama: string;
  nis: string;
  nisn: string;
  rombelId: string;
  rombelNama: string;
  tingkat: 'X' | 'XI' | 'XII';
  tahunAjaran: string;
  periodeLabel: string;
  nominal: number;
  dibayar: number;
  sisa: number;
  status: 'BELUM' | 'SEBAGIAN' | 'LUNAS' | 'BATAL';
  jatuhTempo: string;
  jumlahCicilan: number;
}

export default function TagihanPage() {
  const [data, setData] = useState<Tagihan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [rombelFilter, setRombelFilter] = useState('ALL');
  const [kelasList, setKelasList] = useState<{ id: string; nama: string }[]>([]);
  const [jenisList, setJenisList] = useState<{ id: string; nama: string }[]>([]);

  // Modal Generate Massal
  const [generateModal, setGenerateModal] = useState(false);
  const [genForm, setGenForm] = useState({
    jenisId: '',
    tingkat: 'ALL',
    rombelId: 'ALL',
    periodeLabel: 'April 2026',
    jatuhTempo: '2026-04-10',
    nominal: '',
    jumlahCicilan: 2,
  });
  const [generating, setGenerating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = `/api/keuangan/tagihan?`;
      if (statusFilter !== 'ALL') url += `status=${statusFilter}&`;
      if (rombelFilter !== 'ALL') url += `rombelId=${rombelFilter}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const res = await fetch(url);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/kelas')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setKelasList(j.data);
      })
      .catch(console.error);

    fetch('/api/keuangan/jenis')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setJenisList(j.data);
          if (j.data.length > 0) setGenForm((prev) => ({ ...prev, jenisId: j.data[0].id }));
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchData();
  }, [statusFilter, rombelFilter, search]);

  const handleGenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await fetch('/api/keuangan/tagihan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(genForm),
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        setGenerateModal(false);
        fetchData();
      } else {
        alert(json.error || 'Gagal generate tagihan');
      }
    } catch {
      alert('Terjadi kesalahan jaringan');
    } finally {
      setGenerating(false);
    }
  };

  const handleExportExcel = () => {
    if (data.length === 0) return alert('Tidak ada data tagihan');
    const rows = data.map((t, idx) => ({
      No: idx + 1,
      'Nama Siswa': t.siswaNama,
      NIS: t.nis,
      NISN: t.nisn,
      Rombel: t.rombelNama,
      'Pos Tagihan': t.jenisNama,
      Periode: t.periodeLabel,
      'Nominal (Rp)': t.nominal,
      'Terbayar (Rp)': t.dibayar,
      'Sisa (Rp)': t.sisa,
      Status: t.status,
      'Jatuh Tempo': t.jatuhTempo,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daftar_Tagihan');
    XLSX.writeFile(wb, `Rekap_Tagihan_Siswa_SMAN20.xlsx`);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/keuangan" className="text-xs font-semibold text-emerald-600 hover:underline">
              Portal Keuangan TU
            </Link>
            <span className="text-slate-400 text-xs">/</span>
            <span className="text-xs text-slate-500 font-medium">Modul A15</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Daftar Tagihan Siswa (Billing)
          </h1>
          <p className="text-slate-500 mt-1">
            Manajemen penerbitan tagihan murid, generate tagihan massal per kelas, dan status kelunasan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGenerateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Terbitkan Tagihan Massal
          </button>
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-xs transition"
          >
            <Download className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama siswa, NIS, atau tagihan..."
              className="pl-9 pr-4 py-2 w-full text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="ALL">Semua Status</option>
            <option value="BELUM">Belum Dibayar</option>
            <option value="SEBAGIAN">Sedang Mencicil</option>
            <option value="LUNAS">Lunas</option>
          </select>

          <select
            value={rombelFilter}
            onChange={(e) => setRombelFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="ALL">Semua Rombel (30 Kelas)</option>
            {kelasList.map((k) => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Ditemukan {data.length} data tagihan
        </span>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-900">Tabel Tagihan & Piutang Siswa</h3>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
            Realtime DB
          </span>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : data.length === 0 ? (
            <div className="text-center p-12 text-slate-500 border border-dashed rounded-2xl">
              Tidak ada data tagihan sesuai filter.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">No</th>
                    <th className="py-2.5 px-3">Nama Siswa</th>
                    <th className="py-2.5 px-3">Kelas</th>
                    <th className="py-2.5 px-3">Pos & Periode</th>
                    <th className="py-2.5 px-3 text-right">Nominal</th>
                    <th className="py-2.5 px-3 text-right">Terbayar</th>
                    <th className="py-2.5 px-3 text-right">Sisa</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-center">Jatuh Tempo</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {data.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-2.5 px-3 text-slate-500 font-mono tabular-nums">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-900 block">{row.siswaNama}</span>
                        <span className="text-[11px] font-mono text-slate-500 tabular-nums">{row.nis}</span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-700">{row.rombelNama}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-slate-800 block">{row.jenisNama}</span>
                        <span className="text-[11px] text-slate-500">{row.periodeLabel}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-800 tabular-nums">
                        {formatRupiah(row.nominal)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium text-teal-700 tabular-nums">
                        {formatRupiah(row.dibayar)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {formatRupiah(row.sisa)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] border ${
                            row.status === 'LUNAS'
                              ? 'bg-teal-50 text-teal-800 border-teal-200'
                              : row.status === 'SEBAGIAN'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {row.status === 'SEBAGIAN' ? 'MENCICIL' : row.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-600 tabular-nums">{row.jatuhTempo}</td>
                      <td className="py-2.5 px-3 text-center">
                        <Link
                          href={`/keuangan/cicilan?tagihanId=${row.id}`}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition"
                        >
                          Detail Cicilan
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Terbitkan Tagihan Massal (A15.3) */}
      {generateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Terbitkan Tagihan Massal (Batch Invoicing)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Buat tagihan sekaligus untuk seluruh rombel atau tingkat jenjang kelas murid.
            </p>

            <form onSubmit={handleGenerateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Pos Tagihan *</label>
                <select
                  required
                  value={genForm.jenisId}
                  onChange={(e) => setGenForm({ ...genForm, jenisId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {jenisList.map((j) => (
                    <option key={j.id} value={j.id}>{j.nama}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Tingkat</label>
                  <select
                    value={genForm.tingkat}
                    onChange={(e) => setGenForm({ ...genForm, tingkat: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="ALL">Semua Tingkat (X, XI, XII)</option>
                    <option value="X">Kelas X Saja</option>
                    <option value="XI">Kelas XI Saja</option>
                    <option value="XII">Kelas XII Saja</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Spesifik Rombel</label>
                  <select
                    value={genForm.rombelId}
                    onChange={(e) => setGenForm({ ...genForm, rombelId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="ALL">Semua Rombel</option>
                    {kelasList.map((k) => (
                      <option key={k.id} value={k.id}>{k.nama}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Label Periode *</label>
                  <input
                    type="text"
                    required
                    value={genForm.periodeLabel}
                    onChange={(e) => setGenForm({ ...genForm, periodeLabel: e.target.value })}
                    placeholder="Contoh: April 2026 / Semester Genap"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Jatuh Tempo *</label>
                  <input
                    type="date"
                    required
                    value={genForm.jatuhTempo}
                    onChange={(e) => setGenForm({ ...genForm, jatuhTempo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nominal Kustom (Opsional)</label>
                  <input
                    type="number"
                    placeholder="Kosongkan jika nominal standar"
                    value={genForm.nominal}
                    onChange={(e) => setGenForm({ ...genForm, nominal: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Skema Cicilan (Tahap)</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={genForm.jumlahCicilan}
                    onChange={(e) => setGenForm({ ...genForm, jumlahCicilan: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGenerateModal(false)}
                  className="px-4 py-2 font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="px-4 py-2 font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  Generate Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
