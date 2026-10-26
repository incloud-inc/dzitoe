// ==============================================================================
// DZITOE — API Ekstrakurikuler (@apps/admin)
// Task: Modul A8 — Ekstrakurikuler & Pembinaan Bakat Minat
// Standar Permendikdasmen No. 1–6 Tahun 2026 Compliant
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  getAllEkskul,
  createEkskul,
  updateEkskul,
  deleteEkskul,
  type EkskulKategori,
} from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const kategori = searchParams.get('kategori') as EkskulKategori | null;

    let items = getAllEkskul();

    if (search) {
      items = items.filter(
        (e) =>
          e.nama.toLowerCase().includes(search) ||
          e.kode.toLowerCase().includes(search) ||
          e.pembinaNama.toLowerCase().includes(search) ||
          e.kategoriLabel.toLowerCase().includes(search)
      );
    }

    if (kategori) {
      items = items.filter((e) => e.kategori === kategori);
    }

    const all = getAllEkskul();
    const summary = {
      totalEkskul: all.length,
      totalAnggota: all.reduce((acc, curr) => acc + curr.jumlahAnggota, 0),
      olahraga: all.filter((e) => e.kategori === 'OLAHRAGA').length,
      belaNegara: all.filter((e) => e.kategori === 'BELA_NEGARA' || e.kategori === 'KEPANDUAN').length,
      seniDanAkademik: all.filter((e) => e.kategori === 'KESENIAN' || e.kategori === 'AKADEMIK').length,
    };

    return NextResponse.json({
      success: true,
      data: items,
      summary,
    });
  } catch (error: any) {
    console.error('[API /api/ekskul GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat data ekstrakurikuler: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kode, nama, kategori, kategoriLabel, deskripsi, pembinaGuruId, pembinaNama, pembinaNip, hariKegiatan, jamMulai, jamSelesai, lokasi, kuota, prestasiTerakhir, fotoUrl, status } = body;

    if (!kode || !nama || !kategori || !pembinaNama) {
      return NextResponse.json(
        { success: false, message: 'Field kode, nama, kategori, dan pembina wajib diisi!' },
        { status: 400 }
      );
    }

    const result = createEkskul({
      kode,
      nama,
      kategori,
      kategoriLabel: kategoriLabel || kategori,
      deskripsi: deskripsi || '',
      pembinaGuruId: pembinaGuruId || '',
      pembinaNama,
      pembinaNip: pembinaNip || '-',
      hariKegiatan: hariKegiatan || 'Sabtu',
      jamMulai: jamMulai || '15:30',
      jamSelesai: jamSelesai || '17:30',
      lokasi: lokasi || 'Area SMAN 20',
      kuota: Number(kuota) || 30,
      prestasiTerakhir: prestasiTerakhir || '-',
      fotoUrl: fotoUrl || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=500',
      status: status || 'AKTIF',
    });

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.ekskul,
    });
  } catch (error: any) {
    console.error('[API /api/ekskul POST] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal membuat ekstrakurikuler: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID ekstrakurikuler wajib diisi!' },
        { status: 400 }
      );
    }

    const result = updateEkskul(id, updates);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.ekskul,
    });
  } catch (error: any) {
    console.error('[API /api/ekskul PUT] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui ekstrakurikuler: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Parameter id ekstrakurikuler wajib disertakan!' },
        { status: 400 }
      );
    }

    const result = deleteEkskul(id);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error('[API /api/ekskul DELETE] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus ekstrakurikuler: ' + error.message },
      { status: 500 }
    );
  }
}
