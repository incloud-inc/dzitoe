import { NextResponse } from 'next/server';
import prisma from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await prisma.paketSoal.findUnique({
      where: { id: params.id },
      include: {
        mapel: true,
        guru: { select: { nama: true } },
        kopNaskah: true,
        items: {
          include: {
            bankSoal: true
          },
          orderBy: { urutan: 'asc' }
        }
      }
    });

    if (!data) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/bank-soal/paket/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Gagal' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    
    // Bisa update data paket atau update urutan soal (items)
    if (body.action === 'UPDATE_ITEMS') {
      // Menghapus semua items lama dan insert yang baru dengan urutan yang sudah di drag & drop
      await prisma.paketSoalItem.deleteMany({ where: { paketSoalId: params.id } });
      
      const newItems = body.items.map((it: any, index: number) => ({
        paketSoalId: params.id,
        bankSoalId: it.bankSoalId,
        urutan: index + 1,
        bobot: it.bobot || 1.0
      }));

      await prisma.paketSoalItem.createMany({ data: newItems });

      return NextResponse.json({ success: true, message: 'Urutan berhasil diperbarui' });
    }

    // Update metadata paket
    const { nama, mapelId, kelas, semester, jumlahSoal, durasi, kopNaskahId, petunjuk, layoutKertas, jumlahKolom } = body;
    const data = await prisma.paketSoal.update({
      where: { id: params.id },
      data: {
        nama,
        mapelId,
        kelas,
        semester,
        jumlahSoal: parseInt(jumlahSoal) || 0,
        durasi: parseInt(durasi) || 90,
        kopNaskahId,
        petunjuk,
        layoutKertas,
        jumlahKolom: parseInt(jumlahKolom) || 1
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('PUT /api/bank-soal/paket/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Gagal' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.paketSoal.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal' }, { status: 500 });
  }
}
