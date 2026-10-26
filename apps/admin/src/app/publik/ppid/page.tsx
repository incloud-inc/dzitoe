'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  Shield,
  Lock,
  Sparkles,
  HelpCircle,
  Building,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  KategoriInformasi,
  KategoriPemohon,
  CaraMemperoleh,
  StatusPermohonan,
} from '@dzitoe/db';

export interface DokumenPublikItem {
  id: string;
  nomorDokumen: string;
  judul: string;
  kategori: KategoriInformasi;
  deskripsi: string;
  pejabatPengesah: string;
  tanggalPublikasi: string;
  tahunAnggaran?: number | null;
  fileUrl: string;
  fileSize: string;
  fileType: string;
  downloadCount: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PermohonanItem {
  id: string;
  nomorTiket: string;
  namaPemohon: string;
  nik: string;
  kategoriPemohon: KategoriPemohon;
  kontak: string;
  email: string;
  alamat: string;
  rincianInformasi: string;
  tujuanPenggunaan: string;
  caraMemperoleh: CaraMemperoleh;
  status: StatusPermohonan;
  catatanPetugas?: string | null;
  dokumenJawabanUrl?: string | null;
  tanggalPengajuan: string;
  tanggalSelesai?: string | null;
  petugasPenerima?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function PublicPPIDPage() {
  const [activeTab, setActiveTab] = useState<'DOKUMEN' | 'PERMOHONAN' | 'LACAK' | 'SOP'>('DOKUMEN');
  const [docs, setDocs] = useState<DokumenPublikItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter
  const [searchDoc, setSearchDoc] = useState('');
  const [selectedKategoriDoc, setSelectedKategoriDoc] = useState<string>('ALL');

  // Form State: Permohonan Daring Warga
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicketReceipt, setCreatedTicketReceipt] = useState<PermohonanItem | null>(null);
  const [reqFormData, setReqFormData] = useState({
    namaPemohon: '',
    nik: '',
    kategoriPemohon: 'PERORANGAN' as KategoriPemohon,
    kontak: '',
    email: '',
    alamat: '',
    rincianInformasi: '',
    tujuanPenggunaan: '',
    caraMemperoleh: 'SALINAN_DIGITAL' as CaraMemperoleh,
  });

  // Tracking State
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingResult, setTrackingResult] = useState<PermohonanItem | null>(null);
  const [trackingNotFound, setTrackingNotFound] = useState(false);
  const [isSearchingTrack, setIsSearchingTrack] = useState(false);

