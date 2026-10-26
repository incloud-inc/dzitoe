import { NextResponse } from 'next/server';
import {
  authenticateCredentials,
  createSessionToken,
  serializeSessionCookie,
} from '@dzitoe/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password, role } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Identitas/Username dan kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const authResult = await authenticateCredentials({
      identifier,
      password,
      role,
    });

    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, message: authResult.message || 'Login gagal.' },
        { status: 401 }
      );
    }

    const token = await createSessionToken(authResult.user);
    const cookieHeader = serializeSessionCookie(token);

    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil.',
      user: authResult.user,
    });

    response.headers.set('Set-Cookie', cookieHeader);
    return response;
  } catch (error) {
    console.error('[MOBILE_AUTH_LOGIN] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem.' },
      { status: 500 }
    );
  }
}
