import { NextRequest, NextResponse } from 'next/server';
import { getAllTagihan, generateTagihanMassal, getTagihanById } from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (id) {
      const single = getTagihanById(id);
      return NextResponse.json({ success: !!single, data: single });
    }

    const rombelId = searchParams.get('rombelId') || undefined;
    const tingkat = searchParams.get('tingkat') || undefined;
    const status = searchParams.get('status') || undefined;
    const jenisId = searchParams.get('jenisId') || undefined;
    const search = searchParams.get('search') || undefined;

    const list = getAllTagihan({ rombelId, tingkat, status, jenisId, search });
    return NextResponse.json({ success: true, data: list, count: list.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.jenisId || !body.periodeLabel || !body.jatuhTempo) {
      return NextResponse.json(
        { success: false, error: 'Jenis tagihan, label periode, dan jatuh tempo wajib diisi' },
        { status: 400 }
      );
    }

    const res = generateTagihanMassal({
      jenisId: body.jenisId,
      tingkat: body.tingkat || 'ALL',
      rombelId: body.rombelId,
      periodeLabel: body.periodeLabel,
      nominalOverride: body.nominal ? Number(body.nominal) : undefined,
      jatuhTempo: body.jatuhTempo,
      jumlahCicilan: body.jumlahCicilan ? Number(body.jumlahCicilan) : undefined,
    });

    return NextResponse.json({ success: true, ...res });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
