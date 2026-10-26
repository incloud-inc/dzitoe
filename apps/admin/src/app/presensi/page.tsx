'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CalendarCheck,
  Search,
  Download,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Plus,
  Eye,
  Pencil,
  GraduationCap,
  FileCheck2,
  ShieldAlert,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { TeacherAttendanceTab } from '@/components/presensi/TeacherAttendanceTab';
import { AttendanceVerificationTab } from '@/components/presensi/AttendanceVerificationTab';
import { GeofenceAntiFakeTab } from '@/components/presensi/GeofenceAntiFakeTab';
import { cn } from '@/lib/utils';

export interface AttendanceRecord {
  id: string;
  muridId: string;
  muridNama: string;
  nisn: string;
  kelasId: string;
  kelasNama: string;
  tanggal: string;
  jamMasuk: string | null;
  jamPulang: string | null;
  status: 'HADIR' | 'TEPAT' | 'PARSIAL' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'ALPA';
  latitude: number | null;
  longitude: number | null;
  distanceFromSchool: number | null;
  isWithinRadius: boolean;
  selfieUrl: string | null;
  watermarkText: string | null;
  deviceInfo: string | null;
  notes: string | null;
}

export interface AttendanceSummary {
  tanggal: string;
  totalSiswa: number;
  hadir: number;
  tepat: number;
  terlambat: number;
  izin: number;
  sakit: number;
  alpa: number;
  persentase: number;
}

export interface ClassOption {
  id: string;
  nama: string;
  tingkat: string;
}

