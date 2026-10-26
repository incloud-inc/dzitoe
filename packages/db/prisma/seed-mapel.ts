import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Data Master Mata Pelajaran (Standar Nasional)...');

  const mapelData = [
    // Kelompok A (Wajib)
    { kode: 'PAI', nama: 'Pendidikan Agama Islam dan Budi Pekerti', deskripsi: 'Kelompok A Wajib' },
    { kode: 'PAK', nama: 'Pendidikan Agama Kristen dan Budi Pekerti', deskripsi: 'Kelompok A Wajib' },
    { kode: 'PKN', nama: 'Pendidikan Pancasila dan Kewarganegaraan', deskripsi: 'Kelompok A Wajib' },
    { kode: 'BINDO', nama: 'Bahasa Indonesia', deskripsi: 'Kelompok A Wajib' },
    { kode: 'MTK-W', nama: 'Matematika Wajib', deskripsi: 'Kelompok A Wajib' },
    { kode: 'SEJ-IND', nama: 'Sejarah Indonesia', deskripsi: 'Kelompok A Wajib' },
    { kode: 'BING', nama: 'Bahasa Inggris', deskripsi: 'Kelompok A Wajib' },

    // Kelompok B (Wajib)
    { kode: 'SBD', nama: 'Seni Budaya', deskripsi: 'Kelompok B Wajib' },
    { kode: 'PJOK', nama: 'Pendidikan Jasmani, Olahraga, dan Kesehatan', deskripsi: 'Kelompok B Wajib' },
    { kode: 'PKWU', nama: 'Prakarya dan Kewirausahaan', deskripsi: 'Kelompok B Wajib' },
    { kode: 'MULOK', nama: 'Muatan Lokal', deskripsi: 'Kelompok B Wajib' },

    // Kelompok C (Peminatan MIPA)
    { kode: 'MTK-M', nama: 'Matematika Peminatan', deskripsi: 'Peminatan MIPA' },
    { kode: 'BIO', nama: 'Biologi', deskripsi: 'Peminatan MIPA' },
    { kode: 'FIS', nama: 'Fisika', deskripsi: 'Peminatan MIPA' },
    { kode: 'KIM', nama: 'Kimia', deskripsi: 'Peminatan MIPA' },

    // Kelompok C (Peminatan IPS)
    { kode: 'GEO', nama: 'Geografi', deskripsi: 'Peminatan IPS' },
    { kode: 'SEJ', nama: 'Sejarah', deskripsi: 'Peminatan IPS' },
    { kode: 'SOS', nama: 'Sosiologi', deskripsi: 'Peminatan IPS' },
    { kode: 'EKO', nama: 'Ekonomi', deskripsi: 'Peminatan IPS' },

    // Lintas Minat / Bahasa
    { kode: 'B-ARAB', nama: 'Bahasa Arab', deskripsi: 'Lintas Minat / Bahasa' },
    { kode: 'B-JEP', nama: 'Bahasa Jepang', deskripsi: 'Lintas Minat / Bahasa' },
    { kode: 'B-MAN', nama: 'Bahasa Mandarin', deskripsi: 'Lintas Minat / Bahasa' },
    { kode: 'TIK', nama: 'Informatika', deskripsi: 'Lintas Minat / Wajib Kurmer' },
  ];

  let successCount = 0;
  for (const m of mapelData) {
    try {
      await prisma.mataPelajaran.upsert({
        where: { kode: m.kode },
        update: { nama: m.nama, deskripsi: m.deskripsi },
        create: m,
      });
      successCount++;
    } catch (e) {
      console.error(`Gagal insert ${m.kode}:`, e);
    }
  }

  console.log(`✅ Berhasil menyimpan ${successCount} Mata Pelajaran ke Database!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
