// ==============================================================================
// DZITOE — API Rombel Kelas & Ruang Belajar (@apps/admin)
// Task: Modul A5 / A7 — CRUD Rombel Kelas & Ruang SMAN 20 Kab Tangerang
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
} from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tingkat = searchParams.get('tingkat');
    const search = searchParams.get('search')?.toLowerCase().trim() || '';

    let items = getAllClasses();

    if (tingkat && tingkat !== 'ALL') {
      items = items.filter((c) => c.tingkat === tingkat);
    }

    if (search) {
      items = items.filter(
        (c) =>
          c.nama.toLowerCase().includes(search) ||
          c.ruang.toLowerCase().includes(search) ||
          (c.waliKelasNama && c.waliKelasNama.toLowerCase().includes(search))
      );
    }

    const all = getAllClasses();
    const summary = {
      total: all.length,
      tingkatX: all.filter((c) => c.tingkat === 'X').length,
      tingkatXI: all.filter((c) => c.tingkat === 'XI').length,
      tingkatXII: all.filter((c) => c.tingkat === 'XII').length,
      totalKapasitas: all.reduce((sum, c) => sum + (c.kapasitas || 36), 0),
      totalMurid: all.reduce((sum, c) => sum + (c.jumlahMurid || 0), 0),
    };

    return NextResponse.json({
      success: true,
      data: items,
      summary,
    });
  } catch (error: any) {
    console.error('[API /api/kelas GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat rombel kelas: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, tingkat, ruang, waliKelasId, waliKelasNama, kapasitas, tahunAjaran } = body;

    if (!nama || !tingkat) {
      return NextResponse.json(
        { success: false, message: 'Nama rombel dan tingkat kelas wajib diisi!' },
        { status: 400 }
      );
    }

    const result = createClass({
      nama,
      tingkat,
      ruang,
      waliKelasId,
      waliKelasNama,
      kapasitas: Number(kapasitas) || 36,
      tahunAjaran,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    console.error('[API /api/kelas POST] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambah rombel kelas: ' + error.message },
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
        { success: false, message: 'ID rombel kelas wajib disertakan!' },
        { status: 400 }
      );
    }

    const result = updateClass(id, updates);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    console.error('[API /api/kelas PUT] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui rombel kelas: ' + error.message },
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
        { success: false, message: 'Parameter id rombel wajib disertakan!' },
        { status: 400 }
      );
    }

    const result = deleteClass(id);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error('[API /api/kelas DELETE] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus rombel kelas: ' + error.message },
      { status: 500 }
    );
  }
}
