// ==============================================================================
// DZITOE — API Preview Simulasi Kenaikan Kelas (Dry-Run) (@apps/admin)
// Modul: Wisaya Kenaikan Kelas (Promotion Wizard)
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { generatePromotionPreview, type PromotionConfig } from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const config: PromotionConfig = body.config;

    if (!config || (!config.pemetaanJalurCepat && !config.pemetaanSiswa)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Konfigurasi pemetaan kenaikan kelas tidak lengkap.',
        },
        { status: 400 }
      );
    }

    const preview = generatePromotionPreview(config);

    return NextResponse.json({
      success: true,
      data: preview,
    });
  } catch (error: any) {
    console.error('[API KenaikanKelas Preview] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Gagal memproses simulasi kenaikan kelas.',
      },
      { status: 500 }
    );
  }
}
