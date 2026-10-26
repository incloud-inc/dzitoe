// ==============================================================================
// DZITOE — Session Management Store (@dzitoe/auth)
// Task: Modul A1.8 — Manajemen Sesi & Revoke Sesi Aktif
// ==============================================================================

import type { UserRole } from './types';

export interface ManagedSession {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  tokenMasked: string;
  ipAddress: string;
  userAgent: string;
  browser: string;
  os: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  location: string;
  lastActive: string;
  createdAt: string;
  expiresAt: string;
  isCurrent?: boolean;
  isRevoked: boolean;
}

// Global runtime session cache
const globalStore = globalThis as unknown as {
  __DZITOE_SESSIONS__?: ManagedSession[];
};

// Seed 5 Sesi Awal Realistis (Device Browser SMAN 20)
const SEED_SESSIONS: ManagedSession[] = [
  {
    id: 'sess-001',
    userId: 'demo-admin-1',
    userName: 'Administrator SMAN 20',
    userRole: 'ADMIN',
    tokenMasked: 'eyJhbGciOiJIUzI1NiI...w9fQ',
    ipAddress: '103.145.22.180',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36',
    browser: 'Chrome 128',
    os: 'Windows 11',
    deviceType: 'desktop',
    location: 'Pakuhaji, Kab. Tangerang',
    lastActive: 'Baru saja',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isCurrent: true,
    isRevoked: false,
  },
  {
    id: 'sess-002',
    userId: 'demo-admin-1',
    userName: 'Administrator SMAN 20',
    userRole: 'ADMIN',
    tokenMasked: 'eyJhbGciOiJIUzI1NiI...7b2A',
    ipAddress: '180.252.164.12',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
    browser: 'Mobile Safari',
    os: 'iOS 17.5',
    deviceType: 'mobile',
    location: 'Tangerang Kota',
    lastActive: '2 jam yang lalu',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    isCurrent: false,
    isRevoked: false,
  },
  {
    id: 'sess-003',
    userId: 'demo-guru-1',
    userName: 'Drs. Budi Santoso, M.Pd',
    userRole: 'GURU',
    tokenMasked: 'eyJhbGciOiJIUzI1NiI...3c8D',
    ipAddress: '36.85.12.98',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 Chrome/126.0.0.0 Mobile Safari/537.36',
    browser: 'Chrome Mobile 126',
    os: 'Android 14',
    deviceType: 'mobile',
    location: 'Sepatan, Kab. Tangerang',
    lastActive: '15 menit yang lalu',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    isCurrent: false,
    isRevoked: false,
  },
  {
    id: 'sess-004',
    userId: 'demo-kepsek-1',
    userName: 'Dr. H. Subagyo, M.M.',
    userRole: 'KEPALA_SEKOLAH',
    tokenMasked: 'eyJhbGciOiJIUzI1NiI...91eE',
    ipAddress: '103.145.22.180',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/127.0.0.0 Safari/537.36',
    browser: 'Chrome 127',
    os: 'macOS Sonoma',
    deviceType: 'desktop',
    location: 'Pakuhaji, Kab. Tangerang',
    lastActive: '45 menit yang lalu',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    isCurrent: false,
    isRevoked: false,
  },
  {
    id: 'sess-005',
    userId: 'usr-tu-1',
    userName: 'Siti Rahmawati, S.Kom (TU)',
    userRole: 'TU',
    tokenMasked: 'eyJhbGciOiJIUzI1NiI...12aB',
    ipAddress: '103.145.22.180',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0',
    browser: 'Firefox 129',
    os: 'Windows 10',
    deviceType: 'desktop',
    location: 'Ruang TU SMAN 20',
    lastActive: '5 menit yang lalu',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isCurrent: false,
    isRevoked: false,
  },
];

if (!globalStore.__DZITOE_SESSIONS__) {
  globalStore.__DZITOE_SESSIONS__ = [...SEED_SESSIONS];
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
      const dataFile = path.join(dataDir, 'runtime-sessions.json');
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
      io.fs.writeFileSync(io.dataFile, JSON.stringify(SEED_SESSIONS, null, 2), 'utf-8');
    }
  } catch {
    // non-blocking
  }
}

