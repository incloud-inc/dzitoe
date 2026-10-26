"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { UserRole } from '@dzitoe/auth/rbac';

export interface CurrentUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
}

interface AuthContextType {
  user: CurrentUser | null;
  role: UserRole;
  isLoading: boolean;
  roleLabel: string;
  roleBadgeColor: string;
  roleDesc: string;
}

const ROLE_METADATA: Record<UserRole, { label: string; badgeColor: string; desc: string }> = {
  ADMIN: {
    label: 'Super Admin',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    desc: 'Hak akses penuh sistem & konfigurasi',
  },
  KEPALA_SEKOLAH: {
    label: 'Kepala Sekolah',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    desc: 'Laporan eksekutif, verifikasi & monitoring',
  },
  TU: {
    label: 'Staf Tata Usaha',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    desc: 'Administrasi kesiswaan, mutasi & kenaikan kelas',
  },
  GURU: {
    label: 'Guru Mapel / Wali',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    desc: 'Fasilitasi belajar, presensi & asesmen',
  },
  GURU_BK: {
    label: 'Guru BK / Konselor',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    desc: 'Layanan konseling restitusi & kesehatan murid',
  },
  PETUGAS_PPID: {
    label: 'Petugas PPID',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    desc: 'Keterbukaan informasi & data publik',
  },
  MURID: {
    label: 'Murid (Siswa)',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    desc: 'Portal murid mobile',
  },
  ORANG_TUA: {
    label: 'Orang Tua / Wali',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    desc: 'Portal wali murid mobile',
  },
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'ADMIN',
  isLoading: true,
  roleLabel: 'Super Admin',
  roleBadgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  roleDesc: 'Hak akses penuh sistem & konfigurasi',
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        const res = await fetch('/api/auth/session', { cache: 'no-store' });
        const json = await res.json();
        if (isMounted && json.authenticated && json.user) {
          setUser(json.user);
        }
      } catch (err) {
        console.warn('[AuthProvider] Failed to fetch session', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const role: UserRole = user?.role || 'ADMIN';
  const meta = ROLE_METADATA[role] || {
    label: 'Super Admin',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    desc: 'Hak akses penuh sistem & konfigurasi',
  };

  const value = useMemo(
    () => ({
      user,
      role,
      isLoading,
      roleLabel: meta.label,
      roleBadgeColor: meta.badgeColor,
      roleDesc: meta.desc,
    }),
    [user, role, isLoading, meta]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
