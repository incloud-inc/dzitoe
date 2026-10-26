import { NextResponse } from 'next/server';
import prisma from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await prisma.kopNaskah.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/bank-soal/kop-naskah error:', error);
    return NextResponse.json({ success: false, error: 'Gagal' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await prisma.kopNaskah.create({
      data: {
        namaLembaga: body.namaLembaga,
        namaSekolah: body.namaSekolah,
        alamat: body.alamat,
        logoKiriUrl: body.logoKiriUrl,
        logoKananUrl: body.logoKananUrl,
      }
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('POST /api/bank-soal/kop-naskah error:', error);
    return NextResponse.json({ success: false, error: 'Gagal' }, { status: 500 });
  }
}
