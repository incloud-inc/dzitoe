// ==============================================================================
// DZITOE — Smart Promotion Store (@dzitoe/db)
// Wisaya Kenaikan Kelas Cerdas (Permendikdasmen No. 1–6 Tahun 2026)
// Fitur: Jalur Cepat, Snapshot Backup, 1-Click Rollback, Riwayat Kelas Multi-Tahun
// ==============================================================================

import { getAllStudents } from './student-store';
import { getAllClasses } from './class-store';
import type { SeedStudent } from './seed-data';
import type { RombelClass } from './class-store';

export type StatusKenaikanType = 'NAIK' | 'TINGGAL' | 'LULUS' | 'MUTASI';

export interface PromotionDirectMapping {
  dariKelasId: string;
  dariKelasNama: string;
  tingkatAsal: 'X' | 'XI' | 'XII';
  keKelasId: string;
  keKelasNama: string;
  tingkatTujuan: 'XI' | 'XII' | 'LULUS';
}

export interface StudentPromotionMapping {
  muridId: string;
  muridNama: string;
  nis: string;
  kelasAsalId: string;
  kelasAsalNama: string;
  tingkatAsal: 'X' | 'XI' | string;
  keKelasId: string;
  keKelasNama: string;
  tingkatTujuan: 'XI' | 'XII' | string;
}

export interface PromotionException {
  muridId: string;
  muridNama: string;
  nis: string;
  kelasLamaId: string;
  kelasLamaNama: string;
  tipe: 'TINGGAL_KELAS' | 'MUTASI';
  catatan?: string;
}

export type TindakanKelas12TidakLulus = 'TUNDA_SEMUA' | 'PILIH_SELEKTIF' | 'MUTASI_MASSAL';

export interface PromotionConfig {
  tahunAjaranLama: string;
  tahunAjaranBaru: string;
  luluskanKelas12: boolean;
  tindakanKelas12?: TindakanKelas12TidakLulus;
  siswaKelas12LulusIds?: string[];
  pemetaanJalurCepat?: PromotionDirectMapping[];
  pemetaanSiswa?: StudentPromotionMapping[];
  pengecualian: PromotionException[];
}

export interface ClassCapacitySummary {
  kelasId: string;
  nama: string;
  tingkat: string;
  jumlahSebelum: number;
  jumlahSesudah: number;
  kapasitas: number;
  statusKapasitas: 'AMAN' | 'PENUH' | 'OVERLOAD';
}

export interface PromotionPreviewResult {
  totalMuridDiproses: number;
  totalLulus: number;
  totalNaik: number;
  totalTinggal: number;
  totalMutasi: number;
  ringkasanKelasBaru: ClassCapacitySummary[];
  daftarKelulusan: { id: string; nama: string; nis: string; kelasAsal: string }[];
  daftarPengecualian: PromotionException[];
  peringatan: string[];
}

export interface RiwayatKelasEntry {
  id: string;
  muridId: string;
  muridNama: string;
  nis: string;
  kelasLamaId: string;
  kelasLamaNama: string;
  kelasBaruId?: string | null;
  kelasBaruNama?: string | null;
  tahunAjaranLama: string;
  tahunAjaranBaru: string;
  statusKenaikan: StatusKenaikanType;
  catatan?: string;
  createdAt: string;
}

export interface PromotionSnapshotRecord {
  id: string;
  timestamp: string;
  tahunAjaranLama: string;
  tahunAjaranBaru: string;
  totalMurid: number;
  studentsSnapshot: SeedStudent[];
  classesSnapshot: RombelClass[];
  riwayatEntries: RiwayatKelasEntry[];
  isReverted: boolean;
  createdBy?: string;
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
      return { fs, path, dataDir };
    }
  } catch {
    // edge runtime fallback
  }
  return null;
}

