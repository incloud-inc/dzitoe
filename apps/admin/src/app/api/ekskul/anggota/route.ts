// ==============================================================================
// DZITOE — API Anggota Ekstrakurikuler (@apps/admin)
// Task: Modul A8.3 — Manajemen Anggota Siswa Ekskul
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  getAllAnggotaEkskul,
  addAnggotaEkskul,
  removeAnggotaEkskul,
} from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ekskulId = searchParams.get('ekskulId') || undefined;
    const anggota = getAllAnggotaEkskul(ekskulId);

    return NextResponse.json({
      success: true,
      data: anggota,
    });
  } catch (error: any) {
    console.error('[API /api/ekskul/anggota GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data anggota: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ekskulId, muridId, jabatan } = body;

    if (!ekskulId || !muridId) {
      return NextResponse.json(
        { success: false, message: 'ekskulId dan muridId wajib diisi!' },
        { status: 400 }
      );
    }

    const result = addAnggotaEkskul(ekskulId, muridId, jabatan || 'ANGGOTA');
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.anggota,
    });
  } catch (error: any) {
    console.error('[API /api/ekskul/anggota POST] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan anggota: ' + error.message },
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
        { success: false, message: 'Parameter id wajib disertakan!' },
        { status: 400 }
      );
    }

    const result = removeAnggotaEkskul(id);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error('[API /api/ekskul/anggota DELETE] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus anggota: ' + error.message },
      { status: 500 }
    );
  }
}
