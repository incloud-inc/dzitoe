import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getTodayStudentAttendance,
  getStudentAttendanceHistory,
  recordStudentAttendance,
  SCHOOL_COORDINATES,
  SEED_STUDENTS,
  getAllParents,
} from '@dzitoe/db';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@dzitoe/auth';
import {
  sendAttendanceWhatsAppNotification,
  sendLeaveWhatsAppNotification,
} from '@dzitoe/utils';

async function getAuthenticatedStudent() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = token ? await verifySessionToken(token) : null;

  if (!user) {
    return { user: null, student: null, error: 'Unauthorized: Sesi tidak ditemukan atau kadaluarsa.' };
  }

  if (user.role === 'ORANG_TUA') {
    const parents = getAllParents();
    const parent = parents.find(
      (p) => p.userId === user.id || p.noHp === user.username || (p.email && p.email === user.username)
    );
    const targetStudentId = parent?.muridIds?.[0];
    const student = SEED_STUDENTS.find(
      (s) => s.id === targetStudentId || s.nisn === targetStudentId
    ) || SEED_STUDENTS[0];
    return { user, student, isParent: true };
  }

  if (user.role !== 'MURID' && user.role !== 'ADMIN') {
    return { user, student: null, error: 'Akses khusus Murid dan Orang Tua.' };
  }

  const student = SEED_STUDENTS.find(
    (s) =>
      s.id === user.muridId ||
      s.userId === user.id ||
      s.username.toLowerCase() === user.username.toLowerCase() ||
      s.nisn === user.nisn
  );

  if (!student) {
    return { user, student: null, error: 'Profil murid tidak terdaftar dalam sistem.' };
  }

  return { user, student };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const auth = await getAuthenticatedStudent();
    if (!auth.user) {
      return NextResponse.json(
        { success: false, message: 'Autentikasi gagal. Silakan login terlebih dahulu.' },
        { status: 401 }
      );
    }
    if (!auth.student) {
      return NextResponse.json(
        { success: false, message: auth.error || 'Murid tidak ditemukan' },
        { status: 404 }
      );
    }

    const { student } = auth;
    const todayRecord = getTodayStudentAttendance(student.id);
    const history = getStudentAttendanceHistory(student.id, 10);

    return NextResponse.json(
      {
        success: true,
        data: {
          student: {
            id: student.id,
            nama: student.nama,
            nisn: student.nisn,
            kelasNama: student.kelasNama,
          },
          todayRecord,
          history,
          school: SCHOOL_COORDINATES,
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem saat memuat data presensi.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedStudent();
    if (!auth.user) {
      return NextResponse.json(
        { success: false, message: 'Autentikasi gagal. Silakan login terlebih dahulu.' },
        { status: 401 }
      );
    }
    if (!auth.student) {
      return NextResponse.json(
        { success: false, message: auth.error || 'Akun tidak valid untuk presensi.' },
        { status: 403 }
      );
    }

    const { student, user } = auth;

    const body = await request.json();
    const {
      type,
      latitude,
      longitude,
      isDemo,
      selfieUrl,
      notes,
      method = 'GPS',
      attachmentUrl,
      livenessVerified,
      imageHash,
    } = body;

    if (!type || !['MASUK', 'PULANG', 'IZIN', 'SAKIT'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Tipe presensi tidak valid (MASUK, PULANG, IZIN, atau SAKIT).' },
        { status: 400 }
      );
    }

    // Hanya izinkan mode demo jika bukan di production atau user adalah ADMIN
    const safeIsDemo = Boolean(isDemo) && (process.env.NODE_ENV !== 'production' || user.role === 'ADMIN');

    const result = recordStudentAttendance({
      muridId: student.id,
      type,
      latitude: typeof latitude === 'number' ? latitude : null,
      longitude: typeof longitude === 'number' ? longitude : null,
      isDemo: safeIsDemo,
      selfieUrl: selfieUrl || null,
      notes: notes || null,
      method: (method as 'GPS' | 'SELFIE' | 'QR') || (selfieUrl ? 'SELFIE' : 'GPS'),
      attachmentUrl: attachmentUrl || null,
      livenessVerified: Boolean(livenessVerified),
      imageHash: imageHash || null,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    // Trigger Notifikasi Otomatis ke WhatsApp Orang Tua / Wali (Task B13.1)
    let waNotification = null;
    try {
      const parents = getAllParents();
      const parent = parents.find((p) => p.muridIds && (p.muridIds.includes(student.id) || p.muridIds.includes(student.nisn)));

      if (parent && parent.noHp) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

        if (type === 'MASUK' || type === 'PULANG') {
          waNotification = sendAttendanceWhatsAppNotification({
            studentName: student.nama,
            studentClass: student.kelasNama,
            studentNisn: student.nisn,
            parentPhone: parent.noHp,
            parentName: parent.nama,
            timeStr,
            dateStr,
            status: type === 'PULANG' ? 'PULANG' : result.record?.status === 'TERLAMBAT' ? 'TERLAMBAT' : 'TEPAT',
            method: (method as 'GPS' | 'SELFIE' | 'QR') || (selfieUrl ? 'SELFIE' : 'GPS'),
            coords: latitude && longitude ? { lat: latitude, lng: longitude } : undefined,
          });
        } else if (type === 'IZIN' || type === 'SAKIT') {
          waNotification = sendLeaveWhatsAppNotification({
            studentName: student.nama,
            studentClass: student.kelasNama,
            parentPhone: parent.noHp,
            parentName: parent.nama,
            type: type as 'IZIN' | 'SAKIT',
            startDate: dateStr,
            reason: notes || 'Permohonan mandiri via mobile PWA',
          });
        }
      }
    } catch (waErr) {
      console.warn('[WHATSAPP_NOTIFICATION_NON_BLOCKING_ERROR]', waErr);
    }

    return NextResponse.json({
      success: true,
      data: result.record,
      message: result.message,
      waNotification,
    });
  } catch (error) {
    console.error('Error recording student attendance:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat memproses absensi.' },
      { status: 500 }
    );
  }
}
