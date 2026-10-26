import { NextResponse } from 'next/server';
import { db } from '@dzitoe/db';

export interface SchoolSettings {
  // Profil Sekolah
  schoolName: string;
  npsn: string;
  accreditation: string;
  address: string;
  phone: string;
  email: string;
  headmaster: string;
  headmasterNip: string;
  logoUrl?: string;

  // Titik Lokasi & Radius GPS
  latitude: number;
  longitude: number;
  radiusMeters: number;
  maxGpsAccuracy: number;
  enforceMockLocationCheck: boolean;

  // Jam Operasional Absensi
  checkInStart: string;
  checkInLateThreshold: string;
  checkInEnd: string;
  checkOutStart: string;
  checkOutEnd: string;

  // Tahun Ajaran & Semester
  academicYear: string;
  semester: 'GANJIL' | 'GENAP';

  // Mode Uji Coba & Sandbox (Keharusan Data Asli vs Simulasi)
  modeUjiCoba: boolean;
  modeUjiCobaBypassGps: boolean;
  modeUjiCobaBypassWaktu: boolean;
  modeUjiCobaBypassLiveness: boolean;
  modeUjiCobaSimulasiWa: boolean;
  modeUjiCobaAutoAuth: boolean;
  modeUjiCobaBypassDeviceLock: boolean;

  // Domain & Subdomain Jaringan (Dinamis / Fleksibel)
  primaryDomain: string;
  adminSubdomain: string;
  mobileSubdomain: string;
  appProtocol: 'https' | 'http';
  serverIpAddress: string;
}

export const DEFAULT_SETTINGS: SchoolSettings = {
  schoolName: 'SMAN 20 Kabupaten Tangerang',
  npsn: '69984561',
  accreditation: 'A (Unggul)',
  address: 'Jl. Raya Pakuhaji No. 20, Kec. Pakuhaji, Kab. Tangerang, Banten 15570',
  phone: '(021) 5937-2020',
  email: 'info@sman20kabtangerang.sch.id',
  headmaster: 'Dr. H. Subagyo, M.M.',
  headmasterNip: '196805141994031004',
  logoUrl: '/logo-sman20.png',

  latitude: -6.123456,
  longitude: 106.123456,
  radiusMeters: 100,
  maxGpsAccuracy: 50,
  enforceMockLocationCheck: true,

  checkInStart: '06:00',
  checkInLateThreshold: '07:15',
  checkInEnd: '08:00',
  checkOutStart: '12:00',
  checkOutEnd: '17:00',

  academicYear: '2025/2026',
  semester: 'GANJIL',

  modeUjiCoba: false,
  modeUjiCobaBypassGps: true,
  modeUjiCobaBypassWaktu: true,
  modeUjiCobaBypassLiveness: true,
  modeUjiCobaSimulasiWa: true,
  modeUjiCobaAutoAuth: true,
  modeUjiCobaBypassDeviceLock: true,

  primaryDomain: 'sman20kabtangerang.sch.id',
  adminSubdomain: 'admin.sman20kabtangerang.sch.id',
  mobileSubdomain: 'mobile.sman20kabtangerang.sch.id',
  appProtocol: 'https',
  serverIpAddress: '103.145.22.180',
};

