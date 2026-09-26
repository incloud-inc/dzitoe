import type { Metadata } from 'next';
import { ArrowRight, Receipt, Wallet } from 'lucide-react';

import PageHeader from '@/components/PageHeader';
import SectionHeader from '@/components/SectionHeader';
import { DAFTAR_TAGIHAN, type StatusTagihan } from '@/lib/data';
import { cn, formatRupiah } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Tagihan',
  description: 'Ringkasan tagihan dan administrasi Murid.',
};

const STATUS_TAGIHAN: Record<StatusTagihan, { label: string; className: string }> = {
  lunas: { label: 'Lunas', className: 'bg-brand-50 text-brand-700' },
  'belum-bayar': { label: 'Belum Bayar', className: 'bg-rose-50 text-rose-700' },
  'menunggu-verifikasi': {
    label: 'Menunggu Verifikasi',
    className: 'bg-amber-50 text-amber-700',
  },
};

export default function TagihanPage() {
  const totalBelumBayar = DAFTAR_TAGIHAN.filter(
    (item) => item.status === 'belum-bayar',
  ).reduce((total, item) => total + item.nominal, 0);

  return (
    <>
      <PageHeader title="Tagihan" subtitle="Administrasi Murid" />

      <div className="space-y-6 px-4 pt-4">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-4 text-white shadow-lg shadow-brand-900/20">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium text-white/70">
                Total Tagihan Aktif
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {formatRupiah(totalBelumBayar)}
              </p>
              <p className="mt-1 text-[11px] text-white/70">
                1 tagihan menunggu pembayaran
              </p>
            </div>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur">
              <Wallet className="h-5 w-5" aria-hidden />
            </span>
          </div>

          <button
            type="button"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-800 transition hover:bg-white/90 active:scale-[0.99]"
          >
            Bayar Sekarang
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </section>

        <section aria-labelledby="daftar-tagihan-heading">
          <SectionHeader
            id="daftar-tagihan-heading"
            title="Daftar Tagihan"
            subtitle={`${DAFTAR_TAGIHAN.length} entri tercatat`}
          />

          <ul className="space-y-2.5">
            {DAFTAR_TAGIHAN.map((item) => {
              const gaya = STATUS_TAGIHAN[item.status];
              return (
                <li
                  key={item.id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-card"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
                      <Receipt className="h-4 w-4" aria-hidden />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {item.judul}
                        </p>
                        <span
                          className={cn(
                            'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                            gaya.className,
                          )}
                        >
                          {gaya.label}
                        </span>
                      </div>

                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {item.periode} · Jatuh tempo {item.jatuhTempo}
                      </p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">
                        {formatRupiah(item.nominal)}
                      </p>
                    </div>
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
