import { NextResponse } from 'next/server';
import {
  db,
  getAllTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from '@dzitoe/db';
import { hashPassword } from '@dzitoe/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase().trim() || '';
  const statusKepegawaian = searchParams.get('statusKepegawaian') || '';
  const mapel = searchParams.get('mapel') || '';
  const jabatan = searchParams.get('jabatan') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.max(1, parseInt(searchParams.get('limit') || '12', 10));

  try {
    // 1. Coba ambil dari Database Prisma jika DB online
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { nip: { contains: search, mode: 'insensitive' } },
        { nuptk: { contains: search, mode: 'insensitive' } },
        { nik: { contains: search, mode: 'insensitive' } },
        { mataPelajaran: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (statusKepegawaian && statusKepegawaian !== 'ALL') {
      where.statusKepegawaian = statusKepegawaian;
    }
    if (mapel && mapel !== 'ALL') {
      where.mataPelajaran = { contains: mapel, mode: 'insensitive' };
    }

    const [totalDb, teachersDb] = await Promise.all([
      db.guru.count({ where }).catch(() => 0),
      db.guru
        .findMany({
          where,
          include: {
            user: {
              select: { email: true, username: true, avatar: true },
            },
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { nama: 'asc' },
        })
        .catch(() => []),
    ]);

    if (totalDb > 0) {
      const formatted = (teachersDb as any[]).map((g: any) => ({
        id: g.id,
        userId: g.userId,
        nip: g.nip || '-',
        nuptk: g.nuptk || '-',
        nik: g.nik || '-',
        noKk: g.noKk || '-',
        nama: g.nama,
        gelar: g.gelar || 'S.Pd.',
        jenisKelamin: g.jenisKelamin,
        tempatLahir: g.tempatLahir || 'Tangerang',
        tanggalLahir: g.tanggalLahir ? g.tanggalLahir.toISOString().split('T')[0] : '1985-01-01',
        agama: g.agama || 'ISLAM',
        jalan: g.jalan || g.alamat || '-',
        rtRw: g.rtRw || '002/003',
        kelurahan: g.kelurahan || 'Pakuhaji',
        kecamatan: g.kecamatan || 'Pakuhaji',
        kabupaten: g.kabupaten || 'Kabupaten Tangerang',
        provinsi: g.provinsi || 'Banten',
        kodePos: g.kodePos || '15570',
        lintang: g.lintang ?? -6.123456,
        bujur: g.bujur ?? 106.123456,
        jabatan: g.jabatan || 'Guru Mata Pelajaran',
        mataPelajaran: g.mataPelajaran || '-',
        status: g.status,
        statusKepegawaian: g.statusKepegawaian || 'PNS',
        noHp: g.noHp || '081298765432',
        pendidikan: g.pendidikan || 'S1 Pendidikan',
        email: g.user.email,
        username: g.user.username,
        avatar: g.user.avatar,
        waliKelasId: g.waliKelasId || null,
        waliKelasNama: g.waliKelasNama || null,
      }));

      return NextResponse.json({
        success: true,
        data: formatted,
        total: totalDb,
        page,
        totalPages: Math.ceil(totalDb / limit),
      });
    }
  } catch (error) {
    console.warn('[API_GURU_GET] DB query fallback to persistent store:', (error as Error).message);
  }

  // 2. Fallback Shared Persistent Store (35 GTK SMAN 20)
  const allTeachers = getAllTeachers();
  let filtered = [...allTeachers];

  if (search) {
    filtered = filtered.filter(
      (t) =>
        t.nama.toLowerCase().includes(search) ||
        t.nip.toLowerCase().includes(search) ||
        t.nuptk.toLowerCase().includes(search) ||
        t.nik.toLowerCase().includes(search) ||
        t.mataPelajaran.toLowerCase().includes(search) ||
        t.jabatan.toLowerCase().includes(search)
    );
  }

  if (statusKepegawaian && statusKepegawaian !== 'ALL') {
    filtered = filtered.filter((t) => t.statusKepegawaian === statusKepegawaian);
  }

  if (mapel && mapel !== 'ALL') {
    filtered = filtered.filter((t) =>
      t.mataPelajaran.toLowerCase().includes(mapel.toLowerCase())
    );
  }

  if (jabatan && jabatan !== 'ALL') {
    filtered = filtered.filter((t) =>
      t.jabatan.toLowerCase().includes(jabatan.toLowerCase())
    );
  }

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    success: true,
    data: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

// POST: Tambah Guru / Tendik Baru (Dapodik Lengkap)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nama,
      gelar,
      nip,
      nuptk,
      nik,
      noKk,
      tempatLahir,
      tanggalLahir,
      agama,
      jalan,
      rtRw,
      kelurahan,
      kecamatan,
      kabupaten,
      provinsi,
      kodePos,
      lintang,
      bujur,
      jabatan,
      mataPelajaran,
      status,
      statusKepegawaian,
      noHp,
      pendidikan,
      jenisKelamin,
      waliKelasId,
    } = body;

    if (!nama || !mataPelajaran) {
      return NextResponse.json(
        { success: false, message: 'Nama Guru dan Mata Pelajaran wajib diisi.' },
        { status: 400 }
      );
    }

    const defaultPass = await hashPassword('Masuk123!');
    const cleanName = nama.toLowerCase().replace(/[^a-z0-9]/g, '');
    const username = `guru_${cleanName.slice(0, 8)}_${Date.now().toString().slice(-4)}`;
    const email = `${username}@sman20kabtangerang.sch.id`;

    try {
      const user = await db.user.create({
        data: {
          name: `${nama}${gelar ? `, ${gelar}` : ''}`,
          username,
          email,
          password: defaultPass,
          role: jabatan?.includes('Kepala Sekolah')
            ? 'KEPALA_SEKOLAH'
            : jabatan?.includes('Tata Usaha')
            ? 'TU'
            : 'GURU',
        },
      });

      const guru = await (db.guru as any).create({
        data: {
          userId: user.id,
          nama,
          gelar: gelar || 'S.Pd.',
          nip: nip || null,
          nuptk: nuptk || null,
          nik: nik || null,
          noKk: noKk || null,
          tempatLahir: tempatLahir || 'Tangerang',
          tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : null,
          agama: agama || 'ISLAM',
          jalan: jalan || null,
          rtRw: rtRw || null,
          kelurahan: kelurahan || 'Pakuhaji',
          kecamatan: kecamatan || 'Pakuhaji',
          kabupaten: kabupaten || 'Kabupaten Tangerang',
          provinsi: provinsi || 'Banten',
          kodePos: kodePos || '15570',
          lintang: lintang ? parseFloat(lintang) : null,
          bujur: bujur ? parseFloat(bujur) : null,
          jabatan: jabatan || 'Guru Mata Pelajaran',
          mataPelajaran,
          status: status || 'AKTIF',
          statusKepegawaian: statusKepegawaian || 'PNS',
          noHp: noHp || null,
          pendidikan: pendidikan || 'S1 Pendidikan',
          jenisKelamin: jenisKelamin === 'PEREMPUAN' ? 'PEREMPUAN' : 'LAKI_LAKI',
          waliKelasId: waliKelasId || null,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Guru/Tendik berhasil didaftarkan ke sistem.',
        data: guru,
      });
    } catch (dbErr) {
      console.warn('[API_GURU_POST] DB insert error, using shared store:', (dbErr as Error).message);
    }

    const newTeacher = createTeacher({
      nama,
      gelar: gelar || 'S.Pd.',
      nip,
      nuptk,
      nik,
      noKk,
      tempatLahir: tempatLahir || 'Tangerang',
      tanggalLahir: tanggalLahir || '1985-05-15',
      agama: agama || 'ISLAM',
      jalan: jalan || 'Jl. Raya Pakuhaji No. 20',
      rtRw: rtRw || '002/003',
      kelurahan: kelurahan || 'Pakuhaji',
      kecamatan: kecamatan || 'Pakuhaji',
      kabupaten: kabupaten || 'Kabupaten Tangerang',
      provinsi: provinsi || 'Banten',
      kodePos: kodePos || '15570',
      lintang: lintang ? parseFloat(lintang) : -6.123456,
      bujur: bujur ? parseFloat(bujur) : 106.123456,
      jabatan: jabatan || 'Guru Mata Pelajaran',
      mataPelajaran,
      status: status || 'AKTIF',
      statusKepegawaian: statusKepegawaian || 'PNS',
      noHp: noHp || '081298765432',
      pendidikan: pendidikan || 'S1 Pendidikan',
      jenisKelamin: jenisKelamin === 'PEREMPUAN' ? 'PEREMPUAN' : 'LAKI_LAKI',
      waliKelasId: waliKelasId || null,
      username,
      email,
    });

    return NextResponse.json({
      success: true,
      message: 'Guru/Tendik baru berhasil didaftarkan.',
      data: newTeacher,
    });
  } catch (error) {
    console.error('[API_GURU_POST] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan data guru/tendik.' },
      { status: 500 }
    );
  }
}

