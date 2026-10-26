import { z } from 'zod';
import { JenisSoal, TingkatKesulitan } from '@dzitoe/db';

/**
 * 1. PILIHAN GANDA (PG)
 * - Terdapat pilihan ganda, satu jawaban benar
 */
const PilihanGandaSchema = z.object({
  opsi: z.array(z.string()).min(2, 'Minimal 2 opsi jawaban'),
  jawabanBenarIndex: z.number().min(0),
});

/**
 * 2. PILIHAN GANDA KOMPLEKS (PGK) / MULTI
 * - Terdapat banyak opsi, lebih dari satu jawaban benar
 */
const PilihanGandaMultiSchema = z.object({
  opsi: z.array(z.string()).min(2, 'Minimal 2 opsi jawaban'),
  jawabanBenarIndices: z.array(z.number().min(0)).min(1, 'Minimal 1 opsi benar harus dipilih'),
});

/**
 * 3. BENAR SALAH (B/S)
 * - Pernyataan-pernyataan yang harus dijawab Benar atau Salah
 */
const BenarSalahSchema = z.object({
  pernyataan: z.array(z.object({
    teks: z.string().min(1, 'Pernyataan tidak boleh kosong'),
    isBenar: z.boolean()
  })).min(1, 'Minimal 1 pernyataan')
});

/**
 * 4. MENCOCOKKAN (Menjodohkan)
 * - Pasangan kunci dan nilai (kiri dan kanan)
 */
const MencocokkanSchema = z.object({
  pasangan: z.array(z.object({
    kiri: z.string().min(1, 'Sisi kiri tidak boleh kosong'),
    kanan: z.string().min(1, 'Sisi kanan tidak boleh kosong')
  })).min(2, 'Minimal 2 pasangan untuk dicocokkan')
});

/**
 * 5. ISIAN SINGKAT
 * - Jawaban berupa teks singkat, bisa memiliki beberapa kemungkinan jawaban benar (e.g. huruf besar/kecil)
 */
const IsianSingkatSchema = z.object({
  jawabanBenar: z.array(z.string().min(1)).min(1, 'Minimal ada 1 kemungkinan jawaban benar'),
  caseSensitive: z.boolean().default(false)
});

/**
 * 6. MENGURUTKAN
 * - Menentukan urutan yang benar dari beberapa item
 */
const MengurutkanSchema = z.object({
  itemBerurutan: z.array(z.string().min(1)).min(2, 'Minimal 2 item untuk diurutkan')
});

/**
 * 7. JAWABAN BERBASIS POIN
 * - Jawaban yang mengandung kata kunci tertentu akan mendapatkan poin tertentu
 */
const JawabanBerbasisPoinSchema = z.object({
  kataKunciPoin: z.array(z.object({
    kataKunci: z.string().min(1, 'Kata kunci tidak boleh kosong'),
    poin: z.number().min(1)
  })).min(1, 'Minimal 1 aturan poin')
});

/**
 * 8. JAWABAN PANJANG / URAIAN
 * - Rubrik penilaian guru
 */
const JawabanPanjangSchema = z.object({
  rubrik: z.string().optional(),
  poinMaksimal: z.number().min(1).default(100)
});

// Validator Master (Dynamic Validation based on JenisSoal)
export const validateJawabanBankSoal = (jenisSoal: string, jawabanPayload: any) => {
  switch (jenisSoal) {
    case 'PILIHAN_GANDA':
      return PilihanGandaSchema.parse(jawabanPayload);
    case 'PILIHAN_GANDA_MULTI':
      return PilihanGandaMultiSchema.parse(jawabanPayload);
    case 'BENAR_SALAH':
      return BenarSalahSchema.parse(jawabanPayload);
    case 'MENCOCOKKAN':
      return MencocokkanSchema.parse(jawabanPayload);
    case 'ISIAN_SINGKAT':
      return IsianSingkatSchema.parse(jawabanPayload);
    case 'MENGURUTKAN':
      return MengurutkanSchema.parse(jawabanPayload);
    case 'JAWABAN_BERBASIS_POIN':
      return JawabanBerbasisPoinSchema.parse(jawabanPayload);
    case 'JAWABAN_PANJANG':
      return JawabanPanjangSchema.parse(jawabanPayload);
    default:
      throw new Error(`Jenis Soal '${jenisSoal}' tidak valid atau belum didukung.`);
  }
};

// Skema utama pembuatan Soal
export const BankSoalCreateSchema = z.object({
  kelasKurikulumId: z.string().min(1, 'Kelas/Kurikulum wajib diisi'),
  mapelId: z.string().min(1, 'Mata Pelajaran wajib diisi'),
  babId: z.string().optional().nullable(),
  materiId: z.string().optional().nullable(),
  jenisSoal: z.nativeEnum(JenisSoal),
  tingkatKesulitan: z.nativeEnum(TingkatKesulitan),
  pertanyaan: z.string().min(1, 'Pertanyaan tidak boleh kosong'),
  jawaban: z.any(), // Akan divalidasi manual di route menggunakan validateJawabanBankSoal
  pembahasan: z.string().optional().nullable(),
  paragrafId: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false)
});
