import type { Metadata } from 'next';
import { CalendarCheck, Camera, Clock, MapPin, ScanFace } from 'lucide-react';

import PageHeader from '@/components/PageHeader';
import SectionHeader from '@/components/SectionHeader';
import {
  KEHADIRAN_HARI_INI,
  RIWAYAT_KEHADIRAN,
  type StatusKehadiran,
} from '@/lib/data';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Absensi',
  description: 'Ambil kehadiran harian Murid dengan verifikasi GPS dan swafoto.',
};

const STATUS_STYLE: Record<StatusKehadiran, { label: string; className: string }> = {
  hadir: { label: 'Hadir', className: 'bg-brand-50 text-brand-700' },
  terlambat: { label: 'Terlambat', className: 'bg-amber-50 text-amber-700' },
  izin: { label: 'Izin', className: 'bg-sky-50 text-sky-700' },
  sakit: { label: 'Sakit', className: 'bg-violet-50 text-violet-700' },
  alpa: { label: 'Alpa', className: 'bg-rose-50 text-rose-700' },
};

export default function AbsensiPage() {
  return (
    <>
      <PageHeader title="Absensi" subtitle="Kehadiran Murid" />

      <div className="space-y-6 px-4 pt-4">
        {/* Kartu verifikasi */}
        <section
          aria-labelledby="verifikasi-heading"
          className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-card"
        >
          <h2
            id="verifikasi-heading"
            className="text-[15px] font-semibold text-slate-900"
          >
            Verifikasi Kehadiran
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Kehadiran dicatat dengan titik lokasi GPS dan swafoto Murid.
          </p>

          {/* Placeholder Peta GPS */}
          <div className="relative mt-3 h-40 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-100 via-brand-50 to-sky-100">
            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgb(10 115 84 / 0.35) 1px, transparent 0)',
                backgroundSize: '16px 16px',
              }}
            />
            <div className="absolute inset-0 grid place-items-center">
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-md">
                  <MapPin className="h-6 w-6 text-brand-700" aria-hidden />
                </span>
                <p className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-slate-700 backdrop-blur">
                  Dalam radius sekolah · ±18 m
                </p>
              </div>
            </div>
          </div>

          {/* Placeholder Swafoto */}
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-white text-slate-400 shadow-sm">
              <Camera className="h-6 w-6" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-700">
                Swafoto terverifikasi
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                Kamera aktif untuk verifikasi wajah & geotagging otomatis.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            <ScanFace className="h-4 w-4" aria-hidden />
            Ambil Kehadiran
          </button>

          <p className="mt-2 text-center text-[11px] text-slate-400">
            Terakhir tercatat {KEHADIRAN_HARI_INI.jamMasuk} WIB · {KEHADIRAN_HARI_INI.metode}
          </p>
        </section>

        {/* Riwayat */}
        <section aria-labelledby="riwayat-heading">
          <SectionHeader
            id="riwayat-heading"
            title="Riwayat Kehadiran"
            subtitle="5 catatan terakhir"
          />

          <ul className="space-y-2.5">
            {RIWAYAT_KEHADIRAN.map((item) => {
              const gaya = STATUS_STYLE[item.status];
              return (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-card"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
                    {item.status === 'hadir' ? (
                      <CalendarCheck className="h-4 w-4" aria-hidden />
                    ) : (
                      <Clock className="h-4 w-4" aria-hidden />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {item.hari}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                      {item.tanggal} · {item.keterangan}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={cn(
                        'inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        gaya.className,
                      )}
                    >
                      {gaya.label}
                    </span>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {item.jamMasuk ? `${item.jamMasuk} WIB` : '—'}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </>
  );
}
