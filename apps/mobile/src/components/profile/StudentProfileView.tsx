'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Check,
  ArrowDownLeft,
  ArrowUpRight,
  MapPin,
  X,
  Sparkles,
  LogOut,
  Lock,
  Pencil,
  Compass,
  CreditCard,
  AlertTriangle,
  Camera,
} from 'lucide-react';
import { PhotoUploadModal } from '@/components/PhotoUploadModal';
import {
  STUDENT_METRICS,
  generateSemesterHeatmap,
  type HeatmapDay,
} from '@/lib/profile-data';
import { cn } from '@/lib/utils';

export interface StudentData {
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

const AGAMA_OPTIONS = [
  { value: 'ISLAM', label: 'Islam' },
  { value: 'KRISTEN_PROTESTAN', label: 'Kristen Protestan' },
  { value: 'KATOLIK', label: 'Katolik' },
  { value: 'HINDU', label: 'Hindu' },
  { value: 'BUDDHA', label: 'Buddha' },
  { value: 'KHONGHUCU', label: 'Khonghucu' },
  { value: 'PENGHAYAT_KEPERCAYAAN', label: 'Penghayat Kepercayaan' },
];

export default function StudentProfileView({
  showIdentitasCard,
  hideAttendanceAndSchedule,
}: {
  showIdentitasCard?: boolean;
  hideAttendanceAndSchedule?: boolean;
} = {}) {
  const pathname = usePathname();
  const isProfilPage = pathname === '/profil';
  const shouldShowIdentitas = showIdentitasCard ?? isProfilPage;
  const shouldHideAttendanceAndSchedule = hideAttendanceAndSchedule ?? isProfilPage;
  const [selectedDay, setSelectedDay] = React.useState<HeatmapDay | null>(null);
  const [student, setStudent] = React.useState<StudentData | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Modal Edit State
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showPhotoModal, setShowPhotoModal] = React.useState(false);
  const [editTab, setEditTab] = React.useState<'pokok' | 'kelahiran' | 'alamat'>('pokok');
  const [saving, setSaving] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Form Edit State (KECUALI ROMBEL KELAS)
  const [formData, setFormData] = React.useState({
    nama: '',
    jenisKelamin: 'LAKI_LAKI' as 'LAKI_LAKI' | 'PEREMPUAN',
    nisn: '',
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

  const heatmapDays = React.useMemo(() => generateSemesterHeatmap(), []);

  // Fetch Student Profile
  const fetchStudentProfile = async () => {
    try {
      const res = await fetch('/api/murid/profile');
      const json = await res.json();
      if (json.success && json.data) {
        setStudent(json.data);
        setFormData({
          nama: json.data.nama || '',
          jenisKelamin: json.data.jenisKelamin || 'LAKI_LAKI',
          nisn: json.data.nisn || '',
          nik: json.data.nik || '',
          noKk: json.data.noKk || '',
          tempatLahir: json.data.tempatLahir || '',
          tanggalLahir: json.data.tanggalLahir || '',
          noAktaLahir: json.data.noAktaLahir || '',
          agama: json.data.agama || 'ISLAM',
          jalan: json.data.jalan || '',
          rtRw: json.data.rtRw || '',
          kelurahan: json.data.kelurahan || '',
          kecamatan: json.data.kecamatan || '',
          kabupaten: json.data.kabupaten || '',
          provinsi: json.data.provinsi || '',
          kodePos: json.data.kodePos || '',
          lintang: json.data.lintang ? String(json.data.lintang) : '-6.124567',
          bujur: json.data.bujur ? String(json.data.bujur) : '106.125678',
        });
        return json.data;
      }
      return null;
    } catch (err) {
      console.error('Gagal mengambil data profil murid:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const [todayAttendance, setTodayAttendance] = React.useState<{
    id: string;
    jamMasuk: string | null;
    jamPulang: string | null;
    status: string;
    distanceFromSchool: number | null;
    notes: string | null;
  } | null>(null);

  const fetchAttendance = async () => {
    try {
      const res = await fetch('/api/absensi', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && json.data) {
        setTodayAttendance(json.data.todayRecord || null);
      }
    } catch (err) {
      console.error('Gagal mengambil data presensi terkini:', err);
    }
  };

  React.useEffect(() => {
    fetchStudentProfile();
    fetchAttendance();
  }, []);

  const attendanceLogs = React.useMemo(() => {
    const hasMasuk = Boolean(todayAttendance?.jamMasuk);
    const hasPulang = Boolean(todayAttendance?.jamPulang);

    return [
      {
        id: 1,
        type: 'in' as const,
        title: 'Tap In Pagi',
        time: hasMasuk ? todayAttendance!.jamMasuk! : 'Belum presensi',
        status: hasMasuk
          ? (todayAttendance!.status === 'TEPAT'
              ? 'Tepat Waktu'
              : todayAttendance!.status === 'TERLAMBAT'
              ? 'Terlambat'
              : todayAttendance!.status)
          : 'Belum Tercatat',
        location: hasMasuk
          ? (todayAttendance?.distanceFromSchool
              ? `GPS SMAN 20 (±${todayAttendance.distanceFromSchool}m)`
              : 'Presensi Mandiri GPS')
          : 'Gerbang Utama SMAN 20',
        recorded: hasMasuk,
      },
      {
        id: 2,
        type: 'out' as const,
        title: 'Tap Out Pulang',
        time: hasPulang ? todayAttendance!.jamPulang! : 'Belum tercatat',
        status: hasPulang
          ? 'Selesai'
          : hasMasuk
          ? 'Sesi KBM Berlangsung'
          : 'Belum Masuk',
        location: 'Jam Pulang Minimal: 15:15 WIB',
        recorded: hasPulang,
      },
    ];
  }, [todayAttendance]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Handle Update Profile (Kecuali Rombel)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama) {
      alert('Nama lengkap tidak boleh kosong.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/murid/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: student?.id,
          ...formData,
          // ROMBEL TIDAK DISERTAKAN SAMA SEKALI
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast('Data identitas Anda berhasil diperbarui ke sistem Dapodik!');
        setShowEditModal(false);
        // Update local state
        setStudent((prev) => (prev ? {
          ...prev,
          ...formData,
          lintang: parseFloat(formData.lintang) || prev.lintang,
          bujur: parseFloat(formData.bujur) || prev.bujur,
        } : null));
      } else {
        alert(json.message || 'Gagal menyimpan pembaruan.');
      }
    } catch {
      alert('Gagal terhubung ke server.');
    } finally {
      setSaving(false);
    }
  };

  // Get current device GPS
  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            lintang: pos.coords.latitude.toFixed(6),
            bujur: pos.coords.longitude.toFixed(6),
          }));
          showToast(`Koordinat GPS tersimpan: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
        },
        (err) => {
          alert(`Gagal mendeteksi lokasi GPS: ${err.message}. Pastikan izin lokasi aktif.`);
        }
      );
    } else {
      alert('Browser tidak mendukung geolokasi GPS.');
    }
  };

  const getSquareColor = (level: HeatmapDay['level']) => {
    switch (level) {
      case 'exact':
        return 'bg-[#087f5b] hover:bg-[#0ca678] border border-[#087f5b]/30';
      case 'partial':
        return 'bg-[#38d9a9] hover:bg-[#63e6be] border border-[#38d9a9]/30';
      case 'excused':
        return 'bg-amber-400 hover:bg-amber-300 border border-amber-500/20';
      case 'absent':
        return 'bg-rose-500 hover:bg-rose-400 border border-rose-600/20';
      case 'weekend':
      default:
        return 'bg-slate-100 hover:bg-slate-200 border border-slate-200/50';
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-full bg-slate-50 text-slate-900 pb-4 selection:bg-[#96f2d7] selection:text-[#087f5b]">
      {/* Toast Notifikasi Sukses */}
      {toastMessage && (
        <div className="fixed top-4 left-4 right-4 z-50 p-4 rounded-2xl bg-[#087f5b] text-white shadow-xl flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <Check className="w-4 h-4 text-[#96f2d7] shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. HERO SECTION (Compact on Home Dashboard, Full Cover on Profile Page) */}
      <div className="px-4 pt-4 pb-2">
        {isProfilPage ? (
          <div className="relative overflow-hidden rounded-[28px] bg-white shadow-xl shadow-slate-200/40 ring-1 ring-black/[0.04] isolate">
            {/* Cover Banner */}
            <div className="relative h-28 w-full overflow-hidden bg-[#087f5b]">
              <div className="absolute left-4 top-4 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/10 px-3 py-1 text-[10px] font-medium tracking-wide text-white backdrop-blur-md ring-1 ring-white/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38d9a9]" />
                  SMAN 20 Kab. Tangerang
                </span>
              </div>
              <div className="absolute right-4 top-4 z-10">
                <button
                  type="button"
                  onClick={() => setShowEditModal(true)}
                  aria-label="Edit Profil"
                  className="grid h-8 w-8 place-items-center rounded-full bg-black/10 text-white backdrop-blur-md transition-all hover:bg-black/20 active:scale-95 ring-1 ring-white/10"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Profile Avatar & Info */}
            <div className="relative flex flex-col items-center px-4 pb-5 pt-0">
              <div
                onClick={() => setShowPhotoModal(true)}
                className="relative -mt-12 mb-3 cursor-pointer group active:scale-[0.98] transition-transform"
                title="Ketuk untuk mengganti foto dari galeri"
              >
                <div className="relative h-24 w-24 overflow-hidden rounded-full bg-white p-[3px] shadow-sm ring-1 ring-black/5 group-hover:ring-[#087f5b]/30 transition-all">
                  <img
                    src={
                      student?.avatar ||
                      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
                    }
                    alt={student?.nama || 'Murid SMAN 20'}
                    className="h-full w-full rounded-full object-cover"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 backdrop-blur-[2px]">
                    <Camera className="w-4 h-4 text-white drop-shadow-sm" />
                  </div>
                </div>
              </div>

              <h1 className="text-xl font-bold tracking-tight text-slate-900 text-center text-balance">
                {loading ? 'Memuat profil...' : student?.nama || 'Murid SMAN 20'}
              </h1>

              <div className="mt-1.5 flex items-center gap-2 text-xs font-medium flex-wrap justify-center">
                <span className="flex items-center gap-1.5 rounded-md bg-[#e6fcf5] px-2.5 py-0.5 text-[#087f5b] ring-1 ring-[#96f2d7]/70 font-semibold">
                  <span className="text-[10px] text-[#12b886] font-bold uppercase tracking-wider">NISN</span>
                  <span className="font-mono text-[11px]">{student?.nisn || '-'}</span>
                </span>

                <span
                  className="flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-0.5 text-slate-700 ring-1 ring-slate-200 text-xs font-semibold"
                  title="Rombongan belajar terkunci."
                >
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>Kelas {student?.kelasNama || 'X.1'}</span>
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Compact Header on Home Dashboard (Vertical Stack Hierarchy) */
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                onClick={() => setShowPhotoModal(true)}
                className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-2 ring-[#087f5b]/20 cursor-pointer"
              >
                <img
                  src={
                    student?.avatar ||
                    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
                  }
                  alt={student?.nama || 'Murid SMAN 20'}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                  <span>SMAN 20 KAB. TANGERANG</span>
                  <span>•</span>
                  <span className="text-[#087f5b] font-bold">Kelas {student?.kelasNama || 'X.1'}</span>
                </div>
                <h1 className="text-sm font-bold text-slate-900 truncate">
                  {loading ? 'Memuat profil...' : student?.nama || 'Murid SMAN 20'}
                </h1>
                <p className="text-[11px] text-slate-400 font-mono">
                  NISN: {student?.nisn || '-'}
                </p>
              </div>
            </div>

            <Link
              href="/profil"
              className="shrink-0 p-2 text-slate-400 hover:text-slate-600 active:scale-95 transition"
              aria-label="Buka Profil"
            >
              <Pencil className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>



      {/* 2. DATA DIRI & DAPODIK (iOS/Android Native List View) */}
      {shouldShowIdentitas && (
        <div className="px-4 mt-5">
          <div className="rounded-2xl bg-white shadow-xs border border-slate-200/80 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50/70 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#087f5b]" />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Identitas Kependudukan</h2>
              </div>
              <Link
                href="/profil/edit"
                className="text-xs font-bold text-[#087f5b] hover:text-[#0ca678] flex items-center gap-1 active:scale-95 transition"
              >
                <Pencil className="w-3 h-3" />
                <span>Ubah</span>
              </Link>
            </div>

            {/* List View Tipe iOS/Android Native */}
            <div className="divide-y divide-slate-100 text-xs">
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-slate-500 font-medium">NIK</span>
                <span className="font-mono font-bold text-slate-800 text-right">{student?.nik || '-'}</span>
              </div>

              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-slate-500 font-medium">No. KK</span>
                <span className="font-mono font-bold text-slate-800 text-right">{student?.noKk || '-'}</span>
              </div>

              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-slate-500 font-medium">Tempat, Tgl Lahir</span>
                <span className="font-semibold text-slate-800 text-right">
                  {student?.tempatLahir || 'Tangerang'}, {student?.tanggalLahir || '-'}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-slate-500 font-medium">Agama</span>
                <span className="font-semibold text-[#087f5b] uppercase text-right">{student?.agama || 'Islam'}</span>
              </div>

              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-slate-500 font-medium">Rombel</span>
                <span className="font-semibold text-slate-800 text-right flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-600" />
                  <span>Kelas {student?.kelasNama || 'X.1'}</span>
                </span>
              </div>

              <div className="px-4 py-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Domisili</span>
                  {student?.lintang && (
                    <a
                      href={`https://www.google.com/maps?q=${student.lintang},${student.bujur}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-[#087f5b] hover:underline flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3 text-[#087f5b]" />
                      <span>Maps</span>
                    </a>
                  )}
                </div>
                <p className="text-slate-800 font-medium leading-relaxed pt-0.5">
                  {student?.jalan || 'Jl. Raya Pakuhaji'}, RT {student?.rtRw || '001/001'}, Kel. {student?.kelurahan || 'Pakuhaji'}, Kec. {student?.kecamatan || 'Pakuhaji'}, {student?.kabupaten || 'Kab. Tangerang'} {student?.kodePos || ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. METRICS CARDS */}
      <div className="mx-4 mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
        {STUDENT_METRICS.map((metric, idx) => (
          <div
            key={idx}
            className="group flex flex-col items-center justify-center rounded-2xl bg-white py-4 px-2 shadow-sm shadow-slate-200/50 ring-1 ring-black/[0.04] transition-all hover:ring-black/[0.08]"
          >
            <span
              className={`text-2xl font-bold tracking-tight ${
                idx === 1
                  ? 'text-[#087f5b]'
                  : idx === 0
                  ? 'text-[#12b886]'
                  : 'text-slate-900'
              }`}
            >
              {metric.value}
            </span>
            <span className="mt-1.5 text-[10px] font-medium text-slate-500 uppercase tracking-widest text-center">
              {metric.label}
            </span>
          </div>
        ))}
      </div>

      {/* 4. CONTENT PANELS (Heatmap & Jadwal) */}
      <div className="p-4 space-y-6">
        {!shouldHideAttendanceAndSchedule && (
          <>
            {/* REKAP KEHADIRAN (HEATMAP) */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 rounded-full bg-[#087f5b]" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Rekap Kehadiran</h2>
                <p className="text-xs text-slate-500">Semester Ganjil (91 Hari)</p>
              </div>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-[#e6fcf5] px-2.5 py-1 text-[11px] font-semibold text-[#087f5b] ring-1 ring-[#96f2d7]">
              <Sparkles className="h-3 w-3 text-[#12b886]" />
              Presensi Aktif
            </span>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-200/50 ring-1 ring-black/[0.04]">
            {/* Heatmap Grid */}
            <div className="flex gap-2">
              <div className="flex flex-col justify-between py-1 pr-1 text-[10px] font-semibold text-slate-400">
                <span>Min</span>
                <span>Sen</span>
                <span>Sel</span>
                <span>Rab</span>
                <span>Kam</span>
                <span>Jum</span>
                <span>Sab</span>
              </div>
              <div className="grid flex-1 grid-rows-7 grid-flow-col gap-1">
                {heatmapDays.map((dayData) => {
                  if (!dayData) return null;
                  const isSelected = selectedDay?.id === dayData.id;

                  return (
                    <button
                      key={dayData.id}
                      type="button"
                      onClick={() => setSelectedDay(dayData)}
                      className={`w-full aspect-square rounded-[3px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12b886] focus-visible:ring-offset-2 ${getSquareColor(
                        dayData.level
                      )} ${
                        isSelected
                          ? 'ring-2 ring-[#087f5b] ring-offset-1 scale-110 relative z-10 shadow-sm'
                          : 'hover:scale-110 active:scale-95'
                      }`}
                      aria-label={`${dayData.dateStr}: ${dayData.statusLabel}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-y-2 text-[11px] font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#087f5b] shadow-xs" />
                <span className="font-semibold text-slate-800">Tepat</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#38d9a9] shadow-xs" />
                <span className="font-semibold text-slate-800">Parsial</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" />
                <span>Izin</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
                <span>Alpa</span>
              </span>
            </div>

            {/* Tooltip / Popover Detail Tanggal */}
            {selectedDay && (
              <div className="mt-5 overflow-hidden rounded-2xl bg-slate-900 p-4 ring-1 ring-slate-800 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">
                      {selectedDay.dateStr}
                    </div>
                    <div className="mt-0.5 text-[11px] font-semibold text-[#38d9a9]">
                      {selectedDay.statusLabel}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedDay(null)}
                    aria-label="Tutup detail"
                    className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white active:scale-95 transition-all"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {selectedDay.checkIn && (
                  <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-800 pt-3 text-[11px]">
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-[10px]">Masuk</span>
                      <span className="font-mono font-bold text-slate-200">
                        {selectedDay.checkIn}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-[10px]">Pulang</span>
                      <span className="font-mono font-bold text-slate-200">
                        {selectedDay.checkOut}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-[10px]">Durasi</span>
                      <span className="font-mono font-bold text-[#38d9a9]">
                        {selectedDay.duration}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* AKTIVITAS HARI INI */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 rounded-full bg-[#12b886]" />
              <h2 className="text-sm font-bold text-slate-900">Aktivitas Hari Ini</h2>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Log Presensi Real-Time</span>
          </div>

          {!todayAttendance?.jamMasuk && (
            <div className="mb-4 p-4 rounded-3xl bg-amber-50 ring-1 ring-amber-200/60 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-100/50">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">Belum Presensi Masuk</h4>
                  <p className="text-[10px] text-amber-700/80 mt-0.5">Silakan tap tombol untuk absen GPS.</p>
                </div>
              </div>
              <Link
                href="/absensi"
                className="px-4 py-2 rounded-full bg-[#087f5b] hover:bg-[#0ca678] text-white text-[11px] font-bold shadow-sm active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                Absen Masuk →
              </Link>
            </div>
          )}

          <div className="space-y-3">
            {attendanceLogs.map((log) => (
              <div
                key={log.id}
                className="group relative flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm shadow-slate-200/30 ring-1 ring-black/[0.04] hover:ring-black/[0.08] hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${
                      log.recorded
                        ? 'bg-[#e6fcf5] text-[#087f5b] ring-1 ring-[#96f2d7]/80'
                        : 'bg-slate-50 text-slate-400 ring-1 ring-slate-100'
                    }`}
                  >
                    {log.type === 'in' ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{log.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{log.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-mono text-xs font-bold ${
                      log.recorded ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {log.time}
                  </div>
                  <div
                    className={`text-[10px] font-bold mt-0.5 ${
                      log.recorded
                        ? 'text-[#087f5b]'
                        : log.status === 'Belum Tercatat'
                        ? 'text-rose-500'
                        : 'text-slate-400'
                    }`}
                  >
                    {log.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

          </>
        )}

        {/* LOGOUT BUTTON HANYA DI HALAMAN PROFIL */}
        {isProfilPage && (
          <div className="pt-4 pb-6">
            <button
              type="button"
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/login';
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-white ring-1 ring-rose-200 text-rose-600 font-bold text-xs shadow-sm hover:bg-rose-50 transition-all active:scale-[0.99] cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar dari Akun Siswa</span>
            </button>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* MODAL EDIT DATA DIRI MURID (SELF-SERVICE CRUD - KECUALI ROMBEL)     */}
      {/* =================================================================== */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Edit Identitas Diri (Dapodik)</h3>
                <p className="text-xs text-slate-500">Perbarui data kependudukan dan alamat tempat tinggal</p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* PEMBERITAHUAN ATURAN ROMBEL TERKUNCI */}
            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Rombongan Belajar: Kelas {student?.kelasNama || 'X.1'} (Terkunci)</span>
                <span className="text-[11px] text-amber-800 leading-relaxed block mt-0.5">
                  Sesuai kebijakan sekolah, murid tidak diizinkan mengubah rombel. Perubahan rombel hanya dapat dilakukan oleh Admin Sekolah atau Guru Wali Kelas.
                </span>
              </div>
            </div>

            {/* Tab Navigasi */}
            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <button
                type="button"
                onClick={() => setEditTab('pokok')}
                className={cn(
                  'flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition text-center',
                  editTab === 'pokok'
                    ? 'bg-[#087f5b] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                Data Pokok
              </button>
              <button
                type="button"
                onClick={() => setEditTab('kelahiran')}
                className={cn(
                  'flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition text-center',
                  editTab === 'kelahiran'
                    ? 'bg-[#087f5b] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                Kelahiran & Agama
              </button>
              <button
                type="button"
                onClick={() => setEditTab('alamat')}
                className={cn(
                  'flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition text-center',
                  editTab === 'alamat'
                    ? 'bg-[#087f5b] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                Alamat & GPS
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              {/* TAB 1: POKOK */}
              {editTab === 'pokok' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
                    <input
                      type="text"
                      required
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      placeholder="Nama lengkap sesuai akta/ijazah"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                      <select
                        value={formData.jenisKelamin}
                        onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as any })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none bg-white font-semibold"
                      >
                        <option value="LAKI_LAKI">Laki-Laki (L)</option>
                        <option value="PEREMPUAN">Perempuan (P)</option>
                      </select>
                    </div>

                    {/* ROMBEL: DISABLED & LOCKED */}
                    <div>
                      <label className="block font-bold text-slate-400 mb-1 flex items-center justify-between">
                        <span>Rombel Kelas</span>
                        <Lock className="w-3 h-3 text-amber-600" />
                      </label>
                      <input
                        type="text"
                        disabled
                        value={`Kelas ${student?.kelasNama || 'X.1'} (Terkunci)`}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-bold cursor-not-allowed select-none text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NISN (10 Digit)</label>
                      <input
                        type="text"
                        maxLength={10}
                        value={formData.nisn}
                        onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-400 mb-1">NIS Sekolah</label>
                      <input
                        type="text"
                        disabled
                        value={student?.nis || '-'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 font-mono text-slate-500 cursor-not-allowed select-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NIK (16 Digit)</label>
                      <input
                        type="text"
                        maxLength={16}
                        value={formData.nik}
                        onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                        placeholder="360312..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nomor Kartu Keluarga (KK)</label>
                      <input
                        type="text"
                        maxLength={16}
                        value={formData.noKk}
                        onChange={(e) => setFormData({ ...formData, noKk: e.target.value })}
                        placeholder="360312..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: KELAHIRAN & AGAMA */}
              {editTab === 'kelahiran' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tempat Lahir</label>
                      <input
                        type="text"
                        value={formData.tempatLahir}
                        onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                        placeholder="Tangerang"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                      <input
                        type="date"
                        value={formData.tanggalLahir}
                        onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">No. Registrasi Akta Lahir</label>
                    <input
                      type="text"
                      value={formData.noAktaLahir}
                      onChange={(e) => setFormData({ ...formData, noAktaLahir: e.target.value })}
                      placeholder="3603-LT-12052008-0021"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Agama / Kepercayaan</label>
                    <select
                      value={formData.agama}
                      onChange={(e) => setFormData({ ...formData, agama: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none bg-white font-semibold"
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
              {editTab === 'alamat' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Alamat Jalan / Dusun</label>
                    <input
                      type="text"
                      value={formData.jalan}
                      onChange={(e) => setFormData({ ...formData, jalan: e.target.value })}
                      placeholder="Contoh: Jl. Raya Pakuhaji No. 12"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">RT / RW</label>
                      <input
                        type="text"
                        value={formData.rtRw}
                        onChange={(e) => setFormData({ ...formData, rtRw: e.target.value })}
                        placeholder="001/002"
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Kelurahan</label>
                      <input
                        type="text"
                        value={formData.kelurahan}
                        onChange={(e) => setFormData({ ...formData, kelurahan: e.target.value })}
                        placeholder="Pakuhaji"
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Kecamatan</label>
                      <input
                        type="text"
                        value={formData.kecamatan}
                        onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                        placeholder="Pakuhaji"
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Kab/Kota</label>
                      <input
                        type="text"
                        value={formData.kabupaten}
                        onChange={(e) => setFormData({ ...formData, kabupaten: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Provinsi</label>
                      <input
                        type="text"
                        value={formData.provinsi}
                        onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Kode Pos</label>
                      <input
                        type="text"
                        value={formData.kodePos}
                        onChange={(e) => setFormData({ ...formData, kodePos: e.target.value })}
                        placeholder="15570"
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none text-xs"
                      />
                    </div>
                  </div>

                  {/* Geotagging GPS */}
                  <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-amber-700" />
                        Titik GPS Rumah Siswa
                      </span>
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 font-bold hover:bg-amber-100 transition shadow-xs text-[10px] flex items-center gap-1 active:scale-95 cursor-pointer"
                      >
                        <Compass className="w-3 h-3 text-amber-700" />
                        <span>Deteksi GPS Saya</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Lintang (Lat)</label>
                        <input
                          type="text"
                          value={formData.lintang}
                          onChange={(e) => setFormData({ ...formData, lintang: e.target.value })}
                          placeholder="-6.124567"
                          className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Bujur (Lng)</label>
                        <input
                          type="text"
                          value={formData.bujur}
                          onChange={(e) => setFormData({ ...formData, bujur: e.target.value })}
                          placeholder="106.125678"
                          className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-[#087f5b] focus:outline-none bg-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Modal Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  {editTab !== 'pokok' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (editTab === 'alamat') setEditTab('kelahiran');
                        else if (editTab === 'kelahiran') setEditTab('pokok');
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition text-xs"
                    >
                      ← Kembali
                    </button>
                  )}
                  {editTab !== 'alamat' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (editTab === 'pokok') setEditTab('kelahiran');
                        else if (editTab === 'kelahiran') setEditTab('alamat');
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition text-xs"
                    >
                      Lanjut →
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-[#087f5b] hover:bg-[#0ca678] text-white font-bold shadow-md shadow-[#087f5b]/20 disabled:opacity-50 transition cursor-pointer text-xs active:scale-95"
                  >
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Upload / Ganti Foto dari Galeri atau Kamera */}
      <PhotoUploadModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        userRole="MURID"
        currentAvatar={student?.avatar}
        onUploadSuccess={(url: string) => {
          setStudent((prev) => (prev ? { ...prev, avatar: url } : null));
          showToast('Foto profil berhasil diperbarui!');
        }}
      />
    </div>
  );
}
