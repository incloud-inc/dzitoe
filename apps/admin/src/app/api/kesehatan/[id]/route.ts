// ==============================================================================
// DZITOE — API Detail, Update & Delete Rekam Medis UKS (@apps/admin)
// SMAN 20 Kabupaten Tangerang
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getHealthRecordById, updateHealthRecord, deleteHealthRecord } from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const record = getHealthRecordById(params.id);
    if (!record) {
      return NextResponse.json(
        { success: false, message: 'Data kesehatan tidak ditemukan' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal memuat rekam medis' },
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
    const updated = updateHealthRecord(params.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Data kesehatan tidak ditemukan' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Rekam medis berhasil diperbarui',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal memperbarui rekam medis' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = deleteHealthRecord(params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Data kesehatan tidak ditemukan' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Rekam medis berhasil dihapus',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal menghapus rekam medis' },
      { status: 500 }
    );
  }
}
