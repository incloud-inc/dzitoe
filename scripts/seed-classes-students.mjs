// ==============================================================================
// DZITOE — Script Seed Data: 30 Kelas & 150 Murid
// Menjalankan penyisipan otomatis data kelas dan akun murid ke database
// ==============================================================================

import { createRequire } from 'module';

const require = createRequire(import.meta.url);
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:root@127.0.0.1:5432/dzitoe?schema=public";
const { PrismaClient } = require('../packages/db/src/generated/client/index.js');

const prisma = new PrismaClient();

const KELAS_LIST = [
  // Kelas X (10 kelas)
  { nama: 'X.1', tingkat: 'X' },
  { nama: 'X.2', tingkat: 'X' },
  { nama: 'X.3', tingkat: 'X' },
  { nama: 'X.4', tingkat: 'X' },
  { nama: 'X.5', tingkat: 'X' },
  { nama: 'X.6', tingkat: 'X' },
  { nama: 'X.7', tingkat: 'X' },
  { nama: 'X.8', tingkat: 'X' },
  { nama: 'X.9', tingkat: 'X' },
  { nama: 'X.10', tingkat: 'X' },

  // Kelas XI IPA (5 kelas)
  { nama: 'XI IPA 1', tingkat: 'XI' },
  { nama: 'XI IPA 2', tingkat: 'XI' },
  { nama: 'XI IPA 3', tingkat: 'XI' },
  { nama: 'XI IPA 4', tingkat: 'XI' },
  { nama: 'XI IPA 5', tingkat: 'XI' },

  // Kelas XI IPS (5 kelas)
  { nama: 'XI IPS 1', tingkat: 'XI' },
  { nama: 'XI IPS 2', tingkat: 'XI' },
  { nama: 'XI IPS 3', tingkat: 'XI' },
  { nama: 'XI IPS 4', tingkat: 'XI' },
  { nama: 'XI IPS 5', tingkat: 'XI' },

  // Kelas XII IPA (5 kelas)
  { nama: 'XII IPA 1', tingkat: 'XII' },
  { nama: 'XII IPA 2', tingkat: 'XII' },
  { nama: 'XII IPA 3', tingkat: 'XII' },
  { nama: 'XII IPA 4', tingkat: 'XII' },
  { nama: 'XII IPA 5', tingkat: 'XII' },

  // Kelas XII IPS (5 kelas)
  { nama: 'XII IPS 1', tingkat: 'XII' },
  { nama: 'XII IPS 2', tingkat: 'XII' },
  { nama: 'XII IPS 3', tingkat: 'XII' },
  { nama: 'XII IPS 4', tingkat: 'XII' },
  { nama: 'XII IPS 5', tingkat: 'XII' },
];

const NAMA_DEPAN = [
  'Ahmad', 'Aisyah', 'Bima', 'Bella', 'Citra', 'Dimas', 'Dinda', 'Fajar',
  'Fitri', 'Galih', 'Gita', 'Hafiz', 'Hana', 'Irfan', 'Indah', 'Joko',
  'Jasmine', 'Kevin', 'Kirana', 'Lukman', 'Laras', 'Maulana', 'Melani',
  'Naufal', 'Nadia', 'Putri', 'Rafi', 'Rani', 'Satria', 'Siti'
];

const NAMA_BELAKANG = [
  'Saputra', 'Ramadhan', 'Kusuma', 'Pratama', 'Wibowo', 'Nugroho', 'Hidayat',
  'Santoso', 'Wijaya', 'Siregar', 'Lestari', 'Anggraini', 'Permata', 'Rahayu'
];

async function main() {
  console.log('🌱 [DZITOE SEED] Memulai inisialisasi 30 kelas dan 150 murid...');

  const hashedPassword = '$2a$10$948wkNUKT9h/f8ToysWIZu.6rrqX/O7W8PQL3GvR94pJWAv6Zslbe';
  let totalMurid = 0;

  for (let kIndex = 0; kIndex < KELAS_LIST.length; kIndex++) {
    const kData = KELAS_LIST[kIndex];
    // 1. Buat atau dapatkan kelas
    let kelas = await prisma.kelas.findFirst({
      where: { nama: kData.nama },
    });

    if (!kelas) {
      kelas = await prisma.kelas.create({
        data: {
          nama: kData.nama,
          tingkat: kData.tingkat,
          jumlahMurid: 5,
        },
      });
    }

    // 2. Buat 5 murid per kelas
    for (let i = 1; i <= 5; i++) {
      totalMurid++;
      const numStr = String(totalMurid).padStart(3, '0');
      const nis = `26${numStr}`;
      const nisn = `008${String(totalMurid).padStart(7, '0')}`;
      const cleanKls = kData.nama.toLowerCase().replace(/[^a-z0-9]/g, '');
      const username = `murid_${cleanKls}_${i}`;
      const email = `${username}@siswa.sman20.sch.id`;

      const depan = NAMA_DEPAN[(totalMurid + i) % NAMA_DEPAN.length];
      const belakang = NAMA_BELAKANG[(totalMurid * 2 + i) % NAMA_BELAKANG.length];
      const namaLengkap = `${depan} ${belakang}`;

      // Upsert User
      const user = await prisma.user.upsert({
        where: { username },
        update: {
          password: hashedPassword,
          name: namaLengkap,
          role: 'MURID',
        },
        create: {
          username,
          email,
          password: hashedPassword,
          name: namaLengkap,
          role: 'MURID',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
        },
      });

      // Upsert Murid
      await prisma.murid.upsert({
        where: { userId: user.id },
        update: {
          nama: namaLengkap,
          kelasId: kelas.id,
          nis,
          nisn,
        },
        create: {
          userId: user.id,
          nama: namaLengkap,
          kelasId: kelas.id,
          nis,
          nisn,
          jenisKelamin: i % 2 === 1 ? 'LAKI_LAKI' : 'PEREMPUAN',
        },
      });
    }
    console.log(`✅ [${kIndex + 1}/30] Kelas ${kData.nama} — 5 murid berhasil di-seed.`);
  }

  console.log(`🎉 [DZITOE SEED SELESAI] Total 30 kelas dan ${totalMurid} murid berhasil dibuat!`);
}

main()
  .catch((err) => {
    console.error('❌ Gagal menjalankan seed:', err.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
