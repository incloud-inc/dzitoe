// ==============================================================================
// DZITOE — Unit Tests: Prestasi & Portofolio (A21) + Portal PPID (A25)
// SMAN 20 Kabupaten Tangerang
// ==============================================================================

import { describe, it, expect, beforeEach } from 'vitest';
import {
  hitungPoinPrestasi,
  getAllAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getAchievementLeaderboard,
  getAchievementStats,
  getAllDokumenPublik,
  getDokumenById,
  createDokumenPublik,
  updateDokumenPublik,
  deleteDokumenPublik,
  incrementDownloadCount,
  getAllPermohonan,
  getPermohonanByIdOrTicket,
  createPermohonan,
  updatePermohonan,
  deletePermohonan,
  getPPIDStats,
} from '@dzitoe/db';
import { canAccessRoute, hasPermission, type UserRole } from '@dzitoe/auth/rbac';

describe('Modul A21: Prestasi & Portofolio Siswa Suite', () => {
  it('menghitung poin prestasi secara akurat sesuai tingkat lomba dan peringkat juara', () => {
    // Internasional
    expect(hitungPoinPrestasi('INTERNASIONAL', 'Juara 1 (Medali Emas)')).toBe(100);
    expect(hitungPoinPrestasi('INTERNASIONAL', 'Juara 2 (Medali Perak)')).toBe(90);
    expect(hitungPoinPrestasi('INTERNASIONAL', 'Juara 3 (Perunggu)')).toBe(80);
    expect(hitungPoinPrestasi('INTERNASIONAL', 'Finalis Harapan')).toBe(60);

    // Nasional
    expect(hitungPoinPrestasi('NASIONAL', 'Juara 1')).toBe(75);
    expect(hitungPoinPrestasi('NASIONAL', 'Juara 2')).toBe(65);
    expect(hitungPoinPrestasi('NASIONAL', 'Juara 3')).toBe(55);

    // Provinsi
    expect(hitungPoinPrestasi('PROVINSI', 'Juara 1')).toBe(50);
    expect(hitungPoinPrestasi('PROVINSI', 'Juara 2')).toBe(40);
    expect(hitungPoinPrestasi('PROVINSI', 'Juara 3')).toBe(30);

    // Kabupaten
    expect(hitungPoinPrestasi('KABUPATEN', 'Juara 1')).toBe(30);
    expect(hitungPoinPrestasi('KABUPATEN', 'Juara 2')).toBe(25);
    expect(hitungPoinPrestasi('KABUPATEN', 'Juara 3')).toBe(20);

    // Sekolah
    expect(hitungPoinPrestasi('SEKOLAH', 'Juara 1')).toBe(10);
    expect(hitungPoinPrestasi('SEKOLAH', 'Juara 2')).toBe(8);
    expect(hitungPoinPrestasi('SEKOLAH', 'Juara 3')).toBe(6);
  });

  it('dapat melakukan operasi CRUD catatan prestasi siswa dan kalkulasi poin otomatis', () => {
    const created = createAchievement({
      muridId: 'mrd-test-99',
      nama: 'Lomba Cerdas Cermat Kimia Tingkat Provinsi Banten',
      bidang: 'Kimia & Sains',
      jenis: 'AKADEMIK',
      tingkat: 'PROVINSI',
      peringkat: 'Juara 1',
      tahun: 2026,
      penyelenggara: 'Dinas Pendidikan Provinsi Banten',
      nomorSertifikat: '421.3/DPB/TEST/2026',
    });

    expect(created.id).toBeDefined();
    expect(created.poin).toBe(50); // Provinsi Juara 1 = 50 poin
    expect(created.muridId).toBe('mrd-test-99');

    // Read by id
    const found = getAchievementById(created.id);
    expect(found).toBeDefined();
    expect(found?.nama).toBe('Lomba Cerdas Cermat Kimia Tingkat Provinsi Banten');

    // Update
    const updated = updateAchievement(created.id, {
      tingkat: 'NASIONAL',
      peringkat: 'Juara 1',
    });
    expect(updated).toBeDefined();
    expect(updated?.poin).toBe(75); // Nasional Juara 1 = 75 poin

    // Cleanup delete
    const deleted = deleteAchievement(created.id);
    expect(deleted).toBe(true);
    expect(getAchievementById(created.id)).toBeNull();
  });

  it('menghasilkan leaderboard Hall of Fame dengan urutan akumulasi poin tertinggi', () => {
    const leaderboard = getAchievementLeaderboard(5);
    expect(leaderboard.length).toBeGreaterThan(0);
    // Urutan harus descending berdasar totalPoin
    for (let i = 0; i < leaderboard.length - 1; i++) {
      expect(leaderboard[i].totalPoin).toBeGreaterThanOrEqual(leaderboard[i + 1].totalPoin);
    }
  });

  it('menghitung statistik komprehensif prestasi akademik vs non-akademik', () => {
    const stats = getAchievementStats();
    expect(stats.total).toBeGreaterThan(0);
    expect(stats.totalPoin).toBeGreaterThan(0);
    expect(stats.totalAkademik + stats.totalNonAkademik).toBe(stats.total);
    expect(stats.perTingkat).toBeDefined();
  });
});

