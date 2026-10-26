// ==============================================================================
// DZITOE — Shared Student Mutation / Mutasi Murid Store (@dzitoe/db)
// Permendikdasmen 2026 & Dapodik Compliant
// Shared across apps/admin (3000) & apps/mobile (3001)
// With file-backed persistence for cross-process synchronization
// ==============================================================================

export type JenisMutasi = 'PINDAH_KELUAR' | 'PINDAH_MASUK' | 'LULUS' | 'DROP_OUT';

export interface SeedMutation {
  id: string;
  muridId: string;
  muridNama: string;
  nis: string;
  nisn: string;
  kelasAsal: string;
  jenisMutasi: JenisMutasi;
  tanggalMutasi: string; // YYYY-MM-DD
  nomorSurat: string;
  sekolahTujuan?: string; // Jika PINDAH_KELUAR
  sekolahAsal?: string;   // Jika PINDAH_MASUK
  alasan: string;
  catatan?: string;
  statusApproval: 'DISETUJUI' | 'PROSES' | 'DITOLAK';
  operatorNama?: string;
  createdAt: string;
}

export const INITIAL_MUTATIONS: SeedMutation[] = [
  {
    id: 'mut-001',
    muridId: 'mrd-demo-01',
    muridNama: 'Rian Pratama Wijaya',
    nis: '25044',
    nisn: '0075544332',
    kelasAsal: 'XI IPA 2',
    jenisMutasi: 'PINDAH_KELUAR',
    tanggalMutasi: '2026-02-14',
    nomorSurat: '421.3/048/SMAN20/II/2026',
    sekolahTujuan: 'SMAN 1 Kota Tangerang',
    alasan: 'Mengikuti kepindahan tugas kedinasan orang tua ke Kota Tangerang',
    catatan: 'Dokumen buku rapor dan surat rekomendasi dinas lengkap',
    statusApproval: 'DISETUJUI',
    operatorNama: 'Dra. Hj. Nunung (Waka Kesiswaan)',
    createdAt: '2026-02-14T03:30:00.000Z',
  },
  {
    id: 'mut-002',
    muridId: 'mrd-demo-02',
    muridNama: 'Clarissa Amanda',
    nis: '26105',
    nisn: '0089911223',
    kelasAsal: 'X.3',
    jenisMutasi: 'PINDAH_MASUK',
    tanggalMutasi: '2026-01-20',
    nomorSurat: '421.3/012/SMAN20/I/2026',
    sekolahAsal: 'SMA Negeri 2 Teluknaga',
    alasan: 'Domisili keluarga berpindah lebih dekat ke kawasan Pakuhaji',
    catatan: 'Diterima di Rombel X.3 berdasarkan hasil tes penempatan',
    statusApproval: 'DISETUJUI',
    operatorNama: 'Budi Santoso, S.Pd (Operator Dapodik)',
    createdAt: '2026-01-20T04:15:00.000Z',
  },
  {
    id: 'mut-003',
    muridId: 'mrd-demo-03',
    muridNama: 'Farhan Maulana Akbar',
    nis: '24018',
    nisn: '0061234567',
    kelasAsal: 'XII IPS 1',
    jenisMutasi: 'LULUS',
    tanggalMutasi: '2025-06-15',
    nomorSurat: '421.3/280/SMAN20/VI/2025',
    sekolahTujuan: 'Universitas Indonesia (SNBP)',
    alasan: 'Kelulusan Resmi Angkatan 2025 dengan Predikat Sangat Baik',
    statusApproval: 'DISETUJUI',
    operatorNama: 'Kepala Sekolah SMAN 20',
    createdAt: '2025-06-15T07:00:00.000Z',
  },
  {
    id: 'mut-004',
    muridId: 'mrd-demo-04',
    muridNama: 'Aldi Hendrawan',
    nis: '25112',
    nisn: '0078877665',
    kelasAsal: 'XI IPS 3',
    jenisMutasi: 'DROP_OUT',
    tanggalMutasi: '2026-03-01',
    nomorSurat: '421.3/065/SMAN20/III/2026',
    alasan: 'Pengunduran diri atas kehendak sendiri karena faktor ekonomi keluarga',
    catatan: 'Sudah dilakukan home visit oleh Tim BK sebanyak 3 kali',
    statusApproval: 'DISETUJUI',
    operatorNama: 'Dra. Hj. Nunung (Waka Kesiswaan)',
    createdAt: '2026-03-01T08:00:00.000Z',
  },
];

const globalStore = globalThis as unknown as {
  __DZITOE_MUTATIONS__?: SeedMutation[];
};

if (!globalStore.__DZITOE_MUTATIONS__) {
  globalStore.__DZITOE_MUTATIONS__ = [...INITIAL_MUTATIONS];
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
      const dataFile = path.join(dataDir, 'runtime-mutasi.json');
      return { fs, dataDir, dataFile };
    }
  } catch {
    // Edge fallback
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
      io.fs.writeFileSync(io.dataFile, JSON.stringify(INITIAL_MUTATIONS, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[MutationStore] Error ensuring data file', err);
  }
}

export function getAllMutations(): SeedMutation[] {
  ensureDataFile();
  const io = getFileIo();
  if (io) {
    try {
      if (io.fs.existsSync(io.dataFile)) {
        const content = io.fs.readFileSync(io.dataFile, 'utf-8');
        const parsed = JSON.parse(content) as SeedMutation[];
        globalStore.__DZITOE_MUTATIONS__ = parsed;
        return parsed;
      }
    } catch (err) {
      console.warn('[MutationStore] Error reading data file', err);
    }
  }
  return globalStore.__DZITOE_MUTATIONS__ || [...INITIAL_MUTATIONS];
}

function persistStore(items: SeedMutation[]): void {
  globalStore.__DZITOE_MUTATIONS__ = items;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFile();
    io.fs.writeFileSync(io.dataFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[MutationStore] Error persisting data file', err);
  }
}

export function getMutationById(id: string): SeedMutation | null {
  const all = getAllMutations();
  return all.find((m) => m.id === id) || null;
}

export function recordMutation(data: Omit<SeedMutation, 'id' | 'createdAt'> & { id?: string }): SeedMutation {
  const all = getAllMutations();
  const newMutation: SeedMutation = {
    ...data,
    id: data.id || `mut-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [newMutation, ...all];
  persistStore(updated);
  return newMutation;
}

export function deleteMutation(id: string): boolean {
  const all = getAllMutations();
  const filtered = all.filter((m) => m.id !== id);
  if (filtered.length === all.length) return false;
  persistStore(filtered);
  return true;
}
