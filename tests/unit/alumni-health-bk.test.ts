// ==============================================================================
// DZITOE — Unit Tests: Alumni, Kesehatan Siswa (UKS), and Pelayanan BK
// ==============================================================================

import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAllAlumni,
  createAlumni,
  updateAlumni,
  deleteAlumni,
  getAlumniStats,
  syncAlumniFromGraduation,
  getAllHealthRecords,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
  getHealthStats,
  getAllBKRecords,
  createBKRecord,
  updateBKRecord,
  deleteBKRecord,
  getBKStats,
} from '@dzitoe/db';

describe('Modul Database Alumni & Tracer Study', () => {
  it('harus memuat daftar alumni awal dengan statistik yang valid', () => {
    const list = getAllAlumni();
    expect(list.length).toBeGreaterThanOrEqual(4);

    const stats = getAlumniStats();
    expect(stats.total).toBe(list.length);
    expect(stats.persentaseTerserap).toBeGreaterThan(0);
    expect(stats.angkatanList.length).toBeGreaterThan(0);
  });

  it('dapat membuat, mencari, memperbarui, dan menghapus data alumni', () => {
    const testNisn = `999${Date.now().toString().slice(-7)}`;
    const created = createAlumni({
      nisn: testNisn,
      nama: 'Testing Alumni Baru',
      tahunLulus: 2026,
      kelasTerakhir: 'XII MIPA 5',
      statusTracer: 'KULIAH',
      namaKampus: 'Institut Teknologi Bandung',
      programStudi: 'Sains Komputasi',
      nomorHp: '081299998888',
      email: 'testing.alumni@test.com',
    });

    expect(created.id).toBeDefined();
    expect(created.nama).toBe('Testing Alumni Baru');
    expect(created.statusTracer).toBe('KULIAH');

    // Filter pencarian
    const found = getAllAlumni({ search: 'Sains Komputasi' });
    expect(found.some((a) => a.nisn === testNisn)).toBe(true);

    // Update tracer study
    const updated = updateAlumni(created.id, {
      statusTracer: 'KERJA',
      namaPerusahaan: 'Google Indonesia',
      posisiKerja: 'Software Engineer',
    });
    expect(updated).not.toBeNull();
    expect(updated?.statusTracer).toBe('KERJA');
    expect(updated?.namaPerusahaan).toBe('Google Indonesia');

    // Hapus
    const deleted = deleteAlumni(created.id);
    expect(deleted).toBe(true);
  });

  it('mampu melakukan sinkronisasi otomatis dari kelulusan kelas XII', () => {
    const result = syncAlumniFromGraduation();
    expect(result).toBeDefined();
    expect(typeof result.added).toBe('number');
    expect(typeof result.existing).toBe('number');
  });
});

describe('Modul Data Kesehatan Siswa & UKS', () => {
  it('harus memuat rekam medis awal dan menghitung statistik vital', () => {
    const records = getAllHealthRecords();
    expect(records.length).toBeGreaterThanOrEqual(4);

    const stats = getHealthStats();
    expect(stats.total).toBe(records.length);
    expect(stats.perJenis).toBeDefined();
    expect(stats.golDarahCount).toBeDefined();
  });

  it('dapat mencatat kunjungan UKS baru dengan data vital sign', () => {
    const newRecord = createHealthRecord({
      muridId: 'mrd-1',
      muridNama: 'Aditya Pratama',
      kelasNama: 'X-A',
      jenis: 'CATATAN_MEDIS',
      golonganDarah: 'O',
      suhuTubuh: 38.5,
      tekananDarah: '120/80',
      tinggiBadan: 170,
      beratBadan: 60,
      keluhan: 'Nyeri perut bagian bawah dan mual',
      penanganan: 'Istirahat di ruang UKS, minum air hangat',
      obatDiberikan: 'Antasida 1 tablet',
      istirahatDiUks: true,
      status: 'RAWAT_UKS',
      petugasUks: 'Hj. Siti Aminah, S.Kep',
    });

    expect(newRecord.id).toBeDefined();
    expect(newRecord.suhuTubuh).toBe(38.5);
    expect(newRecord.status).toBe('RAWAT_UKS');

    // Update status pemulihan
    const updated = updateHealthRecord(newRecord.id, {
      status: 'PULIH',
      penanganan: 'Kondisi membaik, kembali ke ruang kelas',
    });
    expect(updated?.status).toBe('PULIH');

    // Delete
    const deleted = deleteHealthRecord(newRecord.id);
    expect(deleted).toBe(true);
  });
});

describe('Modul Pelayanan BK & Restitusi Disiplin Positif', () => {
  it('harus memuat catatan awal BK dan menghitung statistik penanganan', () => {
    const records = getAllBKRecords();
    expect(records.length).toBeGreaterThanOrEqual(3);

    const stats = getBKStats();
    expect(stats.total).toBe(records.length);
    expect(stats.aktif).toBeGreaterThanOrEqual(1);
  });

  it('dapat mencatat sesi konseling dengan pendekatan restitusi', () => {
    const newBK = createBKRecord({
      muridId: 'mrd-2',
      muridNama: 'Anisa Rahmawati',
      kelasNama: 'X-A',
      jenis: 'DISIPLIN_POSITIF',
      konselor: 'Dra. Hj. Sri Wahyuni, M.Pd (Guru BK)',
      permasalahan: 'Terlambat masuk sekolah pasca istirahat kedua',
      latarBelakang: 'Membantu membersihkan area kantin sekolah',
      solusi: 'Restitusi: Membuat rangkuman materi pembelajaran yang tertinggal',
      komitmenMurid: 'Segera kembali ke kelas 5 menit sebelum bel berbunyi',
      privasi: 'TERBATAS_GURU_BK',
      status: 'IN_PROGRESS',
    });

    expect(newBK.id).toBeDefined();
    expect(newBK.jenis).toBe('DISIPLIN_POSITIF');

    // Update penyelesaian
    const updated = updateBKRecord(newBK.id, {
      status: 'RESOLVED',
      tindakLanjut: 'Tugas rangkuman telah diserahkan dengan baik ke guru mapel',
    });
    expect(updated?.status).toBe('RESOLVED');

    // Delete
    const deleted = deleteBKRecord(newBK.id);
    expect(deleted).toBe(true);
  });
});
