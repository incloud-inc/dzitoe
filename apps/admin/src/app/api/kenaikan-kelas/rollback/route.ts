// ==============================================================================
// DZITOE — API 1-Click Rollback Kenaikan Kelas (@apps/admin)
// Modul: Wisaya Kenaikan Kelas (Promotion Wizard)
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { rollbackPromotion } from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const snapshotId = body.snapshotId;
    const revertedBy = body.revertedBy || 'Admin Sekolah';

    const result = rollbackPromotion(snapshotId, revertedBy);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[API KenaikanKelas Rollback] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Gagal membatalkan (rollback) kenaikan kelas.',
      },
      { status: 500 }
    );
  }
}
