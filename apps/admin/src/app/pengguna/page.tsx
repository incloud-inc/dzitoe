'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  UserPlus,
  KeyRound,
  Search,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Edit2,
  Trash2,
  Copy,
  Check,
  UserCheck,
  GraduationCap,
  Sparkles,
  Laptop,
  History,
  FileSpreadsheet,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SessionManagementTab } from '@/components/pengguna/SessionManagementTab';
import { AuditLogTab } from '@/components/pengguna/AuditLogTab';
import { ExcelImportModal } from '@/components/common/ExcelImportModal';
import {
  type SystemUser,
  type UserRole,
  type UserStatus,
  ROLE_LABELS,
} from '@dzitoe/db';

export default function PenggunaPage() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const [summary, setSummary] = useState({
    total: 0,
    aktif: 0,
    gtk: 0,
    murid: 0,
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    username: '',
    nama: '',
    email: '',
    role: 'GURU' as UserRole,
    jabatan: '',
    phone: '',
    linkedEntityType: 'GURU' as 'GURU' | 'MURID' | 'STAFF' | 'ORANG_TUA' | null,
    linkedEntityNama: '',
    linkedEntityId: '',
  });

  // Reset password states
  const [generatedPass, setGeneratedPass] = useState('');
  const [copied, setCopied] = useState(false);

  // Lists for auto-linking
  const [teachersList, setTeachersList] = useState<{ nip: string; nama: string; jabatan: string; email?: string }[]>([]);
  const [studentsList, setStudentsList] = useState<{ nisn: string; nama: string; kelasNama: string; email?: string }[]>([]);
  const [parentsList, setParentsList] = useState<{ id: string; nama: string; noHp: string; hubungan: string; email?: string; muridIds: string[] }[]>([]);
  const [activeLinkTab, setActiveLinkTab] = useState<'GURU' | 'MURID' | 'ORANG_TUA' | 'NONE'>('GURU');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/pengguna?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setUsers(json.data);
        setSummary(json.summary);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Load teachers, students, and parents for linking helper
  useEffect(() => {
    fetch('/api/guru?limit=100')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setTeachersList(
            json.data.map((t: any) => ({
              nip: t.nip,
              nama: t.nama,
              jabatan: t.jabatan || t.mataPelajaran || 'Guru Pengajar',
              email: t.email,
            }))
          );
        }
      })
      .catch(() => {});

    fetch('/api/murid?limit=300')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setStudentsList(
            json.data.map((s: any) => ({
              nisn: s.nisn,
              nama: s.nama,
              kelasNama: s.kelasNama || s.tingkat || 'Siswa',
              email: s.email,
            }))
          );
        }
      })
      .catch(() => {});

    fetch('/api/orangtua?limit=200')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setParentsList(
            json.data.map((p: any) => ({
              id: p.id,
              nama: p.nama,
              noHp: p.noHp,
              hubungan: p.hubungan,
              email: p.email,
              muridIds: p.muridIds || [],
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/pengguna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        setIsAddModalOpen(false);
        resetForm();
        fetchUsers();
      } else {
        alert(json.message);
      }
    } catch (err: any) {
      alert('Gagal menambah pengguna: ' + err.message);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      const res = await fetch('/api/pengguna', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedUser.id, ...formData }),
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        setIsEditModalOpen(false);
        resetForm();
        fetchUsers();
      } else {
        alert(json.message);
      }
    } catch (err: any) {
      alert('Gagal memperbarui pengguna: ' + err.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch(`/api/pengguna?id=${selectedUser.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        alert(json.message);
      }
    } catch (err: any) {
      alert('Gagal menghapus pengguna: ' + err.message);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch('/api/pengguna/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedUser.id }),
      });
      const json = await res.json();
      if (json.success) {
        setGeneratedPass(json.tempPass);
      } else {
        alert(json.message);
      }
    } catch (err: any) {
      alert('Gagal mereset kata sandi: ' + err.message);
    }
  };

  const handleToggleStatus = async (user: SystemUser) => {
    const newStatus: UserStatus = user.status === 'AKTIF' ? 'NONAKTIF' : 'AKTIF';
    try {
      const res = await fetch('/api/pengguna', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        fetchUsers();
      } else {
        alert(json.message);
      }
    } catch (err: any) {
      alert('Gagal mengubah status: ' + err.message);
    }
  };

  const openEditModal = (u: SystemUser) => {
    setSelectedUser(u);
    setFormData({
      username: u.username,
      nama: u.nama,
      email: u.email,
      role: u.role,
      jabatan: u.jabatan,
      phone: u.phone,
      linkedEntityType: u.linkedEntityType,
      linkedEntityNama: u.linkedEntityNama || '',
      linkedEntityId: u.linkedEntityId || '',
    });
    setIsEditModalOpen(true);
  };

  const openResetModal = (u: SystemUser) => {
    setSelectedUser(u);
    setGeneratedPass('');
    setCopied(false);
    setIsResetModalOpen(true);
  };

  const openDeleteModal = (u: SystemUser) => {
    setSelectedUser(u);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      username: '',
      nama: '',
      email: '',
      role: 'GURU',
      jabatan: '',
      phone: '',
      linkedEntityType: 'GURU',
      linkedEntityNama: '',
      linkedEntityId: '',
    });
    setSelectedUser(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardShell>
      <div className="space-y-6 pb-12">
        {/* Top Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 ring-1 ring-inset ring-purple-600/10">
                Modul A3 • Keamanan & RBAC
              </span>
              <span className="text-xs text-slate-500">SMAN 20 Kab. Tangerang</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Manajemen Pengguna & Hak Akses
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Otorisasi kredensial login, peran pengguna (RBAC), penautan GTK/Murid, dan keamanan akun sistem.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchUsers()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Segarkan
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800 shadow-xs hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
              Import Excel
            </button>
            <button
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              Tambah Akun Baru
            </button>
          </div>
        </div>

        {/* Tab Navigasi Pengguna & Keamanan */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 flex flex-wrap gap-1">
            <TabsTrigger
              value="users"
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-brand-900 data-[state=active]:shadow-xs"
            >
              <Users className="w-4 h-4 text-brand-600" />
              <span>Daftar Pengguna & Hak Akses ({users.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="sessions"
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-brand-900 data-[state=active]:shadow-xs"
            >
              <Laptop className="w-4 h-4 text-brand-600" />
              <span>Manajemen Sesi Aktif</span>
            </TabsTrigger>
            <TabsTrigger
              value="audit"
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-brand-900 data-[state=active]:shadow-xs"
            >
              <History className="w-4 h-4 text-brand-600" />
              <span>Audit Log Keamanan</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: DAFTAR PENGGUNA & RBAC */}
          <TabsContent value="users" className="space-y-6">
            {/* 4 Metric Stats Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Akun Terdaftar</span>
              <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{summary.total}</div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-purple-600">
              <span>Sistem IT Monorepo</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Pengguna Aktif</span>
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{summary.aktif}</div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600">
              <span>Dapat login & beraktivitas</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Akun GTK & Pimpinan</span>
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <GraduationCap className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{summary.gtk}</div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-blue-600">
              <span>Kepsek, Waka, Guru, TU</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Akun Siswa PWA</span>
              <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{summary.murid}</div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-600">
              <span>Mobile PWA Portal</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari pengguna (nama, username, email, jabatan)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">Semua Peran (Role)</option>
              {Object.keys(ROLE_LABELS).map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r as UserRole].label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">Semua Status</option>
              <option value="AKTIF">Aktif</option>
              <option value="NONAKTIF">Nonaktif</option>
              <option value="DITANGGUHKAN">Ditangguhkan</option>
            </select>
          </div>
        </div>

        {/* Main Users Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Pengguna</th>
                  <th className="px-4 py-3">Username & Kontak</th>
                  <th className="px-4 py-3">Peran (Role)</th>
                  <th className="px-4 py-3">Tertaut Entitas</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Login Terakhir</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      <RefreshCw className="mx-auto h-6 w-6 animate-spin text-indigo-600" />
                      <p className="mt-2 text-xs">Memuat data pengguna...</p>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      Tidak ditemukan akun pengguna yang cocok.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const roleMeta = ROLE_LABELS[u.role] || {
                      label: u.role,
                      color: 'bg-slate-100 text-slate-700',
                    };

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatarUrl}
                              alt={u.nama}
                              className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
                            />
                            <div>
                              <div className="font-semibold text-slate-900">{u.nama}</div>
                              <div className="text-[11px] text-slate-500">{u.jabatan}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-mono text-slate-800 font-medium tabular-nums">@{u.username}</div>
                          <div className="text-[11px] text-slate-500">{u.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold border ${roleMeta.color}`}
                          >
                            {roleMeta.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {u.linkedEntityNama ? (
                            <div>
                              <div className="font-medium text-slate-800">{u.linkedEntityNama}</div>
                              <div className="text-[11px] text-slate-500">
                                {u.linkedEntityType}: {u.linkedEntityId || '-'}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Akun Sistem Non-Dapodik</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${
                              u.status === 'AKTIF'
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            }`}
                            title="Klik untuk ubah status aktif/nonaktif"
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                u.status === 'AKTIF' ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            {u.status}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-[11px] tabular-nums">
                          {u.lastLogin || 'Belum pernah login'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openResetModal(u)}
                              title="Reset Kata Sandi"
                              className="rounded-lg w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-amber-600 transition-colors"
                            >
                              <KeyRound className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(u)}
                              title="Edit Pengguna"
                              className="rounded-lg w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            {u.username !== 'admin' && (
                              <button
                                onClick={() => openDeleteModal(u)}
                                title="Hapus Pengguna"
                                className="rounded-lg w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
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
      </TabsContent>

      {/* TAB 2: MANAJEMEN SESI AKTIF (Task A1.8) */}
      <TabsContent value="sessions" className="space-y-6">
        <SessionManagementTab />
      </TabsContent>

      {/* TAB 3: AUDIT LOG KEAMANAN & LOGIN (Task A1.9) */}
      <TabsContent value="audit" className="space-y-6">
        <AuditLogTab />
      </TabsContent>
    </Tabs>

        {/* Modal Tambah / Edit Pengguna */}
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isAddModalOpen ? 'Tambah Pengguna Sistem Baru' : 'Edit Data Pengguna'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Standar hak akses RBAC SMAN 20 Kabupaten Tangerang
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={isAddModalOpen ? handleCreateUser : handleUpdateUser} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Username *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. budi.santoso"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Peran (Role) *</label>
                    <select
                      value={formData.role}
                      onChange={(e) => {
                        const r = e.target.value as UserRole;
                        setFormData({
                          ...formData,
                          role: r,
                          jabatan: ROLE_LABELS[r]?.label || '',
                        });
                        if (r === 'MURID') {
                          setActiveLinkTab('MURID');
                        } else if (r === 'ORANG_TUA') {
                          setActiveLinkTab('ORANG_TUA');
                        } else if (r === 'ADMIN') {
                          setActiveLinkTab('NONE');
                        } else {
                          setActiveLinkTab('GURU');
                        }
                      }}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                    >
                      {Object.keys(ROLE_LABELS).map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABELS[r as UserRole].label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Budi Santoso, S.Pd."
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Email Resmi *</label>
                    <input
                      type="email"
                      required
                      placeholder="email@sman20.sch.id"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Nomor Telepon/WA</label>
                    <input
                      type="text"
                      placeholder="081234567890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Jabatan Fungsional</label>
                  <input
                    type="text"
                    placeholder="e.g. Wali Kelas X.1 / Guru Matematika"
                    value={formData.jabatan}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Auto-link Helper untuk Guru, Murid, dan Orang Tua/Wali */}
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Tautkan Akun ke Entitas Sekolah (Auto-Fill)
                    </span>
                    <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-100/70 px-2 py-0.5 rounded-full">
                      Dapodik & Data Master
                    </span>
                  </div>

                  {/* Sub-tabs untuk jenis entitas */}
                  <div className="grid grid-cols-4 gap-1 p-1 bg-white/80 rounded-lg border border-indigo-100 text-[11px] font-medium">
                    <button
                      type="button"
                      onClick={() => setActiveLinkTab('GURU')}
                      className={`py-1 px-1.5 rounded text-center transition ${
                        activeLinkTab === 'GURU'
                          ? 'bg-indigo-600 text-white font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Guru ({teachersList.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLinkTab('MURID')}
                      className={`py-1 px-1.5 rounded text-center transition ${
                        activeLinkTab === 'MURID'
                          ? 'bg-indigo-600 text-white font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Murid ({studentsList.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLinkTab('ORANG_TUA')}
                      className={`py-1 px-1.5 rounded text-center transition ${
                        activeLinkTab === 'ORANG_TUA'
                          ? 'bg-indigo-600 text-white font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Ortu ({parentsList.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveLinkTab('NONE');
                        setFormData({
                          ...formData,
                          linkedEntityType: null,
                          linkedEntityId: '',
                          linkedEntityNama: '',
                        });
                      }}
                      className={`py-1 px-1.5 rounded text-center transition ${
                        activeLinkTab === 'NONE'
                          ? 'bg-slate-700 text-white font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Tanpa Tautan
                    </button>
                  </div>

                  {/* Dropdown Guru */}
                  {activeLinkTab === 'GURU' && (
                    <div>
                      <select
                        onChange={(e) => {
                          const selected = teachersList.find((t) => t.nip === e.target.value);
                          if (selected) {
                            setFormData({
                              ...formData,
                              nama: selected.nama,
                              role: 'GURU',
                              email: selected.email || `${selected.nip}@sman20.sch.id`,
                              linkedEntityType: 'GURU',
                              linkedEntityId: selected.nip,
                              linkedEntityNama: selected.nama,
                              jabatan: selected.jabatan,
                              username: selected.nip,
                            });
                          }
                        }}
                        className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="">-- Pilih Guru / GTK untuk auto-fill data --</option>
                        {teachersList.map((t) => (
                          <option key={t.nip} value={t.nip}>
                            {t.nama} — {t.jabatan} (NIP: {t.nip})
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-[10px] text-indigo-700/80">
                        Otomatis mengisi NIP sebagai username, email resmi, jabatan, dan role Guru.
                      </p>
                    </div>
                  )}

                  {/* Dropdown Murid (Siswa) */}
                  {activeLinkTab === 'MURID' && (
                    <div>
                      <select
                        onChange={(e) => {
                          const selected = studentsList.find((s) => s.nisn === e.target.value);
                          if (selected) {
                            setFormData({
                              ...formData,
                              nama: selected.nama,
                              role: 'MURID',
                              email: selected.email || `${selected.nisn}@siswa.sman20.sch.id`,
                              linkedEntityType: 'MURID',
                              linkedEntityId: selected.nisn,
                              linkedEntityNama: selected.nama,
                              jabatan: `Siswa ${selected.kelasNama}`,
                              username: selected.nisn,
                            });
                          }
                        }}
                        className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="">-- Pilih Murid (Siswa) untuk auto-fill data --</option>
                        {studentsList.map((s) => (
                          <option key={s.nisn} value={s.nisn}>
                            {s.nama} ({s.kelasNama}) — NISN: {s.nisn}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-[10px] text-indigo-700/80">
                        Otomatis mengisi NISN sebagai username, nama siswa, kelas, dan role Murid.
                      </p>
                    </div>
                  )}

                  {/* Dropdown Orang Tua / Wali */}
                  {activeLinkTab === 'ORANG_TUA' && (
                    <div>
                      <select
                        onChange={(e) => {
                          const selected = parentsList.find((p) => p.id === e.target.value || p.noHp === e.target.value);
                          if (selected) {
                            setFormData({
                              ...formData,
                              nama: selected.nama,
                              role: 'ORANG_TUA',
                              email: selected.email || `${selected.noHp}@wali.sman20.sch.id`,
                              phone: selected.noHp,
                              linkedEntityType: 'ORANG_TUA',
                              linkedEntityId: selected.noHp,
                              linkedEntityNama: `${selected.nama} (${selected.hubungan})`,
                              jabatan: `Wali dari Murid (${selected.muridIds.join(', ') || '-'})`,
                              username: selected.noHp,
                            });
                          }
                        }}
                        className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="">-- Pilih Orang Tua / Wali untuk auto-fill data --</option>
                        {parentsList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nama} ({p.hubungan}) — WA: {p.noHp}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-[10px] text-indigo-700/80">
                        Otomatis mengisi Nomor WhatsApp sebagai username akun dan role Orang Tua / Wali.
                      </p>
                    </div>
                  )}

                  {/* Tautan Bebas */}
                  {activeLinkTab === 'NONE' && (
                    <div className="p-2 rounded bg-white text-[11px] text-slate-600 border border-slate-200">
                      Akun mandiri tanpa tautan Dapodik (misal: Tenaga Ahli IT, Pengawas Eksternal, Tamu).
                    </div>
                  )}

                  {formData.linkedEntityNama && (
                    <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>
                        Tertaut ke: <strong>{formData.linkedEntityNama}</strong> ({formData.linkedEntityType}: {formData.linkedEntityId})
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setIsEditModalOpen(false);
                      resetForm();
                    }}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
                  >
                    {isAddModalOpen ? 'Simpan Pengguna' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Reset Password */}
        {isResetModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Reset Kata Sandi</h3>
                    <p className="text-xs text-slate-500">@{selectedUser.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsResetModalOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <p className="text-xs text-slate-600">
                  Apakah Anda yakin ingin mereset kata sandi akun{' '}
                  <strong className="text-slate-900">{selectedUser.nama}</strong>? Sistem akan
                  membuat kata sandi sementara yang aman.
                </p>

                {generatedPass ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <span className="text-xs font-semibold text-emerald-800">
                      Kata Sandi Baru Berhasil Dibuat:
                    </span>
                    <div className="mt-2 flex items-center justify-between rounded-lg border border-emerald-300 bg-white px-3 py-2">
                      <span className="font-mono text-sm font-bold text-slate-900">
                        {generatedPass}
                      </span>
                      <button
                        onClick={() => copyToClipboard(generatedPass)}
                        className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700"
                      >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? 'Tersalin' : 'Salin'}
                      </button>
                    </div>
                    <p className="mt-2 text-[11px] text-emerald-700">
                      Berikan kata sandi ini kepada pengguna untuk login dan minta segera mengganti kata sandi.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsResetModalOpen(false)}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleResetPassword}
                      className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700"
                    >
                      Generate Sandi Baru
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Hapus Pengguna */}
        {isDeleteModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-rose-50 p-3 text-rose-600">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Hapus Akun Pengguna</h3>
                  <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-600">
                Akun pengguna <strong className="text-slate-900">{selectedUser.nama}</strong> (@
                {selectedUser.username}) akan dihapus secara permanen dari sistem otorisasi DZITOE.
              </p>

              <div className="mt-6 flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
                >
                  Ya, Hapus Akun
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Bulk Import User (A3.7) */}
        <ExcelImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          title="Bulk Import Pengguna dari Excel / CSV (A3.7)"
          subtitle="Tambahkan akun PTK, Guru, atau Staff secara massal menggunakan file spreadsheet"
          templateUrl="/api/pengguna/import-excel"
          templateFilename="template-import-user-sman20.xlsx"
          uploadEndpoint="/api/pengguna/import-excel"
          sampleColumns={['Username', 'Nama Lengkap', 'Email', 'Role', 'No Telepon']}
          onImportSuccess={() => fetchUsers()}
        />
      </div>
    </DashboardShell>
  );
}
