// ==============================================================================
// DZITOE — API Detail, Update & Delete Pelayanan BK (@apps/admin)
// SMAN 20 Kabupaten Tangerang
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getBKRecordById, updateBKRecord, deleteBKRecord } from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const record = getBKRecordById(params.id);
    if (!record) {
      return NextResponse.json(
        { success: false, message: 'Data pelayanan BK tidak ditemukan' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal memuat catatan BK' },
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
    const updated = updateBKRecord(params.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Data pelayanan BK tidak ditemukan' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Catatan pelayanan BK berhasil diperbarui',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal memperbarui catatan BK' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = deleteBKRecord(params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Data pelayanan BK tidak ditemukan' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Catatan pelayanan BK berhasil dihapus',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal menghapus catatan BK' },
      { status: 500 }
    );
  }
}
