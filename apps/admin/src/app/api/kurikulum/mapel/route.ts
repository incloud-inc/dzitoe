import { NextResponse } from 'next/server';
import prisma from '@dzitoe/db';
import { Prisma } from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const mapelData = [
    { id: 'dummy-1', kode: 'PAI', nama: 'Pendidikan Agama Islam dan Budi Pekerti', deskripsi: 'Kelompok A Wajib' },
    { id: 'dummy-2', kode: 'PKN', nama: 'Pendidikan Pancasila dan Kewarganegaraan', deskripsi: 'Kelompok A Wajib' },
    { id: 'dummy-3', kode: 'BINDO', nama: 'Bahasa Indonesia', deskripsi: 'Kelompok A Wajib' },
    { id: 'dummy-4', kode: 'MTK-W', nama: 'Matematika Wajib', deskripsi: 'Kelompok A Wajib' },
    { id: 'dummy-5', kode: 'SEJ-IND', nama: 'Sejarah Indonesia', deskripsi: 'Kelompok A Wajib' },
    { id: 'dummy-6', kode: 'BING', nama: 'Bahasa Inggris', deskripsi: 'Kelompok A Wajib' },
    { id: 'dummy-7', kode: 'SBD', nama: 'Seni Budaya', deskripsi: 'Kelompok B Wajib' },
    { id: 'dummy-8', kode: 'PJOK', nama: 'Pendidikan Jasmani, Olahraga, dan Kesehatan', deskripsi: 'Kelompok B Wajib' },
    { id: 'dummy-9', kode: 'PKWU', nama: 'Prakarya dan Kewirausahaan', deskripsi: 'Kelompok B Wajib' },
    { id: 'dummy-10', kode: 'MTK-M', nama: 'Matematika Peminatan', deskripsi: 'Peminatan MIPA' },
    { id: 'dummy-11', kode: 'BIO', nama: 'Biologi', deskripsi: 'Peminatan MIPA' },
    { id: 'dummy-12', kode: 'FIS', nama: 'Fisika', deskripsi: 'Peminatan MIPA' },
    { id: 'dummy-13', kode: 'KIM', nama: 'Kimia', deskripsi: 'Peminatan MIPA' },
    { id: 'dummy-14', kode: 'GEO', nama: 'Geografi', deskripsi: 'Peminatan IPS' },
    { id: 'dummy-15', kode: 'SEJ', nama: 'Sejarah', deskripsi: 'Peminatan IPS' },
    { id: 'dummy-16', kode: 'SOS', nama: 'Sosiologi', deskripsi: 'Peminatan IPS' },
    { id: 'dummy-17', kode: 'EKO', nama: 'Ekonomi', deskripsi: 'Peminatan IPS' },
    { id: 'dummy-18', kode: 'TIK', nama: 'Informatika', deskripsi: 'Lintas Minat / Wajib Kurmer' },
  ];

  try {
    let data = await prisma.mataPelajaran.findMany();
    
    // Auto-seed if empty
    if (data.length === 0) {
      console.log('Mapel kosong, melakukan auto-seeding...');
      await Promise.all(
        mapelData.map(m => prisma.mataPelajaran.upsert({
          where: { kode: m.kode },
          update: {},
          create: { kode: m.kode, nama: m.nama, deskripsi: m.deskripsi },
        }))
      );
      data = await prisma.mataPelajaran.findMany();
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.warn('[API_MAPEL_GET] DB query failed, returning fallback mapel data:', error instanceof Error ? error.message : String(error));
    // Provide the dummy master data so the UI Dropdown is never empty even if DB fails
    return NextResponse.json({ success: true, data: mapelData });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, kode, deskripsi } = body;

    if (!nama || !kode) {
      return NextResponse.json(
        { success: false, error: 'Field nama dan kode wajib diisi' },
        { status: 400 }
      );
    }

    const newMapel = await prisma.mataPelajaran.create({
      data: {
        nama,
        kode,
        deskripsi: deskripsi || null,
      },
    });

    return NextResponse.json(
      { success: true, data: newMapel },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/kurikulum/mapel error:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { success: false, error: 'Kode mata pelajaran sudah digunakan' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Gagal membuat MataPelajaran' },
      { status: 500 }
    );
  }
}
