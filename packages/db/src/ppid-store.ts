// ==============================================================================
// DZITOE — PPID & Public Information Disclosure Store (@dzitoe/db)
// SMAN 20 Kabupaten Tangerang
// Module A25: Portal Keterbukaan Informasi Publik (UU No. 14 Tahun 2008 Compliant)
// ==============================================================================

export type KategoriInformasi =
  | 'BERKALA'      // Profil sekolah, kalender, program kerja tahunan, LKjIP, anggaran BOS/BOP
  | 'SERTA_MERTA'  // Bencana, darurat kesehatan, libur mendadak, pengumuman darurat
  | 'SETIAP_SAAT'  // SOP pelayanan, daftar tenaga pendidik, kurikulum, pedoman PPDB
  | 'DIKECUALIKAN'; // Data pribadi siswa, rahasia jabatan, soal ujian aktif

export type KategoriPemohon =
  | 'PERORANGAN'
  | 'LEMBAGA_LSM'
  | 'MEDIA_PERS'
  | 'MAHASISWA_PENELITI'
  | 'ORANG_TUA';

export type CaraMemperoleh =
  | 'SALINAN_DIGITAL'
  | 'SALINAN_CETAK'
  | 'MELIHAT_LANGSUNG';

export type StatusPermohonan =
  | 'PENDING'
  | 'DIPROSES'
  | 'DISETUJUI'
  | 'DITOLAK';

