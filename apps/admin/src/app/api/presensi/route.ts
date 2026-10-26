import { NextResponse } from 'next/server';
import {
  getAllAttendance,
  getAttendanceSummary,
  updateAttendanceStatusManual,
  recordStudentAttendance,
  SEED_CLASSES,
  TODAY_DATE_STR,
} from '@dzitoe/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tanggal = searchParams.get('tanggal') || TODAY_DATE_STR;
    const kelasId = searchParams.get('kelasId') || '';
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '15', 10));

    const summary = getAttendanceSummary(tanggal, kelasId || undefined);
    const all = getAllAttendance();

    // Filter data
    let filtered = all.filter((a) => a.tanggal === tanggal);

    if (kelasId) {
      filtered = filtered.filter((a) => a.kelasId === kelasId);
    }

    if (status) {
      filtered = filtered.filter((a) => a.status === status);
    }

    if (search) {
      filtered = filtered.filter(
        (a) =>
          a.muridNama.toLowerCase().includes(search) ||
          a.nisn.toLowerCase().includes(search) ||
          a.kelasNama.toLowerCase().includes(search)
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json(
      {
        success: true,
        data: {
          summary,
          records: paginated,
          classes: SEED_CLASSES,
          pagination: {
            total,
            page,
            limit,
            totalPages,
          },
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching admin attendance:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat rekap data presensi sekolah.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, id, muridId, status, notes } = body;

    if (action === 'UPDATE_STATUS' && id) {
      const result = updateAttendanceStatusManual(id, {
        status,
        notes,
      });

      if (!result.success) {
        return NextResponse.json(
          { success: false, message: result.message },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.record,
        message: result.message,
      });
    }

    if (action === 'MANUAL_RECORD' && muridId && status) {
      const result = recordStudentAttendance({
        muridId,
        type: status === 'IZIN' ? 'IZIN' : status === 'SAKIT' ? 'SAKIT' : 'MASUK',
        notes: notes || 'Presensi manual dicatat oleh Administrator/Guru',
        isDemo: true,
      });

      if (!result.success) {
        return NextResponse.json(
          { success: false, message: result.message },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.record,
        message: 'Presensi manual berhasil disimpan.',
      });
    }

    return NextResponse.json(
      { success: false, message: 'Aksi presensi tidak dikenali.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error modifying attendance record:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem saat memperbarui presensi.' },
      { status: 500 }
    );
  }
}
