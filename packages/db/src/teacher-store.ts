// ==============================================================================
// DZITOE — Shared Teacher & Tendik Store (@dzitoe/db)
// Shared across apps/admin (3000) & apps/mobile (3001)
// With file-backed persistence for cross-process synchronization
// ==============================================================================

import { SEED_TEACHERS, type SeedTeacher, SEED_CLASSES } from './seed-data';

// Global memory cache to retain records during process lifecycle
const globalStore = globalThis as unknown as {
  __DZITOE_TEACHERS__?: SeedTeacher[];
};

if (!globalStore.__DZITOE_TEACHERS__) {
  globalStore.__DZITOE_TEACHERS__ = [...SEED_TEACHERS];
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
      // Dynamic eval require avoids edge-runtime webpack bundling issues
      // eslint-disable-next-line no-eval
      const nodeRequire = eval('require');
      const fs = nodeRequire('fs');
      const path = nodeRequire('path');
      const monorepoRoot = findMonorepoRoot(process.cwd(), fs, path);
      const dataDir = path.join(monorepoRoot, 'packages', 'db', 'data');
      const dataFile = path.join(dataDir, 'runtime-guru.json');
      return { fs, dataDir, dataFile };
    }
  } catch {
    // Edge runtime or browser environment fallback
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
      io.fs.writeFileSync(io.dataFile, JSON.stringify(SEED_TEACHERS, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[TeacherStore] Could not write to data file, using in-memory only', err);
  }
}

export function getAllTeachers(): SeedTeacher[] {
  ensureDataFile();
  const io = getFileIo();
  if (io) {
    try {
      if (io.fs.existsSync(io.dataFile)) {
        const content = io.fs.readFileSync(io.dataFile, 'utf-8');
        const parsed = JSON.parse(content) as SeedTeacher[];
        globalStore.__DZITOE_TEACHERS__ = parsed;
        return parsed;
      }
    } catch (err) {
      console.warn('[TeacherStore] Error reading data file', err);
    }
  }
  return globalStore.__DZITOE_TEACHERS__ || [...SEED_TEACHERS];
}

function persistStore(items: SeedTeacher[]): void {
  globalStore.__DZITOE_TEACHERS__ = items;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFile();
    io.fs.writeFileSync(io.dataFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[TeacherStore] Error persisting to data file', err);
  }
}

export function getTeacherById(id: string): SeedTeacher | null {
  const all = getAllTeachers();
  return all.find((t) => t.id === id || t.userId === id || t.nip === id) || null;
}

export function createTeacher(data: Partial<SeedTeacher> & { nama: string }): SeedTeacher {
  const all = getAllTeachers();
  const counter = all.length + 1;
  const id = `guru-${Date.now()}`;
  const userId = `usr-guru-${Date.now()}`;
  const cleanName = data.nama.toLowerCase().replace(/[^a-z0-9]/g, '');
  const username = data.username || `guru_${cleanName.slice(0, 8)}_${counter}`;
  const email = data.email || `${username}@sman20kabtangerang.sch.id`;

  let waliKelasNama = data.waliKelasNama || null;
  if (data.waliKelasId && !waliKelasNama) {
    const kls = SEED_CLASSES.find((c) => c.id === data.waliKelasId);
    if (kls) waliKelasNama = kls.nama;
  }

  const newTeacher: SeedTeacher = {
    id,
    userId,
    nip: data.nip || `198501012010011${String(counter).padStart(3, '0')}`,
    nuptk: data.nuptk || `98017586${String(counter).padStart(8, '0')}`,
    nik: data.nik || `360312010185${String(counter).padStart(4, '0')}`,
    noKk: data.noKk || '3603120101050001',
    nama: data.nama,
    gelar: data.gelar || 'S.Pd.',
    jenisKelamin: data.jenisKelamin || 'LAKI_LAKI',
    tempatLahir: data.tempatLahir || 'Tangerang',
    tanggalLahir: data.tanggalLahir || '1985-01-01',
    agama: data.agama || 'ISLAM',
    jalan: data.jalan || 'Jl. Raya Pakuhaji No. 20',
    rtRw: data.rtRw || '002/003',
    kelurahan: data.kelurahan || 'Pakuhaji',
    kecamatan: data.kecamatan || 'Pakuhaji',
    kabupaten: data.kabupaten || 'Kabupaten Tangerang',
    provinsi: data.provinsi || 'Banten',
    kodePos: data.kodePos || '15570',
    lintang: data.lintang ?? -6.123456,
    bujur: data.bujur ?? 106.123456,
    jabatan: data.jabatan || 'Guru Mata Pelajaran',
    mataPelajaran: data.mataPelajaran || 'Matematika',
    status: data.status || 'AKTIF',
    statusKepegawaian: data.statusKepegawaian || 'PNS',
    noHp: data.noHp || '081298765432',
    pendidikan: data.pendidikan || 'S1 Pendidikan',
    email,
    username,
    defaultPassword: 'Masuk123!',
    avatar:
      data.avatar ||
      (data.jenisKelamin === 'PEREMPUAN'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
        : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),
    waliKelasId: data.waliKelasId || null,
    waliKelasNama,
  };

  const updated = [newTeacher, ...all];
  persistStore(updated);
  return newTeacher;
}

export function updateTeacher(id: string, updates: Partial<SeedTeacher>): SeedTeacher | null {
  const all = getAllTeachers();
  const index = all.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const current = all[index]!;
  let waliKelasNama = updates.waliKelasNama ?? current.waliKelasNama;
  if (updates.waliKelasId && updates.waliKelasId !== current.waliKelasId) {
    const kls = SEED_CLASSES.find((c) => c.id === updates.waliKelasId);
    waliKelasNama = kls ? kls.nama : null;
  }

  const updatedTeacher: SeedTeacher = {
    ...current,
    ...updates,
    waliKelasNama,
  };

  all[index] = updatedTeacher;
  persistStore(all);
  return updatedTeacher;
}

export function deleteTeacher(id: string): boolean {
  const all = getAllTeachers();
  const filtered = all.filter((t) => t.id !== id);
  if (filtered.length === all.length) return false;
  persistStore(filtered);
  return true;
}
