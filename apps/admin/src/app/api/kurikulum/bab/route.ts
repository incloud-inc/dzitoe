import { NextResponse } from 'next/server';
import prisma from '@dzitoe/db';
import { Prisma } from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await prisma.bab.findMany({
      include: {
        kelasKurikulum: {
          include: {
            mapel: true,
          },
        },
        materi: true,
      },
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.warn('[API_BAB_GET] DB query failed, returning fallback empty data:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { kelasKurikulumId, nama, urutan, deskripsi } = body;

    if (!kelasKurikulumId || !nama || urutan === undefined) {
      return NextResponse.json(
        { success: false, error: 'Field kelasKurikulumId, nama, dan urutan wajib diisi' },
        { status: 400 }
      );
    }

    const urutanNumber = Number(urutan);
    if (isNaN(urutanNumber)) {
      return NextResponse.json(
        { success: false, error: 'Field urutan harus berupa angka' },
        { status: 400 }
      );
    }

    const newBab = await prisma.bab.create({
      data: {
        kelasKurikulumId,
        nama,
        urutan: urutanNumber,
        deskripsi: deskripsi || null,
      },
      include: {
        kelasKurikulum: {
          include: {
            mapel: true,
          },
        },
        materi: true,
      },
    });

    return NextResponse.json(
      { success: true, data: newBab },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/kurikulum/bab error:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Gagal membuat Bab' },
      { status: 500 }
    );
  }
}
