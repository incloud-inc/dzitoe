// ==============================================================================
// DZITOE — API Reset Password Pengguna (@apps/admin)
// Task: Modul A3.5 — Reset Password oleh Admin
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { resetUserPassword } from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, customPassword } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID pengguna wajib diisi!' },
        { status: 400 }
      );
    }

    const result = resetUserPassword(id, customPassword);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      tempPass: result.tempPass,
    });
  } catch (error: any) {
    console.error('[API /api/pengguna/reset-password] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mereset kata sandi: ' + error.message },
      { status: 500 }
    );
  }
}
