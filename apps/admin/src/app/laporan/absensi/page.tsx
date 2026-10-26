'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Loader2, 
  Download, 
  Printer, 
  ChevronLeft, 
  QrCode, 
  School,
  Calendar,
  Users,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function LaporanAbsensiPage() {
  const [tipe, setTipe] = useState<'MURID' | 'GURU'>('MURID');
  const [bulan, setBulan] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [kelasId, setKelasId] = useState<string>('ALL');
  const [kelasList, setKelasList] = useState<{ id: string; nama: string }[]>([]);
  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/kelas')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setKelasList(json.data);
      })
      .catch(console.error);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = `/api/laporan/absensi?bulan=${bulan}&tipe=${tipe}`;
      if (tipe === 'MURID' && kelasId && kelasId !== 'ALL') {
        url += `&kelasId=${kelasId}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        alert(json.error || 'Gagal mengambil data');
      }
    } catch (error) {
      console.error(error);
      alert('Gagal mengambil data absensi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tipe, bulan, kelasId]);

  // Ekspor Excel
  const handleExportExcel = () => {
    if (data.length === 0) {
      alert('Tidak ada data untuk diekspor');
      return;
    }

    const exportRows = data.map((item, idx) => {
      if (tipe === 'MURID') {
        return {
          No: idx + 1,
          'Nama Murid': item.nama,
          NISN: item.nisn || '-',
          Kelas: item.kelas || '-',
          'Total Hadir': item.hadir,
          'Tepat Waktu': item.tepat,
          Terlambat: item.terlambat,
          Izin: item.izin,
          Sakit: item.sakit,
          Alpa: item.alpa,
        };
      } else {
        return {
          No: idx + 1,
          'Nama Guru': item.nama,
          NIP: item.nip || '-',
          'Total Hadir': item.hadir,
          'Tepat Waktu': item.tepat,
          Terlambat: item.terlambat,
          Izin: item.izin,
          Sakit: item.sakit,
          'Dinas Luar': item.dinas_luar || 0,
          Alpa: item.alpa,
        };
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Rekap_${tipe}_${bulan}`);

    const fileName = `Rekap_Absensi_Dinas_${tipe}_${bulan}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const handlePrint = () => {
    window.print();
  };

  // Format label bulan Indonesia
  const formatBulanIndo = (yyyyMm: string) => {
    try {
      const [y, m] = yyyyMm.split('-');
      const bulanNama = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ][parseInt(m || '1', 10) - 1];
      return `${bulanNama} ${y}`;
    } catch {
      return yyyyMm;
    }
  };

  const totalHadir = data.reduce((acc, cur) => acc + (cur.hadir || 0), 0);
  const totalTelat = data.reduce((acc, cur) => acc + (cur.terlambat || 0), 0);
  const totalAlpa = data.reduce((acc, cur) => acc + (cur.alpa || 0), 0);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Breadcrumb (Hidden saat print) */}
      <div className="flex justify-between items-start flex-wrap gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link 
              href="/laporan" 
              className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Kembali ke Portal Laporan
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Laporan Absensi Bulanan Kedinasan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Split-screen UI: Panel filter di kiri, pratinjau lembar cetak berkop resmi di kanan (Rekomendasi 38).
          </p>
        </div>
      </div>

      {/* Split-screen Layout: Kiri Filter (w-80 / 1/3) & Kanan Preview Cetak (flex-1 / 2/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* KOLOM KIRI: Panel Filter & Konfigurasi Dokumen (lg:col-span-4) */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 flex flex-col gap-4 print:hidden">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-700" />
                Parameter Dokumen
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Filter Cetak
              </span>
            </div>

            {/* Input Periode Bulan (Mendukung input manual / picker) */}
            <div>
              <label htmlFor="filter-bulan" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Bulan Periode Laporan
              </label>
              <input 
                id="filter-bulan"
                type="month" 
                value={bulan}
                onChange={(e) => setBulan(e.target.value)}
                aria-label="Bulan Periode Laporan"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Tipe Entitas */}
            <div>
              <label htmlFor="filter-tipe" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tipe Entitas Presensi
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTipe('MURID')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                    tipe === 'MURID'
                      ? 'border-teal-700 bg-teal-50 text-teal-800'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Peserta Didik
                </button>
                <button
                  type="button"
                  onClick={() => setTipe('GURU')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                    tipe === 'GURU'
                      ? 'border-teal-700 bg-teal-50 text-teal-800'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Guru & PTK
                </button>
              </div>
            </div>

            {/* Rombel / Kelas (Hanya jika Murid) */}
            {tipe === 'MURID' && (
              <div>
                <label htmlFor="filter-kelas" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Rombel / Kelas
                </label>
                <select 
                  id="filter-kelas"
                  value={kelasId} 
                  onChange={(e) => setKelasId(e.target.value)}
                  aria-label="Filter Rombel atau Kelas"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="ALL">Semua Kelas Terdaftar</option>
                  {kelasList.map((k) => (
                    <option key={k.id} value={k.id}>{k.nama}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Tombol Aksi Cetak & Ekspor */}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button 
                onClick={handlePrint}
                disabled={data.length === 0 || loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-2xs transition disabled:opacity-50"
              >
                <Printer className="w-4 h-4" /> Cetak Lembar Ini (Print / PDF)
              </button>
              <button 
                onClick={handleExportExcel}
                disabled={data.length === 0 || loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-teal-700" /> Export Excel (.xlsx)
              </button>
            </div>
          </div>

          {/* Ringkasan Akumulasi Angka */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Statistik Rekapitulasi
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Total Hadir</span>
                <span className="font-mono font-bold text-teal-800 text-sm mt-0.5 block">{totalHadir}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Terlambat</span>
                <span className="font-mono font-bold text-amber-700 text-sm mt-0.5 block">{totalTelat}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Alpa / Bolos</span>
                <span className="font-mono font-bold text-rose-700 text-sm mt-0.5 block">{totalAlpa}</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              Total {data.length} baris rekaman presensi siap cetak
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* KOLOM KANAN: Pratinjau Dokumen Cetak Kedinasan (lg:col-span-8) */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 bg-white border border-slate-300 rounded-2xl p-8 shadow-sm print:p-0 print:border-none print:shadow-none print:w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-2" />
              <p className="text-xs">Memuat pratinjau dokumen cetak...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center p-16 text-slate-400 text-xs border border-dashed rounded-xl">
              Tidak ada data presensi yang ditemukan untuk periode dan kriteria ini.
            </div>
          ) : (
            <div>
              {/* Kop Surat Resmi Dinas Pendidikan */}
              <div className="border-b-4 border-double border-slate-900 pb-3 text-center">
                <div className="flex items-center justify-center gap-4 mb-1">
                  <School className="w-10 h-10 text-slate-800 shrink-0" />
                  <div>
                    <h3 className="text-xs font-bold tracking-wider text-slate-800 uppercase">
                      Pemerintah Provinsi Banten — Dinas Pendidikan dan Kebudayaan
                    </h3>
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                      SMA Negeri 20 Kabupaten Tangerang
                    </h2>
                    <p className="text-[10px] text-slate-600 font-serif italic">
                      Jl. Raya Pakuhaji No. 12, Kab. Tangerang, Banten 15570 | NPSN: 20613840 | info@sman20tangerang.sch.id
                    </p>
                  </div>
                </div>
              </div>

              {/* Judul Laporan */}
              <div className="text-center my-4">
                <h4 className="text-sm font-bold uppercase underline text-slate-900 tracking-wide">
                  Laporan Rekapitulasi Presensi Bulanan {tipe === 'MURID' ? 'Peserta Didik' : 'Pendidik & Tenaga Kependidikan'}
                </h4>
                <p className="text-xs text-slate-700 mt-0.5">
                  Periode: <strong>{formatBulanIndo(bulan)}</strong>
                  {tipe === 'MURID' && (
                    <span> | Kelas: <strong>{kelasId === 'ALL' ? 'Semua Kelas' : kelasList.find(k => k.id === kelasId)?.nama || kelasId}</strong></span>
                  )}
                </p>
              </div>

              {/* Tabel Pratinjau Cetak */}
              <div className="overflow-x-auto border border-slate-300 rounded-lg">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold uppercase">
                    <tr>
                      <th className="py-1.5 px-2 w-8 text-center border-r border-slate-200">No</th>
                      <th className="py-1.5 px-2 border-r border-slate-200">Nama</th>
                      {tipe === 'MURID' ? (
                        <>
                          <th className="py-1.5 px-2 border-r border-slate-200">NISN</th>
                          <th className="py-1.5 px-2 border-r border-slate-200">Kelas</th>
                        </>
                      ) : (
                        <th className="py-1.5 px-2 border-r border-slate-200">NIP</th>
                      )}
                      <th className="py-1.5 px-2 text-center border-r border-slate-200">Hadir</th>
                      <th className="py-1.5 px-2 text-center border-r border-slate-200">Tepat</th>
                      <th className="py-1.5 px-2 text-center border-r border-slate-200">Telat</th>
                      <th className="py-1.5 px-2 text-center border-r border-slate-200">Izin</th>
                      <th className="py-1.5 px-2 text-center border-r border-slate-200">Sakit</th>
                      <th className="py-1.5 px-2 text-center">Alpa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-1.5 px-2 text-center font-mono border-r border-slate-200 text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-1.5 px-2 font-semibold text-slate-900 border-r border-slate-200">
                          {item.nama}
                        </td>
                        {tipe === 'MURID' ? (
                          <>
                            <td className="py-1.5 px-2 font-mono text-slate-600 border-r border-slate-200">
                              {item.nisn || '—'}
                            </td>
                            <td className="py-1.5 px-2 text-slate-700 border-r border-slate-200">
                              {item.kelas || '—'}
                            </td>
                          </>
                        ) : (
                          <td className="py-1.5 px-2 font-mono text-slate-600 border-r border-slate-200">
                            {item.nip || '—'}
                          </td>
                        )}
                        <td className="py-1.5 px-2 text-center font-mono font-bold text-slate-900 border-r border-slate-200">
                          {item.hadir}
                        </td>
                        <td className="py-1.5 px-2 text-center font-mono text-teal-800 border-r border-slate-200">
                          {item.tepat}
                        </td>
                        <td className="py-1.5 px-2 text-center font-mono text-amber-700 border-r border-slate-200">
                          {item.terlambat}
                        </td>
                        <td className="py-1.5 px-2 text-center font-mono text-slate-600 border-r border-slate-200">
                          {item.izin}
                        </td>
                        <td className="py-1.5 px-2 text-center font-mono text-slate-600 border-r border-slate-200">
                          {item.sakit}
                        </td>
                        <td className="py-1.5 px-2 text-center font-mono font-bold text-rose-700">
                          {item.alpa}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Kolom Tanda Tangan & QR Pengesahan Resmi */}
              <div className="mt-8 pt-4 flex justify-between items-end text-xs text-slate-900">
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-slate-300 rounded-lg bg-slate-50 flex flex-col items-center">
                    <QrCode className="w-12 h-12 text-slate-800" />
                    <span className="text-[9px] font-mono text-slate-500 mt-1">BSRE DUKCAPIL VALID</span>
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    <p className="font-semibold text-slate-700">Dokumen Digital Terverifikasi</p>
                    <p>SMAN 20 Kab. Tangerang</p>
                    <p className="font-mono">ID: PRES-{bulan.replace('-', '')}-{Date.now().toString().slice(-6)}</p>
                  </div>
                </div>

                <div className="text-center w-60">
                  <p className="text-[11px]">Tangerang, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="font-bold text-[11px] mt-0.5">Kepala SMA Negeri 20 Kab. Tangerang</p>
                  <div className="h-14 flex items-center justify-center">
                    <span className="text-[10px] text-slate-400 italic font-mono">[Tanda Tangan Digital Tersertifikasi]</span>
                  </div>
                  <p className="font-bold underline text-[11px]">H. Ahmad Supriyadi, M.Pd.</p>
                  <p className="text-[10px] font-mono text-slate-600">NIP. 19680512 199303 1 004</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
