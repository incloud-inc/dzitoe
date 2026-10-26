// ==============================================================================
// DZITOE — Granular Role-Based Access Control (RBAC) Engine (@dzitoe/auth)
// Task: Modul A1.6 — Hak Akses Granular per Role
// Permendikdasmen No. 1–6 Tahun 2026 Compliant
// ==============================================================================

import type { UserRole } from './types';
export type { UserRole };

export type Permission =
  // Dashboard & Tata Kelola
  | 'dashboard:view'
  | 'executive:report'

  // Manajemen Murid & Kesiswaan
  | 'murid:read'
  | 'murid:write'
  | 'murid:delete'
  | 'murid:mutasi'
  | 'orangtua:read'
  | 'orangtua:write'
  | 'kenaikan-kelas:read'
  | 'kenaikan-kelas:write'
  | 'alumni:read'
  | 'alumni:write'

  // Tenaga Pendidik & Tendik
  | 'guru:read'
  | 'guru:write'
  | 'guru:delete'

  // Jadwal & KBM
  | 'jadwal:read'
  | 'jadwal:write'

  // Presensi & Geofencing
  | 'presensi:read'
  | 'presensi:input'
  | 'presensi:verify'
  | 'presensi:export'
  | 'presensi:antifake'

  // Layanan Murid (BK & UKS & Prestasi)
  | 'bk:read'
  | 'bk:write'
  | 'kesehatan:read'
  | 'kesehatan:write'
  | 'kesehatan:delete'
  | 'prestasi:read'
  | 'prestasi:write'

  // Keterbukaan Informasi Publik (PPID)
  | 'ppid:read'
  | 'ppid:write'

  // Ekstrakurikuler
  | 'ekskul:read'
  | 'ekskul:write'
  | 'ekskul:presensi'

  // Pengguna & Keamanan
  | 'pengguna:read'
  | 'pengguna:write'
  | 'pengguna:reset'
  | 'session:manage'
  | 'audit:read'

  // Pengaturan Sekolah
  | 'pengaturan:read'
  | 'pengaturan:write';

/**
 * Matriks Hak Akses Granular per Role
 */
export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  ADMIN: [
    'dashboard:view',
    'executive:report',
    'murid:read',
    'murid:write',
    'murid:delete',
    'murid:mutasi',
    'orangtua:read',
    'orangtua:write',
    'kenaikan-kelas:read',
    'kenaikan-kelas:write',
    'alumni:read',
    'alumni:write',
    'guru:read',
    'guru:write',
    'guru:delete',
    'jadwal:read',
    'jadwal:write',
    'presensi:read',
    'presensi:input',
    'presensi:verify',
    'presensi:export',
    'presensi:antifake',
    'bk:read',
    'bk:write',
    'kesehatan:read',
    'kesehatan:write',
    'kesehatan:delete',
    'prestasi:read',
    'prestasi:write',
    'ppid:read',
    'ppid:write',
    'ekskul:read',
    'ekskul:write',
    'ekskul:presensi',
    'pengguna:read',
    'pengguna:write',
    'pengguna:reset',
    'session:manage',
    'audit:read',
    'pengaturan:read',
    'pengaturan:write',
  ],

  KEPALA_SEKOLAH: [
    'dashboard:view',
    'executive:report',
    'murid:read',
    'orangtua:read',
    'kenaikan-kelas:read',
    'alumni:read',
    'guru:read',
    'jadwal:read',
    'presensi:read',
    'presensi:verify',
    'presensi:export',
    'presensi:antifake',
    'bk:read',
    'kesehatan:read',
    'prestasi:read',
    'ppid:read',
    'ekskul:read',
    'audit:read',
  ],

  TU: [
    'dashboard:view',
    'murid:read',
    'murid:write',
    'murid:mutasi',
    'orangtua:read',
    'orangtua:write',
    'kenaikan-kelas:read',
    'kenaikan-kelas:write',
    'alumni:read',
    'alumni:write',
    'guru:read',
    'guru:write',
    'jadwal:read',
    'jadwal:write',
    'presensi:read',
    'presensi:export',
    'kesehatan:read',
    'kesehatan:write',
    'prestasi:read',
    'prestasi:write',
    'ppid:read',
    'ekskul:read',
    'pengguna:read',
    'pengaturan:read',
  ],

  GURU: [
    'dashboard:view',
    'murid:read',
    'orangtua:read',
    'guru:read',
    'jadwal:read',
    'jadwal:write',
    'presensi:read',
    'presensi:input',
    'prestasi:read',
    'prestasi:write',
    'ekskul:read',
    'ekskul:presensi',
  ],

  GURU_BK: [
    'dashboard:view',
    'murid:read',
    'orangtua:read',
    'alumni:read',
    'guru:read',
    'presensi:read',
    'presensi:export',
    'bk:read',
    'bk:write',
    'kesehatan:read',
    'kesehatan:write',
    'prestasi:read',
    'prestasi:write',
  ],

  PETUGAS_PPID: [
    'dashboard:view',
    'murid:read',
    'guru:read',
    'alumni:read',
    'prestasi:read',
    'ppid:read',
    'ppid:write',
    'ekskul:read',
  ],

  MURID: [
    // Portal Siswa Mobile
    'jadwal:read',
    'presensi:read',
    'presensi:input',
    'ekskul:read',
    'kesehatan:read',
    'prestasi:read',
    'ppid:read',
  ],

  ORANG_TUA: [
    // Portal Orang Tua Mobile
    'presensi:read',
    'jadwal:read',
    'kesehatan:read',
    'prestasi:read',
    'ppid:read',
  ],
};