describe('Modul A25: Portal Keterbukaan Informasi Publik (PPID) Suite', () => {
  it('dapat menerbitkan dokumen informasi publik dan melacak jumlah unduhan', () => {
    const doc = createDokumenPublik({
      nomorDokumen: '421.3/TEST-PPID/2026/099',
      judul: 'Dokumen Uji Akuntabilitas BOS Reguler 2026',
      kategori: 'BERKALA',
      deskripsi: 'Transparansi anggaran pengujian otomatis',
      pejabatPengesah: 'Tim Pengembang Tata Kelola',
      tanggalPublikasi: new Date().toISOString(),
      tahunAnggaran: 2026,
      fileUrl: '/test-doc.pdf',
      fileSize: '1.2 MB',
      fileType: 'PDF',
      isPublic: true,
    });

    expect(doc.id).toBeDefined();
    expect(doc.downloadCount).toBe(0);

    // Track download increment
    const count1 = incrementDownloadCount(doc.id);
    expect(count1).toBe(1);
    const count2 = incrementDownloadCount(doc.id);
    expect(count2).toBe(2);

    // Read by id
    const found = getDokumenById(doc.id);
    expect(found?.downloadCount).toBe(2);

    // Cleanup delete
    const deleted = deleteDokumenPublik(doc.id);
    expect(deleted).toBe(true);
  });

  it('membuat tiket permohonan informasi daring dengan kode registrasi unik dan disposisi status', () => {
    const req = createPermohonan({
      namaPemohon: 'Dr. Hendra Wijaya',
      nik: '3603120000000001',
      kategoriPemohon: 'MAHASISWA_PENELITI',
      kontak: '081234567890',
      email: 'hendra.test@campus.ac.id',
      alamat: 'Sepatan, Tangerang',
      rincianInformasi: 'Data profil akreditasi sekolah untuk studi pustaka',
      tujuanPenggunaan: 'Penelitian jurnal ilmiah',
      caraMemperoleh: 'SALINAN_DIGITAL',
    });

    expect(req.id).toBeDefined();
    expect(req.nomorTiket).toMatch(/^REG-PPID-2026-\d{3}$/);
    expect(req.status).toBe('PENDING');

    // Lacak lewat tiket
    const tracked = getPermohonanByIdOrTicket(req.nomorTiket);
    expect(tracked).toBeDefined();
    expect(tracked?.namaPemohon).toBe('Dr. Hendra Wijaya');

    // Disposisi persetujuan petugas
    const resolved = updatePermohonan(req.id, {
      status: 'DISETUJUI',
      catatanPetugas: 'Berkas informasi terlampir dan dikirimkan via portal.',
      dokumenJawabanUrl: '/dokumen-jawaban-test.pdf',
    });

    expect(resolved).toBeDefined();
    expect(resolved?.status).toBe('DISETUJUI');
    expect(resolved?.tanggalSelesai).toBeDefined();
    expect(resolved?.dokumenJawabanUrl).toBe('/dokumen-jawaban-test.pdf');

    // Cleanup
    deletePermohonan(req.id);
  });

  it('menyediakan ringkasan statistik keterbukaan informasi dan persentase kepatuhan SLA', () => {
    const stats = getPPIDStats();
    expect(stats.totalDokumen).toBeGreaterThan(0);
    expect(stats.docsPerKategori).toBeDefined();
    expect(stats.totalPermohonan).toBeGreaterThan(0);
    expect(stats.persentaseTerselesaikan).toBeGreaterThanOrEqual(0);
    expect(stats.persentaseTerselesaikan).toBeLessThanOrEqual(100);
  });
});

