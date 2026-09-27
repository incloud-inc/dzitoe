'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, QrCode, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const pathname = usePathname();

  const handleTabPress = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(10);
    }
  };

  const isHome = pathname === '/';
  const isJadwal = pathname === '/jadwal';
  const isPesan = pathname === '/pesan';
  const isProfil = pathname === '/profil';

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
            isHome ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          )}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>

        {/* 2. Jadwal (dengan dot notifikasi) */}
        <Link
          href="/absensi"
          onClick={handleTabPress}
          className={cn(
            'relative flex min-h-[50px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-all active:scale-95',
            isJadwal ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          )}
        >
          <div className="relative">
            <Calendar className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </div>
          <span>Jadwal</span>
        </Link>

        {/* 3. Scan QR / Tap Absen (Menonjol di tengah) */}
        <div className="relative -mt-6 flex flex-1 justify-center">
          <Link
            href="/absensi"
            onClick={handleTabPress}
            className="flex h-13 w-13 flex-col items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/35 transition-transform active:scale-90 hover:brightness-110 ring-4 ring-white"
            title="Scan QR / Tap Absen"
          >
            <QrCode className="h-6 w-6 stroke-[2.2]" />
          </Link>
        </div>

        {/* 4. Pesan */}
        <Link
          href="/lainnya"
          onClick={handleTabPress}
          className={cn(
            'flex min-h-[50px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-all active:scale-95',
            isPesan ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          )}
        >
          <MessageSquare className="h-5 w-5" />
          <span>Pesan</span>
        </Link>

        {/* 5. Profil (State Aktif) */}
        <Link
          href="/profil"
          onClick={handleTabPress}
          className={cn(
            'flex min-h-[50px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-all active:scale-95',
            isProfil || isHome ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          )}
        >
          <User className="h-5 w-5" />
          <span>Profil</span>
        </Link>
      </div>
    </nav>
  );
}