function readJsonFile<T>(filename: string, fallback: T): T {
  const io = getFileIo();
  if (!io) return fallback;
  try {
    const file = io.path.join(io.dataDir, filename);
    if (io.fs.existsSync(file)) {
      const text = io.fs.readFileSync(file, 'utf-8');
      return JSON.parse(text) as T;
    }
  } catch (err) {
    console.warn(`[PromotionStore] Failed to read ${filename}:`, err);
  }
  return fallback;
}

function writeJsonFile<T>(filename: string, data: T): void {
  const io = getFileIo();
  if (!io) return;
  try {
    if (!io.fs.existsSync(io.dataDir)) {
      io.fs.mkdirSync(io.dataDir, { recursive: true });
    }
    const file = io.path.join(io.dataDir, filename);
    io.fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn(`[PromotionStore] Failed to write ${filename}:`, err);
  }
}

// 1. GET STATUS & DEFAULT JALUR CEPAT MAPPING
export function getPromotionStatus() {
  const classes = getAllClasses();
  const students = getAllStudents();

  const currentYear = '2025/2026';
  const nextYear = '2026/2027';

  // Group classes by level
  const kelasX = classes.filter((c) => c.tingkat === 'X');
  const kelasXI = classes.filter((c) => c.tingkat === 'XI');
  const kelasXII = classes.filter((c) => c.tingkat === 'XII');

  // Count active students per level
  const muridX = students.filter((s) => s.kelasNama.toUpperCase().startsWith('X.') || s.kelasNama.toUpperCase().startsWith('X '));
  const muridXI = students.filter((s) => s.kelasNama.toUpperCase().startsWith('XI.') || s.kelasNama.toUpperCase().startsWith('XI '));
  const muridXII = students.filter((s) => s.kelasNama.toUpperCase().startsWith('XII.') || s.kelasNama.toUpperCase().startsWith('XII '));

  // Build default Jalur Cepat (Direct Mapping)
  const defaultMappings: PromotionDirectMapping[] = [];

  // XI -> XII
  kelasXI.forEach((xiClass) => {
    // Match by roman/number suffix, e.g. "XI.1" -> "XII.1"
    const suffix = xiClass.nama.replace(/^XI[.\s]*/i, '');
    const matchedXII = kelasXII.find((xii) => xii.nama.replace(/^XII[.\s]*/i, '') === suffix) || kelasXII[0];
    if (matchedXII) {
      defaultMappings.push({
        dariKelasId: xiClass.id,
        dariKelasNama: xiClass.nama,
        tingkatAsal: 'XI',
        keKelasId: matchedXII.id,
        keKelasNama: matchedXII.nama,
        tingkatTujuan: 'XII',
      });
    }
  });

  // X -> XI
  kelasX.forEach((xClass) => {
    // Match by number suffix, e.g. "X.1" -> "XI.1"
    const suffix = xClass.nama.replace(/^X[.\s]*/i, '');
    const matchedXI = kelasXI.find((xi) => xi.nama.replace(/^XI[.\s]*/i, '') === suffix) || kelasXI[0];
    if (matchedXI) {
      defaultMappings.push({
        dariKelasId: xClass.id,
        dariKelasNama: xClass.nama,
        tingkatAsal: 'X',
        keKelasId: matchedXI.id,
        keKelasNama: matchedXI.nama,
        tingkatTujuan: 'XI',
      });
    }
  });

  // Build default student-level mapping (Per Murid)
  const defaultStudentMappings: StudentPromotionMapping[] = [];
  students.forEach((s) => {
    const isX = s.kelasNama.toUpperCase().startsWith('X.') || s.kelasNama.toUpperCase().startsWith('X ');
    const isXI = s.kelasNama.toUpperCase().startsWith('XI.') || s.kelasNama.toUpperCase().startsWith('XI ');
    if (isX) {
      const suffix = s.kelasNama.replace(/^X[.\s]*/i, '');
      const matchedXI = kelasXI.find((xi) => xi.nama.replace(/^XI[.\s]*/i, '') === suffix) || kelasXI[0];
      if (matchedXI) {
        defaultStudentMappings.push({
          muridId: s.id,
          muridNama: s.nama,
          nis: s.nis || '-',
          kelasAsalId: s.kelasId,
          kelasAsalNama: s.kelasNama,
          tingkatAsal: 'X',
          keKelasId: matchedXI.id,
          keKelasNama: matchedXI.nama,
          tingkatTujuan: 'XI',
        });
      }
    } else if (isXI) {
      const suffix = s.kelasNama.replace(/^XI[.\s]*/i, '');
      const matchedXII = kelasXII.find((xii) => xii.nama.replace(/^XII[.\s]*/i, '') === suffix) || kelasXII[0];
      if (matchedXII) {
        defaultStudentMappings.push({
          muridId: s.id,
          muridNama: s.nama,
          nis: s.nis || '-',
          kelasAsalId: s.kelasId,
          kelasAsalNama: s.kelasNama,
          tingkatAsal: 'XI',
          keKelasId: matchedXII.id,
          keKelasNama: matchedXII.nama,
          tingkatTujuan: 'XII',
        });
      }
    }
  });

  // Check last snapshot
  const snapshots = readJsonFile<PromotionSnapshotRecord[]>('runtime-promotion-snapshots.json', []);
  const lastActiveSnapshot = snapshots.filter((s) => !s.isReverted)[0] || null;

  return {
    tahunAjaranLama: currentYear,
    tahunAjaranBaru: nextYear,
    tingkatStats: {
      X: { jumlahKelas: kelasX.length, jumlahMurid: muridX.length },
      XI: { jumlahKelas: kelasXI.length, jumlahMurid: muridXI.length },
      XII: { jumlahKelas: kelasXII.length, jumlahMurid: muridXII.length },
      totalMurid: students.length,
    },
    defaultMappings,
    defaultStudentMappings,
    allClasses: classes,
    lastActiveSnapshot,
  };
}

