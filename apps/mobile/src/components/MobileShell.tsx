'use client';

import type { ReactNode } from 'react';
import { Wifi, Battery, Signal, Sparkles } from 'lucide-react';

export interface MobileShellProps {
  children: ReactNode;
}

export default function MobileShell({ children }: MobileShellProps) {
  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-slate-950 font-sans selection:bg-brand-500/20">
      {/* LAYER 1: Ambient Background Mesh */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-emerald-950/40"
      />
      {/* Animated glowing ambient orbs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-emerald-500/15 blur-[120px] animate-float" />
        <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-indigo-500/15 blur-[140px] animate-float [animation-delay:4s]" />
        <div className="absolute -bottom-32 left-1/4 h-[450px] w-[450px] rounded-full bg-teal-500/10 blur-[120px] animate-float [animation-delay:8s]" />
      </div>

      {/* Desktop Preview Header Badge */}
      <aside aria-label="DZITOE PWA Preview" className="hidden sm:flex items-center justify-between px-8 pt-4 pb-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">DZITOE Mobile PWA</span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">
            SMAN 20 Kab. Tangerang
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-brand-400" />
          <span>Modern Web Guidance · Radix UI · Port 3001</span>
        </div>
      </aside>

      {/* LAYER 2: Device Frame */}
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-slate-50 text-slate-900 shadow-2xl transition-all sm:my-3 sm:min-h-[880px] sm:max-h-[940px] sm:rounded-[2.75rem] sm:border sm:border-white/20 sm:shadow-[0_25px_80px_-20px_rgba(0,0,0,0.6)]">
        {/* Dynamic Island & Native Status Bar for desktop preview */}
        <div className="hidden sm:flex items-center justify-between px-7 pt-3 pb-1 text-slate-900 text-xs font-semibold select-none z-50">
          <span className="tracking-tight">07:30</span>
          {/* Dynamic Island pill */}
          <div className="h-4.5 w-24 rounded-full bg-slate-900/90 shadow-sm flex items-center justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80 mr-1.5 animate-pulse" />
            <span className="h-2 w-2 rounded-full bg-slate-800" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-800">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <Battery className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* LAYER 3: App Content Container */}
        <div className="relative flex-1 overflow-y-auto overscroll-y-contain no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
