export type StatusKehadiran = 'hadir' | 'terlambat' | 'izin' | 'sakit' | 'alpa';

export type KategoriPengumuman =
  | 'Akademik'
  | 'Disiplin Positif'
  | 'Asesmen'
  | 'Umum';

export type KehadiranHariIni = {
  status: StatusKehadiran;
  label: string;
  jamMasuk: string;
  metode: string;
  lokasi: string;
};

export type JadwalItem = {
  id: string;
  jamMulai: string;
  jamSelesai: string;
  mataFasilitasi: string;
  pendidik: string;
  ruang: string;
  warna: string;
};

export type Pengumuman = {
  id: string;
  judul: string;
  ringkas: string;
  waktu: string;
  kategori: KategoriPengumuman;
};

export type RiwayatKehadiran = {
  id: string;
  hari: string;
  tanggal: string;
  status: StatusKehadiran;
  jamMasuk: string | null;
  keterangan: string;
};

export type StatusTagihan = 'lunas' | 'belum-bayar' | 'menunggu-verifikasi';

export type Tagihan = {
  id: string;
  judul: string;
  periode: string;
  nominal: number;
  jatuhTempo: string;
  status: StatusTagihan;
};

export const PROFIL_MURID = {
  nama: 'Aisyah Nur Ramadhani',
  nisn: '0071234567',
  kelas: 'XII MIPA 3',
  waliKelas: 'Budi Santoso, S.Pd.',
  email: 'aisyah.nur@sman20.sch.id',
  telepon: '+62 812-3456-7890',
} as const;

export const KEHADIRAN_HARI_INI: KehadiranHariIni = {
  status: 'hadir',
  label: 'Hadir',
  jamMasuk: '06.45',
  metode: 'GPS + Swafoto',
  lokasi: 'SMAN 20 Kabupaten Tangerang',
};

export const JADWAL_HARI_INI: JadwalItem[] = [
  {
    id: 'jdw-1',
    jamMulai: '07.00',
    jamSelesai: '08.20',
    mataFasilitasi: 'Matematika Lanjut',
    pendidik: 'Ratna Wulandari, S.Pd.',
    ruang: 'Ruang XII-3',
    warna: 'bg-brand-500',
  },
  {
    id: 'jdw-2',
    jamMulai: '08.20',
    jamSelesai: '09.40',
    mataFasilitasi: 'Bahasa Indonesia',
    pendidik: 'Hendra Gunawan, M.Pd.',
    ruang: 'Ruang XII-3',
    warna: 'bg-sky-500',
  },
  {
    id: 'jdw-3',
    jamMulai: '09.55',
    jamSelesai: '11.15',
    mataFasilitasi: 'Fisika',
    pendidik: 'Sari Melati, S.Si.',
    ruang: 'Laboratorium IPA 1',
    warna: 'bg-violet-500',
  },
  {
    id: 'jdw-4',
    jamMulai: '11.15',
    jamSelesai: '12.35',
    mataFasilitasi: 'Sejarah Indonesia',
    pendidik: 'Agus Prakoso, S.Pd.',
    ruang: 'Ruang XII-3',
    warna: 'bg-amber-500',
  },
  {
    id: 'jdw-5',
    jamMulai: '13.15',
    jamSelesai: '14.35',
    mataFasilitasi: 'Biologi',
    pendidik: 'Nurul Hidayah, M.Si.',
    ruang: 'Laboratorium Biologi',
    warna: 'bg-rose-500',
  },
];

export const PENGUMUMAN: Pengumuman[] = [
  {
    id: 'png-1',
    judul: 'Jadwal Asesmen Sumatif Akhir Semester',
    ringkas:
      'Asesmen sumatif dilaksanakan pekan depan. Murid wajib memeriksa jadwal dan ruang asesmen masing-masing.',
    waktu: '2 jam lalu',
    kategori: 'Asesmen',
  },
  {
    id: 'png-2',
    judul: 'Apresiasi Disiplin Positif Pekan Ini',
    ringkas:
      'Selamat kepada Murid penerima poin Disiplin Positif atas keteladanan menjaga budaya sekolah aman dan nyaman.',
    waktu: 'Kemarin',
    kategori: 'Disiplin Positif',
  },
  {
    id: 'png-3',
    judul: 'Pameran Pengalaman Belajar & Kreativitas Murid',
    ringkas:
      'Pameran karya fasilitasi belajar dibuka untuk seluruh Murid dan Orang Tua SMAN 20 Kabupaten Tangerang.',
    waktu: '3 hari lalu',
    kategori: 'Umum',
  },
];

export const RIWAYAT_KEHADIRAN: RiwayatKehadiran[] = [
  {
    id: 'rwt-1',
    hari: 'Hari ini',
    tanggal: '27 September 2026',
    status: 'hadir',
    jamMasuk: '06.45',
    keterangan: 'GPS + Swafoto',
  },
  {
    id: 'rwt-2',
    hari: 'Kemarin',
    tanggal: '26 September 2026',
    status: 'hadir',
    jamMasuk: '06.50',
    keterangan: 'GPS + Swafoto',
  },
  {
    id: 'rwt-3',
    hari: '3 hari lalu',
    tanggal: '24 September 2026',
    status: 'terlambat',
    jamMasuk: '07.12',
    keterangan: 'Terlambat 12 menit',
  },
  {
    id: 'rwt-4',
    hari: '4 hari lalu',
    tanggal: '23 September 2026',
    status: 'izin',
    jamMasuk: null,
    keterangan: 'Izin kegiatan kompetisi sains',
  },
  {
    id: 'rwt-5',
    hari: '5 hari lalu',
    tanggal: '22 September 2026',
    status: 'hadir',
    jamMasuk: '06.38',
    keterangan: 'GPS + Swafoto',
  },
];

