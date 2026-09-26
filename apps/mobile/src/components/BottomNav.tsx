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
  { href: '/profil', label: 'Profil', icon: User },
  { href: '/tagihan', label: 'Tagihan', icon: CreditCard },
  { href: '/lainnya', label: 'Lainnya', icon: LayoutGrid },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md border-t border-slate-200 bg-white/95 shadow-nav backdrop-blur-md supports-[backdrop-filter]:bg-white/80"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <ul className="grid grid-cols-5">
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
                aria-current={aktif ? 'page' : undefined}
                className={cn(
                  'group flex flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-medium transition-colors',
                  'focus:outline-none focus-visible:bg-slate-100',
                  aktif ? 'text-brand-700' : 'text-slate-500 hover:text-slate-800',
                )}
              >
                <span
                  className={cn(
                    'grid h-8 w-14 place-items-center rounded-full transition-colors',
                    aktif ? 'bg-brand-50' : 'bg-transparent',
                  )}
                >
                  <Icon
                    className={cn(
                      'h-[22px] w-[22px]',
                      aktif ? 'text-brand-700' : 'text-slate-500',
                    )}
                    strokeWidth={aktif ? 2.4 : 2}
                    aria-hidden
                  />
                </span>
                <span className="leading-none">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
