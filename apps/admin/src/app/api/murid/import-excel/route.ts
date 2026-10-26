// ==============================================================================
// DZITOE — API Import Murid Format Dapodik Kemendikbudristek 2026 (@apps/admin)
// Task: Modul A5.10 — Import Murid dari Excel
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  parseExcelFile,
  generateExcelTemplate,
  MURID_DAPODIK_TEMPLATE_SAMPLE,
  type MuridDapodikRow,
  type ImportSummaryReport,
} from '@dzitoe/utils';
import {
  getAllStudents,
  createStudent,
  getAllClasses,
  type SeedStudent,
} from '@dzitoe/db';
import { recordAuditLog } from '@dzitoe/auth';

export const dynamic = 'force-dynamic';

/**
 * GET: Unduh template Excel format Dapodik 2026
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'xlsx';

  if (format === 'json') {
    return NextResponse.json({
      success: true,
      columns: [
        'NISN',
        'Nama Siswa',
        'Rombel/Kelas',
        'Jenis Kelamin',
        'NIS',
        'Agama',
        'Tempat Lahir',
        'Tanggal Lahir',
        'Nama Orang Tua',
        'No Telepon/WA',
        'Alamat',
      ],
      sample: MURID_DAPODIK_TEMPLATE_SAMPLE,
    });
  }

  const excelBytes = generateExcelTemplate(MURID_DAPODIK_TEMPLATE_SAMPLE as any, 'Dapodik Murid 2026');
  return new NextResponse(excelBytes as any, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="template-import-murid-dapodik-2026.xlsx"',
    },
  });
}

/**
 * POST: Proses import data murid dari Excel
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let rows: MuridDapodikRow[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ success: false, message: 'File Excel (.xlsx / .csv) tidak ditemukan.' }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      rows = parseExcelFile<MuridDapodikRow>(Buffer.from(arrayBuffer));
    } else {
      const body = await request.json();
      if (body.base64) {
        const buf = Buffer.from(body.base64, 'base64');
        rows = parseExcelFile<MuridDapodikRow>(buf);
      } else if (Array.isArray(body.rows)) {
        rows = body.rows;
      } else {
        return NextResponse.json({ success: false, message: 'Format request tidak valid.' }, { status: 400 });
      }
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, message: 'File kosong atau tidak memiliki baris data murid yang valid.' }, { status: 400 });
    }

    const existingStudents = getAllStudents();
    const existingClasses = getAllClasses();

    const summary: ImportSummaryReport<SeedStudent> = {
      totalRows: rows.length,
      successCount: 0,
      skippedCount: 0,
      importedItems: [],
      errors: [],
    };

    rows.forEach((row, index) => {
      const rowNum = index + 2;
      const anyRow = row as any;
      const rawNisn = (anyRow.NISN || anyRow.nisn || '').toString().trim();
      const nama = (anyRow['Nama Siswa'] || anyRow.nama_siswa || anyRow.Nama || anyRow.nama || '').toString().trim();
      const rombelStr = (anyRow['Rombel/Kelas'] || anyRow.rombel || anyRow.kelas || anyRow.Kelas || 'X-A').toString().trim();
      const rawJk = (anyRow['Jenis Kelamin'] || anyRow.jk || anyRow.JK || anyRow.gender || 'L').toString().trim().toUpperCase();
      const nis = (anyRow.NIS || anyRow.nis || `2425${Math.floor(1000 + Math.random() * 9000)}`).toString().trim();
      const agama = (anyRow.Agama || anyRow.agama || 'ISLAM').toString().trim().toUpperCase();
      const tempatLahir = (anyRow['Tempat Lahir'] || anyRow.tempat_lahir || 'Tangerang').toString().trim();
      const tanggalLahir = (anyRow['Tanggal Lahir'] || anyRow.tanggal_lahir || '2008-01-01').toString().trim();
      const namaOrtu = (anyRow['Nama Orang Tua'] || anyRow.nama_ortu || anyRow.nama_ayah || 'Orang Tua').toString().trim();
      const noHp = (anyRow['No Telepon/WA'] || anyRow.telepon || anyRow.no_hp || '').toString().trim();
      const alamat = (anyRow.Alamat || anyRow.alamat || 'Pakuhaji, Kab. Tangerang').toString().trim();

      // Validasi kolom wajib
      if (!nama) {
        summary.skippedCount++;
        summary.errors.push({
          row: rowNum,
          identifier: rawNisn || '(Kosong)',
          field: 'Nama Siswa',
          message: 'Nama murid wajib diisi.',
        });
        return;
      }

      // Validasi NISN: 10 digit angka
      const cleanNisn = rawNisn.replace(/\D/g, '');
      if (cleanNisn.length !== 10) {
        summary.skippedCount++;
        summary.errors.push({
          row: rowNum,
          identifier: rawNisn,
          field: 'NISN',
          message: 'NISN harus tepat 10 digit angka sesuai standar Dapodik Kemendikbudristek.',
        });
        return;
      }

      // Cek duplikasi NISN
      const isDuplicate = existingStudents.some((s) => s.nisn === cleanNisn);
      if (isDuplicate) {
        summary.skippedCount++;
        summary.errors.push({
          row: rowNum,
          identifier: cleanNisn,
          field: 'Duplikasi NISN',
          message: `NISN ${cleanNisn} sudah terdaftar untuk siswa lain.`,
        });
        return;
      }

      // Cari kelas yang cocok
      const normalizedRombel = rombelStr.toLowerCase().replace(/[\s._-]+/g, '');
      const matchedClass = existingClasses.find((c) => {
        const cNorm = c.nama.toLowerCase().replace(/[\s._-]+/g, '');
        return cNorm === normalizedRombel || c.id === rombelStr;
      }) || existingClasses[0];

      const kelasId = matchedClass ? matchedClass.id : 'kls-x-1';
      const kelasNama = matchedClass ? matchedClass.nama : rombelStr;

      const jenisKelamin = rawJk.startsWith('P') || rawJk === 'W' ? 'PEREMPUAN' : 'LAKI_LAKI';

      const newStudent = createStudent({
        nama,
        nis,
        nisn: cleanNisn,
        kelasId,
        kelasNama,
        jenisKelamin,
        agama,
        tempatLahir,
        tanggalLahir,
        namaAyah: namaOrtu,
        noHpOrtu: noHp,
        jalan: alamat,
      });

      summary.successCount++;
      summary.importedItems.push(newStudent);
      existingStudents.push(newStudent);
    });

    // Record audit log
    recordAuditLog({
      userName: 'Administrator',
      identifier: 'admin',
      action: 'BULK_DATA_IMPORTED',
      status: summary.successCount > 0 ? 'SUCCESS' : 'WARNING',
      details: `Import Murid Dapodik: ${summary.successCount} murid berhasil ditambahkan ke rombel, ${summary.skippedCount} dilewati dari total ${summary.totalRows} baris.`,
    });

    return NextResponse.json({
      success: true,
      message: `Proses import murid Dapodik selesai. ${summary.successCount} murid berhasil ditambahkan, ${summary.skippedCount} dilewati.`,
      summary,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Gagal memproses file import murid: ${error?.message || 'Internal error'}` },
      { status: 500 }
    );
  }
}
