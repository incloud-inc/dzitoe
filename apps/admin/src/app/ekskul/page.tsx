'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Trophy,
  Users,
  Plus,
  Search,
  Calendar,
  MapPin,
  Medal,
  RefreshCw,
  Edit2,
  Trash2,
  UserPlus,
  ClipboardList,
  XCircle,
  Award,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import {
  type EkstrakurikulerRecord as Ekstrakurikuler,
  type AnggotaEkskul,
  type PresensiEkskul,
  type EkskulKategori,
  KATEGORI_COLORS,
} from '@dzitoe/db';

export default function EkskulPage() {
  const [activeTab, setActiveTab] = useState<'katalog' | 'anggota' | 'presensi'>('katalog');
  const [ekskulList, setEkskulList] = useState<Ekstrakurikuler[]>([]);
  const [anggotaList, setAnggotaList] = useState<AnggotaEkskul[]>([]);
  const [presensiList, setPresensiList] = useState<PresensiEkskul[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState<string>('');
  const [selectedEkskulId, setSelectedEkskulId] = useState<string>('');

  const [summary, setSummary] = useState({
    totalEkskul: 10,
    totalAnggota: 280,
    olahraga: 2,
    belaNegara: 3,
    seniDanAkademik: 5,
  });

  // Modals
  const [isAddEkskulModalOpen, setIsAddEkskulModalOpen] = useState(false);
  const [isEditEkskulModalOpen, setIsEditEkskulModalOpen] = useState(false);
  const [isAddAnggotaModalOpen, setIsAddAnggotaModalOpen] = useState(false);
  const [isRecordPresensiModalOpen, setIsRecordPresensiModalOpen] = useState(false);

  const [selectedEkskul, setSelectedEkskul] = useState<Ekstrakurikuler | null>(null);

  // Form states
  const [ekskulForm, setEkskulForm] = useState({
    kode: '',
    nama: '',
    kategori: 'OLAHRAGA' as EkskulKategori,
    kategoriLabel: 'Olahraga & Atletik',
    deskripsi: '',
    pembinaGuruId: '',
    pembinaNama: '',
    pembinaNip: '',
    hariKegiatan: 'Sabtu',
    jamMulai: '15:30',
    jamSelesai: '17:30',
    lokasi: 'Lapangan SMAN 20',
    kuota: 30,
    prestasiTerakhir: '-',
    fotoUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=500',
    status: 'AKTIF' as 'AKTIF' | 'NONAKTIF',
  });

  const [anggotaForm, setAnggotaForm] = useState({
    ekskulId: '',
    muridId: '',
    jabatan: 'ANGGOTA' as AnggotaEkskul['jabatan'],
  });

  const [presensiForm, setPresensiForm] = useState({
    ekskulId: '',
    tanggal: new Date().toISOString().split('T')[0] ?? '2026-09-28',
    materiLatihan: '',
    pembinaHadir: true,
    totalHadir: 25,
    totalIzin: 2,
    totalAlpa: 0,
    catatan: '',
  });

  // Dropdown data
  const [teachers, setTeachers] = useState<{ id: string; nip: string; nama: string }[]>([]);
  const [students, setStudents] = useState<{ id: string; nisn: string; nama: string; kelasNama: string }[]>([]);

  const fetchEkskul = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (kategoriFilter) params.set('kategori', kategoriFilter);

      const res = await fetch(`/api/ekskul?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setEkskulList(json.data);
        setSummary(json.summary);
      }
    } catch (err) {
      console.error('Failed to load ekskul:', err);
    } finally {
      setLoading(false);
    }
  }, [search, kategoriFilter]);

  const fetchAnggota = useCallback(async () => {
    try {
      const url = selectedEkskulId
        ? `/api/ekskul/anggota?ekskulId=${selectedEkskulId}`
        : '/api/ekskul/anggota';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setAnggotaList(json.data);
      }
    } catch (err) {
      console.error('Failed to load anggota:', err);
    }
  }, [selectedEkskulId]);

  const fetchPresensi = useCallback(async () => {
    try {
      const url = selectedEkskulId
        ? `/api/ekskul/presensi?ekskulId=${selectedEkskulId}`
        : '/api/ekskul/presensi';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setPresensiList(json.data);
      }
    } catch (err) {
      console.error('Failed to load presensi:', err);
    }
  }, [selectedEkskulId]);

  useEffect(() => {
    fetchEkskul();
  }, [fetchEkskul]);

  useEffect(() => {
    if (activeTab === 'anggota') fetchAnggota();
    if (activeTab === 'presensi') fetchPresensi();
  }, [activeTab, fetchAnggota, fetchPresensi]);

  // Load teachers & students for dropdowns
  useEffect(() => {
    fetch('/api/guru?limit=50')
      .then((r) => r.json())
      .then((j) => {
        if (j.success && j.data) {
          setTeachers(j.data.map((t: any) => ({ id: t.id, nip: t.nip, nama: t.nama })));
        }
      })
      .catch(() => {});

    fetch('/api/murid?limit=150')
      .then((r) => r.json())
      .then((j) => {
        if (j.success && j.data) {
          setStudents(
            j.data.map((s: any) => ({
              id: s.id,
              nisn: s.nisn,
              nama: s.nama,
              kelasNama: s.kelasNama,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleCreateEkskul = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/ekskul', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ekskulForm),
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        setIsAddEkskulModalOpen(false);
        fetchEkskul();
      } else {
        alert(json.message);
      }
    } catch (err: any) {
      alert('Gagal membuat ekskul: ' + err.message);
    }
  };

  const handleUpdateEkskul = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEkskul) return;
    try {
      const res = await fetch('/api/ekskul', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedEkskul.id, ...ekskulForm }),
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        setIsEditEkskulModalOpen(false);
        fetchEkskul();
      } else {
        alert(json.message);
      }
    } catch (err: any) {
      alert('Gagal memperbarui ekskul: ' + err.message);
    }
  };

  const handleDeleteEkskul = async (id: string, nama: string) => {
    if (!confirm(`Hapus ekstrakurikuler "${nama}"?`)) return;
    try {
      const res = await fetch(`/api/ekskul?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        fetchEkskul();
      } else {
        alert(json.message);
      }
    } catch (err: any) {
      alert('Gagal menghapus: ' + err.message);
    }
  };

  const handleAddAnggota = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/ekskul/anggota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anggotaForm),
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        setIsAddAnggotaModalOpen(false);
        fetchAnggota();
        fetchEkskul();
      } else {
        alert(json.message);
      }
    } catch (err: any) {
      alert('Gagal menambahkan anggota: ' + err.message);
    }
  };

  const handleRemoveAnggota = async (id: string, nama: string) => {
    if (!confirm(`Keluarkan ${nama} dari ekstrakurikuler?`)) return;
    try {
      const res = await fetch(`/api/ekskul/anggota?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchAnggota();
        fetchEkskul();
      } else {
        alert(json.message);
      }
    } catch (err: any) {
      alert('Gagal menghapus anggota: ' + err.message);
    }
  };

  const handleRecordPresensi = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/ekskul/presensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(presensiForm),
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        setIsRecordPresensiModalOpen(false);
        fetchPresensi();
      } else {
        alert(json.message);
      }
    } catch (err: any) {
      alert('Gagal mencatat presensi: ' + err.message);
    }
  };

  const openEditEkskul = (e: Ekstrakurikuler) => {
    setSelectedEkskul(e);
    setEkskulForm({
      kode: e.kode,
      nama: e.nama,
      kategori: e.kategori,
      kategoriLabel: e.kategoriLabel,
      deskripsi: e.deskripsi,
      pembinaGuruId: e.pembinaGuruId,
      pembinaNama: e.pembinaNama,
      pembinaNip: e.pembinaNip,
      hariKegiatan: e.hariKegiatan,
      jamMulai: e.jamMulai,
      jamSelesai: e.jamSelesai,
      lokasi: e.lokasi,
      kuota: e.kuota,
      prestasiTerakhir: e.prestasiTerakhir,
      fotoUrl: e.fotoUrl,
      status: e.status,
    });
    setIsEditEkskulModalOpen(true);
  };

  return (
    <DashboardShell>
      <div className="space-y-6 pb-12">
        {/* Top Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-600/20">
                Modul A8 • Master Data Sekolah
              </span>
              <span className="text-xs text-slate-500">SMAN 20 Kab. Tangerang</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Ekstrakurikuler & Pembinaan Bakat
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Wadah pengembangan potensi minat bakat, kepemimpinan, dan karakter Pelajar Pancasila.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                fetchEkskul();
                if (activeTab === 'anggota') fetchAnggota();
                if (activeTab === 'presensi') fetchPresensi();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Segarkan
            </button>
            <button
              onClick={() => setIsAddEkskulModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Tambah Ekskul Baru
            </button>
          </div>
        </div>

        {/* 4 Metric Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Ekstrakurikuler</span>
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <Trophy className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{summary.totalEkskul}</div>
            <p className="mt-1 text-[11px] text-indigo-600">Semua aktif beroperasi</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Partisipasi Murid</span>
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{summary.totalAnggota}</div>
            <p className="mt-1 text-[11px] text-emerald-600">Anggota aktif terdaftar</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Bela Negara & Pramuka</span>
              <div className="rounded-lg bg-red-50 p-2 text-red-600">
                <Medal className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{summary.belaNegara}</div>
            <p className="mt-1 text-[11px] text-red-600">Paskibra, Pramuka, PMR</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Seni, Sains & Olahraga</span>
              <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {summary.olahraga + summary.seniDanAkademik}
            </div>
            <p className="mt-1 text-[11px] text-amber-600">7 Cabang Minat Prestasi</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('katalog')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-colors ${
              activeTab === 'katalog'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>Katalog & Profil Ekskul ({ekskulList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('anggota')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-colors ${
              activeTab === 'anggota'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Daftar Anggota & Pengurus</span>
          </button>

          <button
            onClick={() => setActiveTab('presensi')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-colors ${
              activeTab === 'presensi'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            <span>Jurnal & Presensi Latihan Mingguan</span>
          </button>
        </div>

        {/* TAB 1: KATALOG EKSKUL */}
        {activeTab === 'katalog' && (
          <div className="space-y-6">
            {/* Filter */}
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari ekstrakurikuler (nama, kode, nama pembina)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>
              <select
                value={kategoriFilter}
                onChange={(e) => setKategoriFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
              >
                <option value="">Semua Kategori</option>
                {Object.keys(KATEGORI_COLORS).map((k) => (
                  <option key={k} value={k}>
                    {KATEGORI_COLORS[k as EkskulKategori].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Grid Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div className="col-span-full py-12 text-center text-slate-500">
                  <RefreshCw className="mx-auto h-6 w-6 animate-spin text-indigo-600" />
                  <p className="mt-2 text-xs">Memuat katalog ekstrakurikuler...</p>
                </div>
              ) : ekskulList.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500">
                  Tidak ditemukan ekstrakurikuler.
                </div>
              ) : (
                ekskulList.map((e) => {
                  const meta = KATEGORI_COLORS[e.kategori] || {
                    label: e.kategori,
                    badge: 'bg-slate-100 text-slate-800',
                  };

                  return (
                    <div
                      key={e.id}
                      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-md hover:border-indigo-300 transition"
                    >
                      <div>
                        {/* Standardized Header with Logo Bounding Box */}
                        <div className="p-5 pb-3 flex items-start gap-3.5">
                          {/* Standardized Logo / Icon Bounding Box */}
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-slate-200/90 bg-slate-50 p-1 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-indigo-300 transition-colors relative overflow-hidden">
                            {e.fotoUrl ? (
                              <img
                                src={e.fotoUrl}
                                alt={e.nama}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-full rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                {e.kode || e.nama.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>

                          {/* Meta & Title */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
                                {e.kode}
                              </span>
                              <span
                                className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${meta.badge}`}
                              >
                                {meta.label}
                              </span>
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded ml-auto">
                                {e.status}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 leading-snug truncate group-hover:text-indigo-600 transition-colors">
                              {e.nama}
                            </h3>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="px-5 pb-4 space-y-3 text-xs">
                          <p className="line-clamp-2 text-slate-600 leading-relaxed">
                            {e.deskripsi || 'Kegiatan ekstrakurikuler pembinaan minat bakat peserta didik SMAN 20.'}
                          </p>

                          <div className="space-y-1.5 rounded-xl bg-slate-50 p-3 text-slate-700 border border-slate-100">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4 text-indigo-600 shrink-0" />
                              <span className="font-medium truncate">
                                Pembina: <strong>{e.pembinaNama || 'Guru Pembina'}</strong>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                              <span>
                                {e.hariKegiatan} ({e.jamMulai} - {e.jamSelesai} WIB)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                              <span className="truncate">{e.lokasi}</span>
                            </div>
                          </div>

                          {/* Prestasi */}
                          {e.prestasiTerakhir && e.prestasiTerakhir !== '-' && (
                            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/70 p-2.5 text-[11px] text-amber-900">
                              <Award className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold">Prestasi Terbaru:</span>
                                <p className="mt-0.5">{e.prestasiTerakhir}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-3 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Users className="h-4 w-4 text-slate-400" />
                          <span className="font-semibold text-slate-900">{e.jumlahAnggota}</span>
                          <span className="text-[11px] text-slate-500">/ {e.kuota} Kuota</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedEkskulId(e.id);
                              setActiveTab('anggota');
                            }}
                            className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100"
                          >
                            Anggota
                          </button>
                          <button
                            onClick={() => openEditEkskul(e)}
                            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                            title="Edit Ekskul"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEkskul(e.id, e.nama)}
                            className="rounded-lg p-1 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                            title="Hapus Ekskul"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: DAFTAR ANGGOTA & PENGURUS */}
        {activeTab === 'anggota' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">Filter Ekskul:</span>
                <select
                  value={selectedEkskulId}
                  onChange={(e) => setSelectedEkskulId(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none"
                >
                  <option value="">Semua Ekstrakurikuler</option>
                  {ekskulList.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nama} ({e.jumlahAnggota} murid)
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setAnggotaForm({
                    ekskulId: selectedEkskulId || (ekskulList[0]?.id ?? ''),
                    muridId: '',
                    jabatan: 'ANGGOTA',
                  });
                  setIsAddAnggotaModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Tambah Anggota Siswa
              </button>
            </div>

            {/* Table Anggota */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Nama Siswa</th>
                    <th className="px-4 py-3">NISN & Kelas</th>
                    <th className="px-4 py-3">Jabatan di Ekskul</th>
                    <th className="px-4 py-3">Tanggal Bergabung</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {anggotaList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                        Belum ada anggota terdaftar pada filter ini.
                      </td>
                    </tr>
                  ) : (
                    anggotaList.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-900">{a.muridNama}</td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-slate-700">{a.nisn}</span>
                          <span className="text-slate-400"> • </span>
                          <span className="font-medium text-slate-600">Kelas {a.kelasNama}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${
                              a.jabatan === 'KETUA'
                                ? 'bg-amber-100 text-amber-800'
                                : a.jabatan === 'WAKIL_KETUA'
                                ? 'bg-blue-100 text-blue-800'
                                : a.jabatan === 'SEKRETARIS' || a.jabatan === 'BENDAHARA'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {a.jabatan}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{a.tanggalBergabung}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {a.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleRemoveAnggota(a.id, a.muridNama)}
                            className="rounded p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Keluarkan Anggota"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: JURNAL & PRESENSI LATIHAN */}
        {activeTab === 'presensi' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">Filter Ekskul:</span>
                <select
                  value={selectedEkskulId}
                  onChange={(e) => setSelectedEkskulId(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none"
                >
                  <option value="">Semua Riwayat Presensi</option>
                  {ekskulList.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nama}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setPresensiForm({
                    ekskulId: selectedEkskulId || (ekskulList[0]?.id ?? ''),
                    tanggal: new Date().toISOString().split('T')[0] ?? '2026-09-28',
                    materiLatihan: '',
                    pembinaHadir: true,
                    totalHadir: 25,
                    totalIzin: 2,
                    totalAlpa: 0,
                    catatan: '',
                  });
                  setIsRecordPresensiModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Catat Pertemuan Latihan Baru
              </button>
            </div>

            {/* List Presensi Cards */}
            <div className="space-y-3">
              {presensiList.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
                  Belum ada log presensi latihan pada filter ini.
                </div>
              ) : (
                presensiList.map((pr) => (
                  <div
                    key={pr.id}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{pr.ekskulNama}</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono text-xs text-indigo-600 font-semibold">
                          {pr.tanggal}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-700">
                        Materi: <span className="text-slate-900">{pr.materiLatihan}</span>
                      </p>
                      {pr.catatan && (
                        <p className="text-[11px] text-slate-500 italic">Catatan: {pr.catatan}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Hadir</span>
                          <span className="font-bold text-emerald-700">{pr.totalHadir}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Izin</span>
                          <span className="font-bold text-blue-700">{pr.totalIzin}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Alpa</span>
                          <span className="font-bold text-rose-700">{pr.totalAlpa}</span>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold ${
                          pr.pembinaHadir
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {pr.pembinaHadir ? 'Pembina Hadir' : 'Didampingi Pelatih'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Modal Tambah / Edit Ekskul */}
        {(isAddEkskulModalOpen || isEditEkskulModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {isAddEkskulModalOpen ? 'Tambah Ekstrakurikuler Baru' : 'Edit Ekstrakurikuler'}
                </h3>
                <button
                  onClick={() => {
                    setIsAddEkskulModalOpen(false);
                    setIsEditEkskulModalOpen(false);
                  }}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={isAddEkskulModalOpen ? handleCreateEkskul : handleUpdateEkskul}
                className="mt-4 space-y-3 text-xs"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700">Kode Ekskul *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FUT-05"
                      value={ekskulForm.kode}
                      onChange={(e) => setEkskulForm({ ...ekskulForm, kode: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700">Kategori *</label>
                    <select
                      value={ekskulForm.kategori}
                      onChange={(e) => {
                        const k = e.target.value as EkskulKategori;
                        setEkskulForm({
                          ...ekskulForm,
                          kategori: k,
                          kategoriLabel: KATEGORI_COLORS[k]?.label || k,
                        });
                      }}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                    >
                      {Object.keys(KATEGORI_COLORS).map((k) => (
                        <option key={k} value={k}>
                          {KATEGORI_COLORS[k as EkskulKategori].label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700">Nama Ekstrakurikuler *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Futsal Club SMAN 20"
                    value={ekskulForm.nama}
                    onChange={(e) => setEkskulForm({ ...ekskulForm, nama: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700">Pilih Guru Pembina *</label>
                  <select
                    value={ekskulForm.pembinaGuruId}
                    onChange={(e) => {
                      const t = teachers.find((tch) => tch.id === e.target.value);
                      if (t) {
                        setEkskulForm({
                          ...ekskulForm,
                          pembinaGuruId: t.id,
                          pembinaNama: t.nama,
                          pembinaNip: t.nip,
                        });
                      }
                    }}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">-- Pilih Guru Pembina dari 35 GTK --</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nama} (NIP: {t.nip})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700">Hari Latihan</label>
                    <input
                      type="text"
                      placeholder="e.g. Senin & Kamis"
                      value={ekskulForm.hariKegiatan}
                      onChange={(e) => setEkskulForm({ ...ekskulForm, hariKegiatan: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700">Jam Mulai</label>
                    <input
                      type="time"
                      value={ekskulForm.jamMulai}
                      onChange={(e) => setEkskulForm({ ...ekskulForm, jamMulai: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700">Jam Selesai</label>
                    <input
                      type="time"
                      value={ekskulForm.jamSelesai}
                      onChange={(e) => setEkskulForm({ ...ekskulForm, jamSelesai: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700">Lokasi / Fasilitas</label>
                    <input
                      type="text"
                      placeholder="e.g. Lapangan Basket Outdoor"
                      value={ekskulForm.lokasi}
                      onChange={(e) => setEkskulForm({ ...ekskulForm, lokasi: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700">Kuota Maksimal Murid</label>
                    <input
                      type="number"
                      value={ekskulForm.kuota}
                      onChange={(e) => setEkskulForm({ ...ekskulForm, kuota: Number(e.target.value) })}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700">Deskripsi Singkat</label>
                  <textarea
                    rows={2}
                    value={ekskulForm.deskripsi}
                    onChange={(e) => setEkskulForm({ ...ekskulForm, deskripsi: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddEkskulModalOpen(false);
                      setIsEditEkskulModalOpen(false);
                    }}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                  >
                    Simpan Data Ekskul
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Tambah Anggota */}
        {isAddAnggotaModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Tambah Anggota Siswa</h3>
                <button
                  onClick={() => setIsAddAnggotaModalOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddAnggota} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700">Pilih Ekstrakurikuler *</label>
                  <select
                    value={anggotaForm.ekskulId}
                    onChange={(e) => setAnggotaForm({ ...anggotaForm, ekskulId: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none"
                  >
                    {ekskulList.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700">Pilih Siswa (150 Murid Terdaftar) *</label>
                  <select
                    required
                    value={anggotaForm.muridId}
                    onChange={(e) => setAnggotaForm({ ...anggotaForm, muridId: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none"
                  >
                    <option value="">-- Pilih Siswa --</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nama} ({s.kelasNama} - {s.nisn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700">Jabatan Kepengurusan</label>
                  <select
                    value={anggotaForm.jabatan}
                    onChange={(e) => setAnggotaForm({ ...anggotaForm, jabatan: e.target.value as any })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none"
                  >
                    <option value="ANGGOTA">Anggota</option>
                    <option value="KETUA">Ketua Ekskul</option>
                    <option value="WAKIL_KETUA">Wakil Ketua</option>
                    <option value="SEKRETARIS">Sekretaris</option>
                    <option value="BENDAHARA">Bendahara</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddAnggotaModalOpen(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
                  >
                    Daftarkan Siswa
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Catat Presensi Latihan */}
        {isRecordPresensiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Catat Pertemuan Latihan</h3>
                <button
                  onClick={() => setIsRecordPresensiModalOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleRecordPresensi} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700">Ekstrakurikuler *</label>
                  <select
                    value={presensiForm.ekskulId}
                    onChange={(e) => setPresensiForm({ ...presensiForm, ekskulId: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none"
                  >
                    {ekskulList.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700">Tanggal Latihan *</label>
                  <input
                    type="date"
                    required
                    value={presensiForm.tanggal}
                    onChange={(e) => setPresensiForm({ ...presensiForm, tanggal: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700">Materi / Agenda Latihan *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Drill passing kontrol & formasi transisi"
                    value={presensiForm.materiLatihan}
                    onChange={(e) => setPresensiForm({ ...presensiForm, materiLatihan: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-semibold text-emerald-700">Jumlah Hadir</label>
                    <input
                      type="number"
                      value={presensiForm.totalHadir}
                      onChange={(e) => setPresensiForm({ ...presensiForm, totalHadir: Number(e.target.value) })}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-blue-700">Izin/Sakit</label>
                    <input
                      type="number"
                      value={presensiForm.totalIzin}
                      onChange={(e) => setPresensiForm({ ...presensiForm, totalIzin: Number(e.target.value) })}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-rose-700">Alpa</label>
                    <input
                      type="number"
                      value={presensiForm.totalAlpa}
                      onChange={(e) => setPresensiForm({ ...presensiForm, totalAlpa: Number(e.target.value) })}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={presensiForm.pembinaHadir}
                    onChange={(e) => setPresensiForm({ ...presensiForm, pembinaHadir: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-700 font-medium">Guru Pembina Hadir Langsung</span>
                </label>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsRecordPresensiModalOpen(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
                  >
                    Simpan Presensi Pertemuan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
