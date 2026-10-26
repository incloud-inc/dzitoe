import { NextRequest, NextResponse } from 'next/server';
import {
  getAllParents,
  createParent,
  updateParent,
  deleteParent,
  getAllStudents,
} from '@dzitoe/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const hubungan = searchParams.get('hubungan') || 'ALL';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    const allParents = getAllParents();
    const allStudents = getAllStudents();

    // Map student details into parent objects
    const enrichedParents = allParents.map((parent) => {
      const relatedStudents = allStudents.filter(
        (s) => parent.muridIds.includes(s.id) || parent.muridIds.includes(s.nis) || parent.muridIds.includes(s.nisn)
      ).map((s) => ({
        id: s.id,
        nama: s.nama,
        nis: s.nis,
        nisn: s.nisn,
        kelasNama: s.kelasNama,
      }));

      return {
        ...parent,
        muridList: relatedStudents,
      };
    });

    let filtered = enrichedParents;

    if (hubungan !== 'ALL') {
      filtered = filtered.filter((p) => p.hubungan === hubungan);
    }

    if (search) {
      filtered = filtered.filter((p) => {
        const matchParent =
          p.nama.toLowerCase().includes(search) ||
          p.noHp.includes(search) ||
          p.nik.includes(search) ||
          p.pekerjaan.toLowerCase().includes(search);
        
        const matchChild = p.muridList.some(
          (m) =>
            m.nama.toLowerCase().includes(search) ||
            m.nis.includes(search) ||
            m.nisn.includes(search) ||
            m.kelasNama.toLowerCase().includes(search)
        );

        return matchParent || matchChild;
      });
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data: paginated,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memuat data orang tua' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.nama || !body.noHp || !body.hubungan) {
      return NextResponse.json(
        { success: false, message: 'Nama, Hubungan, dan Nomor WhatsApp wajib diisi' },
        { status: 400 }
      );
    }

    const newParent = createParent({
      nama: body.nama,
      nik: body.nik || `360312${Date.now().toString().slice(-10)}`,
      hubungan: body.hubungan,
      noHp: body.noHp,
      pekerjaan: body.pekerjaan || 'Wiraswasta',
      penghasilan: body.penghasilan || 'Rp 3.000.000 - Rp 5.000.000',
      alamat: body.alamat || 'Pakuhaji, Kab. Tangerang',
      muridIds: Array.isArray(body.muridIds) ? body.muridIds : [],
      isPrimaryContact: body.isPrimaryContact ?? true,
      email: body.email,
    });

    return NextResponse.json({
      success: true,
      message: 'Data orang tua / wali berhasil disimpan',
      data: newParent,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menyimpan data orang tua' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID Orang Tua tidak valid' },
        { status: 400 }
      );
    }

    const updated = updateParent(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Data orang tua tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Data orang tua berhasil diperbarui',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memperbarui data orang tua' },
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
        { success: false, message: 'ID Orang Tua wajib disertakan' },
        { status: 400 }
      );
    }

    const deleted = deleteParent(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Data orang tua tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Data orang tua berhasil dihapus',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menghapus data orang tua' },
      { status: 500 }
    );
  }
}
