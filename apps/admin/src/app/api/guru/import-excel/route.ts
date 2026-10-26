// ==============================================================================
// DZITOE — API Import Guru dari Excel (@apps/admin)
// Task: Modul A6.8 — Import Guru dari Excel
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  parseExcelFile,
  generateExcelTemplate,
  GURU_TEMPLATE_SAMPLE,
  type GuruImportRow,
  type ImportSummaryReport,
} from '@dzitoe/utils';
import {
  getAllTeachers,
  createTeacher,
  type SeedTeacher,
} from '@dzitoe/db';
import { recordAuditLog } from '@dzitoe/auth';

export const dynamic = 'force-dynamic';

/**
 * GET: Unduh template Excel data guru & tenaga pendidik
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'xlsx';

  if (format === 'json') {
    return NextResponse.json({
      success: true,
      columns: [
        'NIP',
        'Nama Lengkap',
        'Mata Pelajaran',
        'Status Kepegawaian',
        'Jenis Kelamin',
        'Email',
        'No Telepon/WA',
        'Pendidikan',
      ],
      sample: GURU_TEMPLATE_SAMPLE,
    });
  }

  const excelBytes = generateExcelTemplate(GURU_TEMPLATE_SAMPLE as any, 'Data Guru SMAN 20');
  return new NextResponse(excelBytes as any, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="template-import-guru-sman20.xlsx"',
    },
  });
}

/**
 * POST: Proses import guru dari file Excel
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let rows: GuruImportRow[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ success: false, message: 'File Excel (.xlsx / .csv) tidak ditemukan.' }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      rows = parseExcelFile<GuruImportRow>(Buffer.from(arrayBuffer));
    } else {
      const body = await request.json();
      if (body.base64) {
        const buf = Buffer.from(body.base64, 'base64');
        rows = parseExcelFile<GuruImportRow>(buf);
      } else if (Array.isArray(body.rows)) {
        rows = body.rows;
      } else {
        return NextResponse.json({ success: false, message: 'Format request tidak valid.' }, { status: 400 });
      }
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, message: 'File kosong atau tidak memiliki baris data guru yang valid.' }, { status: 400 });
    }

    const existingTeachers = getAllTeachers();

    const summary: ImportSummaryReport<SeedTeacher> = {
      totalRows: rows.length,
      successCount: 0,
      skippedCount: 0,
      importedItems: [],
      errors: [],
    };

    rows.forEach((row, index) => {
      const rowNum = index + 2;
      const anyRow = row as any;
      const rawNip = (anyRow.NIP || anyRow.nip || anyRow.nuptk || '').toString().trim();
      const nama = (anyRow['Nama Lengkap'] || anyRow.nama_lengkap || anyRow.Nama || anyRow.nama || '').toString().trim();
      const mapel = (anyRow['Mata Pelajaran'] || anyRow.mapel || anyRow.mata_pelajaran || 'Mata Pelajaran Umum').toString().trim();
      const rawStatus = (anyRow['Status Kepegawaian'] || anyRow.status || anyRow.status_kepegawaian || 'PNS').toString().trim().toUpperCase();
      const rawJk = (anyRow['Jenis Kelamin'] || anyRow.jk || anyRow.gender || 'L').toString().trim().toUpperCase();
      const email = (anyRow.Email || anyRow.email || '').toString().trim();
      const phone = (anyRow['No Telepon/WA'] || anyRow.telepon || anyRow.no_hp || '').toString().trim();
      const pendidikan = (anyRow.Pendidikan || anyRow.pendidikan || 'S1 Pendidikan').toString().trim();

      if (!nama) {
        summary.skippedCount++;
        summary.errors.push({
          row: rowNum,
          identifier: rawNip || '(Kosong)',
          field: 'Nama Lengkap',
          message: 'Nama lengkap guru wajib diisi.',
        });
        return;
      }

      // NIP minimal 8 karakter atau string identitas
      const cleanNip = rawNip || `PEG-${Date.now().toString().slice(-6)}`;
      const isDuplicate = existingTeachers.some((t) => t.nip === cleanNip);
      if (isDuplicate) {
        summary.skippedCount++;
        summary.errors.push({
          row: rowNum,
          identifier: cleanNip,
          field: 'Duplikasi NIP',
          message: `NIP/NUPTK ${cleanNip} sudah terdaftar di sistem.`,
        });
        return;
      }

      const statusKepegawaian: 'PNS' | 'PPPK' | 'HONORER' = rawStatus.includes('PPPK')
        ? 'PPPK'
        : rawStatus.includes('HONORER') || rawStatus.includes('GTT')
        ? 'HONORER'
        : 'PNS';

      const jenisKelamin = rawJk.startsWith('P') || rawJk === 'W' ? 'PEREMPUAN' : 'LAKI_LAKI';

      const newTeacher = createTeacher({
        nama,
        nip: cleanNip,
        mataPelajaran: mapel,
        statusKepegawaian,
        jenisKelamin,
        email: email || undefined,
        noHp: phone,
        pendidikan,
      });

      summary.successCount++;
      summary.importedItems.push(newTeacher);
      existingTeachers.push(newTeacher);
    });

    // Record audit log
    recordAuditLog({
      userName: 'Administrator',
      identifier: 'admin',
      action: 'BULK_DATA_IMPORTED',
      status: summary.successCount > 0 ? 'SUCCESS' : 'WARNING',
      details: `Import Guru dari Excel: ${summary.successCount} tenaga pendidik berhasil ditambahkan, ${summary.skippedCount} dilewati dari total ${summary.totalRows} baris.`,
    });

    return NextResponse.json({
      success: true,
      message: `Proses import guru selesai. ${summary.successCount} guru berhasil ditambahkan, ${summary.skippedCount} dilewati.`,
      summary,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Gagal memproses file import guru: ${error?.message || 'Internal error'}` },
      { status: 500 }
    );
  }
}
