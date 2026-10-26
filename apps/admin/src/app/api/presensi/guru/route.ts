import { NextResponse } from 'next/server';
import {
  getAllTeacherAttendance,
  recordTeacherAttendance,
  getAllTeachers,
  TODAY_DATE_STR,
} from '@dzitoe/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase().trim() || '';
  const status = searchParams.get('status')?.toUpperCase() || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.max(1, parseInt(searchParams.get('limit') || '15', 10));

  try {
    const allRecords = getAllTeacherAttendance();
    const allTeachers = getAllTeachers();

    let filtered = [...allRecords];

    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.guruNama.toLowerCase().includes(search) ||
          r.nip.toLowerCase().includes(search) ||
          (r.keteranganKBM && r.keteranganKBM.toLowerCase().includes(search)) ||
          (r.notes && r.notes.toLowerCase().includes(search))
      );
    }

    if (status && status !== 'ALL') {
      filtered = filtered.filter((r) => r.status === status);
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    // Calculate daily statistics for 35 GTK
    const totalTeachers = allTeachers.length;
    const tepatCount = allRecords.filter((r) => r.status === 'TEPAT').length;
    const terlambatCount = allRecords.filter((r) => r.status === 'TERLAMBAT').length;
    const izinCount = allRecords.filter((r) => r.status === 'IZIN').length;
    const sakitCount = allRecords.filter((r) => r.status === 'SAKIT').length;
    const dinasLuarCount = allRecords.filter((r) => r.status === 'DINAS_LUAR').length;
    const hadirCount = tepatCount + terlambatCount;
    const persentaseHadir = totalTeachers > 0 ? Math.round((hadirCount / totalTeachers) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: {
        totalTeachers,
        hadirCount,
        tepatCount,
        terlambatCount,
        izinCount,
        sakitCount,
        dinasLuarCount,
        persentaseHadir,
        tanggal: TODAY_DATE_STR,
      },
    });
  } catch (error) {
    console.error('[API_PRESENSI_GURU_GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat rekap presensi guru.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guruId, type, latitude, longitude, notes, keteranganKBM, selfieUrl } = body;

    if (!guruId || !type) {
      return NextResponse.json(
        { success: false, message: 'guruId dan type (MASUK/PULANG/KBM_NOTE) wajib disertakan.' },
        { status: 400 }
      );
    }

    const result = recordTeacherAttendance({
      guruId,
      type,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      notes,
      keteranganKBM,
      selfieUrl,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.record,
    });
  } catch (error) {
    console.error('[API_PRESENSI_GURU_POST] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal merekam presensi guru.' },
      { status: 500 }
    );
  }
}
