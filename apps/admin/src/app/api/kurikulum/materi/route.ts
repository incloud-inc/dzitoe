import { NextResponse } from 'next/server';
import prisma from '@dzitoe/db';
import { Prisma } from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await prisma.materi.findMany({
      include: {
        bab: {
          include: {
            kelasKurikulum: {
              include: {
                mapel: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.warn('[API_MATERI_GET] DB query failed, returning fallback empty data:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      babId,
      nama,
      deskripsi,
      capaianBelajar,
      tujuanBelajar,
      alurTujuan,
    } = body;

    if (!babId || !nama) {
      return NextResponse.json(
        { success: false, error: 'Field babId dan nama wajib diisi' },
        { status: 400 }
      );
    }

    const newMateri = await prisma.materi.create({
      data: {
        babId,
        nama,
        deskripsi: deskripsi || null,
        capaianBelajar: capaianBelajar || null,
        tujuanBelajar: tujuanBelajar || null,
        alurTujuan: alurTujuan || null,
      },
      include: {
        bab: {
          include: {
            kelasKurikulum: {
              include: {
                mapel: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, data: newMateri },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/kurikulum/materi error:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Gagal membuat Materi' },
      { status: 500 }
    );
  }
}
