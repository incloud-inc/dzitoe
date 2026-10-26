// ==============================================================================
// DZITOE — Security Audit Log Store (@dzitoe/auth)
// Task: Modul A1.9 — Audit Log Login & Keamanan Akun
// Permendikdasmen No. 1–6 Tahun 2026 Compliant
// ==============================================================================

import type { UserRole } from './types';
import { parseDeviceFromUserAgent } from './session-store';

export type AuditAction =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'PASSWORD_RESET_REQUEST'
  | 'PASSWORD_RESET_SUCCESS'
  | 'SESSION_REVOKED'
  | 'ACCESS_DENIED'
  | 'SYSTEM_CONFIG_UPDATED'
  | 'BULK_DATA_IMPORTED';

export interface SecurityAuditLog {
  id: string;
  userId?: string | null;
  userName: string;
  userRole: UserRole | 'UNKNOWN';
  identifier: string; // username / email / NISN
  action: AuditAction;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  ipAddress: string;
  userAgent: string;
  browser: string;
  os: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  location: string;
  details: string;
  timestamp: string;
}

const globalStore = globalThis as unknown as {
  __DZITOE_AUDIT_LOGS__?: SecurityAuditLog[];
};

// Seed 8 Audit Log Realistis SMAN 20
const SEED_AUDIT_LOGS: SecurityAuditLog[] = [
  {
    id: 'aud-001',
    userId: 'demo-admin-1',
    userName: 'Administrator SMAN 20',
    userRole: 'ADMIN',
    identifier: 'admin',
    action: 'LOGIN_SUCCESS',
    status: 'SUCCESS',
    ipAddress: '103.145.22.180',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
    browser: 'Google Chrome',
    os: 'Windows 11',
    deviceType: 'desktop',
    location: 'Pakuhaji, Kab. Tangerang',
    details: 'Autentikasi sesi admin berhasil dari IP internal sekolah',
    timestamp: '2026-09-28 07:10:22 WIB',
  },
  {
    id: 'aud-002',
    userId: 'demo-guru-1',
    userName: 'Drs. Budi Santoso, M.Pd',
    userRole: 'GURU',
    identifier: 'budi.santoso@sman20kabtangerang.sch.id',
    action: 'LOGIN_SUCCESS',
    status: 'SUCCESS',
    ipAddress: '36.85.12.98',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S918B) Chrome/126.0 Mobile',
    browser: 'Chrome Mobile 126',
    os: 'Android 14',
    deviceType: 'mobile',
    location: 'Sepatan, Kab. Tangerang',
    details: 'Login guru via perangkat smartphone Android',
    timestamp: '2026-09-28 06:45:10 WIB',
  },
  {
    id: 'aud-003',
    userId: null,
    userName: 'Tidak Dikenal (Percobaan Ilegal)',
    userRole: 'UNKNOWN',
    identifier: 'operator_hacker',
    action: 'LOGIN_FAILED',
    status: 'FAILED',
    ipAddress: '182.253.11.45',
    userAgent: 'python-requests/2.31.0',
    browser: 'Python Script (Bot)',
    os: 'Linux',
    deviceType: 'desktop',
    location: 'Jakarta Barat',
    details: 'Upaya brute-force login gagal; kredensial tidak ditemukan',
    timestamp: '2026-09-28 04:12:05 WIB',
  },
  {
    id: 'aud-004',
    userId: 'demo-kepsek-1',
    userName: 'Dr. H. Subagyo, M.M.',
    userRole: 'KEPALA_SEKOLAH',
    identifier: 'kepsek',
    action: 'LOGIN_SUCCESS',
    status: 'SUCCESS',
    ipAddress: '103.145.22.180',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/127.0',
    browser: 'Google Chrome',
    os: 'macOS',
    deviceType: 'desktop',
    location: 'Ruang Kepala Sekolah',
    details: 'Login eksekutif kepala sekolah untuk verifikasi persetujuan izin',
    timestamp: '2026-09-27 08:30:11 WIB',
  },
  {
    id: 'aud-005',
    userId: 'demo-murid-1',
    userName: 'Ahmad Fauzi (XII IPA 1)',
    userRole: 'MURID',
    identifier: '0067891234',
    action: 'PASSWORD_RESET_SUCCESS',
    status: 'SUCCESS',
    ipAddress: '114.124.200.75',
    userAgent: 'Mozilla/5.0 (Linux; Android 13) Mobile Safari',
    browser: 'Chrome Mobile',
    os: 'Android 13',
    deviceType: 'mobile',
    location: 'Pakuhaji, Kab. Tangerang',
    details: 'Reset kata sandi mandiri berhasil diselesaikan via verifikasi OTP',
    timestamp: '2026-09-27 19:15:44 WIB',
  },
  {
    id: 'aud-006',
    userId: 'demo-admin-1',
    userName: 'Administrator SMAN 20',
    userRole: 'ADMIN',
    identifier: 'admin',
    action: 'SESSION_REVOKED',
    status: 'WARNING',
    ipAddress: '103.145.22.180',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
    browser: 'Google Chrome',
    os: 'Windows 11',
    deviceType: 'desktop',
    location: 'Pakuhaji, Kab. Tangerang',
    details: 'Admin mencabut sesi perangkat tidak aktif (sess-002 iPhone)',
    timestamp: '2026-09-27 14:02:18 WIB',
  },
  {
    id: 'aud-007',
    userId: 'usr-tu-1',
    userName: 'Siti Rahmawati, S.Kom (TU)',
    userRole: 'TU',
    identifier: 'siti.tu',
    action: 'LOGOUT',
    status: 'SUCCESS',
    ipAddress: '103.145.22.180',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0',
    browser: 'Firefox 129',
    os: 'Windows 10',
    deviceType: 'desktop',
    location: 'Ruang TU SMAN 20',
    details: 'Sesi ditutup secara normal (Logout manual)',
    timestamp: '2026-09-26 16:05:00 WIB',
  },
  {
    id: 'aud-008',
    userId: 'demo-murid-1',
    userName: 'Ahmad Fauzi',
    userRole: 'MURID',
    identifier: 'ahmad.fauzi',
    action: 'ACCESS_DENIED',
    status: 'WARNING',
    ipAddress: '114.124.200.75',
    userAgent: 'Mozilla/5.0 (Linux; Android 13)',
    browser: 'Chrome Mobile',
    os: 'Android 13',
    deviceType: 'mobile',
    location: 'Pakuhaji, Kab. Tangerang',
    details: 'Akun murid mencoba mengakses halaman Web Admin (/pengguna) - Otomatis diblokir oleh Route Guard',
    timestamp: '2026-09-26 10:20:15 WIB',
  },
];

