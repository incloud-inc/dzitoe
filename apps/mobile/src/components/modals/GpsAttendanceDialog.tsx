'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MapPin, Camera, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { KEHADIRAN_HARI_INI } from '@/lib/data';

interface GpsAttendanceDialogProps {
  children?: React.ReactNode;
}

export function GpsAttendanceDialog({ children }: GpsAttendanceDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);

  const handlePresensi = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDone(true);
      setTimeout(() => {
        setIsDone(false);
        setIsOpen(false);
      }, 1500);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <button
            type="button"
            className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/90 p-3 shadow-card transition-all hover:bg-white active:scale-95 dz-interactive-mobile"
          >
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-800">Presensi GPS</span>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm rounded-[2rem] p-6 bg-white border-slate-100 shadow-2xl">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
            <ShieldCheck className="h-3.5 w-3.5" />
            Geofence Presensi Realtime
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900">
            Presensi Masuk Sekolah
          </DialogTitle>
        </DialogHeader>

        {isDone ? (
          <div className="py-8 flex flex-col items-center justify-center text-center animate-in zoom-in-95">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 mb-3 shadow-inner">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Presensi Berhasil Dicatat!</h4>
            <p className="text-xs text-slate-500 mt-1">
              Status kehadiran hari ini telah sinkron dengan sistem tata kelola sekolah.
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-1">
            {/* Lokasi & Geofence Status */}
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold text-emerald-900">Dalam Radius Sekolah</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-0.5 leading-snug">
                    {KEHADIRAN_HARI_INI.lokasi} (Akurasi: ± 4 meter)
                  </p>
                </div>
              </div>
            </div>

            {/* Kamera Swafoto Preview */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 aspect-video flex flex-col items-center justify-center text-white/80 border border-slate-800">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              <Camera className="h-8 w-8 text-emerald-400 mb-2" />
              <span className="text-xs font-medium">Kamera AI Siap Verifikasi Wajah</span>
              <span className="text-[10px] text-white/50">Anti-Spoofing & Deteksi Biometrik Aktif</span>
            </div>

            {/* Tombol Aksi */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handlePresensi}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition-all hover:brightness-105 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memverifikasi Lokasi & Wajah...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Kirim Presensi Sekarang</span>
                </>
              )}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