export function getAllSessions(): ManagedSession[] {
  ensureFile();
  const io = getFileIo();
  if (io) {
    try {
      if (io.fs.existsSync(io.dataFile)) {
        const content = io.fs.readFileSync(io.dataFile, 'utf-8');
        const parsed = JSON.parse(content) as ManagedSession[];
        globalStore.__DZITOE_SESSIONS__ = parsed;
        return parsed;
      }
    } catch {
      // fallback to memory
    }
  }
  return globalStore.__DZITOE_SESSIONS__ || SEED_SESSIONS;
}

export function getActiveSessions(): ManagedSession[] {
  return getAllSessions().filter((s) => !s.isRevoked);
}

export const getAllActiveSessions = getActiveSessions;

function saveSessions(sessions: ManagedSession[]): void {
  globalStore.__DZITOE_SESSIONS__ = sessions;
  const io = getFileIo();
  if (io) {
    try {
      io.fs.writeFileSync(io.dataFile, JSON.stringify(sessions, null, 2), 'utf-8');
    } catch {
      // non-blocking
    }
  }
}

export function parseDeviceFromUserAgent(ua: string): {
  browser: string;
  os: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
} {
  const lower = ua.toLowerCase();

  // OS
  let os = 'Unknown OS';
  if (lower.includes('windows')) os = 'Windows 11';
  else if (lower.includes('macintosh') || lower.includes('mac os')) os = 'macOS';
  else if (lower.includes('android')) os = 'Android';
  else if (lower.includes('iphone') || lower.includes('ipad')) os = 'iOS';
  else if (lower.includes('linux')) os = 'Linux';

  // Device Type
  let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
  if (lower.includes('mobile') || lower.includes('iphone') || lower.includes('android')) {
    deviceType = 'mobile';
  } else if (lower.includes('ipad') || lower.includes('tablet')) {
    deviceType = 'tablet';
  }

  // Browser
  let browser = 'Web Browser';
  if (lower.includes('firefox')) browser = 'Firefox';
  else if (lower.includes('edg')) browser = 'Microsoft Edge';
  else if (lower.includes('chrome')) browser = deviceType === 'mobile' ? 'Chrome Mobile' : 'Google Chrome';
  else if (lower.includes('safari')) browser = deviceType === 'mobile' ? 'Mobile Safari' : 'Safari';

  return { browser, os, deviceType };
}

export function registerSession(params: {
  userId: string;
  userName: string;
  userRole: UserRole;
  token?: string;
  ipAddress?: string;
  userAgent?: string;
}): ManagedSession {
  const sessions = getAllSessions();
  const ua = params.userAgent || 'Mozilla/5.0';
  const { browser, os, deviceType } = parseDeviceFromUserAgent(ua);
  const rawToken = params.token || `tok-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const tokenMasked = rawToken.length > 20
    ? `${rawToken.slice(0, 15)}...${rawToken.slice(-4)}`
    : rawToken;

  const newSession: ManagedSession = {
    id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: params.userId,
    userName: params.userName,
    userRole: params.userRole,
    tokenMasked,
    ipAddress: params.ipAddress || '127.0.0.1',
    userAgent: ua,
    browser,
    os,
    deviceType,
    location: 'Pakuhaji, Kab. Tangerang',
    lastActive: 'Baru saja',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isCurrent: true,
    isRevoked: false,
  };

  const updated = [newSession, ...sessions.map((s) => ({ ...s, isCurrent: false }))];
  saveSessions(updated);
  return newSession;
}

export function revokeSession(sessionId: string): boolean {
  const sessions = getAllSessions();
  const target = sessions.find((s) => s.id === sessionId);
  if (!target) return false;

  target.isRevoked = true;
  saveSessions(sessions);
  return true;
}

export function revokeAllOtherSessions(userId: string, keepSessionId?: string): number {
  const sessions = getAllSessions();
  let count = 0;

  for (const s of sessions) {
    if (s.userId === userId && s.id !== keepSessionId && !s.isRevoked) {
      s.isRevoked = true;
      count++;
    }
  }

  saveSessions(sessions);
  return count;
}
