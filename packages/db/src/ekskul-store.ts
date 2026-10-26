// ==============================================================================
// DZITOE — Ekstrakurikuler & Pembinaan Minat Bakat Store (@dzitoe/db)
// Task: Modul A8 — Ekstrakurikuler (Menuntaskan 100% Fase 1: Master Data Sekolah)
// Kurikulum Merdeka 2026 & Standar SMAN 20 Kabupaten Tangerang
// ==============================================================================

import { SEED_STUDENTS } from './seed-data';

export type EkskulKategori =
  | 'BELA_NEGARA'
  | 'KEPANDUAN'
  | 'OLAHRAGA'
  | 'KESENIAN'
  | 'AKADEMIK'
  | 'KEAGAMAAN'
  | 'LINGKUNGAN';

export interface EkstrakurikulerRecord {
  id: string;
  kode: string;
  nama: string;
  kategori: EkskulKategori;
  kategoriLabel: string;
  deskripsi: string;
  pembinaGuruId: string;
  pembinaNama: string;
  pembinaNip: string;
  hariKegiatan: string;
  jamMulai: string;
  jamSelesai: string;
  lokasi: string;
  kuota: number;
  jumlahAnggota: number;
  prestasiTerakhir: string;
  fotoUrl: string;
  status: 'AKTIF' | 'NONAKTIF';
}

export interface AnggotaEkskul {
  id: string;
  ekskulId: string;
  muridId: string;
  muridNama: string;
  nisn: string;
  kelasNama: string;
  jabatan: 'KETUA' | 'WAKIL_KETUA' | 'SEKRETARIS' | 'BENDAHARA' | 'ANGGOTA';
  tanggalBergabung: string;
  status: 'AKTIF' | 'ALUMNI';
}

export interface PresensiEkskul {
  id: string;
  ekskulId: string;
  ekskulNama: string;
  tanggal: string;
  materiLatihan: string;
  pembinaHadir: boolean;
  totalHadir: number;
  totalIzin: number;
  totalAlpa: number;
  catatan: string;
}

export const KATEGORI_COLORS: Record<EkskulKategori, { label: string; badge: string; border: string }> = {
  BELA_NEGARA: {
    label: 'Bela Negara & Kepemimpinan',
    badge: 'bg-red-100 text-red-800',
    border: 'border-red-200',
  },
  KEPANDUAN: {
    label: 'Kepanduan & Praja Muda Karana',
    badge: 'bg-amber-100 text-amber-800',
    border: 'border-amber-200',
  },
  OLAHRAGA: {
    label: 'Olahraga & Atletik',
    badge: 'bg-emerald-100 text-emerald-800',
    border: 'border-emerald-200',
  },
  KESENIAN: {
    label: 'Seni Musik & Tari Tradisional',
    badge: 'bg-purple-100 text-purple-800',
    border: 'border-purple-200',
  },
  AKADEMIK: {
    label: 'Sains, Riset & Bahasa',
    badge: 'bg-blue-100 text-blue-800',
    border: 'border-blue-200',
  },
  KEAGAMAAN: {
    label: 'Keagamaan & Karakter Mulia',
    badge: 'bg-teal-100 text-teal-800',
    border: 'border-teal-200',
  },
  LINGKUNGAN: {
    label: 'Pecinta Alam & Lingkungan Hidup',
    badge: 'bg-lime-100 text-lime-800',
    border: 'border-lime-200',
  },
};

export type EkskulRecord = EkstrakurikulerRecord;

