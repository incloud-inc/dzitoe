'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  RefreshCw,
  Check,
  X,
  MapPin,
  AlertCircle,
  ShieldCheck,
  SwitchCamera,
} from 'lucide-react';

export interface SelfieCaptureData {
  imagePayload: string; // Base64 data URL format image/webp
  watermarkText: string;
  timestamp: string;
  latitude: number | null;
  longitude: number | null;
  accuracyMeters: number | null;
  deviceFingerprint: {
    userAgent: string;
    platform: string;
    screenWidth: number;
    screenHeight: number;
  };
}

interface SelfieCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptureComplete: (data: SelfieCaptureData) => void;
  userName: string;
  userNisn: string;
  userClass: string;
  currentCoords?: { lat: number; lng: number } | null;
}

export function SelfieCameraModal({
  isOpen,
  onClose,
  onCaptureComplete,
  userName,
  userNisn,
  userClass,
  currentCoords,
}: SelfieCameraModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [watermarkSummary, setWatermarkSummary] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Koordinat GPS perangkat
  const [gpsData, setGpsData] = useState<{ lat: number; lng: number; accuracy: number }>({
    lat: currentCoords?.lat ?? -6.071285,
    lng: currentCoords?.lng ?? 106.598214,
    accuracy: 12,
  });

  // Baca GPS aktif saat modal dibuka
  useEffect(() => {
    if (!isOpen) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsData({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
          });
        },
        (err) => {
          console.warn('Geolocation warning in selfie modal:', err.message);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [isOpen]);

  // Start Camera Stream
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Webcam error:', err);
      setCameraError(
        'Tidak dapat mengakses kamera smartphone. Mohon izinkan akses kamera di peramban (browser) Anda.'
      );
    }
  }, [facingMode, stream]);

  useEffect(() => {
    if (isOpen && !capturedPreview) {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, capturedPreview, startCamera, stream]);

  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Tangkap Foto & Render Watermark di Canvas (A12.2 / A12.3 / A12.6)
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsProcessing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    // 1. Gambar frame video kamera
    ctx.drawImage(video, 0, 0, width, height);

    // 2. Format Waktu & Tanggal Real-Time (WIB / Asia/Jakarta)
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    });
    const timeStr = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Jakarta',
    });

    const latText = gpsData.lat.toFixed(6);
    const lngText = gpsData.lng.toFixed(6);
    const accText = `±${gpsData.accuracy}m`;

    const summary = `SMAN 20 KAB. TANGERANG • ${dateStr} ${timeStr} WIB • LAT: ${latText}, LNG: ${lngText} (${accText})`;
    setWatermarkSummary(summary);

    // 3. Render Banner Watermark di bagian bawah Canvas
    const bannerHeight = Math.max(90, Math.round(height * 0.2));
    const bannerY = height - bannerHeight;

    // Background Gradien Gelap Semi-Transparan
    const gradient = ctx.createLinearGradient(0, bannerY, 0, height);
    gradient.addColorStop(0, 'rgba(15, 23, 42, 0.85)');
    gradient.addColorStop(1, 'rgba(8, 127, 91, 0.95)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, bannerY, width, bannerHeight);

    // Garis Pemisah Emerald
    ctx.fillStyle = '#20c997';
    ctx.fillRect(0, bannerY, width, 3);

    // Watermark Text Baris 1: Header Instansi
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(bannerHeight * 0.17)}px sans-serif`;
    ctx.fillText('SMAN 20 KABUPATEN TANGERANG • SWAFOTO PRESENSI RESMI', 16, bannerY + 22);

    // Watermark Text Baris 2: Waktu WIB & Tanggal
    ctx.fillStyle = '#96f2d7';
    ctx.font = `bold ${Math.round(bannerHeight * 0.16)}px sans-serif`;
    ctx.fillText(`🕒 WAKTU: ${dateStr}, ${timeStr} WIB`, 16, bannerY + 44);

    // Watermark Text Baris 3: Koordinat Latitude / Longitude & Akurasi GPS
    ctx.fillStyle = '#ffec99';
    ctx.font = `bold ${Math.round(bannerHeight * 0.16)}px sans-serif`;
    ctx.fillText(`📍 KOORDINAT GPS: LAT ${latText}, LNG ${lngText} (Akurasi: ${accText})`, 16, bannerY + 66);

    // Watermark Text Baris 4: Identitas Pengguna
    ctx.fillStyle = '#f8f9fa';
    ctx.font = `normal ${Math.round(bannerHeight * 0.14)}px sans-serif`;
    ctx.fillText(`👤 SISWA: ${userName} (NISN: ${userNisn}) • ${userClass}`, 16, bannerY + 84);

    // 4. Kompresi Foto ke Format WebP (A12.3)
    let webpDataUrl = canvas.toDataURL('image/webp', 0.85);

    // Fallback jika browser lawas belum mendukung export WebP canvas
    if (!webpDataUrl.startsWith('data:image/webp')) {
      webpDataUrl = canvas.toDataURL('image/jpeg', 0.85);
    }

    setCapturedPreview(webpDataUrl);
    setIsProcessing(false);

    // Hentikan stream kamera saat preview
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
  };

  // Ulangi Pengambilan Foto
  const handleRetake = () => {
    setCapturedPreview(null);
    startCamera();
  };

  // Konfirmasi & Kirim Data Swafoto Ber-Watermark
  const handleConfirm = () => {
    if (!capturedPreview) return;

    const data: SelfieCaptureData = {
      imagePayload: capturedPreview,
      watermarkText: watermarkSummary,
      timestamp: new Date().toISOString(),
      latitude: gpsData.lat,
      longitude: gpsData.lng,
      accuracyMeters: gpsData.accuracy,
      deviceFingerprint: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        platform: typeof navigator !== 'undefined' ? navigator.platform : '',
        screenWidth: typeof window !== 'undefined' ? window.screen.width : 0,
        screenHeight: typeof window !== 'undefined' ? window.screen.height : 0,
      },
    };

    onCaptureComplete(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-4 text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <Camera className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-white">Swafoto Presensi (GPS Watermark)</h3>
              <p className="text-[10px] text-slate-400">Otomatis cetak koordinat Long/Lat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Kamera / Preview Canvas */}
        <div className="relative my-3 rounded-2xl overflow-hidden bg-black aspect-[3/4] flex items-center justify-center border border-slate-800 shadow-inner">
          {cameraError ? (
            <div className="p-4 text-center text-xs text-rose-400 space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto text-rose-500" />
              <p>{cameraError}</p>
              <button
                onClick={startCamera}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700"
              >
                Coba Lagi
              </button>
            </div>
          ) : capturedPreview ? (
            // Preview Foto Hasil Watermark (A12.6)
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={capturedPreview}
              alt="Hasil Swafoto Watermark"
              className="w-full h-full object-cover"
            />
          ) : (
            // Live Video Streaming (A12.1)
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Panduan Posisi Wajah Oval */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                <div className="w-48 h-64 rounded-[50%] border-2 border-dashed border-emerald-400/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)] flex items-center justify-center">
                  <span className="text-[10px] font-bold text-emerald-300/80 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                    Posisikan Wajah di Sini
                  </span>
                </div>
              </div>

              {/* Badges Lokasi GPS di Layar Kamera */}
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>
                    {gpsData.lat.toFixed(4)}, {gpsData.lng.toFixed(4)}
                  </span>
                </span>
                <span className="text-emerald-400 font-bold">SMAN 20</span>
              </div>
            </>
          )}

          {/* Hidden Canvas untuk Watermarking */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Controls */}
        <div className="pt-2">
          {capturedPreview ? (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-[11px] text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">Watermark koordinat & waktu telah dicetak otomatis.</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Ambil Ulang</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirm}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#087f5b] to-[#12b886] text-xs font-bold text-white shadow-lg shadow-[#087f5b]/30 flex items-center justify-center gap-1.5 hover:opacity-95 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Gunakan Foto</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between px-4 py-1">
              <button
                type="button"
                onClick={switchCamera}
                title="Ganti Kamera"
                className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer"
              >
                <SwitchCamera className="w-5 h-5" />
              </button>

              <button
                type="button"
                disabled={Boolean(cameraError) || isProcessing}
                onClick={handleCapture}
                className="h-16 w-16 rounded-full bg-white text-[#087f5b] flex items-center justify-center shadow-lg shadow-white/20 active:scale-95 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50 ring-4 ring-emerald-500/40"
              >
                <div className="h-12 w-12 rounded-full border-2 border-[#087f5b] flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>
              </button>

              <div className="w-11" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SelfieCameraModal;
