// ==============================================================================
// DZITOE — Shared Teacher Attendance Store (@dzitoe/db)
// Shared across apps/admin (3000) & apps/mobile (3001)
// With file-backed persistence for cross-process synchronization
// ==============================================================================

import {
  SEED_TEACHER_ATTENDANCE,
  type SeedTeacherAttendance,
  SCHOOL_COORDINATES,
  calculateDistanceMeters,
  getWibDateString,
  getWibTimeString,
  getWibHoursMinutes,
} from './seed-data';
import { getAllTeachers } from './teacher-store';

// Global memory cache to retain records during process lifecycle
const globalStore = globalThis as unknown as {
  __DZITOE_TEACHER_ATTENDANCE__?: SeedTeacherAttendance[];
};

if (!globalStore.__DZITOE_TEACHER_ATTENDANCE__) {
  globalStore.__DZITOE_TEACHER_ATTENDANCE__ = [...SEED_TEACHER_ATTENDANCE];
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
      const dataFile = path.join(dataDir, 'runtime-absensi-guru.json');
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
      io.fs.writeFileSync(io.dataFile, JSON.stringify(SEED_TEACHER_ATTENDANCE, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[TeacherAttendanceStore] Could not write data file, using in-memory only', err);
  }
}

export function getAllTeacherAttendance(): SeedTeacherAttendance[] {
  ensureDataFile();
  const io = getFileIo();
  if (io) {
    try {
      if (io.fs.existsSync(io.dataFile)) {
        const content = io.fs.readFileSync(io.dataFile, 'utf-8');
        const parsed = JSON.parse(content) as SeedTeacherAttendance[];
        globalStore.__DZITOE_TEACHER_ATTENDANCE__ = parsed;
        return parsed;
      }
    } catch (err) {
      console.warn('[TeacherAttendanceStore] Error reading data file', err);
    }
  }
  return globalStore.__DZITOE_TEACHER_ATTENDANCE__ || [...SEED_TEACHER_ATTENDANCE];
}

function persistStore(items: SeedTeacherAttendance[]): void {
  globalStore.__DZITOE_TEACHER_ATTENDANCE__ = items;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFile();
    io.fs.writeFileSync(io.dataFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[TeacherAttendanceStore] Error persisting data file', err);
  }
}

export function recordTeacherAttendance(data: {
  guruId: string;
  type: 'MASUK' | 'PULANG' | 'KBM_NOTE';
  latitude?: number;
  longitude?: number;
  notes?: string;
  keteranganKBM?: string;
  selfieUrl?: string;
}): { success: boolean; message: string; record?: SeedTeacherAttendance } {
  const records = getAllTeacherAttendance();
  const teachers = getAllTeachers();
  const teacher = teachers.find((t) => t.id === data.guruId || t.nip === data.guruId);

  if (!teacher) {
    return { success: false, message: 'Data guru tidak ditemukan.' };
  }

  const timeStr = getWibTimeString();
  const { hours: wibHours, minutes: wibMinutes } = getWibHoursMinutes();
  const tanggalHariIni = getWibDateString();

  let distance: number | null = null;
  let isWithinRadius = false;
  if (data.latitude && data.longitude) {
    distance = calculateDistanceMeters(
      data.latitude,
      data.longitude,
      SCHOOL_COORDINATES.lat,
      SCHOOL_COORDINATES.lng
    );
    isWithinRadius = distance <= SCHOOL_COORDINATES.radiusMeters;
  }

  const existingIndex = records.findIndex(
    (r) => (r.guruId === teacher.id || r.nip === teacher.nip) && r.tanggal === tanggalHariIni
  );

  let updatedRecord: SeedTeacherAttendance;

  if (existingIndex !== -1) {
    const existing = records[existingIndex]!;
    if (data.type === 'PULANG') {
      updatedRecord = {
        ...existing,
        jamPulang: timeStr,
        distanceFromSchool: distance ?? existing.distanceFromSchool,
        isWithinRadius: isWithinRadius || existing.isWithinRadius,
        notes: data.notes || existing.notes,
        keteranganKBM: data.keteranganKBM || existing.keteranganKBM,
      };
    } else if (data.type === 'KBM_NOTE') {
      updatedRecord = {
        ...existing,
        keteranganKBM: data.keteranganKBM || existing.keteranganKBM,
        notes: data.notes || existing.notes,
      };
    } else {
      // MASUK update
      updatedRecord = {
        ...existing,
        jamMasuk: existing.jamMasuk || timeStr,
        distanceFromSchool: distance ?? existing.distanceFromSchool,
        isWithinRadius: isWithinRadius || existing.isWithinRadius,
        notes: data.notes || existing.notes,
      };
    }
    records[existingIndex] = updatedRecord;
  } else {
    // New Record
    const isLate = wibHours > 7 || (wibHours === 7 && wibMinutes > 15);
    updatedRecord = {
      id: `att-t-${tanggalHariIni}-${teacher.id}`,
      guruId: teacher.id,
      guruNama: `${teacher.nama}, ${teacher.gelar}`,
      nip: teacher.nip,
      tanggal: tanggalHariIni,
      jamMasuk: data.type === 'MASUK' ? timeStr : null,
      jamPulang: data.type === 'PULANG' ? timeStr : null,
      status: isLate ? 'TERLAMBAT' : 'TEPAT',
      distanceFromSchool: distance,
      isWithinRadius,
      keteranganKBM: data.keteranganKBM || 'Melaksanakan KBM sesuai jadwal harian.',
      selfieUrl: data.selfieUrl || teacher.avatar,
      notes: data.notes || 'Presensi Guru GPS terverifikasi',
    };
    records.unshift(updatedRecord);
  }

  persistStore(records);
  return {
    success: true,
    message: `Presensi ${data.type === 'PULANG' ? 'pulang' : 'masuk'} berhasil direkam.`,
    record: updatedRecord,
  };
}
