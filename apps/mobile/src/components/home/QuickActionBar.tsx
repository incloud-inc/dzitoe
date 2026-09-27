'use client';

import * as React from 'react';
import Link from 'next/link';
import { GpsAttendanceDialog } from '@/components/modals/GpsAttendanceDialog';
import { DigitalStudentCardDialog } from '@/components/modals/DigitalStudentCardDialog';
import {
  MapPin,
  QrCode,
  CreditCard,
  CalendarCheck,
} from 'lucide-react';

export function QuickActionBar() {
  return (
    <section className="space-y-2" aria-label="Aksi Cepat">
      <div className="grid grid-cols-4 gap-2">
        {/* Presensi GPS Modal */}
        <GpsAttendanceDialog>
          <button
            type="button"
            className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-2.5 shadow-sm border border-slate-100 transition-all hover:shadow-card hover:-translate-y-0.5 active:scale-95 dz-interactive-mobile group"
          >
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">
              Presensi GPS
            </span>
          </button>
        </GpsAttendanceDialog>

        {/* Kartu Pelajar QR Modal */}
        <DigitalStudentCardDialog>
          <button
            type="button"
            className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-2.5 shadow-sm border border-slate-100 transition-all hover:shadow-card hover:-translate-y-0.5 active:scale-95 dz-interactive-mobile group"
          >
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <QrCode className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">
              Kartu QR
            </span>
          </button>
        </DigitalStudentCardDialog>

        {/* Riwayat Absensi */}
        <Link
          href="/absensi"
          className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-2.5 shadow-sm border border-slate-100 transition-all hover:shadow-card hover:-translate-y-0.5 active:scale-95 dz-interactive-mobile group"
        >
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-600 shadow-sm border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">
            Absensi
          </span>
        </Link>

        {/* Tagihan SPP */}
        <Link
          href="/tagihan"
          className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-2.5 shadow-sm border border-slate-100 transition-all hover:shadow-card hover:-translate-y-0.5 active:scale-95 dz-interactive-mobile group"
        >
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-50 text-rose-600 shadow-sm border border-rose-100 group-hover:bg-rose-600 group-hover:text-white transition-colors">
            <CreditCard className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">
            Tagihan
          </span>
        </Link>
      </div>
    </section>
  );
}
