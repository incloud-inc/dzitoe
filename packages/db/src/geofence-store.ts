// ==============================================================================
// DZITOE — Geofence & Anti-Fake GPS Security Store (@dzitoe/db)
// Task: Modul A11 — Validasi Radius & Anti-Fake GPS Geofencing
// Permendikdasmen No. 1–6 Tahun 2026 Compliant
// ==============================================================================

import { SCHOOL_COORDINATES, calculateDistanceMeters } from './seed-data';

export interface GeofenceConfig {
  schoolName: string;
  npsn: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  toleranceMeters: number;
  maxAllowedAccuracyMeters: number;
  enforceMockLocationDetection: boolean;
  enforceTimestampValidation: boolean;
  maxTimestampDriftMinutes: number;
}

export const DEFAULT_GEOFENCE_CONFIG: GeofenceConfig = {
  schoolName: 'SMAN 20 Kabupaten Tangerang',
  npsn: '69900020',
  latitude: SCHOOL_COORDINATES.lat, // -6.079200
  longitude: SCHOOL_COORDINATES.lng, // 106.602500
  radiusMeters: SCHOOL_COORDINATES.radiusMeters, // 100 meter
  toleranceMeters: 25, // toleransi GPS seluler 25 meter
  maxAllowedAccuracyMeters: 80, // akurasi > 80m dianggap terlalu buram/tidak valid
  enforceMockLocationDetection: true,
  enforceTimestampValidation: true,
  maxTimestampDriftMinutes: 5,
};

export type FraudReason =
  | 'OUT_OF_RADIUS'
  | 'MOCK_GPS_DETECTED'
  | 'SUSPICIOUS_ACCURACY_ZERO'
  | 'ACCURACY_TOO_LOW'
  | 'TIMESTAMP_DRIFT'
  | 'IMPOSSIBLE_SPEED';

export interface FraudAttemptLog {
  id: string;
  timestamp: string;
  userType: 'MURID' | 'GURU';
  userId: string;
  userName: string;
  identifier: string; // NISN / NIP
  kelasOrJabatan: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  accuracyMeters: number;
  reason: FraudReason;
  reasonLabel: string;
  deviceInfo: string;
  status: 'BLOCKED' | 'FLAGGED';
  ipAddress: string;
}

export const REASON_LABELS: Record<FraudReason, { label: string; severity: 'high' | 'critical' | 'medium'; desc: string }> = {
  MOCK_GPS_DETECTED: {
    label: 'Aplikasi Fake GPS Terdeteksi',
    severity: 'critical',
    desc: 'Perangkat menggunakan mock location provider atau aplikasi fake GPS spoofing',
  },
  SUSPICIOUS_ACCURACY_ZERO: {
    label: 'Akurasi GPS 0 Meter (Emulator/Injeksi)',
    severity: 'critical',
    desc: 'Sinyal satelit nyata tidak pernah bernilai 0.0m; terindikasi emulator atau modul inject',
  },
  OUT_OF_RADIUS: {
    label: 'Di Luar Radius Geofence Sekolah',
    severity: 'high',
    desc: 'Posisi berada di luar batas toleransi radius 100m dari koordinat gerbang SMAN 20',
  },
  ACCURACY_TOO_LOW: {
    label: 'Akurasi Sinyal Terlalu Buram (>80m)',
    severity: 'medium',
    desc: 'Sinyal GPS lemah atau cell-tower triangulation tidak presisi',
  },
  TIMESTAMP_DRIFT: {
    label: 'Manipulasi Jam Perangkat',
    severity: 'high',
    desc: 'Waktu di HP berbeda lebih dari 5 menit dibanding server NTP resmi sekolah',
  },
  IMPOSSIBLE_SPEED: {
    label: 'Teleportasi / Perpindahan Tidak Wajar',
    severity: 'critical',
    desc: 'Perpindahan koordinat jarak jauh dalam hitungan detik terdeteksi',
  },
};