/**
 * Pemetaan Route Path ke Role yang diizinkan (Route Guard)
 * Disusun secara spesifik agar subpath seperti /murid/kenaikan-kelas tidak tertimpa /murid
 */
export const ROUTE_ACCESS_MAP: Record<string, readonly UserRole[]> = {
  '/': ['ADMIN', 'KEPALA_SEKOLAH', 'TU', 'GURU', 'GURU_BK', 'PETUGAS_PPID'],
  '/pengguna': ['ADMIN', 'KEPALA_SEKOLAH'],
  '/pengaturan': ['ADMIN'],
  '/murid/kenaikan-kelas': ['ADMIN', 'KEPALA_SEKOLAH', 'TU'],
  '/murid/mutasi': ['ADMIN', 'KEPALA_SEKOLAH', 'TU'],
  '/murid': ['ADMIN', 'KEPALA_SEKOLAH', 'TU', 'GURU', 'GURU_BK'],
  '/orangtua': ['ADMIN', 'KEPALA_SEKOLAH', 'TU', 'GURU', 'GURU_BK'],
  '/guru': ['ADMIN', 'KEPALA_SEKOLAH', 'TU'],
  '/alumni': ['ADMIN', 'KEPALA_SEKOLAH', 'TU', 'GURU_BK', 'PETUGAS_PPID'],
  '/prestasi': ['ADMIN', 'KEPALA_SEKOLAH', 'TU', 'GURU', 'GURU_BK'],
  '/ppid': ['ADMIN', 'KEPALA_SEKOLAH', 'PETUGAS_PPID', 'TU'],
  '/jadwal': ['ADMIN', 'KEPALA_SEKOLAH', 'TU', 'GURU'],
  '/fasilitasi-belajar': ['ADMIN', 'KEPALA_SEKOLAH', 'TU', 'GURU'],
  '/asesmen': ['ADMIN', 'KEPALA_SEKOLAH', 'TU', 'GURU'],
  '/perkembangan-murid': ['ADMIN', 'KEPALA_SEKOLAH', 'TU', 'GURU', 'GURU_BK'],
  '/bk': ['ADMIN', 'KEPALA_SEKOLAH', 'GURU_BK'],
  '/kesehatan': ['ADMIN', 'KEPALA_SEKOLAH', 'TU', 'GURU', 'GURU_BK'],
  '/presensi': ['ADMIN', 'KEPALA_SEKOLAH', 'TU', 'GURU', 'GURU_BK'],
  '/ekskul': ['ADMIN', 'KEPALA_SEKOLAH', 'TU', 'GURU', 'PETUGAS_PPID'],
};

/**
 * Cek apakah role tertentu memiliki izin akses
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

/**
 * Cek apakah role tertentu boleh mengakses path halaman
 */
export function canAccessRoute(role: UserRole, pathname: string): boolean {
  // Rute publik terbuka bebas untuk seluruh pengguna & peran
  if (pathname.startsWith('/publik')) {
    return true;
  }

  // Portal admin terlarang untuk MURID & ORANG_TUA
  if (role === 'MURID' || role === 'ORANG_TUA') {
    return false;
  }

  // Admin memiliki hak akses penuh ke seluruh rute
  if (role === 'ADMIN') {
    return true;
  }

  const cleanPath = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  // Urutkan rute dari yang paling spesifik (path terpanjang) ke yang lebih umum
  const sortedRoutes = Object.entries(ROUTE_ACCESS_MAP).sort(
    ([a], [b]) => b.length - a.length
  );

  for (const [route, allowedRoles] of sortedRoutes) {
    if (cleanPath === route || (route !== '/' && cleanPath.startsWith(`${route}/`))) {
      return allowedRoles.includes(role);
    }
  }

  // Default izinkan untuk dashboard umum
  return true;
}
