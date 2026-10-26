'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  School,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
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
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Login gagal. Periksa kembali kredensial Anda.');
        setLoading(false);
        return;
      }

      if (data.requirePasswordChange) {
        setSuccessMessage('Login berhasil! (Peringatan: Harap segera ubah kata sandi default Masuk123! di menu Akun). Mengalihkan...');
      } else {
        setSuccessMessage('Login berhasil! Mengalihkan ke dashboard...');
      }
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 900);
    } catch {
      setErrorMessage('Terjadi kesalahan jaringan. Coba beberapa saat lagi.');
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Decorative Blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-warm-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-900 via-brand-700 to-brand-600 text-white shadow-xl shadow-brand-900/20 mb-4 ring-4 ring-brand-100">
            <School className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            DZITOE <span className="text-brand-700">ADMIN</span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-neutral-600 font-medium">
            SMAN 20 Kabupaten Tangerang — Tata Kelola Terpadu
          </p>
        </div>

        {/* Card Form */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-xl shadow-neutral-900/5 sm:rounded-xl sm:px-10 border border-neutral-200/80 relative">
            {/* Top Indicator */}
            <div className="flex items-center justify-between pb-5 mb-5 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Masuk Portal</h3>
                <p className="text-xs text-neutral-500">Akses Admin, Guru & Tata Usaha</p>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-800 border border-brand-200">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                Permendikdasmen 2026
              </span>
            </div>

            {/* Error & Success Alerts */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Username / Email
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="admin atau email sekolah"
                    className="block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center text-neutral-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="ml-2">Ingat perangkat ini</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="font-semibold text-brand-700 hover:text-brand-800 transition"
                >
                  Lupa sandi?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-900/15 text-sm font-bold text-white bg-gradient-to-r from-brand-900 via-brand-700 to-brand-600 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-600 disabled:opacity-50 transition cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>


            {/* Public PPID Quick Access */}
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
              <span className="text-neutral-500">Mencari Informasi Publik?</span>
              <Link
                href="/publik/ppid"
                className="font-semibold text-brand-700 hover:text-brand-900 hover:underline flex items-center gap-1"
              >
                <span>Portal PPID Publik (Tanpa Login)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-neutral-500">
          © 2026 SMAN 20 Kabupaten Tangerang — Sistem Tata Kelola Terpadu DZITOE
        </p>
      </div>
    </div>
  );
}
