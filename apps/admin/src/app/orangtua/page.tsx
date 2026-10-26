'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  UserCheck,
  Search,
  Filter,
  Plus,
  Pencil,
  Trash2,
  MessageCircle,
  Users,
  GraduationCap,
  Building,
  Mail,
  Home,
  Briefcase,
  X,
  AlertTriangle,
  HeartHandshake,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { cn } from '@/lib/utils';

export interface ParentItem {
  id: string;
  nama: string;
  nik: string;
  hubungan: 'AYAH' | 'IBU' | 'WALI';
  noHp: string;
  pekerjaan: string;
  penghasilan: string;
  alamat: string;
  muridIds: string[];
  isPrimaryContact: boolean;
  email?: string;
  muridList?: Array<{
    id: string;
    nama: string;
    nis: string;
    nisn: string;
    kelasNama: string;
  }>;
}

export interface StudentOption {
  id: string;
  nama: string;
  nis: string;
  nisn: string;
  kelasNama: string;
}

const HUBUNGAN_OPTIONS = [
  { value: 'ALL', label: 'Semua Hubungan' },
  { value: 'AYAH', label: 'Ayah Kandung' },
  { value: 'IBU', label: 'Ibu Kandung' },
  { value: 'WALI', label: 'Wali Murid' },
];

