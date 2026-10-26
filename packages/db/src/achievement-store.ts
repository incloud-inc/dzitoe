// ==============================================================================
// DZITOE — Student Achievement & Portfolio Store (@dzitoe/db)
// SMAN 20 Kabupaten Tangerang
// Module A21: Prestasi & Portofolio Murid
// ==============================================================================

import { getStudentById } from './student-store';

export type JenisPrestasi = 'AKADEMIK' | 'NON_AKADEMIK';

export type Tingkat =
  | 'SEKOLAH'
  | 'KECAMATAN'
  | 'KABUPATEN'
  | 'PROVINSI'
  | 'NASIONAL'
  | 'INTERNASIONAL';

export interface PrestasiRecord {
  id: string;
  muridId: string;
  muridNama: string;
  kelasNama: string;
  jenis: JenisPrestasi;
  nama: string; // Nama kejuaraan/lomba
  bidang: string; // Misal: Sains, Olahraga Atletik, Seni Tari, Debat Bahasa Inggris
  tingkat: Tingkat;
  peringkat: string; // Misal: Juara 1, Juara 2, Juara 3, Harapan 1, Finalis
  poin: number;
  tahun: number;
  penyelenggara: string;
  sertifikatUrl?: string | null;
  nomorSertifikat?: string | null;
  keterangan?: string | null;
  createdAt: string;
  updatedAt: string;
}

export function hitungPoinPrestasi(tingkat: Tingkat, peringkat: string): number {
  const p = peringkat.toLowerCase();
  const isJuara1 = p.includes('1') || p.includes('emas') || p.includes('pertama');
  const isJuara2 = p.includes('2') || p.includes('perak') || p.includes('kedua');
  const isJuara3 = p.includes('3') || p.includes('perunggu') || p.includes('ketiga');

  switch (tingkat) {
    case 'INTERNASIONAL':
      if (isJuara1) return 100;
      if (isJuara2) return 90;
      if (isJuara3) return 80;
      return 60;
    case 'NASIONAL':
      if (isJuara1) return 75;
      if (isJuara2) return 65;
      if (isJuara3) return 55;
      return 40;
    case 'PROVINSI':
      if (isJuara1) return 50;
      if (isJuara2) return 40;
      if (isJuara3) return 30;
      return 20;
    case 'KABUPATEN':
      if (isJuara1) return 30;
      if (isJuara2) return 25;
      if (isJuara3) return 20;
      return 10;
    case 'KECAMATAN':
      if (isJuara1) return 15;
      if (isJuara2) return 12;
      if (isJuara3) return 10;
      return 5;
    case 'SEKOLAH':
    default:
      if (isJuara1) return 10;
      if (isJuara2) return 8;
      if (isJuara3) return 6;
      return 3;
  }
}

const INITIAL_PRESTASI: PrestasiRecord[] = [
  {
    id: 'prs-2026-001',
    muridId: 'mrd-1',
    muridNama: 'Aditya Pratama',
    kelasNama: 'X-A',
    jenis: 'AKADEMIK',
    nama: 'Olimpiade Sains Nasional (OSN) Matematika Tingkat Kabupaten Tangerang',
    bidang: 'Matematika & Sains',
    tingkat: 'KABUPATEN',
    peringkat: 'Juara 1 (Medali Emas)',
    poin: 30,
    tahun: 2026,
    penyelenggara: 'Balai Pengembangan Talenta Indonesia (BPTI / Kemendikdasmen)',
    sertifikatUrl: '/sertifikat/osn-2026-aditya.pdf',
    nomorSertifikat: '421.3/BPTI-OSN/09/2026',
    keterangan: 'Maju mewakili Kabupaten Tangerang ke OSN Tingkat Provinsi Banten',
    createdAt: '2026-08-20T08:00:00.000Z',
    updatedAt: '2026-08-20T08:00:00.000Z',
  },
  {
    id: 'prs-2026-002',
    muridId: 'mrd-2',
    muridNama: 'Anisa Rahmawati',
    kelasNama: 'X-A',
    jenis: 'NON_AKADEMIK',
    nama: 'Festival & Lomba Seni Siswa Nasional (FLS2N) Tari Tradisional Banten',
    bidang: 'Seni Tari & Budaya',
    tingkat: 'PROVINSI',
    peringkat: 'Juara 2 (Medali Perak)',
    poin: 40,
    tahun: 2026,
    penyelenggara: 'Dinas Pendidikan dan Kebudayaan Provinsi Banten',
    sertifikatUrl: '/sertifikat/fls2n-2026-anisa.pdf',
    nomorSertifikat: '002/FLS2N-BTN/2026',
    keterangan: 'Koreografi Tari Cukin Kreasi Mandiri',
    createdAt: '2026-09-02T10:00:00.000Z',
    updatedAt: '2026-09-02T10:00:00.000Z',
  },
  {
    id: 'prs-2026-003',
    muridId: 'mrd-3',
    muridNama: 'Bayu Nugroho',
    kelasNama: 'X-B',
    jenis: 'NON_AKADEMIK',
    nama: 'Kejuaraan Olahraga Pelajar Daerah (O2SN) Pencak Silat Kelas C Putra',
    bidang: 'Olahraga Bela Diri',
    tingkat: 'KABUPATEN',
    peringkat: 'Juara 1 (Medali Emas)',
    poin: 30,
    tahun: 2026,
    penyelenggara: 'IPSI Kabupaten Tangerang & Dispora',
    sertifikatUrl: '/sertifikat/o2sn-2026-bayu.pdf',
    nomorSertifikat: 'IPSI-TGR/082/2026',
    keterangan: 'Kategori Tanding Putra 47-51 kg',
    createdAt: '2026-09-12T14:30:00.000Z',
    updatedAt: '2026-09-12T14:30:00.000Z',
  },
  {
    id: 'prs-2026-004',
    muridId: 'mrd-4',
    muridNama: 'Dewi Lestari',
    kelasNama: 'X-B',
    jenis: 'AKADEMIK',
    nama: 'Lomba Karya Tulis Ilmiah Remaja (LKIR) Lingkungan Hidup Pesisir',
    bidang: 'Karya Ilmiah Remaja (KIR)',
    tingkat: 'NASIONAL',
    peringkat: 'Juara 3 (Medali Perunggu)',
    poin: 55,
    tahun: 2026,
    penyelenggara: 'Badan Riset dan Inovasi Nasional (BRIN)',
    sertifikatUrl: '/sertifikat/lkir-2026-dewi.pdf',
    nomorSertifikat: 'BRIN-LKIR/2026/091',
    keterangan: 'Penelitian konservasi mangrove di pesisir Pakuhaji Kabupaten Tangerang',
    createdAt: '2026-09-28T09:00:00.000Z',
    updatedAt: '2026-09-28T09:00:00.000Z',
  },
];

