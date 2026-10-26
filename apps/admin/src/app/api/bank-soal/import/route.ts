import { NextRequest, NextResponse } from 'next/server';
import { db, TingkatKesulitan, JenisSoal } from '@dzitoe/db';
import { parseExcelFile, ImportSummaryReport, BankSoalImportRow } from '@dzitoe/utils';

const DUMMY_GURU_ID = 'cm20dummy0001guru0001';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'Tidak ada file yang diunggah' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const rows = parseExcelFile<BankSoalImportRow>(arrayBuffer);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, message: 'File kosong atau format salah' }, { status: 400 });
    }

    let successCount = 0;
    let skippedCount = 0;
    const errors: any[] = [];
    const importedItems: any[] = [];

    // Pre-fetch Mapel
    const mapels = await db.mataPelajaran.findMany();
    const mapelMap = new Map(mapels.map(m => [m.kode, m]));

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2;

      try {
        if (!row.KodeMapel || !row.JenisSoal || !row.Pertanyaan) {
          throw new Error('Kolom wajib tidak lengkap (KodeMapel, JenisSoal, Pertanyaan)');
        }

        const mapel = mapelMap.get(row.KodeMapel);
        if (!mapel) {
          throw new Error(`Mapel ${row.KodeMapel} tidak ditemukan`);
        }

        // Cari default kelas kurikulum (kita mock untuk import batch ini)
        const kelasKurikulum = await db.kelasKurikulum.findFirst({
          where: { mapelId: mapel.id }
        });
        if (!kelasKurikulum) {
          throw new Error(`Tidak ada kelas kurikulum aktif untuk mapel ${mapel.nama}`);
        }

        let jawabanFormat: any = {};
        
        if (row.JenisSoal === 'PILIHAN_GANDA') {
          const opsis = [row['Opsi A'], row['Opsi B'], row['Opsi C'], row['Opsi D'], row['Opsi E']].filter(Boolean) as string[];
          if (opsis.length < 2) throw new Error('PG butuh minimal 2 opsi (A & B)');
          
          const indexJawabanMap: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4 };
          const jawabanBenarIndex = indexJawabanMap[row.JawabanBenar?.toUpperCase()];
          if (jawabanBenarIndex === undefined || jawabanBenarIndex >= opsis.length) {
            throw new Error(`Jawaban Benar '${row.JawabanBenar}' tidak valid atau melampaui jumlah opsi`);
          }
          jawabanFormat = { opsi: opsis, jawabanBenarIndex };
        } else if (row.JenisSoal === 'BENAR_SALAH') {
          const isBenar = row.JawabanBenar?.toUpperCase() === 'BENAR';
          jawabanFormat = {
            pernyataan: [{ teks: row.Pertanyaan, isBenar }]
          };
        } else {
          throw new Error(`Import untuk Jenis Soal '${row.JenisSoal}' belum didukung via Excel`);
        }

        // Tentukan tingkat kesulitan
        let tk: TingkatKesulitan = 'SEDANG';
        if (row.TingkatKesulitan?.toUpperCase() === 'MUDAH') tk = 'MUDAH';
        if (row.TingkatKesulitan?.toUpperCase() === 'SULIT') tk = 'SULIT';

        const soal = await db.bankSoal.create({
          data: {
            guruId: DUMMY_GURU_ID,
            mapelId: mapel.id,
            kelasKurikulumId: kelasKurikulum.id,
            jenisSoal: row.JenisSoal as JenisSoal,
            tingkatKesulitan: tk,
            pertanyaan: row.Pertanyaan,
            jawaban: jawabanFormat,
            pembahasan: row.Pembahasan,
            tags: row.Tags ? row.Tags.split(',').map(t => t.trim()) : [],
            sumber: 'IMPORT',
            isPublished: false
          }
        });

        successCount++;
        importedItems.push(soal);
      } catch (err: any) {
        skippedCount++;
        errors.push({
          row: rowNum,
          identifier: row.Pertanyaan ? row.Pertanyaan.substring(0, 30) + '...' : '-',
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
    console.error('Import Bank Soal Error:', error);
    return NextResponse.json({ success: false, message: 'Gagal memproses file' }, { status: 500 });
  }
}
