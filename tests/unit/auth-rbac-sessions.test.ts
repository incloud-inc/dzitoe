import { describe, it, expect } from 'vitest';
import {
  canAccessRoute,
  hasPermission,
  ROLE_PERMISSIONS,
  registerSession,
  revokeSession,
  getAllActiveSessions,
  requestPasswordReset,
  confirmPasswordReset,
  recordAuditLog,
  getAllAuditLogs,
} from '../../packages/auth/src';

describe('RBAC & Granular Route Access (A1.6)', () => {
  it('allows ADMIN full access to administrative routes and permissions', () => {
    expect(canAccessRoute('ADMIN', '/pengguna')).toBe(true);
    expect(canAccessRoute('ADMIN', '/pengaturan')).toBe(true);
    expect(canAccessRoute('ADMIN', '/jadwal')).toBe(true);
    expect(hasPermission('ADMIN', 'pengguna:write')).toBe(true);
    expect(hasPermission('ADMIN', 'session:manage')).toBe(true);
  });

  it('restricts GURU from administrative system settings and user management', () => {
    expect(canAccessRoute('GURU', '/pengguna')).toBe(false);
    expect(canAccessRoute('GURU', '/pengaturan')).toBe(false);
    expect(canAccessRoute('GURU', '/jadwal')).toBe(true);
    expect(canAccessRoute('GURU', '/presensi')).toBe(true);
    expect(hasPermission('GURU', 'pengguna:write')).toBe(false);
    expect(hasPermission('GURU', 'presensi:read')).toBe(true);
    expect(hasPermission('GURU', 'presensi:input')).toBe(true);
  });

  it('restricts MURID from web admin dashboard and redirects them', () => {
    expect(canAccessRoute('MURID', '/')).toBe(false);
    expect(canAccessRoute('MURID', '/pengguna')).toBe(false);
    expect(canAccessRoute('MURID', '/dashboard')).toBe(false);
    expect(hasPermission('MURID', 'presensi:read')).toBe(true);
  });

  it('allows KEPALA_SEKOLAH access to audit and reporting but restricts write config changes', () => {
    expect(canAccessRoute('KEPALA_SEKOLAH', '/pengguna')).toBe(true);
    expect(hasPermission('KEPALA_SEKOLAH', 'audit:read')).toBe(true);
    expect(hasPermission('KEPALA_SEKOLAH', 'pengaturan:write')).toBe(false);
  });

  it('correctly guards new modules: Kenaikan Kelas, Kesehatan UKS, BK, and Alumni per role', () => {
    // Kenaikan Kelas: Hanya Admin, Kepala Sekolah, dan TU
    expect(canAccessRoute('ADMIN', '/murid/kenaikan-kelas')).toBe(true);
    expect(canAccessRoute('KEPALA_SEKOLAH', '/murid/kenaikan-kelas')).toBe(true);
    expect(canAccessRoute('TU', '/murid/kenaikan-kelas')).toBe(true);
    expect(canAccessRoute('GURU', '/murid/kenaikan-kelas')).toBe(false);
    expect(canAccessRoute('GURU_BK', '/murid/kenaikan-kelas')).toBe(false);

    // Kesehatan Siswa & UKS: Admin, Kepsek, TU, Guru, dan Guru BK dapat akses
    expect(canAccessRoute('ADMIN', '/kesehatan')).toBe(true);
    expect(canAccessRoute('GURU', '/kesehatan')).toBe(true);
    expect(canAccessRoute('GURU_BK', '/kesehatan')).toBe(true);
    expect(canAccessRoute('TU', '/kesehatan')).toBe(true);
    expect(hasPermission('GURU_BK', 'kesehatan:write')).toBe(true);

    // Layanan BK: Rahasia, hanya Admin, Kepsek, dan Guru BK
    expect(canAccessRoute('GURU_BK', '/bk')).toBe(true);
    expect(canAccessRoute('GURU', '/bk')).toBe(false);
    expect(canAccessRoute('TU', '/bk')).toBe(false);

    // Alumni: Admin, Kepsek, TU, Guru BK
    expect(canAccessRoute('GURU_BK', '/alumni')).toBe(true);
    expect(canAccessRoute('TU', '/alumni')).toBe(true);
    expect(canAccessRoute('GURU', '/alumni')).toBe(false);
  });
});

describe('Forgot Password Self-Service & Sandbox Mode (A1.7)', () => {
  it('creates OTP and returns sandbox OTP 202620 when sandbox mode is true', async () => {
    const res = await requestPasswordReset('guru', true);

    expect(res.success).toBe(true);
    expect(res.otpCode).toBe('202620');

    // Confirm password reset with the sandbox OTP
    const resetRes = await confirmPasswordReset({
      identifier: 'guru',
      otpCode: '202620',
      newPassword: 'PasswordBaru2026!',
    });
    expect(resetRes.success).toBe(true);
  });

  it('rejects invalid OTP', async () => {
    await requestPasswordReset('guru', false);
    const resetRes = await confirmPasswordReset({
      identifier: 'guru',
      otpCode: '000000',
      newPassword: 'PasswordBaru2026!',
    });
    expect(resetRes.success).toBe(false);
  });
});

describe('Session Management & Revocation (A1.8)', () => {
  it('registers new session and permits manual revocation', () => {
    const session = registerSession({
      userId: 'test-user-1',
      userName: 'Test User',
      userRole: 'GURU',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    });

    expect(session.id).toBeDefined();
    expect(session.isRevoked).toBe(false);

    // Revoke session
    const revoked = revokeSession(session.id);
    expect(revoked).toBe(true);

    const activeSessions = getAllActiveSessions();
    const found = activeSessions.find((s) => s.id === session.id);
    expect(found).toBeUndefined();
  });
});

describe('Audit Logging (A1.9)', () => {
  it('records security events with proper status and details', () => {
    const initialCount = getAllAuditLogs().length;

    recordAuditLog({
      userId: 'test-user-2',
      userName: 'Audit Test User',
      identifier: 'test.user',
      action: 'LOGIN_SUCCESS',
      status: 'SUCCESS',
      ipAddress: '10.0.0.5',
      userAgent: 'TestBrowser/1.0',
      details: 'Unit test login event',
    });

    const logs = getAllAuditLogs();
    expect(logs.length).toBeGreaterThan(initialCount);
    expect(logs[0].action).toBe('LOGIN_SUCCESS');
    expect(logs[0].status).toBe('SUCCESS');
  });
});
