import { NextResponse } from 'next/server';
import {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  SEED_CLASSES,
  type SeedSchedule,
} from '@dzitoe/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kelasId = searchParams.get('kelasId') || '';
  const hari = searchParams.get('hari')?.toUpperCase() || '';
  const guruId = searchParams.get('guruId') || '';
  const tingkat = searchParams.get('tingkat') || '';

  try {
    let schedules = getAllSchedules();

    if (kelasId && kelasId !== 'ALL') {
      schedules = schedules.filter(
        (s) => s.kelasId === kelasId || s.kelasNama.toLowerCase() === kelasId.toLowerCase()
      );
    } else if (tingkat && tingkat !== 'ALL') {
      const classIdsInTingkat = SEED_CLASSES.filter((c) => c.tingkat === tingkat).map((c) => c.id);
      schedules = schedules.filter((s) => classIdsInTingkat.includes(s.kelasId));
    }

    if (hari && hari !== 'ALL') {
      schedules = schedules.filter((s) => s.hari === hari);
    }

    if (guruId && guruId !== 'ALL') {
      schedules = schedules.filter((s) => s.guruId === guruId);
    }

    // Sort by day order then time slot
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
    console.error('[API_JADWAL_GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat jadwal pelajaran.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { kelasId, hari, jamMulai, jamSelesai, mapelId, guruId, ruang } = body;

    if (!kelasId || !hari || !jamMulai || !jamSelesai || !mapelId || !guruId) {
      return NextResponse.json(
        { success: false, message: 'Semua kolom jadwal wajib diisi lengkap.' },
        { status: 400 }
      );
    }

    const newSchedule = createSchedule({
      kelasId,
      hari: hari as SeedSchedule['hari'],
      jamMulai,
      jamSelesai,
      mapelId,
      guruId,
      ruang,
    });

    return NextResponse.json({
      success: true,
      message: 'Jadwal pelajaran berhasil ditambahkan.',
      data: newSchedule,
    });
  } catch (error) {
    console.error('[API_JADWAL_POST] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan jadwal pelajaran.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID jadwal wajib disertakan.' },
        { status: 400 }
      );
    }

    const updated = updateSchedule(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Jadwal tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Jadwal pelajaran berhasil diperbarui.',
      data: updated,
    });
  } catch (error) {
    console.error('[API_JADWAL_PUT] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui jadwal pelajaran.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID jadwal wajib disertakan.' },
        { status: 400 }
      );
    }

    const deleted = deleteSchedule(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Jadwal tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Jadwal pelajaran berhasil dihapus.',
    });
  } catch (error) {
    console.error('[API_JADWAL_DELETE] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus jadwal.' },
      { status: 500 }
    );
  }
}
