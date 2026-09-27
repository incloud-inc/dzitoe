'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CreditCard, Home, LayoutGrid, ScanFace, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/absensi', label: 'Absensi', icon: ScanFace },
  { href: '/tagihan', label: 'Tagihan', icon: CreditCard },
  { href: '/profil', label: 'Profil', icon: User },
  { href: '/lainnya', label: 'Lainnya', icon: LayoutGrid },
];

export default function BottomNav() {
  const pathname = usePathname();

  const handleTabPress = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(10);
    }
  };

  return (
    <nav
      aria-label="Navigasi utama mobile"
      className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md border-t border-slate-200/90 bg-white/90 shadow-nav backdrop-blur-xl supports-[backdrop-filter]:bg-white/85"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))' }}
    >
      <ul className="grid grid-cols-5 px-1 pt-1.5">
        {NAV_ITEMS.map((item) => {
          const aktif =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={handleTabPress}
                aria-current={aktif ? 'page' : undefined}
                className={cn(
                  'group flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium transition-all duration-150',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 active:scale-95',
                  aktif ? 'text-brand-700 font-semibold' : 'text-slate-500 hover:text-slate-800',
                )}
              >
                <span
                  className={cn(
                    'grid h-8 w-13 place-items-center rounded-full transition-all duration-200',
                    aktif
                      ? 'bg-brand-50 text-brand-700 shadow-xs ring-1 ring-brand-200/60'
                      : 'bg-transparent text-slate-500 group-hover:bg-slate-100',
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-transform duration-200',
                      aktif ? 'scale-110 text-brand-700' : 'text-slate-500',
                    )}
                    strokeWidth={aktif ? 2.4 : 2}
                    aria-hidden="true"
                  />
                </span>
                <span className="leading-none text-[11px] tracking-tight">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