export async function GET() {
  try {
    const rawSettings = await db.pengaturan.findMany();
    const settingsMap: Record<string, string> = {};
    for (const item of rawSettings) {
      settingsMap[item.key] = item.value;
    }

    const mergedSettings: SchoolSettings = {
      schoolName: settingsMap['schoolName'] ?? DEFAULT_SETTINGS.schoolName,
      npsn: settingsMap['npsn'] ?? DEFAULT_SETTINGS.npsn,
      accreditation: settingsMap['accreditation'] ?? DEFAULT_SETTINGS.accreditation,
      address: settingsMap['address'] ?? DEFAULT_SETTINGS.address,
      phone: settingsMap['phone'] ?? DEFAULT_SETTINGS.phone,
      email: settingsMap['email'] ?? DEFAULT_SETTINGS.email,
      headmaster: settingsMap['headmaster'] ?? DEFAULT_SETTINGS.headmaster,
      headmasterNip: settingsMap['headmasterNip'] ?? DEFAULT_SETTINGS.headmasterNip,

      latitude: settingsMap['latitude'] ? parseFloat(settingsMap['latitude']) : DEFAULT_SETTINGS.latitude,
      longitude: settingsMap['longitude'] ? parseFloat(settingsMap['longitude']) : DEFAULT_SETTINGS.longitude,
      radiusMeters: settingsMap['radiusMeters'] ? parseInt(settingsMap['radiusMeters'], 10) : DEFAULT_SETTINGS.radiusMeters,
      maxGpsAccuracy: settingsMap['maxGpsAccuracy'] ? parseInt(settingsMap['maxGpsAccuracy'], 10) : DEFAULT_SETTINGS.maxGpsAccuracy,
      enforceMockLocationCheck: settingsMap['enforceMockLocationCheck'] !== 'false',

      checkInStart: settingsMap['checkInStart'] ?? DEFAULT_SETTINGS.checkInStart,
      checkInLateThreshold: settingsMap['checkInLateThreshold'] ?? DEFAULT_SETTINGS.checkInLateThreshold,
      checkInEnd: settingsMap['checkInEnd'] ?? DEFAULT_SETTINGS.checkInEnd,
      checkOutStart: settingsMap['checkOutStart'] ?? DEFAULT_SETTINGS.checkOutStart,
      checkOutEnd: settingsMap['checkOutEnd'] ?? DEFAULT_SETTINGS.checkOutEnd,

      academicYear: settingsMap['academicYear'] ?? DEFAULT_SETTINGS.academicYear,
      semester: (settingsMap['semester'] as 'GANJIL' | 'GENAP') ?? DEFAULT_SETTINGS.semester,

      modeUjiCoba: settingsMap['modeUjiCoba'] === 'true',
      modeUjiCobaBypassGps: settingsMap['modeUjiCobaBypassGps'] ? settingsMap['modeUjiCobaBypassGps'] !== 'false' : DEFAULT_SETTINGS.modeUjiCobaBypassGps,
      modeUjiCobaBypassWaktu: settingsMap['modeUjiCobaBypassWaktu'] ? settingsMap['modeUjiCobaBypassWaktu'] !== 'false' : DEFAULT_SETTINGS.modeUjiCobaBypassWaktu,
      modeUjiCobaBypassLiveness: settingsMap['modeUjiCobaBypassLiveness'] ? settingsMap['modeUjiCobaBypassLiveness'] !== 'false' : DEFAULT_SETTINGS.modeUjiCobaBypassLiveness,
      modeUjiCobaSimulasiWa: settingsMap['modeUjiCobaSimulasiWa'] ? settingsMap['modeUjiCobaSimulasiWa'] !== 'false' : DEFAULT_SETTINGS.modeUjiCobaSimulasiWa,
      modeUjiCobaAutoAuth: settingsMap['modeUjiCobaAutoAuth'] ? settingsMap['modeUjiCobaAutoAuth'] !== 'false' : DEFAULT_SETTINGS.modeUjiCobaAutoAuth,
      modeUjiCobaBypassDeviceLock: settingsMap['modeUjiCobaBypassDeviceLock'] ? settingsMap['modeUjiCobaBypassDeviceLock'] !== 'false' : DEFAULT_SETTINGS.modeUjiCobaBypassDeviceLock,

      primaryDomain: settingsMap['primaryDomain'] ?? DEFAULT_SETTINGS.primaryDomain,
      adminSubdomain: settingsMap['adminSubdomain'] ?? DEFAULT_SETTINGS.adminSubdomain,
      mobileSubdomain: settingsMap['mobileSubdomain'] ?? DEFAULT_SETTINGS.mobileSubdomain,
      appProtocol: (settingsMap['appProtocol'] as 'https' | 'http') ?? DEFAULT_SETTINGS.appProtocol,
      serverIpAddress: settingsMap['serverIpAddress'] ?? DEFAULT_SETTINGS.serverIpAddress,
    };

    return NextResponse.json({ success: true, data: mergedSettings });
  } catch (error) {
    console.warn('[API_PENGATURAN_GET] Fallback to runtime settings:', (error as Error).message);
    const fileSettings = readSettingsFile();
    return NextResponse.json({ success: true, data: fileSettings });
  }
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

function getSettingsFileIo() {
  try {
    if (typeof process !== 'undefined' && process.release?.name === 'node' && process.env.NEXT_RUNTIME !== 'edge') {
      // eslint-disable-next-line no-eval
      const nodeRequire = eval('require');
      const fs = nodeRequire('fs');
      const path = nodeRequire('path');
      const monorepoRoot = findMonorepoRoot(process.cwd(), fs, path);
      const dataDir = path.join(monorepoRoot, 'packages', 'db', 'data');
      const dataFile = path.join(dataDir, 'runtime-settings.json');
      return { fs, dataDir, dataFile };
    }
  } catch {
    // Edge runtime fallback
  }
  return null;
}

function readSettingsFile(): SchoolSettings {
  const io = getSettingsFileIo();
  if (io) {
    try {
      if (io.fs.existsSync(io.dataFile)) {
        const content = io.fs.readFileSync(io.dataFile, 'utf-8');
        return { ...DEFAULT_SETTINGS, ...JSON.parse(content) };
      }
    } catch (e) {
      console.warn('[API_PENGATURAN] Could not read runtime settings file:', e);
    }
  }
  return DEFAULT_SETTINGS;
}

function writeSettingsFile(settings: Partial<SchoolSettings>) {
  const io = getSettingsFileIo();
  if (io) {
    try {
      if (!io.fs.existsSync(io.dataDir)) {
        io.fs.mkdirSync(io.dataDir, { recursive: true });
      }
      const existing = readSettingsFile();
      const merged = { ...existing, ...settings };
      io.fs.writeFileSync(io.dataFile, JSON.stringify(merged, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[API_PENGATURAN] Could not write runtime settings file:', e);
    }
  }
}

export async function POST(request: Request) {
  try {
    const payload: Partial<SchoolSettings> = await request.json();

    // Persist to local runtime-settings.json for offline/dev sync
    writeSettingsFile(payload);

    // Simpan ke database jika DB online
    try {
      const updates = Object.entries(payload).map(([key, value]) => {
        return db.pengaturan.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        });
      });

      await db.$transaction(updates);
    } catch (dbError) {
      console.warn('[API_PENGATURAN_POST] DB update fallback:', (dbError as Error).message);
    }

    return NextResponse.json({
      success: true,
      message: 'Pengaturan sekolah dan titik GPS berhasil disimpan.',
      data: payload,
    });
  } catch (error) {
    console.error('[API_PENGATURAN_POST] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan pengaturan.' },
      { status: 500 }
    );
  }
}
