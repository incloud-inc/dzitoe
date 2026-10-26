'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  HeartPulse,
  Search,
  Plus,
  Activity,
  AlertCircle,
  Thermometer,
  ShieldAlert,
  Pill,
  CheckCircle2,
  Download,
  Pencil,
  Trash2,
  X,
  Stethoscope,
  BedDouble,
  FileText,
  Printer,
  MessageSquare,
  ArrowUpRight,
  RotateCcw,
  Check,
  Lock,
  Shield,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { cn } from '@/lib/utils';

export type JenisKesehatan =
  | 'RIWAYAT_PENYAKIT'
  | 'ALERGI'
  | 'OBAT'
  | 'IMUNISASI'
  | 'PEMERIKSAAN'
  | 'CATATAN_MEDIS';

export type StatusUKS =
  | 'PULIH'
  | 'RAWAT_UKS'
  | 'RUJUK_PUSKESMAS'
  | 'PERLU_PERHATIAN'
  | 'PULANG_KE_RUMAH';

export interface HealthItem {
  id: string;
  muridId: string;
  muridNama: string;
  kelasNama: string;
  jenis: JenisKesehatan;
  golonganDarah?: string;
  tinggiBadan?: number | null;
  beratBadan?: number | null;
  suhuTubuh?: number | null;
  tekananDarah?: string | null;
  riwayatAlergi?: string | null;
  penyakitBawaan?: string | null;
  keluhan: string;
  penanganan?: string | null;
  obatDiberikan?: string | null;
  istirahatDiUks?: boolean;
  petugasUks: string;
  status: StatusUKS;
  tanggal: string;
  createdAt: string;
  updatedAt: string;
}

type QuickFilterType = 'ALL' | 'RAWAT_UKS' | 'PERLU_PERHATIAN' | 'ALERGI' | 'SKRINING';

