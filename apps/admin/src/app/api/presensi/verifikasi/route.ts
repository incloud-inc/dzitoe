// ==============================================================================
// DZITOE — API Verifikasi & Approval Izin/Sakit/Dispensasi (@apps/admin)
// Task: Modul A13 — Verifikasi Absensi Siswa & Guru
// Standar Permendikdasmen No. 1–6 Tahun 2026 Compliant
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  getAllPermits,
  createPermit,
  approvePermit,
  rejectPermit,
  type PermitStatus,
  type PermitType,
} from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as PermitStatus | null;
    const jenis = searchParams.get('jenis') as PermitType | null;
    const userType = searchParams.get('userType') as 'MURID' | 'GURU' | null;
    const search = searchParams.get('search')?.toLowerCase().trim() || '';

    let permits = getAllPermits();

    if (status) {
      permits = permits.filter((p) => p.status === status);
    }

    if (jenis) {
      permits = permits.filter((p) => p.jenis === jenis);
    }

    if (userType) {
      permits = permits.filter((p) => p.userType === userType);
    }

    if (search) {
      permits = permits.filter(
        (p) =>
          p.nama.toLowerCase().includes(search) ||
          p.identifier.includes(search) ||
          p.nomorSurat.toLowerCase().includes(search) ||
          p.kelasOrJabatan.toLowerCase().includes(search) ||
          p.alasan.toLowerCase().includes(search)
      );
    }

    const all = getAllPermits();
    const summary = {
      total: all.length,
      menunggu: all.filter((p) => p.status === 'MENUNGGU').length,
      disetujui: all.filter((p) => p.status === 'DISETUJUI').length,
      ditolak: all.filter((p) => p.status === 'DITOLAK').length,
      sakit: all.filter((p) => p.jenis === 'SAKIT').length,
      izin: all.filter((p) => p.jenis === 'IZIN').length,
      dispensasi: all.filter((p) => p.jenis === 'DISPENSASI').length,
    };

    return NextResponse.json({
      success: true,
      data: permits,
      summary,
    });
  } catch (error: any) {
    console.error('[API /api/presensi/verifikasi GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat daftar permohonan: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userType, userId, nama, identifier, kelasOrJabatan, jenis, tanggalMulai, tanggalSelesai, durasiHari, alasan, lampiranUrl } = body;

    if (!userType || !nama || !identifier || !jenis || !tanggalMulai || !alasan) {
      return NextResponse.json(
        { success: false, message: 'Data permohonan belum lengkap!' },
        { status: 400 }
      );
    }

    const result = createPermit({
      userType,
      userId: userId || identifier,
      nama,
      identifier,
      kelasOrJabatan: kelasOrJabatan || '-',
      jenis,
      tanggalMulai,
      tanggalSelesai: tanggalSelesai || tanggalMulai,
      durasiHari: durasiHari || 1,
      alasan,
      lampiranUrl,
    });

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.permit,
    });
  } catch (error: any) {
    console.error('[API /api/presensi/verifikasi POST] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengajukan permohonan: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, verifikatorNama, catatan } = body;

    if (!id || !action) {
      return NextResponse.json(
        { success: false, message: 'ID dan action (APPROVE/REJECT) wajib disertakan!' },
        { status: 400 }
      );
    }

    const verifikator = verifikatorNama || 'Admin Verifikator';

    if (action === 'APPROVE') {
      const result = approvePermit(id, verifikator, catatan);
      if (!result.success) {
        return NextResponse.json({ success: false, message: result.message }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: result.message,
        data: result.permit,
      });
    }

    if (action === 'REJECT') {
      const result = rejectPermit(id, verifikator, catatan || 'Tidak memenuhi persyaratan izin.');
      if (!result.success) {
        return NextResponse.json({ success: false, message: result.message }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: result.message,
        data: result.permit,
      });
    }

    return NextResponse.json({ success: false, message: 'Action tidak valid.' }, { status: 400 });
  } catch (error: any) {
    console.error('[API /api/presensi/verifikasi PUT] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memproses verifikasi permohonan: ' + error.message },
      { status: 500 }
    );
  }
}
