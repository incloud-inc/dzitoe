import { NextResponse } from 'next/server';
import {
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from '@dzitoe/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const subjects = getAllSubjects();
    return NextResponse.json({
      success: true,
      data: subjects,
      total: subjects.length,
    });
  } catch (error) {
    console.error('[API_MAPEL_GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat mata pelajaran.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { kode, nama, kelompok, jamPerMinggu } = body;

    if (!kode || !nama) {
      return NextResponse.json(
        { success: false, message: 'Kode dan Nama Mata Pelajaran wajib diisi.' },
        { status: 400 }
      );
    }

    const newSub = createSubject({
      kode: kode.toUpperCase().trim(),
      nama: nama.trim(),
      kelompok: kelompok || 'UMUM',
      jamPerMinggu: parseInt(jamPerMinggu || '2', 10),
    });

    return NextResponse.json({
      success: true,
      message: 'Mata pelajaran berhasil ditambahkan.',
      data: newSub,
    });
  } catch (error) {
    console.error('[API_MAPEL_POST] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan mata pelajaran.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, kode, nama, kelompok, jamPerMinggu } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID mata pelajaran wajib disertakan.' },
        { status: 400 }
      );
    }

    const updated = updateSubject(id, {
      kode: kode ? kode.toUpperCase().trim() : undefined,
      nama: nama ? nama.trim() : undefined,
      kelompok,
      jamPerMinggu: jamPerMinggu ? parseInt(jamPerMinggu, 10) : undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Mata pelajaran tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mata pelajaran berhasil diperbarui.',
      data: updated,
    });
  } catch (error) {
    console.error('[API_MAPEL_PUT] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui mata pelajaran.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID mata pelajaran wajib disertakan.' },
        { status: 400 }
      );
    }

    const deleted = deleteSubject(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Mata pelajaran tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mata pelajaran berhasil dihapus.',
    });
  } catch (error) {
    console.error('[API_MAPEL_DELETE] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus mata pelajaran.' },
      { status: 500 }
    );
  }
}
