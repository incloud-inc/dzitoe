// ==============================================================================
// DZITOE — Student Health & UKS Store (@dzitoe/db)
// SMAN 20 Kabupaten Tangerang
// Module A22: Data Kesehatan Siswa & Rekam Medis UKS
// ==============================================================================

import { getStudentById } from './student-store';

export type JenisKesehatan =
  | 'RIWAYAT_PENYAKIT'
  | 'ALERGI'
  | 'OBAT'
  | 'IMUNISASI'
  | 'PEMERIKSAAN'
  | 'CATATAN_MEDIS';

export type StatusUKS =
  | 'PULIH'
  | 'RAWAT_UKS'
  | 'RUJUK_PUSKESMAS'
  | 'PERLU_PERHATIAN'
  | 'PULANG_KE_RUMAH';

export type GolonganDarah = 'A' | 'B' | 'AB' | 'O' | 'TIDAK_DIKETAHUI';

export interface HealthRecord {
  id: string;
  muridId: string;
  muridNama: string;
  kelasNama: string;
  jenis: JenisKesehatan;
  golonganDarah?: GolonganDarah;
  tinggiBadan?: number | null; // cm
  beratBadan?: number | null; // kg
  suhuTubuh?: number | null; // Celsius
  tekananDarah?: string | null; // e.g. "110/70"
  riwayatAlergi?: string | null;
  penyakitBawaan?: string | null;
  keluhan: string;
  penanganan?: string | null;
  obatDiberikan?: string | null;
  istirahatDiUks?: boolean;
  petugasUks: string;
  status: StatusUKS;
  tanggal: string; // ISO date YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}

const INITIAL_HEALTH_RECORDS: HealthRecord[] = [
  {
    id: 'uks-2026-001',
    muridId: 'mrd-1',
    muridNama: 'Aditya Pratama',
    kelasNama: 'X-A',
    jenis: 'CATATAN_MEDIS',
    golonganDarah: 'O',
    tinggiBadan: 168,
    beratBadan: 58,
    suhuTubuh: 38.2,
    tekananDarah: '110/75',
    riwayatAlergi: 'Alergi dingin & debu',
    penyakitBawaan: 'Asma ringan',
    keluhan: 'Demam mendadak dan pusing saat jam pelajaran PJOK',
    penanganan: 'Kompres hangat, istirahat di tempat tidur UKS, diberikan Paracetamol 500mg',
    obatDiberikan: 'Paracetamol 500mg, Teh manis hangat',
    istirahatDiUks: true,
    petugasUks: 'Hj. Siti Aminah, S.Kep (PMR/UKS)',
    status: 'PULIH',
    tanggal: '2026-09-18',
    createdAt: '2026-09-18T09:30:00.000Z',
    updatedAt: '2026-09-18T11:00:00.000Z',
  },
  {
    id: 'uks-2026-002',
    muridId: 'mrd-2',
    muridNama: 'Anisa Rahmawati',
    kelasNama: 'X-A',
    jenis: 'ALERGI',
    golonganDarah: 'A',
    tinggiBadan: 158,
    beratBadan: 48,
    suhuTubuh: 36.6,
    tekananDarah: '100/70',
    riwayatAlergi: 'Alergi Udang dan Makanan Laut',
    penyakitBawaan: null,
    keluhan: 'Gatal-gatal di lengan setelah konsumsi jajanan kantin',
    penanganan: 'Pemberian CTM dan observasi reaksi 30 menit',
    obatDiberikan: 'Antihistamin CTM 4mg',
    istirahatDiUks: true,
    petugasUks: 'Hj. Siti Aminah, S.Kep (PMR/UKS)',
    status: 'PULIH',
    tanggal: '2026-09-22',
    createdAt: '2026-09-22T10:15:00.000Z',
    updatedAt: '2026-09-22T11:15:00.000Z',
  },
  {
    id: 'uks-2026-003',
    muridId: 'mrd-3',
    muridNama: 'Bayu Nugroho',
    kelasNama: 'X-B',
    jenis: 'PEMERIKSAAN',
    golonganDarah: 'B',
    tinggiBadan: 172,
    beratBadan: 62,
    suhuTubuh: 36.5,
    tekananDarah: '115/80',
    riwayatAlergi: null,
    penyakitBawaan: null,
    keluhan: 'Skrining kesehatan berkala Puskesmas Pakuhaji (Mata, Gigi, Tensi)',
    penanganan: 'Kesehatan fisik normal, disarankan periksa visus mata lanjutan di optik/puskesmas',
    obatDiberikan: 'Vitamin C 50mg',
    istirahatDiUks: false,
    petugasUks: 'dr. Hendra (Puskesmas Pakuhaji)',
    status: 'PULIH',
    tanggal: '2026-09-25',
    createdAt: '2026-09-25T08:30:00.000Z',
    updatedAt: '2026-09-25T08:30:00.000Z',
  },
  {
    id: 'uks-2026-004',
    muridId: 'mrd-4',
    muridNama: 'Dewi Lestari',
    kelasNama: 'X-B',
    jenis: 'IMUNISASI',
    golonganDarah: 'AB',
    tinggiBadan: 160,
    beratBadan: 50,
    suhuTubuh: 36.7,
    tekananDarah: '110/70',
    riwayatAlergi: null,
    penyakitBawaan: null,
    keluhan: 'Program Vaksinasi Td (Tetanus Diphtheria) Remaja Sekolah',
    penanganan: 'Injeksi intramuskular lengan kiri, observasi KIPI 15 menit',
    obatDiberikan: 'Vaksin Td 0.5 ml',
    istirahatDiUks: false,
    petugasUks: 'Bidan Nuraeni, S.Tr.Keb',
    status: 'PULIH',
    tanggal: '2026-10-01',
    createdAt: '2026-10-01T09:00:00.000Z',
    updatedAt: '2026-10-01T09:20:00.000Z',
  },
];

const globalStore = globalThis as unknown as {
  __DZITOE_HEALTH__?: HealthRecord[];
};

if (!globalStore.__DZITOE_HEALTH__) {
  globalStore.__DZITOE_HEALTH__ = [...INITIAL_HEALTH_RECORDS];
}

function findMonorepoRoot(startDir: string, fs: any, path: any): string {
  let curr = path.resolve(startDir);
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(curr, 'pnpm-workspace.yaml'))) {
      return curr;
    }
    const parent = path.dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }
  return startDir;
}

