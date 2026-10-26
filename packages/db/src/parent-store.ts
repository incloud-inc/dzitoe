// ==============================================================================
// DZITOE — Shared Parent / Orang Tua / Wali Store (@dzitoe/db)
// Shared across apps/admin (3000) & apps/mobile (3001)
// With file-backed persistence for cross-process synchronization
// ==============================================================================

export interface SeedParent {
  id: string;
  userId?: string;
  nama: string;
  nik: string;
  hubungan: 'AYAH' | 'IBU' | 'WALI';
  noHp: string; // WhatsApp aktif
  pekerjaan: string;
  penghasilan: string;
  alamat: string;
  muridIds: string[]; // Siswa yang diasuh
  isPrimaryContact: boolean;
  email?: string;
  createdAt: string;
}

export const INITIAL_PARENTS: SeedParent[] = [
  {
    id: 'prt-001',
    userId: 'usr-prt-001',
    nama: 'H. Bambang Sudirman, S.E.',
    nik: '3603120101750001',
    hubungan: 'AYAH',
    noHp: '081288991122',
    pekerjaan: 'Wiraswasta / Pemilik Usaha',
    penghasilan: 'Rp 10.000.000 - Rp 20.000.000',
    alamat: 'Jl. Raya Pakuhaji No. 12, RT 002/RW 001, Pakuhaji',
    muridIds: ['mrd-001', '26001'],
    isPrimaryContact: true,
    email: 'bambang.sudirman@gmail.com',
    createdAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'prt-002',
    userId: 'usr-prt-002',
    nama: 'Hj. Siti Aminah, S.Pd.',
    nik: '3603124502780002',
    hubungan: 'IBU',
    noHp: '081288991123',
    pekerjaan: 'PNS Guru',
    penghasilan: 'Rp 5.000.000 - Rp 10.000.000',
    alamat: 'Jl. Raya Pakuhaji No. 12, RT 002/RW 001, Pakuhaji',
    muridIds: ['mrd-001', '26001'],
    isPrimaryContact: false,
    email: 'siti.aminah@gmail.com',
    createdAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'prt-003',
    userId: 'usr-prt-003',
    nama: 'Drs. Supardi Mulyono',
    nik: '3603120803720003',
    hubungan: 'AYAH',
    noHp: '081377882233',
    pekerjaan: 'Karyawan BUMN',
    penghasilan: 'Rp 7.500.000 - Rp 15.000.000',
    alamat: 'Kp. Gaga Ilir RT 003/RW 002, Ds. Gaga, Pakuhaji',
    muridIds: ['mrd-002', '26002'],
    isPrimaryContact: true,
    email: 'supardi.m@bumn.co.id',
    createdAt: '2026-01-11T09:15:00.000Z',
  },
  {
    id: 'prt-004',
    userId: 'usr-prt-004',
    nama: 'Endang Wahyuni',
    nik: '3603125206760004',
    hubungan: 'IBU',
    noHp: '081377882234',
    pekerjaan: 'Ibu Rumah Tangga',
    penghasilan: '< Rp 3.000.000',
    alamat: 'Kp. Gaga Ilir RT 003/RW 002, Ds. Gaga, Pakuhaji',
    muridIds: ['mrd-002', '26002'],
    isPrimaryContact: false,
    createdAt: '2026-01-11T09:15:00.000Z',
  },
  {
    id: 'prt-005',
    userId: 'usr-prt-005',
    nama: 'Rahmat Hidayat, S.Kom.',
    nik: '3603121509800005',
    hubungan: 'WALI',
    noHp: '085711223344',
    pekerjaan: 'Konsultan IT',
    penghasilan: 'Rp 10.000.000 - Rp 25.000.000',
    alamat: 'Perum Grand Sepatan Residence Blok C4 No. 8',
    muridIds: ['mrd-003', '26003'],
    isPrimaryContact: true,
    email: 'rahmat.hidayat@techindo.com',
    createdAt: '2026-01-12T10:30:00.000Z',
  },
  {
    id: 'prt-006',
    userId: 'usr-prt-006',
    nama: 'Dedi Kurniawan',
    nik: '3603122204770006',
    hubungan: 'AYAH',
    noHp: '081822334455',
    pekerjaan: 'Pedagang',
    penghasilan: 'Rp 3.000.000 - Rp 5.000.000',
    alamat: 'Jl. KH. Saad No. 45, Buaran Bambu, Pakuhaji',
    muridIds: ['mrd-004', '26004'],
    isPrimaryContact: true,
    createdAt: '2026-01-14T11:00:00.000Z',
  },
  {
    id: 'prt-007',
    userId: 'usr-prt-007',
    nama: 'Sri Lestari',
    nik: '3603126011790007',
    hubungan: 'IBU',
    noHp: '081822334456',
    pekerjaan: 'Penjahit Mandiri',
    penghasilan: 'Rp 2.000.000 - Rp 4.000.000',
    alamat: 'Jl. KH. Saad No. 45, Buaran Bambu, Pakuhaji',
    muridIds: ['mrd-004', '26004'],
    isPrimaryContact: false,
    createdAt: '2026-01-14T11:00:00.000Z',
  },
  {
    id: 'prt-008',
    userId: 'usr-prt-008',
    nama: 'Ir. Agus Wijaya',
    nik: '3603120508730008',
    hubungan: 'AYAH',
    noHp: '081299887766',
    pekerjaan: 'Kontraktor Sipil',
    penghasilan: '> Rp 20.000.000',
    alamat: 'Jl. Raya Tanjung Pasir KM 4, Sukawali, Pakuhaji',
    muridIds: ['mrd-005', '26005'],
    isPrimaryContact: true,
    email: 'agus.wijaya@wijayakonstruksi.id',
    createdAt: '2026-01-15T14:20:00.000Z',
  },
];

