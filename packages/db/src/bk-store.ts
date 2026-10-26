// ==============================================================================
// DZITOE — Guidance & Counseling (BK) & Disiplin Positif Store (@dzitoe/db)
// SMAN 20 Kabupaten Tangerang
// Module A23: Pelayanan BK & Restitusi Disiplin Positif (Permendikdasmen 2026)
// ==============================================================================

import { getStudentById } from './student-store';

export type JenisBK =
  | 'KONSELING_INDIVIDU'
  | 'KONSELING_KELOMPOK'
  | 'BIMBINGAN_KARIR'
  | 'DISIPLIN_POSITIF'
  | 'RUJUKAN';

export type StatusBK = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export type TingkatPrivasi =
  | 'SANGAT_RAHASIA'
  | 'TERBATAS_GURU_BK'
  | 'KOORDINASI_WALI_KELAS';

export interface BKRecord {
  id: string;
  muridId: string;
  muridNama: string;
  kelasNama: string;
  jenis: JenisBK;
  konselor: string;
  tanggal: string; // YYYY-MM-DD
  permasalahan: string;
  latarBelakang?: string | null;
  solusi?: string | null; // Langkah Restitusi dan Pembinaan Karakter
  komitmenMurid?: string | null;
  tindakLanjut?: string | null;
  status: StatusBK;
  privasi: TingkatPrivasi;
  jadwalTatapMuka?: string | null; // ISO datetime or date
  createdAt: string;
  updatedAt: string;
}

const INITIAL_BK_RECORDS: BKRecord[] = [
  {
    id: 'bk-2026-001',
    muridId: 'mrd-1',
    muridNama: 'Aditya Pratama',
    kelasNama: 'X-A',
    jenis: 'BIMBINGAN_KARIR',
    konselor: 'Dra. Hj. Sri Wahyuni, M.Pd (Guru BK)',
    tanggal: '2026-09-20',
    permasalahan: 'Konsultasi peminatan mata pelajaran fase E ke F dan prospek program studi teknik informatika',
    latarBelakang: 'Murid memiliki minat mendalam di bidang coding namun orang tua menginginkan kedokteran',
    solusi: 'Pemberian pemahaman analisis bakat minat, pembekalan materi profil karir STEM, dan rencana mediasi dialog edukatif dengan orang tua',
    komitmenMurid: 'Mempersiapkan portofolio karya algoritma dasar dan menjaga nilai Matematika serta Fisika di atas KKM',
    tindakLanjut: 'Sesi lanjutan bersama orang tua murid pada 10 Oktober 2026',
    status: 'IN_PROGRESS',
    privasi: 'TERBATAS_GURU_BK',
    jadwalTatapMuka: '2026-10-10T10:00:00.000Z',
    createdAt: '2026-09-20T08:30:00.000Z',
    updatedAt: '2026-09-20T09:30:00.000Z',
  },
  {
    id: 'bk-2026-002',
    muridId: 'mrd-3',
    muridNama: 'Bayu Nugroho',
    kelasNama: 'X-B',
    jenis: 'DISIPLIN_POSITIF',
    konselor: 'Ahmad Fauzi, S.Pd (Guru BK)',
    tanggal: '2026-09-28',
    permasalahan: 'Keterlambatan masuk sekolah sebanyak 3 kali berturut-turut pada jam pertama KBM',
    latarBelakang: 'Membantu orang tua menjaga adik balita di pagi hari sebelum berangkat ke sekolah',
    solusi: 'Restitusi: Mengganti jam pelajaran yang tertinggal dengan tugas mandiri perpustakaan serta penyusunan jadwal bangun pagi yang lebih terkelola',
    komitmenMurid: 'Menyesuaikan jam tidur malam dan berangkat 20 menit lebih awal menggunakan angkutan umum',
    tindakLanjut: 'Monitoring presensi kehadiran selama 2 pekan ke depan bersama wali kelas',
    status: 'RESOLVED',
    privasi: 'KOORDINASI_WALI_KELAS',
    jadwalTatapMuka: null,
    createdAt: '2026-09-28T07:45:00.000Z',
    updatedAt: '2026-10-02T08:00:00.000Z',
  },
  {
    id: 'bk-2026-003',
    muridId: 'mrd-2',
    muridNama: 'Anisa Rahmawati',
    kelasNama: 'X-A',
    jenis: 'KONSELING_INDIVIDU',
    konselor: 'Dra. Hj. Sri Wahyuni, M.Pd (Guru BK)',
    tanggal: '2026-10-02',
    permasalahan: 'Penurunan konsentrasi belajar dan kecemasan menghadapi tugas kelompok',
    latarBelakang: 'Merasa kurang percaya diri berbicara di depan umum saat presentasi materi',
    solusi: 'Latihan teknik pernapasan relaksasi, strategi micro-presentation bertahap, dan penugasan peran presenter pendukung di kelompok',
    komitmenMurid: 'Berlatih berbicara mandiri di rumah dan siap menyampaikan 1 slide pembuka pada tugas mendatang',
    tindakLanjut: 'Evaluasi perkembangan rasa percaya diri setelah presentasi pekan depan',
    status: 'IN_PROGRESS',
    privasi: 'SANGAT_RAHASIA',
    jadwalTatapMuka: '2026-10-09T09:00:00.000Z',
    createdAt: '2026-10-02T10:00:00.000Z',
    updatedAt: '2026-10-02T10:45:00.000Z',
  },
];

const globalStore = globalThis as unknown as {
  __DZITOE_BK__?: BKRecord[];
};

