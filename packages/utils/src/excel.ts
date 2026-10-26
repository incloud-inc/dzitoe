// ==============================================================================
// DZITOE — Excel & CSV Parser, Importer, & Template Generator (@dzitoe/utils)
// Supports Dapodik Kemendikbudristek 2026 format and User/Guru bulk import
// ==============================================================================

import * as XLSX from 'xlsx';

export interface ImportSummaryReport<T = any> {
  totalRows: number;
  successCount: number;
  skippedCount: number;
  importedItems: T[];
  errors: Array<{
    row: number;
    identifier?: string;
    field?: string;
    message: string;
  }>;
}

/**
 * Membaca buffer file (XLSX, XLS, atau CSV) dan mengubahnya menjadi array of object
 */
export function parseExcelFile<T = Record<string, any>>(buffer: ArrayBuffer | Buffer): T[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return [];
  const worksheet = workbook.Sheets[firstSheetName];
  if (!worksheet) return [];

  // Parse rows with trimmed header keys
  const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });
  return rawRows.map((row) => {
    const cleanRow: Record<string, any> = {};
    for (const [key, val] of Object.entries(row)) {
      cleanRow[key.trim()] = typeof val === 'string' ? val.trim() : val;
    }
    return cleanRow as T;
  });
}

/**
 * Membuat file Excel buffer (.xlsx) untuk diunduh sebagai template
 */
export function generateExcelTemplate(headers: Record<string, string>[], sheetName = 'Template'): Uint8Array {
  const worksheet = XLSX.utils.json_to_sheet(headers);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const out = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
  return new Uint8Array(out);
}

// ==============================================================================
// 1. TEMPLATE & VALIDATOR: USER PENGGUNA (A3.7)
// ==============================================================================

export interface UserImportRow {
  Username: string;
  'Nama Lengkap': string;
  Email: string;
  Role: string; // ADMIN | KEPALA_SEKOLAH | TU | GURU | GURU_BK | PETUGAS_PPID | MURID | ORANG_TUA
  'No Telepon'?: string;
}

export const USER_TEMPLATE_SAMPLE: UserImportRow[] = [
  {
    Username: 'ahmad.subagyo',
    'Nama Lengkap': 'Ahmad Subagyo, S.Pd',
    Email: 'ahmad.subagyo@sman20tng.sch.id',
    Role: 'GURU',
    'No Telepon': '081234567890',
  },
  {
    Username: 'dewi.safitri',
    'Nama Lengkap': 'Dewi Safitri, S.Kom',
    Email: 'dewi.safitri@sman20tng.sch.id',
    Role: 'TU',
    'No Telepon': '081298765432',
  },
  {
    Username: 'hendra.bk',
    'Nama Lengkap': 'Hendra Wijaya, S.Psi',
    Email: 'hendra.wijaya@sman20tng.sch.id',
    Role: 'GURU_BK',
    'No Telepon': '085712345678',
  },
];

// ==============================================================================
// 2. TEMPLATE & VALIDATOR: MURID DAPODIK 2026 (A5.10)
// ==============================================================================

export interface MuridDapodikRow {
  NISN: string;
  'Nama Siswa': string;
  'Rombel/Kelas': string; // contoh: X-A, XI-IPA-1, XII-IPS-2
  'Jenis Kelamin': 'L' | 'P';
  NIS?: string;
  Agama?: string;
  'Tempat Lahir'?: string;
  'Tanggal Lahir'?: string;
  'Nama Orang Tua'?: string;
  'No Telepon/WA'?: string;
  Alamat?: string;
}

export const MURID_DAPODIK_TEMPLATE_SAMPLE: MuridDapodikRow[] = [
  {
    NISN: '0071234567',
    'Nama Siswa': 'Muhammad Rizky Pratama',
    'Rombel/Kelas': 'X-A',
    'Jenis Kelamin': 'L',
    NIS: '24251001',
    Agama: 'Islam',
    'Tempat Lahir': 'Tangerang',
    'Tanggal Lahir': '2008-05-14',
    'Nama Orang Tua': 'Bambang Pratama',
    'No Telepon/WA': '081234567801',
    Alamat: 'Desa Kohod RT 02/01, Kec. Pakuhaji',
  },
  {
    NISN: '0078901234',
    'Nama Siswa': 'Siti Anindya Putri',
    'Rombel/Kelas': 'X-B',
    'Jenis Kelamin': 'P',
    NIS: '24251002',
    Agama: 'Islam',
    'Tempat Lahir': 'Jakarta',
    'Tanggal Lahir': '2008-09-21',
    'Nama Orang Tua': 'Dedi Suhendar',
    'No Telepon/WA': '081234567802',
    Alamat: 'Jl. Raya Pakuhaji No. 45',
  },
  {
    NISN: '0065432109',
    'Nama Siswa': 'Gabriel Kevin Sinaga',
    'Rombel/Kelas': 'XI-F-1',
    'Jenis Kelamin': 'L',
    NIS: '23241045',
    Agama: 'Kristen',
    'Tempat Lahir': 'Medan',
    'Tanggal Lahir': '2007-11-03',
    'Nama Orang Tua': 'M. Sinaga',
    'No Telepon/WA': '081398765432',
    Alamat: 'Perumahan Sepatan Mas Blok C',
  },
];

