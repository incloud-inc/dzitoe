// ==============================================================================
// DZITOE — API Pelayanan BK & Disiplin Positif (@apps/admin)
// SMAN 20 Kabupaten Tangerang
// Module A23: Bimbingan Konseling & Restitusi Karakter
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAllBKRecords, createBKRecord, getBKStats } from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jenis = searchParams.get('jenis') || undefined;
    const status = searchParams.get('status') || undefined;
    const muridId = searchParams.get('muridId') || undefined;
    const search = searchParams.get('search') || undefined;

    const data = getAllBKRecords({ jenis, status, muridId, search });
    const stats = getBKStats();

    return NextResponse.json({
      success: true,
      data,
      stats,
    });
  } catch (error: any) {
    console.error('[API BK] GET Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal memuat catatan pelayanan BK' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.muridId || !body.jenis || !body.permasalahan) {
      return NextResponse.json(
        { success: false, message: 'Murid, Jenis Layanan, dan Pokok Pembahasan/Permasalahan wajib diisi' },
        { status: 400 }
      );
    }

    const created = createBKRecord(body);
    return NextResponse.json({
      success: true,
      message: 'Sesi bimbingan konseling berhasil disimpan',
      data: created,
    });
  } catch (error: any) {
    console.error('[API BK] POST Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal menyimpan sesi bimbingan konseling' },
      { status: 400 }
    );
  }
}
