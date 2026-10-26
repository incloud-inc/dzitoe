"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { ActivityPanel } from "@/components/activity-panel";
import { AuthProvider } from "@/lib/auth-context";

export interface DashboardShellProps {
  children: ReactNode;
}

function DashboardShellInner({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Sidebar Kiri (Kolom 1) */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Kontainer Utama & Panel Kanan */}
      <div className="flex min-h-screen min-w-0 flex-col lg:pl-[272px]">
        {/* Topbar dengan toggle Activity Panel */}
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          onToggleActivityPanel={() => setActivityOpen((prev) => !prev)}
          activityPanelOpen={activityOpen}
        />

        {/* 2. Grid Area: Konten Utama */}
        <div className="flex flex-1 min-w-0">
          {/* Konten Utama */}
          <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1240px]">{children}</div>
          </main>
        </div>

        {/* Drawer Panel Kanan (Panel Terpadu) yang dapat di-show/hide lewat tombol lonceng */}
        {activityOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
              onClick={() => setActivityOpen(false)}
              aria-hidden="true"
            />
            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 z-50 flex max-w-full">
              <div className="w-screen max-w-sm sm:max-w-md bg-white shadow-2xl transition-transform ease-out ring-1 ring-slate-900/10">
                <ActivityPanel onClose={() => setActivityOpen(false)} />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <AuthProvider>
      <DashboardShellInner>{children}</DashboardShellInner>
    </AuthProvider>
  );
}

export default DashboardShell;