// 2. GENERATE PREVIEW (DRY-RUN SIMULATION)
export function generatePromotionPreview(config: PromotionConfig): PromotionPreviewResult {
  const students = getAllStudents();
  const classes = getAllClasses();

  const exceptionsMap = new Map<string, PromotionException>();
  config.pengecualian.forEach((exc) => exceptionsMap.set(exc.muridId, exc));

  const mappingMap = new Map<string, PromotionDirectMapping>();
  if (config.pemetaanJalurCepat) {
    config.pemetaanJalurCepat.forEach((m) => mappingMap.set(m.dariKelasId, m));
  }

  const studentMappingMap = new Map<string, StudentPromotionMapping>();
  if (config.pemetaanSiswa && config.pemetaanSiswa.length > 0) {
    config.pemetaanSiswa.forEach((m) => studentMappingMap.set(m.muridId, m));
  }

  let totalLulus = 0;
  let totalNaik = 0;
  let totalTinggal = 0;
  let totalMutasi = 0;

  const daftarKelulusan: { id: string; nama: string; nis: string; kelasAsal: string }[] = [];
  const classCounterSesudah = new Map<string, number>();
  classes.forEach((c) => classCounterSesudah.set(c.id, 0));

  const warnings: string[] = [];

  for (const s of students) {
    const isKelas12 = s.kelasNama.toUpperCase().startsWith('XII');
    const exc = exceptionsMap.get(s.id);

    if (exc) {
      if (exc.tipe === 'TINGGAL_KELAS') {
        totalTinggal++;
        // Keep in current class or parallel
        const count = classCounterSesudah.get(s.kelasId) || 0;
        classCounterSesudah.set(s.kelasId, count + 1);
      } else if (exc.tipe === 'MUTASI') {
        totalMutasi++;
      }
      continue;
    }

    if (isKelas12) {
      const isLulus =
        config.luluskanKelas12 ||
        (config.tindakanKelas12 === 'PILIH_SELEKTIF' &&
          Boolean(config.siswaKelas12LulusIds?.includes(s.id)));

      if (isLulus) {
        totalLulus++;
        daftarKelulusan.push({
          id: s.id,
          nama: s.nama,
          nis: s.nis,
          kelasAsal: s.kelasNama,
        });
      } else if (config.tindakanKelas12 === 'MUTASI_MASSAL') {
        totalMutasi++;
      } else {
        // TUNDA_SEMUA atau tidak dicentang di PILIH_SELEKTIF: tetap di rombel XII
        totalTinggal++;
        const count = classCounterSesudah.get(s.kelasId) || 0;
        classCounterSesudah.set(s.kelasId, count + 1);
      }
      continue;
    }

    // Student X or XI
    const studentMap = studentMappingMap.get(s.id);
    if (studentMap) {
      totalNaik++;
      const current = classCounterSesudah.get(studentMap.keKelasId) || 0;
      classCounterSesudah.set(studentMap.keKelasId, current + 1);
    } else {
      const mapping = mappingMap.get(s.kelasId);
      if (mapping) {
        totalNaik++;
        const current = classCounterSesudah.get(mapping.keKelasId) || 0;
        classCounterSesudah.set(mapping.keKelasId, current + 1);
      } else {
        warnings.push(`Murid ${s.nama} (${s.kelasNama}) belum memiliki pemetaan kelas tujuan.`);
      }
    }
  }

  // Build class capacity summary
  const ringkasanKelasBaru: ClassCapacitySummary[] = classes.map((c) => {
    const jumlahSesudah = classCounterSesudah.get(c.id) || 0;
    let statusKapasitas: 'AMAN' | 'PENUH' | 'OVERLOAD' = 'AMAN';
    if (jumlahSesudah > c.kapasitas) {
      statusKapasitas = 'OVERLOAD';
      warnings.push(`Kelas ${c.nama} kelebihan kapasitas (${jumlahSesudah}/${c.kapasitas} murid).`);
    } else if (jumlahSesudah >= c.kapasitas - 2) {
      statusKapasitas = 'PENUH';
    }

    return {
      kelasId: c.id,
      nama: c.nama,
      tingkat: c.tingkat,
      jumlahSebelum: c.jumlahMurid,
      jumlahSesudah,
      kapasitas: c.kapasitas,
      statusKapasitas,
    };
  });

  if (!config.luluskanKelas12) {
    if (config.tindakanKelas12 === 'TUNDA_SEMUA' || !config.tindakanKelas12) {
      warnings.push(
        'Kelulusan Kelas XII ditunda (Tunda Semua). Murid kelas XII tetap berada di kelas lamanya dan kuota kelas XII baru akan terbagi.'
      );
    } else if (config.tindakanKelas12 === 'PILIH_SELEKTIF') {
      warnings.push(
        `Kelulusan Selektif Kelas XII: ${totalLulus} murid dinyatakan Lulus, ${totalTinggal} murid ditunda/mengulang di kelas XII.`
      );
    } else if (config.tindakanKelas12 === 'MUTASI_MASSAL') {
      warnings.push(
        'Seluruh murid kelas XII dialihkan ke status Mutasi Keluar.'
      );
    }
  }

  return {
    totalMuridDiproses: students.length,
    totalLulus,
    totalNaik,
    totalTinggal,
    totalMutasi,
    ringkasanKelasBaru,
    daftarKelulusan,
    daftarPengecualian: config.pengecualian,
    peringatan: warnings,
  };
}

