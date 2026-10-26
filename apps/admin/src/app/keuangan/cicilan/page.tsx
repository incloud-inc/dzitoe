'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  CreditCard,
  Loader2,
  Calendar,
  Layers,
  ArrowRight,
  Filter
} from 'lucide-react';

function CicilanContent() {
  const searchParams = useSearchParams();
  const tagihanIdParam = searchParams.get('tagihanId');

  const [tagihanList, setTagihanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'BERJALAN' | 'LUNAS'>('ALL');

  // State accordion yang terbuka (bisa multi / single)
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  // Quick Pay Modal
  const [payModal, setPayModal] = useState(false);
  const [activeTagihan, setActiveTagihan] = useState<any | null>(null);
  const [selectedCicilan, setSelectedCicilan] = useState<any | null>(null);
  const [payMetode, setPayMetode] = useState<'TUNAI' | 'TRANSFER' | 'QRIS' | 'VA'>('TUNAI');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/keuangan/tagihan');
      const json = await res.json();
      if (json.success) {
        // Ambil hanya tagihan yang memiliki skema cicilan
        const withInstallments = json.data.filter((t: any) => t.cicilan && t.cicilan.length > 0);
        setTagihanList(withInstallments);

        // Jika ada tagihanIdParam, buka otomatis accordion-nya
        if (tagihanIdParam) {
          setExpandedIds({ [tagihanIdParam]: true });
        } else if (withInstallments.length > 0) {
          // Buka baris pertama sebagai default panduan visual
          setExpandedIds({ [withInstallments[0].id]: true });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tagihanIdParam]);

  const toggleAccordion = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePayCicilan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTagihan || !selectedCicilan) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/keuangan/pembayaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tagihanId: activeTagihan.id,
          cicilanId: selectedCicilan.id,
          nominal: selectedCicilan.nominal,
          metode: payMetode,
          catatan: `Pembayaran Cicilan Ke-${selectedCicilan.ke} (${activeTagihan.jenisNama})`,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        setPayModal(false);
        fetchData();
      } else {
        alert(json.error || 'Gagal memproses pembayaran');
      }
    } catch {
      alert('Terjadi kesalahan koneksi');
    } finally {
      setSubmitting(false);
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const hitungProgress = (cicilan: any[]) => {
    if (!cicilan || cicilan.length === 0) return { percent: 0, lunasCount: 0, totalCount: 0 };
    const lunasCount = cicilan.filter((c) => c.status === 'DIBAYAR').length;
    const totalCount = cicilan.length;
    const percent = Math.round((lunasCount / totalCount) * 100);
    return { percent, lunasCount, totalCount };
  };

  const filteredTagihan = tagihanList.filter((item) => {
    const isLunas = item.sisa <= 0;
    if (statusFilter === 'LUNAS' && !isLunas) return false;
    if (statusFilter === 'BERJALAN' && isLunas) return false;

    if (search) {
      const q = search.toLowerCase();
      return (
        item.siswaNama.toLowerCase().includes(q) ||
        item.nis.includes(q) ||
        item.rombelNama.toLowerCase().includes(q) ||
        item.jenisNama.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Breadcrumb */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/keuangan" className="text-xs font-semibold text-teal-700 hover:underline">
              Portal Keuangan TU
            </Link>
            <span className="text-slate-400 text-xs">/</span>
            <span className="text-xs text-slate-500 font-medium">Monitoring Angsuran</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Monitoring Skema Cicilan & Angsuran Siswa
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tabel hierarki rencana angsuran per tagihan siswa dengan visualisasi accordion dan status termin (Rekomendasi 33).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/keuangan/tagihan"
            className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            Semua Tagihan
          </Link>
          <button
            onClick={() => {
              const allExpanded: Record<string, boolean> = {};
              filteredTagihan.forEach((t) => {
                allExpanded[t.id] = true;
              });
              setExpandedIds(allExpanded);
            }}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            Buka Semua Accordion
          </button>
        </div>
      </div>

      {/* Filter & Toolbar Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[280px] flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari siswa, NIS, atau rombel..."
            className="pl-9 pr-4 py-2 w-full text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Status Cicilan:</span>
          {(['ALL', 'BERJALAN', 'LUNAS'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                statusFilter === st
                  ? 'bg-teal-50 text-teal-800 border border-teal-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {st === 'ALL' ? 'Semua' : st === 'BERJALAN' ? 'Sedang Mencicil' : 'Lunas Selesai'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Hierarchical Table */}
      {loading ? (
        <div className="flex justify-center p-16 bg-white border border-slate-200 rounded-2xl">
          <Loader2 className="w-7 h-7 animate-spin text-teal-600" />
        </div>
      ) : filteredTagihan.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
          Tidak ada data skema cicilan yang sesuai dengan filter pencarian.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center"></th>
                  <th className="py-2.5 px-3">No. Tagihan & Siswa</th>
                  <th className="py-2.5 px-3">Rombel</th>
                  <th className="py-2.5 px-3">Pos Tagihan</th>
                  <th className="py-2.5 px-3 text-right">Total Kewajiban</th>
                  <th className="py-2.5 px-3 text-right">Sudah Masuk</th>
                  <th className="py-2.5 px-3 text-right">Sisa Piutang</th>
                  <th className="py-2.5 px-3 text-center">Progres Angsuran</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTagihan.map((t) => {
                  const isExpanded = !!expandedIds[t.id];
                  const { percent, lunasCount, totalCount } = hitungProgress(t.cicilan);
                  const isLunas = t.sisa <= 0;

                  return (
                    <React.Fragment key={t.id}>
                      {/* Parent Row (Tagihan) */}
                      <tr
                        onClick={() => toggleAccordion(t.id)}
                        className={`cursor-pointer transition select-none ${
                          isExpanded ? 'bg-slate-50/70 font-medium' : 'hover:bg-slate-50/50'
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            aria-label="Toggle cicilan details"
                            className="p-1 rounded-md text-slate-400 hover:text-slate-800 transition"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 stroke-[1.75]" />
                            ) : (
                              <ChevronRight className="w-4 h-4 stroke-[1.75]" />
                            )}
                          </button>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-slate-900 block">{t.siswaNama}</span>
                          <span className="text-[11px] font-mono text-slate-500">
                            {t.id} • NIS: {t.nis}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">{t.rombelNama}</td>
                        <td className="py-2.5 px-3 text-slate-800">{t.jenisNama}</td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                          {formatRupiah(t.nominal)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-teal-700 font-medium">
                          {formatRupiah(t.dibayar)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-amber-700 font-bold">
                          {formatRupiah(t.sisa)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex flex-col items-center gap-1 w-28 mx-auto">
                            <div className="flex justify-between w-full text-[10px] text-slate-500">
                              <span>{lunasCount}/{totalCount} termin</span>
                              <span className="font-mono font-bold">{percent}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  percent === 100 ? 'bg-teal-600' : 'bg-amber-500'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              isLunas
                                ? 'bg-teal-50 text-teal-800 border-teal-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {isLunas ? 'LUNAS' : 'MENCICIL'}
                          </span>
                        </td>
                      </tr>

                      {/* Nested Sub-Table Row (Rincian Termin Angsuran) */}
                      {isExpanded && (
                        <tr className="bg-slate-50/40">
                          <td colSpan={9} className="p-0">
                            <div className="py-3 px-6 pl-14 border-t border-b border-slate-200/80 bg-slate-50/50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                                  Rincian Jadwal Angsuran: {t.siswaNama} ({t.cicilan.length} Termin)
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  Klik tombol bayar untuk melunasi termin yang jatuh tempo
                                </span>
                              </div>

                              <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                                <table className="w-full text-left text-xs">
                                  <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold text-[10px] uppercase">
                                    <tr>
                                      <th className="py-2 px-3 w-16">Termin</th>
                                      <th className="py-2 px-3">Tanggal Jatuh Tempo</th>
                                      <th className="py-2 px-3 text-right">Nominal Angsuran</th>
                                      <th className="py-2 px-3">Tanggal Bayar</th>
                                      <th className="py-2 px-3 text-center">Status Termin</th>
                                      <th className="py-2 px-3 text-center">Aksi Pelunasan</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 text-[11px]">
                                    {t.cicilan.map((cic: any) => {
                                      const isPaid = cic.status === 'DIBAYAR';
                                      const isLate = cic.status === 'TERLAMBAT';

                                      return (
                                        <tr key={cic.id} className="hover:bg-slate-50/50 transition">
                                          <td className="py-2 px-3 font-semibold text-slate-800">
                                            Ke-{cic.ke}
                                          </td>
                                          <td className="py-2 px-3 text-slate-600 font-mono">
                                            {cic.jatuhTempo}
                                          </td>
                                          <td className="py-2 px-3 text-right font-mono tabular-nums font-bold text-slate-800">
                                            {formatRupiah(cic.nominal)}
                                          </td>
                                          <td className="py-2 px-3 text-slate-500 font-mono">
                                            {cic.tanggalDibayar || '—'}
                                          </td>
                                          <td className="py-2 px-3 text-center">
                                            <span
                                              className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                                                isPaid
                                                  ? 'bg-teal-50 text-teal-800 border-teal-200'
                                                  : isLate
                                                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                                              }`}
                                            >
                                              {isPaid ? 'LUNAS' : isLate ? 'JATUH TEMPO' : 'BELUM BAYAR'}
                                            </span>
                                          </td>
                                          <td className="py-2 px-3 text-center">
                                            {isPaid ? (
                                              <span className="text-[10px] text-teal-700 font-medium">
                                                Tervalidasi TU
                                              </span>
                                            ) : (
                                              <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                  onClick={() => {
                                                    setActiveTagihan(t);
                                                    setSelectedCicilan(cic);
                                                    setPayModal(true);
                                                  }}
                                                  className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[10px] transition shadow-2xs"
                                                >
                                                  Bayar Sekarang
                                                </button>
                                                <button
                                                  onClick={() =>
                                                    alert(
                                                      `Pesan WhatsApp pengingat termin ${cic.ke} (${formatRupiah(
                                                        cic.nominal
                                                      )}) dikirim ke wali murid an. ${t.siswaNama}!`
                                                    )
                                                  }
                                                  title="Kirim pengingat WA"
                                                  className="p-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                                                >
                                                  <Bell className="w-3 h-3 text-amber-600" />
                                                </button>
                                              </div>
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Quick Pay Cicilan */}
      {payModal && selectedCicilan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Bayar Cicilan Ke-{selectedCicilan.ke}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {activeTagihan?.siswaNama} — {activeTagihan?.jenisNama}
            </p>

            <form onSubmit={handlePayCicilan} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-0.5 text-[11px]">Nominal Angsuran:</span>
                <span className="text-lg font-bold text-teal-800 font-mono tabular-nums">
                  {formatRupiah(selectedCicilan.nominal)}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['TUNAI', 'TRANSFER', 'QRIS', 'VA'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPayMetode(m)}
                      className={`p-2 rounded-lg border text-center font-bold text-xs transition ${
                        payMetode === m
                          ? 'border-teal-600 bg-teal-50 text-teal-800'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPayModal(false)}
                  className="px-3.5 py-1.5 font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 font-bold rounded-lg bg-teal-700 hover:bg-teal-800 text-white shadow-2xs transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
                  Konfirmasi Lunas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CicilanPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-16">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      }
    >
      <CicilanContent />
    </Suspense>
  );
}
