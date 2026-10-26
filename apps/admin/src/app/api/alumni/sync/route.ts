// ==============================================================================
// DZITOE — API Sinkronisasi Alumni Otomatis dari Kelulusan Kelas XII
// ==============================================================================

import { NextResponse } from 'next/server';
import { syncAlumniFromGraduation } from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const result = syncAlumniFromGraduation();
    return NextResponse.json({
      success: true,
      message: `Sinkronisasi selesai. ${result.added} alumni baru ditambahkan, ${result.existing} sudah terdaftar sebelumnya.`,
      data: result,
    });
  } catch (error: any) {
    console.error('[API Alumni Sync] Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal menyinkronkan data alumni' },
      { status: 500 }
    );
  }
}