export const DAFTAR_TAGIHAN: Tagihan[] = [
  {
    id: 'tgh-1',
    judul: 'Iuran Komite Bulan Ini',
    periode: 'September 2026',
    nominal: 150000,
    jatuhTempo: '20 Oktober 2026',
    status: 'belum-bayar',
  },
  {
    id: 'tgh-2',
    judul: 'Kegiatan Pembelajaran Lapangan',
    periode: 'Semester Ganjil',
    nominal: 250000,
    jatuhTempo: '15 Oktober 2026',
    status: 'menunggu-verifikasi',
  },
  {
    id: 'tgh-3',
    judul: 'Iuran Komite Bulan Lalu',
    periode: 'Agustus 2026',
    nominal: 150000,
    jatuhTempo: '20 September 2026',
    status: 'lunas',
  },
];

export interface CapaianKompetensi {
  id: string;
  mataPelajaran: string;
  kodeFase: string;
  persentase: number;
  taraf: 'Tinggi' | 'Optimal' | 'Perlu Pendampingan';
  materiPokok: string;
}

export const CAPAIAN_KOMPETENSI_LIST: CapaianKompetensi[] = [
  {
    id: 'ck-1',
    mataPelajaran: 'Matematika Lanjut (Fase F)',
    kodeFase: 'MAT-F.12',
    persentase: 88,
    taraf: 'Optimal',
    materiPokok: 'Kalkulus Diferensial & Integral Sederhana',
  },
  {
    id: 'ck-2',
    mataPelajaran: 'Fisika (Fase F)',
    kodeFase: 'FIS-F.12',
    persentase: 92,
    taraf: 'Tinggi',
    materiPokok: 'Gelombang Elektromagnetik & Termodinamika',
  },
  {
    id: 'ck-3',
    mataPelajaran: 'Bahasa Indonesia (Fase F)',
    kodeFase: 'BIN-F.12',
    persentase: 85,
    taraf: 'Optimal',
    materiPokok: 'Karya Ilmiah & Argumentasi Kritis',
  },
  {
    id: 'ck-4',
    mataPelajaran: 'Kimia Analitik',
    kodeFase: 'KIM-F.12',
    persentase: 79,
    taraf: 'Optimal',
    materiPokok: 'Kesetimbangan Larutan & Stoikiometri',
  },
];

export interface TugasAsesmen {
  id: string;
  judul: string;
  mataPelajaran: string;
  tenggat: string;
  tipe: 'Formatif' | 'Sumatif' | 'Portofolio';
  sudahKumpul: boolean;
  nilai?: number;
}

export const TUGAS_ASESMEN_LIST: TugasAsesmen[] = [
  {
    id: 'tgs-1',
    judul: 'Eksperimen Resonansi Bunyi Tabung',
    mataPelajaran: 'Fisika',
    tenggat: 'Besok, 23.59 WIB',
    tipe: 'Formatif',
    sudahKumpul: false,
  },
  {
    id: 'tgs-2',
    judul: 'Kajian Kritis Berita Hoaks & Fakta',
    mataPelajaran: 'Bahasa Indonesia',
    tenggat: '30 Sep 2026',
    tipe: 'Portofolio',
    sudahKumpul: true,
    nilai: 92,
  },
  {
    id: 'tgs-3',
    judul: 'Asesmen Sumatif Bab Turunan Trigonometri',
    mataPelajaran: 'Matematika Lanjut',
    tenggat: '02 Okt 2026',
    tipe: 'Sumatif',
    sudahKumpul: false,
  },
];

export interface DisiplinPositifItem {
  id: string;
  tanggal: string;
  tipe: 'apresiasi' | 'kesepakatan';
  kategori: string;
  deskripsi: string;
  poin: number;
}

export const DISIPLIN_POSITIF_FEED: DisiplinPositifItem[] = [
  {
    id: 'dp-1',
    tanggal: 'Kemarin',
    tipe: 'apresiasi',
    kategori: 'Bernalar Kritis & Berbagi',
    deskripsi: 'Menjadi fasilitator tutor sebaya pada sesi diskusi Fisika',
    poin: 15,
  },
  {
    id: 'dp-2',
    tanggal: '3 hari lalu',
    tipe: 'apresiasi',
    kategori: 'Kepedulian Lingkungan',
    deskripsi: 'Inisiatif memimpin pemilahan sampah organik kelas XII MIPA 3',
    poin: 10,
  },
  {
    id: 'dp-3',
    tanggal: '18 Sep 2026',
    tipe: 'kesepakatan',
    kategori: 'Refleksi Diri (Restitusi)',
    deskripsi: 'Menyepakati solusi penggantian waktu belajar akibat keterlambatan 10 menit',
    poin: 0,
  },
];