// 10 Real Ekstrakurikuler SMAN 20 Kabupaten Tangerang
export const SEED_EKSKUL: EkstrakurikulerRecord[] = [
  {
    id: 'eks-01',
    kode: 'PAS-01',
    nama: 'Paskibra Satya Bhakti',
    kategori: 'BELA_NEGARA',
    kategoriLabel: 'Bela Negara & Kepemimpinan',
    deskripsi: 'Pelatihan baris berbaris formasi, kedisiplinan prajurit, dan pengibar bendera pusaka HUT RI.',
    pembinaGuruId: 'tch-004',
    pembinaNama: 'Supriyadi, S.Pd.',
    pembinaNip: '198103152006041005',
    hariKegiatan: 'Selasa & Sabtu',
    jamMulai: '15:30',
    jamSelesai: '17:30',
    lokasi: 'Lapangan Upacara Utama SMAN 20',
    kuota: 45,
    jumlahAnggota: 38,
    prestasiTerakhir: 'Juara 1 LKBB Tingkat Provinsi Banten 2025',
    fotoUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=500',
    status: 'AKTIF',
  },
  {
    id: 'eks-02',
    kode: 'PRA-02',
    nama: 'Pramuka Ambalan Soekarno-Fatmawati',
    kategori: 'KEPANDUAN',
    kategoriLabel: 'Kepanduan & Praja Muda Karana',
    deskripsi: 'Pendidikan kepanduan kepribadian mandiri, tali temali, kompas, survival rimba, dan bakti perkemahan.',
    pembinaGuruId: 'tch-001',
    pembinaNama: 'Drs. H. Ahmad Fauzi, M.Pd.',
    pembinaNip: '197005121995031001',
    hariKegiatan: 'Jumat',
    jamMulai: '14:00',
    jamSelesai: '16:30',
    lokasi: 'Pangkalan Ambalan & Gazebo Timur',
    kuota: 60,
    jumlahAnggota: 52,
    prestasiTerakhir: 'Giat Prestasi Penegak Kwartir Cabang Tangerang 2025',
    fotoUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500',
    status: 'AKTIF',
  },
  {
    id: 'eks-03',
    kode: 'PMR-03',
    nama: 'Palang Merah Remaja (PMR Wira)',
    kategori: 'BELA_NEGARA',
    kategoriLabel: 'Kemanusiaan & Pertolongan Pertama',
    deskripsi: 'Pertolongan pertama pada kecelakaan (PPGD), tandu darurat, donor darah, dan kebersihan UKS.',
    pembinaGuruId: 'tch-002',
    pembinaNama: 'Siti Rahmawati, M.Pd.',
    pembinaNip: '197408252000032002',
    hariKegiatan: 'Rabu',
    jamMulai: '15:30',
    jamSelesai: '17:00',
    lokasi: 'Ruang UKS & Lapangan Tenis',
    kuota: 35,
    jumlahAnggota: 30,
    prestasiTerakhir: 'Peringkat Terbaik Jumpa Bakti Gembira (Jumbara) PMR 2025',
    fotoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500',
    status: 'AKTIF',
  },
  {
    id: 'eks-04',
    kode: 'ROH-04',
    nama: 'Rohis Nurul Ilmi',
    kategori: 'KEAGAMAAN',
    kategoriLabel: 'Keagamaan & Karakter Mulia',
    deskripsi: 'Kajian tadabbur Al-Qur’an, seni nasyid hadroh marawis, tahsin, dan penyelenggaraan PHBI.',
    pembinaGuruId: 'tch-006',
    pembinaNama: 'Nurul Hidayati, S.Pd.I.',
    pembinaNip: '198506122010012002',
    hariKegiatan: 'Kamis',
    jamMulai: '15:30',
    jamSelesai: '17:00',
    lokasi: 'Masjid Nurul Ilmi SMAN 20',
    kuota: 50,
    jumlahAnggota: 44,
    prestasiTerakhir: 'Juara 2 Festival Hadroh Pelajar Se-Tangerang Raya 2025',
    fotoUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=500',
    status: 'AKTIF',
  },
  {
    id: 'eks-05',
    kode: 'FUT-05',
    nama: 'Futsal Club SMAN 20',
    kategori: 'OLAHRAGA',
    kategoriLabel: 'Olahraga & Atletik',
    deskripsi: 'Pembinaan fisik daya tahan, teknik passing kontrol, formasi taktik menyerang, dan turnamen liga futsal antar SMA.',
    pembinaGuruId: 'tch-003',
    pembinaNama: 'Budi Santoso, S.Pd.',
    pembinaNip: '197801122002121003',
    hariKegiatan: 'Senin & Kamis',
    jamMulai: '16:00',
    jamSelesai: '18:00',
    lokasi: 'Lapangan Futsal Terbuka SMAN 20',
    kuota: 30,
    jumlahAnggota: 28,
    prestasiTerakhir: 'Runner Up Hydro Coco National Futsal Regional Tangerang',
    fotoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500',
    status: 'AKTIF',
  },
  {
    id: 'eks-06',
    kode: 'BSK-06',
    nama: 'Basketball Warriors',
    kategori: 'OLAHRAGA',
    kategoriLabel: 'Olahraga & Atletik',
    deskripsi: 'Fundamental dribble, lay up shoot, pick and roll, serta pembentukan tim DBL Banten Series.',
    pembinaGuruId: 'tch-010',
    pembinaNama: 'Rizky Pratama, S.Pd.',
    pembinaNip: '199004122015041002',
    hariKegiatan: 'Selasa & Jumat',
    jamMulai: '15:30',
    jamSelesai: '17:30',
    lokasi: 'Lapangan Basket Outdoor SMAN 20',
    kuota: 30,
    jumlahAnggota: 25,
    prestasiTerakhir: 'Semifinalis DBL Banten Series 2025',
    fotoUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500',
    status: 'AKTIF',
  },
  {
    id: 'eks-07',
    kode: 'ENG-07',
    nama: 'English Debate & Speech Society',
    kategori: 'AKADEMIK',
    kategoriLabel: 'Sains, Riset & Bahasa',
    deskripsi: 'Parliamentary debate, speech fluency, critical thinking on global issues, and TOEFL coaching.',
    pembinaGuruId: 'tch-008',
    pembinaNama: 'Dewi Lestari, S.Pd.',
    pembinaNip: '198402102009022001',
    hariKegiatan: 'Rabu',
    jamMulai: '15:30',
    jamSelesai: '17:00',
    lokasi: 'Lab Bahasa Multimedia',
    kuota: 25,
    jumlahAnggota: 22,
    prestasiTerakhir: 'Best Speaker National Schools Debating Championship (NSDC) Banten',
    fotoUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500',
    status: 'AKTIF',
  },
  {
    id: 'eks-08',
    kode: 'TAR-08',
    nama: 'Sanggar Seni Tari & Musik Tradisional Cisadane',
    kategori: 'KESENIAN',
    kategoriLabel: 'Seni Musik & Tari Tradisional',
    deskripsi: 'Pelestarian tari Lenggang Cisadane Banten, gamelan degung Sunda, dan kreasi kolosal tari modern.',
    pembinaGuruId: 'tch-007',
    pembinaNama: 'Ratna Sari, S.Pd.',
    pembinaNip: '198309152008012004',
    hariKegiatan: 'Kamis',
    jamMulai: '15:30',
    jamSelesai: '17:30',
    lokasi: 'Aula Pertemuan & Ruang Kesenian',
    kuota: 35,
    jumlahAnggota: 31,
    prestasiTerakhir: 'Juara 1 FLS2N Festival Tari Kreasi Tingkat Kabupaten 2025',
    fotoUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500',
    status: 'AKTIF',
  },
  {
    id: 'eks-09',
    kode: 'KIR-09',
    nama: 'Kelompok Ilmiah Remaja (KIR) & Robotik',
    kategori: 'AKADEMIK',
    kategoriLabel: 'Sains, Riset & Bahasa',
    deskripsi: 'Penelitian karya tulis ilmiah remaja (LIPI/BRIN), pemrograman mikrokontroler Arduino & IoT sensor lingkungan.',
    pembinaGuruId: 'tch-009',
    pembinaNama: 'Agus Setiawan, S.Pd.',
    pembinaNip: '198705202011011003',
    hariKegiatan: 'Rabu',
    jamMulai: '15:30',
    jamSelesai: '17:00',
    lokasi: 'Laboratorium IPA Terpadu',
    kuota: 25,
    jumlahAnggota: 20,
    prestasiTerakhir: 'Finalis OPSI (Olimpiade Penelitian Siswa Indonesia) 2025',
    fotoUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500',
    status: 'AKTIF',
  },
  {
    id: 'eks-10',
    kode: 'PAL-10',
    nama: 'Paspala (Pecinta Alam SMAN 20)',
    kategori: 'LINGKUNGAN',
    kategoriLabel: 'Pecinta Alam & Lingkungan Hidup',
    deskripsi: 'Navigasi darat kompas bidik, konservasi mangrove pesisir utara Tangerang, dan penanaman pohon sekolah adiwiyata.',
    pembinaGuruId: 'tch-015',
    pembinaNama: 'Dedi Kurniawan, S.Pd.',
    pembinaNip: '198907152014031002',
    hariKegiatan: 'Sabtu',
    jamMulai: '08:00',
    jamSelesai: '11:00',
    lokasi: 'Green House & Halaman Belakang',
    kuota: 30,
    jumlahAnggota: 24,
    prestasiTerakhir: 'Penghargaan Aksi Lingkungan Hidup Pesisir Tangerang 2025',
    fotoUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=500',
    status: 'AKTIF',
  },
];

