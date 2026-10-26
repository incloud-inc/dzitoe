// ==============================================================================
// DZITOE — Attendance Verification & Permit Approval Store (@dzitoe/db)
// Task: Modul A13 — Approval & Verifikasi Absensi (Izin / Sakit / Dispensasi)
// Standar Permendikdasmen No. 1–6 Tahun 2026 Compliant
// ==============================================================================

import { getAllAttendance } from './attendance-store';

export type PermitType = 'IZIN' | 'SAKIT' | 'DISPENSASI';
export type PermitStatus = 'MENUNGGU' | 'DISETUJUI' | 'DITOLAK';

export interface PermohonanIzin {
  id: string;
  nomorSurat: string;
  userType: 'MURID' | 'GURU';
  userId: string;
  nama: string;
  identifier: string; // NISN atau NIP
  kelasOrJabatan: string;
  jenis: PermitType;
  tanggalMulai: string;
  tanggalSelesai: string;
  durasiHari: number;
  alasan: string;
  lampiranUrl: string; // URL surat dokter / surat orang tua
  lampiranNama: string;
  status: PermitStatus;
  catatanVerifikator: string | null;
  diverifikasiOleh: string | null;
  diverifikasiPada: string | null;
  createdAt: string;
}

export const PERMIT_TYPE_LABELS: Record<PermitType, { label: string; color: string; badge: string }> = {
  SAKIT: {
    label: 'Surat Keterangan Sakit (Dokter/Klinik)',
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
  },
  IZIN: {
    label: 'Izin Keperluan Mendesak / Keluarga',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
  },
  DISPENSASI: {
    label: 'Dispensasi Lomba / Tugas Resmi Sekolah',
    color: 'text-purple-700 bg-purple-50 border-purple-200',
    badge: 'bg-purple-100 text-purple-800',
  },
};

