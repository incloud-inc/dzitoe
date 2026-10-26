// ==============================================================================
// DZITOE — API Presensi Latihan Ekstrakurikuler (@apps/admin)
// Task: Modul A8.4 — Presensi & Jurnal Latihan Mingguan Ekskul
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  getAllPresensiEkskul,
  recordPresensiEkskul,
  getAllEkskul,
} from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ekskulId = searchParams.get('ekskulId') || undefined;
    const records = getAllPresensiEkskul(ekskulId);

    return NextResponse.json({
      success: true,
      data: records,
    });
  } catch (error: any) {
    console.error('[API /api/ekskul/presensi GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil presensi ekskul: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ekskulId, tanggal, materiLatihan, pembinaHadir, totalHadir, totalIzin, totalAlpa, catatan } = body;

    if (!ekskulId || !tanggal || !materiLatihan) {
      return NextResponse.json(
        { success: false, message: 'ekskulId, tanggal, dan materiLatihan wajib diisi!' },
        { status: 400 }
      );
    }

    const allEkskul = getAllEkskul();
    const eks = allEkskul.find((e) => e.id === ekskulId);
    const ekskulNama = eks ? eks.nama : 'Ekstrakurikuler';

    const result = recordPresensiEkskul({
      ekskulId,
      ekskulNama,
      tanggal,
      materiLatihan,
      pembinaHadir: pembinaHadir !== undefined ? Boolean(pembinaHadir) : true,
      totalHadir: Number(totalHadir) || 0,
      totalIzin: Number(totalIzin) || 0,
      totalAlpa: Number(totalAlpa) || 0,
      catatan: catatan || '',
    });

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.presensi,
    });
  } catch (error: any) {
    console.error('[API /api/ekskul/presensi POST] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mencatat presensi latihan: ' + error.message },
      { status: 500 }
    );
  }
}
