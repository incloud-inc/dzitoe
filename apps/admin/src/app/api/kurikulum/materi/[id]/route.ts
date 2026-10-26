import { NextResponse } from 'next/server';
import prisma from '@dzitoe/db';
import { Prisma } from '@dzitoe/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const data = await prisma.materi.findUnique({
      where: { id },
      include: {
        bab: true,
      }
    });

    if (!data) {
      return NextResponse.json({ success: false, error: 'Data tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { babId, nama, deskripsi, capaianBelajar, tujuanBelajar, alurTujuan } = body;

    const data = await prisma.materi.update({
      where: { id },
      data: {
        babId,
        nama,
        deskripsi,
        capaianBelajar,
        tujuanBelajar,
        alurTujuan,
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Gagal mengubah data' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    await prisma.materi.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Data berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal menghapus data' }, { status: 500 });
  }
}
