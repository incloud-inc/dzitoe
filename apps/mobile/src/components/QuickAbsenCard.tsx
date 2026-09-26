'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Loader2,
  MapPin,
  ScanFace,
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
      timerRef.current = window.setTimeout(() => setTahap('swafoto'), 1200);
    } else if (tahap === 'swafoto') {
      timerRef.current = window.setTimeout(() => setTahap('selesai'), 1200);
    }

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [tahap]);

  const mulaiAbsen = useCallback(() => {
    setTahap((prev) => (prev === 'idle' ? 'lokasi' : prev));
  }, []);

  const selesai = tahap === 'selesai';
  const berjalan = tahap === 'lokasi' || tahap === 'swafoto';

  return (
    <section
      aria-labelledby="absen-cepat-title"
      className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2
            id="absen-cepat-title"
            className="text-[15px] font-semibold text-slate-900"
          >
            Absen Cepat
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Verifikasi lokasi GPS dan swafoto kehadiran.
          </p>
        </div>

        <span
          className={cn(
            'grid h-10 w-10 shrink-0 place-items-center rounded-2xl',
            selesai ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-500',
          )}
        >
          <ScanFace className="h-5 w-5" aria-hidden />
        </span>
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

      <button
        type="button"
        onClick={mulaiAbsen}
        disabled={tahap !== 'idle'}
        className={cn(
          'mt-3 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          selesai
            ? 'bg-brand-50 text-brand-700'
            : berjalan
              ? 'cursor-wait bg-slate-100 text-slate-500'
              : 'bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700 active:scale-[0.99]',
        )}
      >
        {tahap === 'idle' && (
          <>
            <ScanFace className="h-4 w-4" aria-hidden />
            Absen Sekarang
          </>
        )}
        {tahap === 'lokasi' && (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Mengambil lokasi…
          </>
        )}
        {tahap === 'swafoto' && (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Menyiapkan swafoto…
          </>
        )}
        {selesai && (
          <>
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            Kehadiran tercatat {KEHADIRAN_HARI_INI.jamMasuk}
          </>
        )}
      </button>

      {selesai ? (
        <p className="mt-2 text-center text-[11px] text-brand-700">
          Masuk {KEHADIRAN_HARI_INI.jamMasuk} WIB · {KEHADIRAN_HARI_INI.metode}
        </p>
      ) : (
        <Link
          href="/absensi"
          className="mt-2 flex items-center justify-center gap-1 text-[11px] font-medium text-slate-500 transition hover:text-brand-700"
        >
          Lihat riwayat absensi
          <ArrowRight className="h-3 w-3" aria-hidden />
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
        'flex items-center gap-2 rounded-xl border px-2.5 py-2 text-[11px] font-medium',
        status === 'selesai'
          ? 'border-brand-200 bg-brand-50 text-brand-700'
          : status === 'proses'
            ? 'border-amber-200 bg-amber-50 text-amber-700'
            : 'border-slate-200 bg-slate-50 text-slate-500',
      )}
    >
      {status === 'proses' ? (
        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden />
      ) : (
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
      )}
      <span className="truncate">{label}</span>
      {status === 'selesai' ? (
        <CheckCircle2 className="ml-auto h-3.5 w-3.5 shrink-0" aria-hidden />
      ) : null}
    </div>
  );
}
