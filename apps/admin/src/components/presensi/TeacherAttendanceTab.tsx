'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  GraduationCap,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  Search,
  Plus,
  Download,
  Eye,
  Building2,
  BookOpen,
  X,
  ShieldCheck,
} from 'lucide-react';

export interface TeacherAttendanceRecord {
  id: string;
  guruId: string;
  guruNama: string;
  nip: string;
  tanggal: string;
  jamMasuk: string | null;
  jamPulang: string | null;
  status: 'HADIR' | 'TEPAT' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'DINAS_LUAR';
  distanceFromSchool: number | null;
  isWithinRadius: boolean;
  keteranganKBM: string | null;
  selfieUrl: string | null;
  notes: string | null;
}

export interface TeacherStats {
  totalTeachers: number;
  hadirCount: number;
  tepatCount: number;
  terlambatCount: number;
  izinCount: number;
  sakitCount: number;
  dinasLuarCount: number;
  persentaseHadir: number;
  tanggal: string;
}

export interface TeacherSimple {
  id: string;
  nama: string;
  gelar: string;
  nip: string;
  mataPelajaran: string;
}

export function TeacherAttendanceTab() {
  const [records, setRecords] = useState<TeacherAttendanceRecord[]>([]);
  const [stats, setStats] = useState<TeacherStats>({
    totalTeachers: 35,
    hadirCount: 30,
    tepatCount: 28,
    terlambatCount: 2,
    izinCount: 2,
    sakitCount: 1,
    dinasLuarCount: 2,
    persentaseHadir: 86,
    tanggal: '2026-09-27',
  });
  const [teachersList, setTeachersList] = useState<TeacherSimple[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modals
  const [detailRecord, setDetailRecord] = useState<TeacherAttendanceRecord | null>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [recording, setRecording] = useState(false);

  // Form State
  const [recordForm, setRecordForm] = useState({
    guruId: '',
    type: 'MASUK' as 'MASUK' | 'PULANG' | 'KBM_NOTE',
    keteranganKBM: '',
    notes: '',
  });

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Fetch Teacher Attendance
  const fetchTeacherData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter && statusFilter !== 'ALL') params.append('status', statusFilter);
      params.append('page', page.toString());
      params.append('limit', '15');

      const res = await fetch(`/api/presensi/guru?${params.toString()}`);
      const json = await res.json();

      if (json.success && json.data) {
        setRecords(json.data);
        if (json.stats) setStats(json.stats);
        setTotalPages(json.totalPages || 1);
        setTotalRecords(json.total || 0);
      }
    } catch (err) {
      console.error('Fetch teacher attendance error:', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]);

  // Fetch all teachers for dropdown
  useEffect(() => {
    async function loadTeachers() {
      try {
        const res = await fetch('/api/guru?limit=100');
        const json = await res.json();
        if (json.success && json.data) {
          setTeachersList(json.data);
          if (json.data.length > 0 && !recordForm.guruId) {
            setRecordForm((prev) => ({ ...prev, guruId: json.data[0].id }));
          }
        }
      } catch (err) {
        console.error('Load teachers error:', err);
      }
    }
    loadTeachers();
  }, []);

  // Submit Presensi / KBM
  const handleSubmitRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordForm.guruId) {
      showToast('Pilih guru terlebih dahulu!');
      return;
    }

    setRecording(true);
    try {
      const res = await fetch('/api/presensi/guru', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordForm),
      });
      const json = await res.json();

      if (json.success) {
        showToast(json.message);
        setShowRecordModal(false);
        setRecordForm((prev) => ({
          ...prev,
          keteranganKBM: '',
          notes: '',
        }));
        fetchTeacherData();
      } else {
        showToast(json.message || 'Gagal menyimpan presensi.');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan jaringan.');
    } finally {
      setRecording(false);
    }
  };

  // Status Badge Helper
  const getTeacherStatusBadge = (status: string) => {
    switch (status) {
      case 'TEPAT':
      case 'HADIR':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Tepat Waktu
          </span>
        );
      case 'TERLAMBAT':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Terlambat
          </span>
        );
      case 'IZIN':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 ring-1 ring-blue-200">
            <FileText className="w-3 h-3 text-blue-600" />
            Izin
          </span>
        );
      case 'SAKIT':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-bold text-purple-700 ring-1 ring-purple-200">
            <UserCheck className="w-3 h-3 text-purple-600" />
            Sakit
          </span>
        );
      case 'DINAS_LUAR':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 ring-1 ring-indigo-200">
            <Building2 className="w-3 h-3 text-indigo-600" />
            Dinas Luar
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 ring-1 ring-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            {status}
          </span>
        );
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['NIP', 'Nama Guru', 'Tanggal', 'Jam Masuk', 'Jam Pulang', 'Status', 'Jurnal KBM', 'Catatan'];
    const rows = records.map((r) => [
      `"${r.nip}"`,
      `"${r.guruNama}"`,
      `"${r.tanggal}"`,
      `"${r.jamMasuk || '-'}"`,
      `"${r.jamPulang || '-'}"`,
      `"${r.status}"`,
      `"${(r.keteranganKBM || '').replace(/"/g, '""')}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Presensi_GTK_${stats.tanggal}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Rekapitulasi presensi GTK berhasil diunduh (CSV).');
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-xl flex items-center gap-2 animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-white/80 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. STATS CARDS UNTUK GTK */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Kehadiran GTK */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kehadiran GTK
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
              <GraduationCap className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{stats.persentaseHadir}%</span>
            <span className="text-xs text-slate-500 font-semibold">
              ({stats.hadirCount} / {stats.totalTeachers} GTK)
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${stats.persentaseHadir}%` }}
            />
          </div>
        </div>

        {/* Tepat Waktu */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tepat Waktu</span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-teal-50 text-teal-600 ring-1 ring-teal-200">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-600">{stats.tepatCount}</span>
            <span className="text-xs text-slate-500 font-semibold">GTK Datang Pagi</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 font-medium">Sebelum batas 07:15 WIB</p>
        </div>

        {/* Terlambat */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Terlambat</span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-200">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">{stats.terlambatCount}</span>
            <span className="text-xs text-slate-500 font-semibold">GTK Terlambat</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 font-medium">Tercatat GPS sekolah</p>
        </div>

        {/* Izin / Sakit / Dinas Luar */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Izin / Sakit / Dinas
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200">
              <Building2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-600">
              {stats.izinCount + stats.sakitCount + stats.dinasLuarCount}
            </span>
            <span className="text-xs text-slate-500 font-semibold">GTK Berhalangan</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 font-medium">
            Dinas Luar ({stats.dinasLuarCount}) • Izin ({stats.izinCount}) • Sakit ({stats.sakitCount})
          </p>
        </div>
      </div>

      {/* 2. FILTER & ACTION BAR */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari Guru, NIP, Catatan Jurnal KBM..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-brand-500 font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none font-semibold text-slate-700"
            >
              <option value="ALL">Semua Status Kehadiran</option>
              <option value="TEPAT">Tepat Waktu</option>
              <option value="TERLAMBAT">Terlambat</option>
              <option value="IZIN">Izin</option>
              <option value="SAKIT">Sakit</option>
              <option value="DINAS_LUAR">Dinas Luar</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Ekspor CSV</span>
            </button>

            <button
              onClick={() => setShowRecordModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Rekam Presensi GTK</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. TABEL PRESENSI GTK */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 pl-6 pr-3">Pendidik & Tendik</th>
                <th className="px-3 py-3.5">NIP</th>
                <th className="px-3 py-3.5">Jam Masuk</th>
                <th className="px-3 py-3.5">Jam Pulang</th>
                <th className="px-3 py-3.5">Status Presensi</th>
                <th className="px-3 py-3.5">Jurnal KBM Harian</th>
                <th className="px-3 py-3.5">Lokasi GPS</th>
                <th className="py-3.5 pl-3 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
                      <span>Memuat rekap presensi guru...</span>
                    </div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada data presensi guru yang sesuai filter.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={r.selfieUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                          alt={r.guruNama}
                          className="h-9 w-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{r.guruNama}</p>
                          <p className="text-[10px] text-slate-400">SMAN 20 Kabupaten Tangerang</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 font-mono text-slate-800 font-medium">
                      {r.nip}
                    </td>
                    <td className="px-3 py-3.5">
                      {r.jamMasuk ? (
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                          {r.jamMasuk}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">-</span>
                      )}
                    </td>
                    <td className="px-3 py-3.5">
                      {r.jamPulang ? (
                        <span className="font-mono font-bold text-slate-800 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md">
                          {r.jamPulang}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">Belum Pulang</span>
                      )}
                    </td>
                    <td className="px-3 py-3.5">{getTeacherStatusBadge(r.status)}</td>
                    <td className="px-3 py-3.5 max-w-[220px]">
                      <p className="truncate text-slate-700 font-medium">
                        {r.keteranganKBM || 'Melaksanakan KBM sesuai jadwal'}
                      </p>
                      {r.notes && <p className="truncate text-[10px] text-slate-400">{r.notes}</p>}
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[11px] font-medium text-slate-700">
                          {r.distanceFromSchool !== null ? `${r.distanceFromSchool}m radius` : 'Tervalidasi'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 pl-3 pr-6 text-right">
                      <button
                        onClick={() => setDetailRecord(r)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        title="Lihat Detail Jurnal KBM"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginasi */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-3 text-xs text-slate-500">
          <p>
            Menampilkan <span className="font-semibold text-slate-900">{records.length}</span> dari{' '}
            <span className="font-semibold text-slate-900">{totalRecords}</span> GTK
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 font-medium disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <span className="font-semibold text-slate-700">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 font-medium disabled:opacity-50"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: DETAIL JURNAL KBM & PRESENSI GURU */}
      {detailRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-brand-100 p-2 text-brand-700">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{detailRecord.guruNama}</h3>
                  <p className="text-xs text-slate-500">NIP: {detailRecord.nip}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailRecord(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 text-xs space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Status Kehadiran</span>
                  <div className="mt-1">{getTeacherStatusBadge(detailRecord.status)}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Tanggal</span>
                  <strong className="text-slate-800">{detailRecord.tanggal}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                  <span className="text-[10px] text-slate-400">Jam Masuk (Tap In)</span>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">
                    {detailRecord.jamMasuk || 'Belum Presensi'}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                  <span className="text-[10px] text-slate-400">Jam Pulang (Tap Out)</span>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">
                    {detailRecord.jamPulang || 'Belum Pulang'}
                  </p>
                </div>
              </div>

              {/* Jurnal KBM */}
              <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-4">
                <div className="flex items-center gap-2 text-brand-800 font-bold mb-1.5">
                  <BookOpen className="w-4 h-4 text-brand-600" />
                  <span>Jurnal & Catatan KBM Harian</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {detailRecord.keteranganKBM || 'Melaksanakan fasilitasi belajar sesuai jadwal KBM harian.'}
                </p>
              </div>

              {/* Catatan / Keterangan Kehadiran */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-[10px] text-slate-400 block font-medium">Catatan / Keterangan</span>
                <p className="text-slate-800 mt-0.5 font-medium">{detailRecord.notes || '-'}</p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Presensi GPS Radius Sekolah Terverifikasi</span>
                </div>
                <span className="font-bold text-emerald-700">
                  {detailRecord.distanceFromSchool !== null ? `${detailRecord.distanceFromSchool} m` : 'Radius Sah'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-slate-200 bg-slate-50 px-6 py-3">
              <button
                onClick={() => setDetailRecord(null)}
                className="rounded-xl bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REKAM PRESENSI GTK MANUAL & JURNAL KBM */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-bold text-slate-900">Rekam Presensi / KBM Guru</h3>
              </div>
              <button
                onClick={() => setShowRecordModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRecord} className="p-6 text-xs space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Guru / Tendik *</label>
                <select
                  value={recordForm.guruId}
                  onChange={(e) => setRecordForm({ ...recordForm, guruId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 font-semibold focus:border-brand-500 focus:outline-none"
                  required
                >
                  <option value="">-- Pilih Nama Guru --</option>
                  {teachersList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nama}, {t.gelar} ({t.mataPelajaran})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tipe Aksi Presensi</label>
                <select
                  value={recordForm.type}
                  onChange={(e) =>
                    setRecordForm({
                      ...recordForm,
                      type: e.target.value as 'MASUK' | 'PULANG' | 'KBM_NOTE',
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 font-bold focus:border-brand-500 focus:outline-none"
                >
                  <option value="MASUK">Rekam Jam Masuk (Tap In)</option>
                  <option value="PULANG">Rekam Jam Pulang (Tap Out)</option>
                  <option value="KBM_NOTE">Catat Jurnal / Materi KBM Harian</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jurnal / Topik Materi KBM</label>
                <textarea
                  rows={3}
                  value={recordForm.keteranganKBM}
                  onChange={(e) => setRecordForm({ ...recordForm, keteranganKBM: e.target.value })}
                  placeholder="Misal: Membahas Bab 3 Persamaan Kuadrat & Asesmen Formatif Kelas X.1..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
                <input
                  type="text"
                  value={recordForm.notes}
                  onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
                  placeholder="Misal: Presensi manual melalui Operator TU"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={recording}
                  className="rounded-xl bg-brand-600 px-5 py-2 text-xs font-bold text-white hover:bg-brand-700 disabled:opacity-50"
                >
                  {recording ? 'Menyimpan...' : 'Simpan Presensi GTK'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
