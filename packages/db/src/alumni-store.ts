// ==============================================================================
// DZITOE — Shared Alumni & Tracer Study Store (@dzitoe/db)
// SMAN 20 Kabupaten Tangerang
// Module A24: Portal Alumni & Tracer Study
// ==============================================================================

import { getAllStudents } from './student-store';

export type StatusTracer =
  | 'KULIAH'
  | 'KERJA'
  | 'WIRAUSAHA'
  | 'MENCARI_KERJA'
  | 'BELUM_UPDATE';

export interface AlumniRecord {
  id: string;
  nisn: string;
  nama: string;
  tahunLulus: number;
  kelasTerakhir: string;
  nomorHp?: string | null;
  email?: string | null;
  lanjutanStudi?: string | null;
  pekerjaan?: string | null;
  statusTracer: StatusTracer;
  namaKampus?: string | null;
  programStudi?: string | null;
  namaPerusahaan?: string | null;
  posisiKerja?: string | null;
  tahunMasuk?: number | null;
  alamat?: string | null;
  catatan?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Initial seed alumni SMAN 20 Tangerang angkatan sebelumnya
const INITIAL_ALUMNI: AlumniRecord[] = [
  {
    id: 'alm-2025-001',
    nisn: '0061234501',
    nama: 'Ahmad Fadhilah',
    tahunLulus: 2025,
    kelasTerakhir: 'XII MIPA 1',
    nomorHp: '081234567891',
    email: 'ahmad.fadhilah@alumni.sman20tangerang.sch.id',
    lanjutanStudi: 'Universitas Indonesia',
    namaKampus: 'Universitas Indonesia',
    programStudi: 'Teknik Informatika',
    pekerjaan: null,
    statusTracer: 'KULIAH',
    tahunMasuk: 2025,
    alamat: 'Pakuhaji, Kab. Tangerang',
    catatan: 'Diterima melalui jalur SNBP 2025',
    createdAt: '2025-06-15T08:00:00.000Z',
    updatedAt: '2025-06-15T08:00:00.000Z',
  },
  {
    id: 'alm-2025-002',
    nisn: '0061234502',
    nama: 'Nurul Hidayati',
    tahunLulus: 2025,
    kelasTerakhir: 'XII MIPA 2',
    nomorHp: '081234567892',
    email: 'nurul.hidayati@alumni.sman20tangerang.sch.id',
    lanjutanStudi: 'Institut Pertanian Bogor',
    namaKampus: 'Institut Pertanian Bogor (IPB)',
    programStudi: 'Teknologi Pangan',
    pekerjaan: null,
    statusTracer: 'KULIAH',
    tahunMasuk: 2025,
    alamat: 'Sepatan, Kab. Tangerang',
    catatan: 'Jalur SNBT 2025',
    createdAt: '2025-06-15T08:00:00.000Z',
    updatedAt: '2025-06-15T08:00:00.000Z',
  },
  {
    id: 'alm-2024-001',
    nisn: '0051234503',
    nama: 'Budi Santoso',
    tahunLulus: 2024,
    kelasTerakhir: 'XII IPS 1',
    nomorHp: '081234567893',
    email: 'budi.santoso@alumni.sman20tangerang.sch.id',
    lanjutanStudi: null,
    pekerjaan: 'Staff Administrasi Logistik',
    namaPerusahaan: 'PT Angkasa Pura Solusi',
    posisiKerja: 'Junior Logistics Admin',
    statusTracer: 'KERJA',
    tahunMasuk: 2024,
    alamat: 'Teluknaga, Kab. Tangerang',
    catatan: 'Bekerja di area Bandara Soekarno-Hatta',
    createdAt: '2024-06-20T08:00:00.000Z',
    updatedAt: '2025-01-10T08:00:00.000Z',
  },
  {
    id: 'alm-2024-002',
    nisn: '0051234504',
    nama: 'Citra Dewi Permata',
    tahunLulus: 2024,
    kelasTerakhir: 'XII MIPA 3',
    nomorHp: '081234567894',
    email: 'citra.dewi@alumni.sman20tangerang.sch.id',
    lanjutanStudi: null,
    pekerjaan: 'Owner Usaha Kuliner',
    namaPerusahaan: 'Dapur Citra Pakuhaji',
    posisiKerja: 'Founder & Pengelola',
    statusTracer: 'WIRAUSAHA',
    tahunMasuk: 2024,
    alamat: 'Pakuhaji, Kab. Tangerang',
    catatan: 'Wirausaha katering dan bakery',
    createdAt: '2024-06-20T08:00:00.000Z',
    updatedAt: '2025-02-14T08:00:00.000Z',
  },
];

const globalStore = globalThis as unknown as {
  __DZITOE_ALUMNI__?: AlumniRecord[];
};

if (!globalStore.__DZITOE_ALUMNI__) {
  globalStore.__DZITOE_ALUMNI__ = [...INITIAL_ALUMNI];
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
      const dataFile = path.join(dataDir, 'runtime-alumni.json');
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
      io.fs.writeFileSync(io.dataFile, JSON.stringify(INITIAL_ALUMNI, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[AlumniStore] Error ensuring data file', err);
  }
}

export function getAllAlumni(filter?: {
  tahunLulus?: number;
  statusTracer?: StatusTracer | string;
  search?: string;
}): AlumniRecord[] {
  ensureDataFile();
  const io = getFileIo();
  let list = globalStore.__DZITOE_ALUMNI__ || [...INITIAL_ALUMNI];

  if (io) {
    try {
      if (io.fs.existsSync(io.dataFile)) {
        const content = io.fs.readFileSync(io.dataFile, 'utf-8');
        const parsed = JSON.parse(content) as AlumniRecord[];
        globalStore.__DZITOE_ALUMNI__ = parsed;
        list = parsed;
      }
    } catch (err) {
      console.warn('[AlumniStore] Error reading data file', err);
    }
  }

  if (!filter) return list;

  return list.filter((a) => {
    if (filter.tahunLulus && a.tahunLulus !== filter.tahunLulus) return false;
    if (filter.statusTracer && a.statusTracer !== filter.statusTracer) return false;
    if (filter.search) {
      const q = filter.search.toLowerCase();
      const match =
        a.nama.toLowerCase().includes(q) ||
        a.nisn.toLowerCase().includes(q) ||
        (a.lanjutanStudi && a.lanjutanStudi.toLowerCase().includes(q)) ||
        (a.programStudi && a.programStudi.toLowerCase().includes(q)) ||
        (a.pekerjaan && a.pekerjaan.toLowerCase().includes(q)) ||
        (a.namaKampus && a.namaKampus.toLowerCase().includes(q)) ||
        (a.namaPerusahaan && a.namaPerusahaan.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });
}

function persistAlumni(items: AlumniRecord[]): void {
  globalStore.__DZITOE_ALUMNI__ = items;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFile();
    io.fs.writeFileSync(io.dataFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[AlumniStore] Error persisting to data file', err);
  }
}

export function getAlumniById(id: string): AlumniRecord | null {
  const all = getAllAlumni();
  return all.find((a) => a.id === id || a.nisn === id) || null;
}

export function createAlumni(data: {
  nisn: string;
  nama: string;
  tahunLulus: number;
  kelasTerakhir: string;
  nomorHp?: string | null;
  email?: string | null;
  statusTracer?: StatusTracer;
  namaKampus?: string | null;
  programStudi?: string | null;
  namaPerusahaan?: string | null;
  posisiKerja?: string | null;
  tahunMasuk?: number | null;
  alamat?: string | null;
  catatan?: string | null;
}): AlumniRecord {
  const all = getAllAlumni();
  const existing = all.find((a) => a.nisn === data.nisn);
  if (existing) {
    throw new Error(`Alumni dengan NISN ${data.nisn} sudah terdaftar (${existing.nama})`);
  }

  const now = new Date().toISOString();
  const record: AlumniRecord = {
    id: `alm-${data.tahunLulus}-${Date.now().toString().slice(-6)}`,
    nisn: data.nisn,
    nama: data.nama,
    tahunLulus: Number(data.tahunLulus),
    kelasTerakhir: data.kelasTerakhir,
    nomorHp: data.nomorHp || null,
    email: data.email || null,
    lanjutanStudi: data.namaKampus || (data.statusTracer === 'KULIAH' ? 'Kuliah' : null),
    pekerjaan: data.posisiKerja || (data.statusTracer === 'KERJA' ? 'Bekerja' : null),
    statusTracer: data.statusTracer || 'BELUM_UPDATE',
    namaKampus: data.namaKampus || null,
    programStudi: data.programStudi || null,
    namaPerusahaan: data.namaPerusahaan || null,
    posisiKerja: data.posisiKerja || null,
    tahunMasuk: data.tahunMasuk ? Number(data.tahunMasuk) : null,
    alamat: data.alamat || null,
    catatan: data.catatan || null,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [record, ...all];
  persistAlumni(updated);
  return record;
}

export function updateAlumni(
  id: string,
  updates: Partial<Omit<AlumniRecord, 'id' | 'createdAt'>>
): AlumniRecord | null {
  const all = getAllAlumni();
  const index = all.findIndex((a) => a.id === id || a.nisn === id);
  if (index === -1) return null;

  const current = all[index]!;
  const updatedRecord: AlumniRecord = {
    ...current,
    ...updates,
    tahunLulus: updates.tahunLulus ? Number(updates.tahunLulus) : current.tahunLulus,
    tahunMasuk: updates.tahunMasuk !== undefined ? (updates.tahunMasuk ? Number(updates.tahunMasuk) : null) : current.tahunMasuk,
    lanjutanStudi: updates.namaKampus ?? updates.lanjutanStudi ?? current.lanjutanStudi,
    pekerjaan: updates.posisiKerja ?? updates.pekerjaan ?? current.pekerjaan,
    updatedAt: new Date().toISOString(),
  };

  all[index] = updatedRecord;
  persistAlumni(all);
  return updatedRecord;
}

export function deleteAlumni(id: string): boolean {
  const all = getAllAlumni();
  const filtered = all.filter((a) => a.id !== id && a.nisn !== id);
  if (filtered.length === all.length) return false;
  persistAlumni(filtered);
  return true;
}

export function getAlumniStats() {
  const all = getAllAlumni();
  const total = all.length;

  const perStatus: Record<StatusTracer, number> = {
    KULIAH: 0,
    KERJA: 0,
    WIRAUSAHA: 0,
    MENCARI_KERJA: 0,
    BELUM_UPDATE: 0,
  };

  const perTahun: Record<number, number> = {};

  for (const a of all) {
    if (perStatus[a.statusTracer] !== undefined) {
      perStatus[a.statusTracer]++;
    } else {
      perStatus.BELUM_UPDATE++;
    }

    perTahun[a.tahunLulus] = (perTahun[a.tahunLulus] || 0) + 1;
  }

  const angkatanList = Object.keys(perTahun)
    .map(Number)
    .sort((a, b) => b - a);

  return {
    total,
    perStatus,
    perTahun,
    angkatanList,
    persentaseTerserap: total > 0
      ? Math.round(((perStatus.KULIAH + perStatus.KERJA + perStatus.WIRAUSAHA) / total) * 100)
      : 0,
  };
}

export function syncAlumniFromGraduation(): {
  added: number;
  existing: number;
  alumniAdded: AlumniRecord[];
} {
  const students = getAllStudents();
  const allAlumni = getAllAlumni();
  const existingNisns = new Set(allAlumni.map((a) => a.nisn));

  // Murid yang berstatus LULUS atau berada di jenjang XII yang diluluskan
  const currentYear = new Date().getFullYear();
  const lulusStudents = students.filter(
    (s: any) =>
      s.status === 'LULUS' ||
      s.kelasNama?.startsWith('XII') ||
      s.kelasId?.startsWith('XII')
  );

  let added = 0;
  let existing = 0;
  const newlyCreated: AlumniRecord[] = [];

  for (const s of lulusStudents) {
    if (existingNisns.has(s.nisn)) {
      existing++;
      continue;
    }

    const now = new Date().toISOString();
    const newAlumni: AlumniRecord = {
      id: `alm-${currentYear}-${s.nisn.slice(-4) || Math.random().toString(36).substring(2, 6)}`,
      nisn: s.nisn,
      nama: s.nama,
      tahunLulus: currentYear,
      kelasTerakhir: s.kelasNama || 'XII MIPA',
      nomorHp: s.noHpOrtu || null,
      email: s.email || null,
      statusTracer: 'BELUM_UPDATE',
      lanjutanStudi: null,
      pekerjaan: null,
      namaKampus: null,
      programStudi: null,
      namaPerusahaan: null,
      posisiKerja: null,
      tahunMasuk: null,
      alamat: `${s.jalan || ''}, ${s.kelurahan || ''}, ${s.kecamatan || ''}`.trim(),
      catatan: 'Sinkronisasi otomatis dari Wisaya Kelulusan Kelas XII',
      createdAt: now,
      updatedAt: now,
    };

    newlyCreated.push(newAlumni);
    existingNisns.add(s.nisn);
    added++;
  }

  if (newlyCreated.length > 0) {
    const combined = [...newlyCreated, ...allAlumni];
    persistAlumni(combined);
  }

  return { added, existing, alumniAdded: newlyCreated };
}
