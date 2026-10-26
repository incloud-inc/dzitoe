// ==============================================================================
// DZITOE — API Eksekusi Kenaikan Kelas & Rollback Snapshot (@apps/admin)
// Modul: Wisaya Kenaikan Kelas (Promotion Wizard)
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { executePromotion, type PromotionConfig } from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const config: PromotionConfig = body.config;
    const executedBy = body.executedBy || 'Admin Sekolah';

    if (!config || (!config.pemetaanJalurCepat && !config.pemetaanSiswa)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Konfigurasi pemetaan kenaikan kelas tidak lengkap.',
        },
        { status: 400 }
      );
    }

    const result = executePromotion(config, executedBy);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[API KenaikanKelas Execute] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Gagal mengeksekusi kenaikan kelas.',
      },
      { status: 500 }
    );
  }
}