if (!globalStore.__DZITOE_AUDIT_LOGS__) {
  globalStore.__DZITOE_AUDIT_LOGS__ = [...SEED_AUDIT_LOGS];
}

function findMonorepoRoot(startDir: string, fs: any, path: any): string {
  let curr = path.resolve(startDir);
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(curr, 'pnpm-workspace.yaml'))) {
      return curr;
    }
    const parent = path.dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }
  return startDir;
}

function getFileIo() {
  try {
    if (typeof process !== 'undefined' && process.release?.name === 'node' && process.env.NEXT_RUNTIME !== 'edge') {
      // eslint-disable-next-line no-eval
      const nodeRequire = eval('require');
      const fs = nodeRequire('fs');
      const path = nodeRequire('path');
      const monorepoRoot = findMonorepoRoot(process.cwd(), fs, path);
      const dataDir = path.join(monorepoRoot, 'packages', 'db', 'data');
      const dataFile = path.join(dataDir, 'runtime-audit-logs.json');
      return { fs, dataDir, dataFile };
    }
  } catch {
    // Edge runtime fallback
  }
  return null;
}

function ensureFile(): void {
  const io = getFileIo();
  if (!io) return;
  try {
    if (!io.fs.existsSync(io.dataDir)) {
      io.fs.mkdirSync(io.dataDir, { recursive: true });
    }
    if (!io.fs.existsSync(io.dataFile)) {
      io.fs.writeFileSync(io.dataFile, JSON.stringify(SEED_AUDIT_LOGS, null, 2), 'utf-8');
    }
  } catch {
    // non-blocking
  }
}

export function getAllAuditLogs(): SecurityAuditLog[] {
  ensureFile();
  const io = getFileIo();
  if (io) {
    try {
      if (io.fs.existsSync(io.dataFile)) {
        const content = io.fs.readFileSync(io.dataFile, 'utf-8');
        const parsed = JSON.parse(content) as SecurityAuditLog[];
        globalStore.__DZITOE_AUDIT_LOGS__ = parsed;
        return parsed;
      }
    } catch {
      // fallback
    }
  }
  return globalStore.__DZITOE_AUDIT_LOGS__ || SEED_AUDIT_LOGS;
}

function saveAuditLogs(logs: SecurityAuditLog[]): void {
  globalStore.__DZITOE_AUDIT_LOGS__ = logs;
  const io = getFileIo();
  if (io) {
    try {
      io.fs.writeFileSync(io.dataFile, JSON.stringify(logs, null, 2), 'utf-8');
    } catch {
      // non-blocking
    }
  }
}

export function recordAuditLog(params: {
  userId?: string | null;
  userName: string;
  userRole?: UserRole | 'UNKNOWN';
  identifier: string;
  action: AuditAction;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  ipAddress?: string;
  userAgent?: string;
  details: string;
}): SecurityAuditLog {
  const logs = getAllAuditLogs();
  const ua = params.userAgent || 'Mozilla/5.0';
  const { browser, os, deviceType } = parseDeviceFromUserAgent(ua);

  const now = new Date();
  const timestampStr = `${now.toISOString().replace('T', ' ').slice(0, 19)} WIB`;

  const newLog: SecurityAuditLog = {
    id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: params.userId || null,
    userName: params.userName,
    userRole: params.userRole || 'UNKNOWN',
    identifier: params.identifier,
    action: params.action,
    status: params.status,
    ipAddress: params.ipAddress || '127.0.0.1',
    userAgent: ua,
    browser,
    os,
    deviceType,
    location: 'Pakuhaji, Kab. Tangerang',
    details: params.details,
    timestamp: timestampStr,
  };

  const updated = [newLog, ...logs];
  saveAuditLogs(updated);
  return newLog;
}
