// ==============================================================================
// DZITOE — Finance Store & Annual Aggregation (@dzitoe/db)
// Standar Pelaporan Keuangan Sekolah (BOS, SPP/Komite, dan Inspektorat Pengawas)
// Modul A28: Laporan Keuangan Terpadu Tahunan SMAN 20 Kabupaten Tangerang
// ==============================================================================

export type KategoriPos = 'SPP_KOMITE' | 'BOS_REGULER' | 'BOS_KINERJA' | 'SARPRAS' | 'KEGIATAN_SISWA' | 'GAJI_HONOR' | 'OPERASIONAL_KANTOR';
export type TipeTransaksi = 'MASUK' | 'KELUAR';

export interface PosAnggaran {
  id: string;
  kode: string;
  nama: string;
  kategori: KategoriPos;
  targetWajib: number; // Anggaran tahunan
  realisasi: number;   // Terbayar / Terealisasi
  sisa: number;        // Sisa / Tunggakan
  persentase: number;
}

export interface TransaksiKas {
  id: string;
  tanggal: string; // YYYY-MM-DD
  nomorBukti: string;
  posId: string;
  posNama: string;
  tipe: TipeTransaksi;
  sumberDana: 'BOS' | 'KOMITE' | 'MANDIRI';
  uraian: string;
  nominal: number;
  keterangan?: string;
  pj: string;
}

export interface RekapKeuanganTahunan {
  tahunAjaran: string; // "2025/2026"
  tanggalRekap: string;
  totalPenerimaan: number;
  totalRealisasi: number;
  totalTunggakan: number;
  persenRealisasi: number;
  posPenerimaan: PosAnggaran[];
  posPengeluaran: PosAnggaran[];
  arusKasBulanan: {
    bulan: string; // "2025-07", dll
    namaBulan: string;
    masuk: number;
    keluar: number;
    saldo: number;
  }[];
  komiteVsBos: {
    bos: { masuk: number; keluar: number; saldo: number };
    komite: { masuk: number; keluar: number; saldo: number };
  };
  rekapTunggakanPerTingkat: {
    tingkat: 'X' | 'XI' | 'XII';
    siswaMenunggak: number;
    totalNominal: number;
  }[];
}

export const INITIAL_POS_PENERIMAAN: PosAnggaran[] = [
  {
    id: 'pos-in-01',
    kode: '4.1.01',
    nama: 'Iuran Komite & Sumbangan Pendidikan (SPP)',
    kategori: 'SPP_KOMITE',
    targetWajib: 1080000000,
    realisasi: 972000000,
    sisa: 108000000,
    persentase: 90.0,
  },
  {
    id: 'pos-in-02',
    kode: '4.2.01',
    nama: 'Dana BOS Reguler Kemendikdasmen (30 Rombel)',
    kategori: 'BOS_REGULER',
    targetWajib: 1650000000,
    realisasi: 1650000000,
    sisa: 0,
    persentase: 100.0,
  },
  {
    id: 'pos-in-03',
    kode: '4.2.02',
    nama: 'Dana BOS Kinerja Prestasi Siswa Provinsi Banten',
    kategori: 'BOS_KINERJA',
    targetWajib: 150000000,
    realisasi: 150000000,
    sisa: 0,
    persentase: 100.0,
  },
  {
    id: 'pos-in-04',
    kode: '4.3.01',
    nama: 'Sumbangan Sarana Belajar & Digitalisasi Sekolah',
    kategori: 'SARPRAS',
    targetWajib: 240000000,
    realisasi: 216000000,
    sisa: 24000000,
    persentase: 90.0,
  },
];

export const INITIAL_POS_PENGELUARAN: PosAnggaran[] = [
  {
    id: 'pos-out-01',
    kode: '5.1.01',
    nama: 'Belanja Honorarium Guru GTT & Tenaga Kependidikan',
    kategori: 'GAJI_HONOR',
    targetWajib: 840000000,
    realisasi: 770000000,
    sisa: 70000000,
    persentase: 91.6,
  },
  {
    id: 'pos-out-02',
    kode: '5.2.01',
    nama: 'Pengembangan Sarana, Perawatan Gedung & Lab Komputer',
    kategori: 'SARPRAS',
    targetWajib: 680000000,
    realisasi: 650000000,
    sisa: 30000000,
    persentase: 95.6,
  },
  {
    id: 'pos-out-03',
    kode: '5.3.01',
    nama: 'Kegiatan Pembelajaran, OSIS, Ekskul & Asesmen Ujian',
    kategori: 'KEGIATAN_SISWA',
    targetWajib: 750000000,
    realisasi: 710000000,
    sisa: 40000000,
    persentase: 94.7,
  },
  {
    id: 'pos-out-04',
    kode: '5.4.01',
    nama: 'Langganan Daya, Internet FO, Kebersihan & ATK Kantor',
    kategori: 'OPERASIONAL_KANTOR',
    targetWajib: 420000000,
    realisasi: 395000000,
    sisa: 25000000,
    persentase: 94.0,
  },
];