// 3. EXECUTE PROMOTION (WITH AUTOMATIC SNAPSHOT & HISTORY)
export function executePromotion(config: PromotionConfig, executedBy = 'Administrator') {
  const students = getAllStudents();
  const classes = getAllClasses();

  const exceptionsMap = new Map<string, PromotionException>();
  config.pengecualian.forEach((exc) => exceptionsMap.set(exc.muridId, exc));

  const mappingMap = new Map<string, PromotionDirectMapping>();
  if (config.pemetaanJalurCepat) {
    config.pemetaanJalurCepat.forEach((m) => mappingMap.set(m.dariKelasId, m));
  }

  const studentMappingMap = new Map<string, StudentPromotionMapping>();
  if (config.pemetaanSiswa && config.pemetaanSiswa.length > 0) {
    config.pemetaanSiswa.forEach((m) => studentMappingMap.set(m.muridId, m));
  }

  const snapshotId = `snp-${Date.now()}`;
  const nowStr = new Date().toISOString();

  // 1. Create Snapshot Record
  const snapshot: PromotionSnapshotRecord = {
    id: snapshotId,
    timestamp: nowStr,
    tahunAjaranLama: config.tahunAjaranLama,
    tahunAjaranBaru: config.tahunAjaranBaru,
    totalMurid: students.length,
    studentsSnapshot: JSON.parse(JSON.stringify(students)),
    classesSnapshot: JSON.parse(JSON.stringify(classes)),
    riwayatEntries: [],
    isReverted: false,
    createdBy: executedBy,
  };

  // 2. Process Students & History
  const updatedStudents: SeedStudent[] = [];
  const riwayatList: RiwayatKelasEntry[] = [];
  const classCounter = new Map<string, number>();
  classes.forEach((c) => classCounter.set(c.id, 0));

  for (const s of students) {
    const isKelas12 = s.kelasNama.toUpperCase().startsWith('XII');
    const exc = exceptionsMap.get(s.id);

    if (exc) {
      if (exc.tipe === 'TINGGAL_KELAS') {
        const entry: RiwayatKelasEntry = {
          id: `rwk-${Date.now()}-${s.id}`,
          muridId: s.id,
          muridNama: s.nama,
          nis: s.nis,
          kelasLamaId: s.kelasId,
          kelasLamaNama: s.kelasNama,
          kelasBaruId: s.kelasId,
          kelasBaruNama: s.kelasNama,
          tahunAjaranLama: config.tahunAjaranLama,
          tahunAjaranBaru: config.tahunAjaranBaru,
          statusKenaikan: 'TINGGAL',
          catatan: exc.catatan || 'Tinggal di kelas asal',
          createdAt: nowStr,
        };
        riwayatList.push(entry);
        updatedStudents.push(s);
        classCounter.set(s.kelasId, (classCounter.get(s.kelasId) || 0) + 1);
      } else if (exc.tipe === 'MUTASI') {
        const entry: RiwayatKelasEntry = {
          id: `rwk-${Date.now()}-${s.id}`,
          muridId: s.id,
          muridNama: s.nama,
          nis: s.nis,
          kelasLamaId: s.kelasId,
          kelasLamaNama: s.kelasNama,
          kelasBaruId: null,
          kelasBaruNama: 'MUTASI KELUAR',
          tahunAjaranLama: config.tahunAjaranLama,
          tahunAjaranBaru: config.tahunAjaranBaru,
          statusKenaikan: 'MUTASI',
          catatan: exc.catatan || 'Pindah/Mutasi sekolah',
          createdAt: nowStr,
        };
        riwayatList.push(entry);
        updatedStudents.push({
          ...s,
          kelasId: '',
          kelasNama: 'Alumni / Mutasi',
        });
      }
      continue;
    }

    if (isKelas12) {
      const isLulus =
        config.luluskanKelas12 ||
        (config.tindakanKelas12 === 'PILIH_SELEKTIF' &&
          Boolean(config.siswaKelas12LulusIds?.includes(s.id)));

      if (isLulus) {
        const entry: RiwayatKelasEntry = {
          id: `rwk-${Date.now()}-${s.id}`,
          muridId: s.id,
          muridNama: s.nama,
          nis: s.nis,
          kelasLamaId: s.kelasId,
          kelasLamaNama: s.kelasNama,
          kelasBaruId: null,
          kelasBaruNama: 'LULUS (ALUMNI)',
          tahunAjaranLama: config.tahunAjaranLama,
          tahunAjaranBaru: config.tahunAjaranBaru,
          statusKenaikan: 'LULUS',
          catatan: 'Lulus Tingkat XII SMA',
          createdAt: nowStr,
        };
        riwayatList.push(entry);
        updatedStudents.push({
          ...s,
          kelasId: '',
          kelasNama: 'Lulus (Alumni)',
        });
      } else if (config.tindakanKelas12 === 'MUTASI_MASSAL') {
        const entry: RiwayatKelasEntry = {
          id: `rwk-${Date.now()}-${s.id}`,
          muridId: s.id,
          muridNama: s.nama,
          nis: s.nis,
          kelasLamaId: s.kelasId,
          kelasLamaNama: s.kelasNama,
          kelasBaruId: null,
          kelasBaruNama: 'MUTASI KELUAR',
          tahunAjaranLama: config.tahunAjaranLama,
          tahunAjaranBaru: config.tahunAjaranBaru,
          statusKenaikan: 'MUTASI',
          catatan: 'Mutasi keluar tingkat XII',
          createdAt: nowStr,
        };
        riwayatList.push(entry);
        updatedStudents.push({
          ...s,
          kelasId: '',
          kelasNama: 'Alumni / Mutasi',
        });
      } else {
        // TUNDA / Tetap di kelas XII asal
        const entry: RiwayatKelasEntry = {
          id: `rwk-${Date.now()}-${s.id}`,
          muridId: s.id,
          muridNama: s.nama,
          nis: s.nis,
          kelasLamaId: s.kelasId,
          kelasLamaNama: s.kelasNama,
          kelasBaruId: s.kelasId,
          kelasBaruNama: s.kelasNama,
          tahunAjaranLama: config.tahunAjaranLama,
          tahunAjaranBaru: config.tahunAjaranBaru,
          statusKenaikan: 'TINGGAL',
          catatan: 'Kelulusan ditunda / Tetap di Kelas XII',
          createdAt: nowStr,
        };
        riwayatList.push(entry);
        updatedStudents.push(s);
        classCounter.set(s.kelasId, (classCounter.get(s.kelasId) || 0) + 1);
      }
      continue;
    }

    // Promoted student (X -> XI, XI -> XII)
    const studentMap = studentMappingMap.get(s.id);
    if (studentMap) {
      const entry: RiwayatKelasEntry = {
        id: `rwk-${Date.now()}-${s.id}`,
        muridId: s.id,
        muridNama: s.nama,
        nis: s.nis,
        kelasLamaId: s.kelasId,
        kelasLamaNama: s.kelasNama,
        kelasBaruId: studentMap.keKelasId,
        kelasBaruNama: studentMap.keKelasNama,
        tahunAjaranLama: config.tahunAjaranLama,
        tahunAjaranBaru: config.tahunAjaranBaru,
        statusKenaikan: 'NAIK',
        catatan: `Naik ke ${studentMap.keKelasNama} (Pemetaan Per Siswa)`,
        createdAt: nowStr,
      };
      riwayatList.push(entry);
      updatedStudents.push({
        ...s,
        kelasId: studentMap.keKelasId,
        kelasNama: studentMap.keKelasNama,
      });
      classCounter.set(studentMap.keKelasId, (classCounter.get(studentMap.keKelasId) || 0) + 1);
    } else {
      const mapping = mappingMap.get(s.kelasId);
      if (mapping) {
        const entry: RiwayatKelasEntry = {
          id: `rwk-${Date.now()}-${s.id}`,
          muridId: s.id,
          muridNama: s.nama,
          nis: s.nis,
          kelasLamaId: s.kelasId,
          kelasLamaNama: s.kelasNama,
          kelasBaruId: mapping.keKelasId,
          kelasBaruNama: mapping.keKelasNama,
          tahunAjaranLama: config.tahunAjaranLama,
          tahunAjaranBaru: config.tahunAjaranBaru,
          statusKenaikan: 'NAIK',
          catatan: `Naik ke ${mapping.keKelasNama}`,
          createdAt: nowStr,
        };
        riwayatList.push(entry);
        updatedStudents.push({
          ...s,
          kelasId: mapping.keKelasId,
          kelasNama: mapping.keKelasNama,
        });
        classCounter.set(mapping.keKelasId, (classCounter.get(mapping.keKelasId) || 0) + 1);
      } else {
        // Fallback
        updatedStudents.push(s);
      }
    }
  }

  // Update Rombel Classes with new student counts and academic year
  const updatedClasses: RombelClass[] = classes.map((c) => ({
    ...c,
    jumlahMurid: classCounter.get(c.id) || 0,
    tahunAjaran: config.tahunAjaranBaru,
  }));

  // Attach riwayat to snapshot
  snapshot.riwayatEntries = riwayatList;

  // Persist files
  writeJsonFile('runtime-murid.json', updatedStudents);
  writeJsonFile('runtime-rombel.json', updatedClasses);

  const existingHistory = readJsonFile<RiwayatKelasEntry[]>('runtime-riwayat-kelas.json', []);
  writeJsonFile('runtime-riwayat-kelas.json', [...riwayatList, ...existingHistory]);

  const existingSnapshots = readJsonFile<PromotionSnapshotRecord[]>('runtime-promotion-snapshots.json', []);
  const allSnapshots = [snapshot, ...existingSnapshots];

  // Auto-archive: Keep only latest 5 snapshots in active file, archive older ones to avoid multi-MB bloat
  if (allSnapshots.length > 5) {
    const io = getFileIo();
    if (io) {
      try {
        const archiveDir = io.path.join(io.dataDir, 'archive');
        if (!io.fs.existsSync(archiveDir)) io.fs.mkdirSync(archiveDir, { recursive: true });
        const archiveFile = io.path.join(archiveDir, 'snapshots-historical.json');
        const prevArchive = io.fs.existsSync(archiveFile) ? JSON.parse(io.fs.readFileSync(archiveFile, 'utf-8')) : [];
        io.fs.writeFileSync(archiveFile, JSON.stringify([...allSnapshots.slice(5), ...prevArchive], null, 2), 'utf-8');
      } catch (err) {
        console.warn('[PromotionStore] Failed archiving older snapshots:', err);
      }
    }
  }
  writeJsonFile('runtime-promotion-snapshots.json', allSnapshots.slice(0, 5));

  return {
    success: true,
    snapshotId,
    message: `Kenaikan Kelas ke Tahun Ajaran ${config.tahunAjaranBaru} berhasil dieksekusi.`,
    totalDiproses: updatedStudents.length,
    totalRiwayatDicatat: riwayatList.length,
  };
}