export default function OrangTuaPage() {
  const [parents, setParents] = useState<ParentItem[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedHubungan, setSelectedHubungan] = useState('ALL');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete State
  const [parentToDelete, setParentToDelete] = useState<ParentItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    hubungan: 'AYAH' as 'AYAH' | 'IBU' | 'WALI',
    noHp: '',
    pekerjaan: '',
    penghasilan: 'Rp 3.000.000 - Rp 5.000.000',
    alamat: '',
    email: '',
    isPrimaryContact: true,
    muridIds: [] as string[],
  });

  // Student search inside modal
  const [studentSearch, setStudentSearch] = useState('');

  const fetchParents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedHubungan !== 'ALL') params.set('hubungan', selectedHubungan);

      const res = await fetch(`/api/orangtua?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setParents(json.data);
      }
    } catch (err) {
      console.error('Gagal mengambil data orang tua:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/murid?limit=150');
      const json = await res.json();
      if (json.success && json.data) {
        setStudents(
          json.data.map((s: any) => ({
            id: s.id,
            nama: s.nama,
            nis: s.nis,
            nisn: s.nisn,
            kelasNama: s.kelasNama,
          }))
        );
      }
    } catch (err) {
      console.error('Gagal mengambil referensi murid:', err);
    }
  };

  useEffect(() => {
    fetchParents();
  }, [search, selectedHubungan]);

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filtered students for picker
  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return students.slice(0, 15);
    const q = studentSearch.toLowerCase();
    return students.filter(
      (s) =>
        s.nama.toLowerCase().includes(q) ||
        s.nis.includes(q) ||
        s.nisn.includes(q) ||
        s.kelasNama.toLowerCase().includes(q)
    );
  }, [students, studentSearch]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      nama: '',
      nik: '',
      hubungan: 'AYAH',
      noHp: '',
      pekerjaan: '',
      penghasilan: 'Rp 3.000.000 - Rp 5.000.000',
      alamat: '',
      email: '',
      isPrimaryContact: true,
      muridIds: [],
    });
    setStudentSearch('');
    setShowModal(true);
  };

  const handleOpenEdit = (p: ParentItem) => {
    setIsEditing(true);
    setEditingId(p.id);
    setFormData({
      nama: p.nama,
      nik: p.nik,
      hubungan: p.hubungan,
      noHp: p.noHp,
      pekerjaan: p.pekerjaan,
      penghasilan: p.penghasilan,
      alamat: p.alamat,
      email: p.email || '',
      isPrimaryContact: p.isPrimaryContact,
      muridIds: [...p.muridIds],
    });
    setStudentSearch('');
    setShowModal(true);
  };

  const handleToggleStudent = (studentId: string) => {
    setFormData((prev) => {
      const exists = prev.muridIds.includes(studentId);
      return {
        ...prev,
        muridIds: exists
          ? prev.muridIds.filter((id) => id !== studentId)
          : [...prev.muridIds, studentId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.noHp) {
      alert('Nama lengkap dan nomor WhatsApp wajib diisi');
      return;
    }

    setSaving(true);
    try {
      const url = '/api/orangtua';
      const method = isEditing ? 'PUT' : 'POST';
      const body = isEditing ? { id: editingId, ...formData } : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        fetchParents();
      } else {
        alert(json.message || 'Gagal menyimpan data orang tua');
      }
    } catch {
      alert('Terjadi kesalahan koneksi saat menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!parentToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/orangtua?id=${parentToDelete.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setParentToDelete(null);
        fetchParents();
      } else {
        alert(json.message || 'Gagal menghapus data orang tua');
      }
    } catch {
      alert('Terjadi kesalahan koneksi saat menghapus data');
    } finally {
      setDeleting(false);
    }
  };

  // WhatsApp click-to-chat URL helper
  const getWhatsAppUrl = (phone: string, parentName: string, childName?: string) => {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    }
    const text = encodeURIComponent(
      `Yth. Bpk/Ibu ${parentName},\nKami dari Manajemen SMAN 20 Kabupaten Tangerang ingin menginformasikan terkait perkembangan belajar & presensi ananda ${childName || 'siswa'}.`
    );
    return `https://wa.me/${clean}?text=${text}`;
  };

  // Stats calculation
  const totalParents = parents.length;
  const totalAyah = parents.filter((p) => p.hubungan === 'AYAH').length;
  const totalIbu = parents.filter((p) => p.hubungan === 'IBU').length;
  const totalWali = parents.filter((p) => p.hubungan === 'WALI').length;

  return (
    <DashboardShell>
      <div className="space-y-6 pb-12">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <UserCheck className="w-3.5 h-3.5" />
                Modul A5.4 & A5.8
              </span>
              <span className="text-xs text-slate-400 font-medium">Standar Dapodik 2026</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
              Data Orang Tua & Wali Murid
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manajemen kontak orang tua/wali terhubung dengan data peserta didik dan integrasi notifikasi presensi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Orang Tua</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Orang Tua/Wali</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{totalParents}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Terdaftar di Dapodik SMAN 20</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Ayah Kandung</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{totalAyah}</p>
            <p className="text-[11px] text-blue-600 font-medium mt-0.5">Kepala Keluarga</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Ibu Kandung</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <HeartHandshake className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{totalIbu}</p>
            <p className="text-[11px] text-purple-600 font-medium mt-0.5">Kontak Pengasuh</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Wali Murid</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <Building className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{totalWali}</p>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">Wali Resmi Siswa</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama orang tua, siswa, WA, atau NIK..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedHubungan}
              onChange={(e) => setSelectedHubungan(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {HUBUNGAN_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Parents Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50/75 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Nama & Hubungan</th>
                  <th className="py-3.5 px-4">Siswa Terhubung</th>
                  <th className="py-3.5 px-4">WhatsApp & Kontak</th>
                  <th className="py-3.5 px-4">Pekerjaan & Alamat</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        <span>Memuat data orang tua...</span>
                      </div>
                    </td>
                  </tr>
                ) : parents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <UserCheck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="font-medium text-slate-600">Tidak ada data orang tua yang ditemukan</p>
                      <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau tambah data baru.</p>
                    </td>
                  </tr>
                ) : (
                  parents.map((p) => {
                    const primaryChildName = p.muridList?.[0]?.nama;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition">
                        {/* Parent Name & Relationship */}
                        <td className="py-3 px-4 align-top">
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <span>{p.nama}</span>
                            {p.isPrimaryContact && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-300" title="Kontak Utama">
                                UTAMA
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={cn(
                                'text-[11px] font-semibold px-2 py-0.5 rounded-full border',
                                p.hubungan === 'AYAH'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : p.hubungan === 'IBU'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              )}
                            >
                              {p.hubungan === 'AYAH' ? 'Ayah' : p.hubungan === 'IBU' ? 'Ibu' : 'Wali'}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">NIK: {p.nik}</span>
                          </div>
                        </td>

                        {/* Connected Students */}
                        <td className="py-3 px-4 align-top">
                          {p.muridList && p.muridList.length > 0 ? (
                            <div className="space-y-1.5">
                              {p.muridList.map((m) => (
                                <div
                                  key={m.id}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-medium text-slate-800"
                                >
                                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>{m.nama}</span>
                                  <span className="text-[11px] text-slate-500 font-semibold bg-white px-1.5 py-0.2 rounded border border-slate-200">
                                    {m.kelasNama}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Belum ditautkan ke murid</span>
                          )}
                        </td>

                        {/* WhatsApp & Contact */}
                        <td className="py-3 px-4 align-top">
                          <div className="flex items-center gap-2">
                            <a
                              href={getWhatsAppUrl(p.noHp, p.nama, primaryChildName)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs shadow-xs transition active:scale-95"
                              title="Chat WhatsApp langsung"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>{p.noHp}</span>
                            </a>
                          </div>
                          {p.email && (
                            <div className="flex items-center gap-1 text-xs text-slate-400 mt-1.5">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{p.email}</span>
                            </div>
                          )}
                        </td>

                        {/* Occupation & Address */}
                        <td className="py-3 px-4 align-top max-w-xs">
                          <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{p.pekerjaan || '-'}</span>
                          </div>
                          <div className="flex items-start gap-1 text-[11px] text-slate-500 mt-1">
                            <Home className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{p.alamat}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 align-top text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                              title="Edit Data Orang Tua"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setParentToDelete(p)}
                              className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                              title="Hapus Data Orang Tua"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Tambah / Edit Orang Tua */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isEditing ? 'Perbarui Data Orang Tua / Wali' : 'Tambah Orang Tua / Wali Baru'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Data orang tua akan digunakan untuk autentikasi aplikasi mobile dan notifikasi kehadiran.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Lengkap Orang Tua / Wali *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      placeholder="Contoh: H. Bambang Sudirman, S.E."
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hubungan Keluarga *
                    </label>
                    <select
                      value={formData.hubungan}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hubungan: e.target.value as 'AYAH' | 'IBU' | 'WALI',
                        })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="AYAH">Ayah Kandung</option>
                      <option value="IBU">Ibu Kandung</option>
                      <option value="WALI">Wali Murid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor WhatsApp (Aktif) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.noHp}
                      onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                      placeholder="Contoh: 081288991122"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      NIK (Nomor Induk Kependudukan)
                    </label>
                    <input
                      type="text"
                      value={formData.nik}
                      onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                      placeholder="16 digit NIK"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pekerjaan
                    </label>
                    <input
                      type="text"
                      value={formData.pekerjaan}
                      onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                      placeholder="Contoh: PNS, Wiraswasta, Karyawan Swasta"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Rentang Penghasilan Bulanan
                    </label>
                    <select
                      value={formData.penghasilan}
                      onChange={(e) => setFormData({ ...formData, penghasilan: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="< Rp 1.000.000">&lt; Rp 1.000.000</option>
                      <option value="Rp 1.000.000 - Rp 3.000.000">Rp 1.000.000 - Rp 3.000.000</option>
                      <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
                      <option value="Rp 5.000.000 - Rp 10.000.000">Rp 5.000.000 - Rp 10.000.000</option>
                      <option value="> Rp 10.000.000">&gt; Rp 10.000.000</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Domisili Lengkap
                  </label>
                  <textarea
                    rows={2}
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    placeholder="Jl. Raya Pakuhaji No. ..., RT/RW, Desa, Kecamatan"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Student Multi-Picker */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pilih Siswa yang Diasuh (Dapat lebih dari 1 siswa)
                  </label>
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Cari nama siswa atau kelas..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 p-2 space-y-1 bg-slate-50/50">
                    {filteredStudents.map((s) => {
                      const isSelected = formData.muridIds.includes(s.id);
                      return (
                        <div
                          key={s.id}
                          onClick={() => handleToggleStudent(s.id)}
                          className={cn(
                            'flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition select-none',
                            isSelected
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="h-3.5 w-3.5 rounded text-emerald-600"
                            />
                            <span>{s.nama}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({s.nisn})</span>
                          </div>
                          <span className="text-[10px] bg-slate-200/80 px-1.5 py-0.5 rounded font-bold">
                            {s.kelasNama}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isPrimary"
                    checked={formData.isPrimaryContact}
                    onChange={(e) =>
                      setFormData({ ...formData, isPrimaryContact: e.target.checked })
                    }
                    className="h-4 w-4 rounded text-emerald-600"
                  />
                  <label htmlFor="isPrimary" className="text-xs text-slate-700 cursor-pointer font-medium">
                    Jadikan sebagai Kontak Utama untuk notifikasi presensi
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {saving && <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                    <span>{isEditing ? 'Simpan Pembaruan' : 'Simpan Orang Tua'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {parentToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100">
              <div className="flex items-center gap-3 text-red-600 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Konfirmasi Hapus Data</h3>
                  <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan.</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus data orang tua{' '}
                <strong className="text-slate-900">{parentToDelete.nama}</strong>? Tautan ke siswa terkait akan dihapus.
              </p>

              <div className="flex items-center justify-end gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setParentToDelete(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDelete}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {deleting && <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                  <span>Ya, Hapus Data</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
