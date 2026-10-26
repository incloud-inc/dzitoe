// ==============================================================================
// DZITOE — API Dokumen Keterbukaan Informasi Publik (PPID) (@apps/admin)
// SMAN 20 Kabupaten Tangerang
// Module A25: Portal Keterbukaan Informasi Publik
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  getAllDokumenPublik,
  createDokumenPublik,
  getPPIDStats,
} from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get('kategori') || undefined;
    const search = searchParams.get('search')?.toLowerCase() || undefined;

    let data = getAllDokumenPublik();

    if (kategori && kategori !== 'ALL') {
      data = data.filter((d) => d.kategori === kategori);
    }

    if (search) {
      data = data.filter(
        (d) =>
          d.judul.toLowerCase().includes(search) ||
          d.nomorDokumen.toLowerCase().includes(search) ||
          d.deskripsi.toLowerCase().includes(search) ||
          d.pejabatPengesah.toLowerCase().includes(search)
      );
    }

    const stats = getPPIDStats();

    return NextResponse.json({
      success: true,
      data,
      stats,
    });
  } catch (error: any) {
    console.error('[API PPID Dokumen] GET Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal memuat dokumen publik' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.judul || !body.kategori || !body.nomorDokumen) {
      return NextResponse.json(
        {
          success: false,
          message: 'Nomor Dokumen, Judul Informasi, dan Kategori Klasifikasi wajib diisi',
        },
        { status: 400 }
      );
    }

    const created = createDokumenPublik({
      nomorDokumen: body.nomorDokumen,
      judul: body.judul,
      kategori: body.kategori,
      deskripsi: body.deskripsi || '',
      pejabatPengesah: body.pejabatPengesah || 'PPID SMAN 20 Kab. Tangerang',
      tanggalPublikasi: body.tanggalPublikasi || new Date().toISOString(),
      tahunAnggaran: body.tahunAnggaran ? Number(body.tahunAnggaran) : null,
      fileUrl: body.fileUrl || '/documents/ppid/sample-document.pdf',
      fileSize: body.fileSize || '1.5 MB',
      fileType: body.fileType || 'PDF',
      isPublic: body.isPublic !== undefined ? Boolean(body.isPublic) : true,
    });

    return NextResponse.json({
      success: true,
      message: 'Dokumen informasi publik berhasil diterbitkan',
      data: created,
    });
  } catch (error: any) {
    console.error('[API PPID Dokumen] POST Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal menerbitkan dokumen publik' },
      { status: 400 }
    );
  }
}
