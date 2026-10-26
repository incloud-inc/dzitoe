'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  CalendarCheck,
  ScanFace,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Navigation,
  Clock,
  LogOut,
  FileText,
  X,
  Send,
  MapPin,
  Camera,
  QrCode,
  History,
  ShieldCheck,
  Upload,
  Check,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { SelfieCameraModal, type SelfieCaptureData } from '@/components/SelfieCameraModal';
import { QrScannerModal } from '@/components/QrScannerModal';
import { AttendanceDetailModal, type AttendanceDetailData } from '@/components/AttendanceDetailModal';
import { cn } from '@/lib/utils';

// Import Leaflet Attendance Map secara dinamis (tanpa SSR)
const AttendanceMap = dynamic(() => import('@/components/AttendanceMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 sm:h-52 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-[#087f5b] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-500">Memuat OpenStreetMap...</span>
      </div>
    </div>
  ),
});

// Titik Koordinat SMAN 20 Kabupaten Tangerang
const SCHOOL_COORDS = {
  lat: -6.123456,
  lng: 106.123456,
  radiusMeters: 100,
};

function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

interface AttendanceItem {
  id: string;
  tanggal: string;
  jamMasuk: string | null;
  jamPulang: string | null;
  status: 'HADIR' | 'TEPAT' | 'PARSIAL' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'ALPA';
  distanceFromSchool: number | null;
  isWithinRadius: boolean;
  notes: string | null;
  method?: 'GPS' | 'SELFIE' | 'QR';
  selfieUrl?: string | null;
  watermarkText?: string | null;
  attachmentUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  parentNotified?: boolean;
}