// Seed Real Members for Ekskul (from SEED_STUDENTS)
export const SEED_ANGGOTA_EKSKUL: AnggotaEkskul[] = [
  {
    id: 'ang-001',
    ekskulId: 'eks-01',
    muridId: 'std-0080000001',
    muridNama: 'Ahmad Fauzi',
    nisn: '0080000001',
    kelasNama: 'X.1',
    jabatan: 'KETUA',
    tanggalBergabung: '2025-07-20',
    status: 'AKTIF',
  },
  {
    id: 'ang-002',
    ekskulId: 'eks-01',
    muridId: 'std-0080000002',
    muridNama: 'Aisyah Putri',
    nisn: '0080000002',
    kelasNama: 'X.1',
    jabatan: 'SEKRETARIS',
    tanggalBergabung: '2025-07-20',
    status: 'AKTIF',
  },
  {
    id: 'ang-003',
    ekskulId: 'eks-05',
    muridId: 'std-0080000003',
    muridNama: 'Budi Santoso',
    nisn: '0080000003',
    kelasNama: 'X.1',
    jabatan: 'KETUA',
    tanggalBergabung: '2025-07-22',
    status: 'AKTIF',
  },
  {
    id: 'ang-004',
    ekskulId: 'eks-05',
    muridId: 'std-0080000007',
    muridNama: 'Fajar Nugraha',
    nisn: '0080000007',
    kelasNama: 'X.1',
    jabatan: 'ANGGOTA',
    tanggalBergabung: '2025-07-22',
    status: 'AKTIF',
  },
  {
    id: 'ang-005',
    ekskulId: 'eks-06',
    muridId: 'std-0080000008',
    muridNama: 'Farhan Maulana',
    nisn: '0080000008',
    kelasNama: 'X.1',
    jabatan: 'KETUA',
    tanggalBergabung: '2025-07-21',
    status: 'AKTIF',
  },
  {
    id: 'ang-006',
    ekskulId: 'eks-03',
    muridId: 'std-0080000004',
    muridNama: 'Citra Dewi',
    nisn: '0080000004',
    kelasNama: 'X.1',
    jabatan: 'WAKIL_KETUA',
    tanggalBergabung: '2025-07-20',
    status: 'AKTIF',
  },
  {
    id: 'ang-007',
    ekskulId: 'eks-07',
    muridId: 'std-0080000010',
    muridNama: 'Hendra Gunawan',
    nisn: '0080000010',
    kelasNama: 'X.1',
    jabatan: 'KETUA',
    tanggalBergabung: '2025-07-25',
    status: 'AKTIF',
  },
  {
    id: 'ang-008',
    ekskulId: 'eks-09',
    muridId: 'std-0080000005',
    muridNama: 'Eko Prasetyo',
    nisn: '0080000005',
    kelasNama: 'X.1',
    jabatan: 'ANGGOTA',
    tanggalBergabung: '2025-07-25',
    status: 'AKTIF',
  },
  {
    id: 'ang-009',
    ekskulId: 'eks-04',
    muridId: 'std-0080000015',
    muridNama: 'Dewi Lestari',
    nisn: '0080000015',
    kelasNama: 'X.1',
    jabatan: 'BENDAHARA',
    tanggalBergabung: '2025-07-20',
    status: 'AKTIF',
  },
  {
    id: 'ang-010',
    ekskulId: 'eks-08',
    muridId: 'std-0080000012',
    muridNama: 'Bambang Pamungkas',
    nisn: '0080000012',
    kelasNama: 'X.1',
    jabatan: 'ANGGOTA',
    tanggalBergabung: '2025-07-24',
    status: 'AKTIF',
  },
];

