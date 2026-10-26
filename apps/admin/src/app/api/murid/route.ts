import { NextResponse } from 'next/server';
import { db, SEED_STUDENTS, SEED_CLASSES, type SeedStudent } from '@dzitoe/db';
import { hashPassword } from '@dzitoe/auth';

// Mutable in-memory store for runtime CRUD demo if database is offline
let RUNTIME_STUDENTS: SeedStudent[] = [...SEED_STUDENTS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase().trim() || '';
  const kelasId = searchParams.get('kelasId') || '';
  const tingkat = searchParams.get('tingkat') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.max(1, parseInt(searchParams.get('limit') || '25', 10));

  try {
    // 1. Coba query dari Database Prisma jika DB online
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { nis: { contains: search, mode: 'insensitive' } },
        { nisn: { contains: search, mode: 'insensitive' } },
        { nik: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (kelasId) {
      where.kelasId = kelasId;
    } else if (tingkat) {
      where.kelas = { tingkat };
    }

    const [total, students] = await Promise.all([
      db.murid.count({ where }),
      db.murid.findMany({
        where,
        include: {
          kelas: true,
          user: {
            select: { email: true, username: true, avatar: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { nisn: 'asc' },
      }),
    ]);

    if (total > 0) {
      const formatted = students.map((s) => ({
        id: s.id,
        userId: s.userId,
        nama: s.nama,
        nis: s.nis,
        nisn: s.nisn || '-',
        nik: s.nik || '-',
        noKk: s.noKk || '-',
        tempatLahir: s.tempatLahir || 'Tangerang',
        tanggalLahir: s.tanggalLahir ? s.tanggalLahir.toISOString().split('T')[0] : '2008-01-01',
        noAktaLahir: s.noAktaLahir || '-',
        agama: s.agama || 'ISLAM',
        jalan: s.jalan || s.alamat || '-',
        rtRw: s.rtRw || '001/001',
        kelurahan: s.kelurahan || 'Pakuhaji',
        kecamatan: s.kecamatan || 'Pakuhaji',
        kabupaten: s.kabupaten || 'Kabupaten Tangerang',
        provinsi: s.provinsi || 'Banten',
        kodePos: s.kodePos || '15570',
        lintang: s.lintang ?? -6.123456,
        bujur: s.bujur ?? 106.123456,
        kelasId: s.kelasId || '',
        kelasNama: s.kelas?.nama || 'Belum Ditentukan',
        tingkat: s.kelas?.tingkat || '-',
        jenisKelamin: s.jenisKelamin,
        username: s.user.username,
        email: s.user.email,
        avatar: s.user.avatar,
        status: s.status,
      }));

      return NextResponse.json({
        success: true,
        data: formatted,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    }
  } catch (error) {
    console.warn('[API_MURID_GET] DB query fallback to RUNTIME_STUDENTS:', (error as Error).message);
  }

  // 2. Fallback In-Memory Seed Students (150 Murid dari 30 Kelas SMAN 20)
  let filtered = [...RUNTIME_STUDENTS];

  if (search) {
    filtered = filtered.filter(
      (s) =>
        s.nama.toLowerCase().includes(search) ||
        s.nis.toLowerCase().includes(search) ||
        s.nisn.toLowerCase().includes(search) ||
        s.nik.toLowerCase().includes(search) ||
        s.kelasNama.toLowerCase().includes(search)
    );
  }

  if (kelasId) {
    filtered = filtered.filter((s) => s.kelasId === kelasId);
  } else if (tingkat) {
    const classIdsInTingkat = SEED_CLASSES.filter((c) => c.tingkat === tingkat).map((c) => c.id);
    filtered = filtered.filter((s) => classIdsInTingkat.includes(s.kelasId));
  }

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit).map((s) => {
    const kls = SEED_CLASSES.find((c) => c.id === s.kelasId);
    return {
      ...s,
      tingkat: kls?.tingkat || '-',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      status: 'AKTIF',
    };
  });

  return NextResponse.json({
    success: true,
    data: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

// POST: Tambah Murid Baru dengan Identitas Lengkap
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nama,
      nis,
      nisn,
      nik,
      noKk,
      tempatLahir,
      tanggalLahir,
      noAktaLahir,
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
      kelasId,
      jenisKelamin,
    } = body;

    if (!nama || !nis || !kelasId) {
      return NextResponse.json(
        { success: false, message: 'Nama, NIS, dan Kelas wajib diisi.' },
        { status: 400 }
      );
    }

    const defaultPass = await hashPassword('Masuk123!');
    const username = `murid_${nis}`;
    const email = `${username}@siswa.sman20.sch.id`;

    try {
      const user = await db.user.create({
        data: {
          name: nama,
          username,
          email,
          password: defaultPass,
          role: 'MURID',
        },
      });

      const murid = await db.murid.create({
        data: {
          userId: user.id,
          nama,
          nis,
          nisn: nisn || null,
          nik: nik || null,
          noKk: noKk || null,
          tempatLahir: tempatLahir || 'Tangerang',
          tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : null,
          noAktaLahir: noAktaLahir || null,
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
          kelasId,
          jenisKelamin: jenisKelamin === 'PEREMPUAN' ? 'PEREMPUAN' : 'LAKI_LAKI',
        },
        include: {
          kelas: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Murid berhasil didaftarkan ke sistem.',
        data: murid,
      });
    } catch (dbError) {
      console.warn('[API_MURID_POST] DB insert error, using in-memory store:', (dbError as Error).message);
    }

    const klsMatch = SEED_CLASSES.find((c) => c.id === kelasId);
    const newStudent: SeedStudent = {
      id: `mrd-${Date.now()}`,
      userId: `usr-${Date.now()}`,
      nama,
      nis,
      nisn: nisn || `008${Date.now().toString().slice(-7)}`,
      nik: nik || `360312010108${Date.now().toString().slice(-4)}`,
      noKk: noKk || '3603120101080001',
      tempatLahir: tempatLahir || 'Tangerang',
      tanggalLahir: tanggalLahir || '2008-05-10',
      noAktaLahir: noAktaLahir || `3603-LT-${Date.now().toString().slice(-6)}`,
      agama: agama || 'ISLAM',
      jalan: jalan || 'Jl. Raya Pakuhaji No. 1',
      rtRw: rtRw || '001/001',
      kelurahan: kelurahan || 'Pakuhaji',
      kecamatan: kecamatan || 'Pakuhaji',
      kabupaten: kabupaten || 'Kabupaten Tangerang',
      provinsi: provinsi || 'Banten',
      kodePos: kodePos || '15570',
      lintang: lintang ? parseFloat(lintang) : -6.124567,
      bujur: bujur ? parseFloat(bujur) : 106.125678,
      kelasId,
      kelasNama: klsMatch?.nama || 'X.1',
      jenisKelamin: jenisKelamin === 'PEREMPUAN' ? 'PEREMPUAN' : 'LAKI_LAKI',
      username,
      email,
      defaultPassword: 'Masuk123!',
    };

    RUNTIME_STUDENTS.unshift(newStudent);

    return NextResponse.json({
      success: true,
      message: 'Murid baru berhasil didaftarkan.',
      data: newStudent,
    });
  } catch (error) {
    console.error('[API_MURID_POST] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan murid.' },
      { status: 500 }
    );
  }
}

// PUT: Perbarui Data Murid Lengkap (Update)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateFields } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID murid wajib disertakan.' },
        { status: 400 }
      );
    }

    try {
      const updated = await db.murid.update({
        where: { id },
        data: {
          nama: updateFields.nama,
          nis: updateFields.nis,
          nisn: updateFields.nisn,
          nik: updateFields.nik,
          noKk: updateFields.noKk,
          tempatLahir: updateFields.tempatLahir,
          tanggalLahir: updateFields.tanggalLahir ? new Date(updateFields.tanggalLahir) : undefined,
          noAktaLahir: updateFields.noAktaLahir,
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
          kelasId: updateFields.kelasId,
          jenisKelamin: updateFields.jenisKelamin,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Data identitas murid berhasil diperbarui.',
        data: updated,
      });
    } catch (dbError) {
      console.warn('[API_MURID_PUT] DB update error, using in-memory store:', (dbError as Error).message);
    }

    // Update in-memory
    const index = RUNTIME_STUDENTS.findIndex((s) => s.id === id);
    if (index !== -1) {
      const existing = RUNTIME_STUDENTS[index]!;
      const klsMatch = SEED_CLASSES.find((c) => c.id === (updateFields.kelasId || existing.kelasId));

      RUNTIME_STUDENTS[index] = {
        ...existing,
        ...updateFields,
        kelasNama: klsMatch?.nama || existing.kelasNama,
      };

      return NextResponse.json({
        success: true,
        message: 'Data identitas murid berhasil diperbarui.',
        data: RUNTIME_STUDENTS[index],
      });
    }

    return NextResponse.json(
      { success: false, message: 'Murid tidak ditemukan.' },
      { status: 404 }
    );
  } catch (error) {
    console.error('[API_MURID_PUT] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui data murid.' },
      { status: 500 }
    );
  }
}

// DELETE: Hapus Data Murid
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID murid wajib disertakan.' },
        { status: 400 }
      );
    }

    try {
      await db.murid.delete({ where: { id } });
      return NextResponse.json({
        success: true,
        message: 'Data murid berhasil dihapus.',
      });
    } catch (dbError) {
      console.warn('[API_MURID_DELETE] DB delete error, using in-memory store:', (dbError as Error).message);
    }

    RUNTIME_STUDENTS = RUNTIME_STUDENTS.filter((s) => s.id !== id);

    return NextResponse.json({
      success: true,
      message: 'Data murid berhasil dihapus dari sistem.',
    });
  } catch (error) {
    console.error('[API_MURID_DELETE] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus data murid.' },
      { status: 500 }
    );
  }
}
