// ==============================================================================
// DZITOE — Master Data Kelas & Murid SMAN 20 Kabupaten Tangerang
// Standar Dapodik & Permendikdasmen 2026:
// NIK, No KK, Tempat/Tgl Lahir, No Akta, Agama, Alamat Lengkap & Titik GPS Rumah
// ==============================================================================

export interface SeedClass {
  id: string;
  nama: string;
  tingkat: 'X' | 'XI' | 'XII';
}

export interface SeedStudent {
  id: string;
  userId: string;
  nis: string;
  nisn: string;
  nik: string;
  noKk: string;
  nama: string;
  username: string;
  email: string;
  kelasId: string;
  kelasNama: string;
  jenisKelamin: 'LAKI_LAKI' | 'PEREMPUAN';
  tempatLahir: string;
  tanggalLahir: string;
  noAktaLahir: string;
  agama: 'ISLAM' | 'KRISTEN_PROTESTAN' | 'KATOLIK' | 'HINDU' | 'BUDDHA';
  jalan: string;
  rtRw: string;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  lintang: number;
  bujur: number;
  defaultPassword: string; // "Masuk123!"
  avatar?: string;
  namaAyah?: string;
  namaIbu?: string;
  pekerjaanAyah?: string;
  pekerjaanIbu?: string;
  penghasilanOrtu?: string;
  noHpOrtu?: string;
}

// 1. DAFTAR 30 KELAS
export const SEED_CLASSES: SeedClass[] = [
  // Kelas X (10 kelas)
  { id: 'kls-x-1', nama: 'X.1', tingkat: 'X' },
  { id: 'kls-x-2', nama: 'X.2', tingkat: 'X' },
  { id: 'kls-x-3', nama: 'X.3', tingkat: 'X' },
  { id: 'kls-x-4', nama: 'X.4', tingkat: 'X' },
  { id: 'kls-x-5', nama: 'X.5', tingkat: 'X' },
  { id: 'kls-x-6', nama: 'X.6', tingkat: 'X' },
  { id: 'kls-x-7', nama: 'X.7', tingkat: 'X' },
  { id: 'kls-x-8', nama: 'X.8', tingkat: 'X' },
  { id: 'kls-x-9', nama: 'X.9', tingkat: 'X' },
  { id: 'kls-x-10', nama: 'X.10', tingkat: 'X' },

  // Kelas XI IPA (5 kelas)
  { id: 'kls-xi-ipa-1', nama: 'XI IPA 1', tingkat: 'XI' },
  { id: 'kls-xi-ipa-2', nama: 'XI IPA 2', tingkat: 'XI' },
  { id: 'kls-xi-ipa-3', nama: 'XI IPA 3', tingkat: 'XI' },
  { id: 'kls-xi-ipa-4', nama: 'XI IPA 4', tingkat: 'XI' },
  { id: 'kls-xi-ipa-5', nama: 'XI IPA 5', tingkat: 'XI' },

  // Kelas XI IPS (5 kelas)
  { id: 'kls-xi-ips-1', nama: 'XI IPS 1', tingkat: 'XI' },
  { id: 'kls-xi-ips-2', nama: 'XI IPS 2', tingkat: 'XI' },
  { id: 'kls-xi-ips-3', nama: 'XI IPS 3', tingkat: 'XI' },
  { id: 'kls-xi-ips-4', nama: 'XI IPS 4', tingkat: 'XI' },
  { id: 'kls-xi-ips-5', nama: 'XI IPS 5', tingkat: 'XI' },

  // Kelas XII IPA (5 kelas)
  { id: 'kls-xii-ipa-1', nama: 'XII IPA 1', tingkat: 'XII' },
  { id: 'kls-xii-ipa-2', nama: 'XII IPA 2', tingkat: 'XII' },
  { id: 'kls-xii-ipa-3', nama: 'XII IPA 3', tingkat: 'XII' },
  { id: 'kls-xii-ipa-4', nama: 'XII IPA 4', tingkat: 'XII' },
  { id: 'kls-xii-ipa-5', nama: 'XII IPA 5', tingkat: 'XII' },

  // Kelas XII IPS (5 kelas)
  { id: 'kls-xii-ips-1', nama: 'XII IPS 1', tingkat: 'XII' },
  { id: 'kls-xii-ips-2', nama: 'XII IPS 2', tingkat: 'XII' },
  { id: 'kls-xii-ips-3', nama: 'XII IPS 3', tingkat: 'XII' },
  { id: 'kls-xii-ips-4', nama: 'XII IPS 4', tingkat: 'XII' },
  { id: 'kls-xii-ips-5', nama: 'XII IPS 5', tingkat: 'XII' },
];

const NAMA_DEPAN_LAKI = [
  'Ahmad', 'Bima', 'Dimas', 'Fajar', 'Galih', 'Hafiz', 'Irfan', 'Joko',
  'Kevin', 'Lukman', 'Maulana', 'Naufal', 'Pratama', 'Rafi', 'Satria',
  'Tegar', 'Wahyu', 'Yusuf', 'Zaki', 'Arif', 'Bayu', 'Chandra', 'Daffa',
  'Eko', 'Farhan', 'Gilang', 'Hendra', 'Ilham', 'Jodi', 'Kurniawan'
];