// Seed 5 Recent Practice Presences
export const SEED_PRESENSI_EKSKUL: PresensiEkskul[] = [
  {
    id: 'pr-eks-01',
    ekskulId: 'eks-01',
    ekskulNama: 'Paskibra Satya Bhakti',
    tanggal: '2026-09-26',
    materiLatihan: 'Pemantapan Formasi Kolone Senapan & Langkah Tegap Maju',
    pembinaHadir: true,
    totalHadir: 36,
    totalIzin: 2,
    totalAlpa: 0,
    catatan: 'Latihan berjalan tertib, persiapan parade Hari Sumpah Pemuda.',
  },
  {
    id: 'pr-eks-02',
    ekskulId: 'eks-02',
    ekskulNama: 'Pramuka Ambalan Soekarno-Fatmawati',
    tanggal: '2026-09-25',
    materiLatihan: 'Teknik Pionering Tali Temali Menara Pandang 3 Kaki',
    pembinaHadir: true,
    totalHadir: 49,
    totalIzin: 3,
    totalAlpa: 0,
    catatan: 'Semua sangga berhasil menyelesaikan simpul palang tepat waktu.',
  },
  {
    id: 'pr-eks-03',
    ekskulId: 'eks-05',
    ekskulNama: 'Futsal Club SMAN 20',
    tanggal: '2026-09-24',
    materiLatihan: 'Simulasi Pertandingan & Taktik Power Play Babak Kedua',
    pembinaHadir: true,
    totalHadir: 26,
    totalIzin: 2,
    totalAlpa: 0,
    catatan: 'Kebugaran pemain prima, latihan diakhiri pendinginan stretching.',
  },
  {
    id: 'pr-eks-04',
    ekskulId: 'eks-06',
    ekskulNama: 'Basketball Warriors',
    tanggal: '2026-09-22',
    materiLatihan: 'Drill Three-Point Shooting & Box-Out Rebound Defense',
    pembinaHadir: true,
    totalHadir: 23,
    totalIzin: 1,
    totalAlpa: 1,
    catatan: 'Latihan fisik intensif, koordinasi transisi defense membaik.',
  },
  {
    id: 'pr-eks-05',
    ekskulId: 'eks-07',
    ekskulNama: 'English Debate & Speech Society',
    tanggal: '2026-09-23',
    materiLatihan: 'Motion: "This House Believes That AI in Education Enhances Critical Thinking"',
    pembinaHadir: true,
    totalHadir: 21,
    totalIzin: 1,
    totalAlpa: 0,
    catatan: 'Debat berjalan dinamis, argumentasi tim oposisi sangat terstruktur.',
  },
];

