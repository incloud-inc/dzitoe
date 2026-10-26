// ==============================================================================
// DZITOE — Schedule Conflict Detection Engine (@dzitoe/db)
// Task: A7.9 — Algoritma Deteksi Konflik Jadwal (Conflict Detection)
// Standar KBM & Kalender Pendidikan Permendikdasmen 2026
// ==============================================================================

import type { SeedSchedule } from './seed-data';

export type ConflictType =
  | 'TEACHER_CONFLICT'
  | 'CLASS_CONFLICT'
  | 'ROOM_CONFLICT'
  | 'BREAK_CONFLICT';

export type ConflictSeverity = 'CRITICAL' | 'WARNING';

export interface ScheduleConflict {
  id: string;
  type: ConflictType;
  severity: ConflictSeverity;
  hari: string;
  timeRange: string;
  title: string;
  description: string;
  conflictingScheduleIds: string[];
  entityName: string; // Nama guru / nama rombel / nama ruangan
  affectedClasses: string[];
  recommendation: string;
}

export interface BreakTimeSlot {
  label: string;
  hari: string; // 'ALL' atau nama hari spesifik
  jamMulai: string;
  jamSelesai: string;
}

// Jam istirahat standar SMAN 20 Kabupaten Tangerang
export const OFFICIAL_BREAK_TIMES: BreakTimeSlot[] = [
  { label: 'Istirahat Pagi (Kudapan)', hari: 'ALL', jamMulai: '09:45', jamSelesai: '10:15' },
  { label: 'Istirahat Siang & Sholat Dhuhur', hari: 'ALL', jamMulai: '11:45', jamSelesai: '12:30' },
  { label: 'Sholat Jumat Bersama', hari: 'JUMAT', jamMulai: '11:30', jamSelesai: '13:00' },
];

/**
 * Konversi format waktu "HH:MM" (contoh: "07:15") ke total menit sejak 00:00
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':');
  const hours = parseInt(parts[0] || '0', 10);
  const minutes = parseInt(parts[1] || '0', 10);
  return hours * 60 + minutes;
}

/**
 * Cek apakah dua rentang waktu [startA, endA) dan [startB, endB) saling bertumpukan
 */
export function isTimeOverlapping(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const aStart = timeToMinutes(startA);
  const aEnd = timeToMinutes(endA);
  const bStart = timeToMinutes(startB);
  const bEnd = timeToMinutes(endB);

  return aStart < bEnd && bStart < aEnd;
}

/**
 * Normalisasi nama ruangan agar case-insensitive dan mengabaikan spasi berlebih
 */
