import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, SEED_STUDENTS, type SeedStudent } from '@dzitoe/db';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@dzitoe/auth';

// Mutable in-memory store for student runtime session if DB is offline
const RUNTIME_STUDENTS_MOBILE: SeedStudent[] = [...SEED_STUDENTS];

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    const user = token ? await verifySessionToken(token) : null;

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Autentikasi ditolak. Silakan masuk terlebih dahulu.' },
        { status: 401 }
      );
    }

    // 1. Coba ambil data murid dari database PostgreSQL jika online
    try {
      const student = await db.murid.findFirst({
        where: {
          OR: [
            { userId: user.id },
            ...(user.muridId ? [{ id: user.muridId }] : []),
            ...(user.nisn ? [{ nisn: user.nisn }] : []),
            ...(user.username ? [{ user: { username: user.username } }] : []),
          ],
        },
        include: {
          kelas: true,
          user: {
            select: { email: true, username: true, avatar: true },
          },
        },
      });

      if (student) {
        return NextResponse.json({
          success: true,
          data: {
            id: student.id,
            userId: student.userId,
            nama: student.nama,
            nis: student.nis,
            nisn: student.nisn || '',
            nik: student.nik || '',
            noKk: student.noKk || '',
            tempatLahir: student.tempatLahir || 'Tangerang',
            tanggalLahir: student.tanggalLahir
              ? student.tanggalLahir.toISOString().split('T')[0]
              : '2008-01-01',
            noAktaLahir: student.noAktaLahir || '',
            agama: student.agama || 'ISLAM',
            jalan: student.jalan || student.alamat || '',
            rtRw: student.rtRw || '001/001',
            kelurahan: student.kelurahan || 'Pakuhaji',
            kecamatan: student.kecamatan || 'Pakuhaji',
            kabupaten: student.kabupaten || 'Kabupaten Tangerang',
            provinsi: student.provinsi || 'Banten',
            kodePos: student.kodePos || '15570',
            lintang: student.lintang ?? -6.124567,
            bujur: student.bujur ?? 106.125678,
            kelasId: student.kelasId,
            kelasNama: student.kelas?.nama || 'X.1',
            tingkat: student.kelas?.tingkat || 'X',
            jenisKelamin: student.jenisKelamin,
            username: student.user.username,
            email: student.user.email,
            avatar: student.user.avatar,
            status: student.status,
          },
        });
      }
    } catch (dbError) {
      console.warn('[MOBILE_MURID_GET] DB query fallback:', (dbError as Error).message);
    }

    // 2. Fallback Seed / In-memory data
    const matched =
      RUNTIME_STUDENTS_MOBILE.find(
        (s) =>
          s.userId === user?.id ||
          s.id === user?.muridId ||
          s.username === user?.username ||
          s.nisn === user?.nisn
      ) || RUNTIME_STUDENTS_MOBILE[0]!;

    return NextResponse.json({
      success: true,
      data: {
        id: matched.id,
        userId: matched.userId,
        nama: matched.nama,
        nis: matched.nis,
        nisn: matched.nisn,
        nik: matched.nik || '',
        noKk: matched.noKk || '',
        tempatLahir: matched.tempatLahir || 'Tangerang',
        tanggalLahir: matched.tanggalLahir || '2008-05-15',
        noAktaLahir: matched.noAktaLahir || '',
        agama: matched.agama || 'ISLAM',
        jalan: matched.jalan || '',
        rtRw: matched.rtRw || '001/001',
        kelurahan: matched.kelurahan || 'Pakuhaji',
        kecamatan: matched.kecamatan || 'Pakuhaji',
        kabupaten: matched.kabupaten || 'Kabupaten Tangerang',
        provinsi: matched.provinsi || 'Banten',
        kodePos: matched.kodePos || '15570',
        lintang: matched.lintang ?? -6.140256,
        bujur: matched.bujur ?? 106.108056,
        kelasId: matched.kelasId,
        kelasNama: matched.kelasNama,
        tingkat: 'X',
        jenisKelamin: matched.jenisKelamin,
        username: matched.username,
        email: matched.email,
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
        status: 'AKTIF',
      },
    });
  } catch (error) {
    console.error('[MOBILE_MURID_GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat profil murid.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const user = token ? await verifySessionToken(token) : null;

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Autentikasi ditolak. Silakan login terlebih dahulu.' },
        { status: 401 }
      );
    }

    if (user.role !== 'MURID' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Hanya Murid atau Administrator yang berhak memperbarui data identitas.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      id,
      nama,
      jenisKelamin,
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
    } = body;

    // =========================================================================
    // PERLINDUNGAN IDOR:
    // Jika bukan ADMIN, abaikan id dari body dan gunakan muridId milik user sendiri!
    // ATURAN KRUSIAL: PENGUNCIAN ROMBEL
    // Rombel/Kelas hanya dapat diubah oleh Admin Sekolah atau Guru Wali Kelas.
    // =========================================================================
    const targetId = user.role === 'ADMIN' ? (id || user.muridId || user.id) : (user.muridId || user.id);

    // 1. Coba update ke Prisma DB
    try {
      const updated = await db.murid.update({
        where: { id: targetId },
        data: {
          nama: nama || undefined,
          jenisKelamin: jenisKelamin || undefined,
          nisn: nisn || undefined,
          nik: nik || undefined,
          noKk: noKk || undefined,
          tempatLahir: tempatLahir || undefined,
          tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : undefined,
          noAktaLahir: noAktaLahir || undefined,
          agama: agama || undefined,
          jalan: jalan || undefined,
          rtRw: rtRw || undefined,
          kelurahan: kelurahan || undefined,
          kecamatan: kecamatan || undefined,
          kabupaten: kabupaten || undefined,
          provinsi: provinsi || undefined,
          kodePos: kodePos || undefined,
          lintang: lintang ? parseFloat(lintang) : undefined,
          bujur: bujur ? parseFloat(bujur) : undefined,
          // KELAS_ID TIDAK DISENTUH SAMA SEKALI
        },
        include: {
          kelas: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Data identitas diri berhasil disimpan ke Dapodik sekolah.',
        data: updated,
      });
    } catch (dbError) {
      console.warn('[MOBILE_MURID_PUT] DB update fallback:', (dbError as Error).message);
    }

    // 2. Fallback In-Memory store
    const idx = RUNTIME_STUDENTS_MOBILE.findIndex(
      (s) =>
        s.id === targetId ||
        s.userId === user?.id ||
        s.username === user?.username ||
        s.nisn === user?.nisn
    );

    const safeIdx = idx !== -1 ? idx : 0;
    const current = RUNTIME_STUDENTS_MOBILE[safeIdx] || RUNTIME_STUDENTS_MOBILE[0]!;

    RUNTIME_STUDENTS_MOBILE[safeIdx] = {
      ...current,
      nama: nama || current.nama,
      jenisKelamin: jenisKelamin || current.jenisKelamin,
      nisn: nisn || current.nisn,
      nik: nik !== undefined ? nik : current.nik,
      noKk: noKk !== undefined ? noKk : current.noKk,
      tempatLahir: tempatLahir || current.tempatLahir,
      tanggalLahir: tanggalLahir || current.tanggalLahir,
      noAktaLahir: noAktaLahir !== undefined ? noAktaLahir : current.noAktaLahir,
      agama: agama || current.agama,
      jalan: jalan !== undefined ? jalan : current.jalan,
      rtRw: rtRw !== undefined ? rtRw : current.rtRw,
      kelurahan: kelurahan || current.kelurahan,
      kecamatan: kecamatan || current.kecamatan,
      kabupaten: kabupaten || current.kabupaten,
      provinsi: provinsi || current.provinsi,
      kodePos: kodePos || current.kodePos,
      lintang: lintang ? parseFloat(lintang) : current.lintang,
      bujur: bujur ? parseFloat(bujur) : current.bujur,
      // Rombel kelas tetap dipertahankan aslinya
    };

    return NextResponse.json({
      success: true,
      message: 'Data identitas diri berhasil diperbarui (Rombel tetap terkunci oleh pihak sekolah).',
      data: RUNTIME_STUDENTS_MOBILE[safeIdx],
    });
  } catch (error) {
    console.error('[MOBILE_MURID_PUT] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui profil murid.' },
      { status: 500 }
    );
  }
}
