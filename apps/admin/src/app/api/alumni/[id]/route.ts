// ==============================================================================
// DZITOE — API Detail, Update & Delete Alumni (@apps/admin)
// SMAN 20 Kabupaten Tangerang
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAlumniById, updateAlumni, deleteAlumni } from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const alumni = getAlumniById(params.id);
    if (!alumni) {
      return NextResponse.json(
        { success: false, message: 'Alumni tidak ditemukan' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: alumni });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal memuat detail alumni' },
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
    const updated = updateAlumni(params.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Alumni tidak ditemukan' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Data alumni berhasil diperbarui',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal memperbarui data alumni' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = deleteAlumni(params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Alumni tidak ditemukan' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Data alumni berhasil dihapus',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal menghapus data alumni' },
      { status: 500 }
    );
  }
}