const NAMA_DEPAN_PEREMPUAN = [
  'Aisyah', 'Bella', 'Citra', 'Dinda', 'Fitri', 'Gita', 'Hana', 'Indah',
  'Jasmine', 'Kirana', 'Laras', 'Melani', 'Nadia', 'Putri', 'Rani',
  'Siti', 'Tiara', 'Utami', 'Vina', 'Wulan', 'Yuliana', 'Zahra', 'Anisa',
  'Cantika', 'Dewi', 'Eka', 'Febiola', 'Giska', 'Hesti', 'Intan'
];

const NAMA_BELAKANG = [
  'Saputra', 'Ramadhan', 'Kusuma', 'Pratama', 'Wibowo', 'Nugroho', 'Hidayat',
  'Santoso', 'Wijaya', 'Siregar', 'Lestari', 'Anggraini', 'Permata', 'Rahayu',
  'Utami', 'Sari', 'Puspitasari', 'Mahendra', 'Firmansyah', 'Syahputra'
];

const KELURAHAN_PAKUHAJI = [
  'Pakuhaji', 'Buaran Bambu', 'Bonisari', 'Gaga', 'Kalibaru',
  'Kiara Payung', 'Kohod', 'Kramat', 'Laksana', 'Surya Bahari', 'Sukawali'
];

export const SEED_STUDENTS: SeedStudent[] = [];

let counter = 1;
for (const kls of SEED_CLASSES) {
  for (let i = 1; i <= 5; i++) {
    const isMale = i % 2 !== 0;
    const depanArr = isMale ? NAMA_DEPAN_LAKI : NAMA_DEPAN_PEREMPUAN;
    const depan = depanArr[(counter + i) % depanArr.length] ?? 'Murid';
    const belakang = NAMA_BELAKANG[(counter * 3 + i) % NAMA_BELAKANG.length] ?? 'Tangerang';
    const fullName = `${depan} ${belakang}`;

    const numStr = String(counter).padStart(3, '0');
    const nis = `26${numStr}`;
    const nisn = `008${String(counter).padStart(7, '0')}`;
    const cleanKls = kls.nama.toLowerCase().replace(/[^a-z0-9]/g, '');
    const username = `murid_${cleanKls}_${i}`;
    const email = `${username}@siswa.sman20.sch.id`;

    // Data Kependudukan Realistis
    const nikBirthDay = isMale ? String((counter % 28) + 1).padStart(2, '0') : String(((counter % 28) + 1) + 40).padStart(2, '0');
    const nik = `360312${nikBirthDay}080${String(counter).padStart(3, '0')}`;
    const noKk = `360312010108${String(counter).padStart(4, '0')}`;
    const birthYear = kls.tingkat === 'X' ? 2009 : kls.tingkat === 'XI' ? 2008 : 2007;
    const birthMonth = String((counter % 12) + 1).padStart(2, '0');
    const birthDay = String((counter % 28) + 1).padStart(2, '0');
    const tanggalLahir = `${birthYear}-${birthMonth}-${birthDay}`;
    const noAktaLahir = `3603-LT-${birthDay}${birthMonth}${birthYear}-${String(counter).padStart(4, '0')}`;

    const kelurahan = KELURAHAN_PAKUHAJI[counter % KELURAHAN_PAKUHAJI.length] ?? 'Pakuhaji';
    const rt = String((counter % 10) + 1).padStart(3, '0');
    const rw = String((counter % 5) + 1).padStart(3, '0');
    const jalan = `Jl. KH. Saad No. ${(counter % 80) + 1}, RT ${rt}/RW ${rw}`;

    // Koordinat Rumah sekitar Pakuhaji & Sepatan (-6.12 to -6.15, 106.12 to 106.15)
    const latOffset = ((counter % 30) - 15) * 0.0012;
    const lngOffset = ((counter % 25) - 12) * 0.0014;
    const lintang = parseFloat((-6.123456 + latOffset).toFixed(6));
    const bujur = parseFloat((106.123456 + lngOffset).toFixed(6));

    SEED_STUDENTS.push({
      id: `mrd-${counter}`,
      userId: `usr-mrd-${counter}`,
      nis,
      nisn,
      nik,
      noKk,
      nama: fullName,
      username,
      email,
      kelasId: kls.id,
      kelasNama: kls.nama,
      jenisKelamin: isMale ? 'LAKI_LAKI' : 'PEREMPUAN',
      tempatLahir: 'Tangerang',
      tanggalLahir,
      noAktaLahir,
      agama: 'ISLAM',
      jalan,
      rtRw: `${rt}/${rw}`,
      kelurahan,
      kecamatan: 'Pakuhaji',
      kabupaten: 'Kabupaten Tangerang',
      provinsi: 'Banten',
      kodePos: '15570',
      lintang,
      bujur,
      defaultPassword: 'Masuk123!',
    });

    counter++;
  }
}