// Global cache
const globalEkskulStore = globalThis as unknown as {
  __DZITOE_EKSKUL__?: EkstrakurikulerRecord[];
  __DZITOE_ANGGOTA_EKSKUL__?: AnggotaEkskul[];
  __DZITOE_PRESENSI_EKSKUL__?: PresensiEkskul[];
};

if (!globalEkskulStore.__DZITOE_EKSKUL__) {
  globalEkskulStore.__DZITOE_EKSKUL__ = [...SEED_EKSKUL];
}
if (!globalEkskulStore.__DZITOE_ANGGOTA_EKSKUL__) {
  globalEkskulStore.__DZITOE_ANGGOTA_EKSKUL__ = [...SEED_ANGGOTA_EKSKUL];
}
if (!globalEkskulStore.__DZITOE_PRESENSI_EKSKUL__) {
  globalEkskulStore.__DZITOE_PRESENSI_EKSKUL__ = [...SEED_PRESENSI_EKSKUL];
}

function findMonorepoRoot(startDir: string, fs: any, path: any): string {
  let curr = path.resolve(startDir);
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(curr, 'pnpm-workspace.yaml'))) {
      return curr;
    }
    const parent = path.dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }
  return startDir;
}

function getFileIo() {
  try {
    if (
      typeof process !== 'undefined' &&
      process.release?.name === 'node' &&
      process.env.NEXT_RUNTIME !== 'edge'
    ) {
      // eslint-disable-next-line no-eval
      const nodeRequire = eval('require');
      const fs = nodeRequire('fs');
      const path = nodeRequire('path');
      const monorepoRoot = findMonorepoRoot(process.cwd(), fs, path);
      const dataDir = path.join(monorepoRoot, 'packages', 'db', 'data');
      const dataFileEkskul = path.join(dataDir, 'runtime-ekskul.json');
      const dataFileAnggota = path.join(dataDir, 'runtime-ekskul-anggota.json');
      const dataFilePresensi = path.join(dataDir, 'runtime-ekskul-presensi.json');
      return { fs, dataDir, dataFileEkskul, dataFileAnggota, dataFilePresensi };
    }
  } catch {
    // fallback
  }
  return null;
}

