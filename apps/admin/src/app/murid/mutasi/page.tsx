'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeftRight,
  Search,
  Plus,
  Trash2,
  Printer,
  ChevronLeft,
  School,
  AlertTriangle,
  Calendar,
  X,
  UserMinus,
  UserPlus,
  Award,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { cn } from '@/lib/utils';

export interface MutationItem {
  id: string;
  muridId: string;
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
  statusApproval: 'DISETUJUI' | 'PROSES' | 'DITOLAK';
  operatorNama?: string;
  createdAt: string;
}

export interface StudentReference {
  id: string;
  nama: string;
  nis: string;
  nisn: string;
  kelasNama: string;
}

const JENIS_MUTASI_TABS = [
  { value: 'ALL', label: 'Semua Mutasi', icon: ArrowLeftRight },
  { value: 'PINDAH_KELUAR', label: 'Pindah Keluar', icon: UserMinus },
  { value: 'PINDAH_MASUK', label: 'Pindah Masuk', icon: UserPlus },
  { value: 'LULUS', label: 'Lulus', icon: Award },
  { value: 'DROP_OUT', label: 'Drop Out', icon: AlertTriangle },
];

export default function MutasiMuridPage() {
  const [mutations, setMutations] = useState<MutationItem[]>([]);
  const [students, setStudents] = useState<StudentReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pindahKeluar: 0,
    pindahMasuk: 0,
    lulus: 0,
    dropOut: 0,
  });

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Print Preview Modal State
  const [printItem, setPrintItem] = useState<MutationItem | null>(null);

  // Delete State
  const [mutationToDelete, setMutationToDelete] = useState<MutationItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    muridId: '',
    muridNama: '',
    nis: '',
    nisn: '',
    kelasAsal: '',
    jenisMutasi: 'PINDAH_KELUAR' as 'PINDAH_KELUAR' | 'PINDAH_MASUK' | 'LULUS' | 'DROP_OUT',
    tanggalMutasi: new Date().toISOString().split('T')[0],
    nomorSurat: '',
    sekolahTujuan: '',
    sekolahAsal: '',
    alasan: '',
    catatan: '',
    operatorNama: 'Dra. Hj. Nunung (Waka Kesiswaan)',
  });

  const fetchMutations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (activeTab !== 'ALL') params.set('jenis', activeTab);

      const res = await fetch(`/api/murid/mutasi?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setMutations(json.data || []);
        if (json.stats) setStats(json.stats);
      }
    } catch (err) {
      console.error('Gagal mengambil data mutasi:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/murid?limit=150');
      const json = await res.json();
      if (json.success && json.data) {
        setStudents(
          json.data.map((s: any) => ({
            id: s.id,
            nama: s.nama,
            nis: s.nis,
            nisn: s.nisn,
            kelasNama: s.kelasNama,
          }))
        );
      }
    } catch (err) {
      console.error('Gagal mengambil daftar murid:', err);
    }
  };

  useEffect(() => {
    fetchMutations();
  }, [search, activeTab]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleOpenAdd = () => {
    const currentYear = new Date().getFullYear();
    const randomSurat = `421.3/${String(Math.floor(Math.random() * 800) + 100).padStart(3, '0')}/SMAN20/${currentYear}`;
    setFormData({
      muridId: '',
      muridNama: '',
      nis: '',
      nisn: '',
      kelasAsal: '',
      jenisMutasi: 'PINDAH_KELUAR',
      tanggalMutasi: new Date().toISOString().split('T')[0] || '2026-03-28',
      nomorSurat: randomSurat,
      sekolahTujuan: '',
      sekolahAsal: '',
      alasan: '',
      catatan: '',
      operatorNama: 'Dra. Hj. Nunung (Waka Kesiswaan)',
    });
    setShowAddModal(true);
  };

  const handleSelectStudent = (studentId: string) => {
    const s = students.find((item) => item.id === studentId);
    if (s) {
      setFormData((prev) => ({
        ...prev,
        muridId: s.id,
        muridNama: s.nama,
        nis: s.nis,
        nisn: s.nisn,
        kelasAsal: s.kelasNama,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.muridId || !formData.alasan) {
      alert('Pilih siswa dan masukkan alasan mutasi');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/murid/mutasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        setShowAddModal(false);
        fetchMutations();
      } else {
        alert(json.message || 'Gagal merekam mutasi');
      }
    } catch {
      alert('Terjadi kesalahan koneksi saat merekam mutasi');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!mutationToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/murid/mutasi?id=${mutationToDelete.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setMutationToDelete(null);
        fetchMutations();
      } else {
        alert(json.message || 'Gagal menghapus mutasi');
      }
    } catch {
      alert('Terjadi kesalahan koneksi saat menghapus mutasi');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6 pb-12">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/murid"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Kembali ke Data Murid
              </Link>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <ArrowLeftRight className="w-3.5 h-3.5" />
                Modul A5.9
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Mutasi & Pindah Sekolah Murid
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Administrasi riwayat mutasi siswa (Pindah Masuk, Pindah Keluar, Lulus, dan Drop Out) sesuai standar Dapodik 2026.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Rekam Mutasi Baru</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Total Mutasi</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Semua riwayat</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-amber-700">Pindah Keluar</span>
            <p className="text-2xl font-bold text-amber-700 mt-1">{stats.pindahKeluar}</p>
            <p className="text-[11px] text-amber-600 mt-0.5">Ke sekolah lain</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-emerald-700">Pindah Masuk</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{stats.pindahMasuk}</p>
            <p className="text-[11px] text-emerald-600 mt-0.5">Dari sekolah asal</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-blue-700">Lulus</span>
            <p className="text-2xl font-bold text-blue-700 mt-1">{stats.lulus}</p>
            <p className="text-[11px] text-blue-600 mt-0.5">Tamat belajar</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs col-span-2 md:col-span-1">
            <span className="text-xs font-semibold text-rose-700">Drop Out</span>
            <p className="text-2xl font-bold text-rose-700 mt-1">{stats.dropOut}</p>
            <p className="text-[11px] text-rose-600 mt-0.5">Pengunduran diri</p>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-3">
          {JENIS_MUTASI_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition active:scale-95',
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama murid, NISN, no surat, atau sekolah tujuan..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Mutations Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Tanggal & No. Surat</th>
                  <th className="py-3.5 px-4">Nama Siswa</th>
                  <th className="py-3.5 px-4">Jenis Mutasi</th>
                  <th className="py-3.5 px-4">Sekolah Tujuan / Asal</th>
                  <th className="py-3.5 px-4">Alasan & Catatan</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        <span>Memuat rekaman mutasi...</span>
                      </div>
                    </td>
                  </tr>
                ) : mutations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <ArrowLeftRight className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="font-medium text-slate-600">Tidak ada rekaman mutasi yang ditemukan</p>
                      <p className="text-xs text-slate-400 mt-1">Gunakan tombol "Rekam Mutasi Baru" untuk mencatat perpindahan siswa.</p>
                    </td>
                  </tr>
                ) : (
                  mutations.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-4 align-top">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{m.tanggalMutasi}</span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          {m.nomorSurat}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Operator: {m.operatorNama || 'TU SMAN 20'}
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <div className="font-bold text-slate-900">{m.muridNama}</div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <span>NISN: {m.nisn}</span>
                          <span className="bg-slate-100 px-1.5 py-0.2 rounded font-semibold text-slate-700">
                            Kelas {m.kelasAsal}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border',
                            m.jenisMutasi === 'PINDAH_KELUAR'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : m.jenisMutasi === 'PINDAH_MASUK'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : m.jenisMutasi === 'LULUS'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          )}
                        >
                          {m.jenisMutasi === 'PINDAH_KELUAR'
                            ? 'Pindah Keluar'
                            : m.jenisMutasi === 'PINDAH_MASUK'
                            ? 'Pindah Masuk'
                            : m.jenisMutasi === 'LULUS'
                            ? 'Lulus'
                            : 'Drop Out'}
                        </span>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <div className="font-medium text-slate-800 text-xs flex items-center gap-1.5">
                          <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {m.jenisMutasi === 'PINDAH_KELUAR'
                              ? m.sekolahTujuan || '-'
                              : m.jenisMutasi === 'PINDAH_MASUK'
                              ? m.sekolahAsal || '-'
                              : m.sekolahTujuan || 'Tamat Belajar'}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top max-w-xs">
                        <p className="text-xs text-slate-800 font-medium">{m.alasan}</p>
                        {m.catatan && (
                          <p className="text-[11px] text-slate-400 mt-1 italic line-clamp-2">
                            Catatan: {m.catatan}
                          </p>
                        )}
                      </td>

                      <td className="py-4 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPrintItem(m)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition flex items-center gap-1 text-xs font-semibold"
                            title="Cetak Surat Keterangan"
                          >
                            <Printer className="w-3.5 h-3.5 text-slate-500" />
                            <span>Surat</span>
                          </button>
                          <button
                            onClick={() => setMutationToDelete(m)}
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                            title="Hapus Rekaman Mutasi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Rekam Mutasi Baru */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Rekam Mutasi / Pindah Murid
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mencatat mutasi keluar, mutasi masuk, kelulusan, atau pengunduran diri siswa.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select Murid */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pilih Siswa Terkait *
                    </label>
                    <select
                      required
                      value={formData.muridId}
                      onChange={(e) => handleSelectStudent(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="">-- Pilih Murid SMAN 20 --</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nama} ({s.nisn}) - Kelas {s.kelasNama}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Jenis Mutasi *
                    </label>
                    <select
                      value={formData.jenisMutasi}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jenisMutasi: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="PINDAH_KELUAR">Pindah Keluar (Mutasi Keluar)</option>
                      <option value="PINDAH_MASUK">Pindah Masuk (Mutasi Masuk)</option>
                      <option value="LULUS">Lulus / Tamat Belajar</option>
                      <option value="DROP_OUT">Drop Out (Pengunduran Diri)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal Efektif Mutasi *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.tanggalMutasi}
                      onChange={(e) => setFormData({ ...formData, tanggalMutasi: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor Surat Keterangan / SK Mutasi *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nomorSurat}
                      onChange={(e) => setFormData({ ...formData, nomorSurat: e.target.value })}
                      placeholder="Contoh: 421.3/048/SMAN20/II/2026"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  {formData.jenisMutasi === 'PINDAH_KELUAR' && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Sekolah Tujuan
                      </label>
                      <input
                        type="text"
                        value={formData.sekolahTujuan}
                        onChange={(e) => setFormData({ ...formData, sekolahTujuan: e.target.value })}
                        placeholder="Contoh: SMAN 1 Kota Tangerang"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  )}

                  {formData.jenisMutasi === 'PINDAH_MASUK' && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Sekolah Asal
                      </label>
                      <input
                        type="text"
                        value={formData.sekolahAsal}
                        onChange={(e) => setFormData({ ...formData, sekolahAsal: e.target.value })}
                        placeholder="Contoh: SMAN 2 Teluknaga"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Alasan Mutasi *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formData.alasan}
                      onChange={(e) => setFormData({ ...formData, alasan: e.target.value })}
                      placeholder="Contoh: Mengikuti perpindahan tugas kedinasan orang tua..."
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Catatan Kelengkapan Berkas Administrasi
                    </label>
                    <input
                      type="text"
                      value={formData.catatan}
                      onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                      placeholder="Contoh: Buku Rapor Asli diserahkan, Surat Bebas Pustaka lengkap"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {saving && <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                    <span>Rekam Mutasi</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Cetak Surat Keterangan Pindah */}
        {printItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-8 font-serif">
              {/* Kop Surat Resmi */}
              <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Pemerintah Provinsi Banten • Dinas Pendidikan dan Kebudayaan
                </h4>
                <h2 className="text-lg font-black tracking-wide text-slate-900 mt-0.5">
                  SMA NEGERI 20 KABUPATEN TANGERANG
                </h2>
                <p className="text-[11px] text-slate-600 font-sans mt-1">
                  Jl. KH. Saad RT 001/RW 001, Kec. Pakuhaji, Kabupaten Tangerang, Banten 15570
                </p>
              </div>

              {/* Judul Surat */}
              <div className="text-center mb-6">
                <h3 className="text-sm font-bold tracking-wider underline uppercase text-slate-900">
                  SURAT KETERANGAN PINDAH SEKOLAH
                </h3>
                <p className="text-xs font-mono text-slate-600 mt-1">
                  Nomor: {printItem.nomorSurat}
                </p>
              </div>

              {/* Isi Surat */}
              <div className="text-xs text-slate-800 space-y-3 leading-relaxed font-sans">
                <p>
                  Yang bertanda tangan di bawah ini Kepala SMA Negeri 20 Kabupaten Tangerang, menerangkan dengan sesungguhnya bahwa:
                </p>

                <div className="grid grid-cols-3 gap-2 pl-4 py-2 bg-slate-50 rounded-xl border border-slate-100 font-sans">
                  <span className="font-semibold text-slate-600">Nama Siswa:</span>
                  <span className="col-span-2 font-bold text-slate-900">{printItem.muridNama}</span>

                  <span className="font-semibold text-slate-600">NIS / NISN:</span>
                  <span className="col-span-2 text-slate-900 font-mono">{printItem.nis} / {printItem.nisn}</span>

                  <span className="font-semibold text-slate-600">Kelas / Tingkat:</span>
                  <span className="col-span-2 text-slate-900">{printItem.kelasAsal}</span>

                  <span className="font-semibold text-slate-600">Jenis Mutasi:</span>
                  <span className="col-span-2 font-semibold text-slate-900">{printItem.jenisMutasi}</span>

                  <span className="font-semibold text-slate-600">Sekolah Tujuan:</span>
                  <span className="col-span-2 font-bold text-slate-900">{printItem.sekolahTujuan || printItem.sekolahAsal || '-'}</span>

                  <span className="font-semibold text-slate-600">Alasan Pindah:</span>
                  <span className="col-span-2 text-slate-900">{printItem.alasan}</span>
                </div>

                <p>
                  Sesuai dengan surat permohonan kepindahan orang tua/wali siswa bersangkutan dan kelengkapan administrasi yang telah diverifikasi, siswa tersebut dinyatakan resmi berpindah terhitung sejak tanggal <strong>{printItem.tanggalMutasi}</strong>.
                </p>

                <p>
                  Demikian surat keterangan ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.
                </p>
              </div>

              {/* Tanda Tangan */}
              <div className="mt-8 flex justify-end font-sans">
                <div className="text-center w-56 text-xs text-slate-800">
                  <p>Pakuhaji, {printItem.tanggalMutasi}</p>
                  <p className="font-semibold mt-1">Kepala Sekolah,</p>
                  <div className="h-16" />
                  <p className="font-bold underline text-slate-900">Drs. H. Ahmad Sudrajat, M.Pd.</p>
                  <p className="text-[11px] text-slate-500 font-mono">NIP. 19680512 199303 1 004</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between font-sans">
                <span className="text-xs text-slate-400">Dicetak melalui DZITOE School OS 2026</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPrintItem(null)}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Sekarang</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {mutationToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100">
              <div className="flex items-center gap-3 text-red-600 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Hapus Rekaman Mutasi</h3>
                  <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan.</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus catatan mutasi murid{' '}
                <strong className="text-slate-900">{mutationToDelete.muridNama}</strong> (SK:{' '}
                {mutationToDelete.nomorSurat})?
              </p>

              <div className="flex items-center justify-end gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setMutationToDelete(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDelete}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {deleting && <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                  <span>Hapus Catatan</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
