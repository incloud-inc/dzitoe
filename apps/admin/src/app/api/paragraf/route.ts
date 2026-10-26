import { NextRequest, NextResponse } from 'next/server';
import { db } from '@dzitoe/db';

// TODO: Replace with actual auth user ID when Auth is integrated
const DUMMY_GURU_ID = 'cm20dummy0001guru0001';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const guruId = searchParams.get('guruId') || DUMMY_GURU_ID;
    
    // Untuk memastikan relasi ada, kita upsert dummy guru jika belum ada di env development
    if (process.env.NODE_ENV === 'development') {
      const guru = await db.guru.findUnique({ where: { id: guruId } });
      if (!guru) {
        const user = await db.user.upsert({
          where: { username: 'dummy_guru' },
          update: {},
          create: {
            username: 'dummy_guru',
            email: 'guru@dummy.com',
            password: 'hash',
            name: 'Guru Dummy',
            role: 'GURU'
          }
        });
        await db.guru.upsert({
          where: { id: guruId },
          update: {},
          create: {
            id: guruId,
            userId: user.id,
            nama: 'Guru Dummy',
            jenisKelamin: 'LAKI_LAKI',
            status: 'AKTIF'
          }
        });
      }
    }

    const data = await db.paragraf.findMany({
      where: { guruId },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { bankSoal: true }
        }
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
    const { judul, konten, guruId = DUMMY_GURU_ID } = body;

    if (!konten) {
      return NextResponse.json({ success: false, error: 'Konten paragraf wajib diisi' }, { status: 400 });
    }

    const data = await db.paragraf.create({
      data: {
        guruId,
        judul,
        konten
      }
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
