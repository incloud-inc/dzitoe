// ==============================================================================
// DZITOE — API Bulk Import User dari Excel (@apps/admin)
// Task: Modul A3.7 — Bulk Import User (Excel & CSV)
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  parseExcelFile,
  generateExcelTemplate,
  USER_TEMPLATE_SAMPLE,
  type UserImportRow,
  type ImportSummaryReport,
} from '@dzitoe/utils';
import { createUser, type UserRole, type SystemUser } from '@dzitoe/db';
import { recordAuditLog } from '@dzitoe/auth';

export const dynamic = 'force-dynamic';

/**
 * GET: Unduh file template Excel (.xlsx) untuk import pengguna
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'xlsx';

  if (format === 'json') {
    return NextResponse.json({
      success: true,
      columns: ['Username', 'Nama Lengkap', 'Email', 'Role', 'No Telepon'],
      roles: ['ADMIN', 'KEPALA_SEKOLAH', 'WAKA_KURIKULUM', 'WAKA_KESISWAAN', 'BENDAHARA', 'OPERATOR', 'GURU', 'WALI_KELAS', 'GURU_BK'],
      sample: USER_TEMPLATE_SAMPLE,
    });
  }

  const excelBytes = generateExcelTemplate(USER_TEMPLATE_SAMPLE as any, 'Template User');
  return new NextResponse(excelBytes as any, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="template-import-user-sman20.xlsx"',
    },
  });
}

/**
 * POST: Proses file Excel atau CSV yang diunggah untuk import pengguna massal
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let rows: UserImportRow[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ success: false, message: 'File Excel (.xlsx / .csv) tidak ditemukan.' }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      rows = parseExcelFile<UserImportRow>(Buffer.from(arrayBuffer));
    } else {
      const body = await request.json();
      if (body.base64) {
        const buf = Buffer.from(body.base64, 'base64');
        rows = parseExcelFile<UserImportRow>(buf);
      } else if (Array.isArray(body.rows)) {
        rows = body.rows;
      } else {
        return NextResponse.json({ success: false, message: 'Format request tidak valid.' }, { status: 400 });
      }
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, message: 'File kosong atau tidak memiliki baris data yang valid.' }, { status: 400 });
    }

    const summary: ImportSummaryReport<SystemUser> = {
      totalRows: rows.length,
      successCount: 0,
      skippedCount: 0,
      importedItems: [],
      errors: [],
    };

    const validRoles: UserRole[] = [
      'ADMIN',
      'KEPALA_SEKOLAH',
      'WAKA_KURIKULUM',
      'WAKA_KESISWAAN',
      'BENDAHARA',
      'OPERATOR',
      'GURU',
      'WALI_KELAS',
      'GURU_PIKET',
      'GURU_BK',
      'MURID',
      'ORANG_TUA',
    ];

    rows.forEach((row, index) => {
      const rowNum = index + 2; // Baris 1 adalah Header di Excel
      const anyRow = row as any;
      const username = (anyRow.Username || anyRow.username || '').toString().trim().toLowerCase();
      const nama = (anyRow['Nama Lengkap'] || anyRow.nama_lengkap || anyRow.Nama || anyRow.nama || '').toString().trim();
      const email = (anyRow.Email || anyRow.email || '').toString().trim();
      const rawRole = (anyRow.Role || anyRow.role || 'GURU').toString().trim().toUpperCase();
      const phone = (anyRow['No Telepon'] || anyRow.phone || anyRow.Telepon || anyRow.telepon || '').toString().trim();

      // Validasi kolom wajib
      if (!username || username.length < 3) {
        summary.skippedCount++;
        summary.errors.push({
          row: rowNum,
          identifier: username || '(Kosong)',
          field: 'Username',
          message: 'Username minimal 3 karakter tanpa spasi.',
        });
        return;
      }

      if (!nama) {
        summary.skippedCount++;
        summary.errors.push({
          row: rowNum,
          identifier: username,
          field: 'Nama Lengkap',
          message: 'Nama lengkap wajib diisi.',
        });
        return;
      }

      if (!email || !email.includes('@')) {
        summary.skippedCount++;
        summary.errors.push({
          row: rowNum,
          identifier: username,
          field: 'Email',
          message: 'Format email tidak valid.',
        });
        return;
      }

      // Map 'TU' or 'STAFF' to 'OPERATOR'
      const normalizedRole = rawRole === 'TU' || rawRole === 'STAFF' ? 'OPERATOR' : rawRole;
      const role: UserRole = validRoles.includes(normalizedRole as UserRole) ? (normalizedRole as UserRole) : 'GURU';

      const result = createUser({
        username,
        nama,
        email,
        role,
        phone,
        jabatan: role === 'GURU' ? 'Tenaga Pendidik' : role === 'OPERATOR' ? 'Tenaga Kependidikan (TU)' : role,
      });

      if (result.success && result.user) {
        summary.successCount++;
        summary.importedItems.push(result.user);
      } else {
        summary.skippedCount++;
        summary.errors.push({
          row: rowNum,
          identifier: username,
          field: 'Duplikasi',
          message: result.message || 'Gagal menyimpan pengguna.',
        });
      }
    });

    // Record audit log
    recordAuditLog({
      userName: 'Administrator',
      identifier: 'admin',
      action: 'BULK_DATA_IMPORTED',
      status: summary.successCount > 0 ? 'SUCCESS' : 'WARNING',
      details: `Import Pengguna dari Excel: ${summary.successCount} berhasil dibuat, ${summary.skippedCount} dilewati dari total ${summary.totalRows} baris.`,
    });

    return NextResponse.json({
      success: true,
      message: `Proses import selesai. ${summary.successCount} pengguna berhasil ditambahkan, ${summary.skippedCount} baris dilewati.`,
      summary,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Gagal memproses file Excel: ${error?.message || 'Internal error'}` },
      { status: 500 }
    );
  }
}