// PUT: Perbarui Data Guru / Tendik Lengkap (Dapodik Update)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateFields } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID guru/tendik wajib disertakan.' },
        { status: 400 }
      );
    }

    try {
      const updatedDb = await (db.guru as any).update({
        where: { id },
        data: {
          nama: updateFields.nama,
          gelar: updateFields.gelar,
          nip: updateFields.nip,
          nuptk: updateFields.nuptk,
          nik: updateFields.nik,
          noKk: updateFields.noKk,
          tempatLahir: updateFields.tempatLahir,
          tanggalLahir: updateFields.tanggalLahir ? new Date(updateFields.tanggalLahir) : undefined,
          agama: updateFields.agama,
          jalan: updateFields.jalan,
          rtRw: updateFields.rtRw,
          kelurahan: updateFields.kelurahan,
          kecamatan: updateFields.kecamatan,
          kabupaten: updateFields.kabupaten,
          provinsi: updateFields.provinsi,
          kodePos: updateFields.kodePos,
          lintang: updateFields.lintang ? parseFloat(updateFields.lintang) : undefined,
          bujur: updateFields.bujur ? parseFloat(updateFields.bujur) : undefined,
          jabatan: updateFields.jabatan,
          mataPelajaran: updateFields.mataPelajaran,
          status: updateFields.status,
          statusKepegawaian: updateFields.statusKepegawaian,
          noHp: updateFields.noHp,
          pendidikan: updateFields.pendidikan,
          jenisKelamin: updateFields.jenisKelamin,
          waliKelasId: updateFields.waliKelasId,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Data Dapodik guru/tendik berhasil diperbarui.',
        data: updatedDb,
      });
    } catch (dbErr) {
      console.warn('[API_GURU_PUT] DB update error, using shared store:', (dbErr as Error).message);
    }

    const updated = updateTeacher(id, {
      ...updateFields,
      lintang: updateFields.lintang ? parseFloat(updateFields.lintang) : undefined,
      bujur: updateFields.bujur ? parseFloat(updateFields.bujur) : undefined,
    });

    if (updated) {
      return NextResponse.json({
        success: true,
        message: 'Data Dapodik guru/tendik berhasil diperbarui.',
        data: updated,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Data guru tidak ditemukan.' },
      { status: 404 }
    );
  } catch (error) {
    console.error('[API_GURU_PUT] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui data guru/tendik.' },
      { status: 500 }
    );
  }
}

// DELETE: Hapus Data Guru / Tendik
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID guru wajib disertakan.' },
        { status: 400 }
      );
    }

    try {
      await db.guru.delete({ where: { id } });
      return NextResponse.json({
        success: true,
        message: 'Data guru berhasil dihapus dari sistem.',
      });
    } catch (dbErr) {
      console.warn('[API_GURU_DELETE] DB delete error, using shared store:', (dbErr as Error).message);
    }

    const deleted = deleteTeacher(id);
    if (deleted) {
      return NextResponse.json({
        success: true,
        message: 'Data guru berhasil dihapus dari sistem.',
      });
    }

    return NextResponse.json(
      { success: false, message: 'Data guru tidak ditemukan.' },
      { status: 404 }
    );
  } catch (error) {
    console.error('[API_GURU_DELETE] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus data guru.' },
      { status: 500 }
    );
  }
}