export interface DokumenPublikRecord {
  id: string;
  nomorDokumen: string;
  judul: string;
  kategori: KategoriInformasi;
  deskripsi: string;
  pejabatPengesah: string;
  tanggalPublikasi: string;
  tahunAnggaran?: number | null;
  fileUrl: string;
  fileSize: string;
  fileType: string;
  downloadCount: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PermohonanInformasiRecord {
  id: string;
  nomorTiket: string;
  namaPemohon: string;
  nik: string;
  kategoriPemohon: KategoriPemohon;
  kontak: string;
  email: string;
  alamat: string;
  rincianInformasi: string;
  tujuanPenggunaan: string;
  caraMemperoleh: CaraMemperoleh;
  status: StatusPermohonan;
  catatanPetugas?: string | null;
  dokumenJawabanUrl?: string | null;
  tanggalPengajuan: string;
  tanggalSelesai?: string | null;
  petugasPenerima?: string | null;
  createdAt: string;
  updatedAt: string;
}

const INITIAL_DOKUMEN: DokumenPublikRecord[] = [
  {
    id: 'doc-ppid-2026-001',
    nomorDokumen: '421.3/014/SMAN20/PPID/2026',
    judul: 'Rencana Kerja dan Anggaran Sekolah (RKAS) BOS Reguler & BOP Provinsi 2026',
    kategori: 'BERKALA',
    deskripsi: 'Alokasi rincian transparansi penerimaan dan belanja operasional satuan pendidikan SMAN 20 Kabupaten Tangerang Tahun Anggaran 2026.',
    pejabatPengesah: 'Kepala SMAN 20 Kab. Tangerang',
    tanggalPublikasi: '2026-01-15T08:00:00.000Z',
    tahunAnggaran: 2026,
    fileUrl: '/documents/ppid/rkas-sman20-2026.pdf',
    fileSize: '3.4 MB',
    fileType: 'PDF',
    downloadCount: 142,
    isPublic: true,
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'doc-ppid-2026-002',
    nomorDokumen: '421.3/089/SMAN20/PPID/2026',
    judul: 'Laporan Akuntabilitas Kinerja Instansi Pemerintah (LKjIP) SMAN 20 Tangerang',
    kategori: 'BERKALA',
    deskripsi: 'Capaian indikator kinerja utama, prestasi akademik, angka kelulusan, dan tata kelola sarana prasarana sekolah.',
    pejabatPengesah: 'Tim Pengembang Kurikulum & Tata Kelola',
    tanggalPublikasi: '2026-02-10T09:30:00.000Z',
    tahunAnggaran: 2025,
    fileUrl: '/documents/ppid/lkjip-sman20-2025.pdf',
    fileSize: '5.1 MB',
    fileType: 'PDF',
    downloadCount: 88,
    isPublic: true,
    createdAt: '2026-02-10T09:30:00.000Z',
    updatedAt: '2026-02-10T09:30:00.000Z',
  },
  {
    id: 'doc-ppid-2026-003',
    nomorDokumen: '421.3/210/SMAN20/PPID/2026',
    judul: 'Standar Operasional Prosedur (SOP) Penerimaan Peserta Didik Baru (PPDB) 2026',
    kategori: 'SETIAP_SAAT',
    deskripsi: 'Panduan tata cara pendaftaran, kuota zonasi, jalur prestasi, jalur afirmasi, dan mekanisme verifikasi berkas PPDB.',
    pejabatPengesah: 'Ketua Panitia PPDB 2026',
    tanggalPublikasi: '2026-05-02T10:00:00.000Z',
    tahunAnggaran: 2026,
    fileUrl: '/documents/ppid/sop-ppdb-2026.pdf',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    downloadCount: 375,
    isPublic: true,
    createdAt: '2026-05-02T10:00:00.000Z',
    updatedAt: '2026-05-02T10:00:00.000Z',
  },
  {
    id: 'doc-ppid-2026-004',
    nomorDokumen: '421.3/102/SMAN20/PPID/2026',
    judul: 'Surat Edaran Protokol Tanggap Cuaca Ekstrem & Kesiapsiagaan Bencana Pesisir',
    kategori: 'SERTA_MERTA',
    deskripsi: 'Instruksi keselamatan peserta didik dan pendidik terkait mitigasi banjir rob dan angin kencang di wilayah pesisir Pakuhaji.',
    pejabatPengesah: 'Kepala Sekolah & Tim Siaga Bencana',
    tanggalPublikasi: '2026-03-01T07:00:00.000Z',
    tahunAnggaran: 2026,
    fileUrl: '/documents/ppid/edaran-siaga-bencana-2026.pdf',
    fileSize: '850 KB',
    fileType: 'PDF',
    downloadCount: 219,
    isPublic: true,
    createdAt: '2026-03-01T07:00:00.000Z',
    updatedAt: '2026-03-01T07:00:00.000Z',
  },
  {
    id: 'doc-ppid-2026-005',
    nomorDokumen: '421.3/005/SMAN20/PPID/2026',
    judul: 'Daftar Informasi yang Dikecualikan (DIK) SMAN 20 Kabupaten Tangerang',
    kategori: 'DIKECUALIKAN',
    deskripsi: 'Klasifikasi informasi yang dirahasiakan berdasar uji konsekuensi Pasal 17 UU No. 14 Tahun 2008 (data rekam medis, NIK, dan naskah rahasia ujian).',
    pejabatPengesah: 'Pejabat Pengelola Informasi & Dokumentasi (PPID)',
    tanggalPublikasi: '2026-01-08T08:00:00.000Z',
    tahunAnggaran: 2026,
    fileUrl: '/documents/ppid/daftar-informasi-dikecualikan-2026.pdf',
    fileSize: '1.2 MB',
    fileType: 'PDF',
    downloadCount: 45,
    isPublic: true,
    createdAt: '2026-01-08T08:00:00.000Z',
    updatedAt: '2026-01-08T08:00:00.000Z',
  },
];

const INITIAL_PERMOHONAN: PermohonanInformasiRecord[] = [
  {
    id: 'req-ppid-2026-001',
    nomorTiket: 'REG-PPID-2026-001',
    namaPemohon: 'Bambang Sudarsono, S.Pd.',
    nik: '3603120405850001',
    kategoriPemohon: 'MAHASISWA_PENELITI',
    kontak: '081298765431',
    email: 'bambang.sudarsono@student.unj.ac.id',
    alamat: 'Jl. Raya Pakuhaji No. 45, Sukawali, Tangerang',
    rincianInformasi: 'Data statistik rasio guru bersertifikasi pendidik dan kualifikasi akademik tahun ajaran 2024-2026 untuk keperluan tesis magister manajemen pendidikan.',
    tujuanPenggunaan: 'Penyusunan Tesis Pascasarjana UNJ',
    caraMemperoleh: 'SALINAN_DIGITAL',
    status: 'DISETUJUI',
    catatanPetugas: 'Permohonan memenuhi syarat. Berkas rekapitulasi data profil guru terlampir dikirim via email dan portal.',
    dokumenJawabanUrl: '/documents/ppid/jawaban/jawaban-reg-ppid-2026-001.pdf',
    tanggalPengajuan: '2026-09-10T09:15:00.000Z',
    tanggalSelesai: '2026-09-12T14:00:00.000Z',
    petugasPenerima: 'Hj. Siti Rohmah, S.Sos (Petugas PPID)',
    createdAt: '2026-09-10T09:15:00.000Z',
    updatedAt: '2026-09-12T14:00:00.000Z',
  },
  {
    id: 'req-ppid-2026-002',
    nomorTiket: 'REG-PPID-2026-002',
    namaPemohon: 'Lembaga Pemantau Kebijakan Publik Banten (LPKP)',
    nik: '3603181203770002',
    kategoriPemohon: 'LEMBAGA_LSM',
    kontak: '085711223344',
    email: 'sekretariat@lpkp-banten.org',
    alamat: 'Ruko Modernland Blok C-12, Tangerang',
    rincianInformasi: 'Salinan Berita Acara Serah Terima (BAST) Pengadaan Perangkat Laboratorium Komputer Digital Tahun Anggaran 2025.',
    tujuanPenggunaan: 'Kajian Akuntabilitas Publik Sarana Prasarana Sekolah',
    caraMemperoleh: 'SALINAN_DIGITAL',
    status: 'DIPROSES',
    catatanPetugas: 'Sedang diverifikasi oleh Pejabat Pembuat Komitmen (PPK) dan Tim Sarpras.',
    dokumenJawabanUrl: null,
    tanggalPengajuan: '2026-09-28T11:00:00.000Z',
    tanggalSelesai: null,
    petugasPenerima: 'Hj. Siti Rohmah, S.Sos (Petugas PPID)',
    createdAt: '2026-09-28T11:00:00.000Z',
    updatedAt: '2026-09-29T10:00:00.000Z',
  },
  {
    id: 'req-ppid-2026-003',
    nomorTiket: 'REG-PPID-2026-003',
    namaPemohon: 'Drs. Supriyanto (Wali Murid)',
    nik: '3603121508700003',
    kategoriPemohon: 'ORANG_TUA',
    kontak: '081388990011',
    email: 'supriyanto.wali@gmail.com',
    alamat: 'Perumahan Grand Sepatan Residence Blok E5, Tangerang',
    rincianInformasi: 'Informasi rincian pemanfaatan dana sumbangan sukarela Komite Sekolah untuk renovasi musholla sekolah.',
    tujuanPenggunaan: 'Transparansi Wali Murid',
    caraMemperoleh: 'SALINAN_CETAK',
    status: 'PENDING',
    catatanPetugas: 'Menunggu konfirmasi jadwal pertemuan koordinasi dengan Pengurus Komite Sekolah.',
    dokumenJawabanUrl: null,
    tanggalPengajuan: '2026-10-02T13:45:00.000Z',
    tanggalSelesai: null,
    petugasPenerima: 'Staf Tata Usaha PPID',
    createdAt: '2026-10-02T13:45:00.000Z',
    updatedAt: '2026-10-02T13:45:00.000Z',
  },
];

const globalStore = globalThis as unknown as {
  __DZITOE_PPID_DOCS__?: DokumenPublikRecord[];
  __DZITOE_PPID_REQS__?: PermohonanInformasiRecord[];
};

if (!globalStore.__DZITOE_PPID_DOCS__) {
  globalStore.__DZITOE_PPID_DOCS__ = [...INITIAL_DOKUMEN];
}

if (!globalStore.__DZITOE_PPID_REQS__) {
  globalStore.__DZITOE_PPID_REQS__ = [...INITIAL_PERMOHONAN];
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
      const docsFile = path.join(dataDir, 'runtime-ppid-docs.json');
      const reqsFile = path.join(dataDir, 'runtime-ppid-reqs.json');
      return { fs, dataDir, docsFile, reqsFile };
    }
  } catch {
    // Browser or edge runtime fallback
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
    if (!io.fs.existsSync(io.docsFile)) {
      io.fs.writeFileSync(io.docsFile, JSON.stringify(INITIAL_DOKUMEN, null, 2), 'utf-8');
    }
    if (!io.fs.existsSync(io.reqsFile)) {
      io.fs.writeFileSync(io.reqsFile, JSON.stringify(INITIAL_PERMOHONAN, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[PPIDStore] Error ensuring data files', err);
  }
}

// ========================
// 1. DOKUMEN PUBLIK CRUD
// ========================

export function getAllDokumenPublik(): DokumenPublikRecord[] {
  ensureDataFiles();
  const io = getFileIo();
  let list = globalStore.__DZITOE_PPID_DOCS__ || [...INITIAL_DOKUMEN];

  if (io) {
    try {
      if (io.fs.existsSync(io.docsFile)) {
        const content = io.fs.readFileSync(io.docsFile, 'utf-8');
        const parsed = JSON.parse(content) as DokumenPublikRecord[];
        globalStore.__DZITOE_PPID_DOCS__ = parsed;
        list = parsed;
      }
    } catch (err) {
      console.warn('[PPIDStore] Error reading docs data file', err);
    }
  }

  return list;
}

function persistDokumen(data: DokumenPublikRecord[]): void {
  globalStore.__DZITOE_PPID_DOCS__ = data;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFiles();
    io.fs.writeFileSync(io.docsFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[PPIDStore] Error persisting docs data file', err);
  }
}

export function getDokumenById(id: string): DokumenPublikRecord | undefined {
  const all = getAllDokumenPublik();
  return all.find((d) => d.id === id || d.nomorDokumen === id);
}

export function createDokumenPublik(
  input: Omit<DokumenPublikRecord, 'id' | 'createdAt' | 'updatedAt' | 'downloadCount'>
): DokumenPublikRecord {
  const all = getAllDokumenPublik();
  const now = new Date().toISOString();
  const id = `doc-ppid-${Date.now()}`;

  const newDoc: DokumenPublikRecord = {
    ...input,
    id,
    downloadCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [newDoc, ...all];
  persistDokumen(updated);
  return newDoc;
}

export function updateDokumenPublik(
  id: string,
  updates: Partial<Omit<DokumenPublikRecord, 'id' | 'createdAt'>>
): DokumenPublikRecord | null {
  const all = getAllDokumenPublik();
  const index = all.findIndex((d) => d.id === id || d.nomorDokumen === id);
  if (index === -1) return null;

  const current = all[index]!;
  const updatedDoc: DokumenPublikRecord = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  all[index] = updatedDoc;
  persistDokumen(all);
  return updatedDoc;
}

export function deleteDokumenPublik(id: string): boolean {
  const all = getAllDokumenPublik();
  const filtered = all.filter((d) => d.id !== id && d.nomorDokumen !== id);
  if (filtered.length === all.length) return false;
  persistDokumen(filtered);
  return true;
}

export function incrementDownloadCount(id: string): number {
  const all = getAllDokumenPublik();
  const doc = all.find((d) => d.id === id || d.nomorDokumen === id);
  if (!doc) return 0;
  doc.downloadCount = (doc.downloadCount || 0) + 1;
  persistDokumen(all);
  return doc.downloadCount;
}

// ===================================
// 2. PERMOHONAN INFORMASI DARING CRUD
// ===================================

export function getAllPermohonan(): PermohonanInformasiRecord[] {
  ensureDataFiles();
  const io = getFileIo();
  let list = globalStore.__DZITOE_PPID_REQS__ || [...INITIAL_PERMOHONAN];

  if (io) {
    try {
      if (io.fs.existsSync(io.reqsFile)) {
        const content = io.fs.readFileSync(io.reqsFile, 'utf-8');
        const parsed = JSON.parse(content) as PermohonanInformasiRecord[];
        globalStore.__DZITOE_PPID_REQS__ = parsed;
        list = parsed;
      }
    } catch (err) {
      console.warn('[PPIDStore] Error reading reqs data file', err);
    }
  }

  return list;
}

function persistPermohonan(data: PermohonanInformasiRecord[]): void {
  globalStore.__DZITOE_PPID_REQS__ = data;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFiles();
    io.fs.writeFileSync(io.reqsFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[PPIDStore] Error persisting reqs data file', err);
  }
}

export function getPermohonanByIdOrTicket(query: string): PermohonanInformasiRecord | undefined {
  const all = getAllPermohonan();
  const q = query.trim().toUpperCase();
  return all.find((r) => r.id === query || r.nomorTiket.toUpperCase() === q);
}

export function createPermohonan(
  input: Omit<PermohonanInformasiRecord, 'id' | 'nomorTiket' | 'status' | 'tanggalPengajuan' | 'createdAt' | 'updatedAt'>
): PermohonanInformasiRecord {
  const all = getAllPermohonan();
  const now = new Date();
  const year = now.getFullYear();
  const nextSeq = String(all.length + 1).padStart(3, '0');
  const nomorTiket = `REG-PPID-${year}-${nextSeq}`;
  const id = `req-ppid-${Date.now()}`;

  const newReq: PermohonanInformasiRecord = {
    ...input,
    id,
    nomorTiket,
    status: 'PENDING',
    tanggalPengajuan: now.toISOString(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  const updated = [newReq, ...all];
  persistPermohonan(updated);
  return newReq;
}

export function updatePermohonan(
  id: string,
  updates: Partial<Omit<PermohonanInformasiRecord, 'id' | 'nomorTiket' | 'createdAt'>>
): PermohonanInformasiRecord | null {
  const all = getAllPermohonan();
  const index = all.findIndex((r) => r.id === id || r.nomorTiket === id);
  if (index === -1) return null;

  const current = all[index]!;
  const updatedReq: PermohonanInformasiRecord = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // If status changed to DISETUJUI or DITOLAK and tanggalSelesai is not set, set it now
  if (
    (updates.status === 'DISETUJUI' || updates.status === 'DITOLAK') &&
    !updatedReq.tanggalSelesai
  ) {
    updatedReq.tanggalSelesai = new Date().toISOString();
  }

  all[index] = updatedReq;
  persistPermohonan(all);
  return updatedReq;
}

export function deletePermohonan(id: string): boolean {
  const all = getAllPermohonan();
  const filtered = all.filter((r) => r.id !== id && r.nomorTiket !== id);
  if (filtered.length === all.length) return false;
  persistPermohonan(filtered);
  return true;
}

// ========================
// 3. STATISTIK & REKAP PPID
// ========================

export function getPPIDStats() {
  const docs = getAllDokumenPublik();
  const reqs = getAllPermohonan();

  const totalDokumen = docs.length;
  let totalDownload = 0;
  const docsPerKategori: Record<KategoriInformasi, number> = {
    BERKALA: 0,
    SERTA_MERTA: 0,
    SETIAP_SAAT: 0,
    DIKECUALIKAN: 0,
  };

  for (const d of docs) {
    totalDownload += d.downloadCount || 0;
    if (docsPerKategori[d.kategori] !== undefined) {
      docsPerKategori[d.kategori]++;
    }
  }

  const totalPermohonan = reqs.length;
  const reqsPerStatus: Record<StatusPermohonan, number> = {
    PENDING: 0,
    DIPROSES: 0,
    DISETUJUI: 0,
    DITOLAK: 0,
  };

  for (const r of reqs) {
    if (reqsPerStatus[r.status] !== undefined) {
      reqsPerStatus[r.status]++;
    }
  }

  const persentaseTerselesaikan = totalPermohonan > 0
    ? Math.round(((reqsPerStatus.DISETUJUI + reqsPerStatus.DITOLAK) / totalPermohonan) * 100)
    : 100;

  return {
    totalDokumen,
    totalDownload,
    docsPerKategori,
    totalPermohonan,
    reqsPerStatus,
    persentaseTerselesaikan,
  };
}
