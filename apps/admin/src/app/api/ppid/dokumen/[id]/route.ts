// ==============================================================================
// DZITOE — API PPID Dokumen Detail, Update, Delete & Track Download (@apps/admin)
// SMAN 20 Kabupaten Tangerang
// Module A25: Portal Keterbukaan Informasi Publik
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  getDokumenById,
  updateDokumenPublik,
  deleteDokumenPublik,
  incrementDownloadCount,
} from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const isDownload = searchParams.get('download') === 'true';

    if (isDownload) {
      const count = incrementDownloadCount(params.id);
      return NextResponse.json({ success: true, downloadCount: count });
    }

    const doc = getDokumenById(params.id);
    if (!doc) {
      return NextResponse.json(
        { success: false, message: 'Dokumen informasi publik tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: doc });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal memuat dokumen publik' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = updateDokumenPublik(params.id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Dokumen informasi publik tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Dokumen informasi publik berhasil diperbarui',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal memperbarui dokumen publik' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ok = deleteDokumenPublik(params.id);
    if (!ok) {
      return NextResponse.json(
        { success: false, message: 'Dokumen informasi publik tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Dokumen informasi publik berhasil dihapus',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal menghapus dokumen publik' },
      { status: 500 }
    );
  }
}
