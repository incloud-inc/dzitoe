'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  KeyRound,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  FlaskConical,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [simulationOtp, setSimulationOtp] = useState<string | null>(null);
  const [maskedEmail, setMaskedEmail] = useState('');

  // Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      const json = await res.json();

      if (json.success) {
        setStep(2);
        setMaskedEmail(json.data?.maskedEmail || '');
        if (json.data?.simulationOtp) {
          setSimulationOtp(json.data.simulationOtp);
          setOtpCode(json.data.simulationOtp); // auto-fill demo OTP
        }
        setSuccessMessage(json.message);
      } else {
        setErrorMessage(json.message || 'Gagal memproses permintaan.');
      }
    } catch {
      setErrorMessage('Terjadi kendala jaringan.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('Kata sandi baru minimal 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          otpCode,
          newPassword,
        }),
      });
      const json = await res.json();

      if (json.success) {
        setSuccessMessage(json.message);
        setStep(2);
      } else {
        setErrorMessage(json.message || 'Gagal mengatur ulang kata sandi.');
      }
    } catch {
      setErrorMessage('Terjadi kendala jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-xl border border-white/20 rounded-xl p-7 sm:p-9 shadow-2xl space-y-6">
        {/* Header Branding */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-900 text-white flex items-center justify-center font-black text-sm shadow-md shadow-brand-900/20">
              D20
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-tight">SMAN 20 Tangerang</h2>
              <p className="text-[11px] text-slate-500">Pemulihan Akun Mandiri</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand-800 border border-brand-200">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            Keamanan A1.7
          </span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-brand-600" />
            Lupa Kata Sandi?
          </h1>
          <p className="text-xs text-slate-700 mt-1 font-medium">
            {step === 1
              ? 'Masukkan username, email resmi, NISN, atau NIP untuk menerima kode verifikasi OTP.'
              : `Masukkan kode OTP 6 digit yang dikirim ke ${maskedEmail || 'email Anda'} serta buat kata sandi baru.`}
          </p>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && step === 2 && !simulationOtp && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Mode Uji Coba Demo OTP Notification */}
        {simulationOtp && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <FlaskConical className="w-4 h-4 text-amber-600" />
              <span>Simulasi Mode Uji Coba Aktif</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Kode OTP simulasi Anda adalah: <strong className="font-mono text-sm bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-950 tracking-widest">{simulationOtp}</strong> (otomatis terisi).
            </p>
          </div>
        )}

        {/* FORM STEP 1: Request OTP */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Username / Email / NISN / NIP
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin atau email atau NISN"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-brand-900 via-brand-700 to-brand-600 shadow-md shadow-brand-900/15 hover:opacity-95 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white/90" />
                  <span>Mengecek Akun...</span>
                </>
              ) : (
                <>
                  <span>Kirim Kode Verifikasi OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* FORM STEP 2: Verify OTP & New Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Kode OTP (6 Digit)
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="202620"
                className="block w-full px-3.5 py-2.5 text-center text-lg tracking-widest font-mono font-black rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-brand-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="block w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-brand-900 via-brand-700 to-brand-600 shadow-md shadow-brand-900/15 hover:opacity-95 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white/90" />
                  <span>Memperbarui Kata Sandi...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Simpan Kata Sandi Baru</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-700 pt-1"
            >
              ← Ganti akun / kirim ulang OTP
            </button>
          </form>
        )}

        {/* Back to Login Link */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Masuk</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
