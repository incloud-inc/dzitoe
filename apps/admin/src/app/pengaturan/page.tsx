'use client';

import React, { useState, useEffect } from 'react';
import {
  School,
  MapPin,
  Clock,
  Calendar,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Compass,
  ExternalLink,
  Check,
  FlaskConical,
  Smartphone,
  KeyRound,
  MessageSquare,
  Camera,
  Layers,
  Info,
  Sparkles,
  Globe,
  Server,
  Link2,
  Copy,
  Upload,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { SchoolContactPanel } from '@/components/school-contact-panel';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { SchoolSettings } from '@/app/api/pengaturan/route';
import { DEFAULT_SETTINGS } from '@/app/api/pengaturan/route';

export default function PengaturanPage() {
  const [settings, setSettings] = useState<SchoolSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Ambil data pengaturan dari API saat halaman dimuat
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/pengaturan');
        const json = await res.json();
        if (json.success && json.data) {
          setSettings(json.data);
        }
      } catch (err) {
        console.error('Gagal memuat pengaturan:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Ukuran file logo melebihi batas maksimal 2 MB.' });
      return;
    }
    setLogoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setLogoPreview(objectUrl);
  };

  const handleUploadLogo = async () => {
    if (!logoFile) return;
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('logo', logoFile);
      const res = await fetch('/api/settings/logo', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.logoUrl) {
        setSettings((prev) => ({ ...prev, logoUrl: data.logoUrl }));
        setMessage({ type: 'success', text: 'Logo resmi sekolah berhasil diunggah dan disimpan!' });
        setLogoFile(null);
      } else {
        setMessage({ type: 'error', text: data.message || 'Gagal mengunggah logo sekolah.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Terjadi gangguan jaringan saat mengunggah logo.' });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSyncSubdomains = () => {
    const raw = (settings.primaryDomain || '').trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!raw) return;
    setSettings((prev) => ({
      ...prev,
      primaryDomain: raw,
      adminSubdomain: `admin.${raw}`,
      mobileSubdomain: `mobile.${raw}`,
    }));
    setMessage({
      type: 'success',
      text: `Subdomain berhasil diselaraskan ke admin.${raw} dan mobile.${raw}. Klik Simpan untuk menerapkan.`,
    });
  };

  const handleChange = <K extends keyof SchoolSettings>(key: K, value: SchoolSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleModeUjiCoba = async () => {
    const nextState = !settings.modeUjiCoba;
    const updated = { ...settings, modeUjiCoba: nextState };
    setSettings(updated);
    setMessage(null);

    try {
      const res = await fetch('/api/pengaturan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modeUjiCoba: nextState }),
      });
      const json = await res.json();
      if (json.success) {
        setMessage({
          type: 'success',
          text: nextState
            ? '🧪 MODE UJI COBA DIAKTIFKAN: Validasi geofencing GPS, batas jam absensi, dan liveness selfie dilonggarkan untuk pengujian/demo.'
            : '🛡️ MODE UJI COBA DINONAKTIFKAN: Sistem kembali ke mode DATA ASLI dengan validasi geofence 100m dan verifikasi presensi ketat.',
        });
      }
    } catch {
      setMessage({ type: 'error', text: 'Gagal memperbarui status Mode Uji Coba di server.' });
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/pengaturan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const json = await res.json();
      if (json.success) {
        setMessage({ type: 'success', text: 'Pengaturan sekolah & titik GPS berhasil disimpan!' });
      } else {
        setMessage({ type: 'error', text: json.message || 'Gagal menyimpan pengaturan.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Terjadi kendala koneksi ke server.' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Kembalikan semua pengaturan ke nilai standar SMAN 20 Kabupaten Tangerang?')) {
      setSettings(DEFAULT_SETTINGS);
      setMessage({ type: 'success', text: 'Pengaturan dikembalikan ke standar. Klik Simpan untuk menerapkan.' });
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-slate-500">Memuat Pengaturan SMAN 20...</span>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6 pb-12">
        {/* Header Halaman */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pengaturan Sekolah & GPS
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl">
              Konfigurasi identitas resmi, koordinat radius presensi murid & guru, jam operasional, serta tahun ajaran aktif SMAN 20 Kabupaten Tangerang.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center shrink-0">
            {/* Tombol ON / OFF MODE UJI COBA */}
            <button
              type="button"
              onClick={handleToggleModeUjiCoba}
              disabled={saving}
              className={cn(
                'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer border',
                settings.modeUjiCoba
                  ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600 shadow-amber-500/20 ring-2 ring-amber-400/50'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              )}
              title={
                settings.modeUjiCoba
                  ? 'Mode Uji Coba AKTIF: Pembatasan radius GPS, liveness selfie, dan batasan jam KBM dilonggarkan.'
                  : 'Mode Uji Coba NONAKTIF: Menggunakan data asli dan validasi ketat radius 100m gerbang sekolah.'
              }
            >
              <FlaskConical className={cn('w-4 h-4', settings.modeUjiCoba ? 'text-white animate-pulse' : 'text-amber-600')} />
              <span>
                Mode Uji Coba: <span className={settings.modeUjiCoba ? 'underline decoration-2 font-black' : 'font-semibold'}>{settings.modeUjiCoba ? 'ON (AKTIF)' : 'OFF'}</span>
              </span>
              {settings.modeUjiCoba && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              Reset
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-900 via-brand-700 to-brand-600 text-white text-xs font-bold shadow-md shadow-brand-900/15 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 disabled:opacity-50 transition cursor-pointer"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Notifikasi Status Feedback */}
        {message && (
          <div
            className={cn(
              'p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-medium border animate-in fade-in duration-200',
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            )}
          >
            <div className="flex items-center gap-2.5">
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setMessage(null)}
              className="text-xs opacity-60 hover:opacity-100 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Sandbox Active Banner Indicator */}
        {settings.modeUjiCoba && (
          <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-orange-500/5 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-xs animate-in fade-in duration-300">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs shrink-0 mt-0.5 sm:mt-0">
                <FlaskConical className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-black text-amber-950 text-sm tracking-tight">MODE UJI COBA (SANDBOX) SEDANG AKTIF</span>
                  <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 rounded-md">
                    Simulasi & Pengujian
                  </span>
                </div>
                <p className="text-amber-900/90 text-xs leading-relaxed max-w-3xl">
                  Validasi ketat data asli dilonggarkan: Murid & Guru dapat presensi dari mana saja (bypass radius 100m gerbang sekolah), batas jam KBM 24 jam dibuka, verifikasi biometrik liveness selfie diizinkan fleksibel, dan notifikasi WA disimulasikan.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleModeUjiCoba}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs transition"
            >
              Matikan Mode Uji Coba
            </button>
          </div>
        )}

        {/* Tab Navigasi Pengaturan */}
        {/* Tab Navigasi Pengaturan - Layout Split */}
        <Tabs defaultValue="gps" className="flex flex-col md:flex-row gap-6 md:gap-8">
          <TabsList className="flex flex-col h-auto w-full md:w-64 bg-transparent p-0 space-y-1 shrink-0">
            <TabsTrigger
              value="gps"
              className="w-full justify-start items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-brand-900 data-[state=active]:shadow-sm data-[state=inactive]:hover:bg-slate-100 transition-all"
            >
              <MapPin className="w-4 h-4 text-brand-600" />
              <span>Titik Lokasi & Radius</span>
            </TabsTrigger>
            <TabsTrigger
              value="profil"
              className="w-full justify-start items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-brand-900 data-[state=active]:shadow-sm data-[state=inactive]:hover:bg-slate-100 transition-all"
            >
              <School className="w-4 h-4 text-brand-600" />
              <span>Profil Sekolah</span>
            </TabsTrigger>
            <TabsTrigger
              value="jam"
              className="w-full justify-start items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-brand-900 data-[state=active]:shadow-sm data-[state=inactive]:hover:bg-slate-100 transition-all"
            >
              <Clock className="w-4 h-4 text-brand-600" />
              <span>Jam Operasional</span>
            </TabsTrigger>
            <TabsTrigger
              value="akademik"
              className="w-full justify-start items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-brand-900 data-[state=active]:shadow-sm data-[state=inactive]:hover:bg-slate-100 transition-all"
            >
              <Calendar className="w-4 h-4 text-brand-600" />
              <span>Tahun Ajaran</span>
            </TabsTrigger>
            <TabsTrigger
              value="domain"
              className="w-full justify-start items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-brand-900 data-[state=active]:shadow-sm data-[state=inactive]:hover:bg-slate-100 transition-all"
            >
              <Globe className="w-4 h-4 text-brand-600" />
              <span>Domain & Jaringan</span>
            </TabsTrigger>
            <TabsTrigger
              value="ujicoba"
              className={cn(
                'w-full justify-start items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition-all',
                settings.modeUjiCoba
                  ? 'bg-amber-100/80 text-amber-900 data-[state=active]:bg-amber-500 data-[state=active]:text-white font-black'
                  : 'data-[state=active]:bg-white data-[state=active]:text-brand-900 data-[state=inactive]:hover:bg-slate-100'
              )}
            >
              <FlaskConical className={cn('w-4 h-4', settings.modeUjiCoba ? 'text-amber-700 data-[state=active]:text-white' : 'text-slate-500')} />
              <span>Mode Uji Coba</span>
              {settings.modeUjiCoba && (
                <span className="ml-auto px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-black">
                  ON
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-w-0">
          {/* TAB 1: TITIK LOKASI & RADIUS GPS */}
          <TabsContent value="gps" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Input Koordinat */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-brand-600" />
                    Koordinat Geografis SMAN 20
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Titik acuan pusat sekolah yang digunakan sistem untuk menghitung jarak presensi murid dan guru via Haversine Formula.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Latitude (Lintang)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={settings.latitude}
                      onChange={(e) => handleChange('latitude', parseFloat(e.target.value) || 0)}
                      className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 transition"
                      placeholder="-6.123456"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Garis lintang sekolah (Desimal).
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Longitude (Bujur)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={settings.longitude}
                      onChange={(e) => handleChange('longitude', parseFloat(e.target.value) || 0)}
                      className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 transition"
                      placeholder="106.123456"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Garis bujur sekolah (Desimal).
                    </span>
                  </div>
                </div>

                {/* Radius Slider & Number Input */}
                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Radius Presensi Valid (Meter)
                      </label>
                      <p className="text-xs text-slate-500">
                        Jarak maksimal murid/guru dari titik pusat sekolah untuk dihitung hadir.
                      </p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-xl bg-brand-50 text-brand-900 font-mono font-bold text-sm border border-brand-200">
                      {settings.radiusMeters} meter
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={25}
                      max={500}
                      step={5}
                      value={settings.radiusMeters}
                      onChange={(e) => handleChange('radiusMeters', parseInt(e.target.value, 10))}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                    />
                    <input
                      type="number"
                      min={10}
                      max={1000}
                      value={settings.radiusMeters}
                      onChange={(e) => handleChange('radiusMeters', parseInt(e.target.value, 10) || 100)}
                      className="w-24 px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-mono text-slate-900 text-center"
                    />
                  </div>
                </div>

                {/* Akurasi GPS Maksimal & Anti Mock Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Toleransi Akurasi GPS (Meter)
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={200}
                      value={settings.maxGpsAccuracy}
                      onChange={(e) => handleChange('maxGpsAccuracy', parseInt(e.target.value, 10) || 50)}
                      className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-600 transition"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Tolak presensi jika deviasi GPS perangkat lebih dari batas ini (Default: 50m).
                    </span>
                  </div>

                  <div className="flex flex-col justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Proteksi Fake GPS (Mock Location)
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 transition cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={settings.enforceMockLocationCheck}
                        onChange={(e) => handleChange('enforceMockLocationCheck', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block">Deteksi Fake GPS Aktif</span>
                        <span className="text-slate-500 text-[11px]">Blokir aplikasi spoofing lokasi</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Preview Peta & Status Radius Card */}
              <div className="bg-gradient-to-br from-brand-900 via-[#0ca678] to-[#087f5b] text-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-brand-900/10 flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-wider uppercase bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-xs">
                      Simulasi Radius
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-brand-100">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Aktif
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-black tracking-tight">{settings.schoolName}</h4>
                    <p className="text-xs text-brand-100/90 mt-1 leading-relaxed">
                      {settings.address}
                    </p>
                  </div>

                  {/* Koordinat Display Box */}
                  <div className="p-3.5 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 font-mono text-xs space-y-1">
                    <div className="flex justify-between text-brand-200">
                      <span>LAT:</span>
                      <span className="text-white font-bold">{settings.latitude}</span>
                    </div>
                    <div className="flex justify-between text-brand-200">
                      <span>LNG:</span>
                      <span className="text-white font-bold">{settings.longitude}</span>
                    </div>
                    <div className="flex justify-between text-brand-200">
                      <span>RADIUS:</span>
                      <span className="text-emerald-300 font-bold">{settings.radiusMeters} m</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-brand-100">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                      <span>Presensi hanya sah dalam lingkaran {settings.radiusMeters} meter</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                      <span>Validasi selfie wajib berlatar sekolah</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                      <span>Watermark koordinat & timestamp otomatis</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/15 relative z-10">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${settings.latitude},${settings.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-white text-brand-900 font-bold text-xs hover:bg-brand-50 transition shadow-sm"
                  >
                    <span>Buka Titik di Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: PROFIL SEKOLAH */}
          <TabsContent value="profil" className="mt-0 space-y-6">
            {/* CARD UPLOAD LOGO RESMI SEKOLAH (A2.6) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-brand-600" />
                    Logo Resmi Satuan Pendidikan (A2.6)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Logo sekolah yang akan digunakan pada header sistem tata kelola, aplikasi mobile, kop cetak rapor, dan dokumen resmi.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Maks. 2 MB (PNG, JPG, SVG, WebP)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Visual Preview Box */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center">
                  <div className="relative w-28 h-28 rounded-2xl bg-white border border-slate-200 shadow-inner flex items-center justify-center overflow-hidden p-2 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoPreview || settings.logoUrl || '/logo-sman20.png'}
                      alt="Logo SMAN 20"
                      className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=SMAN+20&background=044e54&color=fff&size=128';
                      }}
                    />
                    {logoPreview && (
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-brand-600 text-white shadow-xs">
                        Preview
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-800 mt-3">
                    {logoFile ? logoFile.name : 'Logo Aktif SMAN 20'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {logoFile ? `${(logoFile.size / 1024).toFixed(1)} KB` : 'Tersimpan di sistem'}
                  </span>
                </div>

                {/* Upload Control Area */}
                <div className="md:col-span-8 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition shadow-xs">
                      <Upload className="w-4 h-4 text-brand-600" />
                      <span>Pilih File Logo Baru...</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        className="hidden"
                        onChange={handleLogoSelect}
                        disabled={uploadingLogo}
                      />
                    </label>

                    {logoFile && (
                      <button
                        type="button"
                        onClick={handleUploadLogo}
                        disabled={uploadingLogo}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition cursor-pointer disabled:opacity-50"
                      >
                        {uploadingLogo ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Mengunggah...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Terapkan & Simpan Logo</span>
                          </>
                        )}
                      </button>
                    )}

                    {logoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setLogoFile(null);
                          setLogoPreview(null);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs font-semibold transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Batal</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    💡 <strong>Tips:</strong> Disarankan menggunakan logo berlatar belakang transparan (format PNG atau SVG) dengan resolusi minimal 512×512 piksel agar proporsional di tampilan layar laptop maupun smartphone.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <School className="w-5 h-5 text-brand-600" />
                  Identitas Resmi Satuan Pendidikan
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Data referensi resmi sekolah yang tercantum pada rapor, dokumen absensi, dan laporan PPID.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Nama Satuan Pendidikan
                  </label>
                  <input
                    type="text"
                    value={settings.schoolName}
                    onChange={(e) => handleChange('schoolName', e.target.value)}
                    className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    NPSN (Nomor Pokok Sekolah Nasional)
                  </label>
                  <input
                    type="text"
                    value={settings.npsn}
                    onChange={(e) => handleChange('npsn', e.target.value)}
                    className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-brand-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Status Akreditasi
                  </label>
                  <input
                    type="text"
                    value={settings.accreditation}
                    onChange={(e) => handleChange('accreditation', e.target.value)}
                    className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Resmi Sekolah
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Alamat Lengkap Sekolah
                  </label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    value={settings.headmaster}
                    onChange={(e) => handleChange('headmaster', e.target.value)}
                    className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    NIP Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    value={settings.headmasterNip}
                    onChange={(e) => handleChange('headmasterNip', e.target.value)}
                    className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-brand-600 transition"
                  />
                </div>
              </div>
            </div>

            {/* Panel Kontak & Informasi Resmi Sekolah */}
            <SchoolContactPanel />
          </TabsContent>

          {/* TAB 3: JAM OPERASIONAL PRESENSI */}
          <TabsContent value="jam" className="mt-0 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-600" />
                  Jadwal Waktu Presensi Harian
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Aturan batasan waktu presensi murid dan guru sesuai tata tertib SMAN 20 Kabupaten Tangerang.
                </p>
              </div>

              {/* Sesi Masuk */}
              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Sesi Presensi Masuk (Pagi)
                  </h4>
                  <span className="text-[11px] font-semibold text-brand-800 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                    Target: TEPAT
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Waktu Buka Masuk
                    </label>
                    <input
                      type="time"
                      value={settings.checkInStart}
                      onChange={(e) => handleChange('checkInStart', e.target.value)}
                      className="block w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono text-slate-900"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Mulai dapat absen masuk</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Batas Terlambat
                    </label>
                    <input
                      type="time"
                      value={settings.checkInLateThreshold}
                      onChange={(e) => handleChange('checkInLateThreshold', e.target.value)}
                      className="block w-full px-3 py-2 text-sm rounded-xl border border-amber-300 font-mono text-amber-900 bg-amber-50/50"
                    />
                    <span className="text-[10px] text-amber-700 mt-0.5 block">Lewat jam ini = TERLAMBAT</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Batas Akhir Masuk
                    </label>
                    <input
                      type="time"
                      value={settings.checkInEnd}
                      onChange={(e) => handleChange('checkInEnd', e.target.value)}
                      className="block w-full px-3 py-2 text-sm rounded-xl border border-red-300 font-mono text-red-900 bg-red-50/50"
                    />
                    <span className="text-[10px] text-red-700 mt-0.5 block">Lewat jam ini = ALPA / Ditutup</span>
                  </div>
                </div>
              </div>

              {/* Sesi Pulang */}
              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Sesi Presensi Pulang (Sore)
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-700 bg-slate-200/70 px-2 py-0.5 rounded-full">
                    Checkout Selesai KBM
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Waktu Buka Pulang
                    </label>
                    <input
                      type="time"
                      value={settings.checkOutStart}
                      onChange={(e) => handleChange('checkOutStart', e.target.value)}
                      className="block w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono text-slate-900"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Mulai dapat absen pulang</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Waktu Tutup Pulang
                    </label>
                    <input
                      type="time"
                      value={settings.checkOutEnd}
                      onChange={(e) => handleChange('checkOutEnd', e.target.value)}
                      className="block w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono text-slate-900"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Batas akhir checkout harian</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: TAHUN AJARAN & SEMESTER */}
          <TabsContent value="akademik" className="mt-0 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-600" />
                  Kalender Akademik Aktif
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Menentukan periode tahun ajaran berjalan untuk rekap asesmen, raport, dan absensi semester.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Tahun Ajaran Berjalan
                  </label>
                  <select
                    value={settings.academicYear}
                    onChange={(e) => handleChange('academicYear', e.target.value)}
                    className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-brand-600 transition bg-white"
                  >
                    <option value="2024/2025">2024/2025</option>
                    <option value="2025/2026">2025/2026 (Aktif)</option>
                    <option value="2026/2027">2026/2027</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Semester Aktif
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleChange('semester', 'GANJIL')}
                      className={cn(
                        'py-2.5 px-4 rounded-xl text-xs font-bold border transition text-center flex items-center justify-center gap-2 cursor-pointer',
                        settings.semester === 'GANJIL'
                          ? 'bg-brand-50 border-brand-500 text-brand-900 ring-2 ring-brand-500/20 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      {settings.semester === 'GANJIL' && <Check className="w-3.5 h-3.5 text-brand-600" />}
                      <span>Ganjil (1)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleChange('semester', 'GENAP')}
                      className={cn(
                        'py-2.5 px-4 rounded-xl text-xs font-bold border transition text-center flex items-center justify-center gap-2 cursor-pointer',
                        settings.semester === 'GENAP'
                          ? 'bg-brand-50 border-brand-500 text-brand-900 ring-2 ring-brand-500/20 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      {settings.semester === 'GENAP' && <Check className="w-3.5 h-3.5 text-brand-600" />}
                      <span>Genap (2)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Regulasi Badge */}
              <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200/80 flex items-start gap-3 text-xs text-brand-950">
                <ShieldCheck className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Kepatuhan Standar Kurikulum Merdeka</span>
                  <p className="text-brand-800 text-[11px] leading-relaxed">
                    Sistem DZITOE secara otomatis menyesuaikan bobot asesmen formatif, sumatif, capaian pembelajaran (CP), dan pembinaan karakter restitusi dengan Permendikdasmen No. 1–6 Tahun 2026.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 5: DOMAIN & SUBDOMAIN JARINGAN */}
          <TabsContent value="domain" className="mt-0 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              {/* Header Tab */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-900 ring-1 ring-blue-200">
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                      Infrastruktur & Jaringan
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">Domain Dinamis</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Server className="w-5 h-5 text-brand-600" />
                    Konfigurasi Domain & Subdomain Sekolah
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                    Sesuaikan domain utama dan alamat subdomain portal sekolah jika terjadi perubahan domain resmi, migrasi hosting, atau integrasi ke domain Dinas Pendidikan.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSyncSubdomains}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer border border-slate-300/80 shadow-2xs shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  <span>Sinkronkan Subdomain</span>
                </button>
              </div>

              {/* Form Input Domain */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Domain Utama */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Domain Utama Institusi
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={settings.primaryDomain || ''}
                        onChange={(e) => handleChange('primaryDomain', e.target.value)}
                        placeholder="contoh: sman20kabtangerang.sch.id"
                        className="block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-brand-600 transition bg-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSyncSubdomains}
                      className="px-4 py-2.5 rounded-xl bg-brand-50 text-brand-900 border border-brand-200 text-xs font-bold hover:bg-brand-100 transition shrink-0 cursor-pointer"
                    >
                      Terapkan ke Subdomain
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    Domain root resmi institusi (tanpa awalan http:// atau https://).
                  </span>
                </div>

                {/* Subdomain Admin */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Subdomain Portal Admin & Tata Kelola
                  </label>
                  <div className="relative">
                    <Server className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={settings.adminSubdomain || ''}
                      onChange={(e) => handleChange('adminSubdomain', e.target.value)}
                      placeholder="contoh: admin.sman20kabtangerang.sch.id"
                      className="block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-brand-600 transition bg-white"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    Alamat login untuk Admin, Kepala Sekolah, dan staf Tata Usaha.
                  </span>
                </div>

                {/* Subdomain Mobile */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Subdomain Aplikasi Mobile (Murid & Guru)
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={settings.mobileSubdomain || ''}
                      onChange={(e) => handleChange('mobileSubdomain', e.target.value)}
                      placeholder="contoh: mobile.sman20kabtangerang.sch.id"
                      className="block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-brand-600 transition bg-white"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    Alamat PWA presensi siswa & guru untuk install ke homescreen smartphone.
                  </span>
                </div>

                {/* Protokol */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Protokol Akses Web
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleChange('appProtocol', 'https')}
                      className={cn(
                        'py-2.5 px-4 rounded-xl text-xs font-bold border transition text-center flex items-center justify-center gap-2 cursor-pointer',
                        settings.appProtocol === 'https'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      <ShieldCheck className={cn('w-4 h-4', settings.appProtocol === 'https' ? 'text-emerald-600' : 'text-slate-400')} />
                      <span>HTTPS (SSL Aman)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('appProtocol', 'http')}
                      className={cn(
                        'py-2.5 px-4 rounded-xl text-xs font-bold border transition text-center flex items-center justify-center gap-2 cursor-pointer',
                        settings.appProtocol === 'http'
                          ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      <Info className={cn('w-4 h-4', settings.appProtocol === 'http' ? 'text-amber-600' : 'text-slate-400')} />
                      <span>HTTP (Lokal / Tes)</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    Wajib HTTPS untuk produksi agar fitur GPS & Kamera Smartphone diizinkan browser.
                  </span>
                </div>

                {/* IP Server */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Alamat IP Publik VPS / Server Sekolah
                  </label>
                  <div className="relative">
                    <Server className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={settings.serverIpAddress || ''}
                      onChange={(e) => handleChange('serverIpAddress', e.target.value)}
                      placeholder="contoh: 103.145.22.180"
                      className="block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-brand-600 transition bg-white font-mono"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    IP tujuan DNS A Record untuk mengarahkan domain sekolah ke server DZITOE.
                  </span>
                </div>
              </div>

              {/* Live URL Preview Cards */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-brand-600" />
                  Pratinjau Tautan Aktif Sistem
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Preview Admin */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tautan Dashboard Admin</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-black">Port 3000</span>
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-900 truncate">
                      {settings.appProtocol || 'https'}://{settings.adminSubdomain || 'admin.sman20kabtangerang.sch.id'}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`${settings.appProtocol || 'https'}://${settings.adminSubdomain || 'admin.sman20kabtangerang.sch.id'}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Buka
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(`${settings.appProtocol || 'https'}://${settings.adminSubdomain || 'admin.sman20kabtangerang.sch.id'}`, 'adminUrl')}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      >
                        {copiedKey === 'adminUrl' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey === 'adminUrl' ? 'Tersalin' : 'Salin URL'}
                      </button>
                    </div>
                  </div>

                  {/* Preview Mobile */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tautan Portal Mobile (Siswa/Guru)</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black">Port 3001</span>
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-900 truncate">
                      {settings.appProtocol || 'https'}://{settings.mobileSubdomain || 'mobile.sman20kabtangerang.sch.id'}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`${settings.appProtocol || 'https'}://${settings.mobileSubdomain || 'mobile.sman20kabtangerang.sch.id'}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Buka
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(`${settings.appProtocol || 'https'}://${settings.mobileSubdomain || 'mobile.sman20kabtangerang.sch.id'}`, 'mobileUrl')}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      >
                        {copiedKey === 'mobileUrl' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey === 'mobileUrl' ? 'Tersalin' : 'Salin URL'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panduan DNS Records Table */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Server className="w-4 h-4 text-brand-600" />
                  Panduan DNS Zone Editor (Untuk Tim IT / Hosting)
                </h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-2.5 px-4">Tipe Record</th>
                        <th className="py-2.5 px-4">Host / Nama</th>
                        <th className="py-2.5 px-4">Nilai Target (Value)</th>
                        <th className="py-2.5 px-4">Keterangan</th>
                        <th className="py-2.5 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      <tr className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-4 font-bold font-mono text-brand-700">A</td>
                        <td className="py-2.5 px-4 font-mono font-semibold">@ (root)</td>
                        <td className="py-2.5 px-4 font-mono text-slate-600">{settings.serverIpAddress || '103.145.22.180'}</td>
                        <td className="py-2.5 px-4 text-slate-500 text-[11px]">Mengarahkan domain utama ke IP server</td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleCopy(settings.serverIpAddress || '103.145.22.180', 'dnsA')}
                            className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                          >
                            {copiedKey === 'dnsA' ? '✓' : 'Salin'}
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-4 font-bold font-mono text-blue-700">CNAME</td>
                        <td className="py-2.5 px-4 font-mono font-semibold">admin</td>
                        <td className="py-2.5 px-4 font-mono text-slate-600">{settings.primaryDomain || 'sman20kabtangerang.sch.id'}</td>
                        <td className="py-2.5 px-4 text-slate-500 text-[11px]">Subdomain dashboard tata kelola</td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleCopy(settings.primaryDomain || 'sman20kabtangerang.sch.id', 'dnsAdmin')}
                            className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                          >
                            {copiedKey === 'dnsAdmin' ? '✓' : 'Salin'}
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-4 font-bold font-mono text-emerald-700">CNAME</td>
                        <td className="py-2.5 px-4 font-mono font-semibold">mobile</td>
                        <td className="py-2.5 px-4 font-mono text-slate-600">{settings.primaryDomain || 'sman20kabtangerang.sch.id'}</td>
                        <td className="py-2.5 px-4 text-slate-500 text-[11px]">Subdomain PWA murid & guru</td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleCopy(settings.primaryDomain || 'sman20kabtangerang.sch.id', 'dnsMobile')}
                            className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                          >
                            {copiedKey === 'dnsMobile' ? '✓' : 'Salin'}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Nginx Gateway otomatis mengenali pola domain & subdomain di atas tanpa perlu rebuild docker.</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSave()}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-900 to-brand-700 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-brand-900/15 transition cursor-pointer shrink-0"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Konfigurasi Domain'}
                </button>
              </div>
            </div>
          </TabsContent>

          {/* TAB 6: MODE UJI COBA & SANDBOX (KEHARUSAN DATA ASLI VS SIMULASI) */}
          <TabsContent value="ujicoba" className="mt-0 space-y-6">
            {/* Header Card Mode Uji Coba */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-900 ring-1 ring-amber-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Sandbox & Testing Environment
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">Bypass Data Asli untuk Uji Coba</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-amber-600" />
                    Kendali Mode Uji Coba (Sandbox)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                    Aktifkan mode ini saat melakukan simulasi absensi, uji coba login mobile, verifikasi GPS, atau demo ke pengawas sekolah tanpa perlu berada di titik fisik sekolah dan tanpa mengirim notifikasi asli ke orang tua murid.
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">Status Utama</span>
                    <span className={cn('text-sm font-black', settings.modeUjiCoba ? 'text-amber-600' : 'text-slate-700')}>
                      {settings.modeUjiCoba ? 'AKTIF (SIMULASI)' : 'OFF (DATA ASLI)'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleModeUjiCoba}
                    className={cn(
                      'relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
                      settings.modeUjiCoba ? 'bg-amber-500' : 'bg-slate-300'
                    )}
                  >
                    <span
                      className={cn(
                        'pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
                        settings.modeUjiCoba ? 'translate-x-6' : 'translate-x-0'
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Grid 6 Aturan Keharusan Data Asli vs Mode Uji Coba */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand-600" />
                  Parameter Bypass Keharusan Data Asli
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 1. Geofencing & GPS Radius */}
                  <div className={cn(
                    'p-4 rounded-2xl border transition-all space-y-3',
                    settings.modeUjiCoba && settings.modeUjiCobaBypassGps
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-slate-50/60 border-slate-200'
                  )}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-white border border-slate-200 text-brand-600 shadow-2xs">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">Bypass Radius GPS & Anti-Fake</h5>
                          <span className="text-[10px] text-slate-500 font-medium">Modul A11 & B3 (Absensi Geofence)</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.modeUjiCobaBypassGps}
                        onChange={(e) => handleChange('modeUjiCobaBypassGps', e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 mt-1 cursor-pointer"
                      />
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Data Asli:</strong> Murid/Guru wajib berada dalam radius 100m gerbang SMAN 20 Pakuhaji dan aplikasi fake-GPS langsung diblokir.<br />
                      <strong className="text-amber-800">Mode Uji Coba:</strong> Dapat presensi dari mana saja dan mock location diizinkan.
                    </p>
                  </div>

                  {/* 2. Jam Operasional Absensi */}
                  <div className={cn(
                    'p-4 rounded-2xl border transition-all space-y-3',
                    settings.modeUjiCoba && settings.modeUjiCobaBypassWaktu
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-slate-50/60 border-slate-200'
                  )}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-white border border-slate-200 text-brand-600 shadow-2xs">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">Bypass Jam Operasional (24 Jam)</h5>
                          <span className="text-[10px] text-slate-500 font-medium">Modul A2 & B3 (Waktu Presensi)</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.modeUjiCobaBypassWaktu}
                        onChange={(e) => handleChange('modeUjiCobaBypassWaktu', e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 mt-1 cursor-pointer"
                      />
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Data Asli:</strong> Absen masuk hanya dibuka 06:00 – 08:00 WIB. Di luar jam KBM tombol presensi terkunci.<br />
                      <strong className="text-amber-800">Mode Uji Coba:</strong> Presensi masuk dan pulang bisa dicoba kapan saja 24 jam.
                    </p>
                  </div>

                  {/* 3. Liveness Selfie Biometrik */}
                  <div className={cn(
                    'p-4 rounded-2xl border transition-all space-y-3',
                    settings.modeUjiCoba && settings.modeUjiCobaBypassLiveness
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-slate-50/60 border-slate-200'
                  )}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-white border border-slate-200 text-brand-600 shadow-2xs">
                          <Camera className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">Bypass Biometrik & Liveness Selfie</h5>
                          <span className="text-[10px] text-slate-500 font-medium">Modul A10 & B4 (Selfie Verification)</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.modeUjiCobaBypassLiveness}
                        onChange={(e) => handleChange('modeUjiCobaBypassLiveness', e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 mt-1 cursor-pointer"
                      />
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Data Asli:</strong> Wajib deteksi kedipan mata langsung di depan kamera untuk mencegah manipulasi foto layar.<br />
                      <strong className="text-amber-800">Mode Uji Coba:</strong> Verifikasi liveness dilonggarkan untuk mempermudah simulasi kamera web/mobile.
                    </p>
                  </div>

                  {/* 4. Autentikasi Akun Murid & Guru */}
                  <div className={cn(
                    'p-4 rounded-2xl border transition-all space-y-3',
                    settings.modeUjiCoba && settings.modeUjiCobaAutoAuth
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-slate-50/60 border-slate-200'
                  )}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-white border border-slate-200 text-brand-600 shadow-2xs">
                          <KeyRound className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">Autentikasi Akun Cepat & Fleksibel</h5>
                          <span className="text-[10px] text-slate-500 font-medium">Modul A1, A3 & B1 (Akun Dapodik)</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.modeUjiCobaAutoAuth}
                        onChange={(e) => handleChange('modeUjiCobaAutoAuth', e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 mt-1 cursor-pointer"
                      />
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Data Asli:</strong> Wajib akun murid/guru yang berstatus aktif di database Dapodik sekolah dengan password resmi.<br />
                      <strong className="text-amber-800">Mode Uji Coba:</strong> Membolehkan login dengan akun murid demo (contoh NISN 20241001-20241030).
                    </p>
                  </div>

                  {/* 5. Penguncian Perangkat (Device Lock) */}
                  <div className={cn(
                    'p-4 rounded-2xl border transition-all space-y-3',
                    settings.modeUjiCoba && settings.modeUjiCobaBypassDeviceLock
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-slate-50/60 border-slate-200'
                  )}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-white border border-slate-200 text-brand-600 shadow-2xs">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">Bypass Penguncian 1 Perangkat (IMEI/UUID)</h5>
                          <span className="text-[10px] text-slate-500 font-medium">Modul A1 & B1 (Device Binding)</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.modeUjiCobaBypassDeviceLock}
                        onChange={(e) => handleChange('modeUjiCobaBypassDeviceLock', e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 mt-1 cursor-pointer"
                      />
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Data Asli:</strong> 1 akun murid hanya boleh terpasang di 1 smartphone terdaftar untuk mencegah titip absen.<br />
                      <strong className="text-amber-800">Mode Uji Coba:</strong> Akun dapat dibuka di beberapa browser/tab sekaligus untuk keperluan testing.
                    </p>
                  </div>

                  {/* 6. Simulasi Notifikasi WhatsApp Orang Tua */}
                  <div className={cn(
                    'p-4 rounded-2xl border transition-all space-y-3',
                    settings.modeUjiCoba && settings.modeUjiCobaSimulasiWa
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-slate-50/60 border-slate-200'
                  )}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-white border border-slate-200 text-brand-600 shadow-2xs">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">Simulasi Notifikasi WA Orang Tua (Mock)</h5>
                          <span className="text-[10px] text-slate-500 font-medium">Modul A12 & B8 (WA Gateway)</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.modeUjiCobaSimulasiWa}
                        onChange={(e) => handleChange('modeUjiCobaSimulasiWa', e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 mt-1 cursor-pointer"
                      />
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Data Asli:</strong> Pesan kehadiran/keterlambatan dikirim nyata ke nomor WhatsApp orang tua/wali murid.<br />
                      <strong className="text-amber-800">Mode Uji Coba:</strong> Pesan hanya disimulasikan ke log sistem tanpa menembak kuota provider gateway WA riil.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Save Specific */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  Perubahan aturan uji coba di atas akan disimpan dan langsung diterapkan ke seluruh sistem presensi dan autentikasi.
                </p>
                <button
                  type="button"
                  onClick={() => handleSave()}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
                >
                  {saving ? 'Menyimpan Aturan...' : 'Simpan Konfigurasi Uji Coba'}
                </button>
              </div>
            </div>

            {/* Panduan Uji Coba untuk Guru & Developer */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Info className="w-4 h-4 text-brand-600" />
                Panduan Pengujian Sistem DZITOE
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="font-bold text-slate-900 block">1. Testing Siswa di Mobile</span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Buka <code className="bg-slate-100 px-1 py-0.5 rounded text-brand-700 font-bold">http://localhost:3001</code>, gunakan NISN demo seperti <code className="bg-slate-100 px-1 py-0.5 rounded text-brand-700 font-bold">20241001</code>.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="font-bold text-slate-900 block">2. Testing Absensi & Kamera</span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Dalam mode uji coba, tombol absensi di mobile dapat ditekan langsung tanpa blokir radius GPS dan tanpa wajib kedip mata.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="font-bold text-slate-900 block">3. Menyiapkan Data Nyata</span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Saat sekolah resmi menggunakan sistem untuk KBM aktif, matikan Mode Uji Coba menjadi <strong className="text-slate-900">OFF</strong> agar regulasi Permendikdasmen 2026 berjalan penuh.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
