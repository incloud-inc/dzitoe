import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getAllAnggotaEkskul,
  addAnggotaEkskul,
  removeAnggotaEkskul,
  SEED_STUDENTS,
} from '@dzitoe/db';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@dzitoe/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Helper untuk identifikasi murid dari cookie session
async function getCurrentStudent() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const user = token ? await verifySessionToken(token) : null;

    if (user) {
      const found = SEED_STUDENTS.find(
        (s) =>
          s.userId === user.id ||
          s.id === user.muridId ||
          s.username.toLowerCase() === user.username.toLowerCase() ||
          s.nisn === user.nisn
      );
      if (found) return found;
    }
  } catch (err) {
    console.warn('[EKSKUL_AUTH_HELPER] Error:', err);
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ekskulId = searchParams.get('ekskulId');
    const myOnly = searchParams.get('my') === 'true';

    const currentStudent = await getCurrentStudent();
    let anggota = getAllAnggotaEkskul(ekskulId || undefined);

    if (myOnly) {
      if (!currentStudent) {
        return NextResponse.json({
          success: true,
          data: [],
          currentStudent: null,
        });
      }
      anggota = anggota.filter(
        (a) => a.muridId === currentStudent.id || a.nisn === currentStudent.nisn
      );
    }

    return NextResponse.json({
      success: true,
      data: anggota,
      currentStudent: currentStudent
        ? {
            id: currentStudent.id,
            nama: currentStudent.nama,
            nisn: currentStudent.nisn,
            kelasNama: currentStudent.kelasNama,
          }
        : null,
    });
  } catch (error: any) {
    console.error('[API_MOBILE_EKSKUL_ANGGOTA_GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat data keanggotaan ekskul.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const currentStudent = await getCurrentStudent();
    if (!currentStudent) {
      return NextResponse.json(
        { success: false, message: 'Autentikasi ditolak. Silakan login terlebih dahulu.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { ekskulId } = body;

    if (!ekskulId) {
      return NextResponse.json(
        { success: false, message: 'ekskulId wajib diisi!' },
        { status: 400 }
      );
    }

    const result = addAnggotaEkskul(ekskulId, currentStudent.id, 'ANGGOTA');

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.anggota,
    });
  } catch (error: any) {
    console.error('[API_MOBILE_EKSKUL_ANGGOTA_POST] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mendaftar ekskul: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const currentStudent = await getCurrentStudent();
    if (!currentStudent) {
      return NextResponse.json(
        { success: false, message: 'Autentikasi ditolak. Silakan login terlebih dahulu.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const ekskulId = searchParams.get('ekskulId');

    if (!ekskulId) {
      return NextResponse.json(
        { success: false, message: 'ekskulId wajib diisi!' },
        { status: 400 }
      );
    }

    const all = getAllAnggotaEkskul();
    const record = all.find(
      (a) =>
        a.ekskulId === ekskulId &&
        (a.muridId === currentStudent.id || a.nisn === currentStudent.nisn)
    );

    if (!record) {
      return NextResponse.json(
        { success: false, message: 'Anda belum terdaftar di ekskul ini.' },
        { status: 404 }
      );
    }

    const result = removeAnggotaEkskul(record.id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API_MOBILE_EKSKUL_ANGGOTA_DELETE] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal membatalkan keanggotaan ekskul.' },
      { status: 500 }
    );
  }
}