// Seed 8 Fraud Attempt Logs (Real test cases from security log)
export const SEED_FRAUD_LOGS: FraudAttemptLog[] = [
  {
    id: 'frd-001',
    timestamp: '2026-09-28 06:42:15 WIB',
    userType: 'MURID',
    userId: 'std-0080000015',
    userName: 'Dewi Lestari',
    identifier: '0080000015',
    kelasOrJabatan: 'X.1',
    latitude: -6.175392,
    longitude: 106.827153, // Monas Jakarta
    distanceMeters: 27850,
    accuracyMeters: 5,
    reason: 'OUT_OF_RADIUS',
    reasonLabel: 'Di Luar Radius Geofence Sekolah (27.8 km)',
    deviceInfo: 'Chrome Mobile / Android 14 (Samsung SM-A546B)',
    status: 'BLOCKED',
    ipAddress: '114.124.205.18',
  },
  {
    id: 'frd-002',
    timestamp: '2026-09-28 06:44:02 WIB',
    userType: 'MURID',
    userId: 'std-0080000012',
    userName: 'Bambang Pamungkas',
    identifier: '0080000012',
    kelasOrJabatan: 'X.1',
    latitude: -6.07921,
    longitude: 106.60251,
    distanceMeters: 2,
    accuracyMeters: 0,
    reason: 'SUSPICIOUS_ACCURACY_ZERO',
    reasonLabel: 'Akurasi GPS 0 Meter (Emulator/Injeksi)',
    deviceInfo: 'Firefox Mobile / Android 13 (FakeGPS Free App)',
    status: 'BLOCKED',
    ipAddress: '180.252.164.91',
  },
  {
    id: 'frd-003',
    timestamp: '2026-09-28 06:48:33 WIB',
    userType: 'MURID',
    userId: 'std-0080000008',
    userName: 'Farhan Maulana',
    identifier: '0080000008',
    kelasOrJabatan: 'X.1',
    latitude: -6.0792,
    longitude: 106.6025,
    distanceMeters: 0,
    accuracyMeters: 3,
    reason: 'MOCK_GPS_DETECTED',
    reasonLabel: 'Aplikasi Fake GPS Terdeteksi (Mock Provider)',
    deviceInfo: 'Android 12 (Rooted / Magisk Hide / GPS JoyStick)',
    status: 'BLOCKED',
    ipAddress: '36.85.120.44',
  },
  {
    id: 'frd-004',
    timestamp: '2026-09-27 06:55:10 WIB',
    userType: 'MURID',
    userId: 'std-0080000005',
    userName: 'Eko Prasetyo',
    identifier: '0080000005',
    kelasOrJabatan: 'X.1',
    latitude: -6.0825,
    longitude: 106.608,
    distanceMeters: 720,
    accuracyMeters: 140,
    reason: 'ACCURACY_TOO_LOW',
    reasonLabel: 'Akurasi Sinyal Terlalu Buram (140m)',
    deviceInfo: 'Mobile Safari / iPhone 13 (iOS 17.5)',
    status: 'BLOCKED',
    ipAddress: '110.138.89.23',
  },
  {
    id: 'frd-005',
    timestamp: '2026-09-26 06:35:40 WIB',
    userType: 'GURU',
    userId: 'tch-015',
    userName: 'Dedi Kurniawan, S.Pd.',
    identifier: '198907152014031002',
    kelasOrJabatan: 'Guru Geografi',
    latitude: -6.091,
    longitude: 106.615,
    distanceMeters: 1850,
    accuracyMeters: 12,
    reason: 'OUT_OF_RADIUS',
    reasonLabel: 'Di Luar Radius Geofence Sekolah (1.8 km)',
    deviceInfo: 'Chrome Mobile / Android 13 (Xiaomi Redmi Note 12)',
    status: 'BLOCKED',
    ipAddress: '114.122.90.11',
  },
  {
    id: 'frd-006',
    timestamp: '2026-09-25 07:14:05 WIB',
    userType: 'MURID',
    userId: 'std-0080000020',
    userName: 'Gita Gutawa',
    identifier: '0080000020',
    kelasOrJabatan: 'X.1',
    latitude: -6.0792,
    longitude: 106.6025,
    distanceMeters: 0,
    accuracyMeters: 1,
    reason: 'TIMESTAMP_DRIFT',
    reasonLabel: 'Manipulasi Jam Perangkat (Selisih 25 Menit)',
    deviceInfo: 'Mobile Chrome / Android 11',
    status: 'BLOCKED',
    ipAddress: '182.1.200.77',
  },
  {
    id: 'frd-007',
    timestamp: '2026-09-24 06:40:11 WIB',
    userType: 'MURID',
    userId: 'std-0080000030',
    userName: 'Joko Anwar',
    identifier: '0080000030',
    kelasOrJabatan: 'X.2',
    latitude: -6.07919,
    longitude: 106.60249,
    distanceMeters: 3,
    accuracyMeters: 0,
    reason: 'SUSPICIOUS_ACCURACY_ZERO',
    reasonLabel: 'Akurasi GPS 0 Meter (Emulator/Injeksi)',
    deviceInfo: 'BlueStacks Android Emulator v5.12',
    status: 'BLOCKED',
    ipAddress: '103.20.18.5',
  },
  {
    id: 'frd-008',
    timestamp: '2026-09-23 06:50:22 WIB',
    userType: 'MURID',
    userId: 'std-0080000045',
    userName: 'Maya Estianty',
    identifier: '0080000045',
    kelasOrJabatan: 'X.3',
    latitude: -6.115,
    longitude: 106.635,
    distanceMeters: 5200,
    accuracyMeters: 10,
    reason: 'OUT_OF_RADIUS',
    reasonLabel: 'Di Luar Radius Geofence Sekolah (5.2 km)',
    deviceInfo: 'Vivo Browser / Vivo Y22',
    status: 'BLOCKED',
    ipAddress: '114.79.12.33',
  },
];