// ==============================================================================
// 3. MASTER DATA PRESENSI / ABSENSI (Permendikdasmen & Kehadiran GPS)
// ==============================================================================

export const SCHOOL_COORDINATES = {
  name: 'SMAN 20 Kabupaten Tangerang',
  lat: -6.123456,
  lng: 106.123456,
  radiusMeters: 100,
  jamMasukMaksimal: '07:15',
  jamPulangMinimal: '15:15',
};

export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Radius bumi dalam meter
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export interface SeedAbsensi {
  id: string;
  muridId: string;
  muridNama: string;
  nisn: string;
  kelasId: string;
  kelasNama: string;
  tanggal: string; // YYYY-MM-DD
  jamMasuk: string | null;
  jamPulang: string | null;
  status: 'HADIR' | 'TEPAT' | 'PARSIAL' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'ALPA';
  latitude: number | null;
  longitude: number | null;
  distanceFromSchool: number | null;
  isWithinRadius: boolean;
  isMockLocation: boolean;
  selfieUrl: string | null;
  watermarkText: string | null;
  deviceInfo: string | null;
  notes: string | null;
  method?: 'GPS' | 'SELFIE' | 'QR';
  attachmentUrl?: string | null;
  livenessVerified?: boolean;
  imageHash?: string | null;
  parentNotified?: boolean;
  parentNotificationPhone?: string | null;
}

export const SEED_ABSENSI: SeedAbsensi[] = [];

// Helper untuk format tanggal & waktu hari ini dalam zona Waktu Indonesia Barat (WIB / Asia/Jakarta)
export function getWibDate(date: Date = new Date()): Date {
  return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
}

