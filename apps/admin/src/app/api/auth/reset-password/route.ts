// ==============================================================================
// DZITOE — Confirm Reset Password API Route
// Task: Modul A1.7 — Forgot Password Self-Service Flow
// ==============================================================================

import { NextResponse } from 'next/server';
import { confirmPasswordReset } from '@dzitoe/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, otpCode, newPassword } = body;

    if (!identifier || !otpCode || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Identitas, kode OTP, dan kata sandi baru wajib diisi.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Kata sandi minimal 6 karakter.' },
        { status: 400 }
      );
    }

    const result = await confirmPasswordReset({
      identifier,
      otpCode,
      newPassword,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('[API_AUTH_RESET_PASS] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui kata sandi.' },
      { status: 500 }
    );
  }
}
