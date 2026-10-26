// ==============================================================================
// DZITOE — Authentication Service (@dzitoe/auth)
// Validates credentials strictly against Postgres DB
// ==============================================================================

import { db } from '@dzitoe/db';
import { verifyPassword } from './hash';
import type { AuthUser, LoginCredentials, AuthResponse } from './types';

/**
 * Autentikasi Pengguna berdasarkan username/email dan password.
 * Fail hard: Tidak ada fallback ke data dummy. Jika DB mati, throw error.
 */
export async function authenticateCredentials(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const { identifier, password, role } = credentials;

  if (!identifier || !password) {
    return {
      success: false,
      message: 'Username/Email dan kata sandi wajib diisi.',
    };
  }

  try {
    const cleanId = identifier.trim();
    const cleanLower = cleanId.toLowerCase();

    const user = await db.user.findFirst({
      where: {
        OR: [
          { username: cleanLower },
          { email: cleanLower },
          { murid: { nisn: cleanId } },
          { murid: { nis: cleanId } },
          { guru: { nip: cleanId } },
        ],
      },
      include: {
        murid: {
          include: {
            kelas: true,
          },
        },
        guru: true,
      },
    });

    if (user) {
      if (!user.isActive) {
        return {
          success: false,
          message: 'Akun Anda dinonaktifkan. Silakan hubungi Administrator.',
        };
      }

      // Validasi role jika dispesifikasikan (misal portal admin hanya untuk ADMIN/GURU/TU/KEPSEK)
      if (role && user.role !== role) {
        return {
          success: false,
          message: `Akun ini tidak memiliki hak akses sebagai ${role}.`,
        };
      }

      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Kata sandi tidak sesuai.',
        };
      }

      const authUser: AuthUser = {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role as AuthUser['role'],
        avatar: user.avatar,
        muridId: user.murid?.id || null,
        guruId: user.guru?.id || null,
        nisn: user.murid?.nisn || null,
        nip: user.guru?.nip || null,
        kelas: user.murid?.kelas?.nama || null,
      };

      // Catat audit log login
      try {
        await db.auditLog.create({
          data: {
            userId: user.id,
            action: 'LOGIN',
            resource: 'User',
            details: { role: user.role, time: new Date().toISOString() },
          },
        });
      } catch {
        // non-blocking
      }

      return {
        success: true,
        user: authUser,
      };
    }

    return {
      success: false,
      message: 'Pengguna tidak ditemukan atau kredensial salah.',
    };
  } catch (error) {
    // DB offline atau koneksi bermasalah: FAIL HARD
    console.error('[AUTH] Database check failed:', error);
    return {
      success: false,
      message: 'Sistem sedang mengalami gangguan (Database Tidak Tersedia). Harap hubungi administrator.',
    };
  }
}
