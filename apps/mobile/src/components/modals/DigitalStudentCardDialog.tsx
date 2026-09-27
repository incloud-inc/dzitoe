'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { QrCode, ShieldCheck } from 'lucide-react';
import { PROFIL_MURID } from '@/lib/data';

interface DigitalStudentCardDialogProps {
  children?: React.ReactNode;
}

export function DigitalStudentCardDialog({ children }: DigitalStudentCardDialogProps) {
  const [countdown, setCountdown] = React.useState(45);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <button
            type="button"
            className="flex items-center gap-2 rounded-2xl bg-white/15 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-95 dz-interactive-mobile shadow-sm"
          >
            <QrCode className="h-4 w-4 text-emerald-300" />
            <span>Kartu Pelajar</span>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm rounded-[2rem] p-6 bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 text-white border-white/10 shadow-2xl">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center justify-between pr-8">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              SMAN 20 Kab. Tangerang
            </span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-semibold text-emerald-300">
              <ShieldCheck className="h-3 w-3" />
              Terverifikasi
            </span>
          </div>
          <DialogTitle className="text-lg font-bold text-white">
            Kartu Murid Digital
          </DialogTitle>
        </DialogHeader>

        {/* Kartu Fisik Digital Style */}
        <div className="relative mt-2 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-brand-700 to-indigo-900 p-5 shadow-lg border border-white/20">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-emerald-100">Fase F · Angkatan 2024</p>
              <h4 className="text-base font-bold text-white mt-0.5">{PROFIL_MURID.nama}</h4>
              <p className="text-xs text-white/80 font-mono mt-0.5">NISN: {PROFIL_MURID.nisn}</p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 text-white font-black text-sm shadow-inner">
              20
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3 text-[11px]">
            <div>
              <span className="text-emerald-200/80 block text-[9px]">Kelas & Jurusan</span>
              <span className="font-semibold text-white">{PROFIL_MURID.kelas}</span>
            </div>
            <div>
              <span className="text-emerald-200/80 block text-[9px]">Wali Kelas</span>
              <span className="font-semibold text-white">{PROFIL_MURID.waliKelas}</span>
            </div>
          </div>
        </div>

        {/* QR Code Interaktif untuk Presensi Gerbang & Kelas */}
        <div className="mt-3 flex flex-col items-center justify-center rounded-2xl bg-white p-5 text-slate-900 shadow-md">
          {/* Simulated QR Pattern */}
          <div className="relative grid h-44 w-44 place-items-center rounded-xl bg-slate-50 border-2 border-dashed border-emerald-500/40 p-2">
            <svg viewBox="0 0 100 100" className="h-full w-full text-slate-900" fill="currentColor">
              {/* Corner position markers */}
              <rect x="5" y="5" width="25" height="25" rx="3" />
              <rect x="9" y="9" width="17" height="17" rx="2" fill="white" />
              <rect x="13" y="13" width="9" height="9" rx="1" />

              <rect x="70" y="5" width="25" height="25" rx="3" />
              <rect x="74" y="9" width="17" height="17" rx="2" fill="white" />
              <rect x="78" y="13" width="9" height="9" rx="1" />

              <rect x="5" y="70" width="25" height="25" rx="3" />
              <rect x="9" y="74" width="17" height="17" rx="2" fill="white" />
              <rect x="13" y="78" width="9" height="9" rx="1" />

              {/* Data blocks */}
              <rect x="35" y="10" width="8" height="8" />
              <rect x="47" y="15" width="8" height="8" />
              <rect x="35" y="25" width="8" height="8" />
              <rect x="52" y="25" width="8" height="8" />

              <rect x="15" y="38" width="8" height="8" />
              <rect x="27" y="44" width="8" height="8" />
              <rect x="40" y="40" width="20" height="20" rx="3" fill="#0a9066" />
              <rect x="65" y="42" width="8" height="8" />
              <rect x="78" y="38" width="8" height="8" />

              <rect x="35" y="65" width="8" height="8" />
              <rect x="48" y="70" width="8" height="8" />
              <rect x="62" y="65" width="8" height="8" />
              <rect x="75" y="75" width="8" height="8" />
              <rect x="85" y="65" width="8" height="8" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="rounded-md bg-white/95 px-1.5 py-0.5 text-[8px] font-black text-brand-700 shadow-sm border border-brand-200">
                DZITOE
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>QR Dinamis diperbarui dalam <strong className="text-slate-900 font-mono">{countdown}d</strong></span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 text-center">
            Pindai pada gerbang utama atau meja piket SMAN 20
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
