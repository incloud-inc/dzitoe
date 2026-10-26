// ==============================================================================
// DZITOE — Forgot Password API Route
// Task: Modul A1.7 — Forgot Password Self-Service Flow
// ==============================================================================

import { NextResponse } from 'next/server';
import { requestPasswordReset } from '@dzitoe/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier } = body;

    if (!identifier) {
      return NextResponse.json(
        { success: false, message: 'Username, Email, NISN, atau NIP wajib diisi.' },
        { status: 400 }
      );
    }

    // Cek apakah Mode Uji Coba aktif via fetch internal atau default
    let isModeUjiCoba = true;
    try {
      const res = await fetch('http://localhost:3000/api/pengaturan');
      const json = await res.json();
      if (json.success && json.data) {
        isModeUjiCoba = !!json.data.modeUjiCoba;
      }
    } catch {
      // dev fallback
    }

    const result = await requestPasswordReset(identifier, isModeUjiCoba);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: {
        token: result.token,
        maskedEmail: result.userEmail,
        userName: result.userName,
        // Dalam mode uji coba atau testing, berikan kode demo untuk kemudahan pengujian
        simulationOtp: isModeUjiCoba ? result.otpCode : undefined,
        isSimulationMode: isModeUjiCoba,
      },
    });
  } catch (error) {
    console.error('[API_AUTH_FORGOT_PASS] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kendala saat memproses permintaan reset.' },
      { status: 500 }
    );
  }
}
