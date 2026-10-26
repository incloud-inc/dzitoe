import { NextRequest, NextResponse } from 'next/server';
import {
  getAllMutations,
  recordMutation,
  deleteMutation,
  getAllStudents,
  updateStudent,
  JenisMutasi,
} from '@dzitoe/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const jenis = searchParams.get('jenis') || 'ALL';

    const allMutations = getAllMutations();

    let filtered = allMutations;

    if (jenis !== 'ALL') {
      filtered = filtered.filter((m) => m.jenisMutasi === jenis);
    }

    if (search) {
      filtered = filtered.filter(
        (m) =>
          m.muridNama.toLowerCase().includes(search) ||
          m.nis.includes(search) ||
          m.nisn.includes(search) ||
          m.nomorSurat.toLowerCase().includes(search) ||
          (m.sekolahTujuan && m.sekolahTujuan.toLowerCase().includes(search)) ||
          (m.sekolahAsal && m.sekolahAsal.toLowerCase().includes(search))
      );
    }

    // Hitung ringkasan statistik
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
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memuat data mutasi murid' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.muridId || !body.jenisMutasi || !body.tanggalMutasi || !body.nomorSurat || !body.alasan) {
      return NextResponse.json(
        { success: false, message: 'Data mutasi tidak lengkap (Murid, Jenis, Tanggal, No. Surat, dan Alasan wajib diisi)' },
        { status: 400 }
      );
    }

    // Ambil data murid
    const allStudents = getAllStudents();
    const student = allStudents.find((s) => s.id === body.muridId || s.nis === body.muridId || s.nisn === body.muridId);

    const muridNama = student?.nama || body.muridNama || 'Murid Tidak Dikenal';
    const nis = student?.nis || body.nis || '-';
    const nisn = student?.nisn || body.nisn || '-';
    const kelasAsal = student?.kelasNama || body.kelasAsal || '-';

    const newMutation = recordMutation({
      muridId: body.muridId,
      muridNama,
      nis,
      nisn,
      kelasAsal,
      jenisMutasi: body.jenisMutasi as JenisMutasi,
      tanggalMutasi: body.tanggalMutasi,
      nomorSurat: body.nomorSurat,
      sekolahTujuan: body.sekolahTujuan,
      sekolahAsal: body.sekolahAsal,
      alasan: body.alasan,
      catatan: body.catatan,
      statusApproval: body.statusApproval || 'DISETUJUI',
      operatorNama: body.operatorNama || 'Staf Tata Usaha SMAN 20',
    });

    // Update status di student-store jika murid keluar/lulus/DO
    if (student && (body.jenisMutasi === 'PINDAH_KELUAR' || body.jenisMutasi === 'DROP_OUT')) {
      updateStudent(student.id, {
        status: body.jenisMutasi,
      } as any);
    } else if (student && body.jenisMutasi === 'LULUS') {
      updateStudent(student.id, {
        status: 'LULUS',
      } as any);
    }

    return NextResponse.json({
      success: true,
      message: `Mutasi murid "${muridNama}" berhasil direkam`,
      data: newMutation,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menyimpan mutasi murid' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID Mutasi wajib disertakan' },
        { status: 400 }
      );
    }

    const deleted = deleteMutation(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Data mutasi tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Data mutasi berhasil dihapus',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menghapus data mutasi' },
      { status: 500 }
    );
  }
}