function getFileIo() {
  try {
    if (
      typeof process !== 'undefined' &&
      process.release?.name === 'node' &&
      process.env.NEXT_RUNTIME !== 'edge'
    ) {
      // eslint-disable-next-line no-eval
      const nodeRequire = eval('require');
      const fs = nodeRequire('fs');
      const path = nodeRequire('path');
      const monorepoRoot = findMonorepoRoot(process.cwd(), fs, path);
      const dataDir = path.join(monorepoRoot, 'packages', 'db', 'data');
      const dataFile = path.join(dataDir, 'runtime-kesehatan.json');
      return { fs, dataDir, dataFile };
    }
  } catch {
    // Edge runtime fallback
  }
  return null;
}

function ensureDataFile(): void {
  const io = getFileIo();
  if (!io) return;
  try {
    if (!io.fs.existsSync(io.dataDir)) {
      io.fs.mkdirSync(io.dataDir, { recursive: true });
    }
    if (!io.fs.existsSync(io.dataFile)) {
      io.fs.writeFileSync(io.dataFile, JSON.stringify(INITIAL_HEALTH_RECORDS, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[HealthStore] Error ensuring data file', err);
  }
}

export function getAllHealthRecords(filter?: {
  jenis?: JenisKesehatan | string;
  status?: StatusUKS | string;
  muridId?: string;
  search?: string;
}): HealthRecord[] {
  ensureDataFile();
  const io = getFileIo();
  let list = globalStore.__DZITOE_HEALTH__ || [...INITIAL_HEALTH_RECORDS];

  if (io) {
    try {
      if (io.fs.existsSync(io.dataFile)) {
        const content = io.fs.readFileSync(io.dataFile, 'utf-8');
        const parsed = JSON.parse(content) as HealthRecord[];
        globalStore.__DZITOE_HEALTH__ = parsed;
        list = parsed;
      }
    } catch (err) {
      console.warn('[HealthStore] Error reading data file', err);
    }
  }

  if (!filter) return list;

  return list.filter((r) => {
    if (filter.jenis && r.jenis !== filter.jenis) return false;
    if (filter.status && r.status !== filter.status) return false;
    if (filter.muridId && r.muridId !== filter.muridId) return false;
    if (filter.search) {
      const q = filter.search.toLowerCase();
      const match =
        r.muridNama.toLowerCase().includes(q) ||
        r.kelasNama.toLowerCase().includes(q) ||
        r.keluhan.toLowerCase().includes(q) ||
        (r.penanganan && r.penanganan.toLowerCase().includes(q)) ||
        (r.riwayatAlergi && r.riwayatAlergi.toLowerCase().includes(q)) ||
        (r.penyakitBawaan && r.penyakitBawaan.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });
}

function persistHealthRecords(items: HealthRecord[]): void {
  globalStore.__DZITOE_HEALTH__ = items;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFile();
    io.fs.writeFileSync(io.dataFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[HealthStore] Error persisting health data file', err);
  }
}

export function getHealthRecordById(id: string): HealthRecord | null {
  const all = getAllHealthRecords();
  return all.find((r) => r.id === id) || null;
}

export function getHealthRecordsByStudentId(muridId: string): HealthRecord[] {
  return getAllHealthRecords({ muridId });
}

export function createHealthRecord(data: {
  muridId: string;
  muridNama?: string;
  kelasNama?: string;
  jenis: JenisKesehatan;
  golonganDarah?: GolonganDarah;
  tinggiBadan?: number | null;
  beratBadan?: number | null;
  suhuTubuh?: number | null;
  tekananDarah?: string | null;
  riwayatAlergi?: string | null;
  penyakitBawaan?: string | null;
  keluhan: string;
  penanganan?: string | null;
  obatDiberikan?: string | null;
  istirahatDiUks?: boolean;
  petugasUks: string;
  status?: StatusUKS;
  tanggal?: string;
}): HealthRecord {
  const all = getAllHealthRecords();
  const student = getStudentById(data.muridId);

  const now = new Date().toISOString();
  const record: HealthRecord = {
    id: `uks-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
    muridId: data.muridId,
    muridNama: data.muridNama || (student ? student.nama : 'Murid'),
    kelasNama: data.kelasNama || (student ? student.kelasNama : 'Umum'),
    jenis: data.jenis,
    golonganDarah: data.golonganDarah || 'TIDAK_DIKETAHUI',
    tinggiBadan: data.tinggiBadan !== undefined ? Number(data.tinggiBadan) : null,
    beratBadan: data.beratBadan !== undefined ? Number(data.beratBadan) : null,
    suhuTubuh: data.suhuTubuh !== undefined ? Number(data.suhuTubuh) : null,
    tekananDarah: data.tekananDarah || null,
    riwayatAlergi: data.riwayatAlergi || null,
    penyakitBawaan: data.penyakitBawaan || null,
    keluhan: data.keluhan,
    penanganan: data.penanganan || null,
    obatDiberikan: data.obatDiberikan || null,
    istirahatDiUks: data.istirahatDiUks ?? false,
    petugasUks: data.petugasUks || 'Petugas UKS / PMR',
    status: data.status || 'PULIH',
    tanggal: data.tanggal || new Date().toISOString().slice(0, 10),
    createdAt: now,
    updatedAt: now,
  };

  const updated = [record, ...all];
  persistHealthRecords(updated);
  return record;
}

export function updateHealthRecord(
  id: string,
  updates: Partial<Omit<HealthRecord, 'id' | 'createdAt'>>
): HealthRecord | null {
  const all = getAllHealthRecords();
  const index = all.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const current = all[index]!;
  const updatedRecord: HealthRecord = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  all[index] = updatedRecord;
  persistHealthRecords(all);
  return updatedRecord;
}

export function deleteHealthRecord(id: string): boolean {
  const all = getAllHealthRecords();
  const filtered = all.filter((r) => r.id !== id);
  if (filtered.length === all.length) return false;
  persistHealthRecords(filtered);
  return true;
}

export function getHealthStats() {
  const all = getAllHealthRecords();
  const total = all.length;

  const perJenis: Record<JenisKesehatan, number> = {
    RIWAYAT_PENYAKIT: 0,
    ALERGI: 0,
    OBAT: 0,
    IMUNISASI: 0,
    PEMERIKSAAN: 0,
    CATATAN_MEDIS: 0,
  };

  const perStatus: Record<StatusUKS, number> = {
    PULIH: 0,
    RAWAT_UKS: 0,
    RUJUK_PUSKESMAS: 0,
    PERLU_PERHATIAN: 0,
    PULANG_KE_RUMAH: 0,
  };

  const golDarahCount: Record<string, number> = {
    A: 0,
    B: 0,
    AB: 0,
    O: 0,
    TIDAK_DIKETAHUI: 0,
  };

  let butuhPerhatian = 0;
  let rawatUks = 0;

  for (const r of all) {
    if (perJenis[r.jenis] !== undefined) perJenis[r.jenis]++;
    if (perStatus[r.status] !== undefined) perStatus[r.status]++;
    if (r.golonganDarah && golDarahCount[r.golonganDarah] !== undefined) {
      golDarahCount[r.golonganDarah] = (golDarahCount[r.golonganDarah] ?? 0) + 1;
    }

    if (r.status === 'PERLU_PERHATIAN' || r.status === 'RUJUK_PUSKESMAS') {
      butuhPerhatian++;
    }
    if (r.status === 'RAWAT_UKS') {
      rawatUks++;
    }
  }

  return {
    total,
    perJenis,
    perStatus,
    golDarahCount,
    butuhPerhatian,
    rawatUks,
  };
}
