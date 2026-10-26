// ==============================================================================
// DZITOE — API PPID Permohonan Detail, Disposisi & Update Status (@apps/admin)
// SMAN 20 Kabupaten Tangerang
// Module A25: Portal Keterbukaan Informasi Publik
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  getPermohonanByIdOrTicket,
  updatePermohonan,
  deletePermohonan,
} from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = getPermohonanByIdOrTicket(params.id);
    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Tiket permohonan informasi tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal memuat tiket permohonan' },
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
    const updated = updatePermohonan(params.id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Tiket permohonan informasi tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Status permohonan tiket ${updated.nomorTiket} berhasil diperbarui menjadi ${updated.status}`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal memperbarui status permohonan' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ok = deletePermohonan(params.id);
    if (!ok) {
      return NextResponse.json(
        { success: false, message: 'Tiket permohonan informasi tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tiket permohonan informasi berhasil dihapus',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal menghapus tiket permohonan' },
      { status: 500 }
    );
  }
}