export default function PresensiPage() {
  const [activeRoleTab, setActiveRoleTab] = useState<'murid' | 'guru' | 'verifikasi' | 'antifake'>('murid');
  const [tanggal, setTanggal] = useState<string>(() => {
    return new Date().toISOString().split('T')[0] ?? '2026-09-27';
  });
  const [kelasFilter, setKelasFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(15);

  const [loading, setLoading] = useState<boolean>(true);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary>({
    tanggal: '',
    totalSiswa: 150,
    hadir: 0,
    tepat: 0,
    terlambat: 0,
    izin: 0,
    sakit: 0,
    alpa: 0,
    persentase: 0,
  });
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  // Modal States
  const [detailRecord, setDetailRecord] = useState<AttendanceRecord | null>(null);
  const [editRecord, setEditRecord] = useState<AttendanceRecord | null>(null);
  const [editStatus, setEditStatus] = useState<string>('TEPAT');
  const [editNotes, setEditNotes] = useState<string>('');
  const [savingEdit, setSavingEdit] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Manual Absensi Modal
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [manualMuridId, setManualMuridId] = useState<string>('');
  const [manualStatus, setManualStatus] = useState<string>('IZIN');
  const [manualNotes, setManualNotes] = useState<string>('');
  const [allStudentsList, setAllStudentsList] = useState<{ id: string; nama: string; kelasNama: string }[]>([]);

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        tanggal,
        kelasId: kelasFilter,
        status: statusFilter,
        search,
        page: String(page),
        limit: String(limit),
      });

      const res = await fetch(`/api/presensi?${params.toString()}`);
      const json = await res.json();

      if (json.success && json.data) {
        setRecords(json.data.records);
        setSummary(json.data.summary);
        setClasses(json.data.classes || []);
        setTotalPages(json.data.pagination.totalPages);
        setTotalRecords(json.data.pagination.total);
      }
    } catch (err) {
      console.error('Failed to load presensi data:', err);
    } finally {
      setLoading(false);
    }
  }, [tanggal, kelasFilter, statusFilter, search, page, limit]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // Fetch student list for manual attendance dialog
  useEffect(() => {
    async function loadStudents() {
      try {
        const res = await fetch('/api/murid?limit=150');
        const json = await res.json();
        if (json.success && json.data) {
          setAllStudentsList(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            json.data.map((m: any) => ({
              id: m.id,
              nama: m.nama,
              kelasNama: m.kelasNama,
            }))
          );
        }
      } catch (err) {
        console.error('Failed to load students for manual presensi', err);
      }
    }
    loadStudents();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle Edit Status Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRecord) return;

    setSavingEdit(true);
    try {
      const res = await fetch('/api/presensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_STATUS',
          id: editRecord.id,
          status: editStatus,
          notes: editNotes,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message);
        setEditRecord(null);
        fetchAttendance();
      } else {
        alert(json.message || 'Gagal memperbarui status');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setSavingEdit(false);
    }
  };

  // Handle Manual Presensi Submit
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualMuridId) {
      alert('Pilih siswa terlebih dahulu.');
      return;
    }

    setSavingEdit(true);
    try {
      const res = await fetch('/api/presensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'MANUAL_RECORD',
          muridId: manualMuridId,
          status: manualStatus,
          notes: manualNotes,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message);
        setShowManualModal(false);
        setManualMuridId('');
        setManualNotes('');
        fetchAttendance();
      } else {
        alert(json.message || 'Gagal menyimpan presensi manual');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setSavingEdit(false);
    }
  };

  const getStatusBadge = (status: string) => {
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
      case 'ALPA':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 ring-1 ring-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Alpa
          </span>
        );
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-xl flex items-center gap-2 animate-in slide-in-from-top-3">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. EXECUTIVE HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl bg-white p-6 border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-700 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SMAN 20 Kab. Tangerang • Modul A9 Presensi Real-Time</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Monitoring Presensi Murid
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Rekapitulasi kehadiran GPS radius 100m & verifikasi swafoto murid secara real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Date Input */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={tanggal}
                onChange={(e) => {
                  setTanggal(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent focus:outline-none text-xs font-bold text-slate-800"
              />
            </div>

            {/* Export CSV Button */}
            <a
              href={`/api/presensi/export?tanggal=${tanggal}&kelasId=${kelasFilter}`}
              download
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Unduh CSV</span>
            </a>

            {/* Manual Attendance Button */}
            <button
              type="button"
              onClick={() => setShowManualModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 hover:opacity-95 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Presensi Manual</span>
            </button>
          </div>
        </div>

        {/* TAB SWITCHER: 4 TAB REALTIME PRESENSI & KEAMANAN */}
        <div className="flex flex-wrap border-b border-slate-200 gap-1">
          <button
            type="button"
            onClick={() => setActiveRoleTab('murid')}
            className={cn(
              'flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-colors cursor-pointer',
              activeRoleTab === 'murid'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
          >
            <UserCheck className="w-4 h-4" />
            <span>Presensi Murid ({summary.totalSiswa || 150} Siswa)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveRoleTab('guru')}
            className={cn(
              'flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-colors cursor-pointer',
              activeRoleTab === 'guru'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Presensi Guru & Rekap KBM (35 GTK)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveRoleTab('verifikasi')}
            className={cn(
              'flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-colors cursor-pointer',
              activeRoleTab === 'verifikasi'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Verifikasi & Izin / Sakit (Modul A13)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveRoleTab('antifake')}
            className={cn(
              'flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-colors cursor-pointer',
              activeRoleTab === 'antifake'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Anti-Fake GPS & Geofence (Modul A11)</span>
          </button>
        </div>

        {activeRoleTab === 'guru' ? (
          <TeacherAttendanceTab />
        ) : activeRoleTab === 'verifikasi' ? (
          <AttendanceVerificationTab />
        ) : activeRoleTab === 'antifake' ? (
          <GeofenceAntiFakeTab />
        ) : (
          <>
            {/* 2. STATS CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Kehadiran */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tingkat Kehadiran
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
                <CalendarCheck className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{summary.persentase}%</span>
              <span className="text-xs text-slate-500 font-semibold">
                ({summary.hadir} / {summary.totalSiswa} Siswa)
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${summary.persentase}%` }}
              />
            </div>
          </div>

          {/* Card 2: Tepat Waktu */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Hadir Tepat Waktu
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-700">{summary.tepat}</span>
              <span className="text-xs text-slate-400 font-medium">Siswa (≤ 07:15 WIB)</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Memenuhi standar disiplin positif</p>
          </div>

          {/* Card 3: Terlambat */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Terlambat
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-200">
                <Clock className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-700">{summary.terlambat}</span>
              <span className="text-xs text-slate-400 font-medium">Siswa (&gt; 07:15 WIB)</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Perlu pembinaan restitusi kelas</p>
          </div>

          {/* Card 4: Izin, Sakit & Alpa */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Izin / Sakit / Alpa
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-purple-50 text-purple-600 ring-1 ring-purple-200">
                <UserCheck className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800">
                {summary.izin + summary.sakit + summary.alpa}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                (I:{summary.izin} • S:{summary.sakit} • A:{summary.alpa})
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Tidak hadir pada KBM hari ini</p>
          </div>
        </div>

        {/* 3. FILTER BAR */}
        <div className="sticky top-0 z-10 flex flex-col lg:flex-row gap-3 items-center justify-between rounded-2xl bg-white/95 backdrop-blur-sm p-4 border border-slate-200 shadow-sm">
          <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama murid, NISN..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Filter Kelas */}
            <div className="w-full sm:w-56">
              <select
                value={kelasFilter}
                onChange={(e) => {
                  setKelasFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Semua Rombel Kelas (30 Kelas)</option>
                <optgroup label="Tingkat X (10 Rombel)">
                  {classes
                    .filter((c) => c.tingkat === 'X')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        Kelas {c.nama}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Tingkat XI (10 Rombel)">
                  {classes
                    .filter((c) => c.tingkat === 'XI')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        Kelas {c.nama}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Tingkat XII (10 Rombel)">
                  {classes
                    .filter((c) => c.tingkat === 'XII')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        Kelas {c.nama}
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            {/* Filter Status */}
            <div className="w-full sm:w-44">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Semua Status</option>
                <option value="TEPAT">Tepat Waktu</option>
                <option value="TERLAMBAT">Terlambat</option>
                <option value="IZIN">Izin</option>
                <option value="SAKIT">Sakit</option>
                <option value="ALPA">Alpa</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end lg:self-auto">
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setKelasFilter('');
                setStatusFilter('');
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 transition"
            >
              Reset Filter
            </button>
            <button
              type="button"
              onClick={fetchAttendance}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition"
              title="Refresh Data"
            >
              <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            </button>
          </div>
        </div>

        {/* 4. ATTENDANCE DATA TABLE */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2 px-4">Murid (Siswa)</th>
                  <th className="py-2 px-4">Rombel</th>
                  <th className="py-2 px-4">Jam Masuk</th>
                  <th className="py-2 px-4">Jam Pulang</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Lokasi & Radius</th>
                  <th className="py-2 px-4">Swafoto</th>
                  <th className="py-2 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                        <span>Memuat data kehadiran murid...</span>
                      </div>
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      Tidak ada catatan presensi yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  records.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Siswa */}
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item.selfieUrl ||
                              'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
                            }
                            alt={item.muridNama}
                            className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">
                              {item.muridNama}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">
                              NISN: {item.nisn}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Rombel */}
                      <td className="py-2 px-4">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                          Kelas {item.kelasNama}
                        </span>
                      </td>

                      {/* Jam Masuk */}
                      <td className="py-2 px-4 font-mono font-bold text-slate-800">
                        {item.jamMasuk ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {item.jamMasuk}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">-</span>
                        )}
                      </td>

                      {/* Jam Pulang */}
                      <td className="py-2 px-4 font-mono font-semibold text-slate-700">
                        {item.jamPulang ? (
                          <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                            {item.jamPulang}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">-</span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-2 px-4">{getStatusBadge(item.status)}</td>

                      {/* Lokasi & Radius */}
                      <td className="py-2 px-4">
                        {item.distanceFromSchool !== null && item.distanceFromSchool > 0 ? (
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="font-mono font-semibold text-slate-800">
                              ±{item.distanceFromSchool}m
                            </span>
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 rounded">
                              Valid
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Swafoto */}
                      <td className="py-2 px-4">
                        {item.selfieUrl ? (
                          <button
                            type="button"
                            onClick={() => setDetailRecord(item)}
                            className="relative group rounded-lg overflow-hidden border border-slate-200 block cursor-pointer"
                            title="Klik untuk melihat bukti foto"
                          >
                            <img
                              src={item.selfieUrl}
                              alt="Selfie"
                              className="w-7 h-7 object-cover group-hover:scale-110 transition"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                              <Eye className="w-3 h-3" />
                            </div>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="py-2 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setDetailRecord(item)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                            title="Detail Verifikasi"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditRecord(item);
                              setEditStatus(item.status);
                              setEditNotes(item.notes || '');
                            }}
                            className="p-1.5 rounded-lg text-brand-600 hover:bg-brand-50 transition"
                            title="Ubah Status"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50 text-xs">
            <span className="text-slate-500">
              Menampilkan {records.length} dari {totalRecords} murid terdaftar
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-slate-800">
                Halaman {page} dari {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        </>
        )}
      </div>

      {/* MODAL DETAIL BUKTI VERIFIKASI PRESENSI */}
      {detailRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 border border-slate-200 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Bukti Verifikasi Presensi
                </h3>
                <p className="text-xs text-slate-500">
                  {detailRecord.muridNama} • Kelas {detailRecord.kelasNama}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetailRecord(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Selfie Frame with Watermark */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-square bg-slate-950 flex items-center justify-center">
                <img
                  src={
                    detailRecord.selfieUrl ||
                    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400'
                  }
                  alt="Swafoto"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white text-[10px] font-mono leading-tight">
                  <div className="font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>SMAN 20 • VERIFIKASI GPS SAH</span>
                  </div>
                  <div>{detailRecord.watermarkText || `${detailRecord.tanggal} ${detailRecord.jamMasuk}`}</div>
                </div>
              </div>

              {/* Data Details */}
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-medium">Status Kehadiran</span>
                  <div className="mt-0.5">{getStatusBadge(detailRecord.status)}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-medium">Jam Masuk & Pulang</span>
                  <span className="font-mono font-bold text-slate-800">
                    Masuk: {detailRecord.jamMasuk || '-'} • Pulang: {detailRecord.jamPulang || '-'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-medium">Jarak ke SMAN 20</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {detailRecord.distanceFromSchool !== null
                      ? `±${detailRecord.distanceFromSchool} meter (Dalam radius 100m)`
                      : 'N/A'}
                  </span>
                </div>

                {detailRecord.latitude && detailRecord.longitude && (
                  <a
                    href={`https://www.google.com/maps?q=${detailRecord.latitude},${detailRecord.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka Titik GPS di Google Maps</span>
                  </a>
                )}
              </div>
            </div>

            {detailRecord.notes && (
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                <b>Catatan Presensi:</b> {detailRecord.notes}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL UBAH STATUS / KOREKSI PRESENSI */}
      {editRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-slate-200 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Koreksi Status Presensi
                </h3>
                <p className="text-xs text-slate-500">
                  {editRecord.muridNama} (Kelas {editRecord.kelasNama})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditRecord(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Status Kehadiran</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold"
                >
                  <option value="TEPAT">Tepat Waktu (Hadir)</option>
                  <option value="TERLAMBAT">Terlambat</option>
                  <option value="IZIN">Izin (Surat Keterangan)</option>
                  <option value="SAKIT">Sakit (Surat Dokter)</option>
                  <option value="ALPA">Alpa (Tanpa Keterangan)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Catatan Guru / Admin
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Tambahkan alasan perubahan atau nomor surat keterangan..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditRecord(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {savingEdit ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INPUT PRESENSI MANUAL */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-slate-200 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Catat Presensi Manual
                </h3>
                <p className="text-xs text-slate-500">
                  Input kehadiran oleh Guru Piket atau Administrator
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Pilih Siswa</label>
                <select
                  value={manualMuridId}
                  onChange={(e) => setManualMuridId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
                  required
                >
                  <option value="">-- Pilih Nama Siswa / Kelas --</option>
                  {allStudentsList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nama} (Kelas {m.kelasNama})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Status Kehadiran</label>
                <select
                  value={manualStatus}
                  onChange={(e) => setManualStatus(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold"
                >
                  <option value="TEPAT">Hadir Tepat Waktu</option>
                  <option value="TERLAMBAT">Hadir Terlambat</option>
                  <option value="IZIN">Izin (Dispensasi/Lomba/Keluarga)</option>
                  <option value="SAKIT">Sakit (Keterangan Dokter)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Catatan / Alasan</label>
                <textarea
                  rows={3}
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="Misal: Izin mengikuti Olimpiade Sains Nasional (OSN)..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {savingEdit ? 'Menyimpan...' : 'Simpan Presensi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
