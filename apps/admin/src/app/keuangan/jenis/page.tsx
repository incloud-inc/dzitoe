'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Loader2,
  Save,
  X,
  Table as TableIcon,
  LayoutGrid,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface JenisTagihan {
  id: string;
  kode: string;
  nama: string;
  periode: 'SEKALI' | 'BULANAN' | 'SEMESTER';
  defaultNominal: number;
  bolehCicil: boolean;
  maxCicilan: number;
  jatuhTempoHari: number;
  aktif: boolean;
  tahunAjaran: string;
  deskripsi?: string;
}

export default function JenisTagihanPage() {
  const [list, setList] = useState<JenisTagihan[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<JenisTagihan | null>(null);

  const [form, setForm] = useState({
    kode: '',
    nama: '',
    periode: 'BULANAN' as 'SEKALI' | 'BULANAN' | 'SEMESTER',
    defaultNominal: 250000,
    bolehCicil: true,
    maxCicilan: 3,
    jatuhTempoHari: 10,
    aktif: true,
    tahunAjaran: '2025/2026',
    deskripsi: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/keuangan/jenis');
      const json = await res.json();
      if (json.success) setList(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm({
      kode: '',
      nama: '',
      periode: 'BULANAN',
      defaultNominal: 250000,
      bolehCicil: true,
      maxCicilan: 3,
      jatuhTempoHari: 10,
      aktif: true,
      tahunAjaran: '2025/2026',
      deskripsi: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: JenisTagihan) => {
    setEditingItem(item);
    setForm({
      kode: item.kode,
      nama: item.nama,
      periode: item.periode,
      defaultNominal: item.defaultNominal,
      bolehCicil: item.bolehCicil,
      maxCicilan: item.maxCicilan,
      jatuhTempoHari: item.jatuhTempoHari,
      aktif: item.aktif,
      tahunAjaran: item.tahunAjaran,
      deskripsi: item.deskripsi || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem ? { id: editingItem.id, ...form } : form;
      const res = await fetch('/api/keuangan/jenis', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        setModalOpen(false);
        fetchData();
      } else {
        alert(json.error || 'Gagal menyimpan jenis tagihan');
      }
    } catch {
      alert('Terjadi kesalahan koneksi');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jenis tagihan ini?')) return;
    try {
      const res = await fetch(`/api/keuangan/jenis?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) fetchData();
    } catch {
      alert('Gagal menghapus');
    }
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
            <span className="text-xs text-slate-500 font-medium">Modul A14</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Master Jenis Tagihan Sekolah
          </h1>
          <p className="text-slate-500 mt-1">
            Konfigurasi pos iuran SPP, sumbangan gedung, seragam, dan skema periode cicilan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition',
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span>Tabel</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition',
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid</span>
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Tambah Pos Tagihan
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-16">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : list.length === 0 ? (
        <div className="text-center p-12 text-slate-500 border border-dashed rounded-2xl bg-white">
          Belum ada pos tagihan. Klik &quot;Tambah Pos Tagihan&quot; untuk membuat.
        </div>
      ) : viewMode === 'table' ? (
        /* Standard Master Data Table */
        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Kode</th>
                  <th className="py-2.5 px-4">Nama Pos & Deskripsi</th>
                  <th className="py-2.5 px-4">Periode</th>
                  <th className="py-2.5 px-4 text-right">Nominal Standar</th>
                  <th className="py-2.5 px-4">Ketentuan Cicilan</th>
                  <th className="py-2.5 px-4">Jatuh Tempo</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  <th className="py-2.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                        {item.kode}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <span className="font-bold text-slate-900 block">{item.nama}</span>
                      <span className="text-[11px] text-slate-500 line-clamp-1">
                        {item.deskripsi || item.tahunAjaran}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.periode === 'BULANAN'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : item.periode === 'SEMESTER'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-purple-50 text-purple-800 border-purple-200'
                        }`}
                      >
                        {item.periode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatRupiah(item.defaultNominal)}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {item.bolehCicil ? (
                        <span className="font-semibold text-teal-800">Boleh (Max {item.maxCicilan}x)</span>
                      ) : (
                        <span className="text-slate-400">Sekali Bayar</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      Tgl {item.jatuhTempoHari} tiap periode
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition"
                          title="Ubah Konfigurasi"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {list.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-teal-300 transition"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {item.kode}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.periode === 'BULANAN'
                        ? 'bg-blue-100 text-blue-800'
                        : item.periode === 'SEMESTER'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {item.periode}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{item.nama}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                  {item.deskripsi || 'Tidak ada deskripsi'}
                </p>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                  <span className="text-[11px] text-slate-500 block">Nominal Standar:</span>
                  <span className="text-lg font-bold text-teal-800 font-mono tabular-nums">
                    {formatRupiah(item.defaultNominal)}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Boleh Cicil:</span>
                    <span className="font-semibold text-slate-800">
                      {item.bolehCicil ? `Ya (Max ${item.maxCicilan}x)` : 'Tidak'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Jatuh Tempo:</span>
                    <span className="font-semibold text-slate-800">
                      Tgl {item.jatuhTempoHari} tiap periode
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Tahun Ajaran:</span>
                    <span className="font-semibold text-slate-800">{item.tahunAjaran}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[11px] font-medium text-teal-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Pos Aktif
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition"
                    title="Ubah Konfigurasi"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form Tambah / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? 'Edit Pos Tagihan' : 'Tambah Pos Tagihan Baru'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Pos *</label>
                  <input
                    type="text"
                    required
                    value={form.kode}
                    onChange={(e) => setForm({ ...form, kode: e.target.value })}
                    placeholder="Contoh: SPP, DSP, BUKU"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Periode *</label>
                  <select
                    value={form.periode}
                    onChange={(e) => setForm({ ...form, periode: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="BULANAN">Bulanan</option>
                    <option value="SEMESTER">Per Semester</option>
                    <option value="SEKALI">Sekali Bayar (Tahunan / Awal Masuk)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Tagihan *</label>
                <input
                  type="text"
                  required
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  placeholder="Contoh: Iuran Komite & SPP Bulanan"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nominal Standar (Rp) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="5000"
                    value={form.defaultNominal}
                    onChange={(e) => setForm({ ...form, defaultNominal: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jatuh Tempo (Tgl)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={form.jatuhTempoHari}
                    onChange={(e) => setForm({ ...form, jatuhTempoHari: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">Dapat Dicicil (Angsuran)</span>
                    <span className="text-[11px] text-slate-500">Izinkan orang tua membayar bertahap</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.bolehCicil}
                    onChange={(e) => setForm({ ...form, bolehCicil: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                </div>
                {form.bolehCicil && (
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-slate-600">Batas Maksimum Angsuran:</span>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={form.maxCicilan}
                      onChange={(e) => setForm({ ...form, maxCicilan: Number(e.target.value) })}
                      className="w-20 px-2 py-1 text-center border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan / Deskripsi</label>
                <textarea
                  rows={2}
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  placeholder="Penjelasan pos pembiayaan untuk orang tua murid..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Simpan Pos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
