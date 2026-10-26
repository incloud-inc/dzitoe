import { NextResponse } from 'next/server';
import prisma from '@dzitoe/db';

export const dynamic = 'force-dynamic';

// GET list of Paket Soal
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mapelId = searchParams.get('mapelId');

    const where = mapelId ? { mapelId } : {};

    const data = await prisma.paketSoal.findMany({
      where,
      include: {
        mapel: { select: { nama: true } },
        guru: { select: { nama: true } },
        kopNaskah: true,
        _count: { select: { items: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/bank-soal/paket error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data paket soal' },
      { status: 500 }
    );
  }
}

// POST create new Paket Soal
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guruId, nama, mapelId, kelas, semester, jumlahSoal, durasi, kopNaskahId, petunjuk, layoutKertas, jumlahKolom } = body;

    const data = await prisma.paketSoal.create({
      data: {
        guruId,
        nama,
        mapelId,
        kelas,
        semester,
        jumlahSoal: parseInt(jumlahSoal) || 0,
        durasi: parseInt(durasi) || 90,
        kopNaskahId,
        petunjuk,
        layoutKertas: layoutKertas || 'A4',
        jumlahKolom: parseInt(jumlahKolom) || 1
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('POST /api/bank-soal/paket error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal membuat paket soal' },
      { status: 500 }
    );
  }
}
