// ==============================================================================
// DZITOE — API Kesehatan Siswa & Rekam Medis UKS (@apps/admin)
// SMAN 20 Kabupaten Tangerang
// Module A22: Kesehatan Murid
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAllHealthRecords, createHealthRecord, getHealthStats } from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jenis = searchParams.get('jenis') || undefined;
    const status = searchParams.get('status') || undefined;
    const muridId = searchParams.get('muridId') || undefined;
    const search = searchParams.get('search') || undefined;

    const data = getAllHealthRecords({ jenis, status, muridId, search });
    const stats = getHealthStats();

    return NextResponse.json({
      success: true,
      data,
      stats,
    });
  } catch (error: any) {
    console.error('[API Kesehatan] GET Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal memuat rekam medis UKS' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.muridId || !body.jenis || !body.keluhan) {
      return NextResponse.json(
        { success: false, message: 'Murid, Jenis Catatan, dan Keluhan/Keterangan wajib diisi' },
        { status: 400 }
      );
    }

    const created = createHealthRecord(body);
    return NextResponse.json({
      success: true,
      message: 'Catatan rekam medis UKS berhasil disimpan',
      data: created,
    });
  } catch (error: any) {
    console.error('[API Kesehatan] POST Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal menyimpan rekam medis UKS' },
      { status: 400 }
    );
  }
}
