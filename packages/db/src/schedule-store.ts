// ==============================================================================
// DZITOE — Shared Schedule & Subject Store (@dzitoe/db)
// Shared across apps/admin (3000) & apps/mobile (3001)
// With file-backed persistence for cross-process synchronization
// ==============================================================================

import {
  SEED_SUBJECTS,
  SEED_SCHEDULES,
  type SeedSubject,
  type SeedSchedule,
  SEED_CLASSES,
} from './seed-data';
import { getAllTeachers } from './teacher-store';

// Global memory cache to retain records during process lifecycle
const globalStore = globalThis as unknown as {
  __DZITOE_SUBJECTS__?: SeedSubject[];
  __DZITOE_SCHEDULES__?: SeedSchedule[];
};

if (!globalStore.__DZITOE_SUBJECTS__) {
  globalStore.__DZITOE_SUBJECTS__ = [...SEED_SUBJECTS];
}

if (!globalStore.__DZITOE_SCHEDULES__) {
  globalStore.__DZITOE_SCHEDULES__ = [...SEED_SCHEDULES];
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
      const schedulesFile = path.join(dataDir, 'runtime-jadwal.json');
      const subjectsFile = path.join(dataDir, 'runtime-mapel.json');
      return { fs, dataDir, schedulesFile, subjectsFile };
    }
  } catch {
    // Edge runtime fallback
  }
  return null;
}