// Seed 10 Real Permit Applications (Students & Teachers SMAN 20)
export const SEED_PERMITS: PermohonanIzin[] = [
  {
    id: 'prm-001',
    nomorSurat: 'IZN/2026/09/001',
    userType: 'MURID',
    userId: 'std-0080000003',
    nama: 'Budi Santoso',
    identifier: '0080000003',
    kelasOrJabatan: 'X.1',
    jenis: 'SAKIT',
    tanggalMulai: '2026-09-28',
    tanggalSelesai: '2026-09-29',
    durasiHari: 2,
    alasan: 'Demam tinggi dan radang tenggorokan akut sesuai anjuran istirahat dokter Puskesmas Sepatan.',
    lampiranUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600',
    lampiranNama: 'Surat_Keterangan_Sakit_Puskesmas.jpg',
    status: 'MENUNGGU',
    catatanVerifikator: null,
    diverifikasiOleh: null,
    diverifikasiPada: null,
    createdAt: '2026-09-28 05:45 WIB',
  },
  {
    id: 'prm-002',
    nomorSurat: 'IZN/2026/09/002',
    userType: 'MURID',
    userId: 'std-0080000007',
    userName: 'Fajar Nugraha',
    nama: 'Fajar Nugraha',
    identifier: '0080000007',
    kelasOrJabatan: 'X.1',
    jenis: 'IZIN',
    tanggalMulai: '2026-09-28',
    tanggalSelesai: '2026-09-28',
    durasiHari: 1,
    alasan: 'Menghadiri prosesi pemakaman kakek kandung di Rangkasbitung bersama keluarga besar.',
    lampiranUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600',
    lampiranNama: 'Surat_Izin_Orang_Tua_Fajar.jpg',
    status: 'MENUNGGU',
    catatanVerifikator: null,
    diverifikasiOleh: null,
    diverifikasiPada: null,
    createdAt: '2026-09-28 06:10 WIB',
  } as any,
  {
    id: 'prm-003',
    nomorSurat: 'DSP/2026/09/003',
    userType: 'MURID',
    userId: 'std-0080000010',
    nama: 'Hendra Gunawan',
    identifier: '0080000010',
    kelasOrJabatan: 'X.1',
    jenis: 'DISPENSASI',
    tanggalMulai: '2026-09-28',
    tanggalSelesai: '2026-09-30',
    durasiHari: 3,
    alasan: 'Mewakili kontingen SMAN 20 Kabupaten Tangerang pada O2SN Tingkat Provinsi Banten Cabang Renang.',
    lampiranUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600',
    lampiranNama: 'Surat_Tugas_Dinas_Pendidikan_O2SN.pdf',
    status: 'DISETUJUI',
    catatanVerifikator: 'Dispensasi resmi disetujui. Tetap jaga kesehatan dan harumkan nama sekolah!',
    diverifikasiOleh: 'Supriyadi, S.Pd. (Waka Kesiswaan)',
    diverifikasiPada: '2026-09-27 15:30 WIB',
    createdAt: '2026-09-27 09:15 WIB',
  },
  {
    id: 'prm-004',
    nomorSurat: 'IZN/2026/09/004',
    userType: 'GURU',
    userId: 'tch-016',
    nama: 'Sri Wahyuni, S.Pd.',
    identifier: '198711052010012003',
    kelasOrJabatan: 'Guru Sosiologi (PPPK)',
    jenis: 'IZIN',
    tanggalMulai: '2026-09-28',
    tanggalSelesai: '2026-09-28',
    durasiHari: 1,
    alasan: 'Menghadiri wisuda magister (S2) adik kandung di Universitas Indonesia, Depok.',
    lampiranUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600',
    lampiranNama: 'Undangan_Wisuda_UI.pdf',
    status: 'DISETUJUI',
    catatanVerifikator: 'Izin disetujui. Bahan ajar KBM telah dititipkan ke guru piket.',
    diverifikasiOleh: 'Drs. H. Ahmad Fauzi, M.Pd. (Kepala Sekolah)',
    diverifikasiPada: '2026-09-27 17:00 WIB',
    createdAt: '2026-09-27 10:00 WIB',
  },
  {
    id: 'prm-005',
    nomorSurat: 'IZN/2026/09/005',
    userType: 'MURID',
    userId: 'std-0080000004',
    nama: 'Citra Dewi',
    identifier: '0080000004',
    kelasOrJabatan: 'X.1',
    jenis: 'SAKIT',
    tanggalMulai: '2026-09-27',
    tanggalSelesai: '2026-09-27',
    durasiHari: 1,
    alasan: 'Gejala tifus dan disarankan observasi istirahat di rumah selama 1 hari.',
    lampiranUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600',
    lampiranNama: 'Surat_Dokter_Citra.jpg',
    status: 'DISETUJUI',
    catatanVerifikator: 'Disetujui oleh wali kelas X.1. Semoga lekas pulih.',
    diverifikasiOleh: 'Budi Santoso, S.Pd. (Wali Kelas X.1)',
    diverifikasiPada: '2026-09-27 07:10 WIB',
    createdAt: '2026-09-27 06:30 WIB',
  },
  {
    id: 'prm-006',
    nomorSurat: 'IZN/2026/09/006',
    userType: 'MURID',
    userId: 'std-0080000018',
    nama: 'Fahri Ramadhan',
    identifier: '0080000018',
    kelasOrJabatan: 'X.1',
    jenis: 'IZIN',
    tanggalMulai: '2026-09-26',
    tanggalSelesai: '2026-09-26',
    durasiHari: 1,
    alasan: 'Bangun kesiangan dan tidak sempat mengejar jam gerbang.',
    lampiranUrl: '',
    lampiranNama: '',
    status: 'DITOLAK',
    catatanVerifikator: 'Alasan tidak masuk kategori izin resmi dan tanpa tanda tangan orang tua. Dihitung sebagai alpa/terlambat.',
    diverifikasiOleh: 'Budi Santoso, S.Pd. (Wali Kelas X.1)',
    diverifikasiPada: '2026-09-26 08:30 WIB',
    createdAt: '2026-09-26 07:45 WIB',
  },
];

// Global cache
const globalPermitStore = globalThis as unknown as {
  __DZITOE_PERMITS__?: PermohonanIzin[];
};

