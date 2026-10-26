'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  School,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  HeartHandshake,
  GraduationCap,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type LoginRole = 'MURID' | 'GURU' | 'ORANG_TUA';

export default function MobileLoginPage() {
  const router = useRouter();
  const [roleTab, setRoleTab] = useState<LoginRole>('MURID');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Identitas dan kata sandi wajib diisi.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, role: roleTab }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Login gagal. Periksa kembali data login Anda.');
        setLoading(false);
        return;
      }

      setSuccessMessage(
        roleTab === 'ORANG_TUA'
          ? 'Selamat datang, Orang Tua/Wali! Membuka portal presensi...'
          : 'Login berhasil! Membuka aplikasi...'
      );
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 600);
    } catch {
      setErrorMessage('Terjadi kendala koneksi ke server.');
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-md mx-auto relative font-sans w-full">
      {/* Top Banner Solid Tint / Refined Gradient */}
      <div className="relative pt-8 pb-12 px-5 sm:px-6 bg-[#087f5b] text-white rounded-b-3xl shadow-md overflow-hidden">
        <div className="flex items-center gap-3 mb-2.5 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
            <School className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-md">
              SMAN 20 KAB. TANGERANG
            </span>
            <h1 className="text-lg sm:text-xl font-black tracking-tight leading-tight mt-0.5">
              DZITOE Mobile
            </h1>
          </div>
        </div>
        <p className="text-xs text-emerald-100 leading-relaxed font-normal relative z-10">
          {roleTab === 'ORANG_TUA'
            ? 'Portal Orang Tua: Pantau kehadiran GPS dan presensi harian siswa.'
            : 'Presensi GPS harian, jadwal kelas, dan informasi akademik murid.'}
        </p>
      </div>

      {/* Main Form Area */}
      <div className="px-6 -mt-8 flex-1 relative z-20 w-full flex flex-col">
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/60 border border-slate-100 flex-1">

          {/* Role Tab Selector (B1.3 - Login Orang Tua) */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/90 rounded-2xl mb-4 border border-slate-200/60">
            <button
              type="button"
              onClick={() => {
                setRoleTab('MURID');
                setErrorMessage('');
              }}
              className={cn(
                'py-2 px-1 text-center rounded-xl text-xs font-bold transition flex flex-col items-center gap-0.5 cursor-pointer',
                roleTab === 'MURID'
                  ? 'bg-white text-[#087f5b] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Murid</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRoleTab('GURU');
                setErrorMessage('');
              }}
              className={cn(
                'py-2 px-1 text-center rounded-xl text-xs font-bold transition flex flex-col items-center gap-0.5 cursor-pointer',
                roleTab === 'GURU'
                  ? 'bg-white text-[#087f5b] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Guru</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRoleTab('ORANG_TUA');
                setErrorMessage('');
              }}
              className={cn(
                'py-2 px-1 text-center rounded-xl text-xs font-bold transition flex flex-col items-center gap-0.5 cursor-pointer relative',
                roleTab === 'ORANG_TUA'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
              <span>Orang Tua</span>
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {roleTab === 'ORANG_TUA'
                  ? 'Masuk Sebagai Orang Tua / Wali'
                  : roleTab === 'GURU'
                  ? 'Masuk Sebagai Guru / PTK'
                  : 'Masuk Sebagai Murid (Siswa)'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {roleTab === 'ORANG_TUA'
                  ? 'Gunakan nomor WhatsApp terdaftar atau NISN anak'
                  : 'Gunakan identitas Dapodik Anda'}
              </p>
            </div>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                {roleTab === 'ORANG_TUA'
                  ? 'Nomor WhatsApp / NISN Anak'
                  : roleTab === 'GURU'
                  ? 'NIP / NUPTK / Username'
                  : 'NISN / Username Murid'}
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    roleTab === 'ORANG_TUA'
                      ? 'Contoh: 081288991122 atau 0067891234'
                      : roleTab === 'GURU'
                      ? 'Contoh: guru atau 19750812...'
                      : 'Contoh: murid atau 0067891234'
                  }
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087f5b] focus:border-[#087f5b] transition bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Kata Sandi
                </label>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087f5b] focus:border-[#087f5b] transition bg-slate-50/50 relative z-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 z-10 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center text-slate-600 cursor-pointer select-none text-[11px]">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-3.5 w-3.5 rounded border-slate-300 text-[#087f5b] focus:ring-[#087f5b]"
                />
                <span className="ml-1.5">Ingat saya</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {roleTab === 'ORANG_TUA' ? 'Bantuan WA Sekolah' : 'Hubungi Wali Kelas'}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex justify-center items-center gap-2 py-3 px-3 sm:px-4 rounded-xl shadow-md text-xs sm:text-sm font-bold text-white bg-[#087f5b] hover:bg-[#066549] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#087f5b] disabled:opacity-50 transition cursor-pointer min-h-[44px]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                  <span className="truncate">Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span className="truncate">
                    {roleTab === 'ORANG_TUA' ? 'Masuk Orang Tua' : 'Masuk Sekarang'}
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>

      {/* Mobile Footer */}
      <div className="py-4 text-center text-[11px] text-slate-400">
        SMAN 20 Kabupaten Tangerang • DZITOE v1.0.0
      </div>
    </div>
  );
}