export const INITIAL_TRANSAKSI_KAS: TransaksiKas[] = [
  {
    id: 'trx-001',
    tanggal: '2026-01-10',
    nomorBukti: 'BKM/BOS/01/2026',
    posId: 'pos-in-02',
    posNama: 'Dana BOS Reguler Tahap I',
    tipe: 'MASUK',
    sumberDana: 'BOS',
    uraian: 'Penerimaan Penyaluran Dana BOS Reguler Tahap 1 T.A 2025/2026',
    nominal: 825000000,
    pj: 'Bendahara BOS (Dra. Nurhayati)',
  },
  {
    id: 'trx-002',
    tanggal: '2026-01-15',
    nomorBukti: 'BKK/BOS/01/2026',
    posId: 'pos-out-04',
    posNama: 'Operasional Jaringan & Server Ujian',
    tipe: 'KELUAR',
    sumberDana: 'BOS',
    uraian: 'Pembayaran langganan internet FO 1Gbps & server backup ujian semester',
    nominal: 35000000,
    pj: 'Tim IT SMAN 20',
  },
  {
    id: 'trx-003',
    tanggal: '2026-02-05',
    nomorBukti: 'BKM/KOM/02/2026',
    posId: 'pos-in-01',
    posNama: 'Penerimaan Sumbangan Komite',
    tipe: 'MASUK',
    sumberDana: 'KOMITE',
    uraian: 'Rekapitulasi penerimaan iuran komite sekolah bulan Februari 2026',
    nominal: 92000000,
    pj: 'Bendahara Komite Sekolah',
  },
  {
    id: 'trx-004',
    tanggal: '2026-02-18',
    nomorBukti: 'BKK/KOM/02/2026',
    posId: 'pos-out-03',
    posNama: 'Kegiatan Lomba & Ekskul Siswa',
    tipe: 'KELUAR',
    sumberDana: 'KOMITE',
    uraian: 'Akomodasi delegasi O2SN dan FLS2N Tingkat Provinsi Banten',
    nominal: 28500000,
    pj: 'Waka Kesiswaan',
  },
  {
    id: 'trx-005',
    tanggal: '2026-03-02',
    nomorBukti: 'BKM/BOS/03/2026',
    posId: 'pos-in-03',
    posNama: 'Dana BOS Kinerja',
    tipe: 'MASUK',
    sumberDana: 'BOS',
    uraian: 'Penerimaan BOS Kinerja Sekolah Berprestasi Kabupaten Tangerang',
    nominal: 150000000,
    pj: 'Bendahara BOS',
  },
  {
    id: 'trx-006',
    tanggal: '2026-03-15',
    nomorBukti: 'BKK/BOS/03/2026',
    posId: 'pos-out-01',
    posNama: 'Honorarium GTT & Tendik Maret',
    tipe: 'KELUAR',
    sumberDana: 'BOS',
    uraian: 'Pencairan honorarium guru non-ASN & staf penunjang bulan Maret 2026',
    nominal: 72000000,
    pj: 'Bendahara Pengeluaran',
  },
];

interface StoredFinance {
  posPenerimaan: PosAnggaran[];
  posPengeluaran: PosAnggaran[];
  transaksi: TransaksiKas[];
}

const globalStore = globalThis as unknown as {
  __DZITOE_FINANCE__?: StoredFinance;
};

if (!globalStore.__DZITOE_FINANCE__) {
  globalStore.__DZITOE_FINANCE__ = {
    posPenerimaan: [...INITIAL_POS_PENERIMAAN],
    posPengeluaran: [...INITIAL_POS_PENGELUARAN],
    transaksi: [...INITIAL_TRANSAKSI_KAS],
  };
}

function loadFinanceData(): StoredFinance {
  if (!globalStore.__DZITOE_FINANCE__) {
    globalStore.__DZITOE_FINANCE__ = {
      posPenerimaan: [...INITIAL_POS_PENERIMAAN],
      posPengeluaran: [...INITIAL_POS_PENGELUARAN],
      transaksi: [...INITIAL_TRANSAKSI_KAS],
    };
  }
  return globalStore.__DZITOE_FINANCE__;
}

function saveFinanceData(data: StoredFinance) {
  globalStore.__DZITOE_FINANCE__ = data;
}

export function getAllFinanceData(): StoredFinance {
  return loadFinanceData();
}

