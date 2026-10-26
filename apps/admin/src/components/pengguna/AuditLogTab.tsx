'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  RefreshCw,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  Laptop,
  Smartphone,
  Tablet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SecurityAuditLog, AuditAction } from '@dzitoe/auth';

const ACTION_LABELS: Record<AuditAction, { label: string; color: string }> = {
  LOGIN_SUCCESS: { label: 'Login Berhasil', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  LOGIN_FAILED: { label: 'Login Gagal', color: 'bg-red-50 text-red-800 border-red-200' },
  LOGOUT: { label: 'Logout', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  PASSWORD_RESET_REQUEST: { label: 'Minta Reset Sandi', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  PASSWORD_RESET_SUCCESS: { label: 'Sandi Diperbarui', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  SESSION_REVOKED: { label: 'Sesi Dicabut', color: 'bg-orange-50 text-orange-800 border-orange-200' },
  ACCESS_DENIED: { label: 'Akses Ditolak (Role)', color: 'bg-rose-50 text-rose-800 border-rose-200' },
  SYSTEM_CONFIG_UPDATED: { label: 'Konfigurasi Diubah', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  BULK_DATA_IMPORTED: { label: 'Import Data Massal', color: 'bg-teal-50 text-teal-800 border-teal-200' },
};

export function AuditLogTab() {
  const [logs, setLogs] = useState<SecurityAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [summary, setSummary] = useState({ total: 0, success: 0, failed: 0, warning: 0 });

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (actionFilter) params.set('action', actionFilter);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/auth/audit-log?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setLogs(json.data);
        if (json.summary) setSummary(json.summary);
      }
    } catch {
      console.error('Gagal mengambil audit log.');
    } finally {
      setLoading(false);
    }
  }, [search, actionFilter, statusFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = ['Waktu', 'Pengguna', 'Role', 'Aksi', 'Status', 'Alamat IP', 'Perangkat', 'Rincian'];
    const rows = logs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.userName}"`,
      `"${l.userRole}"`,
      `"${l.action}"`,
      `"${l.status}"`,
      `"${l.ipAddress}"`,
      `"${l.browser} (${l.os})"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Audit_Log_DZITOE_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDeviceIcon = (deviceType: string) => {
    if (deviceType === 'mobile') return <Smartphone className="w-4 h-4 text-slate-500" />;
    if (deviceType === 'tablet') return <Tablet className="w-4 h-4 text-slate-500" />;
    return <Laptop className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Aktivitas</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{summary.total}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Login Berhasil</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{summary.success}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">Gagal / Anomali</span>
          <span className="text-2xl font-black text-red-700 mt-1 block">{summary.failed}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">Peringatan / Ditolak</span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">{summary.warning}</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Controls Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari user, IP, atau aksi..."
                className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-brand-600 transition"
              />
            </div>

            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-slate-700 focus:ring-2 focus:ring-brand-600 transition bg-white"
            >
              <option value="">Semua Aksi</option>
              <option value="LOGIN_SUCCESS">Login Berhasil</option>
              <option value="LOGIN_FAILED">Login Gagal</option>
              <option value="LOGOUT">Logout</option>
              <option value="PASSWORD_RESET_SUCCESS">Reset Kata Sandi</option>
              <option value="SESSION_REVOKED">Sesi Dicabut</option>
              <option value="ACCESS_DENIED">Akses Ditolak (Role)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-36 px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-slate-700 focus:ring-2 focus:ring-brand-600 transition bg-white"
            >
              <option value="">Semua Status</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="WARNING">Warning</option>
            </select>
          </div>

          <div className="flex items-center gap-2.5 self-end lg:self-auto shrink-0">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={fetchLogs}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer"
              title="Segarkan Log"
            >
              <RefreshCw className={cn('w-4 h-4', loading ? 'animate-spin' : '')} />
            </button>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-5">Waktu Kejadian</th>
                <th className="py-3 px-4">Pengguna & Role</th>
                <th className="py-3 px-4">Aksi Keamanan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Alamat IP & Lokasi</th>
                <th className="py-3 px-4">Perangkat & Browser</th>
                <th className="py-3 px-5">Rincian Aktivitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {loading && logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-semibold">Memuat catatan audit keamanan...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada catatan audit yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const actionMeta = ACTION_LABELS[log.action] || {
                    label: log.action,
                    color: 'bg-slate-100 text-slate-700 border-slate-200',
                  };

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition">
                      {/* Timestamp */}
                      <td className="py-3 px-5 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {log.timestamp}
                      </td>

                      {/* Pengguna & Role */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 block truncate max-w-[160px]">
                            {log.userName}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 inline-block">
                            {log.userRole}
                          </span>
                        </div>
                      </td>

                      {/* Aksi */}
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border whitespace-nowrap',
                            actionMeta.color
                          )}
                        >
                          {actionMeta.label}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {log.status === 'SUCCESS' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Success
                          </span>
                        ) : log.status === 'FAILED' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700">
                            <XCircle className="w-3.5 h-3.5" />
                            Failed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Warning
                          </span>
                        )}
                      </td>

                      {/* IP & Lokasi */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="font-mono text-slate-900 block">{log.ipAddress}</span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {log.location}
                          </span>
                        </div>
                      </td>

                      {/* Perangkat & Browser */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-lg bg-slate-100">
                            {getDeviceIcon(log.deviceType)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block truncate max-w-[130px]">
                              {log.browser}
                            </span>
                            <span className="text-[10px] text-slate-400 block">{log.os}</span>
                          </div>
                        </div>
                      </td>

                      {/* Rincian */}
                      <td className="py-3 px-5 text-slate-600 text-[11px] leading-relaxed max-w-xs">
                        {log.details}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
