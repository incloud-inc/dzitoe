'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  Download,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  CreditCard,
  Compass,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Award,
  BookOpen,
  RefreshCw,
  X,
  Camera,
  Upload,
  FileSpreadsheet,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { ExcelImportModal } from '@/components/common/ExcelImportModal';
import { cn } from '@/lib/utils';

export interface TeacherItem {
  id: string;
  userId: string;
  nip: string;
  nuptk: string;
  nik: string;
  noKk: string;
  nama: string;
  gelar: string;
  jenisKelamin: 'LAKI_LAKI' | 'PEREMPUAN';
  tempatLahir: string;
  tanggalLahir: string;
  agama: string;
  jalan: string;
  rtRw: string;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  lintang: number;
  bujur: number;
  jabatan: string;
  mataPelajaran: string;
  status: string;
  statusKepegawaian: 'PNS' | 'PPPK' | 'HONORER';
  noHp: string;
  pendidikan: string;
  email: string;
  username: string;
  avatar?: string | null;
  waliKelasId?: string | null;
  waliKelasNama?: string | null;
}

export interface ClassOption {
  id: string;
  nama: string;
  tingkat: string;
}

const AGAMA_OPTIONS = [
  { value: 'ISLAM', label: 'Islam' },
  { value: 'KRISTEN_PROTESTAN', label: 'Kristen Protestan' },
  { value: 'KATOLIK', label: 'Katolik' },
  { value: 'HINDU', label: 'Hindu' },
  { value: 'BUDDHA', label: 'Buddha' },
];

const MAPEL_LIST = [
  'Matematika',
  'Bahasa Indonesia',
  'Bahasa Inggris',
  'Pendidikan Agama Islam',
  'Pendidikan Pancasila',
  'Sejarah Indonesia',
  'Pendidikan Jasmani & Olahraga',
  'Informatika',
  'Seni Budaya',
  'Fisika',
  'Kimia',
  'Biologi',
  'Ekonomi',
  'Geografi',
  'Sosiologi',
  'Bimbingan Konseling',
  'Administrasi / TU',
  'Manajemen Sekolah',
];

