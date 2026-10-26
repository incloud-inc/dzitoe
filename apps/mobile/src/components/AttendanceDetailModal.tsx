'use client';

import React from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Camera,
  ShieldCheck,
  CheckCircle2,
  FileText,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AttendanceDetailData {
  id: string;
  tanggal: string;
  jamMasuk: string | null;
  jamPulang: string | null;
  status: 'HADIR' | 'TEPAT' | 'PARSIAL' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'ALPA';
  latitude?: number | null;
  longitude?: number | null;
  distanceFromSchool?: number | null;
  isWithinRadius?: boolean;
  selfieUrl?: string | null;
  watermarkText?: string | null;
  notes?: string | null;
  method?: 'GPS' | 'SELFIE' | 'QR';
  attachmentUrl?: string | null;
  livenessVerified?: boolean;
  parentNotified?: boolean;
  parentNotificationPhone?: string | null;
  muridNama?: string;
  kelasNama?: string;
  nisn?: string;
}

interface AttendanceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AttendanceDetailData | null;
}

export function AttendanceDetailModal({ isOpen, onClose, data }: AttendanceDetailModalProps) {
  if (!isOpen || !data) return null;

  const isSelfie = data.method === 'SELFIE' || Boolean(data.selfieUrl);
  const isQr = data.method === 'QR';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-[32px] sm:rounded-3xl bg-white border border-slate-200 p-5 shadow-2xl relative space-y-4 font-sans text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                'w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shadow-xs',
                data.status === 'TEPAT'
                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                  : data.status === 'TERLAMBAT'
                  ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                  : 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
              )}
            >
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Detail Presensi</h3>
              <p className="text-[11px] text-slate-500 font-medium">{data.tanggal}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status & Method Badges */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Status Kehadiran:</span>
            <span
              className={cn(
                'px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider',
                data.status === 'TEPAT'
                  ? 'bg-emerald-600 text-white'
                  : data.status === 'TERLAMBAT'
                  ? 'bg-amber-500 text-white'
                  : 'bg-blue-600 text-white'
              )}
            >
              {data.status}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200/80 text-slate-700 border border-slate-300/60">
            {isSelfie ? (
              <>
                <Camera className="w-3 h-3 text-[#087f5b]" />
                <span>Swafoto</span>
              </>
            ) : isQr ? (
              <>
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>QR Piket</span>
              </>
            ) : (
              <>
                <MapPin className="w-3 h-3 text-blue-600" />
                <span>GPS Radius</span>
              </>
            )}
          </span>
        </div>

        {/* Time Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold block flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-600" />
              <span>Jam Masuk (KBM)</span>
            </span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {data.jamMasuk || 'Tidak Tercatat'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold block flex items-center gap-1">
              <Clock className="w-3 h-3 text-indigo-600" />
              <span>Jam Pulang</span>
            </span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {data.jamPulang || 'Belum Pulang'}
            </span>
          </div>
        </div>

        {/* Foto Swafoto Ber-Watermark (A12.6) */}
        {data.selfieUrl && (
          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-950 p-2.5 space-y-2">
            <div className="flex items-center justify-between text-xs px-1 text-slate-300">
              <span className="font-bold flex items-center gap-1.5 text-white">
                <Camera className="w-3.5 h-3.5 text-[#12b886]" />
                <span>Swafoto Watermark Koordinat</span>
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Liveness Verified</span>
              </span>
            </div>

            <div className="relative aspect-[3/4] max-w-xs mx-auto w-full rounded-xl overflow-hidden bg-black border border-slate-800">
              <img
                src={data.selfieUrl}
                alt="Foto Swafoto Presensi"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm',
                    data.status === 'TEPAT'
                      ? 'bg-emerald-600 text-white'
                      : data.status === 'TERLAMBAT'
                      ? 'bg-amber-500 text-white'
                      : 'bg-blue-600 text-white'
                  )}
                >
                  {data.status === 'TEPAT' ? 'Hadir Tepat Waktu' : data.status}
                </span>
              </div>
            </div>

            {data.watermarkText && (
              <p className="text-[10px] text-slate-400 font-mono bg-slate-900/90 p-2 rounded-lg leading-relaxed border border-slate-800">
                {data.watermarkText}
              </p>
            )}
          </div>
        )}

        {/* GPS Coordinates Info */}
        {data.latitude && data.longitude && (
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Koordinat Geotag:</span>
              </span>
              <span className="font-mono text-slate-800 font-bold text-[11px]">
                {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
              </span>
            </div>
            {typeof data.distanceFromSchool === 'number' && (
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                <span>Jarak ke Gerbang SMAN 20:</span>
                <span className="font-bold text-emerald-700">±{data.distanceFromSchool} meter</span>
              </div>
            )}
          </div>
        )}

        {/* Dokumen Lampiran (Surat Dokter / Izin Orang Tua) */}
        {data.attachmentUrl && (
          <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Lampiran Dokumen Surat</span>
              </span>
              <a
                href={data.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-indigo-600 font-bold hover:underline flex items-center gap-0.5"
              >
                <span>Lihat Penuh</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="h-32 rounded-xl overflow-hidden bg-white border border-indigo-200/80 flex items-center justify-center">
              <img
                src={data.attachmentUrl}
                alt="Lampiran Surat"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Status Notifikasi WhatsApp Orang Tua (B13.1) */}
        <div className="p-3 rounded-2xl bg-[#e6fcf5] border border-[#96f2d7] text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#087f5b] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#087f5b]" />
              <span>Notifikasi WhatsApp Orang Tua</span>
            </span>
            <span className="text-[10px] bg-[#087f5b] text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Terkirim</span>
            </span>
          </div>
          <p className="text-[11px] text-[#2b8a3e] leading-snug">
            Sistem otomatis mengirimkan rekap absensi kehadiran ke nomor WhatsApp Orang Tua / Wali murid tercatat.
          </p>
        </div>

        {/* Notes */}
        {data.notes && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <span className="text-[10px] text-slate-400 font-bold block mb-0.5">Catatan Kehadiran:</span>
            <p className="text-slate-700 italic">{data.notes}</p>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition active:scale-[0.99]"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
