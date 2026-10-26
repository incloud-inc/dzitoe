'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  const deniedPath = searchParams.get('denied');
  const code = searchParams.get('code') || '403';

  return (
    <div className="mx-auto w-full max-w-lg text-center space-y-6">
      {/* Teks Tegas Besar (Tanpa ilustrasi kartun generik) */}
      <div className="space-y-2">
        <p className="font-mono text-7xl sm:text-8xl font-black tracking-tighter text-slate-900 dark:text-white select-none">
          {code}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Akses Tidak Diizinkan
        </h1>
      </div>

      {/* Pesan Ringkas & Informatif */}
      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
        {deniedPath ? (
          <>
            Akun Anda{role ? ` (${role})` : ''} tidak memiliki izin hak akses untuk membuka{' '}
            <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs font-mono text-slate-800 dark:bg-slate-800 dark:text-slate-200">
              {deniedPath}
            </code>.
          </>
        ) : (
          'Akun Anda tidak memiliki hak akses yang diperlukan untuk membuka halaman ini. Hubungi administrator bila Anda memerlukan akses.'
        )}
      </p>

      {/* Satu CTA Primary Tunggal: Kembali */}
      <div className="pt-2 flex justify-center">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-blue-600 active:scale-95 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <Suspense
        fallback={
          <div className="text-center text-sm text-slate-500">
            Memeriksa hak akses...
          </div>
        }
      >
        <UnauthorizedContent />
      </Suspense>
    </main>
  );
}
