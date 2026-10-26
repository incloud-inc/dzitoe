// ==============================================================================
// DZITOE — API Alumni & Tracer Study (@apps/admin)
// SMAN 20 Kabupaten Tangerang
// Module A24: Portal Alumni
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAllAlumni, createAlumni, getAlumniStats } from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tahunLulus = searchParams.get('tahunLulus')
      ? Number(searchParams.get('tahunLulus'))
      : undefined;
    const statusTracer = searchParams.get('statusTracer') || undefined;
    const search = searchParams.get('search') || undefined;

    const data = getAllAlumni({ tahunLulus, statusTracer, search });
    const stats = getAlumniStats();

    return NextResponse.json({
      success: true,
      data,
      stats,
    });
  } catch (error: any) {
    console.error('[API Alumni] GET Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal memuat data alumni' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.nisn || !body.nama || !body.tahunLulus || !body.kelasTerakhir) {
      return NextResponse.json(
        { success: false, message: 'NISN, Nama, Tahun Lulus, dan Kelas Terakhir wajib diisi' },
        { status: 400 }
      );
    }

    const created = createAlumni(body);
    return NextResponse.json({
      success: true,
      message: 'Data alumni berhasil ditambahkan',
      data: created,
    });
  } catch (error: any) {
    console.error('[API Alumni] POST Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal menambahkan data alumni' },
      { status: 400 }
    );
  }
}
