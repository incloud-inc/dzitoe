"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen min-w-0 flex-col lg:pl-[272px]">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>

        <footer className="border-t border-slate-200 px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-slate-500">
            DZITOE · SMAN 20 Kabupaten Tangerang — istilah resmi{" "}
            <strong className="font-semibold text-slate-600">
              Permendikdasmen 2026
            </strong>
            . Port admin:{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-600">
              :3000
            </code>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default DashboardShell;
