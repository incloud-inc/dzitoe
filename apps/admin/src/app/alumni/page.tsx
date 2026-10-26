'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  RefreshCw,
  Building2,
  Briefcase,
  BookOpen,
  Phone,
  Mail,
  Pencil,
  Trash2,
  CheckCircle2,
  TrendingUp,
  Download,
  X,
  Sparkles,
  Users,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { cn } from '@/lib/utils';

export type StatusTracer =
  | 'KULIAH'
  | 'KERJA'
  | 'WIRAUSAHA'
  | 'MENCARI_KERJA'
  | 'BELUM_UPDATE';

export interface AlumniItem {
  id: string;
  nisn: string;
  nama: string;
  tahunLulus: number;
  kelasTerakhir: string;
  nomorHp?: string | null;
  email?: string | null;
  statusTracer: StatusTracer;
  namaKampus?: string | null;
  programStudi?: string | null;
  namaPerusahaan?: string | null;
  posisiKerja?: string | null;
  tahunMasuk?: number | null;
  alamat?: string | null;
  catatan?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<AlumniItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTahun, setSelectedTahun] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [editingAlumni, setEditingAlumni] = useState<AlumniItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nisn: '',
    nama: '',
    tahunLulus: new Date().getFullYear(),
    kelasTerakhir: 'XII MIPA 1',
    nomorHp: '',
    email: '',
    statusTracer: 'BELUM_UPDATE' as StatusTracer,
    namaKampus: '',
    programStudi: '',
    namaPerusahaan: '',
    posisiKerja: '',
    alamat: '',
    catatan: '',
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/alumni');
      const json = await res.json();
      if (json.success) {
        setAlumni(json.data);
        setStats(json.stats);
      }
    } catch (err) {
      console.error('Failed fetching alumni', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await fetch('/api/alumni/sync', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setSyncFeedback(json.message);
        fetchData();
      } else {
        alert(json.message || 'Gagal sinkronisasi');
      }
    } catch (err) {
      console.error('Sync error', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingAlumni ? `/api/alumni/${editingAlumni.id}` : '/api/alumni';
      const method = editingAlumni ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        setEditingAlumni(null);
        resetForm();
        fetchData();
      } else {
        alert(json.message || 'Gagal menyimpan');
      }
    } catch (err) {
      console.error('Save error', err);
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Hapus data alumni ${nama}?`)) return;
    try {
      const res = await fetch(`/api/alumni/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchData();
      } else {
        alert(json.message || 'Gagal menghapus');
      }
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const openEditModal = (item: AlumniItem) => {
    setEditingAlumni(item);
    setFormData({
      nisn: item.nisn,
      nama: item.nama,
      tahunLulus: item.tahunLulus,
      kelasTerakhir: item.kelasTerakhir,
      nomorHp: item.nomorHp || '',
      email: item.email || '',
      statusTracer: item.statusTracer,
      namaKampus: item.namaKampus || '',
      programStudi: item.programStudi || '',
      namaPerusahaan: item.namaPerusahaan || '',
      posisiKerja: item.posisiKerja || '',
      alamat: item.alamat || '',
      catatan: item.catatan || '',
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      nisn: '',
      nama: '',
      tahunLulus: new Date().getFullYear(),
      kelasTerakhir: 'XII MIPA 1',
      nomorHp: '',
      email: '',
      statusTracer: 'BELUM_UPDATE',
      namaKampus: '',
      programStudi: '',
      namaPerusahaan: '',
      posisiKerja: '',
      alamat: '',
      catatan: '',
    });
  };

  const filteredAlumni = useMemo(() => {
    return alumni.filter((a) => {
      if (selectedTahun !== 'ALL' && a.tahunLulus.toString() !== selectedTahun) {
        return false;
      }
      if (selectedStatus !== 'ALL' && a.statusTracer !== selectedStatus) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          a.nama.toLowerCase().includes(q) ||
          a.nisn.toLowerCase().includes(q) ||
          (a.namaKampus && a.namaKampus.toLowerCase().includes(q)) ||
          (a.namaPerusahaan && a.namaPerusahaan.toLowerCase().includes(q)) ||
          (a.posisiKerja && a.posisiKerja.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [alumni, selectedTahun, selectedStatus, search]);

  const getStatusBadge = (status: StatusTracer) => {
    switch (status) {
      case 'KULIAH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <BookOpen className="w-3 h-3" /> Kuliah
          </span>
        );
      case 'KERJA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Briefcase className="w-3 h-3" /> Bekerja
          </span>
        );
      case 'WIRAUSAHA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <TrendingUp className="w-3 h-3" /> Wirausaha
          </span>
        );
      case 'MENCARI_KERJA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Mencari Karir
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Belum Update
          </span>
        );
    }
  };

  const exportCSV = () => {
    const headers = ['NISN', 'Nama', 'Tahun Lulus', 'Kelas Terakhir', 'Status Tracer', 'Kampus/Perusahaan', 'Prodi/Jabatan', 'No HP', 'Email'];
    const rows = filteredAlumni.map((a) => [
      `"${a.nisn}"`,
      `"${a.nama}"`,
      a.tahunLulus,
      `"${a.kelasTerakhir}"`,
      `"${a.statusTracer}"`,
      `"${a.namaKampus || a.namaPerusahaan || '-'}"`,
      `"${a.programStudi || a.posisiKerja || '-'}"`,
      `"${a.nomorHp || '-'}"`,
      `"${a.email || '-'}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `alumni_sman20_${selectedTahun}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                <GraduationCap className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Direktori Alumni & Tracer Study</h1>
                <p className="text-sm text-slate-500">
                  SMAN 20 Kabupaten Tangerang — Pelacakan Karir & Studi Lulusan
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition active:scale-[0.98]"
              title="Sinkronisasi otomatis murid yang diluluskan dari Wisaya Kenaikan Kelas"
            >
              <RefreshCw className={cn('w-4 h-4', isSyncing && 'animate-spin text-indigo-600')} />
              <span>{isSyncing ? 'Sinkronisasi...' : 'Sinkron dari Kelulusan'}</span>
            </button>

            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-xl transition active:scale-[0.98]"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => {
                resetForm();
                setEditingAlumni(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-sm transition active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Alumni</span>
            </button>
          </div>
        </div>

        {/* Sync Alert Banner */}
        {syncFeedback && (
          <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{syncFeedback}</span>
            </div>
            <button onClick={() => setSyncFeedback(null)} className="text-emerald-600 hover:text-emerald-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bento Statistics */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Alumni</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kuliah (PTN/PTS)</p>
                <p className="text-2xl font-bold text-blue-700">{stats.perStatus?.KULIAH || 0}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kerja & Usaha</p>
                <p className="text-2xl font-bold text-emerald-700">
                  {(stats.perStatus?.KERJA || 0) + (stats.perStatus?.WIRAUSAHA || 0)}
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Serapan Karir</p>
                <p className="text-2xl font-bold text-amber-600">{stats.persentaseTerserap}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, NISN, kampus, kantor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Angkatan:</span>
              <select
                value={selectedTahun}
                onChange={(e) => setSelectedTahun(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">Semua Angkatan</option>
                {stats?.angkatanList?.map((yr: number) => (
                  <option key={yr} value={yr.toString()}>
                    Lulusan {yr}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Tracer:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">Semua Status</option>
                <option value="KULIAH">Kuliah</option>
                <option value="KERJA">Bekerja</option>
                <option value="WIRAUSAHA">Wirausaha</option>
                <option value="MENCARI_KERJA">Mencari Karir</option>
                <option value="BELUM_UPDATE">Belum Update</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alumni Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Alumni</th>
                  <th className="px-6 py-4">Kelulusan</th>
                  <th className="px-6 py-4">Status Tracer</th>
                  <th className="px-6 py-4">Instansi / Karir</th>
                  <th className="px-6 py-4">Kontak</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      Memuat data alumni...
                    </td>
                  </tr>
                ) : filteredAlumni.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      Tidak ada data alumni yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredAlumni.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{item.nama}</div>
                        <div className="text-xs text-slate-400 font-mono">NISN: {item.nisn}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">Lulus {item.tahunLulus}</div>
                        <div className="text-xs text-slate-500">{item.kelasTerakhir}</div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(item.statusTracer)}</td>
                      <td className="px-6 py-4">
                        {item.statusTracer === 'KULIAH' && item.namaKampus ? (
                          <div>
                            <div className="font-medium text-slate-900 flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-blue-600" />
                              {item.namaKampus}
                            </div>
                            <div className="text-xs text-slate-500">{item.programStudi || '-'}</div>
                          </div>
                        ) : (item.statusTracer === 'KERJA' || item.statusTracer === 'WIRAUSAHA') && (item.namaPerusahaan || item.posisiKerja) ? (
                          <div>
                            <div className="font-medium text-slate-900 flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                              {item.namaPerusahaan || '-'}
                            </div>
                            <div className="text-xs text-slate-500">{item.posisiKerja || '-'}</div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Belum mengisi instansi</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-0.5 text-xs text-slate-600">
                          {item.nomorHp && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-slate-400" /> {item.nomorHp}
                            </div>
                          )}
                          {item.email && (
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-slate-400" /> {item.email}
                            </div>
                          )}
                          {!item.nomorHp && !item.email && <span className="text-slate-400">-</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 rounded-lg transition"
                            title="Edit Data Tracer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.nama)}
                            className="p-1.5 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition"
                            title="Hapus Alumni"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>

      {/* Modal Add / Edit Alumni */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                {editingAlumni ? 'Perbarui Data Tracer Alumni' : 'Tambah Alumni Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NISN *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingAlumni}
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100"
                    placeholder="0081234567"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="Nama alumni"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Lulus *</label>
                  <input
                    type="number"
                    required
                    value={formData.tahunLulus}
                    onChange={(e) => setFormData({ ...formData, tahunLulus: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas Terakhir *</label>
                  <input
                    type="text"
                    required
                    value={formData.kelasTerakhir}
                    onChange={(e) => setFormData({ ...formData, kelasTerakhir: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="XII MIPA 1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status Tracer Study *</label>
                <select
                  value={formData.statusTracer}
                  onChange={(e) => setFormData({ ...formData, statusTracer: e.target.value as StatusTracer })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="BELUM_UPDATE">Belum Mengisi Tracer</option>
                  <option value="KULIAH">Kuliah di Perguruan Tinggi</option>
                  <option value="KERJA">Bekerja di Instansi / Perusahaan</option>
                  <option value="WIRAUSAHA">Wirausaha Mandiri</option>
                  <option value="MENCARI_KERJA">Sedang Mencari Kerja</option>
                </select>
              </div>

              {formData.statusTracer === 'KULIAH' && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div>
                    <label className="block text-xs font-semibold text-blue-900 mb-1">Nama Kampus</label>
                    <input
                      type="text"
                      value={formData.namaKampus}
                      onChange={(e) => setFormData({ ...formData, namaKampus: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm"
                      placeholder="Contoh: Universitas Indonesia"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-blue-900 mb-1">Program Studi</label>
                    <input
                      type="text"
                      value={formData.programStudi}
                      onChange={(e) => setFormData({ ...formData, programStudi: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm"
                      placeholder="Contoh: Teknik Elektro"
                    />
                  </div>
                </div>
              )}

              {(formData.statusTracer === 'KERJA' || formData.statusTracer === 'WIRAUSAHA') && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-900 mb-1">
                      {formData.statusTracer === 'KERJA' ? 'Nama Perusahaan/Kantor' : 'Nama Usaha/Bisnis'}
                    </label>
                    <input
                      type="text"
                      value={formData.namaPerusahaan}
                      onChange={(e) => setFormData({ ...formData, namaPerusahaan: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg text-sm"
                      placeholder="Contoh: PT Telkom Indonesia"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-emerald-900 mb-1">Posisi / Jabatan</label>
                    <input
                      type="text"
                      value={formData.posisiKerja}
                      onChange={(e) => setFormData({ ...formData, posisiKerja: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg text-sm"
                      placeholder="Contoh: Network Engineer"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
                  <input
                    type="text"
                    value={formData.nomorHp}
                    onChange={(e) => setFormData({ ...formData, nomorHp: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    placeholder="08123456789"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Aktif</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    placeholder="alumni@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Tambahan</label>
                <textarea
                  rows={2}
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  placeholder="Catatan prestasi kelulusan atau info tambahan..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-medium transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition shadow-sm"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
