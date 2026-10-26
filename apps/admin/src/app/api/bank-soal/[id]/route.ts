import { NextRequest, NextResponse } from 'next/server';
import { db } from '@dzitoe/db';
import { BankSoalCreateSchema, validateJawabanBankSoal } from '@/lib/validations/bank-soal';
import { z } from 'zod';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await db.bankSoal.findUnique({
      where: { id },
      include: {
        mapel: { select: { nama: true, kode: true } },
        bab: { select: { nama: true } },
        materi: { select: { nama: true } },
        paragrafObj: true
      }
    });

    if (!data) return NextResponse.json({ success: false, error: 'Soal tidak ditemukan' }, { status: 404 });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    // Validasi
    const parsedData = BankSoalCreateSchema.parse(body);
    const validJawaban = validateJawabanBankSoal(parsedData.jenisSoal, parsedData.jawaban);

    const data = await db.bankSoal.update({
      where: { id },
      data: {
        kelasKurikulumId: parsedData.kelasKurikulumId,
        mapelId: parsedData.mapelId,
        babId: parsedData.babId,
        materiId: parsedData.materiId,
        jenisSoal: parsedData.jenisSoal,
        tingkatKesulitan: parsedData.tingkatKesulitan,
        pertanyaan: parsedData.pertanyaan,
        jawaban: validJawaban,
        pembahasan: parsedData.pembahasan,
        paragrafId: parsedData.paragrafId,
        tags: parsedData.tags,
        isPublished: parsedData.isPublished,
      }
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Validasi Gagal', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Mengecek jika soal ini sedang diujikan atau ada relasi aktif (meski di schema onDelete cascade/setnull tidak masalah)
    await db.bankSoal.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Bank Soal berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
