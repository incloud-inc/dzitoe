// ==============================================================================
// DZITOE — API Status Kenaikan Kelas & Pemetaan Otomatis (@apps/admin)
// Modul: Wisaya Kenaikan Kelas (Promotion Wizard)
// ==============================================================================

import { NextResponse } from 'next/server';
import { getPromotionStatus } from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = getPromotionStatus();
    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (error: any) {
    console.error('[API KenaikanKelas Status] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Gagal memuat status kenaikan kelas.',
      },
      { status: 500 }
    );
  }
}
