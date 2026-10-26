import { NextResponse } from 'next/server';
import { getAllAttendance, TODAY_DATE_STR } from '@dzitoe/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tanggal = searchParams.get('tanggal') || TODAY_DATE_STR;
    const kelasId = searchParams.get('kelasId') || '';

    const all = getAllAttendance();
    let filtered = all.filter((a) => a.tanggal === tanggal);

    if (kelasId) {
      filtered = filtered.filter((a) => a.kelasId === kelasId);
    }

    const headers = [
      'No',
      'NISN',
      'Nama Siswa',
      'Kelas',
      'Tanggal',
      'Jam Masuk',
      'Jam Pulang',
      'Status',
      'Jarak GPS (Meter)',
      'Radius Sekolah',
      'Keterangan',
    ];

    const rows = filtered.map((item, idx) => [
      String(idx + 1),
      item.nisn,
      `"${item.muridNama}"`,
      `"${item.kelasNama}"`,
      item.tanggal,
      item.jamMasuk || '-',
      item.jamPulang || '-',
      item.status,
      item.distanceFromSchool !== null ? String(item.distanceFromSchool) : '-',
      item.isWithinRadius ? 'Valid' : 'Luar Radius',
      `"${item.notes || '-'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="Rekap_Presensi_SMAN20_${tanggal}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting attendance CSV:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengekspor data absensi.' },
      { status: 500 }
    );
  }
}
