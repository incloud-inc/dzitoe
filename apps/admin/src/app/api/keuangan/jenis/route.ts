import { NextRequest, NextResponse } from 'next/server';
import {
  getAllJenisTagihan,
  createJenisTagihan,
  updateJenisTagihan,
  deleteJenisTagihan,
} from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = getAllJenisTagihan();
    return NextResponse.json({ success: true, data: list });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.nama || !body.kode || !body.defaultNominal) {
      return NextResponse.json(
        { success: false, error: 'Nama, kode, dan nominal default wajib diisi' },
        { status: 400 }
      );
    }

    const created = createJenisTagihan({
      kode: body.kode.toUpperCase(),
      nama: body.nama,
      periode: body.periode || 'BULANAN',
      defaultNominal: Number(body.defaultNominal),
      bolehCicil: Boolean(body.bolehCicil),
      maxCicilan: Number(body.maxCicilan || 1),
      jatuhTempoHari: Number(body.jatuhTempoHari || 10),
      aktif: body.aktif ?? true,
      tahunAjaran: body.tahunAjaran || '2025/2026',
      deskripsi: body.deskripsi,
    });

    return NextResponse.json({ success: true, data: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'ID jenis tagihan diperlukan' }, { status: 400 });
    }
    const updated = updateJenisTagihan(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Jenis tagihan tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID jenis tagihan diperlukan' }, { status: 400 });
    }
    const ok = deleteJenisTagihan(id);
    return NextResponse.json({ success: ok });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
