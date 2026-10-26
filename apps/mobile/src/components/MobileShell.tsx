'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import BottomNav from './BottomNav';

export interface MobileShellProps {
  children: ReactNode;
}

export default function MobileShell({ children }: MobileShellProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <div className="min-h-screen w-full bg-slate-100/70">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-white shadow-xl ring-1 ring-slate-200">
        {/* Content container - natural document scrolling for mobile Android & iOS */}
        <div
          className={`w-full flex-1 ${
            !isLoginPage ? 'pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))]' : ''
          }`}
        >
          {children}
        </div>

        {/* Bottom Navigation hanya untuk halaman terotentikasi */}
        {!isLoginPage && <BottomNav />}
      </div>
    </div>
  );
}
