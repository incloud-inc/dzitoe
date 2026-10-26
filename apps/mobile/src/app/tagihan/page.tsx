import type { Metadata } from 'next';
import { ArrowRight, Receipt, AlertCircle, CheckCircle2 } from 'lucide-react';

import PageHeader from '@/components/PageHeader';
import { DAFTAR_TAGIHAN, type StatusTagihan } from '@/lib/data';
import { cn, formatRupiah } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Tagihan SPP & Keuangan',
  description: 'Ringkasan tagihan dan administrasi Murid.',
};

const STATUS_TAGIHAN: Record<StatusTagihan, { label: string; className: string }> = {
  lunas: { label: 'Lunas', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'belum-bayar': { label: 'Belum Bayar', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  'menunggu-verifikasi': {
    label: 'Verifikasi',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
};

export default function TagihanPage() {
  const belumBayarItems = DAFTAR_TAGIHAN.filter((item) => item.status === 'belum-bayar');
  const totalBelumBayar = belumBayarItems.reduce((total, item) => total + item.nominal, 0);

  return (
    <div className="flex flex-col min-h-full pb-28 font-sans">
      <PageHeader title="Administrasi SPP" subtitle="SMAN 20 Kabupaten Tangerang" />

      {/* 1. TOP TYPOGRAPHY HIERARCHY: Angka Tagihan Dominan di Tengah Layar Atas */}
      <section className="px-4 pt-4 pb-2 text-center">
        <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Tagihan Belum Dibayar
          </span>
          <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-900 py-1">
            {formatRupiah(totalBelumBayar)}
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 pt-0.5">
            {belumBayarItems.length > 0 ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-rose-600 font-semibold">
                  {belumBayarItems.length} tagihan menunggu pembayaran
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Semua tagihan lunas</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2. DAFTAR RINCIAN TAGIHAN */}
      <section className="px-4 mt-4 space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Rincian Pos Tagihan ({DAFTAR_TAGIHAN.length})
          </h2>
          <span className="text-[11px] text-slate-400">Tahun Ajaran 2026/2027</span>
        </div>

        <ul className="space-y-2.5">
          {DAFTAR_TAGIHAN.map((item) => {
            const gaya = STATUS_TAGIHAN[item.status];
            return (
              <li
                key={item.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs transition hover:border-slate-300"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
                    <Receipt className="h-4 w-4" aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {item.judul}
                      </p>
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold border',
                          gaya.className
                        )}
                      >
                        {gaya.label}
                      </span>
                    </div>

                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {item.periode} · Jatuh tempo {item.jatuhTempo}
                    </p>
                    <p className="mt-1 text-sm font-black font-mono text-slate-900">
                      {formatRupiah(item.nominal)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 3. STICKY BOTTOM BAR: Total Tunggakan & Tombol "Bayar Sekarang" */}
      <aside aria-label="Aksi Pembayaran Tagihan" className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
        <div className="w-full max-w-md pointer-events-auto rounded-2xl bg-slate-900/95 backdrop-blur-md p-3.5 text-white shadow-xl border border-slate-800 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Total Pembayaran
            </span>
            <span className="text-base font-black font-mono text-white truncate block">
              {formatRupiah(totalBelumBayar)}
            </span>
          </div>

          <button
            type="button"
            disabled={totalBelumBayar === 0}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#087f5b] hover:bg-[#0ca678] px-5 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <span>Bayar Sekarang</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </aside>
    </div>
  );
}
