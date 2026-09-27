import type { ReactNode } from 'react';

export interface MobileShellProps {
  children: ReactNode;
}

export default function MobileShell({ children }: MobileShellProps) {
  return (
    <div className="flex min-h-dvh w-full justify-center bg-slate-900/90 sm:py-6">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-x-hidden bg-slate-50 shadow-[0_0_70px_-20px_rgba(15,23,42,0.65)] ring-1 ring-white/10 sm:rounded-[36px] sm:min-h-[844px] sm:max-h-[920px] sm:border-[8px] sm:border-slate-800">
        {/* Dynamic Island / Speaker notch hint for desktop preview */}
        <div className="hidden sm:flex justify-center pt-2">
          <div className="h-4 w-28 rounded-full bg-slate-800/90" />
        </div>

        {/* Content container */}
        <div className="flex-1 overflow-y-auto overscroll-y-contain no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