export function addTransaksiKas(tx: Omit<TransaksiKas, 'id'>): TransaksiKas {
  const store = loadFinanceData();
  const newTx: TransaksiKas = {
    ...tx,
    id: `trx-${Date.now()}`,
  };
  store.transaksi.unshift(newTx);

  // Perbarui realisasi pos anggaran
  if (tx.tipe === 'MASUK') {
    const p = store.posPenerimaan.find((x) => x.id === tx.posId);
    if (p) {
      p.realisasi += tx.nominal;
      p.sisa = Math.max(0, p.targetWajib - p.realisasi);
      p.persentase = Math.min(100, Math.round((p.realisasi / p.targetWajib) * 1000) / 10);
    }
  } else {
    const p = store.posPengeluaran.find((x) => x.id === tx.posId);
    if (p) {
      p.realisasi += tx.nominal;
      p.sisa = Math.max(0, p.targetWajib - p.realisasi);
      p.persentase = Math.min(100, Math.round((p.realisasi / p.targetWajib) * 1000) / 10);
    }
  }

  saveFinanceData(store);
  return newTx;
}

export function getLaporanKeuanganTahunan(tahunAjaran: string = '2025/2026'): RekapKeuanganTahunan {
  const store = loadFinanceData();

  const totalPenerimaan = store.posPenerimaan.reduce((sum, p) => sum + p.realisasi, 0);
  const totalTargetPenerimaan = store.posPenerimaan.reduce((sum, p) => sum + p.targetWajib, 0);
  const totalRealisasi = store.posPengeluaran.reduce((sum, p) => sum + p.realisasi, 0);
  const totalTunggakan = Math.max(0, totalTargetPenerimaan - totalPenerimaan);
  const persenRealisasi = totalTargetPenerimaan > 0 
    ? Math.round((totalPenerimaan / totalTargetPenerimaan) * 1000) / 10 
    : 0;

  // Breakdown BOS vs Komite
  let bosMasuk = 0;
  let bosKeluar = 0;
  let komiteMasuk = 0;
  let komiteKeluar = 0;

  for (const t of store.transaksi) {
    if (t.sumberDana === 'BOS') {
      if (t.tipe === 'MASUK') bosMasuk += t.nominal;
      else bosKeluar += t.nominal;
    } else if (t.sumberDana === 'KOMITE') {
      if (t.tipe === 'MASUK') komiteMasuk += t.nominal;
      else komiteKeluar += t.nominal;
    }
  }

  // Sample Bulanan
  const arusKasBulanan = [
    { bulan: '2025-07', namaBulan: 'Juli 2025', masuk: 290000000, keluar: 220000000, saldo: 70000000 },
    { bulan: '2025-08', namaBulan: 'Agustus 2025', masuk: 180000000, keluar: 165000000, saldo: 85000000 },
    { bulan: '2025-09', namaBulan: 'September 2025', masuk: 210000000, keluar: 195000000, saldo: 100000000 },
    { bulan: '2025-10', namaBulan: 'Oktober 2025', masuk: 260000000, keluar: 240000000, saldo: 120000000 },
    { bulan: '2025-11', namaBulan: 'November 2025', masuk: 195000000, keluar: 180000000, saldo: 135000000 },
    { bulan: '2025-12', namaBulan: 'Desember 2025', masuk: 310000000, keluar: 290000000, saldo: 155000000 },
    { bulan: '2026-01', namaBulan: 'Januari 2026', masuk: 855000000, keluar: 435000000, saldo: 575000000 },
    { bulan: '2026-02', namaBulan: 'Februari 2026', masuk: 192000000, keluar: 148500000, saldo: 618500000 },
    { bulan: '2026-03', namaBulan: 'Maret 2026', masuk: 250000000, keluar: 172000000, saldo: 696500000 },
  ];

  const rekapTunggakanPerTingkat = [
    { tingkat: 'X' as const, siswaMenunggak: 14, totalNominal: 32400000 },
    { tingkat: 'XI' as const, siswaMenunggak: 21, totalNominal: 48600000 },
    { tingkat: 'XII' as const, siswaMenunggak: 19, totalNominal: 51000000 },
  ];

  return {
    tahunAjaran,
    tanggalRekap: new Date().toISOString().split('T')[0] ?? '',
    totalPenerimaan,
    totalRealisasi,
    totalTunggakan,
    persenRealisasi,
    posPenerimaan: store.posPenerimaan,
    posPengeluaran: store.posPengeluaran,
    arusKasBulanan,
    komiteVsBos: {
      bos: { masuk: bosMasuk, keluar: bosKeluar, saldo: bosMasuk - bosKeluar },
      komite: { masuk: komiteMasuk, keluar: komiteKeluar, saldo: komiteMasuk - komiteKeluar },
    },
    rekapTunggakanPerTingkat,
  };
}