function normalizeRoomName(room: string): string {
  return room.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Algoritma Deteksi Seluruh Konflik Jadwal (Conflict Detection Engine)
 */
export function detectAllScheduleConflicts(
  schedules: SeedSchedule[],
  customBreaks: BreakTimeSlot[] = OFFICIAL_BREAK_TIMES
): {
  hasConflicts: boolean;
  totalConflicts: number;
  criticalCount: number;
  warningCount: number;
  conflicts: ScheduleConflict[];
} {
  const conflicts: ScheduleConflict[] = [];

  // Grouping schedules by hari untuk efisiensi
  const schedulesByDay = new Map<string, SeedSchedule[]>();
  for (const s of schedules) {
    const list = schedulesByDay.get(s.hari) || [];
    list.push(s);
    schedulesByDay.set(s.hari, list);
  }

  // Iterasi per hari
  for (const [hari, daySchedules] of schedulesByDay.entries()) {
    const n = daySchedules.length;

    // 1. Cek bentrok antar entri jadwal (Guru, Kelas, Ruangan)
    for (let i = 0; i < n; i++) {
      const a = daySchedules[i]!;

      for (let j = i + 1; j < n; j++) {
        const b = daySchedules[j]!;

        // Jika waktu overlap
        if (isTimeOverlapping(a.jamMulai, a.jamSelesai, b.jamMulai, b.jamSelesai)) {
          const displayTime = `${a.jamMulai}-${a.jamSelesai} & ${b.jamMulai}-${b.jamSelesai}`;

          // A. BENTROK GURU (Teacher Conflict)
          if (a.guruId && b.guruId && a.guruId === b.guruId) {
            conflicts.push({
              id: `tc-${a.id}-${b.id}`,
              type: 'TEACHER_CONFLICT',
              severity: 'CRITICAL',
              hari,
              timeRange: displayTime,
              title: `Bentrok Guru: ${a.guruNama}`,
              description: `Guru ${a.guruNama} terjadwal mengajar di 2 rombel sekaligus (${a.kelasNama}: ${a.mapelNama} dan ${b.kelasNama}: ${b.mapelNama}) pada jam yang bersinggungan.`,
              conflictingScheduleIds: [a.id, b.id],
              entityName: a.guruNama,
              affectedClasses: [a.kelasNama, b.kelasNama],
              recommendation: `Pindahkan salah satu sesi mengajar ke jam pelajaran lain atau tugaskan guru pengganti untuk ${b.kelasNama}.`,
            });
          }

          // B. BENTROK KELAS / ROMBEL (Class Conflict)
          if (a.kelasId && b.kelasId && (a.kelasId === b.kelasId || a.kelasNama === b.kelasNama)) {
            conflicts.push({
              id: `cc-${a.id}-${b.id}`,
              type: 'CLASS_CONFLICT',
              severity: 'CRITICAL',
              hari,
              timeRange: displayTime,
              title: `Bentrok Rombel: ${a.kelasNama}`,
              description: `Kelas ${a.kelasNama} dijadwalkan menerima 2 mata pelajaran sekaligus (${a.mapelNama} oleh ${a.guruNama} dan ${b.mapelNama} oleh ${b.guruNama}) pada jam yang sama.`,
              conflictingScheduleIds: [a.id, b.id],
              entityName: a.kelasNama,
              affectedClasses: [a.kelasNama],
              recommendation: `Sesuaikan urutan jam pelajaran rombel ${a.kelasNama} agar mata pelajaran berjalan berurutan.`,
            });
          }

          // C. BENTROK RUANGAN (Room Conflict)
          if (a.ruang && b.ruang) {
            const normA = normalizeRoomName(a.ruang);
            const normB = normalizeRoomName(b.ruang);
            // Hanya periksa jika bukan ruang kelas biasa yang beda kelas
            if (normA === normB && a.kelasId !== b.kelasId) {
              conflicts.push({
                id: `rc-${a.id}-${b.id}`,
                type: 'ROOM_CONFLICT',
                severity: 'CRITICAL',
                hari,
                timeRange: displayTime,
                title: `Bentrok Ruangan: ${a.ruang}`,
                description: `Ruangan ${a.ruang} dipakai bersamaan oleh kelas ${a.kelasNama} (${a.mapelNama}) dan ${b.kelasNama} (${b.mapelNama}).`,
                conflictingScheduleIds: [a.id, b.id],
                entityName: a.ruang,
                affectedClasses: [a.kelasNama, b.kelasNama],
                recommendation: `Pindahkan salah satu kelas ke ruangan laboratorium atau kelas kosong lainnya.`,
              });
            }
          }
        }
      }

      // 2. Cek bentrok dengan Jam Istirahat Resmi (Break Conflict)
      for (const brk of customBreaks) {
        if (brk.hari === 'ALL' || brk.hari === hari) {
          if (isTimeOverlapping(a.jamMulai, a.jamSelesai, brk.jamMulai, brk.jamSelesai)) {
            conflicts.push({
              id: `bc-${a.id}-${brk.label.replace(/\s+/g, '')}`,
              type: 'BREAK_CONFLICT',
              severity: 'WARNING',
              hari,
              timeRange: `${a.jamMulai}-${a.jamSelesai} (Istirahat: ${brk.jamMulai}-${brk.jamSelesai})`,
              title: `Tumpang Tindih Jam Istirahat: ${brk.label}`,
              description: `Jadwal ${a.mapelNama} di kelas ${a.kelasNama} melewati jam ${brk.label} (${brk.jamMulai} - ${brk.jamSelesai}).`,
              conflictingScheduleIds: [a.id],
              entityName: a.kelasNama,
              affectedClasses: [a.kelasNama],
              recommendation: `Pecah jam pelajaran menjadi sebelum atau sesudah jam istirahat sesuai pedoman KBM.`,
            });
          }
        }
      }
    }
  }

  const criticalCount = conflicts.filter((c) => c.severity === 'CRITICAL').length;
  const warningCount = conflicts.filter((c) => c.severity === 'WARNING').length;

  return {
    hasConflicts: conflicts.length > 0,
    totalConflicts: conflicts.length,
    criticalCount,
    warningCount,
    conflicts,
  };
}

/**
 * Validasi apakah jadwal baru / jadwal yang diedit bentrok dengan jadwal yang sudah ada
 */
export function validateNewScheduleConflict(
  target: {
    id?: string;
    kelasId: string;
    kelasNama?: string;
    hari: string;
    jamMulai: string;
    jamSelesai: string;
    guruId: string;
    guruNama?: string;
    ruang?: string;
  },
  existingSchedules: SeedSchedule[]
): {
  isConflict: boolean;
  conflicts: ScheduleConflict[];
} {
  // Mock entri sebagai SeedSchedule
  const mockSchedule: SeedSchedule = {
    id: target.id || 'target-draft',
    kelasId: target.kelasId,
    kelasNama: target.kelasNama || target.kelasId,
    hari: target.hari as any,
    jamMulai: target.jamMulai,
    jamSelesai: target.jamSelesai,
    mapelId: 'mock-mapel',
    mapelNama: 'Mata Pelajaran',
    guruId: target.guruId,
    guruNama: target.guruNama || 'Guru',
    ruang: target.ruang || 'Ruang Kelas',
  };

  // Filter out existing item if editing
  const filtered = target.id
    ? existingSchedules.filter((s) => s.id !== target.id)
    : existingSchedules;

  const combined = [mockSchedule, ...filtered];
  const result = detectAllScheduleConflicts(combined);

  // Ambil hanya konflik yang melibatkan entri target
  const relevantConflicts = result.conflicts.filter((c) =>
    c.conflictingScheduleIds.includes(mockSchedule.id)
  );

  return {
    isConflict: relevantConflicts.length > 0,
    conflicts: relevantConflicts,
  };
}
