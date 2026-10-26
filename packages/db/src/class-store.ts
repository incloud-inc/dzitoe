// ==============================================================================
// DZITOE — Shared Rombel & Ruang Kelas Store (@dzitoe/db)
// Task: Modul A5 / A7 — CRUD Rombel Kelas & Ruang Belajar
// ==============================================================================

import { SEED_CLASSES, SEED_STUDENTS } from './seed-data';
import { getAllTeachers } from './teacher-store';

export interface RombelClass {
  id: string;
  nama: string;
  tingkat: 'X' | 'XI' | 'XII' | string;
  ruang: string;
  waliKelasId: string | null;
  waliKelasNama: string | null;
  kapasitas: number;
  jumlahMurid: number;
  tahunAjaran: string;
}

// Helper: Hitung jumlah siswa riil yang terdaftar di rombel tersebut
export function getRealStudentCount(classId: string, classNama: string): number {
  return SEED_STUDENTS.filter(
    (s) =>
      s.kelasId.toLowerCase() === classId.toLowerCase() ||
      s.kelasNama.toLowerCase() === classNama.toLowerCase()
  ).length;
}

// Generate initial 30 Rombel with room allocation and class advisors
function buildInitialClasses(): RombelClass[] {
  const teachers = getAllTeachers();

  return SEED_CLASSES.map((c, index) => {
    let gedung = 'Gedung A (Lt. 1)';
    let ruangNumber = `R-10${(index % 10) + 1}`;

    if (c.tingkat === 'XI') {
      gedung = 'Gedung B (Lt. 2)';
      ruangNumber = `R-20${(index % 10) + 1}`;
    } else if (c.tingkat === 'XII') {
      gedung = 'Gedung C (Lt. 2)';
      ruangNumber = `R-30${(index % 10) + 1}`;
    }

    const assignedTeacher = teachers[index % teachers.length];
    const realStudents = getRealStudentCount(c.id, c.nama);

    return {
      id: c.id,
      nama: c.nama,
      tingkat: c.tingkat,
      ruang: `Ruang ${ruangNumber} • ${gedung}`,
      waliKelasId: assignedTeacher ? assignedTeacher.id : null,
      waliKelasNama: assignedTeacher ? assignedTeacher.nama : 'Belum Ditentukan',
      kapasitas: 36,
      jumlahMurid: realStudents,
      tahunAjaran: '2025/2026',
    };
  });
}

// Global cache
const globalStore = globalThis as unknown as {
  __DZITOE_CLASSES__?: RombelClass[];
};

if (!globalStore.__DZITOE_CLASSES__) {
  globalStore.__DZITOE_CLASSES__ = buildInitialClasses();
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
      const dataFile = path.join(dataDir, 'runtime-rombel.json');
      return { fs, dataDir, dataFile };
    }
  } catch {
    // browser or edge fallback
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
      const initial = buildInitialClasses();
      io.fs.writeFileSync(io.dataFile, JSON.stringify(initial, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[ClassStore] Could not write to data file, using in-memory only', err);
  }
}

export function getAllClasses(): RombelClass[] {
  ensureDataFile();
  const io = getFileIo();
  let classes: RombelClass[] = globalStore.__DZITOE_CLASSES__ || buildInitialClasses();

  if (io) {
    try {
      if (io.fs.existsSync(io.dataFile)) {
        const content = io.fs.readFileSync(io.dataFile, 'utf-8');
        classes = JSON.parse(content) as RombelClass[];
      }
    } catch (err) {
      console.warn('[ClassStore] Error reading data file', err);
    }
  }

  // Selalu sinkronkan jumlahMurid dengan jumlah siswa riil di rombel tersebut
  classes = classes.map((c) => ({
    ...c,
    jumlahMurid: getRealStudentCount(c.id, c.nama),
  }));

  globalStore.__DZITOE_CLASSES__ = classes;
  return classes;
}

function persistStore(items: RombelClass[]): void {
  globalStore.__DZITOE_CLASSES__ = items;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFile();
    io.fs.writeFileSync(io.dataFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[ClassStore] Error persisting to data file', err);
  }
}

export interface CreateClassInput {
  nama: string;
  tingkat: string;
  ruang?: string;
  waliKelasId?: string | null;
  waliKelasNama?: string | null;
  kapasitas?: number;
  tahunAjaran?: string;
}

export function createClass(input: CreateClassInput): { success: boolean; data?: RombelClass; message: string } {
  const list = getAllClasses();
  const cleanNama = input.nama.trim();

  if (list.some((c) => c.nama.toLowerCase() === cleanNama.toLowerCase())) {
    return { success: false, message: `Rombel kelas "${cleanNama}" sudah ada!` };
  }

  const id = `kls-${cleanNama.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const newClass: RombelClass = {
    id,
    nama: cleanNama,
    tingkat: input.tingkat,
    ruang: input.ruang || `Ruang Kelas ${cleanNama}`,
    waliKelasId: input.waliKelasId || null,
    waliKelasNama: input.waliKelasNama || 'Belum Ditentukan',
    kapasitas: Number(input.kapasitas) || 36,
    jumlahMurid: 0,
    tahunAjaran: input.tahunAjaran || '2025/2026',
  };

  list.push(newClass);
  // Sort classes logically (X, XI, XII)
  list.sort((a, b) => a.nama.localeCompare(b.nama, undefined, { numeric: true }));
  persistStore(list);

  return { success: true, data: newClass, message: `Rombel kelas "${newClass.nama}" berhasil ditambahkan!` };
}

export function updateClass(id: string, input: Partial<CreateClassInput & { jumlahMurid: number }>): {
  success: boolean;
  data?: RombelClass;
  message: string;
} {
  const list = getAllClasses();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) {
    return { success: false, message: 'Rombel kelas tidak ditemukan.' };
  }

  const existing = list[idx]!;
  if (input.nama && input.nama.toLowerCase() !== existing.nama.toLowerCase()) {
    if (list.some((c) => c.id !== id && c.nama.toLowerCase() === input.nama!.toLowerCase())) {
      return { success: false, message: `Nama rombel "${input.nama}" sudah digunakan!` };
    }
    existing.nama = input.nama.trim();
  }

  if (input.tingkat) existing.tingkat = input.tingkat;
  if (input.ruang !== undefined) existing.ruang = input.ruang;
  if (input.waliKelasId !== undefined) existing.waliKelasId = input.waliKelasId;
  if (input.waliKelasNama !== undefined) existing.waliKelasNama = input.waliKelasNama;
  if (input.kapasitas !== undefined) existing.kapasitas = Number(input.kapasitas);
  if (input.jumlahMurid !== undefined) existing.jumlahMurid = Number(input.jumlahMurid);
  if (input.tahunAjaran) existing.tahunAjaran = input.tahunAjaran;

  list[idx] = existing;
  persistStore(list);

  return { success: true, data: existing, message: `Rombel "${existing.nama}" berhasil diperbarui!` };
}

export function deleteClass(id: string): { success: boolean; message: string } {
  let list = getAllClasses();
  const target = list.find((c) => c.id === id);
  if (!target) {
    return { success: false, message: 'Rombel kelas tidak ditemukan.' };
  }

  list = list.filter((c) => c.id !== id);
  persistStore(list);
  return { success: true, message: `Rombel "${target.nama}" berhasil dihapus.` };
}