export default function GuruPage() {
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [selectedStatusPeg, setSelectedStatusPeg] = useState<string>('ALL');
  const [selectedMapel, setSelectedMapel] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals state
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherItem | null>(null);
  const [profileTab, setProfileTab] = useState<'pokok' | 'kelahiran' | 'alamat'>('pokok');

  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalTab, setAddModalTab] = useState<'pokok' | 'kelahiran' | 'alamat'>('pokok');

  const [teacherToEdit, setTeacherToEdit] = useState<TeacherItem | null>(null);
  const [editModalTab, setEditModalTab] = useState<'pokok' | 'kelahiran' | 'alamat'>('pokok');

  const [teacherToDelete, setTeacherToDelete] = useState<TeacherItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Import Excel & Photo Upload States (A6.8 & A6.9)
  const [showImportModal, setShowImportModal] = useState(false);
  const [photoUploadTeacher, setPhotoUploadTeacher] = useState<TeacherItem | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Form Tambah Guru State
  const [newFormData, setNewFormData] = useState({
    nama: '',
    gelar: 'S.Pd.',
    jenisKelamin: 'LAKI_LAKI' as 'LAKI_LAKI' | 'PEREMPUAN',
    nip: '',
    nuptk: '',
    nik: '',
    noKk: '',
    tempatLahir: 'Tangerang',
    tanggalLahir: '1985-05-15',
    agama: 'ISLAM',
    jalan: '',
    rtRw: '002/003',
    kelurahan: 'Pakuhaji',
    kecamatan: 'Pakuhaji',
    kabupaten: 'Kabupaten Tangerang',
    provinsi: 'Banten',
    kodePos: '15570',
    lintang: '-6.123456',
    bujur: '106.123456',
    jabatan: 'Wali Kelas & Guru Mata Pelajaran',
    mataPelajaran: 'Matematika',
    status: 'AKTIF',
    statusKepegawaian: 'PNS' as 'PNS' | 'PPPK' | 'HONORER',
    noHp: '081298765432',
    pendidikan: 'S1 Pendidikan',
    waliKelasId: '',
  });
  const [savingNew, setSavingNew] = useState(false);

  // Form Edit Guru State
  const [editFormData, setEditFormData] = useState({
    id: '',
    nama: '',
    gelar: '',
    jenisKelamin: 'LAKI_LAKI' as 'LAKI_LAKI' | 'PEREMPUAN',
    nip: '',
    nuptk: '',
    nik: '',
    noKk: '',
    tempatLahir: '',
    tanggalLahir: '',
    agama: 'ISLAM',
    jalan: '',
    rtRw: '',
    kelurahan: '',
    kecamatan: '',
    kabupaten: '',
    provinsi: '',
    kodePos: '',
    lintang: '',
    bujur: '',
    jabatan: '',
    mataPelajaran: '',
    status: 'AKTIF',
    statusKepegawaian: 'PNS' as 'PNS' | 'PPPK' | 'HONORER',
    noHp: '',
    pendidikan: '',
    waliKelasId: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Fetch daftar rombel kelas untuk pilihan wali kelas
  useEffect(() => {
    async function loadClasses() {
      try {
        const res = await fetch('/api/kelas');
        const json = await res.json();
        if (json.success && json.data) {
          setClasses(json.data);
        }
      } catch (err) {
        console.error('Gagal memuat kelas:', err);
      }
    }
    loadClasses();
  }, []);

  // Fetch data guru & tendik
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedStatusPeg !== 'ALL') params.append('statusKepegawaian', selectedStatusPeg);
      if (selectedMapel !== 'ALL') params.append('mapel', selectedMapel);
      params.append('page', page.toString());
      params.append('limit', '12');

      const res = await fetch(`/api/guru?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setTeachers(json.data || []);
        setTotalPages(json.totalPages || 1);
        setTotalCount(json.total || 0);
      }
    } catch (err) {
      console.error('Gagal memuat data guru:', err);
      showToast('Gagal memuat data guru dari server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [search, selectedStatusPeg, selectedMapel, page]);

  // Statistik GTK
  const stats = useMemo(() => {
    const pns = teachers.filter((t) => t.statusKepegawaian === 'PNS').length;
    const pppk = teachers.filter((t) => t.statusKepegawaian === 'PPPK').length;
    const honorer = teachers.filter((t) => t.statusKepegawaian === 'HONORER').length;
    const waliCount = teachers.filter((t) => !!t.waliKelasNama).length;
    return { pns, pppk, honorer, waliCount };
  }, [teachers]);

  // Handle Tambah Guru Baru
  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormData.nama || !newFormData.mataPelajaran) {
      showToast('Nama Guru dan Mata Pelajaran wajib diisi!');
      return;
    }

    setSavingNew(true);
    try {
      const res = await fetch('/api/guru', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFormData),
      });
      const json = await res.json();

      if (json.success) {
        showToast('Guru/Tendik berhasil didaftarkan ke sistem Dapodik!');
        setShowAddModal(false);
        // Reset form
        setNewFormData({
          nama: '',
          gelar: 'S.Pd.',
          jenisKelamin: 'LAKI_LAKI',
          nip: '',
          nuptk: '',
          nik: '',
          noKk: '',
          tempatLahir: 'Tangerang',
          tanggalLahir: '1985-05-15',
          agama: 'ISLAM',
          jalan: '',
          rtRw: '002/003',
          kelurahan: 'Pakuhaji',
          kecamatan: 'Pakuhaji',
          kabupaten: 'Kabupaten Tangerang',
          provinsi: 'Banten',
          kodePos: '15570',
          lintang: '-6.123456',
          bujur: '106.123456',
          jabatan: 'Guru Mata Pelajaran',
          mataPelajaran: 'Matematika',
          status: 'AKTIF',
          statusKepegawaian: 'PNS',
          noHp: '081298765432',
          pendidikan: 'S1 Pendidikan',
          waliKelasId: '',
        });
        fetchTeachers();
      } else {
        showToast(json.message || 'Gagal menambahkan data guru.');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan jaringan.');
    } finally {
      setSavingNew(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (t: TeacherItem) => {
    setTeacherToEdit(t);
    setEditFormData({
      id: t.id,
      nama: t.nama,
      gelar: t.gelar,
      jenisKelamin: t.jenisKelamin,
      nip: t.nip,
      nuptk: t.nuptk,
      nik: t.nik,
      noKk: t.noKk,
      tempatLahir: t.tempatLahir,
      tanggalLahir: t.tanggalLahir,
      agama: t.agama,
      jalan: t.jalan,
      rtRw: t.rtRw,
      kelurahan: t.kelurahan,
      kecamatan: t.kecamatan,
      kabupaten: t.kabupaten,
      provinsi: t.provinsi,
      kodePos: t.kodePos,
      lintang: t.lintang?.toString() || '',
      bujur: t.bujur?.toString() || '',
      jabatan: t.jabatan,
      mataPelajaran: t.mataPelajaran,
      status: t.status,
      statusKepegawaian: t.statusKepegawaian,
      noHp: t.noHp,
      pendidikan: t.pendidikan,
      waliKelasId: t.waliKelasId || '',
    });
    setEditModalTab('pokok');
  };

  // Handle Update Guru
  const handleUpdateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.id || !editFormData.nama) {
      showToast('Nama Guru wajib diisi!');
      return;
    }

    setSavingEdit(true);
    try {
      const res = await fetch('/api/guru', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });
      const json = await res.json();

      if (json.success) {
        showToast('Data identitas guru berhasil diperbarui!');
        setTeacherToEdit(null);
        fetchTeachers();
      } else {
        showToast(json.message || 'Gagal memperbarui data guru.');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan jaringan.');
    } finally {
      setSavingEdit(false);
    }
  };

  // Handle Delete Guru
  const handleDeleteTeacher = async () => {
    if (!teacherToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/guru?id=${teacherToDelete.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();

      if (json.success) {
        showToast(`Guru ${teacherToDelete.nama} berhasil dihapus.`);
        setTeacherToDelete(null);
        fetchTeachers();
      } else {
        showToast(json.message || 'Gagal menghapus data guru.');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan saat menghapus.');
    } finally {
      setDeleting(false);
    }
  };

  // Export CSV sederhana
  const exportCSV = () => {
    const headers = [
      'NIP',
      'NUPTK',
      'Nama Lengkap',
      'Gelar',
      'Jenis Kelamin',
      'Mata Pelajaran',
      'Jabatan',
      'Status Kepegawaian',
      'Wali Kelas',
      'No HP',
      'Email',
      'Alamat',
    ];
    const rows = teachers.map((t) => [
      `"${t.nip}"`,
      `"${t.nuptk}"`,
      `"${t.nama}"`,
      `"${t.gelar}"`,
      `"${t.jenisKelamin}"`,
      `"${t.mataPelajaran}"`,
      `"${t.jabatan}"`,
      `"${t.statusKepegawaian}"`,
      `"${t.waliKelasNama || '-'}"`,
      `"${t.noHp}"`,
      `"${t.email}"`,
      `"${t.jalan}, ${t.kelurahan}, ${t.kecamatan}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Data_GTK_SMAN_20_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('File data GTK berhasil diunduh (CSV).');
  };

  const handleSelectPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file foto guru melebihi batas 2 MB.');
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleUploadPhoto = async () => {
    if (!photoUploadTeacher || !photoFile) return;
    setIsUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('teacherId', photoUploadTeacher.id);
      formData.append('photo', photoFile);

      const res = await fetch('/api/guru/upload-foto', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.avatarUrl) {
        setTeachers((prev) =>
          prev.map((t) => (t.id === photoUploadTeacher.id ? { ...t, avatar: data.avatarUrl } : t))
        );
        showToast(`Foto profil guru "${photoUploadTeacher.nama}" berhasil diperbarui!`);
        setPhotoUploadTeacher(null);
        setPhotoFile(null);
        setPhotoPreview(null);
      } else {
        alert(data.message || 'Gagal mengunggah foto guru.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan saat mengunggah foto guru.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <DashboardShell>
      {/* Toast Notification */}
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
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 mb-1">
            <span>DAPODIK KEMDIKBUDRISTEK</span>
            <span>•</span>
            <span>MODUL A6 GTK</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Tenaga Pendidik & Kependidikan (GTK)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manajemen Master Data Pendidik, Tendik, Rombel Wali Kelas & Kependudukan Resmi SMAN 20 Kabupaten Tangerang.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-sky-300 bg-sky-50 px-3.5 py-2 text-xs font-semibold text-sky-800 shadow-xs hover:bg-sky-100 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4 text-sky-700" />
            <span>Import Excel Guru (A6.8)</span>
          </button>
          <button
            onClick={() => {
              setAddModalTab('pokok');
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-sky-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah GTK Baru</span>
          </button>
        </div>
      </div>

      {/* Kartu Ringkasan Statistik */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total GTK Terdaftar</span>
            <div className="rounded-lg bg-sky-50 p-2 text-sky-600">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{totalCount || teachers.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Standar Dapodik Kemendikbud</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Status PNS (ASN)</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{stats.pns}</p>
          <p className="text-[11px] text-slate-500 mt-1">Pegawai Negeri Sipil</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">PPPK & Honorer</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600">{stats.pppk + stats.honorer}</p>
          <p className="text-[11px] text-slate-500 mt-1">PPPK ({stats.pppk}) • Honorer ({stats.honorer})</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Wali Kelas Terisi</span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-indigo-600">{stats.waliCount} / 30</p>
          <p className="text-[11px] text-slate-500 mt-1">Rombel Kelas X, XI, XII</p>
        </div>
      </div>

      {/* Filter & Bar Pencarian */}
      <div className="mb-6 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari berdasarkan Nama, NIP, NUPTK, NIK, Mapel..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 transition-colors focus:border-sky-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Status Kepegawaian */}
            <select
              value={selectedStatusPeg}
              onChange={(e) => {
                setSelectedStatusPeg(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-sky-500 focus:outline-none"
            >
              <option value="ALL">Semua Kepegawaian</option>
              <option value="PNS">PNS</option>
              <option value="PPPK">PPPK</option>
              <option value="HONORER">Honorer</option>
            </select>

            {/* Filter Mapel */}
            <select
              value={selectedMapel}
              onChange={(e) => {
                setSelectedMapel(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-sky-500 focus:outline-none"
            >
              <option value="ALL">Semua Mata Pelajaran</option>
              {MAPEL_LIST.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearch('');
                setSelectedStatusPeg('ALL');
                setSelectedMapel('ALL');
                setPage(1);
              }}
              title="Reset Filter"
              className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabel Data GTK */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="sticky top-0 z-10 border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 pl-6 pr-3">Pendidik & Tendik</th>
                <th className="px-3 py-3.5">NIP / NUPTK</th>
                <th className="px-3 py-3.5">Mata Pelajaran & Jabatan</th>
                <th className="px-3 py-3.5">Status Pegawai</th>
                <th className="px-3 py-3.5">Wali Kelas</th>
                <th className="px-3 py-3.5">Kontak & Domisili</th>
                <th className="py-3.5 pl-3 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
                      <span>Memuat master data GTK...</span>
                    </div>
                  </td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada data guru atau tenaga pendidik yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => {
                            setPhotoUploadTeacher(t);
                            setPhotoFile(null);
                            setPhotoPreview(null);
                          }}
                          className="relative h-10 w-10 rounded-full overflow-hidden border border-slate-200 shrink-0 cursor-pointer group/avatar"
                          title="Klik untuk ganti / upload foto profil guru (A6.9)"
                        >
                          <img
                            src={t.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                            alt={t.nama}
                            className="h-full w-full object-cover transition-transform group-hover/avatar:scale-105"
                          />
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Camera className="w-4 h-4" />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {t.nama}, {t.gelar}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {t.jenisKelamin === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'} • {t.pendidikan}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <p className="font-mono text-slate-800 font-medium">{t.nip}</p>
                      <p className="text-[10px] text-slate-400">NUPTK: {t.nuptk}</p>
                    </td>
                    <td className="px-3 py-3.5">
                      <p className="font-semibold text-sky-700">{t.mataPelajaran}</p>
                      <p className="text-[11px] text-slate-500">{t.jabatan}</p>
                    </td>
                    <td className="px-3 py-3.5">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold',
                          t.statusKepegawaian === 'PNS' && 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
                          t.statusKepegawaian === 'PPPK' && 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
                          t.statusKepegawaian === 'HONORER' && 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20'
                        )}
                      >
                        {t.statusKepegawaian}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      {t.waliKelasNama ? (
                        <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2 py-1 text-[11px] font-bold text-indigo-700 border border-indigo-200/60">
                          {t.waliKelasNama}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-3 py-3.5">
                      <p className="text-slate-700">{t.noHp}</p>
                      <p className="text-[11px] text-slate-400">{t.kelurahan}, {t.kecamatan}</p>
                    </td>
                    <td className="py-3.5 pl-3 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedTeacher(t);
                            setProfileTab('pokok');
                          }}
                          title="Lihat Detail Profil Dapodik"
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(t)}
                          title="Edit Data GTK"
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setTeacherToDelete(t)}
                          title="Hapus Guru"
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginasi */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3 text-xs text-slate-500">
          <p>
            Menampilkan <span className="font-semibold text-slate-900">{teachers.length}</span> dari{' '}
            <span className="font-semibold text-slate-900">{totalCount}</span> GTK
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-50"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Sebelumnya</span>
            </button>
            <span className="font-medium text-slate-700">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-50"
            >
              <span>Berikutnya</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: DETAIL PROFIL GTK (MIRIP DATA DIRI SISWA) */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-sky-100 p-2 text-sky-700">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedTeacher.nama}, {selectedTeacher.gelar}
                  </h3>
                  <p className="text-xs text-slate-500">
                    NIP: {selectedTeacher.nip} • NUPTK: {selectedTeacher.nuptk}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTeacher(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 px-6">
              <button
                onClick={() => setProfileTab('pokok')}
                className={cn(
                  'flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-medium transition-colors',
                  profileTab === 'pokok'
                    ? 'border-sky-600 text-sky-600 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                )}
              >
                <CreditCard className="h-4 w-4" />
                <span>Identitas Pokok & Kepegawaian</span>
              </button>
              <button
                onClick={() => setProfileTab('kelahiran')}
                className={cn(
                  'flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-medium transition-colors',
                  profileTab === 'kelahiran'
                    ? 'border-sky-600 text-sky-600 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                )}
              >
                <Calendar className="h-4 w-4" />
                <span>Kelahiran & Dokumen</span>
              </button>
              <button
                onClick={() => setProfileTab('alamat')}
                className={cn(
                  'flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-medium transition-colors',
                  profileTab === 'alamat'
                    ? 'border-sky-600 text-sky-600 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                )}
              >
                <MapPin className="h-4 w-4" />
                <span>Alamat & Koordinat GPS</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[60vh] overflow-y-auto p-6 text-xs">
              {profileTab === 'pokok' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <span className="text-[11px] text-slate-400">Nama Lengkap & Gelar</span>
                    <p className="font-semibold text-slate-900 mt-0.5">
                      {selectedTeacher.nama}, {selectedTeacher.gelar}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <span className="text-[11px] text-slate-400">Mata Pelajaran Ampuan</span>
                    <p className="font-semibold text-sky-700 mt-0.5">{selectedTeacher.mataPelajaran}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <span className="text-[11px] text-slate-400">NIP (Nomor Induk Pegawai)</span>
                    <p className="font-mono font-medium text-slate-800 mt-0.5">{selectedTeacher.nip}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <span className="text-[11px] text-slate-400">NUPTK</span>
                    <p className="font-mono font-medium text-slate-800 mt-0.5">{selectedTeacher.nuptk}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <span className="text-[11px] text-slate-400">Status Kepegawaian</span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedTeacher.statusKepegawaian}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <span className="text-[11px] text-slate-400">Jabatan Fungsional</span>
                    <p className="font-medium text-slate-800 mt-0.5">{selectedTeacher.jabatan}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <span className="text-[11px] text-slate-400">Wali Kelas Rombel</span>
                    <p className="font-bold text-indigo-700 mt-0.5">
                      {selectedTeacher.waliKelasNama ? `Kelas ${selectedTeacher.waliKelasNama}` : 'Bukan Wali Kelas'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <span className="text-[11px] text-slate-400">Pendidikan Terakhir</span>
                    <p className="font-medium text-slate-800 mt-0.5">{selectedTeacher.pendidikan}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <span className="text-[11px] text-slate-400">No. WhatsApp / HP</span>
                    <p className="font-medium text-slate-800 mt-0.5">{selectedTeacher.noHp}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <span className="text-[11px] text-slate-400">Email Kedinasan</span>
                    <p className="font-medium text-slate-800 mt-0.5">{selectedTeacher.email}</p>
                  </div>
                </div>
              )}

              {profileTab === 'kelahiran' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <span className="text-[11px] text-slate-400">NIK (Nomor Induk Kependudukan)</span>
                    <p className="font-mono font-medium text-slate-800 mt-0.5">{selectedTeacher.nik}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <span className="text-[11px] text-slate-400">No. Kartu Keluarga (KK)</span>
                    <p className="font-mono font-medium text-slate-800 mt-0.5">{selectedTeacher.noKk}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <span className="text-[11px] text-slate-400">Tempat Lahir</span>
                    <p className="font-medium text-slate-800 mt-0.5">{selectedTeacher.tempatLahir}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <span className="text-[11px] text-slate-400">Tanggal Lahir</span>
                    <p className="font-medium text-slate-800 mt-0.5">{selectedTeacher.tanggalLahir}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <span className="text-[11px] text-slate-400">Jenis Kelamin</span>
                    <p className="font-medium text-slate-800 mt-0.5">
                      {selectedTeacher.jenisKelamin === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <span className="text-[11px] text-slate-400">Agama</span>
                    <p className="font-medium text-slate-800 mt-0.5">{selectedTeacher.agama}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <span className="text-[11px] text-slate-400">Status Keaktifan</span>
                    <p className="font-semibold text-emerald-600 mt-0.5">{selectedTeacher.status}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <span className="text-[11px] text-slate-400">Akun SSO Guru</span>
                    <p className="font-mono text-slate-700 mt-0.5">{selectedTeacher.username}</p>
                  </div>
                </div>
              )}

              {profileTab === 'alamat' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                      <span className="text-[11px] text-slate-400">Alamat Tempat Tinggal (Jalan & No Rumah)</span>
                      <p className="font-medium text-slate-800 mt-0.5">{selectedTeacher.jalan}</p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                      <span className="text-[11px] text-slate-400">RT / RW</span>
                      <p className="font-medium text-slate-800 mt-0.5">{selectedTeacher.rtRw}</p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                      <span className="text-[11px] text-slate-400">Kelurahan / Desa</span>
                      <p className="font-medium text-slate-800 mt-0.5">{selectedTeacher.kelurahan}</p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                      <span className="text-[11px] text-slate-400">Kecamatan</span>
                      <p className="font-medium text-slate-800 mt-0.5">{selectedTeacher.kecamatan}</p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                      <span className="text-[11px] text-slate-400">Kabupaten / Kota</span>
                      <p className="font-medium text-slate-800 mt-0.5">{selectedTeacher.kabupaten}</p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                      <span className="text-[11px] text-slate-400">Provinsi</span>
                      <p className="font-medium text-slate-800 mt-0.5">{selectedTeacher.provinsi}</p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                      <span className="text-[11px] text-slate-400">Kode Pos</span>
                      <p className="font-medium text-slate-800 mt-0.5">{selectedTeacher.kodePos}</p>
                    </div>
                  </div>

                  {/* Koordinat GPS Geotagging */}
                  <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sky-800 font-semibold">
                        <Compass className="h-4 w-4 text-sky-600" />
                        <span>Titik Koordinat Geospasial Rumah Guru</span>
                      </div>
                      <a
                        href={`https://www.google.com/maps?q=${selectedTeacher.lintang},${selectedTeacher.bujur}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-sky-700 transition-colors"
                      >
                        <span>Buka Google Maps</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="text-slate-500">Lintang (Latitude):</span>{' '}
                        <strong className="font-mono text-slate-800">{selectedTeacher.lintang}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Bujur (Longitude):</span>{' '}
                        <strong className="font-mono text-slate-800">{selectedTeacher.bujur}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end border-t border-slate-200 bg-slate-50 px-6 py-3">
              <button
                onClick={() => setSelectedTeacher(null)}
                className="rounded-xl bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TAMBAH GTK BARU */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-sky-100 p-2 text-sky-700">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Pendaftaran GTK Baru</h3>
                  <p className="text-xs text-slate-500">Form Pendataan Tenaga Pendidik & Kependidikan SMAN 20</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs Form Tambah */}
            <div className="flex border-b border-slate-200 px-6">
              <button
                type="button"
                onClick={() => setAddModalTab('pokok')}
                className={cn(
                  'border-b-2 py-3 px-3 text-xs font-medium',
                  addModalTab === 'pokok'
                    ? 'border-sky-600 text-sky-600 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                )}
              >
                1. Identitas & Mapel
              </button>
              <button
                type="button"
                onClick={() => setAddModalTab('kelahiran')}
                className={cn(
                  'border-b-2 py-3 px-3 text-xs font-medium',
                  addModalTab === 'kelahiran'
                    ? 'border-sky-600 text-sky-600 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                )}
              >
                2. Kelahiran & Kepegawaian
              </button>
              <button
                type="button"
                onClick={() => setAddModalTab('alamat')}
                className={cn(
                  'border-b-2 py-3 px-3 text-xs font-medium',
                  addModalTab === 'alamat'
                    ? 'border-sky-600 text-sky-600 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                )}
              >
                3. Alamat & Geotagging
              </button>
            </div>

            <form onSubmit={handleCreateTeacher}>
              <div className="max-h-[60vh] overflow-y-auto p-6 text-xs space-y-4">
                {addModalTab === 'pokok' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        Nama Lengkap (tanpa gelar) *
                      </label>
                      <input
                        type="text"
                        required
                        value={newFormData.nama}
                        onChange={(e) => setNewFormData({ ...newFormData, nama: e.target.value })}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Gelar Akademik</label>
                      <input
                        type="text"
                        value={newFormData.gelar}
                        onChange={(e) => setNewFormData({ ...newFormData, gelar: e.target.value })}
                        placeholder="Contoh: M.Pd."
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                      <select
                        value={newFormData.jenisKelamin}
                        onChange={(e) =>
                          setNewFormData({
                            ...newFormData,
                            jenisKelamin: e.target.value as 'LAKI_LAKI' | 'PEREMPUAN',
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      >
                        <option value="LAKI_LAKI">Laki-laki</option>
                        <option value="PEREMPUAN">Perempuan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran Ampuan *</label>
                      <select
                        value={newFormData.mataPelajaran}
                        onChange={(e) => setNewFormData({ ...newFormData, mataPelajaran: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      >
                        {MAPEL_LIST.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Wali Kelas (Opsional)</label>
                      <select
                        value={newFormData.waliKelasId}
                        onChange={(e) => setNewFormData({ ...newFormData, waliKelasId: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      >
                        <option value="">Bukan Wali Kelas</option>
                        {classes.map((c) => (
                          <option key={c.id} value={c.id}>
                            Kelas {c.nama} (Tingkat {c.tingkat})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Jabatan Fungsional</label>
                      <input
                        type="text"
                        value={newFormData.jabatan}
                        onChange={(e) => setNewFormData({ ...newFormData, jabatan: e.target.value })}
                        placeholder="Contoh: Guru Mata Pelajaran"
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Pendidikan Terakhir</label>
                      <input
                        type="text"
                        value={newFormData.pendidikan}
                        onChange={(e) => setNewFormData({ ...newFormData, pendidikan: e.target.value })}
                        placeholder="Contoh: S1 Pendidikan Matematika"
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {addModalTab === 'kelahiran' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">NIP (18 Digit)</label>
                      <input
                        type="text"
                        value={newFormData.nip}
                        onChange={(e) => setNewFormData({ ...newFormData, nip: e.target.value })}
                        placeholder="198501012010011001"
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">NUPTK (16 Digit)</label>
                      <input
                        type="text"
                        value={newFormData.nuptk}
                        onChange={(e) => setNewFormData({ ...newFormData, nuptk: e.target.value })}
                        placeholder="9801758600000001"
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">NIK (16 Digit KTP)</label>
                      <input
                        type="text"
                        value={newFormData.nik}
                        onChange={(e) => setNewFormData({ ...newFormData, nik: e.target.value })}
                        placeholder="3603120101850001"
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">No. Kartu Keluarga (KK)</label>
                      <input
                        type="text"
                        value={newFormData.noKk}
                        onChange={(e) => setNewFormData({ ...newFormData, noKk: e.target.value })}
                        placeholder="3603120101050001"
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tempat Lahir</label>
                      <input
                        type="text"
                        value={newFormData.tempatLahir}
                        onChange={(e) => setNewFormData({ ...newFormData, tempatLahir: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                      <input
                        type="date"
                        value={newFormData.tanggalLahir}
                        onChange={(e) => setNewFormData({ ...newFormData, tanggalLahir: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Status Kepegawaian</label>
                      <select
                        value={newFormData.statusKepegawaian}
                        onChange={(e) =>
                          setNewFormData({
                            ...newFormData,
                            statusKepegawaian: e.target.value as 'PNS' | 'PPPK' | 'HONORER',
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      >
                        <option value="PNS">PNS</option>
                        <option value="PPPK">PPPK</option>
                        <option value="HONORER">Honorer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Agama</label>
                      <select
                        value={newFormData.agama}
                        onChange={(e) => setNewFormData({ ...newFormData, agama: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      >
                        {AGAMA_OPTIONS.map((a) => (
                          <option key={a.value} value={a.value}>
                            {a.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {addModalTab === 'alamat' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Alamat Domisili (Jalan/Gang)</label>
                      <input
                        type="text"
                        value={newFormData.jalan}
                        onChange={(e) => setNewFormData({ ...newFormData, jalan: e.target.value })}
                        placeholder="Contoh: Jl. Raya Pakuhaji No. 12"
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">RT / RW</label>
                      <input
                        type="text"
                        value={newFormData.rtRw}
                        onChange={(e) => setNewFormData({ ...newFormData, rtRw: e.target.value })}
                        placeholder="001/002"
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Kelurahan / Desa</label>
                      <input
                        type="text"
                        value={newFormData.kelurahan}
                        onChange={(e) => setNewFormData({ ...newFormData, kelurahan: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Kecamatan</label>
                      <input
                        type="text"
                        value={newFormData.kecamatan}
                        onChange={(e) => setNewFormData({ ...newFormData, kecamatan: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Kabupaten / Kota</label>
                      <input
                        type="text"
                        value={newFormData.kabupaten}
                        onChange={(e) => setNewFormData({ ...newFormData, kabupaten: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Lintang GPS (Latitude)</label>
                      <input
                        type="text"
                        value={newFormData.lintang}
                        onChange={(e) => setNewFormData({ ...newFormData, lintang: e.target.value })}
                        placeholder="-6.123456"
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Bujur GPS (Longitude)</label>
                      <input
                        type="text"
                        value={newFormData.bujur}
                        onChange={(e) => setNewFormData({ ...newFormData, bujur: e.target.value })}
                        placeholder="106.123456"
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Form Footer */}
              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingNew}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-sky-700 disabled:opacity-50"
                >
                  {savingNew ? 'Menyimpan...' : 'Daftarkan GTK'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT DATA GTK */}
      {teacherToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
                  <Pencil className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Perbarui Data GTK</h3>
                  <p className="text-xs text-slate-500">Edit Data Dapodik: {teacherToEdit.nama}</p>
                </div>
              </div>
              <button
                onClick={() => setTeacherToEdit(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs Edit */}
            <div className="flex border-b border-slate-200 px-6">
              <button
                type="button"
                onClick={() => setEditModalTab('pokok')}
                className={cn(
                  'border-b-2 py-3 px-3 text-xs font-medium',
                  editModalTab === 'pokok'
                    ? 'border-sky-600 text-sky-600 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                )}
              >
                1. Identitas & Mapel
              </button>
              <button
                type="button"
                onClick={() => setEditModalTab('kelahiran')}
                className={cn(
                  'border-b-2 py-3 px-3 text-xs font-medium',
                  editModalTab === 'kelahiran'
                    ? 'border-sky-600 text-sky-600 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                )}
              >
                2. Kelahiran & Kepegawaian
              </button>
              <button
                type="button"
                onClick={() => setEditModalTab('alamat')}
                className={cn(
                  'border-b-2 py-3 px-3 text-xs font-medium',
                  editModalTab === 'alamat'
                    ? 'border-sky-600 text-sky-600 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                )}
              >
                3. Alamat & Geotagging
              </button>
            </div>

            <form onSubmit={handleUpdateTeacher}>
              <div className="max-h-[60vh] overflow-y-auto p-6 text-xs space-y-4">
                {editModalTab === 'pokok' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        value={editFormData.nama}
                        onChange={(e) => setEditFormData({ ...editFormData, nama: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Gelar Akademik</label>
                      <input
                        type="text"
                        value={editFormData.gelar}
                        onChange={(e) => setEditFormData({ ...editFormData, gelar: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran Ampuan</label>
                      <select
                        value={editFormData.mataPelajaran}
                        onChange={(e) => setEditFormData({ ...editFormData, mataPelajaran: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      >
                        {MAPEL_LIST.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Wali Kelas</label>
                      <select
                        value={editFormData.waliKelasId}
                        onChange={(e) => setEditFormData({ ...editFormData, waliKelasId: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      >
                        <option value="">Bukan Wali Kelas</option>
                        {classes.map((c) => (
                          <option key={c.id} value={c.id}>
                            Kelas {c.nama} (Tingkat {c.tingkat})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Jabatan</label>
                      <input
                        type="text"
                        value={editFormData.jabatan}
                        onChange={(e) => setEditFormData({ ...editFormData, jabatan: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp / HP</label>
                      <input
                        type="text"
                        value={editFormData.noHp}
                        onChange={(e) => setEditFormData({ ...editFormData, noHp: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {editModalTab === 'kelahiran' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">NIP</label>
                      <input
                        type="text"
                        value={editFormData.nip}
                        onChange={(e) => setEditFormData({ ...editFormData, nip: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">NUPTK</label>
                      <input
                        type="text"
                        value={editFormData.nuptk}
                        onChange={(e) => setEditFormData({ ...editFormData, nuptk: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">NIK (KTP)</label>
                      <input
                        type="text"
                        value={editFormData.nik}
                        onChange={(e) => setEditFormData({ ...editFormData, nik: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">No. KK</label>
                      <input
                        type="text"
                        value={editFormData.noKk}
                        onChange={(e) => setEditFormData({ ...editFormData, noKk: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tempat Lahir</label>
                      <input
                        type="text"
                        value={editFormData.tempatLahir}
                        onChange={(e) => setEditFormData({ ...editFormData, tempatLahir: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                      <input
                        type="date"
                        value={editFormData.tanggalLahir}
                        onChange={(e) => setEditFormData({ ...editFormData, tanggalLahir: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Status Kepegawaian</label>
                      <select
                        value={editFormData.statusKepegawaian}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            statusKepegawaian: e.target.value as 'PNS' | 'PPPK' | 'HONORER',
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                      >
                        <option value="PNS">PNS</option>
                        <option value="PPPK">PPPK</option>
                        <option value="HONORER">Honorer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Agama</label>
                      <select
                        value={editFormData.agama}
                        onChange={(e) => setEditFormData({ ...editFormData, agama: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                      >
                        {AGAMA_OPTIONS.map((a) => (
                          <option key={a.value} value={a.value}>
                            {a.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {editModalTab === 'alamat' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Alamat (Jalan)</label>
                      <input
                        type="text"
                        value={editFormData.jalan}
                        onChange={(e) => setEditFormData({ ...editFormData, jalan: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">RT / RW</label>
                      <input
                        type="text"
                        value={editFormData.rtRw}
                        onChange={(e) => setEditFormData({ ...editFormData, rtRw: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Kelurahan</label>
                      <input
                        type="text"
                        value={editFormData.kelurahan}
                        onChange={(e) => setEditFormData({ ...editFormData, kelurahan: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Kecamatan</label>
                      <input
                        type="text"
                        value={editFormData.kecamatan}
                        onChange={(e) => setEditFormData({ ...editFormData, kecamatan: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Kabupaten</label>
                      <input
                        type="text"
                        value={editFormData.kabupaten}
                        onChange={(e) => setEditFormData({ ...editFormData, kabupaten: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Lintang GPS</label>
                      <input
                        type="text"
                        value={editFormData.lintang}
                        onChange={(e) => setEditFormData({ ...editFormData, lintang: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Bujur GPS</label>
                      <input
                        type="text"
                        value={editFormData.bujur}
                        onChange={(e) => setEditFormData({ ...editFormData, bujur: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Form Footer */}
              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3">
                <button
                  type="button"
                  onClick={() => setTeacherToEdit(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 disabled:opacity-50"
                >
                  {savingEdit ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: KONFIRMASI HAPUS GTK */}
      {teacherToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6">
              <div className="flex items-center gap-3 text-rose-600 mb-3">
                <div className="rounded-xl bg-rose-100 p-2">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus GTK</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus data GTK{' '}
                <strong className="font-semibold text-slate-900">
                  {teacherToDelete.nama}, {teacherToDelete.gelar}
                </strong>{' '}
                (NIP: {teacherToDelete.nip})? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-3">
              <button
                type="button"
                onClick={() => setTeacherToDelete(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteTeacher}
                disabled={deleting}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {deleting ? 'Menghapus...' : 'Hapus Data'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL UPLOAD FOTO PROFIL GURU (A6.9) */}
      {photoUploadTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Upload Foto Profil Guru (A6.9)</h3>
                  <p className="text-[11px] text-slate-500 font-mono">NIP: {photoUploadTeacher.nip}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPhotoUploadTeacher(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-5 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <div className="w-28 h-28 rounded-full bg-white border border-slate-200 shadow-inner flex items-center justify-center overflow-hidden mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoPreview || photoUploadTeacher.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                  alt={photoUploadTeacher.nama}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-bold text-slate-900">{photoUploadTeacher.nama}, {photoUploadTeacher.gelar}</span>
              <span className="text-[11px] text-sky-700 font-medium">{photoUploadTeacher.mataPelajaran}</span>
            </div>

            <div className="space-y-3">
              <label className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition shadow-xs">
                <Upload className="w-4 h-4 text-sky-600" />
                <span>{photoFile ? photoFile.name : 'Pilih File Foto Baru...'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleSelectPhoto}
                  disabled={isUploadingPhoto}
                />
              </label>

              <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                Format didukung: JPG, PNG, WebP (Maks. 2 MB). Foto identitas resmi pendidik SMAN 20 Kab. Tangerang.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isUploadingPhoto}
                onClick={() => setPhotoUploadTeacher(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!photoFile || isUploadingPhoto}
                onClick={handleUploadPhoto}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 disabled:opacity-50 transition cursor-pointer flex items-center gap-1.5"
              >
                {isUploadingPhoto ? 'Mengunggah...' : 'Simpan Foto Guru'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL IMPORT EXCEL DATA GURU (A6.8) */}
      <ExcelImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Data Guru dari Excel / CSV (A6.8)"
        subtitle="Sinkronisasi massal data tenaga pendidik, mata pelajaran, dan NIP/NUPTK resmi"
        templateUrl="/api/guru/import-excel"
        templateFilename="template-import-guru-sman20.xlsx"
        uploadEndpoint="/api/guru/import-excel"
        sampleColumns={['NIP', 'Nama Lengkap', 'Mata Pelajaran', 'Status Kepegawaian', 'Jenis Kelamin', 'Email']}
        onImportSuccess={() => fetchTeachers()}
      />
    </DashboardShell>
  );
}
