import { NextRequest, NextResponse } from 'next/server';
import { db } from '@dzitoe/db';
import { parseExcelFile, ImportSummaryReport, KurikulumImportRow } from '@dzitoe/utils';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'Tidak ada file yang diunggah' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const rows = parseExcelFile<KurikulumImportRow>(arrayBuffer);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, message: 'File kosong atau format salah' }, { status: 400 });
    }

    let successCount = 0;
    let skippedCount = 0;
    const errors: any[] = [];
    const importedItems: any[] = [];

    // Pre-fetch Mapel and Map to reduce queries
    const mapels = await db.mataPelajaran.findMany();
    const mapelMap = new Map(mapels.map(m => [m.kode, m]));

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // Assuming row 1 is header

      try {
        if (!row.KodeMapel || !row.Kelas || !row.Semester || !row['Nama Bab'] || !row['Nama Materi']) {
          throw new Error('Kolom wajib tidak lengkap (KodeMapel, Kelas, Semester, Nama Bab, Nama Materi)');
        }

        const mapel = mapelMap.get(row.KodeMapel);
        if (!mapel) {
          throw new Error(`Mapel dengan kode ${row.KodeMapel} tidak ditemukan di database`);
        }

        const validSemester = String(row.Semester).toUpperCase();
        if (validSemester !== 'GANJIL' && validSemester !== 'GENAP') {
          throw new Error(`Format Semester salah (harus GANJIL/GENAP): ${row.Semester}`);
        }

        // 1. Upsert KelasKurikulum
        const kurikulum = await db.kelasKurikulum.upsert({
          where: {
            kelas_semester_mapelId: {
              kelas: row.Kelas,
              semester: validSemester as 'GANJIL' | 'GENAP',
              mapelId: mapel.id
            }
          },
          update: {},
          create: {
            kelas: row.Kelas,
            semester: validSemester as 'GANJIL' | 'GENAP',
            mapelId: mapel.id
          }
        });

        // 2. Upsert Bab
        const babNama = row['Nama Bab'];
        let bab = await db.bab.findFirst({
          where: { kelasKurikulumId: kurikulum.id, nama: babNama }
        });

        if (!bab) {
          bab = await db.bab.create({
            data: {
              kelasKurikulumId: kurikulum.id,
              nama: babNama,
              urutan: Number(row.UrutanBab) || 1,
            }
          });
        } else if (row.UrutanBab && bab.urutan !== Number(row.UrutanBab)) {
          bab = await db.bab.update({
            where: { id: bab.id },
            data: { urutan: Number(row.UrutanBab) }
          });
        }

        // 3. Upsert Materi
        const materiNama = row['Nama Materi'];
        let materi = await db.materi.findFirst({
          where: { babId: bab.id, nama: materiNama }
        });

        if (!materi) {
          materi = await db.materi.create({
            data: {
              babId: bab.id,
              nama: materiNama,
              capaianBelajar: row.CP,
              tujuanBelajar: row.TP,
              alurTujuan: row.ATP,
            }
          });
          successCount++;
          importedItems.push(materi);
        } else {
          // Update materi yang sudah ada
          materi = await db.materi.update({
            where: { id: materi.id },
            data: {
              capaianBelajar: row.CP || materi.capaianBelajar,
              tujuanBelajar: row.TP || materi.tujuanBelajar,
              alurTujuan: row.ATP || materi.alurTujuan,
            }
          });
          successCount++; // count as success update
          importedItems.push(materi);
        }

      } catch (err: any) {
        skippedCount++;
        errors.push({
          row: rowNum,
          identifier: `${row.KodeMapel || '-'} / ${row['Nama Materi'] || '-'}`,
          message: err.message
        });
      }
    }

    const summary: ImportSummaryReport = {
      totalRows: rows.length,
      successCount,
      skippedCount,
      importedItems,
      errors
    };

    return NextResponse.json({ success: true, summary });

  } catch (error: any) {
    console.error('Import Kurikulum Error:', error);
    return NextResponse.json({ success: false, message: 'Gagal memproses file' }, { status: 500 });
  }
}
