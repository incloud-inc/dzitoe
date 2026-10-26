"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  BookOpen,
  FileText,
  GraduationCap,
  Loader2,
  AlertCircle,
  Edit2,
  Trash2,
  X,
  Upload
} from "lucide-react";
import { ExcelImportModal } from "@/components/common/ExcelImportModal";

// ==================== TYPES ====================
interface Mapel {
  id: string;
  nama: string;
  kode: string;
}

interface Kurikulum {
  id: string;
  kelas: string;
  semester: string;
  mapelId: string;
  mapel?: {
    nama: string;
    kode: string;
  };
}

interface Bab {
  id: string;
  kelasKurikulumId: string;
  nama: string;
  urutan: number;
  deskripsi?: string;
}

interface Materi {
  id: string;
  babId: string;
  nama: string;
  deskripsi?: string;
  capaianBelajar?: string;
  tujuanBelajar?: string;
  alurTujuan?: string;
}

// ==================== HELPER FUNCTIONS ====================
const toggleSetItem = (set: Set<string>, value: string): Set<string> => {
  const newSet = new Set(set);
  if (newSet.has(value)) {
    newSet.delete(value);
  } else {
    newSet.add(value);
  }
  return newSet;
};

const extractArray = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
};

// ==================== MAIN PAGE COMPONENT ====================
export default function KurikulumPage() {
  const [kurikulumList, setKurikulumList] = useState<Kurikulum[]>([]);
  const [babList, setBabList] = useState<Bab[]>([]);
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [mapelList, setMapelList] = useState<Mapel[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedKurikulum, setExpandedKurikulum] = useState<Set<string>>(new Set());
  const [expandedBab, setExpandedBab] = useState<Set<string>>(new Set());

  // Modal States
  const [isKurikulumModalOpen, setKurikulumModalOpen] = useState(false);
  const [isBabModalOpen, setBabModalOpen] = useState(false);
  const [isMateriModalOpen, setMateriModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setImportModalOpen] = useState(false);

  // Form States
  const [activeKurikulum, setActiveKurikulum] = useState<Partial<Kurikulum> | null>(null);
  const [activeBab, setActiveBab] = useState<Partial<Bab> | null>(null);
  const [activeMateri, setActiveMateri] = useState<Partial<Materi> | null>(null);
  
  // Delete Target
  const [deleteTarget, setDeleteTarget] = useState<{type: 'kurikulum' | 'bab' | 'materi', id: string, name: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [kurikulumRes, babRes, materiRes, mapelRes] = await Promise.all([
        fetch('/api/kurikulum'),
        fetch('/api/kurikulum/bab'),
        fetch('/api/kurikulum/materi'),
        fetch('/api/kurikulum/mapel')
      ]);

      if (!kurikulumRes.ok || !babRes.ok || !materiRes.ok || !mapelRes.ok) {
        throw new Error('Salah satu endpoint mengembalikan status error');
      }

      setKurikulumList(extractArray(await kurikulumRes.json()));
      setBabList(extractArray(await babRes.json()));
      setMateriList(extractArray(await materiRes.json()));
      setMapelList(extractArray(await mapelRes.json()));
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers for Kurikulum
  const openKurikulumModal = (k?: Kurikulum) => {
    setActiveKurikulum(k || { kelas: 'X', semester: 'GANJIL', mapelId: '' });
    setKurikulumModalOpen(true);
  };
  const submitKurikulum = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeKurikulum?.mapelId || !activeKurikulum?.kelas || !activeKurikulum?.semester) return;
    setIsSubmitting(true);
    try {
      const isEdit = !!activeKurikulum.id;
      const res = await fetch(`/api/kurikulum${isEdit ? `/${activeKurikulum.id}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeKurikulum)
      });
      if (res.ok) {
        setKurikulumModalOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menyimpan data');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handlers for Bab
  const openBabModal = (kelasKurikulumId: string, b?: Bab) => {
    const defaultUrutan = babList.filter(x => x.kelasKurikulumId === kelasKurikulumId).length + 1;
    setActiveBab(b || { kelasKurikulumId, nama: '', urutan: defaultUrutan, deskripsi: '' });
    setBabModalOpen(true);
  };
  const submitBab = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeBab?.nama || !activeBab?.kelasKurikulumId) return;
    setIsSubmitting(true);
    try {
      const isEdit = !!activeBab.id;
      const res = await fetch(`/api/kurikulum/bab${isEdit ? `/${activeBab.id}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeBab)
      });
      if (res.ok) {
        setBabModalOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menyimpan data');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handlers for Materi
  const openMateriModal = (babId: string, m?: Materi) => {
    setActiveMateri(m || { babId, nama: '', deskripsi: '', capaianBelajar: '', tujuanBelajar: '', alurTujuan: '' });
    setMateriModalOpen(true);
  };
  const submitMateri = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeMateri?.nama || !activeMateri?.babId) return;
    setIsSubmitting(true);
    try {
      const isEdit = !!activeMateri.id;
      const res = await fetch(`/api/kurikulum/materi${isEdit ? `/${activeMateri.id}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeMateri)
      });
      if (res.ok) {
        setMateriModalOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menyimpan data');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handlers
  const confirmDelete = (type: 'kurikulum' | 'bab' | 'materi', id: string, name: string) => {
    setDeleteTarget({ type, id, name });
    setDeleteModalOpen(true);
  };
  const executeDelete = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      const endpoints = {
        kurikulum: '/api/kurikulum',
        bab: '/api/kurikulum/bab',
        materi: '/api/kurikulum/materi'
      };
      const res = await fetch(`${endpoints[deleteTarget.type]}/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteModalOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menghapus data');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && kurikulumList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />
          <p className="mt-3 text-sm text-slate-600">Memuat data kurikulum...</p>
        </div>
      </div>
    );
  }

  if (error && kurikulumList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-8 flex items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center max-w-md">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
          <p className="mt-2 text-sm font-medium text-red-800">Gagal memuat data</p>
          <p className="mt-1 text-sm text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 relative">
      <div className="mx-auto max-w-5xl relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              Manajemen Kurikulum Merdeka
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Kelola kelas, bab, dan materi pembelajaran.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setImportModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md bg-white border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2 text-slate-500" />
              Import Excel
            </button>
            <button
              onClick={() => openKurikulumModal()}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kurikulum
            </button>
          </div>
        </div>

        <div className="mt-6">
          {kurikulumList.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-900">
                Belum ada kurikulum
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Mulai dengan menambahkan kurikulum baru.
              </p>
              <button
                onClick={() => openKurikulumModal()}
                className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kurikulum
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {kurikulumList.map((kurikulum) => {
                const babs = babList.filter((b) => b.kelasKurikulumId === kurikulum.id).sort((a,b) => a.urutan - b.urutan);
                const isExpanded = expandedKurikulum.has(kurikulum.id);

                return (
                  <div
                    key={kurikulum.id}
                    className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 cursor-pointer"
                      onClick={() => setExpandedKurikulum((prev) => toggleSetItem(prev, kurikulum.id))}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="font-semibold text-slate-900">
                              {kurikulum.mapel?.nama || "Tanpa Mapel"}
                            </h2>
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              Kelas {kurikulum.kelas}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 uppercase">
                            Semester {kurikulum.semester}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); openKurikulumModal(kurikulum); }}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="Edit Kurikulum"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); confirmDelete('kurikulum', kurikulum.id, `${kurikulum.mapel?.nama} (Kelas ${kurikulum.kelas})`); }}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                          title="Hapus Kurikulum"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="h-4 w-px bg-slate-200 mx-1"></div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openBabModal(kurikulum.id);
                          }}
                          className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Tambah Bab
                        </button>
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-slate-200 bg-slate-50/50 p-4">
                        <div className="space-y-3">
                          {babs.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-4">
                              Belum ada bab untuk kurikulum ini.
                            </p>
                          ) : (
                            babs.map((bab) => {
                              const materiInBab = materiList.filter((m) => m.babId === bab.id);
                              const isBabExpanded = expandedBab.has(bab.id);

                              return (
                                <div
                                  key={bab.id}
                                  className="border-t border-slate-100 bg-transparent"
                                >
                                  <div
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                                    onClick={() => setExpandedBab((prev) => toggleSetItem(prev, bab.id))}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-100 text-emerald-600">
                                        <FileText className="h-4 w-4" />
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium text-slate-800">
                                            {bab.nama}
                                          </span>
                                          <span className="text-xs text-slate-400">
                                            Urutan {bab.urutan}
                                          </span>
                                        </div>
                                        <span className="text-xs text-slate-500">
                                          {materiInBab.length} materi
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={(e) => { e.stopPropagation(); openBabModal(kurikulum.id, bab); }}
                                        className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                                      >
                                        <Edit2 className="h-3.5 w-3.5" />
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); confirmDelete('bab', bab.id, bab.nama); }}
                                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                      <div className="h-3 w-px bg-slate-200 mx-1"></div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openMateriModal(bab.id);
                                        }}
                                        className="inline-flex items-center rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                      >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Tambah Materi
                                      </button>
                                      {isBabExpanded ? (
                                        <ChevronDown className="h-4 w-4 text-slate-400" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 text-slate-400" />
                                      )}
                                    </div>
                                  </div>

                                  {isBabExpanded && (
                                    <div className="border-t border-slate-200 p-3">
                                      <div className="space-y-3">
                                        {materiInBab.length === 0 ? (
                                          <p className="text-sm text-slate-500 text-center py-2">
                                            Belum ada materi.
                                          </p>
                                        ) : (
                                          materiInBab.map((materi) => (
                                            <div key={materi.id} className="ml-4 pl-4 sm:ml-8 sm:pl-6 border-l-2 border-slate-100 bg-transparent py-3 hover:bg-slate-50 transition-colors relative group">
                                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                <button onClick={() => openMateriModal(bab.id, materi)} className="p-1 bg-white border border-slate-200 rounded text-slate-500 hover:text-indigo-600">
                                                  <Edit2 className="h-3 w-3" />
                                                </button>
                                                <button onClick={() => confirmDelete('materi', materi.id, materi.nama)} className="p-1 bg-white border border-slate-200 rounded text-slate-500 hover:text-red-600">
                                                  <Trash2 className="h-3 w-3" />
                                                </button>
                                              </div>
                                              <div className="flex items-start justify-between gap-2 pr-12">
                                                <div className="flex items-center gap-2">
                                                  <FileText className="h-4 w-4 text-slate-400" />
                                                  <h4 className="text-sm font-medium text-slate-900">{materi.nama}</h4>
                                                </div>
                                              </div>
                                              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div>
                                                  <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">CP</span>
                                                  <p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-3" title={materi.capaianBelajar || ''}>
                                                    {materi.capaianBelajar || 'Belum ada CP'}
                                                  </p>
                                                </div>
                                                <div>
                                                  <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">TP</span>
                                                  <p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-3" title={materi.tujuanBelajar || ''}>
                                                    {materi.tujuanBelajar || 'Belum ada TP'}
                                                  </p>
                                                </div>
                                                <div>
                                                  <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">ATP</span>
                                                  <p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-3" title={materi.alurTujuan || ''}>
                                                    {materi.alurTujuan || 'Belum ada ATP'}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          ))
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      
      {/* Kurikulum Modal */}
      {isKurikulumModalOpen && activeKurikulum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg">{activeKurikulum.id ? 'Edit Kurikulum' : 'Tambah Kurikulum'}</h3>
              <button onClick={() => setKurikulumModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5"/></button>
            </div>
            <form onSubmit={submitKurikulum} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mata Pelajaran</label>
                <select 
                  className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                  value={activeKurikulum.mapelId}
                  onChange={(e) => setActiveKurikulum({...activeKurikulum, mapelId: e.target.value})}
                  required
                >
                  <option value="">Pilih Mapel...</option>
                  {mapelList.map(m => <option key={m.id} value={m.id}>{m.nama} ({m.kode})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kelas</label>
                  <select 
                    className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                    value={activeKurikulum.kelas}
                    onChange={(e) => setActiveKurikulum({...activeKurikulum, kelas: e.target.value})}
                    required
                  >
                    {['X', 'XI', 'XII'].map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
                  <select 
                    className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                    value={activeKurikulum.semester}
                    onChange={(e) => setActiveKurikulum({...activeKurikulum, semester: e.target.value})}
                    required
                  >
                    <option value="GANJIL">Ganjil</option>
                    <option value="GENAP">Genap</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setKurikulumModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bab Modal */}
      {isBabModalOpen && activeBab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg">{activeBab.id ? 'Edit Bab' : 'Tambah Bab'}</h3>
              <button onClick={() => setBabModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5"/></button>
            </div>
            <form onSubmit={submitBab} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Bab</label>
                <input 
                  type="text"
                  className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                  value={activeBab.nama}
                  onChange={(e) => setActiveBab({...activeBab, nama: e.target.value})}
                  required
                  placeholder="Contoh: Bilangan Eksponen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Urutan</label>
                <input 
                  type="number"
                  min="1"
                  className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                  value={activeBab.urutan}
                  onChange={(e) => setActiveBab({...activeBab, urutan: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi (Opsional)</label>
                <textarea 
                  className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                  value={activeBab.deskripsi || ''}
                  onChange={(e) => setActiveBab({...activeBab, deskripsi: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setBabModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Materi Modal */}
      {isMateriModalOpen && activeMateri && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] relative">
            <div className="flex justify-between items-center p-4 border-b shrink-0">
              <h3 className="font-semibold text-lg">{activeMateri.id ? 'Edit Materi' : 'Tambah Materi'}</h3>
              <button onClick={() => setMateriModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5"/></button>
            </div>
            <form onSubmit={submitMateri} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Materi / Sub-Bab</label>
                  <input 
                    type="text"
                    className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                    value={activeMateri.nama}
                    onChange={(e) => setActiveMateri({...activeMateri, nama: e.target.value})}
                    required
                    placeholder="Contoh: Sifat-sifat Eksponen"
                  />
                </div>
                
                <div className="bg-indigo-50 p-3 rounded border border-indigo-100">
                  <h4 className="text-xs font-semibold text-indigo-800 uppercase mb-2">Capaian Pembelajaran (CP)</h4>
                  <textarea 
                    className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border text-sm"
                    value={activeMateri.capaianBelajar || ''}
                    onChange={(e) => setActiveMateri({...activeMateri, capaianBelajar: e.target.value})}
                    rows={3}
                    placeholder="Peserta didik mampu..."
                  />
                </div>

                <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                  <h4 className="text-xs font-semibold text-emerald-800 uppercase mb-2">Tujuan Pembelajaran (TP)</h4>
                  <textarea 
                    className="w-full border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 p-2 border text-sm"
                    value={activeMateri.tujuanBelajar || ''}
                    onChange={(e) => setActiveMateri({...activeMateri, tujuanBelajar: e.target.value})}
                    rows={3}
                    placeholder="Siswa dapat memahami..."
                  />
                </div>

                <div className="bg-amber-50 p-3 rounded border border-amber-100">
                  <h4 className="text-xs font-semibold text-amber-800 uppercase mb-2">Alur Tujuan Pembelajaran (ATP)</h4>
                  <textarea 
                    className="w-full border-slate-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 p-2 border text-sm"
                    value={activeMateri.alurTujuan || ''}
                    onChange={(e) => setActiveMateri({...activeMateri, alurTujuan: e.target.value})}
                    rows={3}
                    placeholder="Langkah 1..."
                  />
                </div>
              </div>
              <div className="p-4 flex justify-end gap-2 border-t shrink-0">
                <button type="button" onClick={() => setMateriModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden text-center p-6 relative">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Hapus {deleteTarget.type.charAt(0).toUpperCase() + deleteTarget.type.slice(1)}</h3>
            <p className="text-sm text-slate-500 mb-6">
              Apakah Anda yakin ingin menghapus <strong>{deleteTarget.name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                type="button" 
                onClick={() => setDeleteModalOpen(false)} 
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 w-full"
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={executeDelete} 
                disabled={isSubmitting} 
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 w-full disabled:opacity-50"
              >
                {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Import Data Kurikulum & Materi"
        subtitle="Unggah file Excel berisi kurikulum, bab, dan materi secara massal"
        templateUrl="/api/kurikulum/template"
        templateFilename="Template_Kurikulum_Dzitoe.xlsx"
        uploadEndpoint="/api/kurikulum/import"
        sampleColumns={["KodeMapel", "Kelas", "Semester", "Nama Bab", "UrutanBab", "Nama Materi", "CP", "TP", "ATP"]}
        onImportSuccess={() => {
          setImportModalOpen(false);
          fetchData();
        }}
      />
    </div>
  );
}