const globalStore = globalThis as unknown as {
  __DZITOE_PRESTASI__?: PrestasiRecord[];
};

if (!globalStore.__DZITOE_PRESTASI__) {
  globalStore.__DZITOE_PRESTASI__ = [...INITIAL_PRESTASI];
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
      const dataFile = path.join(dataDir, 'runtime-prestasi.json');
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
      io.fs.writeFileSync(io.dataFile, JSON.stringify(INITIAL_PRESTASI, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[AchievementStore] Error ensuring data file', err);
  }
}

export function getAllAchievements(filter?: {
  jenis?: JenisPrestasi | string;
  tingkat?: Tingkat | string;
  tahun?: number;
  muridId?: string;
  search?: string;
}): PrestasiRecord[] {
  ensureDataFile();
  const io = getFileIo();
  let list = globalStore.__DZITOE_PRESTASI__ || [...INITIAL_PRESTASI];

  if (io) {
    try {
      if (io.fs.existsSync(io.dataFile)) {
        const content = io.fs.readFileSync(io.dataFile, 'utf-8');
        const parsed = JSON.parse(content) as PrestasiRecord[];
        globalStore.__DZITOE_PRESTASI__ = parsed;
        list = parsed;
      }
    } catch (err) {
      console.warn('[AchievementStore] Error reading data file', err);
    }
  }

  if (!filter) return list;

  return list.filter((p) => {
    if (filter.jenis && p.jenis !== filter.jenis) return false;
    if (filter.tingkat && p.tingkat !== filter.tingkat) return false;
    if (filter.tahun && p.tahun !== filter.tahun) return false;
    if (filter.muridId && p.muridId !== filter.muridId) return false;
    if (filter.search) {
      const q = filter.search.toLowerCase();
      const match =
        p.nama.toLowerCase().includes(q) ||
        p.muridNama.toLowerCase().includes(q) ||
        p.kelasNama.toLowerCase().includes(q) ||
        p.bidang.toLowerCase().includes(q) ||
        p.peringkat.toLowerCase().includes(q) ||
        p.penyelenggara.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

function persistAchievements(items: PrestasiRecord[]): void {
  globalStore.__DZITOE_PRESTASI__ = items;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFile();
    io.fs.writeFileSync(io.dataFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[AchievementStore] Error persisting prestasi data file', err);
  }
}

export function getAchievementById(id: string): PrestasiRecord | null {
  const all = getAllAchievements();
  return all.find((p) => p.id === id) || null;
}

export function getAchievementsByStudentId(muridId: string): PrestasiRecord[] {
  return getAllAchievements({ muridId });
}

export function createAchievement(data: {
  muridId: string;
  muridNama?: string;
  kelasNama?: string;
  jenis: JenisPrestasi;
  nama: string;
  bidang: string;
  tingkat: Tingkat;
  peringkat: string;
  poin?: number;
  tahun?: number;
  penyelenggara: string;
  sertifikatUrl?: string | null;
  nomorSertifikat?: string | null;
  keterangan?: string | null;
}): PrestasiRecord {
  const all = getAllAchievements();
  const student = getStudentById(data.muridId);

  const calculatedPoin =
    data.poin !== undefined && data.poin > 0
      ? data.poin
      : hitungPoinPrestasi(data.tingkat, data.peringkat);

  const now = new Date().toISOString();
  const record: PrestasiRecord = {
    id: `prs-${data.tahun || new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
    muridId: data.muridId,
    muridNama: data.muridNama || (student ? student.nama : 'Murid'),
    kelasNama: data.kelasNama || (student ? student.kelasNama : 'Umum'),
    jenis: data.jenis,
    nama: data.nama,
    bidang: data.bidang,
    tingkat: data.tingkat,
    peringkat: data.peringkat,
    poin: calculatedPoin,
    tahun: data.tahun || new Date().getFullYear(),
    penyelenggara: data.penyelenggara,
    sertifikatUrl: data.sertifikatUrl || null,
    nomorSertifikat: data.nomorSertifikat || null,
    keterangan: data.keterangan || null,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [record, ...all];
  persistAchievements(updated);
  return record;
}

export function updateAchievement(
  id: string,
  updates: Partial<Omit<PrestasiRecord, 'id' | 'createdAt'>>
): PrestasiRecord | null {
  const all = getAllAchievements();
  const index = all.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = all[index]!;
  const newTingkat = updates.tingkat || current.tingkat;
  const newPeringkat = updates.peringkat || current.peringkat;
  const newPoin =
    updates.poin !== undefined ? updates.poin : hitungPoinPrestasi(newTingkat, newPeringkat);

  const updatedRecord: PrestasiRecord = {
    ...current,
    ...updates,
    poin: newPoin,
    updatedAt: new Date().toISOString(),
  };

  all[index] = updatedRecord;
  persistAchievements(all);
  return updatedRecord;
}

export function deleteAchievement(id: string): boolean {
  const all = getAllAchievements();
  const filtered = all.filter((p) => p.id !== id);
  if (filtered.length === all.length) return false;
  persistAchievements(filtered);
  return true;
}

export function getAchievementLeaderboard(limit = 10) {
  const all = getAllAchievements();
  const studentMap: Record<
    string,
    {
      muridId: string;
      muridNama: string;
      kelasNama: string;
      totalPoin: number;
      totalPrestasi: number;
      juara1Count: number;
      prestasiTerakhir: string;
      tingkatTertinggi: Tingkat;
    }
  > = {};

  const TINGKAT_RANK: Record<Tingkat, number> = {
    INTERNASIONAL: 6,
    NASIONAL: 5,
    PROVINSI: 4,
    KABUPATEN: 3,
    KECAMATAN: 2,
    SEKOLAH: 1,
  };

  for (const item of all) {
    if (!studentMap[item.muridId]) {
      studentMap[item.muridId] = {
        muridId: item.muridId,
        muridNama: item.muridNama,
        kelasNama: item.kelasNama,
        totalPoin: 0,
        totalPrestasi: 0,
        juara1Count: 0,
        prestasiTerakhir: item.nama,
        tingkatTertinggi: item.tingkat,
      };
    }

    const current = studentMap[item.muridId]!;
    current.totalPoin += item.poin;
    current.totalPrestasi += 1;
    if (item.peringkat.toLowerCase().includes('1') || item.peringkat.toLowerCase().includes('emas')) {
      current.juara1Count += 1;
    }

    if (TINGKAT_RANK[item.tingkat] > TINGKAT_RANK[current.tingkatTertinggi]) {
      current.tingkatTertinggi = item.tingkat;
    }
  }

  const sorted = Object.values(studentMap).sort((a, b) => b.totalPoin - a.totalPoin);
  return sorted.slice(0, limit);
}

export function getAchievementStats() {
  const all = getAllAchievements();
  const total = all.length;

  let totalPoin = 0;
  let totalAkademik = 0;
  let totalNonAkademik = 0;
  let totalNasionalInternasional = 0;

  const perTingkat: Record<Tingkat, number> = {
    SEKOLAH: 0,
    KECAMATAN: 0,
    KABUPATEN: 0,
    PROVINSI: 0,
    NASIONAL: 0,
    INTERNASIONAL: 0,
  };

  for (const p of all) {
    totalPoin += p.poin;
    if (p.jenis === 'AKADEMIK') totalAkademik++;
    if (p.jenis === 'NON_AKADEMIK') totalNonAkademik++;
    if (p.tingkat === 'NASIONAL' || p.tingkat === 'INTERNASIONAL') {
      totalNasionalInternasional++;
    }
    if (perTingkat[p.tingkat] !== undefined) {
      perTingkat[p.tingkat]++;
    }
  }

  return {
    total,
    totalPoin,
    totalAkademik,
    totalNonAkademik,
    totalNasionalInternasional,
    perTingkat,
  };
}