export default function KesehatanPage() {
  const [records, setRecords] = useState<HealthItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [studentsList, setStudentsList] = useState<{ id: string; nama: string; kelasNama: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [quickFilter, setQuickFilter] = useState<QuickFilterType>('ALL');
  const [selectedJenis, setSelectedJenis] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modals & Drawer
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HealthItem | null>(null);
  const [detailRecord, setDetailRecord] = useState<HealthItem | null>(null);
  const [isActionSuccess, setIsActionSuccess] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    muridId: '',
    muridNama: '',
    kelasNama: '',
    jenis: 'CATATAN_MEDIS' as JenisKesehatan,
    golonganDarah: 'O',
    tinggiBadan: 165,
    beratBadan: 55,
    suhuTubuh: 36.8,
    tekananDarah: '110/70',
    riwayatAlergi: '',
    penyakitBawaan: '',
    keluhan: '',
    penanganan: '',
    obatDiberikan: '',
    istirahatDiUks: false,
    petugasUks: 'Hj. Siti Aminah, S.Kep (PMR/UKS)',
    status: 'PULIH' as StatusUKS,
    tanggal: new Date().toISOString().slice(0, 10),
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resKesehatan, resMurid] = await Promise.all([
        fetch('/api/kesehatan'),
        fetch('/api/murid?limit=100'),
      ]);
      const json = await resKesehatan.json();
      if (json.success) {
        setRecords(json.data);
        setStats(json.stats);
      }
      const jsonMurid = await resMurid.json();
      if (jsonMurid.data) {
        setStudentsList(jsonMurid.data.map((m: any) => ({ id: m.id, nama: m.nama, kelasNama: m.kelasNama })));
      }
    } catch (err) {
      console.error('Failed fetching health records', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStudentChange = (id: string) => {
    const s = studentsList.find((item) => item.id === id);
    setFormData((prev) => ({
      ...prev,
      muridId: id,
      muridNama: s ? s.nama : '',
      kelasNama: s ? s.kelasNama : '',
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingRecord ? `/api/kesehatan/${editingRecord.id}` : '/api/kesehatan';
      const method = editingRecord ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        setEditingRecord(null);
        resetForm();
        fetchData();
        showToast(editingRecord ? 'Rekam medis berhasil diperbarui' : 'Rekam medis baru berhasil dicatat');
      } else {
        alert(json.message || 'Gagal menyimpan rekam medis');
      }
    } catch (err) {
      console.error('Save health error', err);
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Hapus catatan rekam medis ${nama}?`)) return;
    try {
      const res = await fetch(`/api/kesehatan/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        if (detailRecord?.id === id) setDetailRecord(null);
        fetchData();
        showToast('Rekam medis berhasil dihapus');
      } else {
        alert(json.message || 'Gagal menghapus');
      }
    } catch (err) {
      console.error('Delete health error', err);
    }
  };

  const handleQuickStatusUpdate = async (id: string, newStatus: StatusUKS, istirahatDiUks: boolean) => {
    try {
      const res = await fetch(`/api/kesehatan/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, istirahatDiUks }),
      });
      const json = await res.json();
      if (json.success) {
        if (detailRecord?.id === id) {
          setDetailRecord({ ...detailRecord, status: newStatus, istirahatDiUks });
        }
        fetchData();
        showToast(`Status berhasil diubah menjadi: ${newStatus}`);
      }
    } catch (err) {
      console.error('Quick status update error', err);
    }
  };

  const showToast = (msg: string) => {
    setIsActionSuccess(msg);
    setTimeout(() => setIsActionSuccess(null), 3500);
  };

  const openEditModal = (item: HealthItem) => {
    setEditingRecord(item);
    setFormData({
      muridId: item.muridId,
      muridNama: item.muridNama,
      kelasNama: item.kelasNama,
      jenis: item.jenis,
      golonganDarah: item.golonganDarah || 'O',
      tinggiBadan: item.tinggiBadan || 165,
      beratBadan: item.beratBadan || 55,
      suhuTubuh: item.suhuTubuh || 36.5,
      tekananDarah: item.tekananDarah || '110/70',
      riwayatAlergi: item.riwayatAlergi || '',
      penyakitBawaan: item.penyakitBawaan || '',
      keluhan: item.keluhan,
      penanganan: item.penanganan || '',
      obatDiberikan: item.obatDiberikan || '',
      istirahatDiUks: item.istirahatDiUks ?? false,
      petugasUks: item.petugasUks || 'Hj. Siti Aminah, S.Kep (PMR/UKS)',
      status: item.status,
      tanggal: item.tanggal || new Date().toISOString().slice(0, 10),
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      muridId: studentsList[0]?.id || '',
      muridNama: studentsList[0]?.nama || '',
      kelasNama: studentsList[0]?.kelasNama || '',
      jenis: 'CATATAN_MEDIS',
      golonganDarah: 'O',
      tinggiBadan: 165,
      beratBadan: 55,
      suhuTubuh: 36.8,
      tekananDarah: '110/70',
      riwayatAlergi: '',
      penyakitBawaan: '',
      keluhan: '',
      penanganan: '',
      obatDiberikan: '',
      istirahatDiUks: false,
      petugasUks: 'Hj. Siti Aminah, S.Kep (PMR/UKS)',
      status: 'PULIH',
      tanggal: new Date().toISOString().slice(0, 10),
    });
  };

  // Filter pipeline
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Quick Filter Tab
      if (quickFilter === 'RAWAT_UKS' && r.status !== 'RAWAT_UKS') return false;
      if (quickFilter === 'PERLU_PERHATIAN' && r.status !== 'PERLU_PERHATIAN' && r.status !== 'RUJUK_PUSKESMAS') return false;
      if (quickFilter === 'ALERGI' && r.jenis !== 'ALERGI' && !r.riwayatAlergi && r.jenis !== 'RIWAYAT_PENYAKIT') return false;
      if (quickFilter === 'SKRINING' && r.jenis !== 'PEMERIKSAAN' && r.jenis !== 'IMUNISASI') return false;

      // Dropdown filters
      if (selectedJenis !== 'ALL' && r.jenis !== selectedJenis) return false;
      if (selectedStatus !== 'ALL' && r.status !== selectedStatus) return false;

      // Search keyword
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          r.muridNama.toLowerCase().includes(q) ||
          r.kelasNama.toLowerCase().includes(q) ||
          r.keluhan.toLowerCase().includes(q) ||
          (r.penanganan && r.penanganan.toLowerCase().includes(q)) ||
          (r.obatDiberikan && r.obatDiberikan.toLowerCase().includes(q)) ||
          (r.riwayatAlergi && r.riwayatAlergi.toLowerCase().includes(q)) ||
          (r.penyakitBawaan && r.penyakitBawaan.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [records, quickFilter, selectedJenis, selectedStatus, search]);

  // Clinical color helper for temperature
  const renderTemperatureBadge = (suhu?: number | null) => {
    if (!suhu) return <span className="text-slate-400">-</span>;
    if (suhu >= 38.0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
          <Thermometer className="w-3.5 h-3.5 text-rose-600 animate-bounce" /> {suhu.toFixed(1)}°C (Demam)
        </span>
      );
    }
    if (suhu >= 37.3) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <Thermometer className="w-3.5 h-3.5 text-amber-600" /> {suhu.toFixed(1)}°C (Subfebril)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
        <Thermometer className="w-3 h-3 text-slate-400" /> {suhu.toFixed(1)}°C
      </span>
    );
  };

  const getJenisBadge = (jenis: JenisKesehatan) => {
    switch (jenis) {
      case 'CATATAN_MEDIS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
            <Stethoscope className="w-3.5 h-3.5" /> Rekam Medis
          </span>
        );
      case 'ALERGI':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Alergi Siswa
          </span>
        );
      case 'IMUNISASI':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Pill className="w-3.5 h-3.5" /> Vaksinasi
          </span>
        );
      case 'PEMERIKSAAN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Activity className="w-3.5 h-3.5" /> Skrining Puskesmas
          </span>
        );
      case 'RIWAYAT_PENYAKIT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Penyakit Bawaan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {jenis}
          </span>
        );
    }
  };

  const getStatusBadge = (status: StatusUKS) => {
    switch (status) {
      case 'PULIH':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Pulih / Ke Kelas
          </span>
        );
      case 'RAWAT_UKS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs animate-pulse">
            <BedDouble className="w-3.5 h-3.5 text-amber-600" /> Sedang Dirawat UKS
          </span>
        );
      case 'RUJUK_PUSKESMAS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Rujuk Puskesmas
          </span>
        );
      case 'PULANG_KE_RUMAH':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Dijemput Orang Tua
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Perlu Perhatian
          </span>
        );
    }
  };

  const printMedicalLetter = (item: HealthItem) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Surat Keterangan Pemeriksaan UKS - ${item.muridNama}</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; padding: 40px; color: #111; line-height: 1.6; }
            .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 24px; }
            .kop h2 { margin: 0; font-size: 18px; text-transform: uppercase; }
            .kop h1 { margin: 4px 0; font-size: 22px; font-weight: bold; }
            .kop p { margin: 2px 0; font-size: 13px; }
            .title { text-align: center; font-weight: bold; text-decoration: underline; font-size: 16px; margin: 24px 0 6px 0; }
            .nomor { text-align: center; font-size: 13px; margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
            table td { padding: 6px 8px; vertical-align: top; }
            .label { width: 190px; font-weight: bold; }
            .ttd-box { margin-top: 40px; float: right; width: 250px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="kop">
            <h2>Pemerintah Provinsi Banten</h2>
            <h2>Dinas Pendidikan dan Kebudayaan</h2>
            <h1>SMAN 20 KABUPATEN TANGERANG</h1>
            <p>Jalan Raya Pakuhaji No. 20, Kab. Tangerang, Banten 15570 • Telp: (021) 5937-2020</p>
            <p><strong>UNIT KESEHATAN SEKOLAH (UKS) & PMR WIRA</strong></p>
          </div>

          <div class="title">SURAT KETERANGAN PEMERIKSAAN KESEHATAN UKS</div>
          <div class="nomor">Nomor: 421.3/UKS-SMAN20/${new Date().getFullYear()}/${item.id.slice(-4)}</div>

          <p>Menerangkan bahwa peserta didik di bawah ini:</p>
          <table>
            <tr><td class="label">Nama Lengkap Murid</td><td>: <strong>${item.muridNama}</strong></td></tr>
            <tr><td class="label">Kelas / Rombel</td><td>: ${item.kelasNama}</td></tr>
            <tr><td class="label">Waktu Pemeriksaan</td><td>: ${item.tanggal}</td></tr>
            <tr><td class="label">Golongan Darah</td><td>: ${item.golonganDarah || '-'}</td></tr>
            <tr><td class="label">Tanda Vital Fisik</td><td>: Suhu Tubuh: ${item.suhuTubuh || '-'}°C | Tensi: ${item.tekananDarah || '-'} mmHg</td></tr>
            <tr><td class="label">Keluhan / Indikasi</td><td>: ${item.keluhan}</td></tr>
            <tr><td class="label">Tindakan Pertolongan</td><td>: ${item.penanganan || '-'}</td></tr>
            <tr><td class="label">Obat yang Diberikan</td><td>: ${item.obatDiberikan || '-'}</td></tr>
            <tr><td class="label">Status / Tindak Lanjut</td><td>: <strong>${item.status === 'RAWAT_UKS' ? 'Diistirahatkan di ruang UKS' : item.status === 'RUJUK_PUSKESMAS' ? 'Dirujuk ke Puskesmas Terdekat' : item.status === 'PULANG_KE_RUMAH' ? 'Dijemput Pulang oleh Orang Tua' : 'Telah Pulih dan Kembali Mengikuti KBM'}</strong></td></tr>
          </table>

          <p>Demikian surat keterangan ini dibuat dengan sebenarnya untuk diketahui oleh Guru Pengajar / Wali Kelas / Orang Tua Murid / Puskesmas.</p>

          <div class="ttd-box">
            <p>Tangerang, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p>Petugas Jaga UKS / PMR,</p>
            <br><br><br>
            <p><strong>${item.petugasUks}</strong></p>
            <p>NIP/SIP: SMAN20-UKS</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const sendWhatsAppNotification = (item: HealthItem) => {
    const text = encodeURIComponent(
      `*PEMBERITAHUAN LAYANAN UKS SMAN 20 KAB. TANGERANG*\n\n` +
      `Yth. Bapak/Ibu Orang Tua / Wali dari ananda:\n` +
      `*Nama:* ${item.muridNama}\n` +
      `*Kelas:* ${item.kelasNama}\n` +
      `*Tanggal:* ${item.tanggal}\n\n` +
      `Menginformasikan bahwa ananda saat ini sedang dalam penanganan Unit Kesehatan Sekolah (UKS) SMAN 20 dengan keterangan:\n` +
      `• *Keluhan:* ${item.keluhan}\n` +
      `• *Suhu Tubuh:* ${item.suhuTubuh ? `${item.suhuTubuh}°C` : '-'}\n` +
      `• *Tindakan:* ${item.penanganan || 'Istirahat di ruang UKS'}\n` +
      `• *Obat Diberikan:* ${item.obatDiberikan || '-'}\n` +
      `• *Status Terkini:* ${item.status === 'RAWAT_UKS' ? 'Sedang beristirahat di UKS' : item.status === 'RUJUK_PUSKESMAS' ? 'Memerlukan rujukan Puskesmas' : item.status === 'PULANG_KE_RUMAH' ? 'Disarankan istirahat di rumah' : 'Sudah membaik'}\n\n` +
      `Petugas Penanggung Jawab: ${item.petugasUks}\n` +
      `Terima kasih. Salam sehat keluarga besar SMAN 20 Kab. Tangerang.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const exportCSV = () => {
    const headers = ['Tanggal', 'Nama Murid', 'Kelas', 'Jenis', 'Gol. Darah', 'Suhu (°C)', 'Tensi', 'Keluhan', 'Penanganan', 'Status', 'Petugas UKS'];
    const rows = filteredRecords.map((r) => [
      `"${r.tanggal}"`,
      `"${r.muridNama}"`,
      `"${r.kelasNama}"`,
      `"${r.jenis}"`,
      `"${r.golonganDarah || '-'}"`,
      r.suhuTubuh || '-',
      `"${r.tekananDarah || '-'}"`,
      `"${r.keluhan.replace(/"/g, '""')}"`,
      `"${(r.penanganan || '-').replace(/"/g, '""')}"`,
      `"${r.status}"`,
      `"${r.petugasUks}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekam_medis_uks_sman20_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Toast Notifikasi */}
        {isActionSuccess && (
          <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-sm font-medium rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-3">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{isActionSuccess}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-4 ring-rose-50/50">
              <HeartPulse className="w-6 h-6" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Kesehatan Siswa & UKS</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-900 text-slate-100 border border-slate-700 shadow-2xs">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>RESTRICTED • DATA MEDIS TERBATAS</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  Modul A22
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                SMAN 20 Kabupaten Tangerang — Rekam Medis Fisik, Tanda Vital, Alergi & Skrining Puskesmas (UU PDP No. 27/2022)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={exportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl transition shadow-2xs active:scale-[0.98]"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => {
                resetForm();
                setEditingRecord(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl shadow-xs transition active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Kunjungan UKS</span>
            </button>
          </div>
        </div>

        {/* Live UKS Alert Banner (jika ada siswa yang sedang rawat di UKS) */}
        {stats && stats.rawatUks > 0 && (
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-rose-500/10 border border-amber-300/80 shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs animate-pulse">
                <BedDouble className="w-5 h-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-amber-950">
                  Perhatian UKS: Terdapat {stats.rawatUks} Murid Sedang Beristirahat di Tempat Tidur UKS
                </p>
                <p className="text-xs text-amber-800">
                  Pantau tanda vital berkala dan pastikan wali kelas/orang tua telah terinformasi.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setQuickFilter('RAWAT_UKS')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition active:scale-95 shrink-0"
            >
              <span>Lihat Pasien UKS</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Bento Statistics Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => setQuickFilter('RAWAT_UKS')}
              className="group cursor-pointer bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-400 hover:shadow-xs transition"
            >
              <div className="flex items-center justify-between">
                <span className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-105 transition-transform">
                  <BedDouble className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  Live Bed
                </span>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500">Sedang Dirawat di UKS</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-slate-900">{stats.rawatUks}</span>
                  <span className="text-xs font-semibold text-amber-600">Murid Aktif</span>
                </div>
              </div>
            </div>

            <div
              onClick={() => setQuickFilter('PERLU_PERHATIAN')}
              className="group cursor-pointer bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-rose-400 hover:shadow-xs transition"
            >
              <div className="flex items-center justify-between">
                <span className="p-2.5 bg-rose-50 text-rose-600 rounded-xl group-hover:scale-105 transition-transform">
                  <AlertCircle className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                  Prioritas
                </span>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500">Perhatian / Rujukan</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-rose-600">{stats.butuhPerhatian}</span>
                  <span className="text-xs text-slate-500">Perlu Observasi</span>
                </div>
              </div>
            </div>

            <div
              onClick={() => setQuickFilter('ALERGI')}
              className="group cursor-pointer bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-indigo-400 hover:shadow-xs transition"
            >
              <div className="flex items-center justify-between">
                <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Kritis
                </span>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500">Riwayat Alergi & Bawaan</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-slate-900">
                    {(stats.perJenis?.ALERGI || 0) + (stats.perJenis?.RIWAYAT_PENYAKIT || 0)}
                  </span>
                  <span className="text-xs text-slate-500">Kasus Tercatat</span>
                </div>
              </div>
            </div>

            <div
              onClick={() => setQuickFilter('ALL')}
              className="group cursor-pointer bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-brand-400 hover:shadow-xs transition"
            >
              <div className="flex items-center justify-between">
                <span className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                  Akumulasi
                </span>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500">Total Kunjungan & Skrining</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
                  <span className="text-xs text-slate-500">Tahun Ajaran 2026</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Filter Tabs & Search Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
          {/* Top Row: Quick Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
            {[
              { id: 'ALL', label: 'Semua Rekam Medis', count: records.length },
              { id: 'RAWAT_UKS', label: 'Sedang di UKS', count: stats?.rawatUks || 0, isAmber: true },
              { id: 'PERLU_PERHATIAN', label: 'Perhatian & Rujukan', count: stats?.butuhPerhatian || 0, isRose: true },
              { id: 'ALERGI', label: 'Alergi & Bawaan', count: (stats?.perJenis?.ALERGI || 0) + (stats?.perJenis?.RIWAYAT_PENYAKIT || 0) },
              { id: 'SKRINING', label: 'Skrining & Vaksin', count: (stats?.perJenis?.PEMERIKSAAN || 0) + (stats?.perJenis?.IMUNISASI || 0) },
            ].map((tab) => {
              const active = quickFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setQuickFilter(tab.id as QuickFilterType)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95",
                    active
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[10px] font-bold tabular-nums",
                      active
                        ? "bg-white/20 text-white"
                        : tab.isAmber
                        ? "bg-amber-100 text-amber-800"
                        : tab.isRose
                        ? "bg-rose-100 text-rose-800"
                        : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Row: Search & Specific Dropdowns */}
          <div className="flex flex-col md:flex-row gap-3 justify-between items-center pt-1">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama murid, keluhan, obat, alergi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">Kategori:</span>
                <select
                  value={selectedJenis}
                  onChange={(e) => setSelectedJenis(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-rose-500"
                >
                  <option value="ALL">Semua Kategori</option>
                  <option value="CATATAN_MEDIS">Rekam Medis UKS</option>
                  <option value="ALERGI">Riwayat Alergi</option>
                  <option value="RIWAYAT_PENYAKIT">Penyakit Bawaan</option>
                  <option value="IMUNISASI">Imunisasi / Vaksin</option>
                  <option value="PEMERIKSAAN">Skrining Puskesmas</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-rose-500"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="PULIH">Pulih (Kembali KBM)</option>
                  <option value="RAWAT_UKS">Sedang Dirawat UKS</option>
                  <option value="RUJUK_PUSKESMAS">Rujuk Puskesmas</option>
                  <option value="PULANG_KE_RUMAH">Dijemput Ortu</option>
                  <option value="PERLU_PERHATIAN">Perlu Perhatian</option>
                </select>
              </div>

              {(search || selectedJenis !== 'ALL' || selectedStatus !== 'ALL' || quickFilter !== 'ALL') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setSelectedJenis('ALL');
                    setSelectedStatus('ALL');
                    setQuickFilter('ALL');
                  }}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                  title="Reset Filter"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Medical Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Tanggal & Murid</th>
                  <th className="px-5 py-3.5">Kategori Medis</th>
                  <th className="px-5 py-3.5">Tanda Vital & Fisik</th>
                  <th className="px-5 py-3.5">Keluhan & Terapi Obat</th>
                  <th className="px-5 py-3.5">Status & Penanganan</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  // Skeleton Rows
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-5 py-4">
                        <div className="h-4 w-32 bg-slate-200 rounded mb-1.5" />
                        <div className="h-3 w-20 bg-slate-100 rounded" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-6 w-24 bg-slate-200 rounded-full" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-28 bg-slate-200 rounded mb-1.5" />
                        <div className="h-3 w-16 bg-slate-100 rounded" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-44 bg-slate-200 rounded mb-1.5" />
                        <div className="h-3 w-32 bg-slate-100 rounded" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-6 w-24 bg-slate-200 rounded-full" />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="h-7 w-16 bg-slate-200 rounded-lg ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-3">
                        <HeartPulse className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-bold text-slate-800">Tidak ada rekam medis ditemukan</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        Coba sesuaikan kata kunci pencarian atau reset filter untuk menampilkan data kesehatan lainnya.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearch('');
                          setSelectedJenis('ALL');
                          setSelectedStatus('ALL');
                          setQuickFilter('ALL');
                        }}
                        className="mt-4 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                      >
                        Reset Filter
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setDetailRecord(item)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      {/* Tanggal & Murid */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors flex items-center gap-1.5">
                          <span>{item.muridNama}</span>
                          {item.istirahatDiUks && (
                            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">
                          {item.kelasNama} • {item.tanggal}
                        </div>
                      </td>

                      {/* Kategori Medis */}
                      <td className="px-5 py-4">{getJenisBadge(item.jenis)}</td>

                      {/* Tanda Vital & Fisik */}
                      <td className="px-5 py-4">
                        <div className="space-y-1 text-xs">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {renderTemperatureBadge(item.suhuTubuh)}
                            {item.golonganDarah && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                Gol. {item.golonganDarah}
                              </span>
                            )}
                          </div>
                          {item.tekananDarah && (
                            <div className="text-slate-500 font-mono text-[11px]">
                              Tensi: {item.tekananDarah} mmHg
                            </div>
                          )}
                          {item.riwayatAlergi && (
                            <div className="text-rose-700 font-bold flex items-center gap-1 truncate max-w-xs text-[11px] bg-rose-50 px-2 py-0.5 rounded-md">
                              <ShieldAlert className="w-3 h-3 shrink-0 text-rose-600" />
                              <span className="truncate">{item.riwayatAlergi}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Keluhan & Terapi Obat */}
                      <td className="px-5 py-4 max-w-xs">
                        <div className="font-semibold text-slate-900 text-xs line-clamp-1">{item.keluhan}</div>
                        {item.penanganan && (
                          <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {item.penanganan}
                          </div>
                        )}
                        {item.obatDiberikan && (
                          <div className="text-xs font-semibold text-indigo-700 mt-1 flex items-center gap-1">
                            <Pill className="w-3 h-3 text-indigo-500 shrink-0" />
                            <span className="truncate">{item.obatDiberikan}</span>
                          </div>
                        )}
                      </td>

                      {/* Status & Petugas */}
                      <td className="px-5 py-4">
                        <div>{getStatusBadge(item.status)}</div>
                        <div className="text-[11px] text-slate-400 mt-1 truncate max-w-[140px]">
                          {item.petugasUks}
                        </div>
                      </td>

                      {/* Aksi Cepat */}
                      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setDetailRecord(item)}
                            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition"
                            title="Buka Berkas Rekam Medis"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => printMedicalLetter(item)}
                            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition"
                            title="Cetak Surat Izin / Keterangan UKS"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-rose-600 rounded-lg transition"
                            title="Edit Rekam Medis"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.muridNama)}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
                            title="Hapus Catatan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-Over Clinical Dossier Drawer (Detail Murid) */}
      {detailRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header Drawer */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-2 ring-rose-100">
                  <Stethoscope className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">Berkas Medis Pasien UKS</h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-100 border border-slate-700">
                      <Lock className="w-2.5 h-2.5 text-amber-400" /> RAHASIA MEDIS
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">ID: {detailRecord.id} • {detailRecord.tanggal}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailRecord(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Drawer */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Patient Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/40 via-white to-slate-50 border border-rose-100 flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{detailRecord.muridNama}</h4>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    Kelas: {detailRecord.kelasNama} • SMAN 20 Kabupaten Tangerang
                  </p>
                </div>
                <div>{getStatusBadge(detailRecord.status)}</div>
              </div>

              {/* Tanda Vital Bento */}
              <div>
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Tanda-Tanda Vital & Pemeriksaan Fisik
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <p className="text-[11px] font-medium text-slate-500">Suhu Tubuh</p>
                    <div className="mt-1">{renderTemperatureBadge(detailRecord.suhuTubuh)}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <p className="text-[11px] font-medium text-slate-500">Tekanan Darah</p>
                    <p className="text-sm font-bold text-slate-800 mt-1 font-mono">
                      {detailRecord.tekananDarah || '-'} <span className="text-[10px] text-slate-400">mmHg</span>
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <p className="text-[11px] font-medium text-slate-500">Golongan Darah</p>
                    <p className="text-sm font-bold text-rose-700 mt-1">
                      {detailRecord.golonganDarah || '-'}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <p className="text-[11px] font-medium text-slate-500">TB / BB</p>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {detailRecord.tinggiBadan || '-'} cm / {detailRecord.beratBadan || '-'} kg
                    </p>
                  </div>
                </div>
              </div>

              {/* Peringatan Khusus Alergi & Penyakit Kronis */}
              {(detailRecord.riwayatAlergi || detailRecord.penyakitBawaan) && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>PERINGATAN KHUSUS MEDIS MURID</span>
                  </div>
                  {detailRecord.riwayatAlergi && (
                    <p className="text-xs">
                      <strong>Alergi Diketahui:</strong> {detailRecord.riwayatAlergi}
                    </p>
                  )}
                  {detailRecord.penyakitBawaan && (
                    <p className="text-xs">
                      <strong>Penyakit Bawaan/Kronis:</strong> {detailRecord.penyakitBawaan}
                    </p>
                  )}
                </div>
              )}

              {/* Anamnesis & Tindakan */}
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Keluhan Murid (Anamnesis)</p>
                  <p className="text-sm text-slate-800 font-medium">{detailRecord.keluhan}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tindakan Pertolongan Pertama</p>
                  <p className="text-sm text-slate-800">{detailRecord.penanganan || 'Tidak ada tindakan khusus tercatat.'}</p>
                </div>

                {detailRecord.obatDiberikan && (
                  <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200 space-y-1">
                    <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Obat / Terapi yang Diberikan</span>
                    </p>
                    <p className="text-sm font-semibold text-indigo-950">{detailRecord.obatDiberikan}</p>
                  </div>
                )}

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                  <span>Petugas UKS / PMR Pemeriksa:</span>
                  <span className="font-bold text-slate-800">{detailRecord.petugasUks}</span>
                </div>
              </div>

              {/* Quick Status Changers */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Tindakan Cepat Status Pasien
                </p>
                <div className="flex flex-wrap gap-2">
                  {detailRecord.status !== 'PULIH' && (
                    <button
                      type="button"
                      onClick={() => handleQuickStatusUpdate(detailRecord.id, 'PULIH', false)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition active:scale-95"
                    >
                      ✓ Tandai Pulih ke Kelas
                    </button>
                  )}
                  {detailRecord.status !== 'RAWAT_UKS' && (
                    <button
                      type="button"
                      onClick={() => handleQuickStatusUpdate(detailRecord.id, 'RAWAT_UKS', true)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition active:scale-95"
                    >
                      🛏️ Istirahatkan di UKS
                    </button>
                  )}
                  {detailRecord.status !== 'RUJUK_PUSKESMAS' && (
                    <button
                      type="button"
                      onClick={() => handleQuickStatusUpdate(detailRecord.id, 'RUJUK_PUSKESMAS', false)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition active:scale-95"
                    >
                      🚑 Rujuk ke Puskesmas
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => printMedicalLetter(detailRecord)}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl transition shadow-2xs active:scale-95"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Cetak Surat UKS</span>
              </button>

              <button
                type="button"
                onClick={() => sendWhatsAppNotification(detailRecord)}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-2xs active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Orang Tua</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Medical Record */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-rose-50/40">
              <div className="flex items-center gap-2.5">
                <HeartPulse className="w-5 h-5 text-rose-600" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">
                      {editingRecord ? 'Perbarui Rekam Medis UKS' : 'Catat Pemeriksaan & Kunjungan UKS'}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-100 border border-slate-700">
                      <Lock className="w-2.5 h-2.5 text-amber-400" /> RESTRICTED
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Kerahasiaan data dijamin UU PDP No. 27/2022</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Privacy Warning Banner */}
              <div className="p-3 bg-amber-50/90 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-amber-900">
                <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold">Formulir Rekam Medis Terbatas:</span> Data ini bersifat rahasia dan hanya diperuntukkan bagi petugas medis UKS dan Tim Pembina PMR. Setiap pengisian data terikat kode etik kerahasiaan pasien sekolah.
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Murid *</label>
                  <select
                    required
                    value={formData.muridId}
                    onChange={(e) => handleStudentChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  >
                    <option value="">-- Pilih Murid --</option>
                    {studentsList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nama} ({s.kelasNama})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Layanan *</label>
                  <select
                    value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value as JenisKesehatan })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  >
                    <option value="CATATAN_MEDIS">Rekam Medis Sakit di Sekolah</option>
                    <option value="ALERGI">Pencatatan Riwayat Alergi</option>
                    <option value="RIWAYAT_PENYAKIT">Penyakit Bawaan / Kronis</option>
                    <option value="IMUNISASI">Imunisasi / Vaksinasi Berkala</option>
                    <option value="PEMERIKSAAN">Skrining Puskesmas / Fisik Berkala</option>
                  </select>
                </div>
              </div>

              {/* Tanda Vital Card */}
              <div className="grid grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Golongan Darah</label>
                  <select
                    value={formData.golonganDarah}
                    onChange={(e) => setFormData({ ...formData, golonganDarah: e.target.value })}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="O">O</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="TIDAK_DIKETAHUI">Belum Tahu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Suhu Tubuh (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.suhuTubuh}
                    onChange={(e) => setFormData({ ...formData, suhuTubuh: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tekanan Darah</label>
                  <input
                    type="text"
                    placeholder="110/70"
                    value={formData.tekananDarah}
                    onChange={(e) => setFormData({ ...formData, tekananDarah: e.target.value })}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">TB / BB (cm / kg)</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      placeholder="TB"
                      value={formData.tinggiBadan}
                      onChange={(e) => setFormData({ ...formData, tinggiBadan: Number(e.target.value) })}
                      className="w-1/2 px-1.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                    <input
                      type="number"
                      placeholder="BB"
                      value={formData.beratBadan}
                      onChange={(e) => setFormData({ ...formData, beratBadan: Number(e.target.value) })}
                      className="w-1/2 px-1.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Riwayat Alergi (Jika Ada)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Alergi udang, amoksisilin, dingin"
                    value={formData.riwayatAlergi}
                    onChange={(e) => setFormData({ ...formData, riwayatAlergi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Penyakit Bawaan (Jika Ada)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Asma, Jantung bawaan, Maag kronis"
                    value={formData.penyakitBawaan}
                    onChange={(e) => setFormData({ ...formData, penyakitBawaan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Keluhan / Diagnosa Awal *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Keluhan yang dirasakan murid saat jam sekolah..."
                  value={formData.keluhan}
                  onChange={(e) => setFormData({ ...formData, keluhan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tindakan / Penanganan</label>
                  <input
                    type="text"
                    placeholder="Kompres hangat, istirahat..."
                    value={formData.penanganan}
                    onChange={(e) => setFormData({ ...formData, penanganan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Obat yang Diberikan</label>
                  <input
                    type="text"
                    placeholder="Paracetamol 500mg, Antasida..."
                    value={formData.obatDiberikan}
                    onChange={(e) => setFormData({ ...formData, obatDiberikan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status Pasca Rawat</label>
                  <select
                    value={formData.status}
                    onChange={(e) => {
                      const st = e.target.value as StatusUKS;
                      setFormData({
                        ...formData,
                        status: st,
                        istirahatDiUks: st === 'RAWAT_UKS',
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="PULIH">Pulih (Kembali ke Kelas)</option>
                    <option value="RAWAT_UKS">Sedang Dirawat di UKS</option>
                    <option value="RUJUK_PUSKESMAS">Dirujuk ke Puskesmas</option>
                    <option value="PULANG_KE_RUMAH">Dijemput Pulang oleh Ortu</option>
                    <option value="PERLU_PERHATIAN">Perlu Perhatian Khusus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Petugas UKS / Pemeriksa</label>
                  <input
                    type="text"
                    value={formData.petugasUks}
                    onChange={(e) => setFormData({ ...formData, petugasUks: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition active:scale-95"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition shadow-xs active:scale-95"
                >
                  Simpan Rekam Medis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
