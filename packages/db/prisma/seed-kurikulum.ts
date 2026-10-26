import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data Kurikulum Merdeka (Lengkap: Mapel, KelasKurikulum, Bab, Materi)...');

  // 1. Seed Mata Pelajaran Kurikulum Merdeka
  const mapelData = [
    { nama: 'Pendidikan Agama Islam', kode: 'PAI', deskripsi: 'Pendidikan Agama Islam dan Budi Pekerti' },
    { nama: 'Pendidikan Pancasila', kode: 'PPKN', deskripsi: 'Pendidikan Pancasila' },
    { nama: 'Bahasa Indonesia', kode: 'BINDO', deskripsi: 'Bahasa Indonesia Wajib' },
    { nama: 'Matematika', kode: 'MTK-W', deskripsi: 'Matematika Wajib' },
    { nama: 'Bahasa Inggris', kode: 'BING', deskripsi: 'Bahasa Inggris Wajib' },
    { nama: 'Fisika', kode: 'FIS', deskripsi: 'Fisika' },
    { nama: 'Kimia', kode: 'KIM', deskripsi: 'Kimia' },
    { nama: 'Biologi', kode: 'BIO', deskripsi: 'Biologi' },
    { nama: 'Sejarah', kode: 'SEJ', deskripsi: 'Sejarah' },
    { nama: 'Geografi', kode: 'GEO', deskripsi: 'Geografi' },
    { nama: 'Ekonomi', kode: 'EKO', deskripsi: 'Ekonomi' },
    { nama: 'Sosiologi', kode: 'SOS', deskripsi: 'Sosiologi' },
    { nama: 'Informatika', kode: 'INF', deskripsi: 'Informatika' },
    { nama: 'PJOK', kode: 'PJOK', deskripsi: 'Pendidikan Jasmani Olahraga dan Kesehatan' },
    { nama: 'Seni Budaya', kode: 'SBD', deskripsi: 'Seni Rupa/Musik/Tari' },
  ];

  const createdMapel = await Promise.all(
    mapelData.map(m => prisma.mataPelajaran.upsert({
      where: { kode: m.kode },
      update: { nama: m.nama, deskripsi: m.deskripsi },
      create: m,
    }))
  );

  console.log(`✅ Berhasil seed ${createdMapel.length} Mata Pelajaran.`);

  const kelasList = ['X', 'XI', 'XII'];
  const semesterList = ['GANJIL', 'GENAP'] as const;

  // 2. Loop Semua Mapel
  for (const mapel of createdMapel) {
    for (const kelas of kelasList) {
      for (const semester of semesterList) {
        
        // 3. Upsert KelasKurikulum
        const kurikulum = await prisma.kelasKurikulum.upsert({
          where: {
            kelas_semester_mapelId: {
              kelas,
              semester,
              mapelId: mapel.id
            }
          },
          update: {},
          create: {
            kelas,
            semester,
            mapelId: mapel.id
          }
        });

        // 4. Seed Bab untuk masing-masing KelasKurikulum berdasarkan Mapel
        let babData = [];
        
        if (mapel.kode === 'MTK-W') {
          babData = [
            { nama: `Eksponen dan Logaritma`, urutan: 1, deskripsi: 'Sifat-sifat eksponen dan logaritma' },
            { nama: `Barisan dan Deret`, urutan: 2, deskripsi: 'Aritmatika dan Geometri' },
          ];
        } else if (mapel.kode === 'BINDO') {
          babData = [
            { nama: `Teks Laporan Hasil Observasi`, urutan: 1, deskripsi: 'Menyusun LHO' },
            { nama: `Teks Eksposisi`, urutan: 2, deskripsi: 'Argumentasi dan Eksposisi' },
          ];
        } else if (mapel.kode === 'BING') {
          babData = [
            { nama: `Descriptive Text`, urutan: 1, deskripsi: 'Describing places and people' },
            { nama: `Recount Text`, urutan: 2, deskripsi: 'Telling past events' },
          ];
        } else if (mapel.kode === 'INF') {
          babData = [
            { nama: `Berpikir Komputasional`, urutan: 1, deskripsi: 'Logika dan algoritma' },
            { nama: `Teknologi Informasi dan Komunikasi`, urutan: 2, deskripsi: 'Aplikasi perkantoran' },
          ];
        } else {
          // Default data bab untuk mapel lainnya
          babData = [
            { nama: `Bab 1: Konsep Dasar ${mapel.nama}`, urutan: 1, deskripsi: 'Pengantar materi utama.' },
            { nama: `Bab 2: Pendalaman ${mapel.nama}`, urutan: 2, deskripsi: 'Materi lanjutan berfokus pada HOTS.' }
          ];
        }

        // Tambahkan embel-embel kelas dan semester di nama bab agar unik
        babData = babData.map(b => ({
            ...b,
            nama: `${b.nama} (Kls ${kelas} ${semester})`
        }));

        for (const b of babData) {
          const existingBab = await prisma.bab.findFirst({
            where: {
              kelasKurikulumId: kurikulum.id,
              nama: b.nama
            }
          });

          let babId = existingBab?.id;

          if (!existingBab) {
            const newBab = await prisma.bab.create({
              data: {
                ...b,
                kelasKurikulumId: kurikulum.id
              }
            });
            babId = newBab.id;
          }

          // 5. Seed Materi untuk Bab
          if (babId && !existingBab) {
            const materiData = [
              {
                nama: `Sub-bab A: Teori dan Konsep`,
                deskripsi: `Penjelasan fundamental mengenai ${b.nama}`,
                capaianBelajar: 'Peserta didik mampu memahami konsep dasar secara mandiri sesuai profil pelajar Pancasila',
                tujuanBelajar: 'Mengidentifikasi unsur utama dalam materi ini',
                alurTujuan: '1. Membaca 2. Menganalisis 3. Memecahkan masalah'
              },
              {
                nama: `Sub-bab B: Praktik dan Proyek (P5)`,
                deskripsi: 'Latihan soal, pemecahan kasus, dan proyek penguatan profil pelajar Pancasila',
                capaianBelajar: 'Peserta didik mampu mengaplikasikan teori ke dalam karya atau studi kasus',
                tujuanBelajar: 'Menerapkan konsep untuk menyelesaikan permasalahan kompleks',
                alurTujuan: '1. Studi Kasus 2. Diskusi Kelompok 3. Presentasi'
              }
            ];

            await Promise.all(
              materiData.map(md => prisma.materi.create({
                data: {
                  ...md,
                  babId: babId as string
                }
              }))
            );
          }
        }
      }
    }
    console.log(`✅ Berhasil seed struktur lengkap untuk mapel ${mapel.nama} (X, XI, XII)`);
  }

  console.log('🎉 Seeding Kurikulum Merdeka (Versi Lengkap) selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
