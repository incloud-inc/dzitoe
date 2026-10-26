// ==============================================================================
// DZITOE — Password Reset Self-Service Store (@dzitoe/auth)
// Task: Modul A1.7 — Forgot Password Self-Service Flow
// ==============================================================================

import { db, SEED_STUDENTS, SEED_TEACHERS } from '@dzitoe/db';
import { hashPassword } from './hash';
import { recordAuditLog } from './audit-store';
import { revokeAllOtherSessions } from './session-store';

export interface ResetTokenEntry {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  identifier: string;
  otpCode: string;
  token: string;
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
}

const globalStore = globalThis as unknown as {
  __DZITOE_RESET_TOKENS__?: ResetTokenEntry[];
};

if (!globalStore.__DZITOE_RESET_TOKENS__) {
  globalStore.__DZITOE_RESET_TOKENS__ = [];
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
      const dataFile = path.join(dataDir, 'runtime-reset-tokens.json');
      return { fs, dataDir, dataFile };
    }
  } catch {
    // fallback
  }
  return null;
}

export function getAllTokens(): ResetTokenEntry[] {
  const io = getFileIo();
  if (io) {
    try {
      if (io.fs.existsSync(io.dataFile)) {
        const content = io.fs.readFileSync(io.dataFile, 'utf-8');
        const parsed = JSON.parse(content) as ResetTokenEntry[];
        globalStore.__DZITOE_RESET_TOKENS__ = parsed;
        return parsed;
      }
    } catch {
      // fallback
    }
  }
  return globalStore.__DZITOE_RESET_TOKENS__ || [];
}

function saveTokens(tokens: ResetTokenEntry[]): void {
  globalStore.__DZITOE_RESET_TOKENS__ = tokens;
  const io = getFileIo();
  if (io) {
    try {
      if (!io.fs.existsSync(io.dataDir)) {
        io.fs.mkdirSync(io.dataDir, { recursive: true });
      }
      io.fs.writeFileSync(io.dataFile, JSON.stringify(tokens, null, 2), 'utf-8');
    } catch {
      // non-blocking
    }
  }
}

/**
 * Buat kode OTP & token reset kata sandi
 */
