import { NextRequest, NextResponse } from 'next/server';
import {
  getAllSchedules,
  detectAllScheduleConflicts,
  validateNewScheduleConflict,
} from '@dzitoe/db';

export async function GET() {
  try {
    const allSchedules = getAllSchedules();
    const analysis = detectAllScheduleConflicts(allSchedules);

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menganalisis konflik jadwal' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { kelasId, hari, jamMulai, jamSelesai, guruId, ruang, id } = body;

    if (!kelasId || !hari || !jamMulai || !jamSelesai || !guruId) {
      return NextResponse.json(
        { success: false, message: 'Data jadwal tidak lengkap untuk validasi konflik' },
        { status: 400 }
      );
    }

    const allSchedules = getAllSchedules();
    const validation = validateNewScheduleConflict(
      {
        id,
        kelasId,
        hari,
        jamMulai,
        jamSelesai,
        guruId,
        ruang,
      },
      allSchedules
    );

    return NextResponse.json({
      success: true,
      isConflict: validation.isConflict,
      conflicts: validation.conflicts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memvalidasi konflik jadwal' },
      { status: 500 }
    );
  }
}
