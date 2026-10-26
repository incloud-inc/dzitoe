'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Building2,
  GraduationCap,
  X,
  AlertTriangle,
  Search,
  Users,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { cn } from '@/lib/utils';

export interface ScheduleItem {
  id: string;
  kelasId: string;
  kelasNama: string;
  hari: 'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT';
  jamMulai: string;
  jamSelesai: string;
  mapelId: string;
  mapelNama: string;
  guruId: string;
  guruNama: string;
  ruang: string;
}

export interface SubjectItem {
  id: string;
  kode: string;
  nama: string;
  kelompok: 'UMUM' | 'PEMINATAN_IPA' | 'PEMINATAN_IPS' | 'MUATAN_LOKAL';
  jamPerMinggu: number;
}

export interface ClassOption {
  id: string;
  nama: string;
  tingkat: 'X' | 'XI' | 'XII';
  jurusan?: 'UMUM' | 'MIPA' | 'IPS';
  ruang: string;
  waliKelasId?: string;
  waliKelasNama?: string;
  kapasitas?: number;
  jumlahMurid?: number;
  tahunAjaran?: string;
}

export interface TeacherOption {
  id: string;
  nama: string;
  gelar: string;
  mataPelajaran: string;
  nip: string;
}

const HARI_LIST: Array<'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT'> = [
  'SENIN',
  'SELASA',
  'RABU',
  'KAMIS',
  'JUMAT',
];

