// ==============================================================================
// DZITOE — Shared Student / Murid Store (@dzitoe/db)
// Shared across apps/admin (3000) & apps/mobile (3001)
// With file-backed persistence for cross-process synchronization
// ==============================================================================

import { SEED_STUDENTS, type SeedStudent, SEED_CLASSES } from './seed-data';

const globalStore = globalThis as unknown as {
  __DZITOE_STUDENTS__?: SeedStudent[];
};

if (!globalStore.__DZITOE_STUDENTS__) {
  globalStore.__DZITOE_STUDENTS__ = [...SEED_STUDENTS];
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
      const dataFile = path.join(dataDir, 'runtime-murid.json');
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
      io.fs.writeFileSync(io.dataFile, JSON.stringify(SEED_STUDENTS, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[StudentStore] Error ensuring data file', err);
  }
}

export function getAllStudents(): SeedStudent[] {
  ensureDataFile();
  const io = getFileIo();
  if (io) {
    try {
      if (io.fs.existsSync(io.dataFile)) {
        const content = io.fs.readFileSync(io.dataFile, 'utf-8');
        const parsed = JSON.parse(content) as SeedStudent[];
        globalStore.__DZITOE_STUDENTS__ = parsed;
        return parsed;
      }
    } catch (err) {
      console.warn('[StudentStore] Error reading data file', err);
    }
  }
  return globalStore.__DZITOE_STUDENTS__ || [...SEED_STUDENTS];
}

function persistStore(items: SeedStudent[]): void {
  globalStore.__DZITOE_STUDENTS__ = items;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFile();
    io.fs.writeFileSync(io.dataFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[StudentStore] Error persisting to data file', err);
  }
}

export function getStudentById(id: string): SeedStudent | null {
  const all = getAllStudents();
  return all.find((s) => s.id === id || s.nisn === id || s.nis === id) || null;
}

export function createStudent(data: Partial<SeedStudent> & { nama: string; nis: string; kelasId: string }): SeedStudent {
  const all = getAllStudents();
  const kls = SEED_CLASSES.find((c) => c.id === data.kelasId);
  const kelasNama = kls ? kls.nama : data.kelasNama || 'X-A';
  const username = data.username || `murid_${data.nis}`;
  const email = data.email || `${username}@siswa.sman20kabtangerang.sch.id`;

  const newStudent: SeedStudent = {
    id: data.id || `mrd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: data.userId || `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    nama: data.nama,
    nis: data.nis,
    nisn: data.nisn || `008${Date.now().toString().slice(-7)}`,
    nik: data.nik || `360312010108${Date.now().toString().slice(-4)}`,
    noKk: data.noKk || '3603120101080001',
    tempatLahir: data.tempatLahir || 'Tangerang',
    tanggalLahir: data.tanggalLahir || '2008-05-10',
    noAktaLahir: data.noAktaLahir || `3603-LT-${Date.now().toString().slice(-6)}`,
    agama: data.agama || 'ISLAM',
    jalan: data.jalan || 'Jl. Raya Pakuhaji No. 1',
    rtRw: data.rtRw || '001/001',
    kelurahan: data.kelurahan || 'Pakuhaji',
    kecamatan: data.kecamatan || 'Pakuhaji',
    kabupaten: data.kabupaten || 'Kabupaten Tangerang',
    provinsi: data.provinsi || 'Banten',
    kodePos: data.kodePos || '15570',
    lintang: data.lintang ?? -6.124567,
    bujur: data.bujur ?? 106.125678,
    kelasId: data.kelasId,
    kelasNama,
    jenisKelamin: data.jenisKelamin === 'PEREMPUAN' ? 'PEREMPUAN' : 'LAKI_LAKI',
    username,
    email,
    defaultPassword: 'Masuk123!',
    avatar:
      data.avatar ||
      (data.jenisKelamin === 'PEREMPUAN'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'),
    namaAyah: data.namaAyah || 'Bambang',
    namaIbu: data.namaIbu || 'Siti',
    pekerjaanAyah: data.pekerjaanAyah || 'Karyawan Swasta',
    pekerjaanIbu: data.pekerjaanIbu || 'Ibu Rumah Tangga',
    penghasilanOrtu: data.penghasilanOrtu || 'Rp 3.000.000 - Rp 5.000.000',
    noHpOrtu: data.noHpOrtu || '081234567800',
  };

  const updated = [newStudent, ...all];
  persistStore(updated);
  return newStudent;
}

export function updateStudent(id: string, updates: Partial<SeedStudent>): SeedStudent | null {
  const all = getAllStudents();
  const index = all.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const current = all[index]!;
  let kelasNama = updates.kelasNama ?? current.kelasNama;
  if (updates.kelasId && updates.kelasId !== current.kelasId) {
    const kls = SEED_CLASSES.find((c) => c.id === updates.kelasId);
    kelasNama = kls ? kls.nama : current.kelasNama;
  }

  const updatedStudent: SeedStudent = {
    ...current,
    ...updates,
    kelasNama,
  };

  all[index] = updatedStudent;
  persistStore(all);
  return updatedStudent;
}

export function deleteStudent(id: string): boolean {
  const all = getAllStudents();
  const filtered = all.filter((s) => s.id !== id);
  if (filtered.length === all.length) return false;
  persistStore(filtered);
  return true;
}
