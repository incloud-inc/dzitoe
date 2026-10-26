'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Zap,
  Lock,
  Activity,
  CheckCircle2,
  RefreshCw,
  Loader2,
} from 'lucide-react';

export default function SecurityAndPerfPage() {
  const [data, setData] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [benchmarking, setBenchmarking] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings/security-audit');
      const json = await res.json();
      if (json.success) setData(json.data);

      const resLogs = await fetch('/api/settings/security-audit?action=logs');
      const jsonLogs = await resLogs.json();
      if (jsonLogs.success) setLogs(jsonLogs.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const runBenchmark = async () => {
    setBenchmarking(true);
    try {
      const res = await fetch('/api/settings/security-audit?action=test-cache');
      const json = await res.json();
      if (json.success) setBenchmarkResult(json);
    } catch {
      alert('Gagal menjalankan benchmark');
    } finally {
      setBenchmarking(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Banner */}
      <div className="rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-4">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Fase 8: Optimalisasi & Hardening Keamanan (100% Selesai)</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Performa, Redis Cache & Audit Keamanan
          </h1>
          <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
            Multi-layer caching Redis (port 6380), proteksi rate-limiting bertingkat, OWASP security headers, dan audit trail mutasi data terpusat SMAN 20 Kabupaten Tangerang.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-16">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <>
          {/* Performance & Security KPI */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-indigo-600 text-xs font-semibold">
                <span>Multi-Layer Caching</span>
                <Zap className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">
                Port {data?.redisPort || 6380}
              </div>
              <p className="text-xs text-slate-500 mt-1">Tier-1 LRU Memory + Tier-2 Redis</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-emerald-600 text-xs font-semibold">
                <span>Target Latensi Respons</span>
                <Activity className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-emerald-700 mt-2">&lt; 100 ms</div>
              <p className="text-xs text-slate-500 mt-1">Optimalisasi CDN Edge & WebP Pipeline</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-blue-600 text-xs font-semibold">
                <span>Rate Limiting DDoS</span>
                <ShieldCheck className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-xl font-bold text-slate-900 mt-2">15 / 120 req</div>
              <p className="text-xs text-slate-500 mt-1">Proteksi brute-force login & API flood</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-purple-600 text-xs font-semibold">
                <span>Kepatuhan Hardening</span>
                <Lock className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-xl font-bold text-purple-800 mt-2">OWASP / ISO 27001</div>
              <p className="text-xs text-slate-500 mt-1">HSTS, CSP, XSS & Clickjacking guard</p>
            </div>
          </div>

          {/* Test Benchmark & Caching Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Uji Benchmark Cache-Aside Multi-Layer (A29.1)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ukur latensi pengambilan data memori ter-cache
                  </p>
                </div>
                <button
                  onClick={runBenchmark}
                  disabled={benchmarking}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition disabled:opacity-50"
                >
                  {benchmarking ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  Jalankan Benchmark
                </button>
              </div>

              {benchmarkResult ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-800 font-bold">Hasil Latensi Eksekusi:</span>
                    <span className="text-base font-black text-emerald-900">
                      {benchmarkResult.latencyMs} ms
                    </span>
                  </div>
                  <p className="text-slate-600">
                    Status: <strong>{benchmarkResult.data.status}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Waktu: {benchmarkResult.data.timestamp} | Entri Aktif: {benchmarkResult.cacheStats.memoryEntries}
                  </p>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 text-center">
                  Klik tombol &quot;Jalankan Benchmark&quot; untuk mengukur kecepatan respon query ter-cache.
                </div>
              )}

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="text-slate-600">Port Default Redis Engine:</span>
                  <span className="font-mono font-bold text-slate-900">6380</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="text-slate-600">Static Image Pipeline:</span>
                  <span className="font-bold text-emerald-700">WebP & AVIF Enabled (24h TTL)</span>
                </div>
              </div>
            </div>

            {/* Security Hardening Headers */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Daftar Security Headers Aktif (A30.3)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Diterapkan otomatis melalui middleware & header response Next.js
              </p>

              <div className="space-y-2 text-xs">
                {data?.security?.headers?.map((h: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-mono text-slate-800">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Centralized Audit Log (A30.2) */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Centralized Security Audit Trail (Task A30.2)
                </h3>
                <p className="text-xs text-slate-500">
                  Riwayat mutasi data sensitif, aktivitas login, dan monitoring keamanan
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-full text-slate-700">
                  Ring-Buffer Aktif
                </span>
                <button
                  type="button"
                  title="Hapus log dan riwayat keamanan lama"
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors border border-rose-100"
                >
                  Purge Log Keamanan
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="border border-slate-200 rounded-2xl overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
                    <tr>
                      <th className="p-3">Waktu</th>
                      <th className="p-3">Aksi Keamanan</th>
                      <th className="p-3">Pengguna</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3">Resource Target</th>
                      <th className="p-3 text-center">Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-sans">
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400">
                          Sistem aman, belum ada anomali atau mutasi data sensitif baru.
                        </td>
                      </tr>
                    ) : (
                      logs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono text-slate-500 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                          </td>
                          <td className="p-3 font-bold text-slate-800">{log.action}</td>
                          <td className="p-3 text-slate-700">{log.userName || '-'}</td>
                          <td className="p-3 font-mono text-slate-600">{log.ipAddress}</td>
                          <td className="p-3 text-slate-700">{log.resource}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-100 text-blue-800">
                              {log.level}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
