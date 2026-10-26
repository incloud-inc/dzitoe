import { NextResponse } from 'next/server';
import {
  authenticateCredentials,
  createSessionToken,
  serializeSessionCookie,
  recordAuditLog,
  registerSession,
} from '@dzitoe/auth';

export async function POST(request: Request) {
  const forwardedHeader = request.headers.get('x-forwarded-for');
  const ipAddress = (forwardedHeader ? forwardedHeader.split(',')[0]?.trim() : null) ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';
  const userAgent = request.headers.get('user-agent') || 'Mozilla/5.0';

  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Username/Email dan kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const authResult = await authenticateCredentials({
      identifier,
      password,
    });

    if (!authResult.success || !authResult.user) {
      // Catat log kegagalan autentikasi
      recordAuditLog({
        userName: 'Gagal Masuk',
        identifier,
        action: 'LOGIN_FAILED',
        status: 'FAILED',
        ipAddress,
        userAgent,
        details: authResult.message || 'Kredensial atau kata sandi tidak valid',
      });

      return NextResponse.json(
        { success: false, message: authResult.message || 'Login gagal.' },
        { status: 401 }
      );
    }

    // Role Guard: Murid dan Orang Tua hanya boleh login di Portal Mobile (3001)
    if (authResult.user.role === 'MURID' || authResult.user.role === 'ORANG_TUA') {
      recordAuditLog({
        userId: authResult.user.id,
        userName: authResult.user.name,
        userRole: authResult.user.role,
        identifier,
        action: 'ACCESS_DENIED',
        status: 'WARNING',
        ipAddress,
        userAgent,
        details: 'Akun Murid/Orang Tua mencoba login di Web Admin. Dialihkan ke portal Mobile.',
      });

      return NextResponse.json(
        {
          success: false,
          message: 'Akun Murid/Orang Tua tidak memiliki izin akses ke Web Admin. Silakan buka aplikasi mobile di http://localhost:3001',
        },
        { status: 403 }
      );
    }

    const token = await createSessionToken(authResult.user);
    const cookieHeader = serializeSessionCookie(token);

    // Daftarkan sesi aktif baru
    registerSession({
      userId: authResult.user.id,
      userName: authResult.user.name,
      userRole: authResult.user.role,
      token,
      ipAddress,
      userAgent,
    });

    // Catat log keberhasilan login
    recordAuditLog({
      userId: authResult.user.id,
      userName: authResult.user.name,
      userRole: authResult.user.role,
      identifier,
      action: 'LOGIN_SUCCESS',
      status: 'SUCCESS',
      ipAddress,
      userAgent,
      details: `Berhasil masuk ke Dashboard Admin sebagai ${authResult.user.role}`,
    });

    const response = NextResponse.json({
      success: true,
      message: authResult.requirePasswordChange
        ? 'Login berhasil. Peringatan: Anda menggunakan kata sandi default (Masuk123!). Harap segera perbarui kata sandi Anda demi keamanan sistem.'
        : 'Login berhasil.',
      user: authResult.user,
      requirePasswordChange: authResult.requirePasswordChange ?? false,
    });

    response.headers.set('Set-Cookie', cookieHeader);
    return response;
  } catch (error) {
    console.error('[API_AUTH_LOGIN] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem.' },
      { status: 500 }
    );
  }
}