// 4. ROLLBACK / UNDO PROMOTION
export function rollbackPromotion(snapshotId?: string, revertedBy = 'Administrator') {
  const snapshots = readJsonFile<PromotionSnapshotRecord[]>('runtime-promotion-snapshots.json', []);
  if (snapshots.length === 0) {
    throw new Error('Tidak ada snapshot kenaikan kelas yang ditemukan untuk di-rollback.');
  }

  const targetSnapshot = snapshotId
    ? snapshots.find((s) => s.id === snapshotId && !s.isReverted)
    : snapshots.find((s) => !s.isReverted);

  if (!targetSnapshot) {
    throw new Error('Snapshot kenaikan kelas tidak ditemukan atau sudah dibatalkan.');
  }

  // Restore students & classes
  writeJsonFile('runtime-murid.json', targetSnapshot.studentsSnapshot);
  writeJsonFile('runtime-rombel.json', targetSnapshot.classesSnapshot);

  // Mark snapshot as reverted
  const updatedSnapshots = snapshots.map((s) => {
    if (s.id === targetSnapshot.id) {
      return { ...s, isReverted: true };
    }
    return s;
  });
  writeJsonFile('runtime-promotion-snapshots.json', updatedSnapshots);

  return {
    success: true,
    message: `Kenaikan kelas berhasil dibatalkan (Rollback). Data telah dipulihkan ke posisi Tahun Ajaran ${targetSnapshot.tahunAjaranLama}.`,
    revertedSnapshotId: targetSnapshot.id,
    revertedBy,
  };
}