function ensureDataFiles(): void {
  const io = getFileIo();
  if (!io) return;
  try {
    if (!io.fs.existsSync(io.dataDir)) {
      io.fs.mkdirSync(io.dataDir, { recursive: true });
    }
    if (!io.fs.existsSync(io.subjectsFile)) {
      io.fs.writeFileSync(io.subjectsFile, JSON.stringify(SEED_SUBJECTS, null, 2), 'utf-8');
    }
    if (!io.fs.existsSync(io.schedulesFile)) {
      io.fs.writeFileSync(io.schedulesFile, JSON.stringify(SEED_SCHEDULES, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[ScheduleStore] Could not write data file, using in-memory only', err);
  }
}

// -----------------------------------------------------------------------------
// SUBJECTS (MATA PELAJARAN)
// -----------------------------------------------------------------------------

export function getAllSubjects(): SeedSubject[] {
  ensureDataFiles();
  const io = getFileIo();
  if (io) {
    try {
      if (io.fs.existsSync(io.subjectsFile)) {
        const content = io.fs.readFileSync(io.subjectsFile, 'utf-8');
        const parsed = JSON.parse(content) as SeedSubject[];
        globalStore.__DZITOE_SUBJECTS__ = parsed;
        return parsed;
      }
    } catch (err) {
      console.warn('[ScheduleStore] Error reading subjects data file', err);
    }
  }
  return globalStore.__DZITOE_SUBJECTS__ || [...SEED_SUBJECTS];
}

function persistSubjects(items: SeedSubject[]): void {
  globalStore.__DZITOE_SUBJECTS__ = items;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFiles();
    io.fs.writeFileSync(io.subjectsFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[ScheduleStore] Error persisting subjects', err);
  }
}

export function getSubjectById(id: string): SeedSubject | null {
  const all = getAllSubjects();
  return all.find((s) => s.id === id || s.kode.toLowerCase() === id.toLowerCase()) || null;
}

export function createSubject(data: Omit<SeedSubject, 'id'>): SeedSubject {
  const all = getAllSubjects();
  const newSubject: SeedSubject = {
    id: `mp-${Date.now()}`,
    ...data,
  };
  const updated = [...all, newSubject];
  persistSubjects(updated);
  return newSubject;
}

export function updateSubject(id: string, updates: Partial<SeedSubject>): SeedSubject | null {
  const all = getAllSubjects();
  const index = all.findIndex((s) => s.id === id);
  if (index === -1) return null;
  all[index] = { ...all[index]!, ...updates };
  persistSubjects(all);
  return all[index]!;
}

export function deleteSubject(id: string): boolean {
  const all = getAllSubjects();
  const filtered = all.filter((s) => s.id !== id);
  if (filtered.length === all.length) return false;
  persistSubjects(filtered);
  return true;
}

// -----------------------------------------------------------------------------
// SCHEDULES (JADWAL PELAJARAN)
// -----------------------------------------------------------------------------

export function getAllSchedules(): SeedSchedule[] {
  ensureDataFiles();
  const io = getFileIo();
  if (io) {
    try {
      if (io.fs.existsSync(io.schedulesFile)) {
        const content = io.fs.readFileSync(io.schedulesFile, 'utf-8');
        const parsed = JSON.parse(content) as SeedSchedule[];
        globalStore.__DZITOE_SCHEDULES__ = parsed;
        return parsed;
      }
    } catch (err) {
      console.warn('[ScheduleStore] Error reading schedules data file', err);
    }
  }
  return globalStore.__DZITOE_SCHEDULES__ || [...SEED_SCHEDULES];
}

function persistSchedules(items: SeedSchedule[]): void {
  globalStore.__DZITOE_SCHEDULES__ = items;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFiles();
    io.fs.writeFileSync(io.schedulesFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[ScheduleStore] Error persisting schedules', err);
  }
}

export function getSchedulesByClass(kelasIdOrNama: string): SeedSchedule[] {
  const all = getAllSchedules();
  const q = kelasIdOrNama.toLowerCase().trim();
  return all.filter(
    (s) => s.kelasId.toLowerCase() === q || s.kelasNama.toLowerCase() === q
  );
}

export function getSchedulesByTeacher(guruId: string): SeedSchedule[] {
  const all = getAllSchedules();
  return all.filter((s) => s.guruId === guruId);
}

export function createSchedule(data: {
  kelasId: string;
  hari: SeedSchedule['hari'];
  jamMulai: string;
  jamSelesai: string;
  mapelId: string;
  guruId: string;
  ruang?: string;
}): SeedSchedule {
  const all = getAllSchedules();
  const kls = SEED_CLASSES.find((c) => c.id === data.kelasId);
  const subjects = getAllSubjects();
  const subject = subjects.find((s) => s.id === data.mapelId);
  const teachers = getAllTeachers();
  const teacher = teachers.find((t) => t.id === data.guruId);

  const newSchedule: SeedSchedule = {
    id: `jdw-${Date.now()}`,
    kelasId: data.kelasId,
    kelasNama: kls?.nama || data.kelasId,
    hari: data.hari,
    jamMulai: data.jamMulai,
    jamSelesai: data.jamSelesai,
    mapelId: data.mapelId,
    mapelNama: subject?.nama || 'Mata Pelajaran',
    guruId: data.guruId,
    guruNama: teacher ? `${teacher.nama}, ${teacher.gelar}` : 'Guru Pengampu',
    ruang: data.ruang || `Ruang ${kls?.nama || ''}`,
  };

  const updated = [newSchedule, ...all];
  persistSchedules(updated);
  return newSchedule;
}

export function updateSchedule(id: string, updates: Partial<SeedSchedule>): SeedSchedule | null {
  const all = getAllSchedules();
  const index = all.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const current = all[index]!;
  let kelasNama = current.kelasNama;
  if (updates.kelasId && updates.kelasId !== current.kelasId) {
    const kls = SEED_CLASSES.find((c) => c.id === updates.kelasId);
    if (kls) kelasNama = kls.nama;
  }

  let mapelNama = current.mapelNama;
  if (updates.mapelId && updates.mapelId !== current.mapelId) {
    const sub = getAllSubjects().find((s) => s.id === updates.mapelId);
    if (sub) mapelNama = sub.nama;
  }

  let guruNama = current.guruNama;
  if (updates.guruId && updates.guruId !== current.guruId) {
    const t = getAllTeachers().find((tea) => tea.id === updates.guruId);
    if (t) guruNama = `${t.nama}, ${t.gelar}`;
  }

  const updatedSchedule: SeedSchedule = {
    ...current,
    ...updates,
    kelasNama,
    mapelNama,
    guruNama,
  };

  all[index] = updatedSchedule;
  persistSchedules(all);
  return updatedSchedule;
}

export function deleteSchedule(id: string): boolean {
  const all = getAllSchedules();
  const filtered = all.filter((s) => s.id !== id);
  if (filtered.length === all.length) return false;
  persistSchedules(filtered);
  return true;
}
