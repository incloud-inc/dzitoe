import { NextResponse } from 'next/server';
import prisma from '@dzitoe/db';
import { Prisma } from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await prisma.kelasKurikulum.findMany({
      include: {
        mapel: true,
        bab: true,
      },
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.warn('[API_KURIKULUM_GET] DB query failed, returning fallback empty data:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ success: true, data: [], error: error instanceof Error ? error.message : String(error) });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { kelas, semester, mapelId } = body;

    if (!kelas || !semester || !mapelId) {
      return NextResponse.json(
        { success: false, error: 'Field kelas, semester, dan mapelId wajib diisi' },
        { status: 400 }
      );
    }

    const validSemester = String(semester).toUpperCase();
    if (validSemester !== 'GANJIL' && validSemester !== 'GENAP') {
      return NextResponse.json(
        { success: false, error: 'Semester harus berupa GANJIL atau GENAP' },
        { status: 400 }
      );
    }

    const newKelasKurikulum = await prisma.kelasKurikulum.create({
      data: {
        kelas: String(kelas),
        semester: validSemester as 'GANJIL' | 'GENAP',
        mapelId: String(mapelId),
      },
      include: {
        mapel: true,
        bab: true,
      },
    });

    return NextResponse.json(
      { success: true, data: newKelasKurikulum },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/kurikulum error:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: `Gagal membuat KelasKurikulum: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
