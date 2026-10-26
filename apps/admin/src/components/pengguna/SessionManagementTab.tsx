'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Laptop,
  Smartphone,
  Tablet,
  ShieldAlert,
  LogOut,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ManagedSession } from '@dzitoe/auth';

export function SessionManagementTab() {
  const [sessions, setSessions] = useState<ManagedSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/sessions');
      const json = await res.json();
      if (json.success) {
        setSessions(json.data);
      }
    } catch {
      setFeedback({ type: 'error', text: 'Gagal memuat sesi aktif.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleRevoke = async (sessionId: string) => {
    if (!confirm('Apakah Anda yakin ingin mencabut sesi ini dan memaksa logout perangkat tersebut?')) {
      return;
    }

    setRevokingId(sessionId);
    setFeedback(null);

    try {
      const res = await fetch('/api/auth/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REVOKE_ONE', sessionId }),
      });
      const json = await res.json();
      if (json.success) {
        setFeedback({ type: 'success', text: json.message });
        fetchSessions();
      } else {
        setFeedback({ type: 'error', text: json.message });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Gagal mencabut sesi perangkat.' });
    } finally {
      setRevokingId(null);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const matchStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'active'
        ? !s.isRevoked
        : s.isRevoked;

    const matchSearch =
      !search ||
      s.userName.toLowerCase().includes(search.toLowerCase()) ||
      s.ipAddress.toLowerCase().includes(search.toLowerCase()) ||
      s.browser.toLowerCase().includes(search.toLowerCase()) ||
      s.os.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  const activeCount = sessions.filter((s) => !s.isRevoked).length;
  const revokedCount = sessions.filter((s) => s.isRevoked).length;

  const getDeviceIcon = (deviceType: string) => {
    if (deviceType === 'mobile') return <Smartphone className="w-5 h-5 text-emerald-600" />;
    if (deviceType === 'tablet') return <Tablet className="w-5 h-5 text-indigo-600" />;
    return <Laptop className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={cn(
            'p-4 rounded-2xl flex items-center justify-between text-xs font-semibold border',
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          )}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs opacity-60 hover:opacity-100 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Total Sesi Terdaftar
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {sessions.length}
            </span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl">
            <Laptop className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
              Sesi Aktif Sekarang
            </span>
            <span className="text-2xl font-black text-emerald-700 mt-1 block">
              {activeCount}
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Sesi Dicabut / Logout
            </span>
            <span className="text-2xl font-black text-slate-600 mt-1 block">
              {revokedCount}
            </span>
          </div>
          <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl">
            <LogOut className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Controls Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari user, IP, atau browser..."
              className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-brand-600 transition"
            />
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/80">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
                  filterStatus === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                Semua ({sessions.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('active')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
                  filterStatus === 'active'
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                Aktif ({activeCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('revoked')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
                  filterStatus === 'revoked'
                    ? 'bg-white text-slate-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                Dicabut ({revokedCount})
              </button>
            </div>

            <button
              type="button"
              onClick={fetchSessions}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer"
              title="Segarkan data sesi"
            >
              <RefreshCw className={cn('w-4 h-4', loading ? 'animate-spin' : '')} />
            </button>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-5">Perangkat & Pengguna</th>
                <th className="py-3 px-4">Browser & OS</th>
                <th className="py-3 px-4">Alamat IP & Lokasi</th>
                <th className="py-3 px-4">Aktivitas Terakhir</th>
                <th className="py-3 px-4">Status Sesi</th>
                <th className="py-3 px-5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {loading && sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-semibold">Memuat daftar sesi aktif...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ada sesi yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50/70 transition">
                    {/* Perangkat & User */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-slate-100 border border-slate-200/80 shrink-0">
                          {getDeviceIcon(session.deviceType)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{session.userName}</span>
                            {session.isCurrent && (
                              <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black">
                                Sesi Anda
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">
                            Role: {session.userRole}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Browser & OS */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block">{session.browser}</span>
                        <span className="text-[11px] text-slate-500 block">{session.os}</span>
                      </div>
                    </td>

                    {/* IP & Lokasi */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-slate-900 block flex items-center gap-1">
                          {session.ipAddress}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {session.location}
                        </span>
                      </div>
                    </td>

                    {/* Aktivitas Terakhir */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{session.lastActive}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {session.isRevoked ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
                          Dicabut
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Aktif
                        </span>
                      )}
                    </td>

                    {/* Tindakan */}
                    <td className="py-3.5 px-5 text-right">
                      {!session.isRevoked && !session.isCurrent && (
                        <button
                          type="button"
                          onClick={() => handleRevoke(session.id)}
                          disabled={revokingId === session.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition cursor-pointer disabled:opacity-50"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>{revokingId === session.id ? 'Mencabut...' : 'Cabut Akses'}</span>
                        </button>
                      )}
                      {session.isCurrent && (
                        <span className="text-slate-400 text-xs italic">Perangkat Ini</span>
                      )}
                      {session.isRevoked && (
                        <span className="text-slate-400 text-xs">—</span>
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
  );
}
