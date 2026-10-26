import { NextRequest, NextResponse } from 'next/server';
import { db } from '@dzitoe/db';
import { BankSoalCreateSchema, validateJawabanBankSoal } from '@/lib/validations/bank-soal';
import { z } from 'zod';

const DUMMY_GURU_ID = 'cm20dummy0001guru0001'; // Default until auth is ready

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const guruId = searchParams.get('guruId') || DUMMY_GURU_ID;
    const kelasKurikulumId = searchParams.get('kelasKurikulumId');
    const babId = searchParams.get('babId');
    const materiId = searchParams.get('materiId');
    const mapelId = searchParams.get('mapelId');
    
    const where: any = { guruId };
    
    if (kelasKurikulumId) where.kelasKurikulumId = kelasKurikulumId;
    if (babId) where.babId = babId;
    if (materiId) where.materiId = materiId;
    if (mapelId) where.mapelId = mapelId;

    const data = await db.bankSoal.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        mapel: { select: { nama: true, kode: true } },
        bab: { select: { nama: true } },
        materi: { select: { nama: true } },
        paragrafObj: { select: { judul: true, konten: true } }
      }
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 1. Zod Validation (Basic structure)
    const parsedData = BankSoalCreateSchema.parse(body);
    
    // 2. Custom JSON Structure Validation (based on JenisSoal)
    const validJawaban = validateJawabanBankSoal(parsedData.jenisSoal, parsedData.jawaban);

    // TODO: Verify if guru exists, if not create dummy (since no auth yet)
    if (process.env.NODE_ENV === 'development') {
      const guru = await db.guru.findUnique({ where: { id: DUMMY_GURU_ID } });
      if (!guru) {
        const user = await db.user.upsert({
          where: { username: 'dummy_guru' },
          update: {},
          create: {
            username: 'dummy_guru', email: 'guru@dummy.com', password: 'hash', name: 'Guru Dummy', role: 'GURU'
          }
        });
        await db.guru.upsert({
          where: { id: DUMMY_GURU_ID },
          update: {},
          create: { id: DUMMY_GURU_ID, userId: user.id, nama: 'Guru Dummy', jenisKelamin: 'LAKI_LAKI', status: 'AKTIF' }
        });
      }
    }

    const data = await db.bankSoal.create({
      data: {
        guruId: DUMMY_GURU_ID,
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
        sumber: 'MANUAL',
      }
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Validasi Gagal', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
