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
    <div className="flex min-h-dvh w-full justify-center bg-slate-100/70">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-x-hidden bg-white shadow-xl ring-1 ring-slate-200">
        {/* Content container */}
        <div
          className={`flex flex-col flex-1 overflow-y-auto overscroll-y-contain no-scrollbar ${
            !isLoginPage ? 'pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))]' : ''
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