export default function JadwalPage() {
  const [activeTab, setActiveTab] = useState<'jadwal' | 'mapel' | 'rombel'>('jadwal');

  // Data states
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters for Jadwal
  const [selectedTingkat, setSelectedTingkat] = useState<string>('ALL');
  const [selectedKelasId, setSelectedKelasId] = useState<string>('kls-x-1');
  const [selectedHari, setSelectedHari] = useState<string>('ALL');

  // Modals for Jadwal
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState<ScheduleItem | null>(null);
  const [scheduleToDelete, setScheduleToDelete] = useState<ScheduleItem | null>(null);
  const [savingSchedule, setSavingSchedule] = useState(false);

  // Conflict Detection States (Task A7.9)
  const [conflictData, setConflictData] = useState<{
    hasConflicts: boolean;
    totalConflicts: number;
    criticalCount: number;
    warningCount: number;
    conflicts: any[];
  }>({
    hasConflicts: false,
    totalConflicts: 0,
    criticalCount: 0,
    warningCount: 0,
    conflicts: [],
  });
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [formConflictWarning, setFormConflictWarning] = useState<string | null>(null);

  // Form Schedule State
  const [scheduleForm, setScheduleForm] = useState({
    id: '',
    kelasId: 'kls-x-1',
    hari: 'SENIN' as ScheduleItem['hari'],
    jamMulai: '07:15',
    jamSelesai: '08:45',
    mapelId: '',
    guruId: '',
    ruang: 'Ruang X.1',
  });

  // Modals for Mapel
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<SubjectItem | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<SubjectItem | null>(null);
  const [savingSubject, setSavingSubject] = useState(false);

  // Form Subject State
  const [subjectForm, setSubjectForm] = useState({
    id: '',
    kode: '',
    nama: '',
    kelompok: 'UMUM' as SubjectItem['kelompok'],
    jamPerMinggu: 2,
  });

  // Modals for Rombel
  const [showAddRombelModal, setShowAddRombelModal] = useState(false);
  const [rombelToEdit, setRombelToEdit] = useState<ClassOption | null>(null);
  const [rombelToDelete, setRombelToDelete] = useState<ClassOption | null>(null);
  const [savingRombel, setSavingRombel] = useState(false);
  const [rombelFilterTingkat, setRombelFilterTingkat] = useState<string>('ALL');
  const [rombelSearchQuery, setRombelSearchQuery] = useState<string>('');

  // Form Rombel State
  const [rombelForm, setRombelForm] = useState({
    id: '',
    nama: '',
    tingkat: 'X' as 'X' | 'XI' | 'XII',
    jurusan: 'UMUM' as 'UMUM' | 'MIPA' | 'IPS',
    ruang: 'Gedung A - Lt 1 Ruang 101',
    waliKelasId: '',
    kapasitas: 36,
  });

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Initial load
  useEffect(() => {
    async function initData() {
      setLoading(true);
      try {
        const [clsRes, subRes, tchRes] = await Promise.all([
          fetch('/api/kelas').then((r) => r.json()),
          fetch('/api/mapel').then((r) => r.json()),
          fetch('/api/guru?limit=100').then((r) => r.json()),
        ]);

        if (clsRes.success && clsRes.data) {
          setClasses(clsRes.data);
          if (clsRes.data.length > 0) {
            setSelectedKelasId(clsRes.data[0].id);
            setScheduleForm((prev) => ({
              ...prev,
              kelasId: clsRes.data[0].id,
              ruang: `Ruang ${clsRes.data[0].nama}`,
            }));
          }
        }

        if (subRes.success && subRes.data) {
          setSubjects(subRes.data);
          if (subRes.data.length > 0) {
            setScheduleForm((prev) => ({ ...prev, mapelId: subRes.data[0].id }));
          }
        }

        if (tchRes.success && tchRes.data) {
          setTeachers(tchRes.data);
          if (tchRes.data.length > 0) {
            setScheduleForm((prev) => ({ ...prev, guruId: tchRes.data[0].id }));
          }
        }
      } catch (err) {
        console.error('Init error:', err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  // Fetch Schedules based on filter
  const fetchSchedules = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedKelasId && selectedKelasId !== 'ALL') {
        params.append('kelasId', selectedKelasId);
      } else if (selectedTingkat && selectedTingkat !== 'ALL') {
        params.append('tingkat', selectedTingkat);
      }
      if (selectedHari && selectedHari !== 'ALL') {
        params.append('hari', selectedHari);
      }

      const res = await fetch(`/api/jadwal?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setSchedules(json.data || []);
      }
    } catch (err) {
      console.error('Fetch schedules error:', err);
    }
  };

  // Fetch Conflict Analysis (Task A7.9)
  const fetchConflictAnalysis = async () => {
    try {
      const res = await fetch('/api/jadwal/konflik');
      const json = await res.json();
      if (json.success && json.data) {
        setConflictData(json.data);
      }
    } catch (err) {
      console.error('Fetch conflicts error:', err);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchConflictAnalysis();
  }, [selectedKelasId, selectedTingkat, selectedHari]);

  // Real-time conflict validation when editing or adding schedule
  useEffect(() => {
    if (!showAddScheduleModal && !scheduleToEdit) {
      setFormConflictWarning(null);
      return;
    }

    const timer = setTimeout(async () => {
      if (scheduleForm.kelasId && scheduleForm.guruId && scheduleForm.jamMulai && scheduleForm.jamSelesai) {
        try {
          const res = await fetch('/api/jadwal/konflik', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scheduleForm),
          });
          const json = await res.json();
          if (json.success && json.isConflict && json.conflicts?.length > 0) {
            setFormConflictWarning(json.conflicts[0].description);
          } else {
            setFormConflictWarning(null);
          }
        } catch {
          setFormConflictWarning(null);
        }
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [scheduleForm, showAddScheduleModal, scheduleToEdit]);

  // Fetch Subjects
  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/mapel');
      const json = await res.json();
      if (json.success) {
        setSubjects(json.data || []);
      }
    } catch (err) {
      console.error('Fetch subjects error:', err);
    }
  };

  // Fetch Classes (Rombel)
  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/kelas');
      const json = await res.json();
      if (json.success && json.data) {
        setClasses(json.data);
      }
    } catch (err) {
      console.error('Fetch classes error:', err);
    }
  };

  const filteredSchedules = schedules;

  // Handle Save Schedule (Create or Update)
  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleForm.kelasId || !scheduleForm.mapelId || !scheduleForm.guruId) {
      showToast('Harap pilih Kelas, Mata Pelajaran, dan Guru pengampu!');
      return;
    }

    setSavingSchedule(true);
    try {
      const isEdit = !!scheduleForm.id;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch('/api/jadwal', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleForm),
      });
      const json = await res.json();

      if (json.success) {
        showToast(isEdit ? 'Jadwal berhasil diperbarui!' : 'Jadwal baru berhasil ditambahkan!');
        setShowAddScheduleModal(false);
        setScheduleToEdit(null);
        fetchSchedules();
        fetchConflictAnalysis();
      } else {
        showToast(json.message || 'Gagal menyimpan jadwal.');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan jaringan.');
    } finally {
      setSavingSchedule(false);
    }
  };

  // Handle Delete Schedule
  const handleDeleteSchedule = async () => {
    if (!scheduleToDelete) return;
    try {
      const res = await fetch(`/api/jadwal?id=${scheduleToDelete.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showToast('Jadwal pelajaran berhasil dihapus.');
        setScheduleToDelete(null);
        fetchSchedules();
        fetchConflictAnalysis();
      } else {
        showToast(json.message || 'Gagal menghapus jadwal.');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal menghapus jadwal.');
    }
  };

  // Handle Save Subject (Create or Update)
  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectForm.kode || !subjectForm.nama) {
      showToast('Kode dan Nama Mata Pelajaran wajib diisi!');
      return;
    }

    setSavingSubject(true);
    try {
      const isEdit = !!subjectForm.id;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch('/api/mapel', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subjectForm),
      });
      const json = await res.json();

      if (json.success) {
        showToast(isEdit ? 'Mata pelajaran berhasil diperbarui!' : 'Mata pelajaran baru berhasil ditambahkan!');
        setShowAddSubjectModal(false);
        setSubjectToEdit(null);
        fetchSubjects();
      } else {
        showToast(json.message || 'Gagal menyimpan mata pelajaran.');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan jaringan.');
    } finally {
      setSavingSubject(false);
    }
  };

  // Handle Delete Subject
  const handleDeleteSubject = async () => {
    if (!subjectToDelete) return;
    try {
      const res = await fetch(`/api/mapel?id=${subjectToDelete.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showToast('Mata pelajaran berhasil dihapus.');
        setSubjectToDelete(null);
        fetchSubjects();
      } else {
        showToast(json.message || 'Gagal menghapus mapel.');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal menghapus mata pelajaran.');
    }
  };

  // Open Edit Schedule Modal
  const openEditSchedule = (s: ScheduleItem) => {
    setScheduleToEdit(s);
    setScheduleForm({
      id: s.id,
      kelasId: s.kelasId,
      hari: s.hari,
      jamMulai: s.jamMulai,
      jamSelesai: s.jamSelesai,
      mapelId: s.mapelId,
      guruId: s.guruId,
      ruang: s.ruang,
    });
  };

  // Open Edit Subject Modal
  const openEditSubject = (sub: SubjectItem) => {
    setSubjectToEdit(sub);
    setSubjectForm({
      id: sub.id,
      kode: sub.kode,
      nama: sub.nama,
      kelompok: sub.kelompok,
      jamPerMinggu: sub.jamPerMinggu,
    });
  };

  // Handle Save Rombel Class
  const handleSaveRombel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rombelForm.nama.trim() || !rombelForm.ruang.trim()) {
      showToast('Harap lengkapi nama rombel dan ruang kelas!');
      return;
    }

    setSavingRombel(true);
    try {
      const isEdit = !!rombelForm.id;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch('/api/kelas', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rombelForm),
      });
      const json = await res.json();

      if (json.success) {
        showToast(isEdit ? 'Data rombel kelas berhasil diperbarui!' : 'Rombel kelas baru berhasil ditambahkan!');
        setShowAddRombelModal(false);
        setRombelToEdit(null);
        fetchClasses();
      } else {
        showToast(json.message || 'Gagal menyimpan rombel kelas.');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan jaringan.');
    } finally {
      setSavingRombel(false);
    }
  };

  // Handle Delete Rombel Class
  const handleDeleteRombel = async () => {
    if (!rombelToDelete) return;
    try {
      const res = await fetch(`/api/kelas?id=${rombelToDelete.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showToast('Rombel kelas berhasil dihapus.');
        setRombelToDelete(null);
        fetchClasses();
      } else {
        showToast(json.message || 'Gagal menghapus rombel kelas.');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal menghapus rombel kelas.');
    }
  };

  // Open Edit Rombel Modal
  const openEditRombel = (c: ClassOption) => {
    setRombelToEdit(c);
    setRombelForm({
      id: c.id,
      nama: c.nama,
      tingkat: c.tingkat,
      jurusan: c.jurusan || 'UMUM',
      ruang: c.ruang || '',
      waliKelasId: c.waliKelasId || '',
      kapasitas: c.kapasitas || 36,
    });
  };

  // Filtered Rombel Classes
  const filteredClasses = useMemo(() => {
    return classes.filter((c) => {
      const matchTingkat = rombelFilterTingkat === 'ALL' || c.tingkat === rombelFilterTingkat;
      const q = rombelSearchQuery.toLowerCase().trim();
      const matchQuery =
        q === '' ||
        c.nama.toLowerCase().includes(q) ||
        (c.ruang && c.ruang.toLowerCase().includes(q)) ||
        (c.waliKelasNama && c.waliKelasNama.toLowerCase().includes(q));
      return matchTingkat && matchQuery;
    });
  }, [classes, rombelFilterTingkat, rombelSearchQuery]);

  // Current active class name
  const currentClassName = useMemo(() => {
    const found = classes.find((c) => c.id === selectedKelasId);
    return found ? found.nama : 'X.1';
  }, [classes, selectedKelasId]);

  return (
    <DashboardShell>
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-3 text-sm text-white shadow-2xl transition-all">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header Halaman */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
            <span>KURIKULUM MERDEKA 2026</span>
            <span>•</span>
            <span>MODUL A7 JADWAL, MAPEL & ROMBEL KELAS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Mata Pelajaran & Jadwal Pelajaran Nyata
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manajemen Jadwal KBM Mingguan, 30 Rombel Ruang Kelas & 16 Mata Pelajaran Resmi SMAN 20 Kabupaten Tangerang.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Conflict Detection Badge Button (Task A7.9) */}
          {activeTab === 'jadwal' && (
            <button
              type="button"
              onClick={() => setShowConflictModal(true)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95 border",
                conflictData.totalConflicts === 0
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                  : "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
              )}
              title="Periksa Konflik Jadwal KBM (Task A7.9)"
            >
              {conflictData.totalConflicts === 0 ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Bebas Konflik (0 Bentrok)</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-amber-700 animate-pulse" />
                  <span>{conflictData.totalConflicts} Bentrok Terdeteksi (Lihat)</span>
                </>
              )}
            </button>
          )}

          {activeTab === 'jadwal' && (
            <button
              onClick={() => {
                setScheduleForm({
                  id: '',
                  kelasId: selectedKelasId !== 'ALL' ? selectedKelasId : classes[0]?.id || 'kls-x-1',
                  hari: selectedHari !== 'ALL' ? (selectedHari as ScheduleItem['hari']) : 'SENIN',
                  jamMulai: '07:15',
                  jamSelesai: '08:45',
                  mapelId: subjects[0]?.id || '',
                  guruId: teachers[0]?.id || '',
                  ruang: `Ruang ${currentClassName}`,
                });
                setShowAddScheduleModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Jam Pelajaran</span>
            </button>
          )}

          {activeTab === 'mapel' && (
            <button
              onClick={() => {
                setSubjectForm({
                  id: '',
                  kode: '',
                  nama: '',
                  kelompok: 'UMUM',
                  jamPerMinggu: 3,
                });
                setShowAddSubjectModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Mata Pelajaran</span>
            </button>
          )}

          {activeTab === 'rombel' && (
            <button
              onClick={() => {
                setRombelForm({
                  id: '',
                  nama: '',
                  tingkat: 'X',
                  jurusan: 'UMUM',
                  ruang: 'Gedung A - Lt 1 Ruang 101',
                  waliKelasId: teachers[0]?.id || '',
                  kapasitas: 36,
                });
                setShowAddRombelModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Rombel Kelas</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Switcher Utama */}
      <div className="mb-6 flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('jadwal')}
          className={cn(
            'flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-semibold transition-colors',
            activeTab === 'jadwal'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          )}
        >
          <Calendar className="h-4 w-4" />
          <span>Jadwal KBM Mingguan (30 Rombel)</span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-700 font-bold">
            {schedules.length} Sesi
          </span>
        </button>

        <button
          onClick={() => setActiveTab('mapel')}
          className={cn(
            'flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-semibold transition-colors',
            activeTab === 'mapel'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          )}
        >
          <BookOpen className="h-4 w-4" />
          <span>Katalog Mata Pelajaran (16 Mapel)</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 font-bold">
            {subjects.length} Mapel
          </span>
        </button>

        <button
          onClick={() => setActiveTab('rombel')}
          className={cn(
            'flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-semibold transition-colors',
            activeTab === 'rombel'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          )}
        >
          <Building2 className="h-4 w-4" />
          <span>Rombel Kelas & Ruang (30 Kelas)</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 font-bold">
            {classes.length} Rombel
          </span>
        </button>
      </div>

      {/* KONTEN TAB 1: JADWAL KBM MINGGUAN */}
      {activeTab === 'jadwal' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Filter Tingkat & Kelas */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-semibold text-slate-500">Pilih Rombel:</span>
                <select
                  value={selectedTingkat}
                  onChange={(e) => {
                    setSelectedTingkat(e.target.value);
                    const kls = classes.find((c) => e.target.value === 'ALL' || c.tingkat === e.target.value);
                    if (kls) setSelectedKelasId(kls.id);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="ALL">Semua Tingkat (X, XI, XII)</option>
                  <option value="X">Tingkat X (Fase E)</option>
                  <option value="XI">Tingkat XI (Fase F)</option>
                  <option value="XII">Tingkat XII (Fase F)</option>
                </select>

                <select
                  value={selectedKelasId}
                  onChange={(e) => setSelectedKelasId(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  {classes
                    .filter((c) => selectedTingkat === 'ALL' || c.tingkat === selectedTingkat)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        Kelas {c.nama} (Tingkat {c.tingkat})
                      </option>
                    ))}
                </select>
              </div>

              {/* Filter Hari */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                <button
                  onClick={() => setSelectedHari('ALL')}
                  className={cn(
                    'rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors',
                    selectedHari === 'ALL'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  Semua Hari
                </button>
                {HARI_LIST.map((h) => (
                  <button
                    key={h}
                    onClick={() => setSelectedHari(h)}
                    className={cn(
                      'rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors',
                      selectedHari === h
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    )}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timetable Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-1 rounded-full bg-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Jadwal KBM Kelas {currentClassName}{' '}
                  {selectedHari !== 'ALL' ? `• Hari ${selectedHari}` : '• Senin s/d Jumat'}
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Menampilkan <strong className="text-slate-800">{filteredSchedules.length}</strong> sesi pelajaran
              </span>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400">
                <div className="inline-flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                  <span>Memuat jadwal pelajaran...</span>
                </div>
              </div>
            ) : filteredSchedules.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400">
                <p>Belum ada jadwal yang terdaftar untuk filter ini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {filteredSchedules.map((s) => (
                  <div
                    key={s.id}
                    className="relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-emerald-50/50 p-4 shadow-xs hover:border-emerald-300 transition-all group"
                  >
                    <div>
                      {/* Top Bar: Hari & Jam */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
                          {s.hari}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>
                            {s.jamMulai} - {s.jamSelesai}
                          </span>
                        </div>
                      </div>

                      {/* Mapel Title */}
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {s.mapelNama}
                      </h4>

                      {/* Guru Pengampu */}
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                        <div className="rounded-lg bg-slate-100 p-1.5 text-slate-600">
                          <GraduationCap className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-medium truncate">{s.guruNama}</span>
                      </div>

                      {/* Ruangan */}
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        <span>{s.ruang}</span>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-[10px] text-slate-400 font-mono">ID: {s.id}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditSchedule(s)}
                          title="Edit Jadwal"
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setScheduleToDelete(s)}
                          title="Hapus Jadwal"
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* KONTEN TAB 2: KATALOG 16 MATA PELAJARAN */}
      {activeTab === 'mapel' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Daftar 16 Mata Pelajaran Kurikulum Merdeka
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Struktur beban jam mengajar mingguan sesuai SK Kepala SMAN 20 Kabupaten Tangerang
                </p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                16 Mata Pelajaran Aktif
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjects.map((sub) => (
              <div
                key={sub.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/60">
                      {sub.kode}
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[9px] font-semibold',
                        sub.kelompok === 'UMUM' && 'bg-slate-100 text-slate-700',
                        sub.kelompok === 'PEMINATAN_IPA' && 'bg-blue-50 text-blue-700',
                        sub.kelompok === 'PEMINATAN_IPS' && 'bg-amber-50 text-amber-700',
                        sub.kelompok === 'MUATAN_LOKAL' && 'bg-purple-50 text-purple-700'
                      )}
                    >
                      {sub.kelompok.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-1">{sub.nama}</h4>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded-xl">
                    <span className="text-[11px] text-slate-500">Beban Belajar:</span>
                    <strong className="font-bold text-slate-900">{sub.jamPerMinggu} Jam / Minggu</strong>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-1 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => openEditSubject(sub)}
                    title="Edit Mapel"
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setSubjectToDelete(sub)}
                    title="Hapus Mapel"
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KONTEN TAB 3: ROMBEL KELAS & RUANG */}
      {activeTab === 'rombel' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Filter Tingkat */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Filter Tingkat:</span>
                <div className="flex items-center gap-1.5">
                  {['ALL', 'X', 'XI', 'XII'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setRombelFilterTingkat(t)}
                      className={cn(
                        'rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors',
                        rombelFilterTingkat === t
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      )}
                    >
                      {t === 'ALL' ? 'Semua Tingkat' : `Tingkat ${t}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari kelas, ruang, wali kelas..."
                  value={rombelSearchQuery}
                  onChange={(e) => setRombelSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                />
                {rombelSearchQuery && (
                  <button
                    onClick={() => setRombelSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabel Sederhana Rombel Kelas */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-semibold">
                    <th className="px-4 py-3 text-center w-12">No</th>
                    <th className="px-4 py-3">Rombel Kelas</th>
                    <th className="px-4 py-3">Tingkat / Fase</th>
                    <th className="px-4 py-3">Ruang Kelas & Lokasi</th>
                    <th className="px-4 py-3">Wali Kelas</th>
                    <th className="px-4 py-3 text-center">Jumlah Siswa Riil</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClasses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                        Tidak ada data rombel kelas yang sesuai dengan pencarian atau filter.
                      </td>
                    </tr>
                  ) : (
                    filteredClasses.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 text-center text-slate-400 font-medium">{idx + 1}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-800 text-[11px]">
                              {item.nama.split(' ')[0]}
                            </span>
                            <div>
                              <div className="font-semibold text-slate-900">Kelas {item.nama}</div>
                              <div className="text-[10px] text-slate-500">
                                {item.jurusan === 'UMUM' ? 'Fase E (Umum)' : `Fase F (${item.jurusan})`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold',
                              item.tingkat === 'X'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : item.tingkat === 'XI'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            )}
                          >
                            Kelas {item.tingkat}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span>{item.ruang || '-'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <GraduationCap className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span className="font-medium text-slate-800">{item.waliKelasNama || '-'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 font-bold text-emerald-800 text-[11px]">
                              <Users className="h-3 w-3 text-emerald-600" />
                              {item.jumlahMurid || 0} Siswa
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5">
                              Daya Tampung: {item.kapasitas || 36}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditRombel(item)}
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                              title="Edit Rombel"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setRombelToDelete(item)}
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                              title="Hapus Rombel"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <div className="flex flex-wrap items-center justify-between border-t border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-600">
              <div>
                Menampilkan <strong>{filteredClasses.length}</strong> dari <strong>{classes.length}</strong> rombel kelas
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-500">
                <span>
                  Total Siswa Riil:{' '}
                  <strong className="text-emerald-700 font-bold">{classes.reduce((acc, c) => acc + (c.jumlahMurid || 0), 0)}</strong> siswa
                </span>
                <span>•</span>
                <span>
                  Total Daya Tampung:{' '}
                  <strong>{classes.reduce((acc, c) => acc + (c.kapasitas || 36), 0)}</strong> siswa
                </span>
                <span>•</span>
                <span>
                  Tahun Ajaran: <strong>2025/2026</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT JADWAL */}
      {(showAddScheduleModal || scheduleToEdit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {scheduleToEdit ? 'Edit Jam Pelajaran' : 'Tambah Jam Pelajaran Baru'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAddScheduleModal(false);
                  setScheduleToEdit(null);
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="p-6 text-xs space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rombel Kelas *</label>
                <select
                  value={scheduleForm.kelasId}
                  onChange={(e) => {
                    const k = classes.find((cls) => cls.id === e.target.value);
                    setScheduleForm({
                      ...scheduleForm,
                      kelasId: e.target.value,
                      ruang: k ? `Ruang ${k.nama}` : scheduleForm.ruang,
                    });
                  }}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      Kelas {c.nama} (Tingkat {c.tingkat})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hari *</label>
                  <select
                    value={scheduleForm.hari}
                    onChange={(e) =>
                      setScheduleForm({ ...scheduleForm, hari: e.target.value as ScheduleItem['hari'] })
                    }
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                  >
                    {HARI_LIST.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Mulai</label>
                  <input
                    type="time"
                    required
                    value={scheduleForm.jamMulai}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, jamMulai: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Selesai</label>
                  <input
                    type="time"
                    required
                    value={scheduleForm.jamSelesai}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, jamSelesai: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran *</label>
                <select
                  value={scheduleForm.mapelId}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, mapelId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      [{sub.kode}] {sub.nama} ({sub.jamPerMinggu} Jam)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guru Pengampu *</label>
                <select
                  value={scheduleForm.guruId}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, guruId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nama}, {t.gelar} — {t.mataPelajaran}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ruangan</label>
                <input
                  type="text"
                  value={scheduleForm.ruang}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, ruang: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                />
              </div>

              {/* Conflict Warning Box (Task A7.9) */}
              {formConflictWarning && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Peringatan Bentrok Jadwal!</span>
                    <span>{formConflictWarning}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddScheduleModal(false);
                    setScheduleToEdit(null);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingSchedule}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {savingSchedule ? 'Menyimpan...' : 'Simpan Jadwal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HAPUS JADWAL */}
      {scheduleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertTriangle className="h-6 w-6" />
              <h4 className="text-base font-bold text-slate-900">Hapus Jadwal?</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hapus jam pelajaran{' '}
              <strong className="text-slate-900">{scheduleToDelete.mapelNama}</strong> (
              {scheduleToDelete.hari}, {scheduleToDelete.jamMulai} - {scheduleToDelete.jamSelesai})?
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setScheduleToDelete(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteSchedule}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT MAPEL */}
      {(showAddSubjectModal || subjectToEdit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {subjectToEdit ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAddSubjectModal(false);
                  setSubjectToEdit(null);
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="p-6 text-xs space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kode Mapel *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: FIS, KIM, MTK"
                  value={subjectForm.kode}
                  onChange={(e) => setSubjectForm({ ...subjectForm, kode: e.target.value.toUpperCase() })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Mata Pelajaran *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Fisika Terapan"
                  value={subjectForm.nama}
                  onChange={(e) => setSubjectForm({ ...subjectForm, nama: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kelompok Kurikulum</label>
                <select
                  value={subjectForm.kelompok}
                  onChange={(e) =>
                    setSubjectForm({
                      ...subjectForm,
                      kelompok: e.target.value as SubjectItem['kelompok'],
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                >
                  <option value="UMUM">Umum</option>
                  <option value="PEMINATAN_IPA">Peminatan IPA (Fase F)</option>
                  <option value="PEMINATAN_IPS">Peminatan IPS (Fase F)</option>
                  <option value="MUATAN_LOKAL">Muatan Lokal</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Beban Jam / Minggu</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={subjectForm.jamPerMinggu}
                  onChange={(e) =>
                    setSubjectForm({ ...subjectForm, jamPerMinggu: parseInt(e.target.value, 10) || 2 })
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddSubjectModal(false);
                    setSubjectToEdit(null);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingSubject}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {savingSubject ? 'Menyimpan...' : 'Simpan Mapel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HAPUS MAPEL */}
      {subjectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertTriangle className="h-6 w-6" />
              <h4 className="text-base font-bold text-slate-900">Hapus Mata Pelajaran?</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hapus mata pelajaran <strong className="text-slate-900">{subjectToDelete.nama}</strong> ({subjectToDelete.kode})?
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setSubjectToDelete(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteSubject}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT ROMBEL KELAS */}
      {(showAddRombelModal || rombelToEdit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {rombelToEdit ? 'Edit Rombel Kelas & Ruang' : 'Tambah Rombel Kelas Baru'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAddRombelModal(false);
                  setRombelToEdit(null);
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRombel} className="p-6 text-xs space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Rombel *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: X.11 / XI MIPA 5"
                    value={rombelForm.nama}
                    onChange={(e) => setRombelForm({ ...rombelForm, nama: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tingkat *</label>
                  <select
                    value={rombelForm.tingkat}
                    onChange={(e) => {
                      const t = e.target.value as 'X' | 'XI' | 'XII';
                      setRombelForm({
                        ...rombelForm,
                        tingkat: t,
                        jurusan:
                          t === 'X'
                            ? 'UMUM'
                            : rombelForm.jurusan === 'UMUM'
                            ? 'MIPA'
                            : rombelForm.jurusan,
                      });
                    }}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="X">Tingkat X (Fase E)</option>
                    <option value="XI">Tingkat XI (Fase F)</option>
                    <option value="XII">Tingkat XII (Fase F)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jurusan / Peminatan</label>
                  <select
                    value={rombelForm.jurusan}
                    onChange={(e) =>
                      setRombelForm({
                        ...rombelForm,
                        jurusan: e.target.value as 'UMUM' | 'MIPA' | 'IPS',
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="UMUM">Umum (Fase E)</option>
                    <option value="MIPA">MIPA</option>
                    <option value="IPS">IPS</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kapasitas Siswa</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={rombelForm.kapasitas}
                    onChange={(e) =>
                      setRombelForm({ ...rombelForm, kapasitas: parseInt(e.target.value, 10) || 36 })
                    }
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ruang Kelas & Lokasi *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Gedung A - Lt 1 Ruang 101"
                  value={rombelForm.ruang}
                  onChange={(e) => setRombelForm({ ...rombelForm, ruang: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guru Wali Kelas</label>
                <select
                  value={rombelForm.waliKelasId}
                  onChange={(e) => setRombelForm({ ...rombelForm, waliKelasId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">-- Pilih Guru Wali Kelas --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nama}
                      {t.gelar ? `, ${t.gelar}` : ''} ({t.mataPelajaran})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddRombelModal(false);
                    setRombelToEdit(null);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingRombel}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {savingRombel ? 'Menyimpan...' : 'Simpan Rombel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HAPUS ROMBEL */}
      {rombelToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertTriangle className="h-6 w-6" />
              <h4 className="text-base font-bold text-slate-900">Hapus Rombel Kelas?</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus rombel{' '}
              <strong className="text-slate-900">Kelas {rombelToDelete.nama}</strong> ({rombelToDelete.ruang})?
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setRombelToDelete(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteRombel}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL AUDIT RINCIAN KONFLIK JADWAL (Task A7.9) */}
      {showConflictModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center",
                  conflictData.totalConflicts === 0
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-700"
                )}>
                  {conflictData.totalConflicts === 0 ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : (
                    <ShieldAlert className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Audit Konflik Jadwal Pelajaran (A7.9)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Deteksi otomatis bentrok guru ganda, bentrok rombel, ruang kelas, dan jam istirahat.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConflictModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Summary Banner */}
            <div className="mt-4 p-4 rounded-2xl border flex items-center justify-between gap-4 bg-slate-50">
              <div>
                <span className="text-xs font-semibold text-slate-500">Status Validasi KBM:</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {conflictData.totalConflicts === 0
                    ? 'Semua jadwal KBM sinkron & bebas bentrok.'
                    : `Ditemukan ${conflictData.totalConflicts} potensi konflik jadwal.`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-100 text-rose-800">
                  {conflictData.criticalCount} Kritis
                </span>
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-100 text-amber-800">
                  {conflictData.warningCount} Peringatan
                </span>
              </div>
            </div>

            {/* Conflict List */}
            <div className="mt-4 space-y-3">
              {conflictData.conflicts.length === 0 ? (
                <div className="py-8 text-center text-slate-500 space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <p className="font-bold text-sm text-slate-800">Luar biasa! Tidak ada bentrok jadwal.</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Seluruh penugasan guru, alokasi ruang kelas, dan jam istirahat telah sesuai dengan standar Kurikulum Merdeka 2026.
                  </p>
                </div>
              ) : (
                conflictData.conflicts.map((c: any) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                        c.severity === 'CRITICAL'
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      )}>
                        {c.type === 'TEACHER_CONFLICT'
                          ? 'Bentrok Guru'
                          : c.type === 'CLASS_CONFLICT'
                          ? 'Bentrok Rombel'
                          : c.type === 'ROOM_CONFLICT'
                          ? 'Bentrok Ruangan'
                          : 'Jam Istirahat'}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Hari {c.hari} • {c.timeRange}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{c.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>

                    <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-700 flex items-start gap-1.5 border border-slate-100">
                      <span className="font-bold text-emerald-800 shrink-0">Rekomendasi:</span>
                      <span>{c.recommendation}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowConflictModal(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition"
              >
                Tutup Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
