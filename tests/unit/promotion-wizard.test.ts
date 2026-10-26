// ==============================================================================
// DZITOE — Unit Test: Smart Promotion Wizard (Wisaya Kenaikan Kelas)
// Tests: Jalur Cepat, Dry-Run Simulation, Snapshot Creation & 1-Click Rollback
// ==============================================================================

import { describe, it, expect } from 'vitest';
import {
  getPromotionStatus,
  generatePromotionPreview,
  executePromotion,
  rollbackPromotion,
  getAllStudents,
  getAllClasses,
  type PromotionConfig,
} from '@dzitoe/db';

describe('Smart Promotion Wizard (Wisaya Kenaikan Kelas)', () => {
  it('harus memuat status kenaikan kelas dan pemetaan default Jalur Cepat', () => {
    const status = getPromotionStatus();

    expect(status.tahunAjaranLama).toBe('2025/2026');
    expect(status.tahunAjaranBaru).toBe('2026/2027');
    expect(status.tingkatStats.X.jumlahKelas).toBeGreaterThan(0);
    expect(status.tingkatStats.XI.jumlahKelas).toBeGreaterThan(0);
    expect(status.tingkatStats.XII.jumlahKelas).toBeGreaterThan(0);
    expect(status.defaultMappings.length).toBeGreaterThan(0);

    // Verify XI -> XII and X -> XI mappings exist
    const hasXiToXii = status.defaultMappings.some(
      (m) => m.tingkatAsal === 'XI' && m.tingkatTujuan === 'XII'
    );
    const hasXToXi = status.defaultMappings.some(
      (m) => m.tingkatAsal === 'X' && m.tingkatTujuan === 'XI'
    );

    expect(hasXiToXii).toBe(true);
    expect(hasXToXi).toBe(true);
  });

  it('harus menghasilkan simulasi Dry-Run preview tanpa mengubah data database', () => {
    const status = getPromotionStatus();
    const studentsBefore = getAllStudents();

    const config: PromotionConfig = {
      tahunAjaranLama: status.tahunAjaranLama,
      tahunAjaranBaru: status.tahunAjaranBaru,
      luluskanKelas12: true,
      pemetaanJalurCepat: status.defaultMappings,
      pengecualian: [],
    };

    const preview = generatePromotionPreview(config);

    expect(preview.totalMuridDiproses).toBe(studentsBefore.length);
    expect(preview.totalLulus).toBe(status.tingkatStats.XII.jumlahMurid);
    expect(preview.totalNaik).toBeGreaterThan(0);
    expect(preview.totalTinggal).toBe(0);
    expect(preview.ringkasanKelasBaru.length).toBe(status.allClasses.length);

    // Ensure data was not mutated during preview
    const studentsAfter = getAllStudents();
    expect(studentsAfter.length).toBe(studentsBefore.length);
    expect(studentsAfter[0].kelasId).toBe(studentsBefore[0].kelasId);
  });

  it('harus menangani pengecualian murid tinggal kelas dan mutasi dengan benar', () => {
    const status = getPromotionStatus();
    const students = getAllStudents();
    const sampleStudent = students.find((s) => s.kelasNama.startsWith('X.')) || students[0];

    const config: PromotionConfig = {
      tahunAjaranLama: status.tahunAjaranLama,
      tahunAjaranBaru: status.tahunAjaranBaru,
      luluskanKelas12: true,
      pemetaanJalurCepat: status.defaultMappings,
      pengecualian: [
        {
          muridId: sampleStudent.id,
          muridNama: sampleStudent.nama,
          nis: sampleStudent.nis,
          kelasLamaId: sampleStudent.kelasId,
          kelasLamaNama: sampleStudent.kelasNama,
          tipe: 'TINGGAL_KELAS',
          catatan: 'Tinggal kelas berdasarkan evaluasi dewan guru',
        },
      ],
    };

    const preview = generatePromotionPreview(config);
    expect(preview.totalTinggal).toBe(1);
    expect(preview.daftarPengecualian.length).toBe(1);
  });

  it('harus dapat mengeksekusi kenaikan kelas dan memulihkan via 1-click rollback', () => {
    const status = getPromotionStatus();
    const studentsOriginal = getAllStudents();
    const initialClassX1 = getAllClasses().find((c) => c.nama === 'X.1');
    const initialCount = initialClassX1 ? initialClassX1.jumlahMurid : 0;

    const config: PromotionConfig = {
      tahunAjaranLama: status.tahunAjaranLama,
      tahunAjaranBaru: status.tahunAjaranBaru,
      luluskanKelas12: true,
      pemetaanJalurCepat: status.defaultMappings,
      pengecualian: [],
    };

    // 1. Eksekusi
    const result = executePromotion(config, 'Unit Tester');
    expect(result.success).toBe(true);
    expect(result.snapshotId).toBeDefined();

    // 2. Rollback
    const rollbackResult = rollbackPromotion(result.snapshotId, 'Unit Tester Undo');
    expect(rollbackResult.success).toBe(true);

    // Verify restored state
    const studentsRestored = getAllStudents();
    expect(studentsRestored.length).toBe(studentsOriginal.length);
  });

  it('harus menangani tindakan opsional ketika kelulusan otomatis kelas XII di-uncheck (TUNDA_SEMUA & PILIH_SELEKTIF)', () => {
    const status = getPromotionStatus();
    const students = getAllStudents();
    const kls12Students = students.filter((s) => s.kelasNama.startsWith('XII'));

    // Kasus 1: Tunda Semua
    const configTunda: PromotionConfig = {
      tahunAjaranLama: status.tahunAjaranLama,
      tahunAjaranBaru: status.tahunAjaranBaru,
      luluskanKelas12: false,
      tindakanKelas12: 'TUNDA_SEMUA',
      pemetaanJalurCepat: status.defaultMappings,
      pengecualian: [],
    };

    const previewTunda = generatePromotionPreview(configTunda);
    expect(previewTunda.totalLulus).toBe(0);
    expect(previewTunda.totalTinggal).toBe(kls12Students.length);
    expect(previewTunda.peringatan.some((w) => w.includes('Kelulusan Kelas XII ditunda'))).toBe(true);

    // Kasus 2: Kelulusan Selektif (hanya separuh yang lulus)
    const separuhLulus = kls12Students.slice(0, 5).map((s) => s.id);
    const configSelektif: PromotionConfig = {
      tahunAjaranLama: status.tahunAjaranLama,
      tahunAjaranBaru: status.tahunAjaranBaru,
      luluskanKelas12: false,
      tindakanKelas12: 'PILIH_SELEKTIF',
      siswaKelas12LulusIds: separuhLulus,
      pemetaanJalurCepat: status.defaultMappings,
      pengecualian: [],
    };

    const previewSelektif = generatePromotionPreview(configSelektif);
    expect(previewSelektif.totalLulus).toBe(5);
    expect(previewSelektif.totalTinggal).toBe(kls12Students.length - 5);
  });

  it('harus memetakan siswa per murid secara individual di mana siswa kelas X.1 berpencar ke berbagai rombel kelas XI', () => {
    const status = getPromotionStatus();
    const students = getAllStudents();
    const studentsX1 = students.filter((s) => s.kelasNama === 'X.1');
    const classesXI = getAllClasses().filter((c) => c.tingkat === 'XI');

    expect(studentsX1.length).toBeGreaterThan(3);
    expect(classesXI.length).toBeGreaterThan(3);

    // Petakan murid X.1 ke rombel XI yang berbeda-beda (Fase E ke Fase F)
    const customStudentMappings = studentsX1.map((s, idx) => {
      const targetClass = classesXI[idx % classesXI.length];
      return {
        muridId: s.id,
        muridNama: s.nama,
        nis: s.nis,
        kelasAsalId: s.kelasId,
        kelasAsalNama: s.kelasNama,
        tingkatAsal: 'X',
        keKelasId: targetClass.id,
        keKelasNama: targetClass.nama,
        tingkatTujuan: 'XI',
      };
    });

    const config: PromotionConfig = {
      tahunAjaranLama: status.tahunAjaranLama,
      tahunAjaranBaru: status.tahunAjaranBaru,
      luluskanKelas12: true,
      pemetaanSiswa: customStudentMappings,
      pengecualian: [],
    };

    const preview = generatePromotionPreview(config);
    expect(preview.totalNaik).toBeGreaterThanOrEqual(studentsX1.length);

    // Verifikasi eksekusi pemetaan per siswa
    const execResult = executePromotion(config, 'Admin Test');
    expect(execResult.success).toBe(true);

    // Rollback setelah uji
    if (execResult.snapshotId) {
      const rb = rollbackPromotion(execResult.snapshotId);
      expect(rb.success).toBe(true);
    }
  });
});

