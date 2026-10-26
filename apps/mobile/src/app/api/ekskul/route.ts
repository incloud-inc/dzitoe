import { NextResponse } from 'next/server';
import {
  getAllEkskul,
  type EkskulKategori,
} from '@dzitoe/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase().trim() || '';
  const kategori = searchParams.get('kategori') as EkskulKategori | null;

  try {
    let list = getAllEkskul();

    if (search) {
      list = list.filter(
        (e) =>
          e.nama.toLowerCase().includes(search) ||
          e.kode.toLowerCase().includes(search) ||
          e.pembinaNama.toLowerCase().includes(search) ||
          e.deskripsi.toLowerCase().includes(search) ||
          e.lokasi.toLowerCase().includes(search)
      );
    }

    if (kategori) {
      list = list.filter((e) => e.kategori === kategori);
    }

    const all = getAllEkskul();
    const summary = {
      totalEkskul: all.length,
      totalAnggota: all.reduce((acc, curr) => acc + (curr.jumlahAnggota || 0), 0),
      olahraga: all.filter((e) => e.kategori === 'OLAHRAGA').length,
      belaNegara: all.filter((e) => e.kategori === 'BELA_NEGARA' || e.kategori === 'KEPANDUAN').length,
      seniDanAkademik: all.filter((e) => e.kategori === 'KESENIAN' || e.kategori === 'AKADEMIK').length,
    };

    return NextResponse.json({
      success: true,
      data: list,
      total: list.length,
      summary,
    });
  } catch (error) {
    console.error('[API_MOBILE_EKSKUL_GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat katalog ekstrakurikuler.' },
      { status: 500 }
    );
  }
}