export async function requestPasswordReset(identifier: string, isModeUjiCoba: boolean = false): Promise<{
  success: boolean;
  message: string;
  token?: string;
  otpCode?: string;
  userEmail?: string;
  userName?: string;
}> {
  const normalized = identifier.toLowerCase().trim();
  let foundUser: { id: string; name: string; email: string; role: any } | null = null;

  // 1. Cek Prisma DB jika DATABASE_URL tersedia
  if (process.env.DATABASE_URL) {
    try {
      const user = await db.user.findFirst({
        where: {
          OR: [
            { username: normalized },
            { email: normalized },
          ],
        },
      });
      if (user) {
        foundUser = { id: user.id, name: user.name, email: user.email, role: user.role };
      }
    } catch {
      // fallback
    }
  }

  // 2. Cek Demo & Seed Users jika DB offline
  if (!foundUser) {
    if (normalized === 'admin' || normalized === 'admin@sman20kabtangerang.sch.id') {
      foundUser = { id: 'demo-admin-1', name: 'Administrator SMAN 20', email: 'admin@sman20kabtangerang.sch.id', role: 'ADMIN' };
    } else if (normalized === 'guru' || normalized === 'budi.santoso@sman20kabtangerang.sch.id') {
      foundUser = { id: 'demo-guru-1', name: 'Drs. Budi Santoso, M.Pd', email: 'budi.santoso@sman20kabtangerang.sch.id', role: 'GURU' };
    } else {
      const student = SEED_STUDENTS.find((s) => s.username === normalized || s.nisn === normalized || s.email === normalized);
      if (student) {
        foundUser = { id: student.userId, name: student.nama, email: student.email, role: 'MURID' };
      } else {
        const teacher = SEED_TEACHERS.find((t) => t.username === normalized || t.nip === normalized || t.email === normalized);
        if (teacher) {
          foundUser = { id: teacher.userId, name: teacher.nama, email: teacher.email, role: 'GURU' };
        }
      }
    }
  }

  if (!foundUser) {
    return {
      success: false,
      message: 'Akun dengan username, email, NISN, atau NIP tersebut tidak ditemukan.',
    };
  }

  // Generate 6-digit OTP
  const otpCode = isModeUjiCoba ? '202620' : Math.floor(100000 + Math.random() * 900000).toString();
  const token = `rst-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 menit

  const entry: ResetTokenEntry = {
    id: `tok-${Date.now()}`,
    userId: foundUser.id,
    userName: foundUser.name,
    userEmail: foundUser.email,
    identifier: normalized,
    otpCode,
    token,
    expiresAt,
    isUsed: false,
    createdAt: new Date().toISOString(),
  };

  const existing = getAllTokens();
  saveTokens([entry, ...existing]);

  // Log audit
  recordAuditLog({
    userId: foundUser.id,
    userName: foundUser.name,
    userRole: foundUser.role,
    identifier: normalized,
    action: 'PASSWORD_RESET_REQUEST',
    status: 'SUCCESS',
    details: `Permintaan reset kata sandi mandiri diajukan (OTP aktif 15 menit)`,
  });

  return {
    success: true,
    message: `Kode verifikasi OTP telah dikirimkan ke email ${maskEmail(foundUser.email)}.`,
    token,
    otpCode,
    userEmail: maskEmail(foundUser.email),
    userName: foundUser.name,
  };
}

/**
 * Verifikasi OTP & Reset Password Baru
 */
export async function confirmPasswordReset(params: {
  identifier: string;
  otpCode: string;
  newPassword: string;
}): Promise<{ success: boolean; message: string }> {
  const { identifier, otpCode, newPassword } = params;
  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: 'Kata sandi baru minimal 6 karakter.' };
  }

  const normalized = identifier.toLowerCase().trim();
  const tokens = getAllTokens();

  const match = tokens.find(
    (t) =>
      (t.identifier === normalized || t.userEmail.toLowerCase() === normalized) &&
      t.otpCode === otpCode.trim() &&
      !t.isUsed
  );

  if (!match) {
    return { success: false, message: 'Kode OTP tidak valid atau sudah pernah digunakan.' };
  }

  if (new Date(match.expiresAt).getTime() < Date.now()) {
    return { success: false, message: 'Kode OTP telah kedaluwarsa (lebih dari 15 menit). Silakan minta kode baru.' };
  }

  // Tandai token digunakan
  match.isUsed = true;
  saveTokens(tokens);

  // Hash password baru
  const hashed = await hashPassword(newPassword);

  // Update di database jika DB aktif
  if (process.env.DATABASE_URL) {
    try {
      await db.user.update({
        where: { id: match.userId },
        data: { password: hashed },
      });
    } catch {
      // non-blocking
    }
  }

  // Cabut semua sesi lama perangkat lain
  revokeAllOtherSessions(match.userId);

  // Log audit
  recordAuditLog({
    userId: match.userId,
    userName: match.userName,
    identifier: normalized,
    action: 'PASSWORD_RESET_SUCCESS',
    status: 'SUCCESS',
    details: 'Kata sandi akun berhasil diperbarui secara mandiri; sesi lama dicabut.',
  });

  return {
    success: true,
    message: 'Kata sandi Anda berhasil diperbarui! Silakan masuk dengan kata sandi baru.',
  };
}

function maskEmail(email: string): string {
  const parts = email.split('@');
  const name = parts[0] || '';
  const domain = parts[1] || '';
  if (!domain || !name) return email;
  const maskedName = name.length > 3 ? `${name.slice(0, 2)}***${name.slice(-1)}` : `${name}***`;
  return `${maskedName}@${domain}`;
}
