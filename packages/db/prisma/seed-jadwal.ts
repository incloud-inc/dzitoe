import { PrismaClient, JenisKelamin, Hari, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data Guru, Kelas, dan Jadwal (Data Real, Terdistribusi Merata)...');

  // 1. Prepare Realistic Teachers data
  const teachersData = [
    { nama: 'Drs. Budi Santoso, M.Pd.', mapel: 'Pendidikan Agama Islam', jk: JenisKelamin.LAKI_LAKI },
    { nama: 'Siti Aminah, S.Pd.', mapel: 'Pendidikan Pancasila', jk: JenisKelamin.PEREMPUAN },
    { nama: 'Rini Yulianti, M.Hum.', mapel: 'Bahasa Indonesia', jk: JenisKelamin.PEREMPUAN },
    { nama: 'Ahmad Faisal, S.Si.', mapel: 'Matematika', jk: JenisKelamin.LAKI_LAKI },
    { nama: 'Dra. Kusuma Wardani', mapel: 'Bahasa Inggris', jk: JenisKelamin.PEREMPUAN },
    { nama: 'Joko Susilo, M.Si.', mapel: 'Fisika', jk: JenisKelamin.LAKI_LAKI },
    { nama: 'Nia Ramadhani, S.Pd.', mapel: 'Kimia', jk: JenisKelamin.PEREMPUAN },
    { nama: 'Lina Marlina, S.Si.', mapel: 'Biologi', jk: JenisKelamin.PEREMPUAN },
    { nama: 'H. Sudirman, M.Pd.', mapel: 'Sejarah', jk: JenisKelamin.LAKI_LAKI },
    { nama: 'Eko Prasetyo, S.Pd.', mapel: 'Geografi', jk: JenisKelamin.LAKI_LAKI },
    { nama: 'Rina Nose, SE., M.Pd.', mapel: 'Ekonomi', jk: JenisKelamin.PEREMPUAN },
    { nama: 'M. Ali, S.Sos.', mapel: 'Sosiologi', jk: JenisKelamin.LAKI_LAKI },
    { nama: 'Rizky Febrian, S.Kom.', mapel: 'Informatika', jk: JenisKelamin.LAKI_LAKI },
    { nama: 'Bambang Pamungkas, S.Or.', mapel: 'PJOK', jk: JenisKelamin.LAKI_LAKI },
    { nama: 'Ayu Lestari, S.Sn.', mapel: 'Seni Budaya', jk: JenisKelamin.PEREMPUAN },
  ];

  const guruRecords = [];
  const passwordHash = '$2a$10$XkH/XhC2c6Zl9jY3X0V5N.tF6.3o5w7e6y3wX0X0X0X0X0X0X0X0X'; // Dummy hash for "password123"

  // Create Users and Guru
  for (let i = 0; i < teachersData.length; i++) {
    const t = teachersData[i];
    const username = t.nama.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '') + i;
    
    // Upsert User
    const user = await prisma.user.upsert({
      where: { username },
      update: {},
      create: {
        username,
        email: `${username}@sman20kabtgr.sch.id`,
        password: passwordHash,
        name: t.nama,
        role: Role.GURU,
        isActive: true,
      }
    });

    // Upsert Guru
    const guru = await prisma.guru.upsert({
      where: { userId: user.id },
      update: { mataPelajaran: t.mapel },
      create: {
        userId: user.id,
        nama: t.nama,
        jenisKelamin: t.jk,
        mataPelajaran: t.mapel,
        nip: `198001012005011${i.toString().padStart(3, '0')}`,
      }
    });
    guruRecords.push(guru);
  }
  console.log(`✅ ${guruRecords.length} Guru berhasil dibuat.`);

  // 2. Prepare Classes (Kelas)
  const kelasNames = [
    { nama: 'X-1', tingkat: 'X' },
    { nama: 'X-2', tingkat: 'X' },
    { nama: 'XI-IPA-1', tingkat: 'XI' },
    { nama: 'XI-IPS-1', tingkat: 'XI' },
    { nama: 'XII-IPA-1', tingkat: 'XII' },
    { nama: 'XII-IPS-1', tingkat: 'XII' },
  ];

  const kelasRecords = [];
  for (let i = 0; i < kelasNames.length; i++) {
    const k = kelasNames[i];
    
    // Assign Wali Kelas (first 6 teachers)
    const waliKelas = guruRecords[i];

    // Find existing to avoid duplicates
    let kelas = await prisma.kelas.findFirst({ where: { nama: k.nama, tingkat: k.tingkat }});
    if (!kelas) {
      kelas = await prisma.kelas.create({
        data: {
          nama: k.nama,
          tingkat: k.tingkat,
          waliKelasId: waliKelas.id,
          jumlahMurid: 30,
        }
      });
    }
    kelasRecords.push(kelas);
  }
  console.log(`✅ ${kelasRecords.length} Kelas berhasil dibuat.`);

  // 3. Generate Schedule (Jadwal)
  // Bersihkan jadwal lama agar tidak berlipat ganda
  await prisma.jadwal.deleteMany();

  const hariList = [Hari.SENIN, Hari.SELASA, Hari.RABU, Hari.KAMIS, Hari.JUMAT];
  const jamBelajar = [
    { mulai: '07:00', selesai: '08:30' },
    { mulai: '08:30', selesai: '10:00' },
    { mulai: '10:30', selesai: '12:00' }, // istirahat 10:00 - 10:30
    { mulai: '12:30', selesai: '14:00' }, // istirahat 12:00 - 12:30
  ];

  let jadwalCreated = 0;
  
  // Track assigned teachers per time slot to prevent conflicts
  // occupied[hari][jam] = Set of Guru IDs
  const occupied = {};
  for (const h of hariList) {
    occupied[h] = {};
    for (const j of jamBelajar) {
      occupied[h][j.mulai] = new Set();
    }
  }

  for (const kelas of kelasRecords) {
    let teacherIndex = 0;
    
    // Filter mapel based on major for XI and XII
    let availableTeachers = [...guruRecords];
    if (kelas.nama.includes('IPA')) {
      availableTeachers = availableTeachers.filter(t => !['Geografi', 'Sosiologi', 'Ekonomi'].includes(t.mataPelajaran!));
    } else if (kelas.nama.includes('IPS')) {
      availableTeachers = availableTeachers.filter(t => !['Fisika', 'Kimia', 'Biologi'].includes(t.mataPelajaran!));
    }

    for (const hari of hariList) {
      for (const jam of jamBelajar) {
        if (hari === Hari.JUMAT && jam.mulai === '12:30') continue;

        // Find a teacher that is not busy
        let assignedGuru = null;
        for (let attempt = 0; attempt < availableTeachers.length; attempt++) {
          const guru = availableTeachers[(teacherIndex + attempt) % availableTeachers.length];
          if (!occupied[hari][jam.mulai].has(guru.id)) {
            assignedGuru = guru;
            teacherIndex = teacherIndex + attempt + 1;
            break;
          }
        }
        
        if (assignedGuru) {
          occupied[hari][jam.mulai].add(assignedGuru.id);
          await prisma.jadwal.create({
            data: {
              kelasId: kelas.id,
              guruId: assignedGuru.id,
              mataPelajaran: assignedGuru.mataPelajaran!,
              hari: hari,
              jamMulai: jam.mulai,
              jamSelesai: jam.selesai,
              ruang: `Ruang ${kelas.nama}`
            }
          });
          jadwalCreated++;
        }
      }
    }
  }

  console.log(`✅ ${jadwalCreated} Jadwal Pembelajaran terdistribusi tanpa konflik.`);
  console.log('🎉 Seeding Jadwal selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
