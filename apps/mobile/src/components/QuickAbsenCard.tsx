'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  ScanFace,
  ShieldCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { KEHADIRAN_HARI_INI } from '@/lib/data';
import { cn } from '@/lib/utils';

type Tahap = 'idle' | 'lokasi' | 'swafoto' | 'selesai';
type ChipStatus = 'menunggu' | 'proses' | 'selesai';

export default function QuickAbsenCard() {
  const [tahap, setTahap] = useState<Tahap>('idle');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (tahap === 'lokasi') {
      timerRef.current = window.setTimeout(() => {
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate?.(20);
        }
        setTahap('swafoto');
      }, 1000);
    } else if (tahap === 'swafoto') {
      timerRef.current = window.setTimeout(() => {
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate?.([20, 50, 20]);
        }
        setTahap('selesai');
      }, 1000);
    }

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [tahap]);

  const mulaiAbsen = useCallback(() => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(25);
    }
    setTahap((prev) => (prev === 'idle' ? 'lokasi' : prev));
  }, []);

  const selesai = tahap === 'selesai';
  const berjalan = tahap === 'lokasi' || tahap === 'swafoto';

  return (
    <section
      aria-labelledby="absen-cepat-title"
      className="dz-card-surface p-5 shadow-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Presensi Mandiri Murid</span>
          </div>
          <h2
            id="absen-cepat-title"
            className="mt-0.5 text-base font-bold text-slate-900"
          >
            Absensi Hari Ini
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Fasilitasi Belajar · Disiplin Positif SMAN 20
          </p>
        </div>

        <span
          className={cn(
            'grid h-11 w-11 shrink-0 place-items-center rounded-2xl shadow-xs transition-colors',
            selesai ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200' : 'bg-slate-100 text-slate-600',
          )}
        >
          <ScanFace className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      {/* Geofence info badge */}
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-[11px] text-slate-600 border border-slate-100">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
        <span className="truncate">Radius Sekolah SMAN 20: <strong>Terdeteksi (15 meter)</strong></span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <LangkahChip
          icon={MapPin}
          label="Lokasi GPS"
          status={tahap === 'idle' ? 'menunggu' : tahap === 'lokasi' ? 'proses' : 'selesai'}
        />
        <LangkahChip
          icon={Camera}
          label="Swafoto"
          status={
            tahap === 'swafoto' ? 'proses' : selesai ? 'selesai' : 'menunggu'
          }
        />
      </div>

      {/* Tombol Aksi — Memenuhi WCAG 2.5.5 Touch Target (min-h-12 / 48px) */}
      <button
        type="button"
        onClick={mulaiAbsen}
        disabled={tahap !== 'idle'}
        className={cn(
          'mt-3.5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-transform duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          selesai
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : berjalan
              ? 'cursor-wait bg-slate-100 text-slate-500'
              : 'bg-brand-600 text-white shadow-md shadow-brand-600/25 active:scale-[0.97] hover:bg-brand-700',
        )}
      >
        {tahap === 'idle' && (
          <>
            <ScanFace className="h-4 w-4" aria-hidden="true" />
            <span>Absen Sekarang</span>
          </>
        )}
        {tahap === 'lokasi' && (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-brand-600" aria-hidden="true" />
            <span>Memverifikasi radius lokasi…</span>
          </>
        )}
        {tahap === 'swafoto' && (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-brand-600" aria-hidden="true" />
            <span>Memvalidasi swafoto…</span>
          </>
        )}
        {selesai && (
          <>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <span>Kehadiran Tercatat ({KEHADIRAN_HARI_INI.jamMasuk})</span>
          </>
        )}
      </button>

      {selesai ? (
        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] font-medium text-emerald-700">
          <Clock className="h-3 w-3" />
          <span>Masuk pukul {KEHADIRAN_HARI_INI.jamMasuk} WIB · {KEHADIRAN_HARI_INI.metode}</span>
        </div>
      ) : (
        <Link
          href="/absensi"
          className="mt-2.5 flex items-center justify-center gap-1 text-[11px] font-medium text-slate-500 transition-colors hover:text-brand-700"
        >
          <span>Lihat rekap presensi bulan ini</span>
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      )}
    </section>
  );
}

function LangkahChip({
  icon: Icon,
  label,
  status,
}: {
  icon: LucideIcon;
  label: string;
  status: ChipStatus;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-medium transition-colors',
        status === 'selesai'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : status === 'proses'
            ? 'border-amber-200 bg-amber-50 text-amber-800'
            : 'border-slate-200 bg-slate-50/70 text-slate-500',
      )}
    >
      {status === 'proses' ? (
        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-amber-600" aria-hidden="true" />
      ) : (
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      )}
      <span className="truncate">{label}</span>
      {status === 'selesai' ? (
        <CheckCircle2 className="ml-auto h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
      ) : null}
    </div>
  );
}