  const fetchDocs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ppid/dokumen');
      const json = await res.json();
      if (json.success) {
        setDocs(json.data);
        setStats(json.stats);
      }
    } catch (err) {
      console.error('Fetch docs error', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleDownloadDoc = async (doc: DokumenPublikItem) => {
    try {
      await fetch(`/api/ppid/dokumen/${doc.id}?download=true`);
      setDocs((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, downloadCount: d.downloadCount + 1 } : d))
      );
      window.open(doc.fileUrl, '_blank');
    } catch (err) {
      console.error('Download error', err);
    }
  };

  const handleSubmitReq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqFormData.namaPemohon || !reqFormData.nik || !reqFormData.kontak || !reqFormData.rincianInformasi) {
      alert('Nama Pemohon, NIK KTP, Nomor WhatsApp, dan Rincian Informasi wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/ppid/permohonan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqFormData),
      });
      const json = await res.json();
      if (json.success) {
        setCreatedTicketReceipt(json.data);
        // Reset form
        setReqFormData({
          namaPemohon: '',
          nik: '',
          kategoriPemohon: 'PERORANGAN',
          kontak: '',
          email: '',
          alamat: '',
          rincianInformasi: '',
          tujuanPenggunaan: '',
          caraMemperoleh: 'SALINAN_DIGITAL',
        });
      } else {
        alert(json.message || 'Gagal mengajukan permohonan');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan pengajuan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;

    setIsSearchingTrack(true);
    setTrackingNotFound(false);
    try {
      const res = await fetch(`/api/ppid/permohonan?ticket=${encodeURIComponent(trackingInput.trim())}`);
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setTrackingResult(json.data[0]);
        setTrackingNotFound(false);
      } else {
        setTrackingResult(null);
        setTrackingNotFound(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingTrack(false);
    }
  };

  const getKategoriBadge = (kategori: KategoriInformasi) => {
    switch (kategori) {
      case 'BERKALA':
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-blue-300 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-900 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-200">
            Informasi Berkala
          </span>
        );
      case 'SERTA_MERTA':
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-900 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200">
            Serta Merta
          </span>
        );
      case 'SETIAP_SAAT':
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">
            Setiap Saat
          </span>
        );
      case 'DIKECUALIKAN':
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            Dikecualikan (Pasal 17)
          </span>
        );
    }
  };

  const getStatusBadge = (status: StatusPermohonan) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-200">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            Menunggu Verifikasi Petugas
          </span>
        );
      case 'DIPROSES':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-900 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-200">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            Sedang Diproses oleh Tim PPID
          </span>
        );
      case 'DISETUJUI':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Permohonan Dikabulkan
          </span>
        );
      case 'DITOLAK':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-rose-300 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-900 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Permohonan Tidak Dapat Dikabulkan
          </span>
        );
    }
  };

  const filteredDocs = useMemo(() => {
    return docs.filter((d) => {
      const matchSearch =
        searchDoc === '' ||
        d.judul.toLowerCase().includes(searchDoc.toLowerCase()) ||
        d.nomorDokumen.toLowerCase().includes(searchDoc.toLowerCase()) ||
        d.deskripsi.toLowerCase().includes(searchDoc.toLowerCase());

      const matchKat = selectedKategoriDoc === 'ALL' || d.kategori === selectedKategoriDoc;
      return matchSearch && matchKat;
    });
  }, [docs, searchDoc, selectedKategoriDoc]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between">
      {/* 1. TOP OFFICIAL GOVERNMENT HEADER */}
      <header className="border-b border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-900 text-white shadow-xs">
              <Building className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                  PPID Pelaksana Satuan Pendidikan
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                  Portal Resmi
                </span>
              </div>
              <h1 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                SMAN 20 KABUPATEN TANGERANG
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login?callbackUrl=/ppid"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-xs transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Lock className="h-4 w-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
              <span>Login Petugas PPID</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. GOVERNMENT TRUST-FIRST BANNER (NO OVER-DECORATION, HIGH CONTRAST) */}
      <section className="bg-slate-900 py-10 px-4 text-white sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-semibold text-slate-200">
            <Shield className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
            Undang-Undang Republik Indonesia Nomor 14 Tahun 2008
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Layanan Keterbukaan Informasi Publik (PPID)
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            Pejabat Pengelola Informasi dan Dokumentasi (PPID) SMAN 20 Kabupaten Tangerang melayani permohonan informasi publik secara transparan, akuntabel, dan bebas biaya retribusi untuk menjamin hak masyarakat sesuai peraturan perundang-undangan.
          </p>

          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2 bg-slate-800/90 p-3 rounded-lg border border-slate-700 text-slate-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>Bebas Biaya (Gratis)</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/90 p-3 rounded-lg border border-slate-700 text-slate-200">
              <FileText className="h-4 w-4 text-blue-400 shrink-0" aria-hidden="true" />
              <span>{stats?.totalDokumen || docs.length} Dokumen Publik</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/90 p-3 rounded-lg border border-slate-700 text-slate-200">
              <Download className="h-4 w-4 text-indigo-400 shrink-0" aria-hidden="true" />
              <span>{stats?.totalDownload || 0} Terunduh</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/90 p-3 rounded-lg border border-slate-700 text-slate-200">
              <Clock className="h-4 w-4 text-amber-400 shrink-0" aria-hidden="true" />
              <span>SLA Respon 10 Hari</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN PORTAL BODY */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Tabs - Accessible Touch Targets (min 44px) & High Contrast */}
        <nav aria-label="Menu Utama PPID" className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('DOKUMEN')}
            className={cn(
              'flex min-h-[44px] items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600',
              activeTab === 'DOKUMEN'
                ? 'bg-slate-900 text-white shadow-xs dark:bg-blue-600 dark:text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800'
            )}
            aria-current={activeTab === 'DOKUMEN' ? 'page' : undefined}
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            <span>Katalog Dokumen ({docs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PERMOHONAN')}
            className={cn(
              'flex min-h-[44px] items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600',
              activeTab === 'PERMOHONAN'
                ? 'bg-slate-900 text-white shadow-xs dark:bg-blue-600 dark:text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800'
            )}
            aria-current={activeTab === 'PERMOHONAN' ? 'page' : undefined}
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            <span>Ajukan Permohonan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('LACAK')}
            className={cn(
              'flex min-h-[44px] items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600',
              activeTab === 'LACAK'
                ? 'bg-slate-900 text-white shadow-xs dark:bg-blue-600 dark:text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800'
            )}
            aria-current={activeTab === 'LACAK' ? 'page' : undefined}
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span>Lacak Status Tiket</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SOP')}
            className={cn(
              'flex min-h-[44px] items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600',
              activeTab === 'SOP'
                ? 'bg-slate-900 text-white shadow-xs dark:bg-blue-600 dark:text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800'
            )}
            aria-current={activeTab === 'SOP' ? 'page' : undefined}
          >
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            <span>Standar Layanan & Regulasi</span>
          </button>
        </nav>

        {/* =========================================================================
            TAB 1: KATALOG DOKUMEN PUBLIK
            ========================================================================= */}
        {activeTab === 'DOKUMEN' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-900">
              <div className="relative flex-1">
                <label htmlFor="searchDoc" className="sr-only">Cari judul informasi atau nomor dokumen</label>
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                <input
                  id="searchDoc"
                  type="search"
                  placeholder="Cari judul informasi, nomor dokumen, BOS, RKAS, LKjIP, SOP..."
                  value={searchDoc}
                  onChange={(e) => setSearchDoc(e.target.value)}
                  className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-3">
                <label htmlFor="kategoriDocFilter" className="sr-only">Filter Kategori Informasi Publik</label>
                <select
                  id="kategoriDocFilter"
                  value={selectedKategoriDoc}
                  onChange={(e) => setSelectedKategoriDoc(e.target.value)}
                  className="min-h-[44px] rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="ALL">Semua Kategori UU KIP</option>
                  <option value="BERKALA">Informasi Berkala</option>
                  <option value="SERTA_MERTA">Serta Merta (Darurat)</option>
                  <option value="SETIAP_SAAT">Setiap Saat</option>
                  <option value="DIKECUALIKAN">Dikecualikan (Pasal 17)</option>
                </select>
              </div>
            </div>

            {/* Document Cards Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {isLoading ? (
                <div className="col-span-2 py-16 flex flex-col items-center justify-center gap-3 text-slate-600">
                  <div className="w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
                  <span>Memuat katalog dokumen keterbukaan informasi publik...</span>
                </div>
              ) : filteredDocs.length === 0 ? (
                <div className="col-span-2 py-20 flex flex-col items-center justify-center text-slate-600">
                  <Search className="w-10 h-10 text-slate-400 mb-3" aria-hidden="true" />
                  <p className="font-bold text-slate-800 dark:text-slate-200">Tidak ada dokumen publik yang sesuai</p>
                  <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau kategori informasi.</p>
                </div>
              ) : (
                filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-400 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-mono text-xs font-bold text-blue-900 dark:text-blue-300">
                          {doc.nomorDokumen}
                        </span>
                        <div>{getKategoriBadge(doc.kategori)}</div>
                      </div>

                      <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                        {doc.judul}
                      </h3>

                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {doc.deskripsi}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          Pengesah: {doc.pejabatPengesah}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {doc.fileType} • {doc.fileSize} • {doc.downloadCount} kali diunduh
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownloadDoc(doc)}
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-xs transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        <Download className="h-4 w-4 text-slate-600 dark:text-slate-300" aria-hidden="true" />
                        <span>Unduh Berkas</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: FORM PERMOHONAN INFORMASI DARING (WCAG AA FORM LABELS)
            ========================================================================= */}
        {activeTab === 'PERMOHONAN' && (
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700">
                  <Send className="h-3.5 w-3.5" aria-hidden="true" /> Layanan Warga Online
                </span>
                <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                  Formulir Permohonan Informasi Publik
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Silakan isi identitas Anda dan rincian dokumen yang dibutuhkan. Berdasarkan UU No. 14 Tahun 2008,
                  petugas PPID akan memberikan tanggapan resmi maksimal dalam 10 hari kerja.
                </p>
              </div>

              <form onSubmit={handleSubmitReq} className="mt-6 space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="namaPemohon" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      Nama Lengkap Pemohon (Sesuai KTP) <span className="text-rose-600 dark:text-rose-400">*</span>
                    </label>
                    <input
                      id="namaPemohon"
                      type="text"
                      placeholder="Contoh: Budi Santoso, S.Kom"
                      value={reqFormData.namaPemohon}
                      onChange={(e) => setReqFormData({ ...reqFormData, namaPemohon: e.target.value })}
                      className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="nikPemohon" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      Nomor Induk Kependudukan (NIK KTP) <span className="text-rose-600 dark:text-rose-400">*</span>
                    </label>
                    <input
                      id="nikPemohon"
                      type="text"
                      maxLength={16}
                      placeholder="16 digit NIK resmi"
                      value={reqFormData.nik}
                      onChange={(e) => setReqFormData({ ...reqFormData, nik: e.target.value })}
                      className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="kontakPemohon" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      Nomor WhatsApp / Kontak Aktif <span className="text-rose-600 dark:text-rose-400">*</span>
                    </label>
                    <input
                      id="kontakPemohon"
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={reqFormData.kontak}
                      onChange={(e) => setReqFormData({ ...reqFormData, kontak: e.target.value })}
                      className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="emailPemohon" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      Alamat Email Aktif <span className="text-rose-600 dark:text-rose-400">*</span>
                    </label>
                    <input
                      id="emailPemohon"
                      type="email"
                      placeholder="pemohon@email.com"
                      value={reqFormData.email}
                      onChange={(e) => setReqFormData({ ...reqFormData, email: e.target.value })}
                      className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="kategoriPemohon" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      Kategori Pemohon
                    </label>
                    <select
                      id="kategoriPemohon"
                      value={reqFormData.kategoriPemohon}
                      onChange={(e) =>
                        setReqFormData({ ...reqFormData, kategoriPemohon: e.target.value as KategoriPemohon })
                      }
                      className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="PERORANGAN">Masyarakat / Perorangan</option>
                      <option value="ORANG_TUA">Orang Tua / Wali Murid</option>
                      <option value="MAHASISWA_PENELITI">Mahasiswa / Peneliti Akademik</option>
                      <option value="LEMBAGA_LSM">Lembaga Swadaya Masyarakat (LSM)</option>
                      <option value="MEDIA_PERS">Insan Pers / Jurnalis</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="caraMemperoleh" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      Cara Memperoleh Salinan
                    </label>
                    <select
                      id="caraMemperoleh"
                      value={reqFormData.caraMemperoleh}
                      onChange={(e) =>
                        setReqFormData({ ...reqFormData, caraMemperoleh: e.target.value as CaraMemperoleh })
                      }
                      className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="SALINAN_DIGITAL">Salinan Digital (Email / Unduh Portal)</option>
                      <option value="SALINAN_CETAK">Salinan Cetak Fisik (Diambil di Sekolah)</option>
                      <option value="MELIHAT_LANGSUNG">Melihat / Membaca Langsung di Tempat</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="alamatPemohon" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Alamat Domisili Pemohon
                  </label>
                  <input
                    id="alamatPemohon"
                    type="text"
                    placeholder="Alamat domisili lengkap atau nama instansi"
                    value={reqFormData.alamat}
                    onChange={(e) => setReqFormData({ ...reqFormData, alamat: e.target.value })}
                    className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="rincianInformasi" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Rincian Informasi / Dokumen Yang Diminta <span className="text-rose-600 dark:text-rose-400">*</span>
                  </label>
                  <textarea
                    id="rincianInformasi"
                    rows={4}
                    placeholder="Sebutkan secara rinci judul data, tahun anggaran, atau topik dokumen yang Anda butuhkan..."
                    value={reqFormData.rincianInformasi}
                    onChange={(e) => setReqFormData({ ...reqFormData, rincianInformasi: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="tujuanPenggunaan" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Tujuan Penggunaan Informasi
                  </label>
                  <input
                    id="tujuanPenggunaan"
                    type="text"
                    placeholder="Contoh: Keperluan penelitian tesis / Pengawasan tata kelola"
                    value={reqFormData.tujuanPenggunaan}
                    onChange={(e) => setReqFormData({ ...reqFormData, tujuanPenggunaan: e.target.value })}
                    className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-blue-900 px-6 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-blue-600 active:scale-95 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span>{isSubmitting ? 'Mengirimkan Permohonan...' : 'Kirimkan Permohonan'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: LACAK STATUS TIKET PEMOHON
            ========================================================================= */}
        {activeTab === 'LACAK' && (
          <div className="mx-auto max-w-2xl py-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 mb-4 border border-slate-200 dark:border-slate-700">
                <Search className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Lacak Status Permohonan Informasi
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Masukkan Nomor Registrasi Tiket yang tercantum pada bukti pendaftaran Anda (contoh:{' '}
                <span className="font-mono font-bold text-blue-900 dark:text-blue-300">
                  REG-PPID-2026-001
                </span>
                ).
              </p>

              <form onSubmit={handleTrackTicket} className="mt-6 flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label htmlFor="trackingInput" className="sr-only">
                    Nomor Tiket Registrasi PPID
                  </label>
                  <input
                    id="trackingInput"
                    type="text"
                    placeholder="Kode Tiket: REG-PPID-2026-XXX"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-mono text-slate-900 placeholder-slate-500 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearchingTrack}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-blue-600 active:scale-95 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  {isSearchingTrack ? 'Mencari...' : 'Lacak Status'}
                </button>
              </form>

              {trackingNotFound && (
                <div role="alert" className="mt-6 rounded-lg bg-rose-50 border border-rose-300 p-4 text-xs font-semibold text-rose-900 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-200">
                  Tiket &ldquo;{trackingInput}&rdquo; tidak ditemukan. Silakan periksa kembali nomor tiket pada tanda terima registrasi Anda.
                </div>
              )}

              {trackingResult && (
                <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50/70 p-6 text-left dark:border-slate-800 dark:bg-slate-800/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2 dark:border-slate-700">
                    <div>
                      <span className="font-mono text-sm font-extrabold text-blue-900 dark:text-blue-300">
                        {trackingResult.nomorTiket}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {trackingResult.namaPemohon}
                      </h4>
                    </div>
                    <div>{getStatusBadge(trackingResult.status)}</div>
                  </div>

                  <div className="mt-4 space-y-3 text-xs">
                    <div>
                      <span className="text-slate-600 dark:text-slate-400 font-semibold">Informasi Yang Diminta:</span>
                      <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                        {trackingResult.rincianInformasi}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-600 dark:text-slate-400 font-semibold">Tanggal Pengajuan:</span>
                      <p className="mt-0.5 text-slate-800 dark:text-slate-200 font-medium">
                        {new Date(trackingResult.tanggalPengajuan).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                      </p>
                    </div>

                    {trackingResult.catatanPetugas && (
                      <div className="rounded-lg bg-white p-4 border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          Respon & Tanggapan Resmi Petugas PPID:
                        </span>
                        <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                          {trackingResult.catatanPetugas}
                        </p>
                        {trackingResult.petugasPenerima && (
                          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                            Diproses oleh: {trackingResult.petugasPenerima}
                          </div>
                        )}
                      </div>
                    )}

                    {trackingResult.dokumenJawabanUrl && (
                      <div className="mt-4">
                        <a
                          href={trackingResult.dokumenJawabanUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-600"
                        >
                          <Download className="h-4 w-4" aria-hidden="true" />
                          <span>Unduh Salinan Berkas Jawaban</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: STANDAR LAYANAN, ALUR & REGULASI KIP
            ========================================================================= */}
        {activeTab === 'SOP' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* SLA Timeline */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-900 dark:text-blue-400" aria-hidden="true" />
                <span>Standar Operasional Prosedur & Batas Waktu Pelayanan (SLA)</span>
              </h3>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 dark:bg-slate-800 dark:border-slate-700">
                  <div className="text-xl font-black text-slate-900 dark:text-white">Hari ke 1–3</div>
                  <div className="mt-1 font-bold text-slate-800 dark:text-slate-200">Verifikasi Kelengkapan</div>
                  <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
                    Petugas PPID memverifikasi identitas pemohon dan relevansi informasi yang diminta.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 dark:bg-slate-800 dark:border-slate-700">
                  <div className="text-xl font-black text-slate-900 dark:text-white">Maksimal 10 Hari</div>
                  <div className="mt-1 font-bold text-slate-800 dark:text-slate-200">Pemberitahuan Tertulis</div>
                  <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
                    PPID menyampaikan respon resmi: dikabulkan seluruhnya/sebagian, atau tidak dapat dipenuhi beserta dasar hukumnya.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 dark:bg-slate-800 dark:border-slate-700">
                  <div className="text-xl font-black text-slate-900 dark:text-white">+7 Hari Kerja</div>
                  <div className="mt-1 font-bold text-slate-800 dark:text-slate-200">Perpanjangan Waktu</div>
                  <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
                    Diberikan apabila dokumen berukuran besar atau memerlukan uji konsekuensi lebih lanjut.
                  </p>
                </div>
              </div>
            </div>

            {/* Dasar Hukum & Uji Konsekuensi */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-slate-700 dark:text-slate-300" aria-hidden="true" />
                <span>Pengecualian Informasi Publik (Pasal 17 UU No. 14 Tahun 2008)</span>
              </h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Seluruh informasi publik pada prinsipnya bersifat terbuka untuk umum, kecuali informasi yang bila dibuka dapat:
              </p>
              <ul className="mt-3 space-y-2 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                <li>Mengungkapkan data pribadi peserta didik dan tenaga kependidikan (NIK, rekam medis, data ekonomi keluarga).</li>
                <li>Mempengaruhi kerahasiaan naskah ujian atau bank soal yang belum diujikan.</li>
                <li>Menghambat proses penegakan disiplin atau proses hukum yang sedang berjalan.</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          MODAL: TANDA TERIMA TIKET REGISTRASI RESMI
          ========================================================================= */}
      {createdTicketReceipt && (
        <div role="dialog" aria-modal="true" aria-labelledby="receiptModalTitle" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl dark:bg-slate-900 border border-slate-300 dark:border-slate-700">
            <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-300 mb-4">
              <CheckCircle2 className="h-8 w-8 shrink-0" aria-hidden="true" />
              <div>
                <h3 id="receiptModalTitle" className="text-lg font-bold text-slate-900 dark:text-white">
                  Permohonan Berhasil Dikirimkan
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Simpan nomor registrasi tiket di bawah ini untuk melacak status permohonan.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-100 border border-slate-300 p-5 text-center dark:bg-slate-800 dark:border-slate-700">
              <div className="text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold">
                Nomor Registrasi Tiket Resmi
              </div>
              <div className="mt-1 text-2xl sm:text-3xl font-mono font-black text-slate-900 dark:text-white">
                {createdTicketReceipt.nomorTiket}
              </div>
            </div>

            <div className="mt-5 space-y-2 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200 pt-4 dark:border-slate-800">
              <div><strong>Nama Pemohon:</strong> {createdTicketReceipt.namaPemohon}</div>
              <div><strong>NIK KTP:</strong> {createdTicketReceipt.nik}</div>
              <div><strong>Kontak:</strong> {createdTicketReceipt.kontak} ({createdTicketReceipt.email})</div>
              <div><strong>Rincian Permohonan:</strong> {createdTicketReceipt.rincianInformasi}</div>
              <div><strong>Batas Waktu Tanggapan:</strong> Maksimal 10 Hari Kerja</div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setCreatedTicketReceipt(null)}
                className="inline-flex min-h-[44px] items-center rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. PUBLIC FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 mt-12">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-bold text-slate-800 dark:text-slate-200">
              Pejabat Pengelola Informasi & Dokumentasi (PPID) SMAN 20 Kabupaten Tangerang
            </div>
            <div>Jl. Raya Pakuhaji Km. 2, Sepatan - Pakuhaji, Kabupaten Tangerang, Banten 15570</div>
            <div>Email Resmi: ppid@sman20tangerang.sch.id • Telepon/WhatsApp: (021) 5937-XXXX</div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>UU No. 14 Tahun 2008</span>
            <span>•</span>
            <span>Permendikbud No. 41/2020</span>
            <span>•</span>
            <Link href="/login" className="hover:text-blue-600">
              Area Petugas
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
