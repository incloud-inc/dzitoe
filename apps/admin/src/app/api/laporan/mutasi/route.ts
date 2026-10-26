import { NextRequest, NextResponse } from 'next/server';
import { getAllMutations } from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tahunAjaran = searchParams.get('tahunAjaran') || '2025/2026';
    const jenis = searchParams.get('jenis') || 'ALL';

    const allMutations = getAllMutations();

    let filtered = allMutations;
    if (jenis !== 'ALL') {
      filtered = filtered.filter((m) => m.jenisMutasi === jenis);
    }

    const stats = {
      total: allMutations.length,
      pindahKeluar: allMutations.filter((m) => m.jenisMutasi === 'PINDAH_KELUAR').length,
      pindahMasuk: allMutations.filter((m) => m.jenisMutasi === 'PINDAH_MASUK').length,
      lulus: allMutations.filter((m) => m.jenisMutasi === 'LULUS').length,
      dropOut: allMutations.filter((m) => m.jenisMutasi === 'DROP_OUT').length,
    };

    return NextResponse.json({
      success: true,
      data: filtered,
      stats,
      meta: {
        sekolah: 'SMAN 20 Kabupaten Tangerang',
        npsn: '20613840',
        wilayah: 'Cabang Dinas Pendidikan Wilayah Kabupaten Tangerang - Prov. Banten',
        tahunAjaran,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memuat data laporan mutasi' },
      { status: 500 }
    );
  }
}
