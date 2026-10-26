import { NextRequest, NextResponse } from 'next/server';
import { getLaporanKeuanganTahunan, getAllFinanceData, addTransaksiKas } from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tahunAjaran = searchParams.get('tahunAjaran') || '2025/2026';

    const rekap = getLaporanKeuanganTahunan(tahunAjaran);
    const fullData = getAllFinanceData();

    return NextResponse.json({
      success: true,
      data: {
        rekap,
        transaksi: fullData.transaksi,
      },
      meta: {
        sekolah: 'SMAN 20 Kabupaten Tangerang',
        npsn: '20613840',
        inspektorat: 'Inspektorat Daerah & Pengawas Dinas Pendidikan Banten',
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memuat data laporan keuangan tahunan' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.nominal || !body.posId || !body.uraian || !body.nomorBukti) {
      return NextResponse.json(
        { success: false, error: 'Data transaksi tidak lengkap' },
        { status: 400 }
      );
    }

    const newTx = addTransaksiKas({
      tanggal: body.tanggal || new Date().toISOString().split('T')[0],
      nomorBukti: body.nomorBukti,
      posId: body.posId,
      posNama: body.posNama || 'Transaksi Kas',
      tipe: body.tipe || 'MASUK',
      sumberDana: body.sumberDana || 'BOS',
      uraian: body.uraian,
      nominal: Number(body.nominal),
      keterangan: body.keterangan,
      pj: body.pj || 'Bendahara Sekolah',
    });

    return NextResponse.json({
      success: true,
      data: newTx,
      message: 'Transaksi keuangan berhasil dicatat',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menyimpan transaksi kas' },
      { status: 500 }
    );
  }
}
