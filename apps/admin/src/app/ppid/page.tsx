'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Search,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Send,
  Shield,
  X,
  Pencil,
  Sparkles,
  MoreVertical,
  Trash2,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
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

export default function PPIDPage() {
  const [activeTab, setActiveTab] = useState<'DOKUMEN' | 'PERMOHONAN' | 'TRACKER'>('DOKUMEN');
  const [docs, setDocs] = useState<DokumenPublikItem[]>([]);
  const [reqs, setReqs] = useState<PermohonanItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchDoc, setSearchDoc] = useState('');
  const [selectedKategoriDoc, setSelectedKategoriDoc] = useState<string>('ALL');
  const [searchReq, setSearchReq] = useState('');
  const [selectedStatusReq, setSelectedStatusReq] = useState<string>('ALL');

  // Modals & Drawers
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DokumenPublikItem | null>(null);
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [selectedReqForDisposisi, setSelectedReqForDisposisi] = useState<PermohonanItem | null>(null);
  const [createdTicketReceipt, setCreatedTicketReceipt] = useState<PermohonanItem | null>(null);
  const [actionMenuDocId, setActionMenuDocId] = useState<string | null>(null);
  const [actionMenuReqId, setActionMenuReqId] = useState<string | null>(null);

  // Independent Public Tracking input
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingResult, setTrackingResult] = useState<PermohonanItem | null>(null);
  const [trackingNotFound, setTrackingNotFound] = useState(false);

  // Form State: Dokumen Publik
  const [docFormData, setDocFormData] = useState({
    nomorDokumen: '',
    judul: '',
    kategori: 'BERKALA' as KategoriInformasi,
    deskripsi: '',
    pejabatPengesah: 'Kepala SMAN 20 Kabupaten Tangerang',
    tahunAnggaran: new Date().getFullYear(),
    fileUrl: '/documents/ppid/sample-document.pdf',
    fileSize: '2.5 MB',
    fileType: 'PDF',
    isPublic: true,
  });

  // Form State: Permohonan Daring
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

  // Disposisi State
  const [disposisiData, setDisposisiData] = useState({
    status: 'DIPROSES' as StatusPermohonan,
    catatanPetugas: '',
    petugasPenerima: 'Hj. Siti Rohmah, S.Sos (Petugas PPID)',
    dokumenJawabanUrl: '',
  });

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/ppid/dokumen');
      const json = await res.json();
      if (json.success) {
        setDocs(json.data);
        setStats(json.stats);
      }
    } catch (err) {
      console.error('Fetch docs error', err);
    }
  };

  const fetchReqs = async () => {
    try {
      const res = await fetch('/api/ppid/permohonan');
      const json = await res.json();
      if (json.success) {
        setReqs(json.data);
      }
    } catch (err) {
      console.error('Fetch reqs error', err);
    }
  };

  const refreshAll = async () => {
    setIsLoading(true);
    await Promise.all([fetchDocs(), fetchReqs()]);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const handleDownloadDoc = async (doc: DokumenPublikItem) => {
    try {
      // Trigger download tracking API
      await fetch(`/api/ppid/dokumen/${doc.id}?download=true`);
      // Update local count
      setDocs((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, downloadCount: d.downloadCount + 1 } : d))
      );
      // Open file in new tab
      window.open(doc.fileUrl, '_blank');
    } catch (err) {
      console.error('Download error', err);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    try {
      const res = await fetch(`/api/ppid/dokumen/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        refreshAll();
      } else {
        alert(json.message || 'Gagal menghapus dokumen');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menghapus dokumen');
    }
  };

  // Submit Dokumen Form
  const handleSubmitDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFormData.nomorDokumen || !docFormData.judul) {
      alert('Nomor Dokumen dan Judul wajib diisi.');
      return;
    }

    try {
      if (editingDoc) {
        const res = await fetch(`/api/ppid/dokumen/${editingDoc.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(docFormData),
        });
        const json = await res.json();
        if (json.success) {
          setIsDocModalOpen(false);
          refreshAll();
        } else {
          alert(json.message || 'Gagal memperbarui dokumen');
        }
      } else {
        const res = await fetch('/api/ppid/dokumen', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(docFormData),
        });
        const json = await res.json();
        if (json.success) {
          setIsDocModalOpen(false);
          refreshAll();
        } else {
          alert(json.message || 'Gagal menerbitkan dokumen');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi');
    }
  };

  // Submit Permohonan Daring
  const handleSubmitReq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqFormData.namaPemohon || !reqFormData.nik || !reqFormData.kontak || !reqFormData.rincianInformasi) {
      alert('Nama Pemohon, NIK KTP, Kontak WhatsApp, dan Rincian Informasi wajib diisi.');
      return;
    }

    try {
      const res = await fetch('/api/ppid/permohonan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqFormData),
      });
      const json = await res.json();
      if (json.success) {
        setIsReqModalOpen(false);
        setCreatedTicketReceipt(json.data);
        refreshAll();
      } else {
        alert(json.message || 'Gagal mengajukan permohonan informasi');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan pengajuan');
    }
  };

  // Disposisi Petugas Submit
  const handleSaveDisposisi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqForDisposisi) return;

    try {
      const res = await fetch(`/api/ppid/permohonan/${selectedReqForDisposisi.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(disposisiData),
      });
      const json = await res.json();
      if (json.success) {
        setSelectedReqForDisposisi(null);
        refreshAll();
      } else {
        alert(json.message || 'Gagal memperbarui disposisi');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Independent Public Tracking search
  const handleTrackTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;

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
    }
  };

  const getKategoriBadge = (kategori: KategoriInformasi) => {
    switch (kategori) {
      case 'BERKALA':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
            Informasi Berkala
          </span>
        );
      case 'SERTA_MERTA':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
            Serta Merta (Darurat)
          </span>
        );
      case 'SETIAP_SAAT':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            Setiap Saat
          </span>
        );
      case 'DIKECUALIKAN':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-500/30 bg-slate-500/10 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            Dikecualikan (Pasal 17)
          </span>
        );
    }
  };

  const getStatusBadge = (status: StatusPermohonan) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300">
            <Clock className="h-3 w-3" />
            Menunggu Verifikasi
          </span>
        );
      case 'DIPROSES':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">
            <Sparkles className="h-3 w-3" />
            Sedang Diproses
          </span>
        );
      case 'DISETUJUI':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-3 w-3" />
            Permohonan Dikabulkan
          </span>
        );
      case 'DITOLAK':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-3 w-3" />
            Permohonan Ditolak
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

  const filteredReqs = useMemo(() => {
    return reqs.filter((r) => {
      const matchSearch =
        searchReq === '' ||
        r.nomorTiket.toLowerCase().includes(searchReq.toLowerCase()) ||
        r.namaPemohon.toLowerCase().includes(searchReq.toLowerCase()) ||
        r.nik.toLowerCase().includes(searchReq.toLowerCase()) ||
        r.rincianInformasi.toLowerCase().includes(searchReq.toLowerCase());

      const matchStatus = selectedStatusReq === 'ALL' || r.status === selectedStatusReq;
      return matchSearch && matchStatus;
    });
  }, [reqs, searchReq, selectedStatusReq]);

  return (
    <DashboardShell>
      {/* Page Header Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 rounded-2xl">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Portal Keterbukaan Informasi Publik (PPID)
              </h1>
              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                Area Pengelola
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Transparansi Dokumen Tata Kelola & Layanan Permohonan Informasi Daring SMAN 20 Kab. Tangerang (UU KIP No. 14/2008)
            </p>
          </div>
        </div>

        <a
          href="/publik/ppid"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 shadow-xs transition hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/60"
        >
          <span>🌐 Buka Portal Publik (Warga)</span>
        </a>
      </div>

      {/* Action Header & Tab Switcher */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setActiveTab('DOKUMEN')}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
              activeTab === 'DOKUMEN'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            )}
          >
            <FileText className="h-4 w-4 text-blue-500" />
            Dokumen Publik
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400">
              {docs.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('PERMOHONAN')}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
              activeTab === 'PERMOHONAN'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            )}
          >
            <FileCheck className="h-4 w-4 text-emerald-500" />
            Pelayanan Tiket Pemohon
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {reqs.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('TRACKER')}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
              activeTab === 'TRACKER'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            )}
          >
            <Search className="h-4 w-4 text-purple-500" />
            Lacak Status Tiket
          </button>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'DOKUMEN' ? (
            <button
              onClick={() => {
                setEditingDoc(null);
                setDocFormData({
                  nomorDokumen: `421.3/PPID-SMAN20/${new Date().getFullYear()}/${String(docs.length + 1).padStart(3, '0')}`,
                  judul: '',
                  kategori: 'BERKALA',
                  deskripsi: '',
                  pejabatPengesah: 'Kepala SMAN 20 Kabupaten Tangerang',
                  tahunAnggaran: new Date().getFullYear(),
                  fileUrl: '/documents/ppid/sample-document.pdf',
                  fileSize: '2.5 MB',
                  fileType: 'PDF',
                  isPublic: true,
                });
                setIsDocModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-500 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Terbitkan Dokumen Publik
            </button>
          ) : (
            <button
              onClick={() => {
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
                setIsReqModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-500 active:scale-95"
            >
              <Send className="h-4 w-4" />
              Buat Tiket Permohonan Informasi
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Dokumen Publik */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Dokumen Informasi Publik
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {stats?.totalDokumen || docs.length}
            </span>
            <span className="text-xs font-medium text-slate-500">berkas resmi</span>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            {stats?.docsPerKategori?.BERKALA || 0} Berkala • {stats?.docsPerKategori?.SETIAP_SAAT || 0} Setiap Saat
          </div>
        </div>

        {/* Total Unduhan Warga */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Akses Unduhan Publik
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <Download className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {stats?.totalDownload || 0}
            </span>
            <span className="text-xs font-medium text-slate-500">kali diunduh</span>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Transparansi keterbukaan dokumen
          </div>
        </div>

        {/* Tiket Permohonan */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tiket Permohonan Masuk
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {stats?.totalPermohonan || reqs.length}
            </span>
            <span className="text-xs font-medium text-slate-500">tiket</span>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            {stats?.reqsPerStatus?.PENDING || 0} Pending • {stats?.reqsPerStatus?.DIPROSES || 0} Diproses
          </div>
        </div>

        {/* SLA Penyelesaian */}
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/30 p-5 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Kepatuhan SLA KIP
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
              <Shield className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-emerald-900 dark:text-emerald-100">
              {stats?.persentaseTerselesaikan || 100}%
            </span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              Terselesaikan
            </span>
          </div>
          <div className="mt-3 text-xs text-emerald-800 dark:text-emerald-400">
            Sesuai Standar Layanan Informasi Publik
          </div>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: DOKUMEN PUBLIK
          ========================================================================= */}
      {activeTab === 'DOKUMEN' && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-900">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari judul dokumen publik, nomor SK, atau kata kunci..."
                value={searchDoc}
                onChange={(e) => setSearchDoc(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedKategoriDoc}
                onChange={(e) => setSelectedKategoriDoc(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="ALL">Semua Kategori UU KIP</option>
                <option value="BERKALA">Informasi Berkala</option>
                <option value="SERTA_MERTA">Serta Merta</option>
                <option value="SETIAP_SAAT">Setiap Saat</option>
                <option value="DIKECUALIKAN">Dikecualikan</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-800/50">
                    <th className="px-6 py-4">Nomor & Judul Dokumen</th>
                    <th className="px-6 py-4">Klasifikasi KIP</th>
                    <th className="px-6 py-4">Pengesah & Tahun</th>
                    <th className="px-6 py-4">Ukuran & Format</th>
                    <th className="px-6 py-4">Unduhan</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800 text-sm">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        Memuat katalog dokumen keterbukaan informasi...
                      </td>
                    </tr>
                  ) : filteredDocs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        Tidak ada dokumen publik yang sesuai.
                      </td>
                    </tr>
                  ) : (
                    filteredDocs.map((doc) => (
                      <tr
                        key={doc.id}
                        className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                      >
                        <td className="px-6 py-4 max-w-md">
                          <div className="font-semibold text-slate-900 dark:text-white line-clamp-2">
                            {doc.judul}
                          </div>
                          <div className="mt-1 font-mono text-xs text-blue-600 dark:text-blue-400">
                            {doc.nomorDokumen}
                          </div>
                          <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                            {doc.deskripsi}
                          </p>
                        </td>

                        <td className="px-6 py-4">{getKategoriBadge(doc.kategori)}</td>

                        <td className="px-6 py-4">
                          <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                            {doc.pejabatPengesah}
                          </div>
                          <div className="text-xs text-slate-500">
                            {doc.tahunAnggaran ? `TA ${doc.tahunAnggaran}` : '-'}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {doc.fileType}
                          </span>
                          <span className="ml-2 text-xs text-slate-500">{doc.fileSize}</span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                            <Download className="h-3.5 w-3.5 text-slate-400" />
                            {doc.downloadCount} kali
                          </div>
                        </td>

                        <td className="px-3 py-3 text-center relative w-12">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionMenuDocId(actionMenuDocId === doc.id ? null : doc.id);
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition dark:border-slate-700 dark:hover:bg-slate-800"
                            title="Menu Aksi Dokumen"
                            aria-label="Menu Aksi Dokumen"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* 3-Dots Dropdown Menu */}
                          {actionMenuDocId === doc.id && (
                            <>
                              <div
                                className="fixed inset-0 z-30"
                                onClick={() => setActionMenuDocId(null)}
                              />
                              <div className="absolute right-3 top-10 z-40 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-lg text-left text-xs dark:border-slate-700 dark:bg-slate-900 animate-in fade-in zoom-in-95">
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDownloadDoc(doc);
                                    setActionMenuDocId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 font-medium"
                                >
                                  <Download className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Unduh Berkas</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingDoc(doc);
                                    setDocFormData({
                                      nomorDokumen: doc.nomorDokumen,
                                      judul: doc.judul,
                                      kategori: doc.kategori,
                                      deskripsi: doc.deskripsi,
                                      pejabatPengesah: doc.pejabatPengesah,
                                      tahunAnggaran: doc.tahunAnggaran || new Date().getFullYear(),
                                      fileUrl: doc.fileUrl,
                                      fileSize: doc.fileSize,
                                      fileType: doc.fileType,
                                      isPublic: doc.isPublic,
                                    });
                                    setIsDocModalOpen(true);
                                    setActionMenuDocId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 font-medium"
                                >
                                  <Pencil className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Ubah Metadata</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (typeof navigator !== 'undefined') {
                                      navigator.clipboard.writeText(`${window.location.origin}/publik/ppid`);
                                      alert('Tautan portal publik berhasil disalin ke papan klip');
                                    }
                                    setActionMenuDocId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 font-medium"
                                >
                                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Salin Tautan</span>
                                </button>
                                <div className="border-t border-slate-100 my-1 dark:border-slate-800" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Hapus dokumen "${doc.judul}" dari katalog publik?`)) {
                                      handleDeleteDoc(doc.id);
                                    }
                                    setActionMenuDocId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Hapus Dokumen</span>
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: PELAYANAN TIKET PERMOHONAN
          ========================================================================= */}
      {activeTab === 'PERMOHONAN' && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-900">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kode tiket, nama pemohon, NIK, atau rincian permohonan..."
                value={searchReq}
                onChange={(e) => setSearchReq(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedStatusReq}
                onChange={(e) => setSelectedStatusReq(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="ALL">Semua Status Tiket</option>
                <option value="PENDING">Menunggu Verifikasi</option>
                <option value="DIPROSES">Sedang Diproses</option>
                <option value="DISETUJUI">Dikabulkan / Selesai</option>
                <option value="DITOLAK">Ditolak</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-800/50">
                    <th className="px-6 py-4">Nomor Tiket & Pemohon</th>
                    <th className="px-6 py-4">Rincian Informasi Diminta</th>
                    <th className="px-6 py-4">Tujuan Penggunaan</th>
                    <th className="px-6 py-4">Format Permohonan</th>
                    <th className="px-6 py-4">Status & Disposisi</th>
                    <th className="px-6 py-4 text-right">Tindakan Petugas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800 text-sm">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        <div className="flex justify-center items-center gap-2">
                           <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                           <span>Memuat antrean tiket permohonan...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredReqs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center">
                          <Search className="w-10 h-10 text-slate-300 mb-3" />
                          <p className="font-bold text-slate-700">Belum ada tiket permohonan</p>
                          <p className="text-xs text-slate-500 mt-1">Antrean permohonan informasi publik masih kosong.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredReqs.map((req) => (
                      <tr
                        key={req.id}
                        className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                      >
                        <td className="px-6 py-4">
                          <div className="font-mono font-bold text-blue-600 dark:text-blue-400">
                            {req.nomorTiket}
                          </div>
                          <div className="font-semibold text-slate-900 dark:text-white mt-0.5">
                            {req.namaPemohon}
                          </div>
                          <div className="text-xs text-slate-500">
                            NIK: {req.nik} • {req.kontak}
                          </div>
                          <div className="mt-1 text-[11px] text-slate-400">
                            Diajukan: {new Date(req.tanggalPengajuan).toLocaleDateString('id-ID')}
                          </div>
                        </td>

                        <td className="px-6 py-4 max-w-sm">
                          <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-3">
                            {req.rincianInformasi}
                          </p>
                        </td>

                        <td className="px-6 py-4 max-w-xs">
                          <span className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                            {req.tujuanPenggunaan}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {req.caraMemperoleh.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div>{getStatusBadge(req.status)}</div>
                          {req.catatanPetugas && (
                            <div className="mt-1.5 text-xs text-slate-500 italic line-clamp-2">
                              &ldquo;{req.catatanPetugas}&rdquo;
                            </div>
                          )}
                        </td>

                        <td className="px-3 py-3 text-center relative w-12">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionMenuReqId(actionMenuReqId === req.id ? null : req.id);
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition dark:border-slate-700 dark:hover:bg-slate-800"
                            title="Menu Aksi Tiket"
                            aria-label="Menu Aksi Tiket"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* 3-Dots Dropdown Menu */}
                          {actionMenuReqId === req.id && (
                            <>
                              <div
                                className="fixed inset-0 z-30"
                                onClick={() => setActionMenuReqId(null)}
                              />
                              <div className="absolute right-3 top-10 z-40 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg text-left text-xs dark:border-slate-700 dark:bg-slate-900 animate-in fade-in zoom-in-95">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedReqForDisposisi(req);
                                    setDisposisiData({
                                      status: req.status,
                                      catatanPetugas: req.catatanPetugas || '',
                                      petugasPenerima: req.petugasPenerima || 'Hj. Siti Rohmah, S.Sos (Petugas PPID)',
                                      dokumenJawabanUrl: req.dokumenJawabanUrl || '',
                                    });
                                    setActionMenuReqId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 font-semibold"
                                >
                                  <Pencil className="w-3.5 h-3.5 text-teal-600" />
                                  <span>Disposisi & Respon</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (typeof navigator !== 'undefined') {
                                      navigator.clipboard.writeText(req.nomorTiket);
                                      alert(`Nomor tiket ${req.nomorTiket} berhasil disalin!`);
                                    }
                                    setActionMenuReqId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 font-medium"
                                >
                                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Salin Nomor Tiket</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTrackingInput(req.nomorTiket);
                                    setTrackingResult(req);
                                    setActiveTab('TRACKER');
                                    setActionMenuReqId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 font-medium"
                                >
                                  <Search className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Lacak Alur Pemohon</span>
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: LACAK TIKET PEMOHON (PORTAL MANDIRI)
          ========================================================================= */}
      {activeTab === 'TRACKER' && (
        <div className="mx-auto max-w-2xl py-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 mb-4">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Cek Status Permohonan Informasi Publik
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Masukkan Nomor Tiket Registrasi (contoh:{' '}
              <span className="font-mono font-semibold text-purple-600 dark:text-purple-400">
                REG-PPID-2026-001
              </span>
              ) untuk memantau disposisi berkas permohonan Anda.
            </p>

            <form onSubmit={handleTrackTicket} className="mt-6 flex gap-3">
              <input
                type="text"
                placeholder="Nomor Tiket: REG-PPID-2026-XXX"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-mono text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="submit"
                className="rounded-2xl bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-purple-500 active:scale-95"
              >
                Lacak Tiket
              </button>
            </form>

            {trackingNotFound && (
              <div className="mt-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-medium text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
                Nomor tiket &ldquo;{trackingInput}&rdquo; tidak ditemukan. Mohon periksa kembali kode tiket pada bukti pendaftaran Anda.
              </div>
            )}

            {trackingResult && (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left dark:border-slate-800 dark:bg-slate-800/60">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700">
                  <div>
                    <span className="font-mono text-sm font-extrabold text-blue-600 dark:text-blue-400">
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
                    <span className="text-slate-500">Informasi Yang Diminta:</span>
                    <p className="mt-1 font-medium text-slate-800 dark:text-slate-200">
                      {trackingResult.rincianInformasi}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500">Tujuan Permohonan:</span>
                    <p className="mt-0.5 text-slate-700 dark:text-slate-300">
                      {trackingResult.tujuanPenggunaan}
                    </p>
                  </div>

                  {trackingResult.catatanPetugas && (
                    <div className="rounded-xl bg-white p-3 border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Catatan Resmi Petugas PPID:
                      </span>
                      <p className="mt-1 text-slate-600 dark:text-slate-400">
                        {trackingResult.catatanPetugas}
                      </p>
                    </div>
                  )}

                  {trackingResult.dokumenJawabanUrl && (
                    <div className="mt-3">
                      <a
                        href={trackingResult.dokumenJawabanUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white shadow-sm hover:bg-emerald-500"
                      >
                        <Download className="h-4 w-4" />
                        Unduh Berkas Salinan Jawaban Resmi
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
          MODAL 1: FORM TERBITKAN DOKUMEN PUBLIK
          ========================================================================= */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingDoc ? 'Edit Dokumen Informasi Publik' : 'Terbitkan Dokumen Informasi Publik'}
              </h3>
              <button
                onClick={() => setIsDocModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitDoc} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Surat / Dokumen *
                </label>
                <input
                  type="text"
                  value={docFormData.nomorDokumen}
                  onChange={(e) => setDocFormData({ ...docFormData, nomorDokumen: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Informasi Publik *
                </label>
                <input
                  type="text"
                  placeholder="Misal: Rencana Kerja dan Anggaran Sekolah (RKAS) BOS 2026"
                  value={docFormData.judul}
                  onChange={(e) => setDocFormData({ ...docFormData, judul: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Sesuai UU KIP *
                  </label>
                  <select
                    value={docFormData.kategori}
                    onChange={(e) =>
                      setDocFormData({ ...docFormData, kategori: e.target.value as KategoriInformasi })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="BERKALA">Informasi Berkala</option>
                    <option value="SERTA_MERTA">Serta Merta (Darurat)</option>
                    <option value="SETIAP_SAAT">Setiap Saat</option>
                    <option value="DIKECUALIKAN">Dikecualikan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tahun Anggaran
                  </label>
                  <input
                    type="number"
                    value={docFormData.tahunAnggaran}
                    onChange={(e) => setDocFormData({ ...docFormData, tahunAnggaran: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pejabat / Tim Pengesah
                </label>
                <input
                  type="text"
                  value={docFormData.pejabatPengesah}
                  onChange={(e) => setDocFormData({ ...docFormData, pejabatPengesah: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ringkasan / Deskripsi Dokumen
                </label>
                <textarea
                  rows={3}
                  value={docFormData.deskripsi}
                  onChange={(e) => setDocFormData({ ...docFormData, deskripsi: e.target.value })}
                  placeholder="Ringkasan isi keterbukaan informasi untuk diketahui masyarakat luas..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDocModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-blue-500"
                >
                  {editingDoc ? 'Simpan Perubahan' : 'Terbitkan Dokumen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: FORM PERMOHONAN INFORMASI DARING
          ========================================================================= */}
      {isReqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Form Pengajuan Permohonan Informasi Publik
                </h3>
                <p className="text-xs text-slate-500">
                  Permohonan diproses dalam jangka waktu maksimal 10+7 hari kerja sesuai UU KIP No. 14 Tahun 2008.
                </p>
              </div>
              <button
                onClick={() => setIsReqModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReq} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Pemohon *
                  </label>
                  <input
                    type="text"
                    placeholder="Nama lengkap sesuai KTP"
                    value={reqFormData.namaPemohon}
                    onChange={(e) => setReqFormData({ ...reqFormData, namaPemohon: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor Induk Kependudukan (NIK) *
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="16 digit NIK KTP"
                    value={reqFormData.nik}
                    onChange={(e) => setReqFormData({ ...reqFormData, nik: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor WhatsApp / HP Aktif *
                  </label>
                  <input
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={reqFormData.kontak}
                    onChange={(e) => setReqFormData({ ...reqFormData, kontak: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Aktif *
                  </label>
                  <input
                    type="email"
                    placeholder="pemohon@email.com"
                    value={reqFormData.email}
                    onChange={(e) => setReqFormData({ ...reqFormData, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori Pemohon
                </label>
                <select
                  value={reqFormData.kategoriPemohon}
                  onChange={(e) =>
                    setReqFormData({ ...reqFormData, kategoriPemohon: e.target.value as KategoriPemohon })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="PERORANGAN">Masyarakat / Perorangan</option>
                  <option value="ORANG_TUA">Orang Tua / Wali Murid</option>
                  <option value="MAHASISWA_PENELITI">Mahasiswa / Peneliti Akademik</option>
                  <option value="LEMBAGA_LSM">Lembaga Swadaya Masyarakat (LSM)</option>
                  <option value="MEDIA_PERS">Media Massa / Insan Pers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Rincian Informasi Yang Dibutuhkan *
                </label>
                <textarea
                  rows={3}
                  placeholder="Sebutkan rincian dokumen atau informasi yang Anda minta secara spesifik..."
                  value={reqFormData.rincianInformasi}
                  onChange={(e) => setReqFormData({ ...reqFormData, rincianInformasi: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tujuan Penggunaan Informasi
                </label>
                <input
                  type="text"
                  placeholder="Misal: Keperluan penelitian skripsi / Transparansi masyarakat"
                  value={reqFormData.tujuanPenggunaan}
                  onChange={(e) => setReqFormData({ ...reqFormData, tujuanPenggunaan: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cara Memperoleh Salinan
                </label>
                <select
                  value={reqFormData.caraMemperoleh}
                  onChange={(e) =>
                    setReqFormData({ ...reqFormData, caraMemperoleh: e.target.value as CaraMemperoleh })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="SALINAN_DIGITAL">Salinan Digital (Email / Unduh Portal)</option>
                  <option value="SALINAN_CETAK">Salinan Cetak Fisik (Diambil di Tata Usaha)</option>
                  <option value="MELIHAT_LANGSUNG">Melihat / Membaca Langsung di Sekolah</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReqModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-emerald-500"
                >
                  Kirimkan Permohonan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: BUKTI REGISTRASI TIKET PERMOHONAN
          ========================================================================= */}
      {createdTicketReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl dark:bg-slate-900 border-2 border-emerald-400">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-4">
              <CheckCircle2 className="h-8 w-8" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Permohonan Berhasil Diajukan!
                </h3>
                <p className="text-xs text-slate-500">
                  Simpan nomor tiket ini untuk melacak status tanggapan petugas PPID.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-emerald-50/80 border border-emerald-200 p-5 text-center dark:bg-emerald-950/40 dark:border-emerald-900">
              <div className="text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300 font-semibold">
                Nomor Tiket Registrasi Resmi
              </div>
              <div className="mt-1 text-2xl font-mono font-black text-emerald-700 dark:text-emerald-400">
                {createdTicketReceipt.nomorTiket}
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div><strong>Pemohon:</strong> {createdTicketReceipt.namaPemohon}</div>
              <div><strong>Kontak:</strong> {createdTicketReceipt.kontak} ({createdTicketReceipt.email})</div>
              <div><strong>Informasi:</strong> {createdTicketReceipt.rincianInformasi}</div>
              <div><strong>Batas SLA Jawaban:</strong> 10 Hari Kerja</div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setCreatedTicketReceipt(null)}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-500"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DRAWER / MODAL 4: DISPOSISI PETUGAS PPID
          ========================================================================= */}
      {selectedReqForDisposisi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Disposisi & Respon Petugas PPID
                </h3>
                <p className="text-xs font-mono text-blue-600 dark:text-blue-400">
                  {selectedReqForDisposisi.nomorTiket} • {selectedReqForDisposisi.namaPemohon}
                </p>
              </div>
              <button
                onClick={() => setSelectedReqForDisposisi(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDisposisi} className="mt-5 space-y-4">
              <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <strong>Rincian Permohonan:</strong>
                <p className="mt-1">{selectedReqForDisposisi.rincianInformasi}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Keputusan Status Permohonan *
                </label>
                <select
                  value={disposisiData.status}
                  onChange={(e) =>
                    setDisposisiData({
                      ...disposisiData,
                      status: e.target.value as StatusPermohonan,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="PENDING">Menunggu Verifikasi (Pending)</option>
                  <option value="DIPROSES">Sedang Diproses oleh Tim PPID</option>
                  <option value="DISETUJUI">Disetujui / Dikabulkan (Selesai)</option>
                  <option value="DITOLAK">Ditolak (Berdasarkan Uji Konsekuensi)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Petugas PPID Penanggung Jawab
                </label>
                <input
                  type="text"
                  value={disposisiData.petugasPenerima}
                  onChange={(e) =>
                    setDisposisiData({ ...disposisiData, petugasPenerima: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Resmi / Penjelasan Disposisi
                </label>
                <textarea
                  rows={3}
                  placeholder="Berikan penjelasan, alasan persetujuan/penolakan, atau instruksi pengambilan berkas..."
                  value={disposisiData.catatanPetugas}
                  onChange={(e) =>
                    setDisposisiData({ ...disposisiData, catatanPetugas: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tautan File Jawaban / Berkas Salinan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: /documents/ppid/jawaban/jawaban-reg-001.pdf"
                  value={disposisiData.dokumenJawabanUrl}
                  onChange={(e) =>
                    setDisposisiData({ ...disposisiData, dokumenJawabanUrl: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedReqForDisposisi(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                >
                  Simpan Disposisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
