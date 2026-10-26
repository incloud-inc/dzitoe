'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, ScanFace, Trophy, User, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const pathname = usePathname();
  const [role, setRole] = useState<string>('MURID');

  useEffect(() => {
    async function loadRole() {
      try {
        const res = await fetch('/api/auth/session');
        const json = await res.json();
        if (json.authenticated && json.user?.role) {
          setRole(json.user.role);
        }
      } catch {
        // Fallback default
      }
    }
    loadRole();
  }, [pathname]);

  if (pathname === '/login') {
    return null;
  }

  const handleTabPress = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(10);
    }
  };

  const isHome = pathname === '/';
  const isJadwal = pathname === '/jadwal';
  const isAbsen = pathname === '/absensi';
  const isEkstra = pathname.startsWith('/ekstra');
  const isProfil = pathname === '/profil';

  // Role: ORANG TUA
  if (role === 'ORANG_TUA') {
    return (
      <nav
        aria-label="Navigasi Orang Tua"
        className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md border-t border-slate-200/90 bg-white/95 shadow-nav backdrop-blur-xl supports-[backdrop-filter]:bg-white/90"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))' }}
      >
        <div className="relative flex items-center justify-around px-3 pt-1.5">
          <Link
            href="/"
            onClick={handleTabPress}
            className={cn(
              'flex min-h-[50px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-all active:scale-95',
              isHome ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            <Home className="h-5 w-5" />
            <span>Beranda</span>
          </Link>

          <Link
            href="/absensi"
            onClick={handleTabPress}
            className={cn(
              'flex min-h-[50px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-all active:scale-95',
              isAbsen ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            <ShieldCheck className="h-5 w-5" />
            <span>Presensi Anak</span>
          </Link>

          <Link
            href="/profil"
            onClick={handleTabPress}
            className={cn(
              'flex min-h-[50px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-all active:scale-95',
              isProfil ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            <User className="h-5 w-5" />
            <span>Profil Wali</span>
          </Link>
        </div>
      </nav>
    );
  }

  // Role: GURU / PTK / ADMIN
  if (role === 'GURU' || role === 'KEPALA_SEKOLAH' || role === 'TU' || role === 'ADMIN') {
    return (
      <nav
        aria-label="Navigasi Guru & Tendik"
        className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md border-t border-slate-200/90 bg-white/95 shadow-nav backdrop-blur-xl supports-[backdrop-filter]:bg-white/90"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))' }}
      >
        <div className="relative flex items-center justify-around px-3 pt-1.5">
          <Link
            href="/"
            onClick={handleTabPress}
            className={cn(
              'flex min-h-[50px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-all active:scale-95',
              isHome ? 'text-[#087f5b] font-bold' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/jadwal"
            onClick={handleTabPress}
            className={cn(
              'flex min-h-[50px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-all active:scale-95',
              isJadwal ? 'text-[#087f5b] font-bold' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            <Calendar className="h-5 w-5" />
            <span>Jadwal KBM</span>
          </Link>

          <Link
            href="/profil"
            onClick={handleTabPress}
            className={cn(
              'flex min-h-[50px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-all active:scale-95',
              isProfil ? 'text-[#087f5b] font-bold' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            <User className="h-5 w-5" />
            <span>Profil Pendidik</span>
          </Link>
        </div>
      </nav>
    );
  }

  // Default Role: MURID
  return (
    <nav
      aria-label="Navigasi utama mobile"
      className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md border-t border-slate-200/90 bg-white/95 shadow-nav backdrop-blur-xl supports-[backdrop-filter]:bg-white/90"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))' }}
    >
      <div className="relative flex items-center justify-around px-2 pt-1.5">
        {/* 1. Home */}
        <Link
          href="/"
          onClick={handleTabPress}
          className={cn(
            'flex min-h-[50px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-all active:scale-95',
            isHome ? 'text-[#087f5b] font-bold' : 'text-slate-400 hover:text-slate-600'
          )}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>

        {/* 2. Jadwal */}
        <Link
          href="/jadwal"
          onClick={handleTabPress}
          className={cn(
            'relative flex min-h-[50px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-all active:scale-95',
            isJadwal ? 'text-[#087f5b] font-bold' : 'text-slate-400 hover:text-slate-600'
          )}
        >
          <div className="relative">
            <Calendar className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#12b886] ring-2 ring-white" />
          </div>
          <span>Jadwal</span>
        </Link>

        {/* 3. Presensi */}
        <Link
          href="/absensi"
          onClick={handleTabPress}
          className={cn(
            'flex min-h-[50px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-all active:scale-95',
            isAbsen ? 'text-[#087f5b] font-bold' : 'text-slate-400 hover:text-slate-600'
          )}
        >
          <ScanFace className="h-5 w-5" />
          <span>Presensi</span>
        </Link>

        {/* 4. Ekstrakurikuler */}
        <Link
          href="/ekstra"
          onClick={handleTabPress}
          className={cn(
            'flex min-h-[50px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-all active:scale-95',
            isEkstra ? 'text-[#087f5b] font-bold' : 'text-slate-400 hover:text-slate-600'
          )}
        >
          <Trophy className="h-5 w-5" />
          <span>Ekstra</span>
        </Link>

        {/* 5. Profil */}
        <Link
          href="/profil"
          onClick={handleTabPress}
          className={cn(
            'flex min-h-[50px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-all active:scale-95',
            isProfil ? 'text-[#087f5b] font-bold' : 'text-slate-400 hover:text-slate-600'
          )}
        >
          <User className="h-5 w-5" />
          <span>Profil</span>
        </Link>
      </div>
    </nav>
  );
}
