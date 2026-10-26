'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  HeartHandshake,
  Search,
  Plus,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  Download,
  Pencil,
  Trash2,
  X,
  Compass,
  Sparkles,
  Lock,
  MessageSquare,
  LayoutGrid,
  Table as TableIcon,
  ArrowRight,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { cn } from '@/lib/utils';

export type JenisBK =
  | 'KONSELING_INDIVIDU'
  | 'KONSELING_KELOMPOK'
  | 'BIMBINGAN_KARIR'
  | 'DISIPLIN_POSITIF'
  | 'RUJUKAN';

export type StatusBK = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export type TingkatPrivasi =
  | 'SANGAT_RAHASIA'
  | 'TERBATAS_GURU_BK'
  | 'KOORDINASI_WALI_KELAS';

export interface BKItem {
  id: string;
  muridId: string;
  muridNama: string;
  kelasNama: string;
  jenis: JenisBK;
  konselor: string;
  tanggal: string;
  permasalahan: string;
  latarBelakang?: string | null;
  solusi?: string | null;
  komitmenMurid?: string | null;
  tindakLanjut?: string | null;
  status: StatusBK;
  privasi: TingkatPrivasi;
  jadwalTatapMuka?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function BKPage() {
  const [records, setRecords] = useState<BKItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [studentsList, setStudentsList] = useState<{ id: string; nama: string; kelasNama: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedJenis, setSelectedJenis] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BKItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    muridId: '',
    muridNama: '',
    kelasNama: '',
    jenis: 'KONSELING_INDIVIDU' as JenisBK,
    konselor: 'Dra. Hj. Sri Wahyuni, M.Pd (Guru BK)',
    tanggal: new Date().toISOString().slice(0, 10),
    permasalahan: '',
    latarBelakang: '',
    solusi: '',
    komitmenMurid: '',
    tindakLanjut: '',
    status: 'IN_PROGRESS' as StatusBK,
    privasi: 'TERBATAS_GURU_BK' as TingkatPrivasi,
    jadwalTatapMuka: '',
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resBK, resMurid] = await Promise.all([
        fetch('/api/bk'),
        fetch('/api/murid?limit=100'),
      ]);
      const json = await resBK.json();
      if (json.success) {
        setRecords(json.data);
        setStats(json.stats);
      }
      const jsonMurid = await resMurid.json();
      if (jsonMurid.data) {
        setStudentsList(jsonMurid.data.map((m: any) => ({ id: m.id, nama: m.nama, kelasNama: m.kelasNama })));
      }
    } catch (err) {
      console.error('Failed fetching BK records', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStudentChange = (id: string) => {
    const s = studentsList.find((item) => item.id === id);
    setFormData((prev) => ({
      ...prev,
      muridId: id,
      muridNama: s ? s.nama : '',
      kelasNama: s ? s.kelasNama : '',
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingRecord ? `/api/bk/${editingRecord.id}` : '/api/bk';
      const method = editingRecord ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        setEditingRecord(null);
        resetForm();
        fetchData();
      } else {
        alert(json.message || 'Gagal menyimpan catatan BK');
      }
    } catch (err) {
      console.error('Save BK error', err);
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Hapus catatan konseling ${nama}?`)) return;
    try {
      const res = await fetch(`/api/bk/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchData();
      } else {
        alert(json.message || 'Gagal menghapus');
      }
    } catch (err) {
      console.error('Delete BK error', err);
    }
  };

  const openEditModal = (item: BKItem) => {
    setEditingRecord(item);
    setFormData({
      muridId: item.muridId,
      muridNama: item.muridNama,
      kelasNama: item.kelasNama,
      jenis: item.jenis,
      konselor: item.konselor,
      tanggal: item.tanggal || new Date().toISOString().slice(0, 10),
      permasalahan: item.permasalahan,
      latarBelakang: item.latarBelakang || '',
      solusi: item.solusi || '',
      komitmenMurid: item.komitmenMurid || '',
      tindakLanjut: item.tindakLanjut || '',
      status: item.status,
      privasi: item.privasi,
      jadwalTatapMuka: item.jadwalTatapMuka || '',
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      muridId: studentsList[0]?.id || '',
      muridNama: studentsList[0]?.nama || '',
      kelasNama: studentsList[0]?.kelasNama || '',
      jenis: 'KONSELING_INDIVIDU',
      konselor: 'Dra. Hj. Sri Wahyuni, M.Pd (Guru BK)',
      tanggal: new Date().toISOString().slice(0, 10),
      permasalahan: '',
      latarBelakang: '',
      solusi: '',
      komitmenMurid: '',
      tindakLanjut: '',
      status: 'IN_PROGRESS',
      privasi: 'TERBATAS_GURU_BK',
      jadwalTatapMuka: '',
    });
  };

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (selectedJenis !== 'ALL' && r.jenis !== selectedJenis) return false;
      if (selectedStatus !== 'ALL' && r.status !== selectedStatus) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          r.muridNama.toLowerCase().includes(q) ||
          r.kelasNama.toLowerCase().includes(q) ||
          r.konselor.toLowerCase().includes(q) ||
          r.permasalahan.toLowerCase().includes(q) ||
          (r.solusi && r.solusi.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [records, selectedJenis, selectedStatus, search]);

  const getJenisBadge = (jenis: JenisBK) => {
    switch (jenis) {
      case 'KONSELING_INDIVIDU':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <MessageSquare className="w-3 h-3" /> Konseling Individu
          </span>
        );
      case 'DISIPLIN_POSITIF':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Sparkles className="w-3 h-3" /> Disiplin Positif (Restitusi)
          </span>
        );
      case 'BIMBINGAN_KARIR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Compass className="w-3 h-3" /> Bimbingan Karir & Studi
          </span>
        );
      case 'KONSELING_KELOMPOK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Users className="w-3 h-3" /> Konseling Kelompok
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Rujukan Khusus
          </span>
        );
    }
  };

  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');

  const getStatusBadge = (status: StatusBK) => {
    switch (status) {
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <CheckCircle2 className="w-3 h-3 text-slate-500" /> Restitusi Selesai
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
            <Clock className="w-3 h-3 text-amber-600" /> Pendampingan Aktif
          </span>
        );
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200/80">
            Menunggu Sesi
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
            Tutup Kasus
          </span>
        );
    }
  };

  const handleQuickStatus = async (id: string, newStatus: StatusBK) => {
    try {
      const res = await fetch(`/api/bk/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setRecords((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const exportCSV = () => {
    const headers = ['Tanggal', 'Nama Murid', 'Kelas', 'Jenis Layanan', 'Konselor', 'Permasalahan', 'Solusi Restitusi', 'Komitmen', 'Status'];
    const rows = filteredRecords.map((r) => [
      `"${r.tanggal}"`,
      `"${r.muridNama}"`,
      `"${r.kelasNama}"`,
      `"${r.jenis}"`,
      `"${r.konselor}"`,
      `"${r.permasalahan.replace(/"/g, '""')}"`,
      `"${(r.solusi || '-').replace(/"/g, '""')}"`,
      `"${(r.komitmenMurid || '-').replace(/"/g, '""')}"`,
      `"${r.status}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_bk_sman20_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <HeartHandshake className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Bimbingan Konseling & Disiplin Positif</h1>
              <p className="text-sm text-slate-500">
                SMAN 20 Kabupaten Tangerang — Pendampingan Restitusi Siswa (Permendikdasmen No. 1–6 Tahun 2026)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-xl transition active:scale-[0.98]"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export Rekap BK</span>
            </button>

            <button
              onClick={() => {
                resetForm();
                setEditingRecord(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-sm transition active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Sesi Konseling / Restitusi</span>
            </button>
          </div>
        </div>

        {/* Bento Statistics */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Layanan BK</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pendampingan Aktif</p>
                <p className="text-2xl font-bold text-amber-600">{stats.aktif}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Restitusi Selesai</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.selesai}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tatap Muka Terjadwal</p>
                <p className="text-2xl font-bold text-blue-600">{stats.terjadwalTatapMuka}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari murid, konselor, topik..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Jenis:</span>
              <select
                value={selectedJenis}
                onChange={(e) => setSelectedJenis(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">Semua Jenis Layanan</option>
                <option value="KONSELING_INDIVIDU">Konseling Individu</option>
                <option value="DISIPLIN_POSITIF">Disiplin Positif (Restitusi)</option>
                <option value="BIMBINGAN_KARIR">Bimbingan Karir & Studi</option>
                <option value="KONSELING_KELOMPOK">Konseling Kelompok</option>
                <option value="RUJUKAN">Rujukan Khusus</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">Semua Status</option>
                <option value="IN_PROGRESS">Pendampingan Aktif</option>
                <option value="RESOLVED">Restitusi Selesai</option>
                <option value="OPEN">Menunggu Sesi</option>
                <option value="CLOSED">Tutup Kasus</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setViewMode('board')}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition',
                  viewMode === 'board'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Kanban</span>
              </button>
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
            </div>
          </div>
        </div>

        {/* Content Views */}
        {viewMode === 'board' ? (
          /* 1. KANBAN BOARD VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
            {(
              [
                {
                  key: 'OPEN',
                  label: 'Menunggu Sesi',
                  sub: 'Laporan / Permohonan Masuk',
                  dot: 'bg-sky-400',
                  badge: 'bg-sky-50 text-sky-800 border-sky-200',
                },
                {
                  key: 'IN_PROGRESS',
                  label: 'Pendampingan Aktif',
                  sub: 'Dalam Proses Konseling & Restitusi',
                  dot: 'bg-amber-500',
                  badge: 'bg-amber-50 text-amber-800 border-amber-200/80',
                },
                {
                  key: 'RESOLVED',
                  label: 'Restitusi Selesai',
                  sub: 'Kesepakatan Solutif Tercapai',
                  dot: 'bg-slate-500',
                  badge: 'bg-slate-100 text-slate-700 border-slate-200',
                },
                {
                  key: 'CLOSED',
                  label: 'Tutup Kasus',
                  sub: 'Arsip Selesai Ditindaklanjuti',
                  dot: 'bg-slate-300',
                  badge: 'bg-slate-100 text-slate-500 border-slate-200',
                },
              ] as const
            ).map((column) => {
              const columnItems = filteredRecords.filter((r) => r.status === column.key);
              return (
                <div
                  key={column.key}
                  className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-3.5 flex flex-col min-h-[480px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <span className={cn('h-2.5 w-2.5 rounded-full', column.dot)} />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{column.label}</h4>
                        <p className="text-[10px] text-slate-400 leading-none mt-0.5">{column.sub}</p>
                      </div>
                    </div>
                    <span className={cn('px-2 py-0.5 rounded-full text-[11px] font-bold border', column.badge)}>
                      {columnItems.length}
                    </span>
                  </div>

                  {/* Cards List */}
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {columnItems.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-slate-400 bg-white/50">
                        <p className="text-xs">Tidak ada data di kolom ini</p>
                      </div>
                    ) : (
                      columnItems.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition space-y-2.5 group"
                        >
                          {/* Student & Date */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h5 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {item.muridNama}
                              </h5>
                              <p className="text-[11px] text-slate-500">Kelas {item.kelasNama} • {item.tanggal}</p>
                            </div>
                            <div className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5 text-slate-400" />
                              <span>{item.privasi.replace(/_/g, ' ')}</span>
                            </div>
                          </div>

                          {/* Category Badge */}
                          <div>{getJenisBadge(item.jenis)}</div>

                          {/* Permasalahan */}
                          <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="font-semibold text-slate-800 block text-[11px] mb-0.5">Pokok Kasus:</span>
                            <p className="line-clamp-2 leading-relaxed">{item.permasalahan}</p>
                          </div>

                          {/* Restitusi / Komitmen if any */}
                          {(item.solusi || item.komitmenMurid) && (
                            <div className="text-[11px] text-slate-600 bg-amber-50/40 p-2 rounded-lg border border-amber-100/60">
                              {item.solusi && (
                                <p className="line-clamp-2 font-medium text-slate-800">
                                  💡 <span className="font-bold">Solusi:</span> {item.solusi}
                                </p>
                              )}
                              {item.komitmenMurid && (
                                <p className="line-clamp-1 text-slate-700 mt-0.5">
                                  🤝 <span className="font-bold">Komitmen:</span> {item.komitmenMurid}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Counselor */}
                          <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between border-t border-slate-100">
                            <span className="truncate max-w-[130px]">{item.konselor}</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openEditModal(item)}
                                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition"
                                title="Edit Sesi BK"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(item.id, item.muridNama)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                                title="Hapus Sesi BK"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Quick Stage Move Actions */}
                          <div className="pt-1.5 flex items-center justify-between gap-1.5 text-[10px]">
                            {item.status === 'OPEN' && (
                              <button
                                type="button"
                                onClick={() => handleQuickStatus(item.id, 'IN_PROGRESS')}
                                className="w-full py-1 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold border border-amber-200/80 transition flex items-center justify-center gap-1"
                              >
                                <span>Mulai Bimbingan</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                            {item.status === 'IN_PROGRESS' && (
                              <button
                                type="button"
                                onClick={() => handleQuickStatus(item.id, 'RESOLVED')}
                                className="w-full py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 transition flex items-center justify-center gap-1"
                              >
                                <span>Tandai Selesai</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                            {item.status === 'RESOLVED' && (
                              <button
                                type="button"
                                onClick={() => handleQuickStatus(item.id, 'CLOSED')}
                                className="w-full py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold border border-slate-200 transition"
                              >
                                Tutup Kasus
                              </button>
                            )}
                            {item.status === 'CLOSED' && (
                              <button
                                type="button"
                                onClick={() => handleQuickStatus(item.id, 'IN_PROGRESS')}
                                className="w-full py-1 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold border border-slate-200 transition"
                              >
                                Buka Kembali Kasus
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* 2. TABLE VIEW */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/75 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Siswa & Tanggal</th>
                    <th className="px-6 py-4">Layanan & Privasi</th>
                    <th className="px-6 py-4">Pokok Bahasan / Permasalahan</th>
                    <th className="px-6 py-4">Langkah Restitusi & Komitmen</th>
                    <th className="px-6 py-4">Status & Jadwal</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        Memuat data pelayanan BK...
                      </td>
                    </tr>
                  ) : filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        Tidak ada catatan konseling yang sesuai.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{item.muridNama}</div>
                          <div className="text-xs text-slate-500">{item.kelasNama} • {item.tanggal}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div>{getJenisBadge(item.jenis)}</div>
                          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span>{item.privasi.replace(/_/g, ' ')}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <div className="font-medium text-slate-900 text-xs">{item.permasalahan}</div>
                          {item.latarBelakang && (
                            <div className="text-xs text-slate-400 mt-0.5 line-clamp-1 italic">
                              Latar: {item.latarBelakang}
                            </div>
                          )}
                          <div className="text-[11px] text-slate-400 mt-1">Konselor: {item.konselor}</div>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          {item.solusi && (
                            <div className="text-xs text-slate-700 font-medium line-clamp-2">
                              💡 {item.solusi}
                            </div>
                          )}
                          {item.komitmenMurid && (
                            <div className="text-xs text-emerald-700 mt-1 line-clamp-1">
                              🤝 Komitmen: {item.komitmenMurid}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div>{getStatusBadge(item.status)}</div>
                          {item.jadwalTatapMuka && (
                            <div className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Tatap Muka: {new Date(item.jadwalTatapMuka).toLocaleDateString('id-ID')}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 rounded-lg transition"
                              title="Edit Catatan BK"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.muridNama)}
                              className="p-1.5 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition"
                              title="Hapus Catatan BK"
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
        )}
      </div>

      {/* Modal Add / Edit BK Record */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-indigo-50/30">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-indigo-600" />
                {editingRecord ? 'Perbarui Catatan Bimbingan Konseling' : 'Catat Sesi Bimbingan & Restitusi Siswa'}
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Murid *</label>
                  <select
                    required
                    value={formData.muridId}
                    onChange={(e) => handleStudentChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">-- Pilih Murid --</option>
                    {studentsList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nama} ({s.kelasNama})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Layanan BK *</label>
                  <select
                    value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value as JenisBK })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="KONSELING_INDIVIDU">Konseling Individu</option>
                    <option value="DISIPLIN_POSITIF">Disiplin Positif (Restitusi Karakter)</option>
                    <option value="BIMBINGAN_KARIR">Bimbingan Karir & Peminatan Studi</option>
                    <option value="KONSELING_KELOMPOK">Konseling Kelompok</option>
                    <option value="RUJUKAN">Rujukan Khusus Ahli / Psikolog</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Konselor / Pembina</label>
                  <input
                    type="text"
                    required
                    value={formData.konselor}
                    onChange={(e) => setFormData({ ...formData, konselor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tingkat Privasi</label>
                  <select
                    value={formData.privasi}
                    onChange={(e) => setFormData({ ...formData, privasi: e.target.value as TingkatPrivasi })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="TERBATAS_GURU_BK">Terbatas Guru BK</option>
                    <option value="SANGAT_RAHASIA">Sangat Rahasia (Konselor & KS)</option>
                    <option value="KOORDINASI_WALI_KELAS">Koordinasi dengan Wali Kelas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Sesi</label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pokok Pembahasan / Permasalahan *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Uraian permasalahan atau topik konsultasi siswa..."
                  value={formData.permasalahan}
                  onChange={(e) => setFormData({ ...formData, permasalahan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Latar Belakang / Akar Masalah
                </label>
                <input
                  type="text"
                  placeholder="Penyebab yang melandasi kondisi murid..."
                  value={formData.latarBelakang}
                  onChange={(e) => setFormData({ ...formData, latarBelakang: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Langkah Solusi / Restitusi Disiplin Positif
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Langkah pembinaan restitusi (bukan sanksi fisik)..."
                    value={formData.solusi}
                    onChange={(e) => setFormData({ ...formData, solusi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Komitmen & Tindak Lanjut Murid
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Komitmen perbaikan perilaku atau target belajar murid..."
                    value={formData.komitmenMurid}
                    onChange={(e) => setFormData({ ...formData, komitmenMurid: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status Penanganan</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusBK })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="IN_PROGRESS">Dalam Pendampingan Aktif</option>
                    <option value="RESOLVED">Restitusi Selesai / Tercapai</option>
                    <option value="OPEN">Menunggu Sesi Tatap Muka</option>
                    <option value="CLOSED">Sesi Selesai (Tutup Kasus)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jadwal Tatap Muka Lanjutan (Opsional)
                  </label>
                  <input
                    type="date"
                    value={formData.jadwalTatapMuka}
                    onChange={(e) => setFormData({ ...formData, jadwalTatapMuka: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
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
                  Simpan Catatan BK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
