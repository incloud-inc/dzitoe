import { NextResponse } from 'next/server';
import {
  getAllSchedules,
} from '@dzitoe/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kelasId = searchParams.get('kelasId') || '';
  const guruId = searchParams.get('guruId') || '';
  const hari = searchParams.get('hari')?.toUpperCase() || '';

  try {
    let schedules = getAllSchedules();

    if (guruId) {
      schedules = schedules.filter(
        (s) =>
          s.guruId.toLowerCase() === guruId.toLowerCase() ||
          s.guruNama.toLowerCase().includes(guruId.toLowerCase())
      );
    } else if (kelasId && kelasId !== 'ALL') {
      schedules = schedules.filter(
        (s) =>
          s.kelasId.toLowerCase() === kelasId.toLowerCase() ||
          s.kelasNama.toLowerCase() === kelasId.toLowerCase()
      );
    }

    if (hari && hari !== 'ALL') {
      schedules = schedules.filter((s) => s.hari === hari);
    }

    const dayOrder: Record<string, number> = {
      SENIN: 1,
      SELASA: 2,
      RABU: 3,
      KAMIS: 4,
      JUMAT: 5,
    };

    schedules.sort((a, b) => {
      const dayDiff = (dayOrder[a.hari] || 99) - (dayOrder[b.hari] || 99);
      if (dayDiff !== 0) return dayDiff;
      return a.jamMulai.localeCompare(b.jamMulai);
    });

    return NextResponse.json({
      success: true,
      data: schedules,
      total: schedules.length,
    });
  } catch (error) {
    console.error('[API_MOBILE_JADWAL_GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat jadwal.' },
      { status: 500 }
    );
  }
}
