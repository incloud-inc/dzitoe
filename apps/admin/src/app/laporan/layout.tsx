import React from 'react';
import { DashboardShell } from '@/components/dashboard-shell';

export default function LaporanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
