'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
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
  Building2,
  Navigation,
  X,
  FileSpreadsheet,
  Camera,
  Upload,
  ArrowLeftRight,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { ExcelImportModal } from '@/components/common/ExcelImportModal';
import { cn } from '@/lib/utils';

export interface StudentItem {
  id: string;
  userId: string;
  nama: string;
  nis: string;
  nisn: string;
  nik: string;
  noKk: string;
  tempatLahir: string;
  tanggalLahir: string;
  noAktaLahir: string;
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
  kelasId: string;
  kelasNama: string;
  tingkat: string;
  jenisKelamin: 'LAKI_LAKI' | 'PEREMPUAN';
  username: string;
  email: string;
  avatar?: string | null;
  status: string;
}

export interface ClassOption {
  id: string;
  nama: string;
  tingkat: string;
  jumlahMurid: number;
}

const AGAMA_OPTIONS = [
  { value: 'ISLAM', label: 'Islam' },
  { value: 'KRISTEN_PROTESTAN', label: 'Kristen Protestan' },
  { value: 'KATOLIK', label: 'Katolik' },
  { value: 'HINDU', label: 'Hindu' },
  { value: 'BUDDHA', label: 'Buddha' },
  { value: 'KHONGHUCU', label: 'Khonghucu' },
  { value: 'PENGHAYAT_KEPERCAYAAN', label: 'Penghayat Kepercayaan' },
];

