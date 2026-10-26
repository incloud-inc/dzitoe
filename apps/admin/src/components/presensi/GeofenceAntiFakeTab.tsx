'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Compass,
  RefreshCw,
  Search,
  Crosshair,
  Radio,
  Trash2,
  Play,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  type FraudAttemptLog,
  type GeofenceConfig,
  REASON_LABELS,
} from '@dzitoe/db';

export function GeofenceAntiFakeTab() {
  const [logs, setLogs] = useState<FraudAttemptLog[]>([]);
  const [config, setConfig] = useState<GeofenceConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [reasonFilter, setReasonFilter] = useState('');
  const [search, setSearch] = useState('');

  const [summary, setSummary] = useState({
    totalFraud: 0,
    mockAppCount: 0,
    outOfRadiusCount: 0,
    accuracyDriftCount: 0,
  });

  // Simulator states
  const [simLat, setSimLat] = useState('-6.079200');
  const [simLng, setSimLng] = useState('106.602500');
  const [simAccuracy, setSimAccuracy] = useState('10');
  const [simMock, setSimMock] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);

  const fetchSecurityData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (reasonFilter) params.set('reason', reasonFilter);

      const res = await fetch(`/api/presensi/antifake?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setLogs(json.logs);
        setConfig(json.config);
        setSummary(json.summary);
      }
    } catch (err) {
      console.error('Error fetching antifake data:', err);
    } finally {
      setLoading(false);
    }
  }, [reasonFilter]);

  useEffect(() => {
    fetchSecurityData();
  }, [fetchSecurityData]);

  const runSimulation = async () => {
    try {
      setSimulating(true);
      const res = await fetch('/api/presensi/antifake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_verification',
          latitude: simLat,
          longitude: simLng,
          accuracy: simAccuracy,
          isMockLocation: simMock,
          userType: 'MURID',
          userId: 'test-sim-01',
          userName: 'Uji Coba Simulator Keamanan',
          identifier: '0089999999',
          kelasOrJabatan: 'X.1',
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSimResult(json.result);
        fetchSecurityData(); // Refresh fraud log if one was triggered
      }
    } catch (err: any) {
      alert('Error simulasi: ' + err.message);
    } finally {
      setSimulating(false);
    }
  };

  const handleClearLogs = async () => {
    if (!confirm('Apakah Anda yakin ingin mengosongkan riwayat log anomali?')) return;
    try {
      const res = await fetch('/api/presensi/antifake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear_logs' }),
      });
      const json = await res.json();
      if (json.success) {
        fetchSecurityData();
      }
    } catch (err: any) {
      alert('Gagal membersihkan log: ' + err.message);
    }
  };

  const filteredLogs = logs.filter(
    (l) =>
      !search ||
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.identifier.includes(search) ||
      l.reasonLabel.toLowerCase().includes(search.toLowerCase()) ||
      l.deviceInfo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 4 Security Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-800">Percobaan Ilegal Ditangkal</span>
            <div className="rounded-lg bg-rose-100 p-2 text-rose-700">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-900">{summary.totalFraud}</div>
          <p className="mt-1 text-[11px] text-rose-700">100% otomatis diblokir sistem</p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800">Aplikasi Fake GPS</span>
            <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
              <Radio className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-900">{summary.mockAppCount}</div>
          <p className="mt-1 text-[11px] text-amber-700">Mock provider / emulator injeksi</p>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-800">Di Luar Radius Sekolah</span>
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
              <Compass className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-900">{summary.outOfRadiusCount}</div>
          <p className="mt-1 text-[11px] text-blue-700">Jarak melebihi radius 100 meter</p>
        </div>

        <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-800">Anomali Sinyal / Jam</span>
            <div className="rounded-lg bg-purple-100 p-2 text-purple-700">
              <Crosshair className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-purple-900">{summary.accuracyDriftCount}</div>
          <p className="mt-1 text-[11px] text-purple-700">Sinyal buram & drift timestamp</p>
        </div>
      </div>

      {/* Geofence Perimeter & Interactive Simulator */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Geofence SMAN 20 Info */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Perimeter Geofence Resmi</h3>
              <p className="text-[11px] text-slate-500">SMAN 20 Kabupaten Tangerang</p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Titik Pusat Gerbang:</span>
                <span className="font-mono font-bold text-slate-800">
                  {config?.latitude.toFixed(6)}, {config?.longitude.toFixed(6)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-slate-500">Radius Absensi Sah:</span>
                <span className="font-semibold text-indigo-700">
                  {config?.radiusMeters} Meter
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-slate-500">Toleransi GPS Seluler:</span>
                <span className="font-semibold text-emerald-700">
                  +{config?.toleranceMeters} Meter
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-slate-500">Batas Maks Akurasi:</span>
                <span className="font-semibold text-amber-700">
                  ≤ {config?.maxAllowedAccuracyMeters} Meter
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <ShieldCheck className="h-4 w-4" />
                <span>Proteksi Realtime Aktif</span>
              </div>
              <ul className="mt-2 space-y-1 text-[11px] text-emerald-700">
                <li>• Anti-Mock Location Provider (Android & iOS)</li>
                <li>• Deteksi emulator BlueStacks / Nox / LDPlayer</li>
                <li>• Sinkronisasi jam server (Anti-manipulasi HP)</li>
                <li>• Watermark koordinat langsung di kamera PWA</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Simulator Validasi Koordinat */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                <Crosshair className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Simulator Uji Validasi Keamanan Geofence
                </h3>
                <p className="text-[11px] text-slate-500">
                  Uji coba skenario presensi nyata (koordinat sekolah, mock GPS, atau di luar jangkauan)
                </p>
              </div>
            </div>

            {/* Preset Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setSimLat('-6.079200');
                  setSimLng('106.602500');
                  setSimAccuracy('12');
                  setSimMock(false);
                }}
                className="rounded bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-200"
              >
                Titik Gerbang (Valid)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSimLat('-6.079200');
                  setSimLng('106.602500');
                  setSimAccuracy('3');
                  setSimMock(true);
                }}
                className="rounded bg-rose-50 px-2 py-1 text-[10px] font-semibold text-rose-700 hover:bg-rose-100"
              >
                Mock GPS Aktif
              </button>
              <button
                type="button"
                onClick={() => {
                  setSimLat('-6.175392');
                  setSimLng('106.827153');
                  setSimAccuracy('10');
                  setSimMock(false);
                }}
                className="rounded bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 hover:bg-amber-100"
              >
                Monas (Jauh)
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Latitude</label>
              <input
                type="text"
                value={simLat}
                onChange={(e) => setSimLat(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Longitude</label>
              <input
                type="text"
                value={simLng}
                onChange={(e) => setSimLng(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Akurasi GPS (Meter)</label>
              <input
                type="number"
                value={simAccuracy}
                onChange={(e) => setSimAccuracy(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={simMock}
                onChange={(e) => setSimMock(e.target.checked)}
                className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <span className="font-medium text-rose-700">
                Simulasikan flag `isMockLocation: true` (Aplikasi Fake GPS)
              </span>
            </label>

            <button
              onClick={runSimulation}
              disabled={simulating}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-sm"
            >
              <Play className="h-3.5 w-3.5" />
              {simulating ? 'Menguji...' : 'Uji Koordinat Ini'}
            </button>
          </div>

          {/* Simulator Result Box */}
          {simResult && (
            <div
              className={`mt-4 rounded-xl border p-4 text-xs ${
                simResult.valid
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : 'border-rose-200 bg-rose-50 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {simResult.valid ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-rose-600" />
                )}
                <span>
                  {simResult.valid
                    ? 'KOORDINAT VALID — PRESENSI DIIZINKAN'
                    : 'KOORDINAT DITOLAK — AKSES PRESENSI DIBLOKIR'}
                </span>
              </div>
              <p className="mt-1 font-medium">{simResult.message}</p>
              <div className="mt-2 flex items-center gap-4 text-[11px] opacity-80">
                <span>Jarak ke sekolah: ±{simResult.distanceMeters} meter</span>
                <span>Radius batas: {simResult.maxRadiusMeters} meter</span>
                {simResult.reason && <span>Alasan blokir: {simResult.reason}</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fraud Attempts Audit Log */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Audit Log Percobaan Presensi Ilegal & Anomali
            </h3>
            <p className="text-xs text-slate-500">
              Daftar percobaan absensi yang diblokir oleh mesin keamanan geofence SMAN 20
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari log..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50/50 pl-8 pr-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="">Semua Anomali</option>
              {Object.keys(REASON_LABELS).map((k) => (
                <option key={k} value={k}>
                  {REASON_LABELS[k as keyof typeof REASON_LABELS].label}
                </option>
              ))}
            </select>

            <button
              onClick={() => fetchSecurityData()}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Segarkan
            </button>

            <button
              onClick={handleClearLogs}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Bersihkan
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Waktu Kejadian</th>
                <th className="px-4 py-3">Pengguna & Akun</th>
                <th className="px-4 py-3">Alasan Pemblokiran</th>
                <th className="px-4 py-3">Jarak dari Sekolah</th>
                <th className="px-4 py-3">Perangkat / Browser</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3 text-right">Status Sistem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Belum ada catatan anomali atau log telah dibersihkan.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const reasonMeta = REASON_LABELS[log.reason] || {
                    label: log.reason,
                    severity: 'high',
                  };

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                        {log.timestamp}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{log.userName}</div>
                        <div className="text-[11px] text-slate-500">
                          {log.kelasOrJabatan} • {log.identifier}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold border ${
                            reasonMeta.severity === 'critical'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {log.reasonLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {log.distanceMeters > 1000
                          ? `${(log.distanceMeters / 1000).toFixed(1)} km`
                          : `${log.distanceMeters} m`}
                      </td>
                      <td className="px-4 py-3 max-w-xs text-slate-600 truncate" title={log.deviceInfo}>
                        {log.deviceInfo}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                        {log.ipAddress}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-800">
                          <XCircle className="h-3 w-3" />
                          {log.status}
                        </span>
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