const globalStore = globalThis as unknown as {
  __DZITOE_PARENTS__?: SeedParent[];
};

if (!globalStore.__DZITOE_PARENTS__) {
  globalStore.__DZITOE_PARENTS__ = [...INITIAL_PARENTS];
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
      const dataFile = path.join(dataDir, 'runtime-orangtua.json');
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
      io.fs.writeFileSync(io.dataFile, JSON.stringify(INITIAL_PARENTS, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[ParentStore] Error ensuring data file', err);
  }
}

export function getAllParents(): SeedParent[] {
  ensureDataFile();
  const io = getFileIo();
  if (io) {
    try {
      if (io.fs.existsSync(io.dataFile)) {
        const content = io.fs.readFileSync(io.dataFile, 'utf-8');
        const parsed = JSON.parse(content) as SeedParent[];
        globalStore.__DZITOE_PARENTS__ = parsed;
        return parsed;
      }
    } catch (err) {
      console.warn('[ParentStore] Error reading data file', err);
    }
  }
  return globalStore.__DZITOE_PARENTS__ || [...INITIAL_PARENTS];
}

function persistStore(items: SeedParent[]): void {
  globalStore.__DZITOE_PARENTS__ = items;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFile();
    io.fs.writeFileSync(io.dataFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[ParentStore] Error persisting data file', err);
  }
}

export function getParentById(id: string): SeedParent | null {
  const all = getAllParents();
  return all.find((p) => p.id === id || p.userId === id) || null;
}

export function getParentByPhoneOrNisn(identifier: string): SeedParent | null {
  const trimmed = identifier.trim();
  const digitsOnly = trimmed.replace(/[^0-9]/g, '');
  const all = getAllParents();
  return (
    all.find((p) => {
      const pDigits = p.noHp.replace(/[^0-9]/g, '');
      const matchPhone = Boolean(digitsOnly && (pDigits === digitsOnly || p.nik === digitsOnly));
      const matchChild = p.muridIds.includes(trimmed) || Boolean(digitsOnly && p.muridIds.includes(digitsOnly));
      return matchPhone || matchChild;
    }) || null
  );
}

export function getParentsByStudentId(studentId: string): SeedParent[] {
  const all = getAllParents();
  return all.filter((p) => p.muridIds.includes(studentId));
}

export function createParent(data: Omit<SeedParent, 'id' | 'createdAt'> & { id?: string }): SeedParent {
  const all = getAllParents();
  const newParent: SeedParent = {
    ...data,
    id: data.id || `prt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [newParent, ...all];
  persistStore(updated);
  return newParent;
}

export function updateParent(id: string, updates: Partial<SeedParent>): SeedParent | null {
  const all = getAllParents();
  const index = all.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = all[index]!;
  const updatedParent: SeedParent = {
    ...current,
    ...updates,
  };

  all[index] = updatedParent;
  persistStore(all);
  return updatedParent;
}

export function deleteParent(id: string): boolean {
  const all = getAllParents();
  const filtered = all.filter((p) => p.id !== id);
  if (filtered.length === all.length) return false;
  persistStore(filtered);
  return true;
}
