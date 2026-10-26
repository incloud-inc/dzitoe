// ==============================================================================
// DZITOE — API Tiket Permohonan Informasi Publik (PPID) (@apps/admin)
// SMAN 20 Kabupaten Tangerang
// Module A25: Portal Keterbukaan Informasi Publik
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  getAllPermohonan,
  createPermohonan,
  getPermohonanByIdOrTicket,
  getPPIDStats,
} from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const ticket = searchParams.get('ticket') || undefined;
    const search = searchParams.get('search')?.toLowerCase() || undefined;

    if (ticket) {
      const match = getPermohonanByIdOrTicket(ticket);
      return NextResponse.json({
        success: true,
        data: match ? [match] : [],
      });
    }

    let data = getAllPermohonan();

    if (status && status !== 'ALL') {
      data = data.filter((r) => r.status === status);
    }

    if (search) {
      data = data.filter(
        (r) =>
          r.nomorTiket.toLowerCase().includes(search) ||
          r.namaPemohon.toLowerCase().includes(search) ||
          r.nik.toLowerCase().includes(search) ||
          r.rincianInformasi.toLowerCase().includes(search) ||
          r.email.toLowerCase().includes(search)
      );
    }

    const stats = getPPIDStats();

    return NextResponse.json({
      success: true,
      data,
      stats,
    });
  } catch (error: any) {
    console.error('[API PPID Permohonan] GET Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal memuat permohonan informasi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.namaPemohon || !body.nik || !body.kontak || !body.email || !body.rincianInformasi) {
      return NextResponse.json(
        {
          success: false,
          message: 'Nama Pemohon, NIK, Nomor HP/WhatsApp, Email, dan Rincian Informasi wajib diisi',
        },
        { status: 400 }
      );
    }

    const created = createPermohonan({
      namaPemohon: body.namaPemohon,
      nik: body.nik,
      kategoriPemohon: body.kategoriPemohon || 'PERORANGAN',
      kontak: body.kontak,
      email: body.email,
      alamat: body.alamat || 'Kabupaten Tangerang',
      rincianInformasi: body.rincianInformasi,
      tujuanPenggunaan: body.tujuanPenggunaan || 'Transparansi Keterbukaan Informasi Publik',
      caraMemperoleh: body.caraMemperoleh || 'SALINAN_DIGITAL',
      catatanPetugas: null,
      dokumenJawabanUrl: null,
      petugasPenerima: 'Portal PPID Daring',
    });

    return NextResponse.json({
      success: true,
      message: `Permohonan informasi publik berhasil diajukan dengan Kode Tiket ${created.nomorTiket}`,
      data: created,
    });
  } catch (error: any) {
    console.error('[API PPID Permohonan] POST Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal mengajukan permohonan informasi' },
      { status: 400 }
    );
  }
}
