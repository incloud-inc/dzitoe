'use client';

import { useEffect, useState } from 'react';
import { formatTanggalPanjang, getSalam } from '@/lib/utils';

export default function TodayGreeting({ nama }: { nama: string }) {
  const [sekarang, setSekarang] = useState<Date | null>(null);
  const namaPanggilan = nama.split(' ')[0] || nama;

  useEffect(() => {
    setSekarang(new Date());
    const id = window.setInterval(() => setSekarang(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="min-w-0">
      <p className="truncate text-[12px] font-medium text-white/70">
        {sekarang ? formatTanggalPanjang(sekarang) : '\u00A0'}
      </p>
      <p className="truncate text-[15px] font-semibold leading-snug">
        {sekarang ? `${getSalam(sekarang)}, ${namaPanggilan}!` : `Halo, ${namaPanggilan}!`}
      </p>
    </div>
  );
}