describe('RBAC Route Guard & Granular Permissions Suite (Fase 5 & Fase 6)', () => {
  it('memverifikasi hak akses izin granular prestasi & ppid untuk tiap role', () => {
    // ADMIN has full access
    expect(hasPermission('ADMIN', 'prestasi:read')).toBe(true);
    expect(hasPermission('ADMIN', 'prestasi:write')).toBe(true);
    expect(hasPermission('ADMIN', 'ppid:read')).toBe(true);
    expect(hasPermission('ADMIN', 'ppid:write')).toBe(true);

    // KEPALA_SEKOLAH has read access
    expect(hasPermission('KEPALA_SEKOLAH', 'prestasi:read')).toBe(true);
    expect(hasPermission('KEPALA_SEKOLAH', 'ppid:read')).toBe(true);

    // PETUGAS_PPID has ppid write & read
    expect(hasPermission('PETUGAS_PPID', 'ppid:read')).toBe(true);
    expect(hasPermission('PETUGAS_PPID', 'ppid:write')).toBe(true);
    expect(hasPermission('PETUGAS_PPID', 'prestasi:read')).toBe(true);

    // GURU and GURU_BK can record prestasi
    expect(hasPermission('GURU', 'prestasi:write')).toBe(true);
    expect(hasPermission('GURU_BK', 'prestasi:write')).toBe(true);

    // MURID & ORANG_TUA can read prestasi & ppid
    expect(hasPermission('MURID', 'prestasi:read')).toBe(true);
    expect(hasPermission('MURID', 'ppid:read')).toBe(true);
    expect(hasPermission('MURID', 'prestasi:write')).toBe(false);
    expect(hasPermission('MURID', 'ppid:write')).toBe(false);
  });

  it('memvalidasi proteksi route guard /prestasi dan /ppid di portal admin', () => {
    // /prestasi
    expect(canAccessRoute('ADMIN', '/prestasi')).toBe(true);
    expect(canAccessRoute('KEPALA_SEKOLAH', '/prestasi')).toBe(true);
    expect(canAccessRoute('TU', '/prestasi')).toBe(true);
    expect(canAccessRoute('GURU', '/prestasi')).toBe(true);
    expect(canAccessRoute('GURU_BK', '/prestasi')).toBe(true);
    expect(canAccessRoute('MURID', '/prestasi')).toBe(false); // Mobile portal only
    expect(canAccessRoute('ORANG_TUA', '/prestasi')).toBe(false);

    // /ppid
    expect(canAccessRoute('ADMIN', '/ppid')).toBe(true);
    expect(canAccessRoute('KEPALA_SEKOLAH', '/ppid')).toBe(true);
    expect(canAccessRoute('PETUGAS_PPID', '/ppid')).toBe(true);
    expect(canAccessRoute('TU', '/ppid')).toBe(true);
    expect(canAccessRoute('MURID', '/ppid')).toBe(false); // Mobile portal only
    expect(canAccessRoute('ORANG_TUA', '/ppid')).toBe(false);

    // /publik/ppid (Portal Keterbukaan Publik Terbuka Tanpa Batasan Role)
    expect(canAccessRoute('ADMIN', '/publik/ppid')).toBe(true);
    expect(canAccessRoute('PETUGAS_PPID', '/publik/ppid')).toBe(true);
    expect(canAccessRoute('GURU', '/publik/ppid')).toBe(true);
    expect(canAccessRoute('MURID', '/publik/ppid')).toBe(true);
    expect(canAccessRoute('ORANG_TUA', '/publik/ppid')).toBe(true);
  });
});