// ==============================================================================
// 3. TEMPLATE & VALIDATOR: GURU & TENDIK (A6.8)
// ==============================================================================

export interface GuruImportRow {
  NIP: string; // 18 digit NIP atau 16 digit NUPTK atau kode peg
  'Nama Lengkap': string;
  'Mata Pelajaran': string;
  'Status Kepegawaian': 'PNS' | 'PPPK' | 'GTT/Honorer';
  'Jenis Kelamin': 'L' | 'P';
  Email: string;
  'No Telepon/WA': string;
  Pendidikan?: string;
}

export const GURU_TEMPLATE_SAMPLE: GuruImportRow[] = [
  {
    NIP: '197508122005011003',
    'Nama Lengkap': 'Drs. Budi Santoso, M.Pd',
    'Mata Pelajaran': 'Matematika Wajib',
    'Status Kepegawaian': 'PNS',
    'Jenis Kelamin': 'L',
    Email: 'budi.santoso@sman20tng.sch.id',
    'No Telepon/WA': '081234567810',
    Pendidikan: 'S2 Pendidikan Matematika',
  },
  {
    NIP: '198203152010012015',
    'Nama Lengkap': 'Siti Rahmawati, S.Pd',
    'Mata Pelajaran': 'Bahasa Indonesia',
    'Status Kepegawaian': 'PPPK',
    'Jenis Kelamin': 'P',
    Email: 'siti.rahmawati@sman20tng.sch.id',
    'No Telepon/WA': '081234567811',
    Pendidikan: 'S1 Pendidikan Bahasa Indonesia',
  },
  {
    NIP: '199511202022031001',
    'Nama Lengkap': 'Fajar Nugraha, S.Kom',
    'Mata Pelajaran': 'Informatika',
    'Status Kepegawaian': 'GTT/Honorer',
    'Jenis Kelamin': 'L',
    Email: 'fajar.nugraha@sman20tng.sch.id',
    'No Telepon/WA': '081234567812',
    Pendidikan: 'S1 Teknik Informatika',
  },
];

// ==============================================================================
// 4. TEMPLATE & VALIDATOR: KURIKULUM & MATERI (A20.1)
// ==============================================================================

export interface KurikulumImportRow {
  KodeMapel: string;
  Kelas: string;
  Semester: 'GANJIL' | 'GENAP';
  'Nama Bab': string;
  UrutanBab: number;
  'Nama Materi': string;
  CP?: string;
  TP?: string;
  ATP?: string;
}

export const KURIKULUM_TEMPLATE_SAMPLE: KurikulumImportRow[] = [
  {
    KodeMapel: 'MTK-W',
    Kelas: 'X',
    Semester: 'GANJIL',
    'Nama Bab': 'Eksponen dan Logaritma',
    UrutanBab: 1,
    'Nama Materi': 'Sifat-sifat Eksponen',
    CP: 'Peserta didik mampu memahami eksponen.',
    TP: 'Memahami operasi pada eksponen.',
    ATP: '1. Sifat penjumlahan 2. Sifat pengurangan'
  }
];

// ==============================================================================
// 5. TEMPLATE & VALIDATOR: BANK SOAL (A20.2)
// ==============================================================================

export interface BankSoalImportRow {
  KodeMapel: string;
  JenisSoal: string; // PILIHAN_GANDA | BENAR_SALAH
  TingkatKesulitan: string; // MUDAH | SEDANG | SULIT
  Pertanyaan: string;
  'Opsi A'?: string;
  'Opsi B'?: string;
  'Opsi C'?: string;
  'Opsi D'?: string;
  'Opsi E'?: string;
  JawabanBenar: string; // A, B, C, D, atau E (untuk PG) / BENAR, SALAH (untuk B/S)
  Pembahasan?: string;
  Tags?: string;
}

export const BANKSOAL_TEMPLATE_SAMPLE: BankSoalImportRow[] = [
  {
    KodeMapel: 'MTK-W',
    JenisSoal: 'PILIHAN_GANDA',
    TingkatKesulitan: 'SEDANG',
    Pertanyaan: 'Nilai dari 2^3 adalah...',
    'Opsi A': '4',
    'Opsi B': '6',
    'Opsi C': '8',
    'Opsi D': '10',
    JawabanBenar: 'C',
    Pembahasan: '2^3 = 2 x 2 x 2 = 8',
    Tags: 'HOTS, C3'
  },
  {
    KodeMapel: 'BINDO',
    JenisSoal: 'BENAR_SALAH',
    TingkatKesulitan: 'MUDAH',
    Pertanyaan: 'Ibu kota negara Indonesia saat ini (2023) adalah Jakarta.',
    JawabanBenar: 'BENAR',
    Tags: 'Geografi'
  }
];
