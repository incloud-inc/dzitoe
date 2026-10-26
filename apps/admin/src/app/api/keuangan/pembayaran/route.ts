import { NextRequest, NextResponse } from 'next/server';
import { catatPembayaran, getAllPembayaran } from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const data = getAllPembayaran(search);
    return NextResponse.json({ success: true, data, count: data.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.tagihanId || !body.nominal || !body.metode) {
      return NextResponse.json(
        { success: false, error: 'Tagihan ID, nominal, dan metode pembayaran wajib diisi' },
        { status: 400 }
      );
    }

    const receipt = catatPembayaran({
      tagihanId: body.tagihanId,
      cicilanId: body.cicilanId,
      nominal: Number(body.nominal),
      metode: body.metode,
      referensi: body.referensi,
      buktiUrl: body.buktiUrl,
      petugas: body.petugas,
      catatan: body.catatan,
    });

    return NextResponse.json({
      success: true,
      data: receipt,
      message: 'Pembayaran berhasil diverifikasi dan kwitansi resmi telah diterbitkan',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
