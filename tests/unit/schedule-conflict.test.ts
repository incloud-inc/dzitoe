import { describe, it, expect } from 'vitest';
import {
  detectAllScheduleConflicts,
  validateNewScheduleConflict,
  isTimeOverlapping,
  timeToMinutes,
  type SeedSchedule,
} from '../../packages/db/src';

describe('Schedule Conflict Detection Engine (Task A7.9)', () => {
  it('correctly converts time strings to minutes and detects overlap', () => {
    expect(timeToMinutes('07:15')).toBe(435);
    expect(timeToMinutes('08:45')).toBe(525);

    // Overlap tests
    expect(isTimeOverlapping('07:15', '08:45', '08:00', '09:30')).toBe(true);
    expect(isTimeOverlapping('07:15', '08:00', '08:00', '09:00')).toBe(false); // Touching is not overlapping
    expect(isTimeOverlapping('07:00', '09:00', '07:30', '08:30')).toBe(true); // Subset is overlapping
  });

  it('detects Teacher Conflict when a teacher is assigned to 2 classes at overlapping times', () => {
    const schedules: SeedSchedule[] = [
      {
        id: 'jdw-1',
        kelasId: 'kls-x-1',
        kelasNama: 'X.1',
        hari: 'SENIN',
        jamMulai: '07:15',
        jamSelesai: '08:45',
        mapelId: 'mp-mat',
        mapelNama: 'Matematika',
        guruId: 'guru-budi-1',
        guruNama: 'Drs. Budi Santoso',
        ruang: 'Ruang X.1',
      },
      {
        id: 'jdw-2',
        kelasId: 'kls-x-2',
        kelasNama: 'X.2',
        hari: 'SENIN',
        jamMulai: '08:00',
        jamSelesai: '09:30',
        mapelId: 'mp-mat',
        mapelNama: 'Matematika',
        guruId: 'guru-budi-1',
        guruNama: 'Drs. Budi Santoso',
        ruang: 'Ruang X.2',
      },
    ];

    const result = detectAllScheduleConflicts(schedules);
    expect(result.hasConflicts).toBe(true);
    expect(result.criticalCount).toBeGreaterThanOrEqual(1);

    const teacherConflict = result.conflicts.find((c) => c.type === 'TEACHER_CONFLICT');
    expect(teacherConflict).toBeDefined();
    expect(teacherConflict?.entityName).toContain('Budi Santoso');
    expect(teacherConflict?.affectedClasses).toContain('X.1');
    expect(teacherConflict?.affectedClasses).toContain('X.2');
  });

  it('detects Class Conflict when a single class is scheduled with 2 subjects simultaneously', () => {
    const schedules: SeedSchedule[] = [
      {
        id: 'jdw-a',
        kelasId: 'kls-x-1',
        kelasNama: 'X.1',
        hari: 'SELASA',
        jamMulai: '07:15',
        jamSelesai: '08:45',
        mapelId: 'mp-mat',
        mapelNama: 'Matematika',
        guruId: 'guru-1',
        guruNama: 'Guru A',
        ruang: 'Ruang X.1',
      },
      {
        id: 'jdw-b',
        kelasId: 'kls-x-1',
        kelasNama: 'X.1',
        hari: 'SELASA',
        jamMulai: '07:15',
        jamSelesai: '08:45',
        mapelId: 'mp-bio',
        mapelNama: 'Biologi',
        guruId: 'guru-2',
        guruNama: 'Guru B',
        ruang: 'Ruang X.1',
      },
    ];

    const result = detectAllScheduleConflicts(schedules);
    expect(result.hasConflicts).toBe(true);

    const classConflict = result.conflicts.find((c) => c.type === 'CLASS_CONFLICT');
    expect(classConflict).toBeDefined();
    expect(classConflict?.entityName).toBe('X.1');
  });

  it('detects Room Conflict when 2 different classes use the same room simultaneously', () => {
    const schedules: SeedSchedule[] = [
      {
        id: 'jdw-r1',
        kelasId: 'kls-xi-ipa-1',
        kelasNama: 'XI IPA 1',
        hari: 'RABU',
        jamMulai: '08:00',
        jamSelesai: '09:30',
        mapelId: 'mp-fis',
        mapelNama: 'Fisika',
        guruId: 'guru-fis',
        guruNama: 'Guru Fisika',
        ruang: 'Laboratorium Fisika',
      },
      {
        id: 'jdw-r2',
        kelasId: 'kls-xii-ipa-1',
        kelasNama: 'XII IPA 1',
        hari: 'RABU',
        jamMulai: '08:30',
        jamSelesai: '10:00',
        mapelId: 'mp-kim',
        mapelNama: 'Kimia',
        guruId: 'guru-kim',
        guruNama: 'Guru Kimia',
        ruang: 'Laboratorium Fisika',
      },
    ];

    const result = detectAllScheduleConflicts(schedules);
    expect(result.hasConflicts).toBe(true);

    const roomConflict = result.conflicts.find((c) => c.type === 'ROOM_CONFLICT');
    expect(roomConflict).toBeDefined();
    expect(roomConflict?.entityName).toBe('Laboratorium Fisika');
  });

  it('detects Break Time Conflict when class overlaps with official school break', () => {
    const schedules: SeedSchedule[] = [
      {
        id: 'jdw-break-test',
        kelasId: 'kls-x-3',
        kelasNama: 'X.3',
        hari: 'KAMIS',
        jamMulai: '09:30',
        jamSelesai: '10:30', // Overlaps with 09:45 - 10:15 break
        mapelId: 'mp-sej',
        mapelNama: 'Sejarah',
        guruId: 'guru-sej',
        guruNama: 'Guru Sejarah',
        ruang: 'Ruang X.3',
      },
    ];

    const result = detectAllScheduleConflicts(schedules);
    const breakConflict = result.conflicts.find((c) => c.type === 'BREAK_CONFLICT');
    expect(breakConflict).toBeDefined();
    expect(breakConflict?.severity).toBe('WARNING');
  });

  it('validates new schedule draft and flags conflict before saving', () => {
    const existing: SeedSchedule[] = [
      {
        id: 'exist-1',
        kelasId: 'kls-x-5',
        kelasNama: 'X.5',
        hari: 'JUMAT',
        jamMulai: '07:15',
        jamSelesai: '08:45',
        mapelId: 'mp-agama',
        mapelNama: 'Pendidikan Agama Islam',
        guruId: 'guru-ustadz',
        guruNama: 'Ustadz Ahmad, M.Pd.I',
        ruang: 'Ruang X.5',
      },
    ];

    // Coba tambahkan jadwal di rombel X.6 dengan guru yang sama di jam yang sama
    const validation = validateNewScheduleConflict(
      {
        kelasId: 'kls-x-6',
        kelasNama: 'X.6',
        hari: 'JUMAT',
        jamMulai: '08:00',
        jamSelesai: '09:30',
        guruId: 'guru-ustadz',
        ruang: 'Ruang X.6',
      },
      existing
    );

    expect(validation.isConflict).toBe(true);
    expect(validation.conflicts.length).toBeGreaterThan(0);
    expect(validation.conflicts[0].type).toBe('TEACHER_CONFLICT');
  });
});