function ensureDataFiles(): void {
  const io = getFileIo();
  if (!io) return;
  try {
    if (!io.fs.existsSync(io.dataDir)) {
      io.fs.mkdirSync(io.dataDir, { recursive: true });
    }
    if (!io.fs.existsSync(io.dataFileEkskul)) {
      io.fs.writeFileSync(io.dataFileEkskul, JSON.stringify(SEED_EKSKUL, null, 2), 'utf-8');
    }
    if (!io.fs.existsSync(io.dataFileAnggota)) {
      io.fs.writeFileSync(io.dataFileAnggota, JSON.stringify(SEED_ANGGOTA_EKSKUL, null, 2), 'utf-8');
    }
    if (!io.fs.existsSync(io.dataFilePresensi)) {
      io.fs.writeFileSync(io.dataFilePresensi, JSON.stringify(SEED_PRESENSI_EKSKUL, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[EkskulStore] Could not write to data file, using in-memory only', err);
  }
}

export function getAllEkskul(): EkstrakurikulerRecord[] {
  ensureDataFiles();
  const io = getFileIo();
  if (io) {
    try {
      if (io.fs.existsSync(io.dataFileEkskul)) {
        const content = io.fs.readFileSync(io.dataFileEkskul, 'utf-8');
        const parsed = JSON.parse(content) as EkstrakurikulerRecord[];
        globalEkskulStore.__DZITOE_EKSKUL__ = parsed;
        return parsed;
      }
    } catch (err) {
      console.warn('[EkskulStore] Error reading data file', err);
    }
  }
  return globalEkskulStore.__DZITOE_EKSKUL__ || [...SEED_EKSKUL];
}

export function getAllAnggotaEkskul(ekskulId?: string): AnggotaEkskul[] {
  ensureDataFiles();
  const io = getFileIo();
  let items = globalEkskulStore.__DZITOE_ANGGOTA_EKSKUL__ || [...SEED_ANGGOTA_EKSKUL];
  if (io) {
    try {
      if (io.fs.existsSync(io.dataFileAnggota)) {
        const content = io.fs.readFileSync(io.dataFileAnggota, 'utf-8');
        items = JSON.parse(content) as AnggotaEkskul[];
        globalEkskulStore.__DZITOE_ANGGOTA_EKSKUL__ = items;
      }
    } catch (err) {
      console.warn('[EkskulStore] Error reading anggota data file', err);
    }
  }
  return ekskulId ? items.filter((a) => a.ekskulId === ekskulId) : items;
}

export function getAllPresensiEkskul(ekskulId?: string): PresensiEkskul[] {
  ensureDataFiles();
  const io = getFileIo();
  let items = globalEkskulStore.__DZITOE_PRESENSI_EKSKUL__ || [...SEED_PRESENSI_EKSKUL];
  if (io) {
    try {
      if (io.fs.existsSync(io.dataFilePresensi)) {
        const content = io.fs.readFileSync(io.dataFilePresensi, 'utf-8');
        items = JSON.parse(content) as PresensiEkskul[];
        globalEkskulStore.__DZITOE_PRESENSI_EKSKUL__ = items;
      }
    } catch (err) {
      console.warn('[EkskulStore] Error reading presensi data file', err);
    }
  }
  return ekskulId ? items.filter((p) => p.ekskulId === ekskulId) : items;
}

function persistEkskul(items: EkstrakurikulerRecord[]): void {
  globalEkskulStore.__DZITOE_EKSKUL__ = items;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFiles();
    io.fs.writeFileSync(io.dataFileEkskul, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[EkskulStore] Error persisting ekskul to file', err);
  }
}

function persistAnggota(items: AnggotaEkskul[]): void {
  globalEkskulStore.__DZITOE_ANGGOTA_EKSKUL__ = items;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFiles();
    io.fs.writeFileSync(io.dataFileAnggota, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[EkskulStore] Error persisting anggota to file', err);
  }
}

function persistPresensi(items: PresensiEkskul[]): void {
  globalEkskulStore.__DZITOE_PRESENSI_EKSKUL__ = items;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFiles();
    io.fs.writeFileSync(io.dataFilePresensi, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[EkskulStore] Error persisting presensi to file', err);
  }
}

export function createEkskul(input: Omit<EkstrakurikulerRecord, 'id' | 'jumlahAnggota'>): {
  success: boolean;
  ekskul?: EkstrakurikulerRecord;
  message: string;
} {
  const items = getAllEkskul();
  const newEkskul: EkstrakurikulerRecord = {
    ...input,
    id: `eks-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    jumlahAnggota: 0,
  };
  items.unshift(newEkskul);
  persistEkskul(items);
  return { success: true, ekskul: newEkskul, message: `Ekstrakurikuler "${newEkskul.nama}" berhasil didaftarkan!` };
}

export function updateEkskul(id: string, input: Partial<EkstrakurikulerRecord>): {
  success: boolean;
  ekskul?: EkstrakurikulerRecord;
  message: string;
} {
  const items = getAllEkskul();
  const idx = items.findIndex((e) => e.id === id);
  if (idx === -1) {
    return { success: false, message: 'Ekstrakurikuler tidak ditemukan.' };
  }
  const updated = { ...items[idx]!, ...input };
  items[idx] = updated;
  persistEkskul(items);
  return { success: true, ekskul: updated, message: `Ekstrakurikuler "${updated.nama}" berhasil diperbarui!` };
}

export function deleteEkskul(id: string): { success: boolean; message: string } {
  let items = getAllEkskul();
  const eks = items.find((e) => e.id === id);
  if (!eks) {
    return { success: false, message: 'Ekstrakurikuler tidak ditemukan.' };
  }
  items = items.filter((e) => e.id !== id);
  persistEkskul(items);
  return { success: true, message: `Ekstrakurikuler "${eks.nama}" telah berhasil dihapus.` };
}

export function addAnggotaEkskul(
  ekskulId: string,
  muridId: string,
  jabatan: AnggotaEkskul['jabatan'] = 'ANGGOTA'
): { success: boolean; anggota?: AnggotaEkskul; message: string } {
  const allEkskul = getAllEkskul();
  const eks = allEkskul.find((e) => e.id === ekskulId);
  if (!eks) return { success: false, message: 'Ekstrakurikuler tidak ditemukan.' };

  const student = SEED_STUDENTS.find((s) => s.id === muridId);
  if (!student) return { success: false, message: 'Data murid tidak ditemukan.' };

  const anggotaList = getAllAnggotaEkskul();
  const existing = anggotaList.find((a) => a.ekskulId === ekskulId && a.muridId === muridId);
  if (existing) {
    return { success: false, message: `Murid "${student.nama}" sudah terdaftar dalam ekstrakurikuler ini!` };
  }

  const newAnggota: AnggotaEkskul = {
    id: `ang-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    ekskulId,
    muridId: student.id,
    muridNama: student.nama,
    nisn: student.nisn,
    kelasNama: student.kelasNama,
    jabatan,
    tanggalBergabung: new Date().toISOString().split('T')[0] ?? '2026-09-28',
    status: 'AKTIF',
  };

  anggotaList.unshift(newAnggota);
  persistAnggota(anggotaList);

  // Update counter in ekskul
  eks.jumlahAnggota = anggotaList.filter((a) => a.ekskulId === ekskulId).length;
  persistEkskul(allEkskul);

  return {
    success: true,
    anggota: newAnggota,
    message: `${student.nama} (${student.kelasNama}) berhasil ditambahkan ke ${eks.nama}!`,
  };
}

export function removeAnggotaEkskul(id: string): { success: boolean; message: string } {
  let anggotaList = getAllAnggotaEkskul();
  const item = anggotaList.find((a) => a.id === id);
  if (!item) return { success: false, message: 'Data anggota tidak ditemukan.' };

  const ekskulId = item.ekskulId;
  anggotaList = anggotaList.filter((a) => a.id !== id);
  persistAnggota(anggotaList);

  // Update counter
  const allEkskul = getAllEkskul();
  const eks = allEkskul.find((e) => e.id === ekskulId);
  if (eks) {
    eks.jumlahAnggota = anggotaList.filter((a) => a.ekskulId === ekskulId).length;
    persistEkskul(allEkskul);
  }

  return { success: true, message: `Anggota ${item.muridNama} berhasil dikeluarkan dari ekstrakurikuler.` };
}

export function recordPresensiEkskul(input: Omit<PresensiEkskul, 'id'>): {
  success: boolean;
  presensi?: PresensiEkskul;
  message: string;
} {
  const list = getAllPresensiEkskul();
  const newRecord: PresensiEkskul = {
    ...input,
    id: `pr-eks-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
  };
  list.unshift(newRecord);
  persistPresensi(list);
  return {
    success: true,
    presensi: newRecord,
    message: `Presensi latihan ${newRecord.ekskulNama} tanggal ${newRecord.tanggal} berhasil disimpan!`,
  };
}
