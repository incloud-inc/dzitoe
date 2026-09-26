import type { ReactNode } from 'react';

export default function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full justify-center bg-slate-200">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col bg-slate-50 shadow-[0_0_70px_-24px_rgba(15,23,42,0.55)] ring-1 ring-slate-900/5">
        {children}
      </div>
    </div>
  );
}