if (!globalStore.__DZITOE_BK__) {
  globalStore.__DZITOE_BK__ = [...INITIAL_BK_RECORDS];
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
      const dataFile = path.join(dataDir, 'runtime-bk.json');
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
      io.fs.writeFileSync(io.dataFile, JSON.stringify(INITIAL_BK_RECORDS, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[BKStore] Error ensuring data file', err);
  }
}

export function getAllBKRecords(filter?: {
  jenis?: JenisBK | string;
  status?: StatusBK | string;
  muridId?: string;
  search?: string;
}): BKRecord[] {
  ensureDataFile();
  const io = getFileIo();
  let list = globalStore.__DZITOE_BK__ || [...INITIAL_BK_RECORDS];

  if (io) {
    try {
      if (io.fs.existsSync(io.dataFile)) {
        const content = io.fs.readFileSync(io.dataFile, 'utf-8');
        const parsed = JSON.parse(content) as BKRecord[];
        globalStore.__DZITOE_BK__ = parsed;
        list = parsed;
      }
    } catch (err) {
      console.warn('[BKStore] Error reading data file', err);
    }
  }

  if (!filter) return list;

  return list.filter((b) => {
    if (filter.jenis && b.jenis !== filter.jenis) return false;
    if (filter.status && b.status !== filter.status) return false;
    if (filter.muridId && b.muridId !== filter.muridId) return false;
    if (filter.search) {
      const q = filter.search.toLowerCase();
      const match =
        b.muridNama.toLowerCase().includes(q) ||
        b.kelasNama.toLowerCase().includes(q) ||
        b.konselor.toLowerCase().includes(q) ||
        b.permasalahan.toLowerCase().includes(q) ||
        (b.solusi && b.solusi.toLowerCase().includes(q)) ||
        (b.komitmenMurid && b.komitmenMurid.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });
}

function persistBKRecords(items: BKRecord[]): void {
  globalStore.__DZITOE_BK__ = items;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFile();
    io.fs.writeFileSync(io.dataFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[BKStore] Error persisting BK data file', err);
  }
}

export function getBKRecordById(id: string): BKRecord | null {
  const all = getAllBKRecords();
  return all.find((b) => b.id === id) || null;
}

export function getBKRecordsByStudentId(muridId: string): BKRecord[] {
  return getAllBKRecords({ muridId });
}

export function createBKRecord(data: {
  muridId: string;
  muridNama?: string;
  kelasNama?: string;
  jenis: JenisBK;
  konselor: string;
  tanggal?: string;
  permasalahan: string;
  latarBelakang?: string | null;
  solusi?: string | null;
  komitmenMurid?: string | null;
  tindakLanjut?: string | null;
  status?: StatusBK;
  privasi?: TingkatPrivasi;
  jadwalTatapMuka?: string | null;
}): BKRecord {
  const all = getAllBKRecords();
  const student = getStudentById(data.muridId);

  const now = new Date().toISOString();
  const record: BKRecord = {
    id: `bk-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
    muridId: data.muridId,
    muridNama: data.muridNama || (student ? student.nama : 'Murid'),
    kelasNama: data.kelasNama || (student ? student.kelasNama : 'Umum'),
    jenis: data.jenis,
    konselor: data.konselor || 'Dra. Hj. Sri Wahyuni, M.Pd (Guru BK)',
    tanggal: data.tanggal || new Date().toISOString().slice(0, 10),
    permasalahan: data.permasalahan,
    latarBelakang: data.latarBelakang || null,
    solusi: data.solusi || null,
    komitmenMurid: data.komitmenMurid || null,
    tindakLanjut: data.tindakLanjut || null,
    status: data.status || 'OPEN',
    privasi: data.privasi || 'TERBATAS_GURU_BK',
    jadwalTatapMuka: data.jadwalTatapMuka || null,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [record, ...all];
  persistBKRecords(updated);
  return record;
}

export function updateBKRecord(
  id: string,
  updates: Partial<Omit<BKRecord, 'id' | 'createdAt'>>
): BKRecord | null {
  const all = getAllBKRecords();
  const index = all.findIndex((b) => b.id === id);
  if (index === -1) return null;

  const current = all[index]!;
  const updatedRecord: BKRecord = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  all[index] = updatedRecord;
  persistBKRecords(all);
  return updatedRecord;
}

export function deleteBKRecord(id: string): boolean {
  const all = getAllBKRecords();
  const filtered = all.filter((b) => b.id !== id);
  if (filtered.length === all.length) return false;
  persistBKRecords(filtered);
  return true;
}

export function getBKStats() {
  const all = getAllBKRecords();
  const total = all.length;

  const perJenis: Record<JenisBK, number> = {
    KONSELING_INDIVIDU: 0,
    KONSELING_KELOMPOK: 0,
    BIMBINGAN_KARIR: 0,
    DISIPLIN_POSITIF: 0,
    RUJUKAN: 0,
  };

  const perStatus: Record<StatusBK, number> = {
    OPEN: 0,
    IN_PROGRESS: 0,
    RESOLVED: 0,
    CLOSED: 0,
  };

  let aktif = 0;
  let terjadwalTatapMuka = 0;

  for (const b of all) {
    if (perJenis[b.jenis] !== undefined) perJenis[b.jenis]++;
    if (perStatus[b.status] !== undefined) perStatus[b.status]++;

    if (b.status === 'OPEN' || b.status === 'IN_PROGRESS') {
      aktif++;
    }
    if (b.jadwalTatapMuka) {
      terjadwalTatapMuka++;
    }
  }

  return {
    total,
    aktif,
    selesai: perStatus.RESOLVED + perStatus.CLOSED,
    terjadwalTatapMuka,
    perJenis,
    perStatus,
  };
}
