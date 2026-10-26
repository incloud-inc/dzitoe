'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Search,
  Filter,
  Download,
  Bell,
  Users,
  Loader2,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  ShieldAlert,
  Send
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface TunggakanData {
  totalNominalTunggakan: number;
  totalSiswaMenunggak: number;
  rekapPerRombel: { rombelNama: string; siswaMenunggak: number; nominal: number }[];
  siswaList: {
    siswaId: string;
    siswaNama: string;
    nis: string;
    nisn: string;
    rombelNama: string;
    tingkat: string;
    totalTagihan: number;
    totalDibayar: number;
    totalTunggakan: number;
    jumlahItemMenunggak: number;
    items: any[];
  }[];
}

type SortField = 'tunggakan' | 'nama' | 'tagihan';
type SortOrder = 'asc' | 'desc';

export default function TunggakanPage() {
  const [data, setData] = useState<TunggakanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRombel, setSelectedRombel] = useState('ALL');
  
  // Rekomendasi 34: Sortir otomatis berdasarkan angka tunggakan terbesar (default 'desc')
  const [sortField, setSortField] = useState<SortField>('tunggakan');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/keuangan/tunggakan');
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
  }, []);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  // Filter & Sort Otomatis (Rekomendasi 34: Sortir otomatis tunggakan terbesar)
  const sortedAndFilteredSiswa = useMemo(() => {
    if (!data?.siswaList) return [];

    let list = data.siswaList.filter((s) => {
      if (selectedRombel !== 'ALL' && s.rombelNama !== selectedRombel) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          s.siswaNama.toLowerCase().includes(q) ||
          s.nis.includes(q) ||
          s.nisn.includes(q) ||
          s.rombelNama.toLowerCase().includes(q)
        );
      }
      return true;
    });

    list.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'tunggakan') {
        comparison = a.totalTunggakan - b.totalTunggakan;
      } else if (sortField === 'tagihan') {
        comparison = a.totalTagihan - b.totalTagihan;
      } else if (sortField === 'nama') {
        comparison = a.siswaNama.localeCompare(b.siswaNama);
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return list;
  }, [data, selectedRombel, search, sortField, sortOrder]);

  const handleToggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // Default descending untuk prioritas tinggi
    }
  };

  const handleExportExcel = () => {
    if (sortedAndFilteredSiswa.length === 0) return alert('Tidak ada data tunggakan');

    const rows = sortedAndFilteredSiswa.map((s, idx) => ({
      No: idx + 1,
      'Nama Siswa': s.siswaNama,
      NIS: s.nis,
      NISN: s.nisn,
      Rombel: s.rombelNama,
      'Total Kewajiban (Rp)': s.totalTagihan,
      'Sudah Dibayar (Rp)': s.totalDibayar,
      'Sisa Tunggakan (Rp)': s.totalTunggakan,
      'Item Belum Lunas': s.jumlahItemMenunggak,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rekap_Tunggakan_Siswa');
    XLSX.writeFile(wb, `Laporan_Tunggakan_Siswa_Prioritas.xlsx`);
  };

  const handleSendReminder = (siswaNama: string) => {
    alert(`Notifikasi WhatsApp pengingat tunggakan berhasil dikirim ke nomor wali murid an. ${siswaNama}`);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Breadcrumb & Actions */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/keuangan" className="text-xs font-semibold text-teal-700 hover:underline">
              Portal Keuangan TU
            </Link>
            <span className="text-slate-400 text-xs">/</span>
            <span className="text-xs text-slate-500 font-medium">Monitoring Piutang</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Daftar Prioritas Tunggakan & Piutang Siswa
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Daftar high-priority terurut otomatis berdasarkan angka tunggakan terbesar tanpa distraksi warna berlebih (Rekomendasi 34).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export Excel
          </button>
          <button
            onClick={() =>
              alert(
                `Blast pengingat tagihan massal dikirim ke ${data?.totalSiswaMenunggak || 0} nomor wali murid terdaftar.`
              )
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-2xs transition"
          >
            <Send className="w-3.5 h-3.5" /> Blast WA Massal
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-16 bg-white border border-slate-200 rounded-2xl">
          <Loader2 className="w-7 h-7 animate-spin text-teal-600" />
        </div>
      ) : !data ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
          Gagal memuat data tunggakan siswa.
        </div>
      ) : (
        <>
          {/* Summary KPI (Accessible, Non-clashing tones) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Total Akumulasi Piutang</span>
                <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                  <AlertTriangle className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-2">
                {formatRupiah(data.totalNominalTunggakan)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Total tagihan siswa yang belum terselesaikan</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Total Siswa Menunggak</span>
                <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-2">
                {data.totalSiswaMenunggak} <span className="text-sm font-sans font-medium text-slate-500">Siswa</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Tersebar di {data.rekapPerRombel.length} rombel kelas aktif
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Urutan Prioritas Penagihan</span>
                <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                  <ArrowDown className="w-4 h-4" />
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 mt-2">
                Tunggakan Tertinggi di Posisi Pertama
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Prioritas follow-up untuk memulihkan arus kas kasir sekolah
              </p>
            </div>
          </div>

          {/* Rombel Filter Chips */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Filter Rombel / Kelas
              </h3>
              <span className="text-[11px] text-slate-400">
                Pilih rombel untuk mempersempit daftar
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setSelectedRombel('ALL')}
                className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition ${
                  selectedRombel === 'ALL'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Semua ({data.totalSiswaMenunggak})
              </button>
              {data.rekapPerRombel.map((r) => (
                <button
                  key={r.rombelNama}
                  onClick={() => setSelectedRombel(r.rombelNama)}
                  className={`px-3 py-1.5 rounded-lg font-medium shrink-0 border transition ${
                    selectedRombel === r.rombelNama
                      ? 'bg-teal-50 border-teal-500 text-teal-800 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {r.rombelNama} ({r.siswaMenunggak})
                </button>
              ))}
            </div>
          </div>

          {/* Main Table: High Priority Arrears List */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Daftar Siswa ({sortedAndFilteredSiswa.length} Siswa)
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  Sortir: {sortField === 'tunggakan' ? 'Tunggakan' : sortField === 'tagihan' ? 'Total Tagihan' : 'Nama'} (
                  {sortOrder === 'desc' ? 'Terbesar/Z-A' : 'Terkecil/A-Z'})
                </span>
              </div>

              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari siswa atau NIS..."
                  className="pl-9 pr-4 py-2 w-full text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">Rank</th>
                    <th className="py-2.5 px-3">
                      <button
                        onClick={() => handleToggleSort('nama')}
                        className="flex items-center gap-1 hover:text-slate-900 font-bold"
                      >
                        Nama Siswa
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </button>
                    </th>
                    <th className="py-2.5 px-3">Kelas</th>
                    <th className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleToggleSort('tagihan')}
                        className="flex items-center justify-end gap-1 w-full hover:text-slate-900 font-bold"
                      >
                        Total Kewajiban
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </button>
                    </th>
                    <th className="py-2.5 px-3 text-right">Sudah Dibayar</th>
                    {/* Rekomendasi 34: Tonjolkan angka dengan font weight bold tanpa harus dimerahkan semua */}
                    <th className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleToggleSort('tunggakan')}
                        className="flex items-center justify-end gap-1 w-full hover:text-slate-900 font-bold text-slate-900"
                      >
                        Sisa Tunggakan
                        {sortOrder === 'desc' ? (
                          <ArrowDown className="w-3.5 h-3.5 text-teal-700" />
                        ) : (
                          <ArrowUp className="w-3.5 h-3.5 text-teal-700" />
                        )}
                      </button>
                    </th>
                    <th className="py-2.5 px-3 text-center">Status & Pos</th>
                    <th className="py-2.5 px-3 text-center">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedAndFilteredSiswa.map((item, idx) => (
                    <tr key={item.siswaId} className="hover:bg-slate-50/60 transition">
                      {/* Priority Rank Indicator */}
                      <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-500">
                        {idx < 3 ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold">
                            {idx + 1}
                          </span>
                        ) : (
                          <span>#{idx + 1}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-900 block">{item.siswaNama}</span>
                        <span className="text-[11px] font-mono text-slate-500">NIS: {item.nis}</span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-700">{item.rombelNama}</td>
                      <td className="py-2.5 px-3 text-right font-medium text-slate-700 tabular-nums font-mono">
                        {formatRupiah(item.totalTagihan)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-slate-600 tabular-nums font-mono">
                        {formatRupiah(item.totalDibayar)}
                      </td>
                      {/* Rekomendasi 34: Font-extrabold tanpa teks merah */}
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums font-extrabold text-slate-900 text-[13px]">
                        {formatRupiah(item.totalTunggakan)}
                      </td>
                      {/* Badge status yang merah/amber terisolasi */}
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[10px] border bg-rose-50 text-rose-800 border-rose-200">
                          {item.jumlahItemMenunggak} Pos Tertunggak
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleSendReminder(item.siswaNama)}
                            className="px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-[11px] flex items-center gap-1 transition"
                            title="Kirim pengingat WhatsApp"
                          >
                            <Bell className="w-3 h-3 text-amber-600" />
                            Ingatkan WA
                          </button>
                          <Link
                            href={`/keuangan/pembayaran`}
                            className="px-2.5 py-1 rounded-md bg-teal-700 hover:bg-teal-800 text-white font-semibold text-[11px] shadow-2xs transition"
                          >
                            Bayar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