if (!globalPermitStore.__DZITOE_PERMITS__) {
  globalPermitStore.__DZITOE_PERMITS__ = [...SEED_PERMITS];
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
      const dataFile = path.join(dataDir, 'runtime-permits.json');
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
      io.fs.writeFileSync(io.dataFile, JSON.stringify(SEED_PERMITS, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[PermitStore] Could not write to data file, using in-memory only', err);
  }
}

export function getAllPermits(): PermohonanIzin[] {
  ensureDataFile();
  const io = getFileIo();
  if (io) {
    try {
      if (io.fs.existsSync(io.dataFile)) {
        const content = io.fs.readFileSync(io.dataFile, 'utf-8');
        const parsed = JSON.parse(content) as PermohonanIzin[];
        globalPermitStore.__DZITOE_PERMITS__ = parsed;
        return parsed;
      }
    } catch (err) {
      console.warn('[PermitStore] Error reading data file', err);
    }
  }
  return globalPermitStore.__DZITOE_PERMITS__ || [...SEED_PERMITS];
}

function persistPermits(items: PermohonanIzin[]): void {
  globalPermitStore.__DZITOE_PERMITS__ = items;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFile();
    io.fs.writeFileSync(io.dataFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[PermitStore] Error persisting to data file', err);
  }
}

export function getPermitById(id: string): PermohonanIzin | null {
  const all = getAllPermits();
  return all.find((p) => p.id === id) || null;
}

export interface CreatePermitInput {
  userType: 'MURID' | 'GURU';
  userId: string;
  nama: string;
  identifier: string;
  kelasOrJabatan: string;
  jenis: PermitType;
  tanggalMulai: string;
  tanggalSelesai: string;
  durasiHari?: number;
  alasan: string;
  lampiranUrl?: string;
  lampiranNama?: string;
}

export function createPermit(input: CreatePermitInput): { success: boolean; permit?: PermohonanIzin; message: string } {
  const all = getAllPermits();
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const count = String(all.length + 1).padStart(3, '0');
  const prefix = input.jenis === 'DISPENSASI' ? 'DSP' : 'IZN';
  const nomorSurat = `${prefix}/${year}/${month}/${count}`;

  const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

  const newPermit: PermohonanIzin = {
    id: `prm-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    nomorSurat,
    userType: input.userType,
    userId: input.userId,
    nama: input.nama,
    identifier: input.identifier,
    kelasOrJabatan: input.kelasOrJabatan,
    jenis: input.jenis,
    tanggalMulai: input.tanggalMulai,
    tanggalSelesai: input.tanggalSelesai,
    durasiHari: input.durasiHari || 1,
    alasan: input.alasan,
    lampiranUrl: input.lampiranUrl || '',
    lampiranNama: input.lampiranNama || (input.lampiranUrl ? 'Lampiran_Berkas.jpg' : ''),
    status: 'MENUNGGU',
    catatanVerifikator: null,
    diverifikasiOleh: null,
    diverifikasiPada: null,
    createdAt: timeStr,
  };

  all.unshift(newPermit);
  persistPermits(all);
  return {
    success: true,
    permit: newPermit,
    message: `Permohonan ${input.jenis} no ${nomorSurat} berhasil diajukan dan sedang menunggu verifikasi.`,
  };
}

export function approvePermit(
  id: string,
  verifikatorNama: string,
  catatan?: string
): { success: boolean; permit?: PermohonanIzin; message: string } {
  const all = getAllPermits();
  const permit = all.find((p) => p.id === id);
  if (!permit) {
    return { success: false, message: 'Permohonan izin tidak ditemukan.' };
  }

  const now = new Date();
  const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

  permit.status = 'DISETUJUI';
  permit.catatanVerifikator = catatan || 'Permohonan disetujui sesuai dokumen lampiran sah.';
  permit.diverifikasiOleh = verifikatorNama;
  permit.diverifikasiPada = timeStr;

  persistPermits(all);

  // Synchronize into attendance store if it's for student
  try {
    if (permit.userType === 'MURID') {
      const studentAttendances = getAllAttendance();
      const existing = studentAttendances.find(
        (a) => a.muridId === permit.userId && a.tanggal === permit.tanggalMulai
      );
      if (existing) {
        existing.status = permit.jenis === 'SAKIT' ? 'SAKIT' : 'IZIN';
        existing.notes = `[Terverifikasi] ${permit.jenis}: ${permit.alasan}`;
      }
    }
  } catch (err) {
    console.warn('[PermitStore] Note: Could not auto-sync attendance record', err);
  }

  return {
    success: true,
    permit,
    message: `Permohonan ${permit.nomorSurat} (${permit.nama}) berhasil disetujui!`,
  };
}

export function rejectPermit(
  id: string,
  verifikatorNama: string,
  catatan: string
): { success: boolean; permit?: PermohonanIzin; message: string } {
  const all = getAllPermits();
  const permit = all.find((p) => p.id === id);
  if (!permit) {
    return { success: false, message: 'Permohonan izin tidak ditemukan.' };
  }

  const now = new Date();
  const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

  permit.status = 'DITOLAK';
  permit.catatanVerifikator = catatan || 'Dokumen atau alasan tidak memenuhi kriteria izin resmi.';
  permit.diverifikasiOleh = verifikatorNama;
  permit.diverifikasiPada = timeStr;

  persistPermits(all);
  return {
    success: true,
    permit,
    message: `Permohonan ${permit.nomorSurat} (${permit.nama}) telah ditolak dengan catatan: "${permit.catatanVerifikator}".`,
  };
}
