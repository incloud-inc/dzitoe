import { NextRequest, NextResponse } from 'next/server';
import { db } from '@dzitoe/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { judul, konten } = body;

    const data = await db.paragraf.update({
      where: { id },
      data: { judul, konten }
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Pastikan tidak ada soal yang terkait sebelum menghapus?
    // Atau ubah onDelete menjadi SetNull. Di schema sudah SetNull, jadi hapus aman.
    await db.paragraf.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Paragraf berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