export default function AbsensiPage() {
  // Navigation Tabs: 'PRESENSI' | 'RIWAYAT' | 'IZIN'
  const [activeTab, setActiveTab] = useState<'PRESENSI' | 'RIWAYAT' | 'IZIN'>('PRESENSI');

  // GPS State
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number>(14);
  const [isWithinRadius, setIsWithinRadius] = useState<boolean>(true);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // DEMO RULE / BYPASS STATE
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Submission & API Data
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [todayRecord, setTodayRecord] = useState<AttendanceItem | null>(null);
  const [history, setHistory] = useState<AttendanceItem[]>([]);
  const [studentInfo, setStudentInfo] = useState<{ nama: string; kelasNama: string; nisn: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error'; waPhone?: string } | null>(null);

  // Modals State
  const [showSelfieModal, setShowSelfieModal] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [selectedDetail, setSelectedDetail] = useState<AttendanceDetailData | null>(null);

  // Pengajuan Izin / Sakit Form State (B12.1, B12.2, B13.1)
  const [izinType, setIzinType] = useState<'IZIN' | 'SAKIT'>('IZIN');
  const [izinDate, setIzinDate] = useState<string>(new Date().toISOString().split('T')[0] ?? '');
  const [izinReason, setIzinReason] = useState<string>('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const [uploadingAttachment, setUploadingAttachment] = useState<boolean>(false);

  const [userRole, setUserRole] = useState<'MURID' | 'ORANG_TUA' | 'GURU'>('MURID');

  // Fetch initial data from /api/absensi
  const loadAttendanceData = async () => {
    try {
      setLoading(true);

      // Check session
      try {
        const sRes = await fetch('/api/auth/session');
        const sJson = await sRes.json();
        if (sJson.authenticated && sJson.user?.role) {
          setUserRole(sJson.user.role);
        }
      } catch {
        // non-blocking
      }

      const res = await fetch('/api/absensi');
      const json = await res.json();
      if (json.success && json.data) {
        setTodayRecord(json.data.todayRecord || null);
        setHistory(json.data.history || []);
        setStudentInfo(json.data.student || null);
      }
    } catch (err) {
      console.error('Failed to load attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendanceData();
  }, []);

  // Handle GPS location tracking
  useEffect(() => {
    if (isDemoMode) {
      const simulatedLat = SCHOOL_COORDS.lat + 0.00008;
      const simulatedLng = SCHOOL_COORDS.lng + 0.00008;
      setUserCoords({ lat: simulatedLat, lng: simulatedLng });
      setDistance(12);
      setIsWithinRadius(true);
      setGpsError(null);
      return;
    }

    if (!navigator.geolocation) {
      setGpsError('Browser tidak mendukung pendeteksi lokasi GPS.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });

        const dist = calculateHaversineDistance(
          latitude,
          longitude,
          SCHOOL_COORDS.lat,
          SCHOOL_COORDS.lng
        );
        setDistance(dist);
        setIsWithinRadius(dist <= SCHOOL_COORDS.radiusMeters);
        setGpsError(null);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setGpsError('Aktifkan izin lokasi (GPS) pada smartphone Anda.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isDemoMode]);

  const showToast = (text: string, type: 'success' | 'error' = 'success', waPhone?: string) => {
    setToastMessage({ text, type, waPhone });
    setTimeout(() => setToastMessage(null), 6000);
  };

  // 1. Handle Absensi Cepat via GPS Murni (Tanpa Foto)
  const handleAttendanceGps = async (type: 'MASUK' | 'PULANG') => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/absensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          method: 'GPS',
          latitude: userCoords?.lat || null,
          longitude: userCoords?.lng || null,
          isDemo: isDemoMode,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        showToast(json.message || 'Gagal menyimpan presensi GPS.', 'error');
        return;
      }

      setTodayRecord(json.data);
      const waStatus = json.waNotification ? ` • WhatsApp Orang Tua Terkirim (${json.waNotification.phone})` : '';
      showToast(`${json.message}${waStatus}`, 'success', json.waNotification?.phone);
      loadAttendanceData();
    } catch (err) {
      console.error(err);
      showToast('Gagal menghubungi server.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Handle Absensi via Swafoto (Watermark Otomatis Long-Lat & Kompresi WebP)
  const handleSelfieCaptureComplete = async (captureData: SelfieCaptureData) => {
    setShowSelfieModal(false);
    setSubmitting(true);
    try {
      // 1. Upload foto swafoto ke server API (Task A12.4 & A12.7)
      const uploadRes = await fetch('/api/absensi/selfie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imagePayload: captureData.imagePayload,
          timestampClient: captureData.timestamp,
          latitude: captureData.latitude,
          longitude: captureData.longitude,
          accuracyMeters: captureData.accuracyMeters,
          deviceFingerprint: captureData.deviceFingerprint,
          studentId: studentInfo?.nisn || 'demo-murid-1',
        }),
      });

      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok || !uploadJson.success) {
        showToast(uploadJson.message || 'Gagal memvalidasi foto swafoto liveness.', 'error');
        return;
      }

      const uploadedUrl = uploadJson.fileUrl;
      const type = !todayRecord?.jamMasuk ? 'MASUK' : 'PULANG';

      // 2. Catat presensi dengan method 'SELFIE'
      const presensiRes = await fetch('/api/absensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          method: 'SELFIE',
          latitude: captureData.latitude,
          longitude: captureData.longitude,
          isDemo: isDemoMode,
          selfieUrl: uploadedUrl,
          notes: `Swafoto Watermark GPS (${uploadJson.metadata?.clientAntiSpoofingHash?.substring(0, 10) || 'OK'})`,
          livenessVerified: true,
          imageHash: uploadJson.metadata?.clientAntiSpoofingHash,
        }),
      });

      const presensiJson = await presensiRes.json();
      if (!presensiRes.ok || !presensiJson.success) {
        showToast(presensiJson.message || 'Gagal mencatat presensi swafoto.', 'error');
        return;
      }

      setTodayRecord(presensiJson.data);
      const waStatus = presensiJson.waNotification ? ` • Notifikasi WA Ortu Terkirim` : '';
      showToast(`Presensi swafoto terverifikasi! ${presensiJson.message}${waStatus}`, 'success');
      loadAttendanceData();
    } catch (err) {
      console.error(err);
      showToast('Gagal memproses swafoto presensi.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Handle Absensi via QR Code Pos Piket (Metode Alternatif)
  const handleQrScanSuccess = async (qrCodeValue: string) => {
    setShowQrModal(false);
    setSubmitting(true);
    try {
      const type = !todayRecord?.jamMasuk ? 'MASUK' : 'PULANG';
      const res = await fetch('/api/absensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          method: 'QR',
          latitude: userCoords?.lat || null,
          longitude: userCoords?.lng || null,
          isDemo: isDemoMode,
          notes: `Presensi Alternatif: Scan QR Pos Piket (${qrCodeValue})`,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        showToast(json.message || 'Gagal mencatat presensi via QR.', 'error');
        return;
      }

      setTodayRecord(json.data);
      showToast(`Presensi QR Pos Piket tercatat! ${json.message}`, 'success');
      loadAttendanceData();
    } catch (err) {
      console.error(err);
      showToast('Gagal memproses QR Code.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Handle Upload Berkas Lampiran Izin/Sakit (B13.1)
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran berkas melebihi batas maksimal 5MB.');
      return;
    }

    setAttachmentFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachmentPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 5. Handle Submit Pengajuan Izin / Sakit Mandiri (B12.1, B12.2, B13.1)
  const handleIzinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!izinReason.trim()) {
      alert('Mohon cantumkan keterangan lengkap permohonan.');
      return;
    }

    setSubmitting(true);
    setUploadingAttachment(true);
    try {
      let uploadedAttachmentUrl: string | null = null;

      // Upload file lampiran bila disertakan (B13.1)
      if (attachmentFile) {
        const formData = new FormData();
        formData.append('file', attachmentFile);
        const uploadRes = await fetch('/api/absensi/lampiran', {
          method: 'POST',
          body: formData,
        });
        const uploadJson = await uploadRes.json();
        if (uploadRes.ok && uploadJson.success) {
          uploadedAttachmentUrl = uploadJson.fileUrl;
        }
      }

      // Kirim data pengajuan ke /api/absensi
      const res = await fetch('/api/absensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: izinType,
          notes: `${izinReason} [Tanggal: ${izinDate}]`,
          attachmentUrl: uploadedAttachmentUrl,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        showToast(json.message || 'Gagal mengirim pengajuan.', 'error');
        return;
      }

      setTodayRecord(json.data);
      setIzinReason('');
      setAttachmentFile(null);
      setAttachmentPreview(null);
      const waInfo = json.waNotification ? ` • WhatsApp Orang Tua Terkirim` : '';
      showToast(`Permohonan ${izinType === 'IZIN' ? 'Izin' : 'Sakit'} berhasil dikirim!${waInfo}`, 'success');
      setActiveTab('PRESENSI');
      loadAttendanceData();
    } catch (err) {
      console.error(err);
      showToast('Gagal mengirim permohonan izin/sakit.', 'error');
    } finally {
      setSubmitting(false);
      setUploadingAttachment(false);
    }
  };

  const hasCheckedIn = Boolean(todayRecord?.jamMasuk);
  const hasCheckedOut = Boolean(todayRecord?.jamPulang);

  // Statistics for Riwayat Tab
  const stats = {
    tepat: history.filter((h) => h.status === 'TEPAT' || h.status === 'HADIR').length,
    terlambat: history.filter((h) => h.status === 'TERLAMBAT').length,
    izin: history.filter((h) => h.status === 'IZIN').length,
    sakit: history.filter((h) => h.status === 'SAKIT').length,
  };

  return (
    <>
      <PageHeader
        title={userRole === 'ORANG_TUA' ? 'Presensi Murid (Pantau)' : 'Presensi Murid'}
        subtitle={
          userRole === 'ORANG_TUA'
            ? 'SMAN 20 Kab. Tangerang — Portal Pemantauan Kehadiran Orang Tua'
            : 'SMAN 20 Kabupaten Tangerang — GPS & Swafoto Mandiri'
        }
      />

      {/* Floating Toast Notification (B14.1 & B15.1) */}
      {toastMessage && (
        <div
          className={cn(
            'fixed top-4 inset-x-4 z-50 p-4 rounded-2xl shadow-xl flex items-center justify-between text-white text-xs font-semibold animate-in slide-in-from-top-4 duration-200',
            toastMessage.type === 'success' ? 'bg-[#087f5b]' : 'bg-rose-600'
          )}
        >
          <div className="flex items-center gap-2.5">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            )}
            <div className="flex flex-col">
              <span>{toastMessage.text}</span>
              {toastMessage.waPhone && (
                <span className="text-[10px] text-white/80 font-normal mt-0.5 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>Notifikasi WhatsApp terkirim ke {toastMessage.waPhone}</span>
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="space-y-4 px-4 pt-3 pb-24 font-sans max-w-md mx-auto">
        {/* TAB NAVIGATION: PRESENSI, RIWAYAT, PENGAJUAN */}
        <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('PRESENSI')}
            className={cn(
              'flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5',
              activeTab === 'PRESENSI'
                ? 'bg-white text-[#087f5b] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <ScanFace className="w-4 h-4" />
            <span>Presensi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('RIWAYAT')}
            className={cn(
              'flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5',
              activeTab === 'RIWAYAT'
                ? 'bg-white text-[#087f5b] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <History className="w-4 h-4" />
            <span>Riwayat</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('IZIN')}
            className={cn(
              'flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5',
              activeTab === 'IZIN'
                ? 'bg-white text-[#087f5b] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <FileText className="w-4 h-4" />
            <span>Izin / Sakit</span>
          </button>
        </div>

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-slate-100/70 text-xs text-slate-500 font-medium">
            <div className="w-3.5 h-3.5 border-2 border-[#087f5b] border-t-transparent rounded-full animate-spin" />
            <span>Memperbarui status presensi...</span>
          </div>
        )}

        {/* INFO SISWA BANNER */}
        {studentInfo && (
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#e6fcf5] text-[#087f5b] flex items-center justify-center font-bold text-[11px] border border-[#96f2d7]">
                {studentInfo.nama.substring(0, 1)}
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-xs">{studentInfo.nama}</p>
                <p className="text-[10px] text-slate-500 font-mono">NISN: {studentInfo.nisn}</p>
              </div>
            </div>
            <span className="font-bold text-[#087f5b] bg-[#e6fcf5] px-2.5 py-1 rounded-xl border border-[#96f2d7] text-[11px]">
              Kelas {studentInfo.kelasNama}
            </span>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 1: PRESENSI HARI INI                                      */}
        {/* ============================================================== */}
        {activeTab === 'PRESENSI' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* TOGGLE MODE DEMO (BYPASS GPS & KAMERA) */}
            <div className="rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 p-3.5 border border-violet-200/80 shadow-xs">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-violet-950 flex items-center gap-1.5">
                      <span>Mode Demo Presensi</span>
                      <span className="text-[9px] bg-violet-200/80 text-violet-900 px-1.5 py-0.2 rounded font-black">
                        BYPASS
                      </span>
                    </h3>
                    <p className="text-[10px] text-violet-700 leading-tight">
                      {isDemoMode
                        ? 'Lokasi otomatis di SMAN 20 (Radius Aman 12m).'
                        : 'Menggunakan sensor GPS hardware smartphone asli.'}
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={isDemoMode}
                    onChange={(e) => setIsDemoMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
                </label>
              </div>
            </div>

            {/* STATUS HARI INI CARD */}
            {todayRecord && (
              <div className="rounded-3xl bg-white p-4 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#087f5b]" />
                    <h3 className="text-xs font-bold text-slate-800">Status Kehadiran Hari Ini</h3>
                  </div>
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider',
                      todayRecord.status === 'TEPAT'
                        ? 'bg-[#e6fcf5] text-[#087f5b] ring-1 ring-[#96f2d7]'
                        : todayRecord.status === 'TERLAMBAT'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-blue-100 text-blue-900'
                    )}
                  >
                    {todayRecord.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Jam Masuk</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {todayRecord.jamMasuk || 'Belum Masuk'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Jam Pulang</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {todayRecord.jamPulang || 'Belum Pulang'}
                    </span>
                  </div>
                </div>

                {todayRecord.selfieUrl && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50/60 border border-emerald-100 text-[11px] text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Presensi terverifikasi dengan swafoto & watermark koordinat.</span>
                  </div>
                )}
              </div>
            )}

            {/* PETA RADIUS & GPS */}
            <section className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#087f5b] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Peta Radius Sekolah</h2>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#087f5b] bg-[#e6fcf5] px-2 py-0.5 rounded-full border border-[#96f2d7]">
                  Radius 100m
                </span>
              </div>

              {/* Leaflet Visualizer */}
              <AttendanceMap
                userLat={userCoords?.lat ?? null}
                userLng={userCoords?.lng ?? null}
                schoolLat={SCHOOL_COORDS.lat}
                schoolLng={SCHOOL_COORDS.lng}
                radius={SCHOOL_COORDS.radiusMeters}
                isWithinRadius={isWithinRadius}
                isDemoMode={isDemoMode}
              />

              {/* Jarak GPS Card */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-[#087f5b]" />
                  <span className="text-slate-600">Jarak ke Gerbang:</span>
                </div>
                <span
                  className={cn(
                    'font-mono font-black text-xs',
                    isWithinRadius ? 'text-[#087f5b]' : 'text-amber-600'
                  )}
                >
                  ±{distance} meter {isWithinRadius ? '(Di Dalam Radius)' : '(Di Luar)'}
                </span>
              </div>

              {gpsError && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{gpsError} (Gunakan toggle Mode Demo di atas bila menguji di laptop).</span>
                </div>
              )}
            </section>

            {/* ========================================================== */}
            {/* OPSI PILIHAN METODE PRESENSI (ATAU PEMANTAUAN ORTU)        */}
            {/* ========================================================== */}
            {userRole === 'ORANG_TUA' ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-center space-y-1.5 shadow-xs">
                <div className="flex items-center justify-center gap-1.5 font-bold text-emerald-900 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Portal Pemantauan Orang Tua</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Presensi harian dilakukan mandiri oleh putra/putri Anda ({studentInfo?.nama || 'Siswa'}) di sekolah. Notifikasi kehadiran resmi otomatis terkirim ke WhatsApp Anda saat proses presensi selesai.
                </p>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-slate-800">Pilih Metode Presensi Utama:</span>
                  <span className="text-[10px] text-slate-400">Pilih salah satu metode</span>
                </div>

                {/* METODE 1: PRESENSI GPS (CEPAT) */}
                <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-[#087f5b] flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">1. Presensi GPS (Cepat)</h4>
                        <p className="text-[10px] text-slate-500">Cukup verifikasi radius 100m tanpa foto selfie</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                      1-TAP
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {!hasCheckedIn ? (
                      <button
                        type="button"
                        onClick={() => handleAttendanceGps('MASUK')}
                        disabled={submitting || (!isWithinRadius && !isDemoMode)}
                        className={cn(
                          'flex-1 py-2.5 px-3 rounded-xl font-bold text-xs text-white shadow-md flex items-center justify-center gap-1.5 transition active:scale-[0.98] cursor-pointer',
                          isWithinRadius || isDemoMode
                            ? 'bg-gradient-to-r from-[#087f5b] to-[#12b886] hover:opacity-95'
                            : 'bg-slate-300 cursor-not-allowed text-slate-500'
                        )}
                      >
                        {submitting ? (
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5" />
                        )}
                        <span>Absen Masuk (GPS)</span>
                      </button>
                    ) : !hasCheckedOut ? (
                      <button
                        type="button"
                        onClick={() => handleAttendanceGps('PULANG')}
                        disabled={submitting}
                        className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md flex items-center justify-center gap-1.5 transition active:scale-[0.98] cursor-pointer"
                      >
                        {submitting ? (
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <LogOut className="w-3.5 h-3.5" />
                        )}
                        <span>Absen Pulang (GPS)</span>
                      </button>
                    ) : (
                      <div className="flex-1 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-center font-bold text-xs border border-emerald-200 flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Presensi GPS Selesai Hari Ini</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* METODE 2: PRESENSI SWAFOTO (WATERMARK KOORDINAT OTOMATIS) */}
                <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">2. Presensi Swafoto (Watermark Long-Lat)</h4>
                        <p className="text-[10px] text-slate-500">Kamera swafoto dengan koordinat GPS otomatis tertera di foto</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">
                      LIVENESS
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSelfieModal(true)}
                    disabled={submitting}
                    className="w-full py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:opacity-95 shadow-md flex items-center justify-center gap-1.5 transition active:scale-[0.98] cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>
                      {!hasCheckedIn
                        ? 'Buka Kamera Swafoto (Absen Masuk)'
                        : !hasCheckedOut
                        ? 'Buka Kamera Swafoto (Absen Pulang)'
                        : 'Ambil Ulang Swafoto Kehadiran'}
                    </span>
                  </button>
                </div>

                {/* METODE 3: SCAN QR CODE (ALTERNATIF / CADANGAN) */}
                <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/50 p-3 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-amber-700" />
                      <div>
                        <h4 className="text-xs font-bold text-amber-950">Metode Alternatif: QR Code Pos Piket</h4>
                        <p className="text-[10px] text-amber-800">Opsi cadangan jika HP tidak memiliki GPS atau kamera selfie</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                      OPSIONAL
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="w-full py-2 px-3 rounded-xl font-bold text-xs text-amber-900 bg-amber-200/70 hover:bg-amber-200 border border-amber-300 flex items-center justify-center gap-1.5 transition active:scale-[0.98] cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Scan QR Code di Pos Piket / Gerbang</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: RIWAYAT KEHADIRAN (B11.1 & B11.2)                       */}
        {/* ============================================================== */}
        {activeTab === 'RIWAYAT' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* STATS SUMMARY TILES */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                <span className="text-[10px] text-emerald-700 font-semibold block">Tepat</span>
                <span className="font-extrabold text-base text-emerald-900">{stats.tepat}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-100">
                <span className="text-[10px] text-amber-700 font-semibold block">Telat</span>
                <span className="font-extrabold text-base text-amber-900">{stats.terlambat}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-blue-50 border border-blue-100">
                <span className="text-[10px] text-blue-700 font-semibold block">Izin</span>
                <span className="font-extrabold text-base text-blue-900">{stats.izin}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-100">
                <span className="text-[10px] text-rose-700 font-semibold block">Sakit</span>
                <span className="font-extrabold text-base text-rose-900">{stats.sakit}</span>
              </div>
            </div>

            {/* LIST RIWAYAT */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-800">Catatan Kehadiran Terbaru:</span>
                <span className="text-[10px] text-slate-400">Ketuk untuk lihat detail & foto</span>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-8 rounded-2xl bg-white border border-slate-200 text-xs text-slate-400">
                  Belum ada catatan riwayat presensi.
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      setSelectedDetail({
                        ...item,
                        muridNama: studentInfo?.nama,
                        kelasNama: studentInfo?.kelasNama,
                        nisn: studentInfo?.nisn,
                      })
                    }
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#087f5b] hover:shadow-sm transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.selfieUrl ? (
                        <div className="relative w-11 h-11 aspect-square rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img
                            src={item.selfieUrl}
                            alt="Swafoto"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className={cn(
                            'w-11 h-11 aspect-square rounded-xl flex items-center justify-center font-bold text-xs shrink-0',
                            item.status === 'TEPAT'
                              ? 'bg-[#e6fcf5] text-[#087f5b] ring-1 ring-[#96f2d7]'
                              : item.status === 'TERLAMBAT'
                              ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                              : 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                          )}
                        >
                          <CalendarCheck className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{item.tanggal}</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate font-mono">
                          Masuk: {item.jamMasuk || '-'} • Pulang: {item.jamPulang || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase',
                          item.status === 'TEPAT'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : item.status === 'TERLAMBAT'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-blue-100 text-blue-900 border border-blue-200'
                        )}
                      >
                        {item.status === 'TEPAT' ? 'Hadir' : item.status === 'TERLAMBAT' ? 'Telat' : item.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: PENGAJUAN IZIN / SAKIT MANDIRI (B12.1, B12.2, B13.1)    */}
        {/* ============================================================== */}
        {activeTab === 'IZIN' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="rounded-3xl bg-white p-4 border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Form Pengajuan Izin / Sakit Mandiri</h3>
                <p className="text-[11px] text-slate-500">
                  Permohonan akan otomatis diverifikasi oleh wali kelas & notifikasi dikirim ke Orang Tua.
                </p>
              </div>

              <form onSubmit={handleIzinSubmit} className="space-y-3.5">
                {/* PILIHAN JENIS PERMOHONAN (B12.1 vs B12.2) */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Jenis Permohonan (Wajib):
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIzinType('IZIN')}
                      className={cn(
                        'py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer',
                        izinType === 'IZIN'
                          ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20'
                          : 'bg-white border-slate-200 text-slate-600'
                      )}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Izin Keperluan (B12.1)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIzinType('SAKIT')}
                      className={cn(
                        'py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer',
                        izinType === 'SAKIT'
                          ? 'bg-amber-50 border-amber-500 text-amber-700 ring-2 ring-amber-500/20'
                          : 'bg-white border-slate-200 text-slate-600'
                      )}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Sakit / Rawat (B12.2)</span>
                    </button>
                  </div>
                </div>

                {/* TANGGAL */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tanggal Efektif Permohonan:
                  </label>
                  <input
                    type="date"
                    value={izinDate}
                    onChange={(e) => setIzinDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#087f5b]"
                    required
                  />
                </div>

                {/* KETERANGAN ALASAN */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Alasan / Keterangan Lengkap:
                  </label>
                  <textarea
                    rows={3}
                    value={izinReason}
                    onChange={(e) => setIzinReason(e.target.value)}
                    placeholder={
                      izinType === 'IZIN'
                        ? 'Contoh: Menghadiri acara pernikahan keluarga di luar kota...'
                        : 'Contoh: Sakit demam tinggi sejak semalam, periksa ke dokter puskesmas...'
                    }
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#087f5b]"
                    required
                  />
                </div>

                {/* UPLOAD LAMPIRAN SURAT DOKTER / SURAT ORANG TUA (B13.1) */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Upload Berkas Bukti / Surat Izin / Surat Dokter (B13.1):
                  </label>

                  <div className="relative border-2 border-dashed border-slate-300 hover:border-[#087f5b] rounded-2xl p-4 bg-slate-50 text-center transition">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleAttachmentChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />

                    {attachmentPreview ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={attachmentPreview}
                          alt="Preview Lampiran"
                          className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                        />
                        <div className="text-left min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {attachmentFile?.name}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {attachmentFile ? `${(attachmentFile.size / 1024).toFixed(1)} KB` : ''}
                          </p>
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                            <Check className="w-3 h-3" /> Berkas siap diunggah
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                          <Upload className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">Pilih Berkas atau Foto Surat</span>
                        <span className="text-[10px] text-slate-400">JPG, PNG, atau WebP (Maksimal 5MB)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* WHATSAPP NOTIFICATION INFO BANNER (B13.1 & B14.1) */}
                <div className="p-3 rounded-2xl bg-[#e6fcf5] border border-[#96f2d7] text-xs text-[#087f5b] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <MessageSquare className="w-4 h-4" />
                    <span>Notifikasi Otomatis WhatsApp Orang Tua</span>
                  </div>
                  <p className="text-[11px] text-[#2b8a3e] leading-snug">
                    Saat formulir dikirim, notifikasi resmi WhatsApp akan otomatis dikirimkan ke nomor Orang Tua / Wali yang terdaftar.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#087f5b] to-[#12b886] text-white text-xs font-bold shadow-md hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.99]"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{uploadingAttachment ? 'Mengunggah Berkas...' : 'Mengirimkan Pengajuan...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirimkan Pengajuan Mandiri</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* MODAL SWAFOTO DENGAN WATERMARK KOORDINAT OTOMATIS (A12.1 – A12.8) */}
      <SelfieCameraModal
        isOpen={showSelfieModal}
        onClose={() => setShowSelfieModal(false)}
        onCaptureComplete={handleSelfieCaptureComplete}
        userName={studentInfo?.nama || 'Siswa SMAN 20'}
        userNisn={studentInfo?.nisn || '0080000001'}
        userClass={studentInfo?.kelasNama || 'X.1'}
        currentCoords={userCoords}
      />

      {/* MODAL SCAN QR CODE ALTERNATIF POS PIKET */}
      <QrScannerModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        onScanSuccess={handleQrScanSuccess}
      />

      {/* MODAL DETAIL RIWAYAT KEHADIRAN (B11.2) */}
      <AttendanceDetailModal
        isOpen={Boolean(selectedDetail)}
        onClose={() => setSelectedDetail(null)}
        data={selectedDetail}
      />
    </>
  );
}