// Global cache
const globalGeofenceStore = globalThis as unknown as {
  __DZITOE_FRAUD_LOGS__?: FraudAttemptLog[];
  __DZITOE_GEOFENCE_CONFIG__?: GeofenceConfig;
};

if (!globalGeofenceStore.__DZITOE_FRAUD_LOGS__) {
  globalGeofenceStore.__DZITOE_FRAUD_LOGS__ = [...SEED_FRAUD_LOGS];
}
if (!globalGeofenceStore.__DZITOE_GEOFENCE_CONFIG__) {
  globalGeofenceStore.__DZITOE_GEOFENCE_CONFIG__ = { ...DEFAULT_GEOFENCE_CONFIG };
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
      const dataFile = path.join(dataDir, 'runtime-fraud-logs.json');
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
      io.fs.writeFileSync(io.dataFile, JSON.stringify(SEED_FRAUD_LOGS, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[GeofenceStore] Could not write to data file, using in-memory only', err);
  }
}

export function getAllFraudLogs(): FraudAttemptLog[] {
  ensureDataFile();
  const io = getFileIo();
  if (io) {
    try {
      if (io.fs.existsSync(io.dataFile)) {
        const content = io.fs.readFileSync(io.dataFile, 'utf-8');
        const parsed = JSON.parse(content) as FraudAttemptLog[];
        globalGeofenceStore.__DZITOE_FRAUD_LOGS__ = parsed;
        return parsed;
      }
    } catch (err) {
      console.warn('[GeofenceStore] Error reading data file', err);
    }
  }
  return globalGeofenceStore.__DZITOE_FRAUD_LOGS__ || [...SEED_FRAUD_LOGS];
}

function persistFraudLogs(items: FraudAttemptLog[]): void {
  globalGeofenceStore.__DZITOE_FRAUD_LOGS__ = items;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFile();
    io.fs.writeFileSync(io.dataFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[GeofenceStore] Error persisting to data file', err);
  }
}

export function getGeofenceConfig(): GeofenceConfig {
  return globalGeofenceStore.__DZITOE_GEOFENCE_CONFIG__ || { ...DEFAULT_GEOFENCE_CONFIG };
}

export function updateGeofenceConfig(updates: Partial<GeofenceConfig>): GeofenceConfig {
  const curr = getGeofenceConfig();
  const updated = { ...curr, ...updates };
  globalGeofenceStore.__DZITOE_GEOFENCE_CONFIG__ = updated;
  return updated;
}

export interface ValidationCheckInput {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  isMockLocation?: boolean;
  clientTimestamp?: number;
  userType: 'MURID' | 'GURU';
  userId: string;
  userName: string;
  identifier: string;
  kelasOrJabatan: string;
  deviceInfo?: string;
  ipAddress?: string;
}

export interface ValidationCheckResult {
  valid: boolean;
  distanceMeters: number;
  maxRadiusMeters: number;
  reason?: FraudReason;
  message: string;
  logRecorded?: boolean;
}

export function validatePresenceLocation(input: ValidationCheckInput): ValidationCheckResult {
  const config = getGeofenceConfig();
  const dist = calculateDistanceMeters(
    input.latitude,
    input.longitude,
    config.latitude,
    config.longitude
  );

  const now = new Date();
  const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} WIB`;

  // 1. Check Mock Location flag
  if (input.isMockLocation) {
    recordFraudAttempt({
      userType: input.userType,
      userId: input.userId,
      userName: input.userName,
      identifier: input.identifier,
      kelasOrJabatan: input.kelasOrJabatan,
      latitude: input.latitude,
      longitude: input.longitude,
      distanceMeters: dist,
      accuracyMeters: input.accuracy ?? 0,
      reason: 'MOCK_GPS_DETECTED',
      reasonLabel: REASON_LABELS.MOCK_GPS_DETECTED.label,
      deviceInfo: input.deviceInfo || 'Unknown Device',
      ipAddress: input.ipAddress || '127.0.0.1',
      status: 'BLOCKED',
      timestamp: timeStr,
    });

    return {
      valid: false,
      distanceMeters: dist,
      maxRadiusMeters: config.radiusMeters,
      reason: 'MOCK_GPS_DETECTED',
      message: 'Presensi Ditolak: Aplikasi Fake GPS / Lokasi Tiruan terdeteksi aktif pada perangkat Anda!',
      logRecorded: true,
    };
  }

  // 2. Check Accuracy Zero (Emulator / GPS Injection)
  if (input.accuracy !== undefined && input.accuracy !== null && input.accuracy === 0) {
    recordFraudAttempt({
      userType: input.userType,
      userId: input.userId,
      userName: input.userName,
      identifier: input.identifier,
      kelasOrJabatan: input.kelasOrJabatan,
      latitude: input.latitude,
      longitude: input.longitude,
      distanceMeters: dist,
      accuracyMeters: 0,
      reason: 'SUSPICIOUS_ACCURACY_ZERO',
      reasonLabel: REASON_LABELS.SUSPICIOUS_ACCURACY_ZERO.label,
      deviceInfo: input.deviceInfo || 'Unknown Device',
      ipAddress: input.ipAddress || '127.0.0.1',
      status: 'BLOCKED',
      timestamp: timeStr,
    });

    return {
      valid: false,
      distanceMeters: dist,
      maxRadiusMeters: config.radiusMeters,
      reason: 'SUSPICIOUS_ACCURACY_ZERO',
      message: 'Presensi Ditolak: Akurasi sinyal 0.0m tidak valid (indikasi emulator atau modifikasi sistem).',
      logRecorded: true,
    };
  }

  // 3. Check Accuracy Threshold
  if (input.accuracy && input.accuracy > config.maxAllowedAccuracyMeters) {
    recordFraudAttempt({
      userType: input.userType,
      userId: input.userId,
      userName: input.userName,
      identifier: input.identifier,
      kelasOrJabatan: input.kelasOrJabatan,
      latitude: input.latitude,
      longitude: input.longitude,
      distanceMeters: dist,
      accuracyMeters: input.accuracy,
      reason: 'ACCURACY_TOO_LOW',
      reasonLabel: `${REASON_LABELS.ACCURACY_TOO_LOW.label} (${Math.round(input.accuracy)}m > ${config.maxAllowedAccuracyMeters}m)`,
      deviceInfo: input.deviceInfo || 'Unknown Device',
      ipAddress: input.ipAddress || '127.0.0.1',
      status: 'BLOCKED',
      timestamp: timeStr,
    });

    return {
      valid: false,
      distanceMeters: dist,
      maxRadiusMeters: config.radiusMeters,
      reason: 'ACCURACY_TOO_LOW',
      message: `Presensi Ditolak: Akurasi GPS Anda terlalu rendah (±${Math.round(input.accuracy)}m). Pindahlah ke tempat terbuka agar satelit GPS terkunci lebih akurat.`,
      logRecorded: true,
    };
  }

  // 4. Check Geofence Radius
  const effectiveRadius = config.radiusMeters + config.toleranceMeters;
  if (dist > effectiveRadius) {
    recordFraudAttempt({
      userType: input.userType,
      userId: input.userId,
      userName: input.userName,
      identifier: input.identifier,
      kelasOrJabatan: input.kelasOrJabatan,
      latitude: input.latitude,
      longitude: input.longitude,
      distanceMeters: dist,
      accuracyMeters: input.accuracy ?? 10,
      reason: 'OUT_OF_RADIUS',
      reasonLabel: `${REASON_LABELS.OUT_OF_RADIUS.label} (${dist}m > ${config.radiusMeters}m)`,
      deviceInfo: input.deviceInfo || 'Unknown Device',
      ipAddress: input.ipAddress || '127.0.0.1',
      status: 'BLOCKED',
      timestamp: timeStr,
    });

    return {
      valid: false,
      distanceMeters: dist,
      maxRadiusMeters: config.radiusMeters,
      reason: 'OUT_OF_RADIUS',
      message: `Presensi Ditolak: Anda berada di luar radius SMAN 20 (jarak ±${dist}m, batas ${config.radiusMeters}m). Harap berada di dalam area sekolah.`,
      logRecorded: true,
    };
  }

  return {
    valid: true,
    distanceMeters: dist,
    maxRadiusMeters: config.radiusMeters,
    message: `Koordinat valid di lingkungan sekolah (jarak ±${dist}m dari titik pusat gerbang).`,
  };
}

export function recordFraudAttempt(log: Omit<FraudAttemptLog, 'id'>): FraudAttemptLog {
  const logs = getAllFraudLogs();
  const newLog: FraudAttemptLog = {
    ...log,
    id: `frd-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
  };
  logs.unshift(newLog);
  persistFraudLogs(logs);
  return newLog;
}

export function clearFraudLogs(): void {
  persistFraudLogs([]);
}
