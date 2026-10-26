'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Plus,
  Search,
  Printer,
  Download,
  Loader2,
  Calendar,
  CheckCircle2,
  QrCode,
  School,
  Wallet,
  FileText,
  User,
  ArrowRight
} from 'lucide-react';

interface Pembayaran {
  id: string;
  tagihanId: string;
  tagihanNama: string;
  cicilanKe?: number;
  siswaId: string;
  siswaNama: string;
  nis: string;
  rombelNama: string;
  nominal: number;
  metode: 'TUNAI' | 'TRANSFER' | 'QRIS' | 'VA';
  referensi?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  petugas: string;
  kwitansiNo: string;
  catatan?: string;
  createdAt: string;
}

export default function PembayaranPage() {
  const [data, setData] = useState<Pembayaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Kwitansi Modal State
  const [printKwitansi, setPrintKwitansi] = useState<Pembayaran | null>(null);

  // Modal Input Pembayaran Baru
  const [newPayModal, setNewPayModal] = useState(false);
  const [tagihanList, setTagihanList] = useState<any[]>([]);
  const [selectedTagihanId, setSelectedTagihanId] = useState('');
  const [payNominal, setPayNominal] = useState('');
  const [payMetode, setPayMetode] = useState<'TUNAI' | 'TRANSFER' | 'QRIS' | 'VA'>('TUNAI');
  const [payCatatan, setPayCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = '/api/keuangan/pembayaran';
      if (search) url += `?search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleOpenNewPay = async () => {
    try {
      const res = await fetch('/api/keuangan/tagihan?status=BELUM');
      const json = await res.json();
      if (json.success) {
        setTagihanList(json.data);
        if (json.data.length > 0) {
          setSelectedTagihanId(json.data[0].id);
          setPayNominal(json.data[0].sisa.toString());
        }
      }
      setNewPayModal(true);
    } catch {
      alert('Gagal mengambil daftar tagihan belum lunas');
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTagihanId || !payNominal) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/keuangan/pembayaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tagihanId: selectedTagihanId,
          nominal: Number(payNominal),
          metode: payMetode,
          catatan: payCatatan,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setNewPayModal(false);
        fetchData();
        setPrintKwitansi(json.data);
      } else {
        alert(json.error || 'Gagal menyimpan pembayaran');
      }
    } catch {
      alert('Terjadi kesalahan jaringan');
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

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/keuangan" className="text-xs font-semibold text-emerald-600 hover:underline">
              Portal Keuangan TU
            </Link>
            <span className="text-slate-400 text-xs">/</span>
            <span className="text-xs text-slate-500 font-medium">Modul A17</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Transaksi Pembayaran & Penerbitan Kwitansi
          </h1>
          <p className="text-slate-500 mt-1">
            Pencatatan kas masuk via Tunai, Transfer, QRIS, & Virtual Account dengan cetak bukti resmi (Task A17).
          </p>
        </div>
        <button
          onClick={handleOpenNewPay}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Catat Pembayaran Loket TU
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex justify-between items-center flex-wrap gap-4">
        <div className="relative min-w-[300px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari no kwitansi, siswa, atau pos tagihan..."
            className="pl-9 pr-4 py-2 w-full text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Total {data.length} transaksi pembayaran terverifikasi
        </span>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-900">Buku Register Kwitansi Pembayaran</h3>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
            Terverifikasi Kas
          </span>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : data.length === 0 ? (
            <div className="text-center p-12 text-slate-500 border border-dashed rounded-2xl">
              Belum ada riwayat transaksi pembayaran.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">No. Kwitansi</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Nama Siswa</th>
                    <th className="py-2.5 px-3">Kelas</th>
                    <th className="py-2.5 px-3">Pos Pembayaran</th>
                    <th className="py-2.5 px-3">Metode</th>
                    <th className="py-2.5 px-3 text-right">Nominal</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {data.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-teal-800">{item.kwitansiNo}</td>
                      <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-900 block">{item.siswaNama}</span>
                        <span className="text-[11px] font-mono text-slate-500 tabular-nums">{item.nis}</span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-700">{item.rombelNama}</td>
                      <td className="py-2.5 px-3 text-slate-800">
                        {item.tagihanNama}
                        {item.cicilanKe && ` (Cicilan ${item.cicilanKe})`}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border">
                          {item.metode}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900 tabular-nums font-mono">
                        {formatRupiah(item.nominal)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] border ${
                            item.status === 'VERIFIED'
                              ? 'bg-teal-50 text-teal-800 border-teal-200'
                              : item.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {item.status === 'VERIFIED' ? 'Lunas' : item.status === 'PENDING' ? 'Pending' : 'Ditolak'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => setPrintKwitansi(item)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[11px] transition shadow-2xs"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-500" /> Cetak Kwitansi
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Kwitansi Cetak Resmi Ber-QR (A17.7) */}
      {printKwitansi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl p-8 shadow-2xl border border-slate-200 my-8">
            {/* Header Sekolah */}
            <div className="border-b-2 border-slate-900 pb-3 text-center">
              <div className="flex items-center justify-center gap-3">
                <School className="w-9 h-9 text-slate-900" />
                <div className="text-left">
                  <h3 className="text-xs font-bold text-slate-700 uppercase">
                    SMA Negeri 20 Kabupaten Tangerang
                  </h3>
                  <p className="text-[10px] text-slate-500 font-serif">
                    Jl. Raya Pakuhaji No. 12, Kab. Tangerang, Banten 15570 | NPSN: 20613840
                  </p>
                </div>
              </div>
            </div>

            {/* Judul Kwitansi */}
            <div className="flex justify-between items-center my-4 text-xs">
              <div>
                <span className="text-slate-500 block">TANDA BUKTI PEMBAYARAN</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{printKwitansi.kwitansiNo}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">Tanggal:</span>
                <span className="font-medium text-slate-800">
                  {new Date(printKwitansi.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Rincian Pembayaran */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs font-sans my-4">
              <div className="grid grid-cols-3">
                <span className="text-slate-500">Telah Diterima Dari:</span>
                <span className="col-span-2 font-bold text-slate-900">
                  {printKwitansi.siswaNama} (NIS: {printKwitansi.nis})
                </span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-500">Kelas / Rombel:</span>
                <span className="col-span-2 text-slate-800">{printKwitansi.rombelNama}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-500">Untuk Pembayaran:</span>
                <span className="col-span-2 font-medium text-slate-800">
                  {printKwitansi.tagihanNama}
                  {printKwitansi.cicilanKe && ` — Cicilan Termin Ke-${printKwitansi.cicilanKe}`}
                </span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-500">Metode Bayar:</span>
                <span className="col-span-2 text-slate-800 font-semibold">{printKwitansi.metode}</span>
              </div>
              {printKwitansi.referensi && (
                <div className="grid grid-cols-3">
                  <span className="text-slate-500">No. Referensi:</span>
                  <span className="col-span-2 font-mono text-slate-600">{printKwitansi.referensi}</span>
                </div>
              )}
            </div>

            {/* Box Nominal Besar */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center my-4">
              <span className="text-xs text-emerald-800 font-medium block">JUMLAH DIBAYAR:</span>
              <span className="text-2xl font-black text-emerald-900">
                {formatRupiah(printKwitansi.nominal)}
              </span>
            </div>

            {/* Pengesahan & QR */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-end text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-12 h-12 bg-white border border-slate-300 rounded-lg flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-slate-800" />
                </div>
                <div className="text-[10px] text-slate-500">
                  <p className="font-bold text-slate-800">Validasi Digital</p>
                  <p>ID: {printKwitansi.id}</p>
                  <p>Lunas Terverifikasi TU</p>
                </div>
              </div>

              <div className="text-center w-48 text-slate-800">
                <p className="text-[11px]">Bendahara Penerima,</p>
                <div className="h-10" />
                <p className="font-bold underline text-slate-900">{printKwitansi.petugas}</p>
                <p className="text-[10px] text-slate-500">SMAN 20 Kab. Tangerang</p>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-[11px] text-slate-400">Dicetak melalui DZITOE Finance Module 2026</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPrintKwitansi(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Tutup
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Cetak Kwitansi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Catat Pembayaran Loket */}
      {newPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Catat Pembayaran Masuk</h3>
            <p className="text-xs text-slate-500 mb-4">
              Penerimaan pembayaran tunai di loket TU atau konfirmasi transfer perbankan/QRIS.
            </p>

            <form onSubmit={handleSubmitPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Tagihan Siswa *</label>
                <select
                  required
                  value={selectedTagihanId}
                  onChange={(e) => {
                    setSelectedTagihanId(e.target.value);
                    const match = tagihanList.find((t) => t.id === e.target.value);
                    if (match) setPayNominal(match.sisa.toString());
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {tagihanList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.siswaNama} ({t.rombelNama}) — {t.jenisNama} (Sisa: {formatRupiah(t.sisa)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nominal Setoran (Rp) *</label>
                  <input
                    type="number"
                    required
                    min="10000"
                    value={payNominal}
                    onChange={(e) => setPayNominal(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Metode Bayar *</label>
                  <select
                    value={payMetode}
                    onChange={(e) => setPayMetode(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-semibold"
                  >
                    <option value="TUNAI">Tunai (Kasir TU)</option>
                    <option value="TRANSFER">Transfer Bank</option>
                    <option value="QRIS">QRIS Statis/Dinamis</option>
                    <option value="VA">Virtual Account</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Transaksi</label>
                <input
                  type="text"
                  value={payCatatan}
                  onChange={(e) => setPayCatatan(e.target.value)}
                  placeholder="Contoh: Titipan orang tua murid via transfer Mandiri"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewPayModal(false)}
                  className="px-4 py-2 font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Simpan & Terbitkan Kwitansi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
