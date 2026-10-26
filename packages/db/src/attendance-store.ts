// ==============================================================================
// DZITOE — Shared Attendance Store (@dzitoe/db)
// Shared across apps/admin (3000) & apps/mobile (3001)
// With file-backed persistence for cross-process synchronization
// ==============================================================================

import {
  SEED_ABSENSI,
  SEED_STUDENTS,
  SCHOOL_COORDINATES,
  calculateDistanceMeters,
  type SeedAbsensi,
  TODAY_DATE_STR,
  getWibDateString,
  getWibTimeString,
  getWibHoursMinutes,
} from './seed-data';

// Global memory cache to retain records during process lifecycle
const globalStore = globalThis as unknown as {
  __DZITOE_ATTENDANCE__?: SeedAbsensi[];
};

if (!globalStore.__DZITOE_ATTENDANCE__) {
  globalStore.__DZITOE_ATTENDANCE__ = [...SEED_ABSENSI];
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
      const dataFile = path.join(dataDir, 'runtime-absensi.json');
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
      io.fs.writeFileSync(io.dataFile, JSON.stringify(SEED_ABSENSI, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[AttendanceStore] Could not write to data file, using in-memory only', err);
  }
}

export function getAllAttendance(): SeedAbsensi[] {
  ensureDataFile();
  const io = getFileIo();
  if (io) {
    try {
      if (io.fs.existsSync(io.dataFile)) {
        const content = io.fs.readFileSync(io.dataFile, 'utf-8');
        const parsed = JSON.parse(content) as SeedAbsensi[];
        globalStore.__DZITOE_ATTENDANCE__ = parsed;
        return parsed;
      }
    } catch (err) {
      console.warn('[AttendanceStore] Error reading data file', err);
    }
  }
  return globalStore.__DZITOE_ATTENDANCE__ || [...SEED_ABSENSI];
}

function persistStore(items: SeedAbsensi[]): void {
  globalStore.__DZITOE_ATTENDANCE__ = items;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFile();
    io.fs.writeFileSync(io.dataFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[AttendanceStore] Error persisting to data file', err);
  }
}

export function getTodayStudentAttendance(
  muridId: string,
  tanggal: string = TODAY_DATE_STR
): SeedAbsensi | null {
  const all = getAllAttendance();
  return all.find((a) => a.muridId === muridId && a.tanggal === tanggal) || null;
}

export function getStudentAttendanceHistory(
  muridId: string,
  limit = 10
): SeedAbsensi[] {
  const all = getAllAttendance();
  return all
    .filter((a) => a.muridId === muridId)
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
    .slice(0, limit);
}

export interface RecordAttendanceInput {
  muridId: string;
  type: 'MASUK' | 'PULANG' | 'IZIN' | 'SAKIT';
  latitude?: number | null;
  longitude?: number | null;
  isDemo?: boolean;
  selfieUrl?: string | null;
  notes?: string | null;
  method?: 'GPS' | 'SELFIE' | 'QR';
  attachmentUrl?: string | null;
  livenessVerified?: boolean;
  imageHash?: string | null;
  parentNotified?: boolean;
  parentNotificationPhone?: string | null;
}

export function recordStudentAttendance(input: RecordAttendanceInput): {
  success: boolean;
  record?: SeedAbsensi;
  message: string;
} {
  const student = SEED_STUDENTS.find((s) => s.id === input.muridId);
  if (!student) {
    return { success: false, message: 'Data murid tidak ditemukan.' };
  }

  const all = getAllAttendance();
  const tanggal = getWibDateString();
  const timeStr = getWibTimeString();
  const { hours: wibHours, minutes: wibMinutes } = getWibHoursMinutes();

  const chosenMethod: 'GPS' | 'SELFIE' | 'QR' =
    input.method || (input.selfieUrl ? 'SELFIE' : 'GPS');

  let existing = all.find((a) => a.muridId === input.muridId && a.tanggal === tanggal);

  if (input.type === 'PULANG') {
    if (!existing) {
      // Buat baru jika belum absen masuk tapi langsung pulang
      existing = {
        id: `abs-${tanggal}-${student.id}`,
        muridId: student.id,
        muridNama: student.nama,
        nisn: student.nisn,
        kelasId: student.kelasId,
        kelasNama: student.kelasNama,
        tanggal,
        jamMasuk: null,
        jamPulang: timeStr,
        status: 'TEPAT',
        latitude: input.latitude ?? SCHOOL_COORDINATES.lat,
        longitude: input.longitude ?? SCHOOL_COORDINATES.lng,
        distanceFromSchool: 10,
        isWithinRadius: true,
        isMockLocation: false,
        selfieUrl: input.selfieUrl ?? null,
        watermarkText: input.selfieUrl ? `SMAN 20 • ${tanggal} ${timeStr} • ABSEN PULANG` : null,
        deviceInfo: input.isDemo ? 'Mobile PWA (Mode Demo Bypass)' : 'Mobile PWA',
        notes: input.notes || 'Absen pulang mandiri',
        method: chosenMethod,
        attachmentUrl: input.attachmentUrl || null,
        livenessVerified: input.livenessVerified ?? (chosenMethod === 'SELFIE'),
        imageHash: input.imageHash || null,
        parentNotified: input.parentNotified ?? true,
        parentNotificationPhone: input.parentNotificationPhone || null,
      };
      all.unshift(existing);
    } else {
      existing.jamPulang = timeStr;
      if (input.notes) existing.notes = input.notes;
      if (input.method) existing.method = input.method;
      if (input.selfieUrl) existing.selfieUrl = input.selfieUrl;
      if (input.parentNotified !== undefined) existing.parentNotified = input.parentNotified;
      if (input.parentNotificationPhone) existing.parentNotificationPhone = input.parentNotificationPhone;
    }
    persistStore(all);
    return {
      success: true,
      record: existing,
      message: `Presensi pulang berhasil dicatat pukul ${timeStr}! Selamat beristirahat.`,
    };
  }

  if (input.type === 'IZIN' || input.type === 'SAKIT') {
    const status = input.type;
    const notes = input.notes || (status === 'IZIN' ? 'Izin keperluan' : 'Sakit');
    if (!existing) {
      existing = {
        id: `abs-${tanggal}-${student.id}`,
        muridId: student.id,
        muridNama: student.nama,
        nisn: student.nisn,
        kelasId: student.kelasId,
        kelasNama: student.kelasNama,
        tanggal,
        jamMasuk: null,
        jamPulang: null,
        status,
        latitude: null,
        longitude: null,
        distanceFromSchool: 0,
        isWithinRadius: false,
        isMockLocation: false,
        selfieUrl: null,
        watermarkText: null,
        deviceInfo: 'Mobile PWA (Permohonan Siswa)',
        notes,
        method: 'GPS',
        attachmentUrl: input.attachmentUrl || null,
        livenessVerified: false,
        imageHash: null,
        parentNotified: input.parentNotified ?? true,
        parentNotificationPhone: input.parentNotificationPhone || null,
      };
      all.unshift(existing);
    } else {
      existing.status = status;
      existing.notes = notes;
      if (input.attachmentUrl) existing.attachmentUrl = input.attachmentUrl;
      if (input.parentNotified !== undefined) existing.parentNotified = input.parentNotified;
      if (input.parentNotificationPhone) existing.parentNotificationPhone = input.parentNotificationPhone;
    }
    persistStore(all);
    return {
      success: true,
      record: existing,
      message: `Pengajuan ${status === 'IZIN' ? 'Izin' : 'Sakit'} berhasil dikirim ke wali kelas & admin.`,
    };
  }

  // Handle Absen MASUK
  let dist = 12;
  let isWithin = true;

  // Jika metode adalah GPS atau SELFIE, hitung jarak bila koordinat ada
  if (!input.isDemo && input.latitude && input.longitude) {
    dist = calculateDistanceMeters(
      input.latitude,
      input.longitude,
      SCHOOL_COORDINATES.lat,
      SCHOOL_COORDINATES.lng
    );
    isWithin = dist <= SCHOOL_COORDINATES.radiusMeters;
    // Jika metode GPS murni, wajib dalam radius
    if (chosenMethod === 'GPS' && !isWithin) {
      return {
        success: false,
        message: `Gagal: Anda berada di luar radius sekolah (jarak ±${dist}m, batas ${SCHOOL_COORDINATES.radiusMeters}m). Dekati sekolah atau gunakan Presensi Swafoto / aktifkan Mode Demo untuk pengujian.`,
      };
    }
  }

  const isLate = wibHours > 7 || (wibHours === 7 && wibMinutes > 15);
  const status: 'TEPAT' | 'TERLAMBAT' = isLate ? 'TERLAMBAT' : 'TEPAT';

  if (!existing) {
    existing = {
      id: `abs-${tanggal}-${student.id}`,
      muridId: student.id,
      muridNama: student.nama,
      nisn: student.nisn,
      kelasId: student.kelasId,
      kelasNama: student.kelasNama,
      tanggal,
      jamMasuk: timeStr,
      jamPulang: null,
      status,
      latitude: input.latitude ?? SCHOOL_COORDINATES.lat,
      longitude: input.longitude ?? SCHOOL_COORDINATES.lng,
      distanceFromSchool: dist,
      isWithinRadius: isWithin,
      isMockLocation: false,
      selfieUrl: input.selfieUrl ?? null,
      watermarkText: input.selfieUrl
        ? `SMAN 20 • ${tanggal} ${timeStr} • JARAK: ${dist}m`
        : null,
      deviceInfo: input.isDemo
        ? 'Mobile PWA (Mode Demo Bypass)'
        : chosenMethod === 'SELFIE'
        ? 'Mobile PWA (Swafoto Watermark GPS)'
        : 'Mobile PWA (GPS Hardware)',
      notes: isLate ? 'Presensi masuk terlambat' : 'Presensi masuk tepat waktu',
      method: chosenMethod,
      attachmentUrl: input.attachmentUrl || null,
      livenessVerified: input.livenessVerified ?? (chosenMethod === 'SELFIE'),
      imageHash: input.imageHash || null,
      parentNotified: input.parentNotified ?? true,
      parentNotificationPhone: input.parentNotificationPhone || null,
    };
    all.unshift(existing);
  } else {
    existing.jamMasuk = timeStr;
    existing.status = status;
    existing.distanceFromSchool = dist;
    existing.isWithinRadius = isWithin;
    existing.method = chosenMethod;
    if (input.selfieUrl) existing.selfieUrl = input.selfieUrl;
    if (input.livenessVerified !== undefined) existing.livenessVerified = input.livenessVerified;
    if (input.imageHash) existing.imageHash = input.imageHash;
    if (input.parentNotified !== undefined) existing.parentNotified = input.parentNotified;
  }

  persistStore(all);
  return {
    success: true,
    record: existing,
    message: `Presensi masuk berhasil dicatat pukul ${timeStr} dengan status: ${status}!`,
  };
}

export function updateAttendanceStatusManual(
  id: string,
  updates: {
    status?: 'TEPAT' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'ALPA';
    notes?: string;
  }
): { success: boolean; record?: SeedAbsensi; message: string } {
  const all = getAllAttendance();
  const item = all.find((a) => a.id === id);
  if (!item) {
    return { success: false, message: 'Data absensi tidak ditemukan.' };
  }

  if (updates.status) item.status = updates.status;
  if (updates.notes !== undefined) item.notes = updates.notes;

  persistStore(all);
  return {
    success: true,
    record: item,
    message: `Status kehadiran ${item.muridNama} berhasil diperbarui menjadi ${item.status}.`,
  };
}

export function getAttendanceSummary(
  tanggal: string = TODAY_DATE_STR,
  kelasId?: string
) {
  const all = getAllAttendance();
  let filtered = all.filter((a) => a.tanggal === tanggal);

  if (kelasId) {
    filtered = filtered.filter((a) => a.kelasId === kelasId);
  }

  const totalSiswa = kelasId ? 5 : SEED_STUDENTS.length;
  const tepat = filtered.filter((a) => a.status === 'TEPAT').length;
  const terlambat = filtered.filter((a) => a.status === 'TERLAMBAT').length;
  const izin = filtered.filter((a) => a.status === 'IZIN').length;
  const sakit = filtered.filter((a) => a.status === 'SAKIT').length;
  const alpa = filtered.filter((a) => a.status === 'ALPA').length;
  const hadir = tepat + terlambat;
  const persentase = totalSiswa > 0 ? Math.round((hadir / totalSiswa) * 100) : 0;

  return {
    tanggal,
    totalSiswa,
    hadir,
    tepat,
    terlambat,
    izin,
    sakit,
    alpa,
    persentase,
  };
}