export default function MuridPage() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [selectedTingkat, setSelectedTingkat] = useState<string>('ALL');
  const [selectedKelasId, setSelectedKelasId] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);
  const [profileTab, setProfileTab] = useState<'pokok' | 'kelahiran' | 'alamat'>('pokok');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalTab, setAddModalTab] = useState<'pokok' | 'kelahiran' | 'alamat'>('pokok');

  const [studentToEdit, setStudentToEdit] = useState<StudentItem | null>(null);
  const [editModalTab, setEditModalTab] = useState<'pokok' | 'kelahiran' | 'alamat'>('pokok');

  const [studentToDelete, setStudentToDelete] = useState<StudentItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Import Excel & Photo Upload States (A5.10 & A5.12)
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDapodikMenu, setShowDapodikMenu] = useState(false);
  const [showRombelMenu, setShowRombelMenu] = useState(false);
  const [photoUploadStudent, setPhotoUploadStudent] = useState<StudentItem | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Form Tambah Murid State
  const [newFormData, setNewFormData] = useState({
    nama: '',
    jenisKelamin: 'LAKI_LAKI' as 'LAKI_LAKI' | 'PEREMPUAN',
    kelasId: 'kls-x-1',
    nisn: '',
    nis: '',
    nik: '',
    noKk: '',
    tempatLahir: 'Tangerang',
    tanggalLahir: '2008-05-15',
    noAktaLahir: '',
    agama: 'ISLAM',
    jalan: '',
    rtRw: '001/002',
    kelurahan: 'Pakuhaji',
    kecamatan: 'Pakuhaji',
    kabupaten: 'Kabupaten Tangerang',
    provinsi: 'Banten',
    kodePos: '15570',
    lintang: '-6.124567',
    bujur: '106.125678',
  });
  const [savingNew, setSavingNew] = useState(false);

  // Form Edit Murid State
  const [editFormData, setEditFormData] = useState({
    id: '',
    nama: '',
    jenisKelamin: 'LAKI_LAKI' as 'LAKI_LAKI' | 'PEREMPUAN',
    kelasId: '',
    nisn: '',
    nis: '',
    nik: '',
    noKk: '',
    tempatLahir: '',
    tanggalLahir: '',
    noAktaLahir: '',
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
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Fetch daftar rombel kelas
  useEffect(() => {
    async function loadClasses() {
      try {
        const res = await fetch('/api/kelas');
        const json = await res.json();
        if (json.success && json.data) {
          setClasses(json.data);
          if (json.data.length > 0 && !newFormData.kelasId) {
            setNewFormData((prev) => ({ ...prev, kelasId: json.data[0].id }));
          }
        }
      } catch (err) {
        console.error('Gagal memuat kelas:', err);
      }
    }
    loadClasses();
  }, []);

  // Fetch data murid
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedKelasId !== 'ALL') params.set('kelasId', selectedKelasId);
      else if (selectedTingkat !== 'ALL') params.set('tingkat', selectedTingkat);
      params.set('page', String(page));
      params.set('limit', '25');

      const res = await fetch(`/api/murid?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setStudents(json.data);
        setTotalCount(json.total);
        setTotalPages(json.totalPages || 1);
      }
    } catch (err) {
      console.error('Gagal memuat data murid:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, selectedTingkat, selectedKelasId, page]);

  // Handle Tambah Murid
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormData.nama || !newFormData.nis || !newFormData.kelasId) {
      alert('Nama lengkap, NIS, dan Pilihan Kelas wajib diisi.');
      return;
    }

    setSavingNew(true);
    try {
      const res = await fetch('/api/murid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFormData),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`Murid "${newFormData.nama}" berhasil didaftarkan! (Username: murid_${newFormData.nis}, Password: Masuk123!)`);
        setShowAddModal(false);
        // Reset form
        setNewFormData({
          nama: '',
          jenisKelamin: 'LAKI_LAKI',
          kelasId: classes[0]?.id || 'kls-x-1',
          nisn: '',
          nis: '',
          nik: '',
          noKk: '',
          tempatLahir: 'Tangerang',
          tanggalLahir: '2008-05-15',
          noAktaLahir: '',
          agama: 'ISLAM',
          jalan: '',
          rtRw: '001/002',
          kelurahan: 'Pakuhaji',
          kecamatan: 'Pakuhaji',
          kabupaten: 'Kabupaten Tangerang',
          provinsi: 'Banten',
          kodePos: '15570',
          lintang: '-6.124567',
          bujur: '106.125678',
        });
        setAddModalTab('pokok');
        fetchStudents();
      } else {
        alert(json.message || 'Gagal menambahkan murid.');
      }
    } catch {
      alert('Terjadi kendala koneksi ke server.');
    } finally {
      setSavingNew(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (student: StudentItem) => {
    setStudentToEdit(student);
    setEditFormData({
      id: student.id,
      nama: student.nama,
      jenisKelamin: student.jenisKelamin,
      kelasId: student.kelasId,
      nisn: student.nisn || '',
      nis: student.nis || '',
      nik: student.nik || '',
      noKk: student.noKk || '',
      tempatLahir: student.tempatLahir || 'Tangerang',
      tanggalLahir: student.tanggalLahir || '2008-01-01',
      noAktaLahir: student.noAktaLahir || '',
      agama: student.agama || 'ISLAM',
      jalan: student.jalan || '',
      rtRw: student.rtRw || '001/001',
      kelurahan: student.kelurahan || 'Pakuhaji',
      kecamatan: student.kecamatan || 'Pakuhaji',
      kabupaten: student.kabupaten || 'Kabupaten Tangerang',
      provinsi: student.provinsi || 'Banten',
      kodePos: student.kodePos || '15570',
      lintang: student.lintang ? String(student.lintang) : '-6.124567',
      bujur: student.bujur ? String(student.bujur) : '106.125678',
    });
    setEditModalTab('pokok');
  };

  // Handle Update Murid
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.id || !editFormData.nama) {
      alert('Data tidak valid.');
      return;
    }

    setSavingEdit(true);
    try {
      const res = await fetch('/api/murid', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`Data identitas murid "${editFormData.nama}" berhasil diperbarui.`);
        setStudentToEdit(null);
        if (selectedStudent && selectedStudent.id === editFormData.id) {
          setSelectedStudent((prev) =>
            prev
              ? {
                  ...prev,
                  ...editFormData,
                  lintang: parseFloat(editFormData.lintang) || prev.lintang,
                  bujur: parseFloat(editFormData.bujur) || prev.bujur,
                  kelasNama:
                    classes.find((c) => c.id === editFormData.kelasId)?.nama ||
                    prev.kelasNama,
                }
              : null
          );
        }
        fetchStudents();
      } else {
        alert(json.message || 'Gagal memperbarui data murid.');
      }
    } catch {
      alert('Terjadi kesalahan koneksi server.');
    } finally {
      setSavingEdit(false);
    }
  };

  // Handle Delete Murid
  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/murid?id=${studentToDelete.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();

      if (json.success) {
        showToast(`Murid "${studentToDelete.nama}" berhasil dihapus dari sistem.`);
        if (selectedStudent?.id === studentToDelete.id) {
          setSelectedStudent(null);
        }
        setStudentToDelete(null);
        fetchStudents();
      } else {
        alert(json.message || 'Gagal menghapus data murid.');
      }
    } catch {
      alert('Gagal menghubungi server untuk menghapus murid.');
    } finally {
      setDeleting(false);
    }
  };

  // Handle Export CSV
  const handleExportCSV = () => {
    if (students.length === 0) {
      alert('Tidak ada data murid untuk diekspor.');
      return;
    }

    const headers = [
      'No',
      'Nama Lengkap',
      'Jenis Kelamin',
      'NISN',
      'NIS',
      'NIK',
      'No Kartu Keluarga',
      'Tempat Lahir',
      'Tanggal Lahir',
      'No Registrasi Akta',
      'Agama',
      'Rombel Kelas',
      'Tingkat',
      'Alamat Jalan',
      'RT/RW',
      'Kelurahan/Desa',
      'Kecamatan',
      'Kabupaten/Kota',
      'Provinsi',
      'Kode Pos',
      'Lintang (GPS)',
      'Bujur (GPS)',
      'Username Login',
      'Email Siswa',
    ];

    const rows = students.map((s, idx) => [
      idx + 1,
      `"${s.nama.replace(/"/g, '""')}"`,
      s.jenisKelamin === 'LAKI_LAKI' ? 'Laki-Laki' : 'Perempuan',
      `'${s.nisn}`,
      `'${s.nis}`,
      `'${s.nik || '-'}`,
      `'${s.noKk || '-'}`,
      `"${s.tempatLahir || '-'}"`,
      s.tanggalLahir || '-',
      `"${s.noAktaLahir || '-'}"`,
      s.agama || '-',
      `"${s.kelasNama}"`,
      s.tingkat,
      `"${(s.jalan || '-').replace(/"/g, '""')}"`,
      `"${s.rtRw || '-'}"`,
      `"${s.kelurahan || '-'}"`,
      `"${s.kecamatan || '-'}"`,
      `"${s.kabupaten || '-'}"`,
      `"${s.provinsi || '-'}"`,
      s.kodePos || '-',
      s.lintang ?? '-',
      s.bujur ?? '-',
      s.username,
      s.email,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Daftar_Murid_SMAN20_Dapodik_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('File CSV data identitas murid berhasil diunduh.');
  };

  // Helper geolocation
  const handleGetLocation = (setter: (updater: (prev: any) => any) => void) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setter((prev: any) => ({
            ...prev,
            lintang: pos.coords.latitude.toFixed(6),
            bujur: pos.coords.longitude.toFixed(6),
          }));
          showToast(`Koordinat GPS berhasil diperoleh: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
        },
        (err) => {
          alert(`Gagal mengambil koordinat: ${err.message}. Pastikan izin lokasi browser aktif.`);
        }
      );
    } else {
      alert('Browser tidak mendukung geolokasi GPS.');
    }
  };

  const handleSelectPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file foto melebihi batas 2 MB.');
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleUploadPhoto = async () => {
    if (!photoUploadStudent || !photoFile) return;
    setIsUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('studentId', photoUploadStudent.id);
      formData.append('photo', photoFile);

      const res = await fetch('/api/murid/upload-foto', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.avatarUrl) {
        setStudents((prev) =>
          prev.map((s) => (s.id === photoUploadStudent.id ? { ...s, avatar: data.avatarUrl } : s))
        );
        showToast(`Foto resmi murid "${photoUploadStudent.nama}" berhasil diperbarui!`);
        setPhotoUploadStudent(null);
        setPhotoFile(null);
        setPhotoPreview(null);
      } else {
        alert(data.message || 'Gagal mengunggah foto murid.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan saat mengunggah foto murid.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Filter daftar kelas di dropdown sesuai Tingkat yang dipilih
  const availableClasses = useMemo(() => {
    if (selectedTingkat === 'ALL') return classes;
    return classes.filter((c) => c.tingkat === selectedTingkat);
  }, [classes, selectedTingkat]);

  return (
    <DashboardShell>
      <div className="space-y-6 pb-12 font-sans">
        {/* Header Halaman */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                Dapodik Master SMAN 20
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-900 border border-brand-200">
                <Building2 className="w-3 h-3 text-brand-700" />
                30 Rombel Kelas (X, XI, XII)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Identitas & Data Murid
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-3xl">
              Pengelolaan biodata kependudukan lengkap siswa (NIK, KK, Akta Lahir, Agama, Alamat Domisili, dan Titik Koordinat GPS Rumah) sesuai regulasi Permendikdasmen & Kurikulum Merdeka.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
            {/* Backdrop click dismisser */}
            {(showDapodikMenu || showRombelMenu) && (
              <div
                className="fixed inset-0 z-20 cursor-default"
                onClick={() => {
                  setShowDapodikMenu(false);
                  setShowRombelMenu(false);
                }}
              />
            )}

            {/* Menu 1: Dapodik & Export/Import */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowDapodikMenu((v) => !v);
                  setShowRombelMenu(false);
                }}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition shadow-xs cursor-pointer active:scale-95',
                  showDapodikMenu
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-300/40'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Dapodik</span>
                <ChevronDown
                  className={cn(
                    'w-3.5 h-3.5 text-slate-400 transition-transform duration-200',
                    showDapodikMenu && 'rotate-180 text-emerald-700'
                  )}
                />
              </button>

              {showDapodikMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/10 p-1.5 z-30 animate-in fade-in-50 zoom-in-95">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDapodikMenu(false);
                      setShowImportModal(true);
                    }}
                    className="w-full flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-emerald-50 text-left transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">
                        Import Excel Dapodik
                      </div>
                      <div className="text-[11px] text-slate-500">Unggah master data murid (A5.10)</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowDapodikMenu(false);
                      handleExportCSV();
                    }}
                    className="w-full flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-left transition group cursor-pointer border-t border-slate-100 mt-1 pt-2"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Unduh Format CSV</div>
                      <div className="text-[11px] text-slate-500">Ekspor master data biodata siswa</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Menu 2: Kelola Rombel & Kenaikan */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowRombelMenu((v) => !v);
                  setShowDapodikMenu(false);
                }}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition shadow-xs cursor-pointer active:scale-95',
                  showRombelMenu
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-300/40'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Kelola Rombel</span>
                <ChevronDown
                  className={cn(
                    'w-3.5 h-3.5 text-slate-400 transition-transform duration-200',
                    showRombelMenu && 'rotate-180 text-indigo-700'
                  )}
                />
              </button>

              {showRombelMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/10 p-1.5 z-30 animate-in fade-in-50 zoom-in-95">
                  <Link
                    href="/murid/kenaikan-kelas"
                    onClick={() => setShowRombelMenu(false)}
                    className="w-full flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-indigo-50 text-left transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-900 flex items-center gap-1.5">
                        Wisaya Kenaikan Kelas
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-200/70 text-indigo-800 font-bold">
                          Mode Pro
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">Otomasi kenaikan rombel & kelulusan</div>
                    </div>
                  </Link>

                  <Link
                    href="/murid/mutasi"
                    onClick={() => setShowRombelMenu(false)}
                    className="w-full flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-amber-50 text-left transition group border-t border-slate-100 mt-1 pt-2"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <ArrowLeftRight className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-amber-900">
                        Mutasi Murid (A5.9)
                      </div>
                      <div className="text-[11px] text-slate-500">Pindah rombel antar-kelas atau mutasi</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Menu 3: Primary CTA Tambah Murid Baru */}
            <button
              type="button"
              onClick={() => {
                setAddModalTab('pokok');
                setShowAddModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-900 via-brand-800 to-emerald-700 text-white text-xs font-bold shadow-md shadow-brand-900/15 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-brand-600 transition cursor-pointer active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Murid</span>
            </button>
          </div>
        </div>

        {/* Toast Notifikasi Sukses */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs font-medium text-emerald-900 animate-in fade-in duration-200 shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-950 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Kartu Ringkasan Metrik Data Murid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Total Murid</span>
              <span className="text-lg font-black text-slate-900">{totalCount} Siswa</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-sky-700" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Rombel Aktif</span>
              <span className="text-lg font-black text-slate-900">30 Kelas</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Kependudukan (NIK/KK)</span>
              <span className="text-lg font-black text-purple-900">100% Lengkap</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Geotagging Titik GPS</span>
              <span className="text-lg font-black text-amber-900">100% Terpetakan</span>
            </div>
          </div>
        </div>

        {/* Filter Bar & Controls */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari berdasarkan nama, NISN, NIS, atau NIK..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white transition"
              />
            </div>

            {/* Dropdown Filter Kelas */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 shrink-0">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-600">Rombel:</span>
              </div>
              <select
                value={selectedKelasId}
                onChange={(e) => {
                  setSelectedKelasId(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:ring-2 focus:ring-brand-600 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua Rombel (30 Kelas)</option>
                {availableClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    Kelas {c.nama} ({c.jumlahMurid} Murid)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Tingkat Selector Pills */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
              Tingkat:
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedTingkat('ALL');
                setSelectedKelasId('ALL');
                setPage(1);
              }}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer',
                selectedTingkat === 'ALL'
                  ? 'bg-brand-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              Semua Tingkat ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTingkat('X');
                setSelectedKelasId('ALL');
                setPage(1);
              }}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer',
                selectedTingkat === 'X'
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              Kelas X (10 Kelas)
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTingkat('XI');
                setSelectedKelasId('ALL');
                setPage(1);
              }}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer',
                selectedTingkat === 'XI'
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              Kelas XI (10 Kelas)
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTingkat('XII');
                setSelectedKelasId('ALL');
                setPage(1);
              }}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer',
                selectedTingkat === 'XII'
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              Kelas XII (10 Kelas)
            </button>
          </div>
        </div>

        {/* Tabel Data Murid (Read View) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-50/70 shadow-[0_1px_0_0_#f1f5f9]">
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4">Murid (Identitas Pokok)</th>
                  <th className="py-3.5 px-4">Kependudukan (NIK / KK)</th>
                  <th className="py-3.5 px-4">NISN / NIS</th>
                  <th className="py-3.5 px-4">Rombel</th>
                  <th className="py-3.5 px-4">Kelahiran & Agama</th>
                  <th className="py-3.5 px-4">Domisili & GPS</th>
                  <th className="py-3.5 px-4 text-center w-36">Aksi CRUD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                        <span className="font-semibold">Memuat Data Murid...</span>
                      </div>
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                      Tidak ditemukan murid yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  students.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-brand-50/40 transition-colors group"
                    >
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                        {(page - 1) * 25 + index + 1}
                      </td>

                      {/* Profil & Nama */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            onClick={() => {
                              setPhotoUploadStudent(item);
                              setPhotoFile(null);
                              setPhotoPreview(null);
                            }}
                            className="relative w-10 h-10 rounded-xl overflow-hidden ring-1 ring-slate-200 shrink-0 cursor-pointer group/avatar"
                            title="Klik untuk ganti / upload foto resmi murid (A5.12)"
                          >
                            <img
                              src={
                                item.avatar ||
                                'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
                              }
                              alt={item.nama}
                              className="w-full h-full object-cover transition-transform group-hover/avatar:scale-105"
                            />
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Camera className="w-4 h-4" />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 group-hover:text-brand-900 transition">
                                {item.nama}
                              </span>
                              <span
                                className={cn(
                                  'px-1.5 py-0.2 rounded text-[10px] font-black',
                                  item.jenisKelamin === 'LAKI_LAKI'
                                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                )}
                              >
                                {item.jenisKelamin === 'LAKI_LAKI' ? 'L' : 'P'}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono block">
                              @{item.username}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* NIK & KK */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono space-y-0.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
                            <CreditCard className="w-3 h-3 text-slate-500" />
                            {item.nik || '-'}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            KK: {item.noKk || '-'}
                          </span>
                        </div>
                      </td>

                      {/* NISN / NIS */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono">
                          <span className="font-bold text-emerald-800 block">{item.nisn}</span>
                          <span className="text-[11px] text-slate-400">NIS: {item.nis}</span>
                        </div>
                      </td>

                      {/* Rombel Kelas */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-brand-50 text-brand-900 font-bold text-xs border border-brand-200">
                          {item.kelasNama}
                        </span>
                      </td>

                      {/* Kelahiran & Agama */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs">
                          <span className="font-medium text-slate-800 block">
                            {item.tempatLahir}, {item.tanggalLahir}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase">
                            {item.agama || 'Islam'} • Akta: {item.noAktaLahir ? item.noAktaLahir.slice(0, 12) + '...' : '-'}
                          </span>
                        </div>
                      </td>

                      {/* Domisili & Titik GPS */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs">
                          <span className="font-medium text-slate-700 block truncate max-w-[150px]">
                            {item.kelurahan}, {item.kecamatan}
                          </span>
                          <div className="flex items-center gap-1 text-[10px] text-amber-700 font-mono mt-0.5">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span>{item.lintang ? `${item.lintang.toFixed(4)}, ${item.bujur?.toFixed(4)}` : 'Belum diisi'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Tombol Aksi CRUD Lengkap */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* 1. View 360 */}
                          <button
                            type="button"
                            title="Tinjau Profil 360°"
                            onClick={() => {
                              setSelectedStudent(item);
                              setProfileTab('pokok');
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-brand-100 text-slate-600 hover:text-brand-900 transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* 2. Edit */}
                          <button
                            type="button"
                            title="Edit Data Identitas Murid"
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* 3. Delete */}
                          <button
                            type="button"
                            title="Hapus Murid"
                            onClick={() => setStudentToDelete(item)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer"
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

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              Menampilkan <b>{students.length}</b> dari <b>{totalCount}</b> murid
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                <button
                  key={pNum}
                  type="button"
                  onClick={() => setPage(pNum)}
                  className={cn(
                    'min-w-8 h-8 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center',
                    page === pNum
                      ? 'bg-brand-900 text-white shadow-xs'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {pNum}
                </button>
              ))}

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="Halaman Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MODAL 1: PROFIL MURID 360° (READ COMPREHENSIVE VIEW)     */}
        {/* ======================================================== */}
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xl relative space-y-5 max-h-[92vh] overflow-y-auto">
              {/* Header Modal */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                    Profil Siswa 360°
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-500 font-mono">
                    ID: {selectedStudent.id}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition"
                >
                  ✕
                </button>
              </div>

              {/* Identity Banner */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-brand-50/30 to-emerald-50/40 border border-slate-200/80">
                <img
                  src={
                    selectedStudent.avatar ||
                    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
                  }
                  alt={selectedStudent.nama}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-600/30 shadow-md shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-brand-900 text-white font-bold text-xs">
                      Kelas {selectedStudent.kelasNama}
                    </span>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-md text-xs font-bold',
                        selectedStudent.jenisKelamin === 'LAKI_LAKI'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-rose-100 text-rose-800'
                      )}
                    >
                      {selectedStudent.jenisKelamin === 'LAKI_LAKI' ? 'Laki-Laki (L)' : 'Perempuan (P)'}
                    </span>
                    <span className="text-xs text-emerald-700 font-bold">● Aktif</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-1 truncate">
                    {selectedStudent.nama}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    NISN: {selectedStudent.nisn} • NIS: {selectedStudent.nis}
                  </p>
                </div>
              </div>

              {/* Tab Navigation dalam Profil 360 */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button
                  type="button"
                  onClick={() => setProfileTab('pokok')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5',
                    profileTab === 'pokok'
                      ? 'bg-brand-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Kependudukan & Akun</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileTab('kelahiran')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5',
                    profileTab === 'kelahiran'
                      ? 'bg-brand-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Kelahiran & Agama</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileTab('alamat')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5',
                    profileTab === 'alamat'
                      ? 'bg-brand-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Alamat & Titik Koordinat</span>
                </button>
              </div>

              {/* Tab Content */}
              {profileTab === 'pokok' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] text-slate-400 block mb-0.5">NIK (Kependudukan 16 Digit):</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {selectedStudent.nik || '-'}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] text-slate-400 block mb-0.5">Nomor Kartu Keluarga (KK):</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {selectedStudent.noKk || '-'}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] text-slate-400 block mb-0.5">NISN Kemdikdasmen:</span>
                      <span className="font-mono font-bold text-emerald-800 text-sm">
                        {selectedStudent.nisn}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] text-slate-400 block mb-0.5">NIS Sekolah:</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {selectedStudent.nis}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] text-slate-400 block mb-0.5">Username Login:</span>
                      <span className="font-mono font-bold text-brand-900">
                        @{selectedStudent.username}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] text-slate-400 block mb-0.5">Password Default:</span>
                      <span className="font-mono font-bold text-brand-700">Masuk123!</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-brand-50/60 border border-brand-200/80 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-brand-900 mb-1">
                      <ShieldCheck className="w-4 h-4 text-brand-700" />
                      <span>Validasi Dokumen Kependudukan</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Siswa telah tervalidasi dengan data Disdukcapil Kabupaten Tangerang. Akun SSO aktif untuk absensi GPS dan mobile app.
                    </p>
                  </div>
                </div>
              )}

              {profileTab === 'kelahiran' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] text-slate-400 block mb-0.5">Tempat Lahir:</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {selectedStudent.tempatLahir || '-'}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] text-slate-400 block mb-0.5">Tanggal Lahir:</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {selectedStudent.tanggalLahir || '-'}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 col-span-2">
                      <span className="text-[11px] text-slate-400 block mb-0.5">Nomor Registrasi Akta Lahir:</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {selectedStudent.noAktaLahir || '-'}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 col-span-2">
                      <span className="text-[11px] text-slate-400 block mb-0.5">Agama atau Kepercayaan:</span>
                      <span className="font-bold text-emerald-800 text-sm uppercase">
                        {selectedStudent.agama || 'ISLAM'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {profileTab === 'alamat' && (
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Jalan / Dusun:</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {selectedStudent.jalan || '-'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200/60">
                      <div>
                        <span className="text-[10px] text-slate-400 block">RT / RW:</span>
                        <span className="font-semibold text-slate-800">{selectedStudent.rtRw || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Kelurahan/Desa:</span>
                        <span className="font-semibold text-slate-800">{selectedStudent.kelurahan || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Kecamatan:</span>
                        <span className="font-semibold text-slate-800">{selectedStudent.kecamatan || '-'}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200/60">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Kabupaten/Kota:</span>
                        <span className="font-semibold text-slate-800">{selectedStudent.kabupaten || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Provinsi:</span>
                        <span className="font-semibold text-slate-800">{selectedStudent.provinsi || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Kode Pos:</span>
                        <span className="font-semibold text-slate-800 font-mono">{selectedStudent.kodePos || '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Geotagging & Maps Link */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900">
                        <Navigation className="w-4 h-4 text-amber-700" />
                        <span>Titik Koordinat Lokasi Rumah (GPS)</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                        {selectedStudent.lintang ? `${selectedStudent.lintang.toFixed(6)}, ${selectedStudent.bujur?.toFixed(6)}` : 'Belum Terpetakan'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://www.google.com/maps?q=${selectedStudent.lintang},${selectedStudent.bujur}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 font-bold text-amber-900 hover:bg-amber-100 transition shadow-xs text-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
                        <span>Buka di Google Maps</span>
                      </a>

                      <a
                        href={`https://www.openstreetmap.org/?mlat=${selectedStudent.lintang}&mlon=${selectedStudent.bujur}#map=16/${selectedStudent.lintang}/${selectedStudent.bujur}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 font-bold text-slate-800 hover:bg-slate-50 transition shadow-xs text-xs"
                      >
                        <Compass className="w-3.5 h-3.5 text-slate-600" />
                        <span>OpenStreetMap</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setStudentToDelete(selectedStudent);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 border border-rose-200 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Murid</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      openEditModal(selectedStudent);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit Profil</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL 2: TAMBAH MURID BARU (CREATE)                      */}
        {/* ======================================================== */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xl relative space-y-5 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Pendaftaran Identitas Murid Baru</h3>
                  <p className="text-xs text-slate-500">Lengkapi data pokok, NIK, KK, akta lahir, dan alamat domisili untuk Dapodik SMAN 20</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Tab Header Modal Tambah */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button
                  type="button"
                  onClick={() => setAddModalTab('pokok')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5',
                    addModalTab === 'pokok'
                      ? 'bg-brand-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>1. Identitas Pokok & Rombel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAddModalTab('kelahiran')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5',
                    addModalTab === 'kelahiran'
                      ? 'bg-brand-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>2. Kelahiran & Agama</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAddModalTab('alamat')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5',
                    addModalTab === 'alamat'
                      ? 'bg-brand-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>3. Alamat & Titik GPS</span>
                </button>
              </div>

              <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
                {/* TAB 1: POKOK */}
                {addModalTab === 'pokok' && (
                  <div className="space-y-3.5">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Murid *</label>
                      <input
                        type="text"
                        required
                        value={newFormData.nama}
                        onChange={(e) => setNewFormData({ ...newFormData, nama: e.target.value })}
                        placeholder="Contoh: Muhammad Rizki Pratama"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                        <select
                          value={newFormData.jenisKelamin}
                          onChange={(e) => setNewFormData({ ...newFormData, jenisKelamin: e.target.value as any })}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none bg-white"
                        >
                          <option value="LAKI_LAKI">Laki-Laki (L)</option>
                          <option value="PEREMPUAN">Perempuan (P)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Pilihan Rombel Kelas *</label>
                        <select
                          value={newFormData.kelasId}
                          onChange={(e) => setNewFormData({ ...newFormData, kelasId: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none bg-white"
                        >
                          {classes.map((c) => (
                            <option key={c.id} value={c.id}>
                              Kelas {c.nama} ({c.tingkat})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">NISN (10 Digit)</label>
                        <input
                          type="text"
                          maxLength={10}
                          value={newFormData.nisn}
                          onChange={(e) => setNewFormData({ ...newFormData, nisn: e.target.value })}
                          placeholder="0081234567"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">NIS Sekolah (6 Digit) *</label>
                        <input
                          type="text"
                          required
                          value={newFormData.nis}
                          onChange={(e) => setNewFormData({ ...newFormData, nis: e.target.value })}
                          placeholder="260151"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">NIK Kependudukan (16 Digit)</label>
                        <input
                          type="text"
                          maxLength={16}
                          value={newFormData.nik}
                          onChange={(e) => setNewFormData({ ...newFormData, nik: e.target.value })}
                          placeholder="3603120101080001"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Nomor Kartu Keluarga (KK)</label>
                        <input
                          type="text"
                          maxLength={16}
                          value={newFormData.noKk}
                          onChange={(e) => setNewFormData({ ...newFormData, noKk: e.target.value })}
                          placeholder="3603120101080002"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: KELAHIRAN & AGAMA */}
                {addModalTab === 'kelahiran' && (
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Tempat Lahir</label>
                        <input
                          type="text"
                          value={newFormData.tempatLahir}
                          onChange={(e) => setNewFormData({ ...newFormData, tempatLahir: e.target.value })}
                          placeholder="Tangerang"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                        <input
                          type="date"
                          value={newFormData.tanggalLahir}
                          onChange={(e) => setNewFormData({ ...newFormData, tanggalLahir: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">No. Registrasi Akta Lahir</label>
                      <input
                        type="text"
                        value={newFormData.noAktaLahir}
                        onChange={(e) => setNewFormData({ ...newFormData, noAktaLahir: e.target.value })}
                        placeholder="Contoh: 3603-LT-12052008-0021"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Agama / Kepercayaan</label>
                      <select
                        value={newFormData.agama}
                        onChange={(e) => setNewFormData({ ...newFormData, agama: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none bg-white font-semibold"
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

                {/* TAB 3: ALAMAT & TITIK GPS */}
                {addModalTab === 'alamat' && (
                  <div className="space-y-3.5">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Alamat Jalan / Dusun</label>
                      <input
                        type="text"
                        value={newFormData.jalan}
                        onChange={(e) => setNewFormData({ ...newFormData, jalan: e.target.value })}
                        placeholder="Contoh: Jl. Raya Pakuhaji No. 45"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">RT / RW</label>
                        <input
                          type="text"
                          value={newFormData.rtRw}
                          onChange={(e) => setNewFormData({ ...newFormData, rtRw: e.target.value })}
                          placeholder="001/002"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Kelurahan / Desa</label>
                        <input
                          type="text"
                          value={newFormData.kelurahan}
                          onChange={(e) => setNewFormData({ ...newFormData, kelurahan: e.target.value })}
                          placeholder="Pakuhaji"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Kecamatan</label>
                        <input
                          type="text"
                          value={newFormData.kecamatan}
                          onChange={(e) => setNewFormData({ ...newFormData, kecamatan: e.target.value })}
                          placeholder="Pakuhaji"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Kabupaten / Kota</label>
                        <input
                          type="text"
                          value={newFormData.kabupaten}
                          onChange={(e) => setNewFormData({ ...newFormData, kabupaten: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Provinsi</label>
                        <input
                          type="text"
                          value={newFormData.provinsi}
                          onChange={(e) => setNewFormData({ ...newFormData, provinsi: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Kode Pos</label>
                        <input
                          type="text"
                          value={newFormData.kodePos}
                          onChange={(e) => setNewFormData({ ...newFormData, kodePos: e.target.value })}
                          placeholder="15570"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    {/* Koordinat GPS */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-amber-700" />
                          Titik Koordinat Lokasi Rumah (GPS Lintang & Bujur)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleGetLocation(setNewFormData)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 font-bold hover:bg-amber-100 transition shadow-xs text-[11px] flex items-center gap-1"
                        >
                          <Compass className="w-3 h-3 text-amber-700" />
                          <span>Ambil GPS Saya</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Lintang (Latitude)</label>
                          <input
                            type="text"
                            value={newFormData.lintang}
                            onChange={(e) => setNewFormData({ ...newFormData, lintang: e.target.value })}
                            placeholder="-6.124567"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Bujur (Longitude)</label>
                          <input
                            type="text"
                            value={newFormData.bujur}
                            onChange={(e) => setNewFormData({ ...newFormData, bujur: e.target.value })}
                            placeholder="106.125678"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                  ℹ️ Akun login otomatis dibuatkan dengan format: <b>@murid_[NIS]</b> dan kata sandi awal: <b>Masuk123!</b>
                </div>

                {/* Footer Modal Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    {addModalTab !== 'pokok' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (addModalTab === 'alamat') setAddModalTab('kelahiran');
                          else if (addModalTab === 'kelahiran') setAddModalTab('pokok');
                        }}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition"
                      >
                        ← Sebelumnya
                      </button>
                    )}
                    {addModalTab !== 'alamat' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (addModalTab === 'pokok') setAddModalTab('kelahiran');
                          else if (addModalTab === 'kelahiran') setAddModalTab('alamat');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition"
                      >
                        Selanjutnya →
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={savingNew}
                      className="px-5 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold shadow-md shadow-brand-900/15 disabled:opacity-50 transition cursor-pointer"
                    >
                      {savingNew ? 'Menyimpan...' : 'Simpan Murid'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL 3: EDIT DATA MURID (UPDATE)                        */}
        {/* ======================================================== */}
        {studentToEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xl relative space-y-5 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Perbarui Identitas Murid</h3>
                  <p className="text-xs text-slate-500">Edit data identitas, kependudukan, atau lokasi GPS murid</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStudentToEdit(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Tab Header Modal Edit */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button
                  type="button"
                  onClick={() => setEditModalTab('pokok')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5',
                    editModalTab === 'pokok'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>1. Identitas Pokok & Rombel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditModalTab('kelahiran')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5',
                    editModalTab === 'kelahiran'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>2. Kelahiran & Agama</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditModalTab('alamat')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5',
                    editModalTab === 'alamat'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>3. Alamat & Titik GPS</span>
                </button>
              </div>

              <form onSubmit={handleUpdateStudent} className="space-y-4 text-xs">
                {/* TAB 1: POKOK */}
                {editModalTab === 'pokok' && (
                  <div className="space-y-3.5">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Murid *</label>
                      <input
                        type="text"
                        required
                        value={editFormData.nama}
                        onChange={(e) => setEditFormData({ ...editFormData, nama: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                        <select
                          value={editFormData.jenisKelamin}
                          onChange={(e) => setEditFormData({ ...editFormData, jenisKelamin: e.target.value as any })}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none bg-white"
                        >
                          <option value="LAKI_LAKI">Laki-Laki (L)</option>
                          <option value="PEREMPUAN">Perempuan (P)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Pilihan Rombel Kelas *</label>
                        <select
                          value={editFormData.kelasId}
                          onChange={(e) => setEditFormData({ ...editFormData, kelasId: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none bg-white"
                        >
                          {classes.map((c) => (
                            <option key={c.id} value={c.id}>
                              Kelas {c.nama} ({c.tingkat})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">NISN (10 Digit)</label>
                        <input
                          type="text"
                          maxLength={10}
                          value={editFormData.nisn}
                          onChange={(e) => setEditFormData({ ...editFormData, nisn: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">NIS Sekolah</label>
                        <input
                          type="text"
                          value={editFormData.nis}
                          onChange={(e) => setEditFormData({ ...editFormData, nis: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">NIK Kependudukan (16 Digit)</label>
                        <input
                          type="text"
                          maxLength={16}
                          value={editFormData.nik}
                          onChange={(e) => setEditFormData({ ...editFormData, nik: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Nomor Kartu Keluarga (KK)</label>
                        <input
                          type="text"
                          maxLength={16}
                          value={editFormData.noKk}
                          onChange={(e) => setEditFormData({ ...editFormData, noKk: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: KELAHIRAN & AGAMA */}
                {editModalTab === 'kelahiran' && (
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Tempat Lahir</label>
                        <input
                          type="text"
                          value={editFormData.tempatLahir}
                          onChange={(e) => setEditFormData({ ...editFormData, tempatLahir: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                        <input
                          type="date"
                          value={editFormData.tanggalLahir}
                          onChange={(e) => setEditFormData({ ...editFormData, tanggalLahir: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">No. Registrasi Akta Lahir</label>
                      <input
                        type="text"
                        value={editFormData.noAktaLahir}
                        onChange={(e) => setEditFormData({ ...editFormData, noAktaLahir: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Agama / Kepercayaan</label>
                      <select
                        value={editFormData.agama}
                        onChange={(e) => setEditFormData({ ...editFormData, agama: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none bg-white font-semibold"
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

                {/* TAB 3: ALAMAT & TITIK GPS */}
                {editModalTab === 'alamat' && (
                  <div className="space-y-3.5">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Alamat Jalan / Dusun</label>
                      <input
                        type="text"
                        value={editFormData.jalan}
                        onChange={(e) => setEditFormData({ ...editFormData, jalan: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">RT / RW</label>
                        <input
                          type="text"
                          value={editFormData.rtRw}
                          onChange={(e) => setEditFormData({ ...editFormData, rtRw: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Kelurahan / Desa</label>
                        <input
                          type="text"
                          value={editFormData.kelurahan}
                          onChange={(e) => setEditFormData({ ...editFormData, kelurahan: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Kecamatan</label>
                        <input
                          type="text"
                          value={editFormData.kecamatan}
                          onChange={(e) => setEditFormData({ ...editFormData, kecamatan: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Kabupaten / Kota</label>
                        <input
                          type="text"
                          value={editFormData.kabupaten}
                          onChange={(e) => setEditFormData({ ...editFormData, kabupaten: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Provinsi</label>
                        <input
                          type="text"
                          value={editFormData.provinsi}
                          onChange={(e) => setEditFormData({ ...editFormData, provinsi: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Kode Pos</label>
                        <input
                          type="text"
                          value={editFormData.kodePos}
                          onChange={(e) => setEditFormData({ ...editFormData, kodePos: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    {/* Koordinat GPS */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-amber-700" />
                          Titik Koordinat Lokasi Rumah (GPS Lintang & Bujur)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleGetLocation(setEditFormData)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 font-bold hover:bg-amber-100 transition shadow-xs text-[11px] flex items-center gap-1"
                        >
                          <Compass className="w-3 h-3 text-amber-700" />
                          <span>Ambil GPS Saya</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Lintang (Latitude)</label>
                          <input
                            type="text"
                            value={editFormData.lintang}
                            onChange={(e) => setEditFormData({ ...editFormData, lintang: e.target.value })}
                            placeholder="-6.124567"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Bujur (Longitude)</label>
                          <input
                            type="text"
                            value={editFormData.bujur}
                            onChange={(e) => setEditFormData({ ...editFormData, bujur: e.target.value })}
                            placeholder="106.125678"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Modal Edit */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    {editModalTab !== 'pokok' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (editModalTab === 'alamat') setEditModalTab('kelahiran');
                          else if (editModalTab === 'kelahiran') setEditModalTab('pokok');
                        }}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition"
                      >
                        ← Sebelumnya
                      </button>
                    )}
                    {editModalTab !== 'alamat' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (editModalTab === 'pokok') setEditModalTab('kelahiran');
                          else if (editModalTab === 'kelahiran') setEditModalTab('alamat');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition"
                      >
                        Selanjutnya →
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStudentToEdit(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={savingEdit}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md shadow-amber-900/15 disabled:opacity-50 transition cursor-pointer"
                    >
                      {savingEdit ? 'Menyimpan...' : 'Perbarui Identitas'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL 4: DIALOG KONFIRMASI HAPUS MURID (DELETE)          */}
        {/* ======================================================== */}
        {studentToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-slate-200 shadow-2xl relative space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus Murid</h3>
                  <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/80 text-xs space-y-2">
                <p className="text-slate-700 leading-relaxed">
                  Apakah Anda yakin ingin menghapus data murid <b>{studentToDelete.nama}</b> (NISN: {studentToDelete.nisn}, Kelas {studentToDelete.kelasNama}) dari sistem Dapodik SMAN 20?
                </p>
                <p className="text-[11px] text-rose-700 font-medium">
                  Seluruh data login dan rekap absensi terkait murid ini akan terhapus.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setStudentToDelete(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition text-xs"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDeleteStudent}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-900/15 disabled:opacity-50 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{deleting ? 'Menghapus...' : 'Ya, Hapus Murid'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL UPLOAD FOTO RESMI MURID (A5.12) */}
        {photoUploadStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-100">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Upload Foto Murid (A5.12)</h3>
                    <p className="text-[11px] text-slate-500 font-mono">NISN: {photoUploadStudent.nisn}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPhotoUploadStudent(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col items-center justify-center p-5 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <div className="w-28 h-28 rounded-2xl bg-white border border-slate-200 shadow-inner flex items-center justify-center overflow-hidden mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoPreview || photoUploadStudent.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                    alt={photoUploadStudent.nama}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-bold text-slate-900">{photoUploadStudent.nama}</span>
                <span className="text-[11px] text-slate-500">Kelas {photoUploadStudent.kelasNama}</span>
              </div>

              <div className="space-y-3">
                <label className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition shadow-xs">
                  <Upload className="w-4 h-4 text-brand-600" />
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
                  Format didukung: JPG, PNG, WebP (Maks. 2 MB). Foto ini akan digunakan untuk verifikasi biometrik absensi selfie.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isUploadingPhoto}
                  onClick={() => setPhotoUploadStudent(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition text-xs"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={!photoFile || isUploadingPhoto}
                  onClick={handleUploadPhoto}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 disabled:opacity-50 transition cursor-pointer flex items-center gap-1.5"
                >
                  {isUploadingPhoto ? 'Mengunggah...' : 'Simpan Foto Murid'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL IMPORT EXCEL FORMAT DAPODIK (A5.10) */}
        <ExcelImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          title="Import Murid Standar Dapodik 2026 (A5.10)"
          subtitle="Sinkronisasi massal data murid & kelas rombel dari file spreadsheet Dapodik Kemendikbudristek"
          templateUrl="/api/murid/import-excel"
          templateFilename="template-import-murid-dapodik-2026.xlsx"
          uploadEndpoint="/api/murid/import-excel"
          sampleColumns={['NISN', 'Nama Siswa', 'Rombel/Kelas', 'Jenis Kelamin', 'NIS', 'Agama', 'No Telepon/WA']}
          onImportSuccess={() => fetchStudents()}
        />
      </div>
    </DashboardShell>
  );
}