export function getWibDateString(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function getWibTimeString(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const hour = parts.find((p) => p.type === 'hour')?.value || '00';
  const minute = parts.find((p) => p.type === 'minute')?.value || '00';
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')} WIB`;
}

export function getWibHoursMinutes(date: Date = new Date()): { hours: number; minutes: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const hourStr = parts.find((p) => p.type === 'hour')?.value || '0';
  const minuteStr = parts.find((p) => p.type === 'minute')?.value || '0';
  return {
    hours: parseInt(hourStr, 10) % 24,
    minutes: parseInt(minuteStr, 10),
  };
}

export const TODAY_DATE_STR: string = getWibDateString();

// Inisialisasi data absensi real-time untuk 150 murid pada hari ini
for (let i = 0; i < SEED_STUDENTS.length; i++) {
  const student = SEED_STUDENTS[i];
  if (!student) continue;
  const mod = i % 20;

  let status: 'TEPAT' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'ALPA' = 'TEPAT';
  let jamMasuk: string | null = null;
  let jamPulang: string | null = null;
  let distance = Math.floor(Math.random() * 35) + 5; // 5 - 40 meter (dalam radius 100m)
  let notes: string | null = null;

  if (mod === 17) {
    status = 'TERLAMBAT';
    const minute = 16 + (i % 25);
    jamMasuk = `07:${String(minute).padStart(2, '0')} WIB`;
    distance = Math.floor(Math.random() * 50) + 10;
    notes = 'Terlambat karena kendala lalu lintas jalan raya Pakuhaji';
  } else if (mod === 18) {
    status = 'IZIN';
    notes = 'Izin keperluan keluarga (surat terlampir dari orang tua)';
    distance = 0;
  } else if (mod === 19 && i % 40 === 19) {
    status = 'SAKIT';
    notes = 'Sakit demam tinggi (surat keterangan dokter Puskesmas Pakuhaji)';
    distance = 0;
  } else if (mod === 19 && i % 40 !== 19) {
    status = 'ALPA';
    notes = 'Belum melakukan absensi hingga jam batas';
    distance = 0;
  } else {
    // Normal Tepat Waktu
    status = 'TEPAT';
    const hour = 6;
    const minute = 30 + (i % 42); // 06:30 - 07:12
    jamMasuk = `0${hour}:${String(minute).padStart(2, '0')} WIB`;
    notes = 'Presensi mandiri GPS terverifikasi';
  }

  // Sebagian murid yang tepat waktu di sore hari sudah absen pulang
  if (status === 'TEPAT' && i % 3 === 0) {
    jamPulang = `15:${String(20 + (i % 30)).padStart(2, '0')} WIB`;
  }

  const isPresent = status === 'TEPAT' || status === 'TERLAMBAT';

  SEED_ABSENSI.push({
    id: `abs-${TODAY_DATE_STR}-${student.id}`,
    muridId: student.id,
    muridNama: student.nama,
    nisn: student.nisn,
    kelasId: student.kelasId,
    kelasNama: student.kelasNama,
    tanggal: TODAY_DATE_STR,
    jamMasuk,
    jamPulang,
    status,
    latitude: isPresent ? SCHOOL_COORDINATES.lat + ((i % 10) - 5) * 0.0001 : null,
    longitude: isPresent ? SCHOOL_COORDINATES.lng + ((i % 10) - 5) * 0.0001 : null,
    distanceFromSchool: isPresent ? distance : null,
    isWithinRadius: isPresent,
    isMockLocation: false,
    selfieUrl: isPresent ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' : null,
    watermarkText: isPresent ? `SMAN 20 • ${TODAY_DATE_STR} ${jamMasuk} • LAT:${SCHOOL_COORDINATES.lat}` : null,
    deviceInfo: isPresent ? 'Mobile PWA (Android/iOS)' : null,
    notes,
  });
}

// ==============================================================================
// 4. MASTER DATA MATA PELAJARAN (Kurikulum Merdeka SMAN 20)
// ==============================================================================

export interface SeedSubject {
  id: string;
  kode: string;
  nama: string;
  kelompok: 'UMUM' | 'PEMINATAN_IPA' | 'PEMINATAN_IPS' | 'MUATAN_LOKAL';
  jamPerMinggu: number;
}

export const SEED_SUBJECTS: SeedSubject[] = [
  { id: 'mp-1', kode: 'MTK', nama: 'Matematika', kelompok: 'UMUM', jamPerMinggu: 4 },
  { id: 'mp-2', kode: 'BIND', nama: 'Bahasa Indonesia', kelompok: 'UMUM', jamPerMinggu: 4 },
  { id: 'mp-3', kode: 'BING', nama: 'Bahasa Inggris', kelompok: 'UMUM', jamPerMinggu: 3 },
  { id: 'mp-4', kode: 'PAI', nama: 'Pendidikan Agama Islam', kelompok: 'UMUM', jamPerMinggu: 3 },
  { id: 'mp-5', kode: 'PPKN', nama: 'Pendidikan Pancasila', kelompok: 'UMUM', jamPerMinggu: 2 },
  { id: 'mp-6', kode: 'SEJ', nama: 'Sejarah Indonesia', kelompok: 'UMUM', jamPerMinggu: 2 },
  { id: 'mp-7', kode: 'PJOK', nama: 'Pendidikan Jasmani & Olahraga', kelompok: 'UMUM', jamPerMinggu: 3 },
  { id: 'mp-8', kode: 'INF', nama: 'Informatika', kelompok: 'UMUM', jamPerMinggu: 3 },
  { id: 'mp-9', kode: 'SNB', nama: 'Seni Budaya', kelompok: 'UMUM', jamPerMinggu: 2 },
  { id: 'mp-10', kode: 'FIS', nama: 'Fisika', kelompok: 'PEMINATAN_IPA', jamPerMinggu: 4 },
  { id: 'mp-11', kode: 'KIM', nama: 'Kimia', kelompok: 'PEMINATAN_IPA', jamPerMinggu: 4 },
  { id: 'mp-12', kode: 'BIO', nama: 'Biologi', kelompok: 'PEMINATAN_IPA', jamPerMinggu: 4 },
  { id: 'mp-13', kode: 'EKO', nama: 'Ekonomi', kelompok: 'PEMINATAN_IPS', jamPerMinggu: 4 },
  { id: 'mp-14', kode: 'GEO', nama: 'Geografi', kelompok: 'PEMINATAN_IPS', jamPerMinggu: 4 },
  { id: 'mp-15', kode: 'SOS', nama: 'Sosiologi', kelompok: 'PEMINATAN_IPS', jamPerMinggu: 4 },
  { id: 'mp-16', kode: 'BK', nama: 'Bimbingan Konseling', kelompok: 'UMUM', jamPerMinggu: 2 },
];

// ==============================================================================
// 5. MASTER DATA GURU & TENAGA KEPENDIDIKAN (DAPODIK LENGKAP 35 GURU/TENDIK)
// ==============================================================================

export interface SeedTeacher {
  id: string;
  userId: string;
  nip: string;
  nuptk: string;
  nik: string;
  noKk: string;
  nama: string;
  gelar: string;
  jenisKelamin: 'LAKI_LAKI' | 'PEREMPUAN';
  tempatLahir: string;
  tanggalLahir: string;
  agama: 'ISLAM' | 'KRISTEN_PROTESTAN' | 'KATOLIK' | 'HINDU' | 'BUDDHA';
  jalan: string;
  rtRw: string;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  lintang: number;
  bujur: number;
  jabatan: string;
  mataPelajaran: string;
  status: 'AKTIF' | 'CUTI' | 'PENSIUN';
  statusKepegawaian: 'PNS' | 'PPPK' | 'HONORER';
  noHp: string;
  pendidikan: string;
  email: string;
  username: string;
  defaultPassword: string;
  avatar: string;
  waliKelasId?: string | null;
  waliKelasNama?: string | null;
}

const TEACHER_RAW = [
  { nama: 'Drs. H. Budi Santoso', gelar: 'M.Pd.', jk: 'LAKI_LAKI' as const, mapel: 'Matematika', jab: 'Wali Kelas & Guru MTK', pend: 'S2 Magister Pendidikan', statusPeg: 'PNS' as const },
  { nama: 'Siti Rahmawati', gelar: 'S.Pd., M.Si.', jk: 'PEREMPUAN' as const, mapel: 'Fisika', jab: 'Wali Kelas & Guru Fisika', pend: 'S2 Fisika Terapan', statusPeg: 'PNS' as const },
  { nama: 'Ahmad Fauzi', gelar: 'S.Pd.', jk: 'LAKI_LAKI' as const, mapel: 'Bahasa Indonesia', jab: 'Wali Kelas & Guru B. Indo', pend: 'S1 Pendidikan Bahasa', statusPeg: 'PPPK' as const },
  { nama: 'Dra. Hj. Nurjanah', gelar: 'M.Pd.', jk: 'PEREMPUAN' as const, mapel: 'Biologi', jab: 'Wali Kelas & Guru Biologi', pend: 'S2 Pendidikan Biologi', statusPeg: 'PNS' as const },
  { nama: 'Bambang Irawan', gelar: 'S.Si., M.Pd.', jk: 'LAKI_LAKI' as const, mapel: 'Kimia', jab: 'Wali Kelas & Guru Kimia', pend: 'S2 Kimia Lingkungan', statusPeg: 'PNS' as const },
  { nama: 'Eni Maryani', gelar: 'S.Pd.', jk: 'PEREMPUAN' as const, mapel: 'Bahasa Inggris', jab: 'Wali Kelas & Guru B. Inggris', pend: 'S1 Pendidikan B. Inggris', statusPeg: 'PPPK' as const },
  { nama: 'Hendri Setiawan', gelar: 'S.Kom., M.T.', jk: 'LAKI_LAKI' as const, mapel: 'Informatika', jab: 'Wali Kelas & Guru TIK', pend: 'S2 Teknik Informatika', statusPeg: 'PNS' as const },
  { nama: 'Rina Kusuma Dewi', gelar: 'S.Pd.', jk: 'PEREMPUAN' as const, mapel: 'Ekonomi', jab: 'Wali Kelas & Guru Ekonomi', pend: 'S1 Pendidikan Ekonomi', statusPeg: 'PPPK' as const },
  { nama: 'Agus Sulistyo', gelar: 'S.Pd.', jk: 'LAKI_LAKI' as const, mapel: 'Geografi', jab: 'Wali Kelas & Guru Geografi', pend: 'S1 Pendidikan Geografi', statusPeg: 'HONORER' as const },
  { nama: 'Sri Wahyuni', gelar: 'S.Sos., M.A.', jk: 'PEREMPUAN' as const, mapel: 'Sosiologi', jab: 'Wali Kelas & Guru Sosiologi', pend: 'S2 Sosiologi Terapan', statusPeg: 'PNS' as const },
  { nama: 'M. Ridwan', gelar: 'S.Pd.I.', jk: 'LAKI_LAKI' as const, mapel: 'Pendidikan Agama Islam', jab: 'Wali Kelas & Guru PAI', pend: 'S1 Tarbiyah & PAI', statusPeg: 'PNS' as const },
  { nama: 'Tri Haryanti', gelar: 'S.Pd.', jk: 'PEREMPUAN' as const, mapel: 'Pendidikan Pancasila', jab: 'Wali Kelas & Guru PPKn', pend: 'S1 PPKn & Hukum', statusPeg: 'PPPK' as const },
  { nama: 'Dedi Kurniawan', gelar: 'S.Pd.Kor.', jk: 'LAKI_LAKI' as const, mapel: 'Pendidikan Jasmani & Olahraga', jab: 'Wali Kelas & Guru Olahraga', pend: 'S1 Pendidikan Olahraga', statusPeg: 'HONORER' as const },
  { nama: 'Nur Hidayati', gelar: 'S.Sn.', jk: 'PEREMPUAN' as const, mapel: 'Seni Budaya', jab: 'Wali Kelas & Guru Seni', pend: 'S1 Seni Rupa & Kriya', statusPeg: 'PPPK' as const },
  { nama: 'Eko Prasetyo', gelar: 'S.Pd.', jk: 'LAKI_LAKI' as const, mapel: 'Sejarah Indonesia', jab: 'Wali Kelas & Guru Sejarah', pend: 'S1 Pendidikan Sejarah', statusPeg: 'PNS' as const },
  { nama: 'Dyah Retnowati', gelar: 'S.Psi., M.Pd.', jk: 'PEREMPUAN' as const, mapel: 'Bimbingan Konseling', jab: 'Wali Kelas & Guru BK', pend: 'S2 Psikologi Pendidikan', statusPeg: 'PNS' as const },
  { nama: 'Wahid Hasjim', gelar: 'S.Pd.', jk: 'LAKI_LAKI' as const, mapel: 'Matematika', jab: 'Wali Kelas & Guru MTK', pend: 'S1 Pendidikan Matematika', statusPeg: 'PPPK' as const },
  { nama: 'Lina Marlina', gelar: 'S.Si.', jk: 'PEREMPUAN' as const, mapel: 'Fisika', jab: 'Wali Kelas & Guru Fisika', pend: 'S1 Fisika Murni', statusPeg: 'HONORER' as const },
  { nama: 'Cecep Suryana', gelar: 'S.Pd.', jk: 'LAKI_LAKI' as const, mapel: 'Bahasa Indonesia', jab: 'Wali Kelas & Guru B. Indo', pend: 'S1 Sastra Indonesia', statusPeg: 'PNS' as const },
  { nama: 'Dewi Lestari', gelar: 'S.Pd.', jk: 'PEREMPUAN' as const, mapel: 'Biologi', jab: 'Wali Kelas & Guru Biologi', pend: 'S1 Pendidikan Biologi', statusPeg: 'PPPK' as const },
  { nama: 'Iskandar Zulkarnain', gelar: 'S.Pd., M.Si.', jk: 'LAKI_LAKI' as const, mapel: 'Kimia', jab: 'Wali Kelas & Guru Kimia', pend: 'S2 Kimia Analitik', statusPeg: 'PNS' as const },
  { nama: 'Maya Safitri', gelar: 'S.Pd.', jk: 'PEREMPUAN' as const, mapel: 'Bahasa Inggris', jab: 'Wali Kelas & Guru B. Inggris', pend: 'S1 Pendidikan Bahasa Inggris', statusPeg: 'PPPK' as const },
  { nama: 'Gunawan Prasetya', gelar: 'S.Kom.', jk: 'LAKI_LAKI' as const, mapel: 'Informatika', jab: 'Wali Kelas & Guru Informatika', pend: 'S1 Sistem Informasi', statusPeg: 'HONORER' as const },
  { nama: 'Fitri Handayani', gelar: 'S.E., M.Pd.', jk: 'PEREMPUAN' as const, mapel: 'Ekonomi', jab: 'Wali Kelas & Guru Ekonomi', pend: 'S2 Manajemen Pendidikan', statusPeg: 'PNS' as const },
  { nama: 'Surya Darmawan', gelar: 'S.Pd.', jk: 'LAKI_LAKI' as const, mapel: 'Geografi', jab: 'Wali Kelas & Guru Geografi', pend: 'S1 Geografi Edukasi', statusPeg: 'PPPK' as const },
  { nama: 'Ratna Yunita', gelar: 'S.Sos.', jk: 'PEREMPUAN' as const, mapel: 'Sosiologi', jab: 'Wali Kelas & Guru Sosiologi', pend: 'S1 Sosiologi Pedesaan', statusPeg: 'HONORER' as const },
  { nama: 'Habib Mustofa', gelar: 'S.Th.I.', jk: 'LAKI_LAKI' as const, mapel: 'Pendidikan Agama Islam', jab: 'Wali Kelas & Guru PAI', pend: 'S1 Ushuluddin', statusPeg: 'PNS' as const },
  { nama: 'Kurniasih', gelar: 'S.Pd.', jk: 'PEREMPUAN' as const, mapel: 'Pendidikan Pancasila', jab: 'Wali Kelas & Guru PPKn', pend: 'S1 Pendidikan Moral & Hukum', statusPeg: 'PPPK' as const },
  { nama: 'Aris Munandar', gelar: 'S.Pd.', jk: 'LAKI_LAKI' as const, mapel: 'Pendidikan Jasmani & Olahraga', jab: 'Wali Kelas & Guru Olahraga', pend: 'S1 Kepelatihan Olahraga', statusPeg: 'PNS' as const },
  { nama: 'Mega Puspita', gelar: 'S.Pd.', jk: 'PEREMPUAN' as const, mapel: 'Seni Budaya', jab: 'Wali Kelas & Guru Seni', pend: 'S1 Seni Musik & Tari', statusPeg: 'HONORER' as const },
  // Pimpinan & Tenaga Kependidikan Non-Wali Kelas (5 Orang)
  { nama: 'Drs. H. Mulyadi', gelar: 'M.M.', jk: 'LAKI_LAKI' as const, mapel: 'Manajemen Sekolah', jab: 'Kepala Sekolah', pend: 'S2 Magister Manajemen', statusPeg: 'PNS' as const },
  { nama: 'Endang Suherman', gelar: 'M.Pd.', jk: 'LAKI_LAKI' as const, mapel: 'Matematika', jab: 'Wakil Kepala Sekolah (Kurikulum)', pend: 'S2 Evaluasi Pendidikan', statusPeg: 'PNS' as const },
  { nama: 'Hj. Yuliani', gelar: 'S.Pd., M.M.', jk: 'PEREMPUAN' as const, mapel: 'Bahasa Indonesia', jab: 'Wakil Kepala Sekolah (Kesiswaan)', pend: 'S2 Manajemen Pendidikan', statusPeg: 'PNS' as const },
  { nama: 'Tatang Supriatna', gelar: 'S.AP.', jk: 'LAKI_LAKI' as const, mapel: 'Administrasi', jab: 'Kepala Tata Usaha (TU)', pend: 'S1 Administrasi Publik', statusPeg: 'PNS' as const },
  { nama: 'Wulan Anggraeni', gelar: 'A.Md.', jk: 'PEREMPUAN' as const, mapel: 'Kearsipan & Dapodik', jab: 'Operator Dapodik & Staf TU', pend: 'D3 Manajemen Informatika', statusPeg: 'PPPK' as const },
];

export const SEED_TEACHERS: SeedTeacher[] = [];

for (let i = 0; i < TEACHER_RAW.length; i++) {
  const raw = TEACHER_RAW[i];
  if (!raw) continue;
  const numStr = String(i + 1).padStart(3, '0');
  const birthYear = 1970 + (i % 25);
  const birthMonth = String((i % 12) + 1).padStart(2, '0');
  const birthDay = String((i % 28) + 1).padStart(2, '0');
  const nipDay = raw.jk === 'LAKI_LAKI' ? birthDay : String(parseInt(birthDay, 10) + 40).padStart(2, '0');

  const nip = `19${String(birthYear).slice(2)}${birthMonth}${nipDay}200${String(i + 1).padStart(2, '0')}100${String((i % 3) + 1)}`;
  const nuptk = `98${birthMonth}${String(birthYear).slice(2)}7${String(i + 1).padStart(5, '0')}000${String((i % 5) + 1)}`;
  const nik = `360312${nipDay}${birthMonth}${String(birthYear).slice(2)}0${numStr}`;
  const noKk = `3603120101050${numStr}`;

  const klsWali = i < SEED_CLASSES.length ? SEED_CLASSES[i] : null;
  const cleanName = raw.nama.toLowerCase().replace(/[^a-z0-9]/g, '');
  const username = `guru_${cleanName.slice(0, 8)}_${i + 1}`;
  const email = `${username}@sman20kabtangerang.sch.id`;

  const rt = String((i % 9) + 1).padStart(3, '0');
  const rw = String((i % 4) + 1).padStart(3, '0');

  SEED_TEACHERS.push({
    id: `guru-${i + 1}`,
    userId: `usr-guru-${i + 1}`,
    nip,
    nuptk,
    nik,
    noKk,
    nama: raw.nama,
    gelar: raw.gelar,
    jenisKelamin: raw.jk,
    tempatLahir: 'Tangerang',
    tanggalLahir: `${birthYear}-${birthMonth}-${birthDay}`,
    agama: 'ISLAM',
    jalan: `Jl. Raya Pakuhaji No. ${(i * 4) + 12}, RT ${rt}/RW ${rw}`,
    rtRw: `${rt}/${rw}`,
    kelurahan: KELURAHAN_PAKUHAJI[i % KELURAHAN_PAKUHAJI.length] ?? 'Pakuhaji',
    kecamatan: 'Pakuhaji',
    kabupaten: 'Kabupaten Tangerang',
    provinsi: 'Banten',
    kodePos: '15570',
    lintang: parseFloat((-6.123456 + ((i % 10) - 5) * 0.002).toFixed(6)),
    bujur: parseFloat((106.123456 + ((i % 10) - 5) * 0.002).toFixed(6)),
    jabatan: raw.jab,
    mataPelajaran: raw.mapel,
    status: 'AKTIF',
    statusKepegawaian: raw.statusPeg,
    noHp: `0812${String(birthYear)}${String(i + 100).padStart(4, '0')}`,
    pendidikan: raw.pend,
    email,
    username,
    defaultPassword: 'Masuk123!',
    avatar: raw.jk === 'LAKI_LAKI'
      ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
      : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    waliKelasId: klsWali?.id || null,
    waliKelasNama: klsWali?.nama || null,
  });
}

// ==============================================================================
// 6. MASTER JADWAL PELAJARAN KBM (30 KELAS X, XI, XII — SENIN s/d JUMAT)
// ==============================================================================

export interface SeedSchedule {
  id: string;
  kelasId: string;
  kelasNama: string;
  hari: 'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT';
  jamMulai: string;
  jamSelesai: string;
  mapelId: string;
  mapelNama: string;
  guruId: string;
  guruNama: string;
  ruang: string;
}

export const SEED_SCHEDULES: SeedSchedule[] = [];

const DAYS: Array<'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT'> = [
  'SENIN',
  'SELASA',
  'RABU',
  'KAMIS',
  'JUMAT',
];

const TIME_SLOTS = [
  { jamMulai: '07:15', jamSelesai: '08:45' },
  { jamMulai: '08:45', jamSelesai: '10:15' },
  { jamMulai: '10:45', jamSelesai: '12:15' },
  { jamMulai: '13:15', jamSelesai: '14:45' },
];

let scheduleCounter = 1;

for (let k = 0; k < SEED_CLASSES.length; k++) {
  const kls = SEED_CLASSES[k];
  if (!kls) continue;

  for (let d = 0; d < DAYS.length; d++) {
    const day = DAYS[d];
    if (!day) continue;

    for (let s = 0; s < TIME_SLOTS.length; s++) {
      const slot = TIME_SLOTS[s];
      if (!slot) continue;

      // Pilih mapel sesuai tingkat dan jurusan
      let subjectIndex = (k + d * 2 + s) % SEED_SUBJECTS.length;
      if (kls.nama.includes('IPA')) {
        const ipaSubjects = [9, 10, 11, 0, 1, 2, 7]; // FIS, KIM, BIO, MTK, BIND, BING, INF
        subjectIndex = ipaSubjects[(d + s) % ipaSubjects.length] ?? 0;
      } else if (kls.nama.includes('IPS')) {
        const ipsSubjects = [12, 13, 14, 0, 1, 5, 2]; // EKO, GEO, SOS, MTK, BIND, SEJ, BING
        subjectIndex = ipsSubjects[(d + s) % ipsSubjects.length] ?? 0;
      }

      const subject = SEED_SUBJECTS[subjectIndex] ?? SEED_SUBJECTS[0];
      if (!subject) continue;

      // Cari guru pengampu mapel tersebut
      const teacher =
        SEED_TEACHERS.find((t) => t.mataPelajaran.includes(subject.nama) || subject.nama.includes(t.mataPelajaran)) ||
        SEED_TEACHERS[(k + s) % SEED_TEACHERS.length] ||
        SEED_TEACHERS[0];
      if (!teacher) continue;

      SEED_SCHEDULES.push({
        id: `jdw-${scheduleCounter++}`,
        kelasId: kls.id,
        kelasNama: kls.nama,
        hari: day,
        jamMulai: slot.jamMulai,
        jamSelesai: slot.jamSelesai,
        mapelId: subject.id,
        mapelNama: subject.nama,
        guruId: teacher.id,
        guruNama: `${teacher.nama}, ${teacher.gelar}`,
        ruang: `Ruang ${kls.nama}`,
      });
    }
  }
}

// ==============================================================================
// 7. MASTER PRESENSI & REKAP KBM GURU (Fase 2 Modul A10)
// ==============================================================================

export interface SeedTeacherAttendance {
  id: string;
  guruId: string;
  guruNama: string;
  nip: string;
  tanggal: string;
  jamMasuk: string | null;
  jamPulang: string | null;
  status: 'HADIR' | 'TEPAT' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'DINAS_LUAR';
  distanceFromSchool: number | null;
  isWithinRadius: boolean;
  keteranganKBM: string | null;
  selfieUrl: string | null;
  notes: string | null;
}

export const SEED_TEACHER_ATTENDANCE: SeedTeacherAttendance[] = [];

for (let i = 0; i < SEED_TEACHERS.length; i++) {
  const teacher = SEED_TEACHERS[i];
  if (!teacher) continue;

  const mod = i % 15;
  let status: 'TEPAT' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'DINAS_LUAR' = 'TEPAT';
  let jamMasuk: string | null = `06:${String(25 + (i % 35)).padStart(2, '0')} WIB`;
  let jamPulang: string | null = null;
  let notes: string | null = 'Presensi mandiri Guru terverifikasi';
  let kbm = `Mengajar ${teacher.mataPelajaran} (4 Jam Pelajaran)`;

  if (mod === 12) {
    status = 'TERLAMBAT';
    jamMasuk = `07:${String(20 + (i % 15)).padStart(2, '0')} WIB`;
    notes = 'Terlambat karena kendala akses jalan raya';
  } else if (mod === 13) {
    status = 'DINAS_LUAR';
    jamMasuk = null;
    notes = 'Mengikuti Workshop Kurikulum Merdeka di Balai Guru Banten';
    kbm = 'Tugas Terstruktur Diberikan ke Guru Piket';
  } else if (mod === 14) {
    status = 'IZIN';
    jamMasuk = null;
    notes = 'Izin urusan keluarga dinas';
    kbm = 'Materi & Lembar Kerja Mandiri Terlampir';
  }

  // Sore hari sebagian guru sudah absen pulang
  if (status === 'TEPAT' && i % 2 === 0) {
    jamPulang = `15:${String(30 + (i % 20)).padStart(2, '0')} WIB`;
  }

  const isPresent = status === 'TEPAT' || status === 'TERLAMBAT';

  SEED_TEACHER_ATTENDANCE.push({
    id: `abs-guru-${TODAY_DATE_STR}-${teacher.id}`,
    guruId: teacher.id,
    guruNama: `${teacher.nama}, ${teacher.gelar}`,
    nip: teacher.nip,
    tanggal: TODAY_DATE_STR,
    jamMasuk,
    jamPulang,
    status,
    distanceFromSchool: isPresent ? Math.floor(Math.random() * 30) + 5 : null,
    isWithinRadius: isPresent,
    keteranganKBM: kbm,
    selfieUrl: isPresent ? teacher.avatar : null,
    notes,
  });
}


