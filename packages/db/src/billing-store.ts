// ==============================================================================
// DZITOE — Student Billing, Installments & Payments Store (@dzitoe/db)
// Permendikdasmen & Standar Tata Kelola Keuangan Sekolah
// Modul A14 - A18 (Fase 3 Keuangan)
// ==============================================================================

import { SEED_STUDENTS, SEED_CLASSES } from './seed-data';

export type PeriodeType = 'SEKALI' | 'BULANAN' | 'SEMESTER';
export type StatusTagihan = 'BELUM' | 'SEBAGIAN' | 'LUNAS' | 'BATAL';
export type StatusCicilan = 'BELUM' | 'DIBAYAR' | 'TERLAMBAT';
export type MetodePembayaran = 'TUNAI' | 'TRANSFER' | 'QRIS' | 'VA';
export type StatusPembayaran = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface JenisTagihan {
  id: string;
  kode: string;
  nama: string;
  periode: PeriodeType;
  defaultNominal: number;
  bolehCicil: boolean;
  maxCicilan: number;
  jatuhTempoHari: number;
  aktif: boolean;
  tahunAjaran: string;
  deskripsi?: string;
  createdAt: string;
}

export interface CicilanItem {
  id: string;
  tagihanId: string;
  ke: number;
  nominal: number;
  jatuhTempo: string; // YYYY-MM-DD
  status: StatusCicilan;
  pembayaranId?: string;
  tanggalDibayar?: string;
}

export interface Tagihan {
  id: string;
  jenisId: string;
  jenisNama: string;
  siswaId: string;
  siswaNama: string;
  nis: string;
  nisn: string;
  rombelId: string;
  rombelNama: string;
  tingkat: 'X' | 'XI' | 'XII';
  tahunAjaran: string;
  periodeLabel: string;
  nominal: number;
  dibayar: number;
  sisa: number;
  status: StatusTagihan;
  jatuhTempo: string; // YYYY-MM-DD
  bolehCicil: boolean;
  jumlahCicilan: number;
  cicilan: CicilanItem[];
  createdAt: string;
}

export interface Pembayaran {
  id: string;
  tagihanId: string;
  tagihanNama: string;
  cicilanId?: string;
  cicilanKe?: number;
  siswaId: string;
  siswaNama: string;
  nis: string;
  rombelNama: string;
  nominal: number;
  metode: MetodePembayaran;
  referensi?: string;
  buktiUrl?: string;
  status: StatusPembayaran;
  petugas: string;
  kwitansiNo: string;
  catatan?: string;
  createdAt: string; // ISO
}

export const INITIAL_JENIS_TAGIHAN: JenisTagihan[] = [
  {
    id: 'jns-spp',
    kode: 'SPP',
    nama: 'Iuran Komite & SPP Bulanan',
    periode: 'BULANAN',
    defaultNominal: 250000,
    bolehCicil: true,
    maxCicilan: 3,
    jatuhTempoHari: 10,
    aktif: true,
    tahunAjaran: '2025/2026',
    deskripsi: 'Sumbangan pengembangan sarana dan operasional KBM bulanan',
    createdAt: '2025-07-01T00:00:00.000Z',
  },
  {
    id: 'jns-seragam',
    kode: 'SERAGAM',
    nama: 'Paket Seragam Sekolah & Atribut',
    periode: 'SEKALI',
    defaultNominal: 850000,
    bolehCicil: true,
    maxCicilan: 4,
    jatuhTempoHari: 20,
    aktif: true,
    tahunAjaran: '2025/2026',
    deskripsi: 'Paket 5 stel seragam resmi, batik khas, jas almamater & kaos olahraga',
    createdAt: '2025-07-01T00:00:00.000Z',
  },
  {
    id: 'jns-kegiatan',
    kode: 'KEGIATAN',
    nama: 'Uang Praktikum & Kegiatan Semester',
    periode: 'SEMESTER',
    defaultNominal: 450000,
    bolehCicil: false,
    maxCicilan: 1,
    jatuhTempoHari: 15,
    aktif: true,
    tahunAjaran: '2025/2026',
    deskripsi: 'Bahan praktikum lab, modul digital & asesmen ujian akhir semester',
    createdAt: '2025-07-01T00:00:00.000Z',
  },
  {
    id: 'jns-gedung',
    kode: 'DSP',
    nama: 'Dana Sumbangan Pendidikan (DSP)',
    periode: 'SEKALI',
    defaultNominal: 2500000,
    bolehCicil: true,
    maxCicilan: 6,
    jatuhTempoHari: 25,
    aktif: true,
    tahunAjaran: '2025/2026',
    deskripsi: 'Pembangunan ruang kelas baru dan pengadaan smart board laboratorium',
    createdAt: '2025-07-01T00:00:00.000Z',
  },
];

// Helper Generator Tagihan Awal
function generateInitialBilling(): { tagihan: Tagihan[]; pembayaran: Pembayaran[] } {
  const tagihanList: Tagihan[] = [];
  const pembayaranList: Pembayaran[] = [];

  const sampleStudents = SEED_STUDENTS.slice(0, 30);
  let kwitansiCounter = 1001;

  for (let idx = 0; idx < sampleStudents.length; idx++) {
    const student = sampleStudents[idx]!;
    const isLunas = idx % 3 === 0;
    const isCicil = idx % 3 === 1;

    // 1. Tagihan SPP Maret 2026
    const sppId = `tag-spp-${student.id}-2026-03`;
    const nominalSPP = 250000;
    const dibayarSPP = isLunas ? nominalSPP : isCicil ? 125000 : 0;
    const statusSPP: StatusTagihan = isLunas ? 'LUNAS' : isCicil ? 'SEBAGIAN' : 'BELUM';

    const cicilanSPP: CicilanItem[] = [
      {
        id: `cic-${sppId}-1`,
        tagihanId: sppId,
        ke: 1,
        nominal: 125000,
        jatuhTempo: '2026-03-10',
        status: isLunas || isCicil ? 'DIBAYAR' : 'TERLAMBAT',
        tanggalDibayar: isLunas || isCicil ? '2026-03-05' : undefined,
      },
      {
        id: `cic-${sppId}-2`,
        tagihanId: sppId,
        ke: 2,
        nominal: 125000,
        jatuhTempo: '2026-03-25',
        status: isLunas ? 'DIBAYAR' : 'BELUM',
        tanggalDibayar: isLunas ? '2026-03-20' : undefined,
      },
    ];

    tagihanList.push({
      id: sppId,
      jenisId: 'jns-spp',
      jenisNama: 'Iuran Komite & SPP Bulanan',
      siswaId: student.id,
      siswaNama: student.nama,
      nis: student.nis,
      nisn: student.nisn,
      rombelId: student.kelasId,
      rombelNama: student.kelasNama,
      tingkat: student.kelasNama.startsWith('X.') ? 'X' : student.kelasNama.startsWith('XI') ? 'XI' : 'XII',
      tahunAjaran: '2025/2026',
      periodeLabel: 'Maret 2026',
      nominal: nominalSPP,
      dibayar: dibayarSPP,
      sisa: nominalSPP - dibayarSPP,
      status: statusSPP,
      jatuhTempo: '2026-03-10',
      bolehCicil: true,
      jumlahCicilan: 2,
      cicilan: cicilanSPP,
      createdAt: '2026-03-01T01:00:00.000Z',
    });

    // Buat riwayat pembayaran jika ada pembayaran
    if (dibayarSPP > 0) {
      pembayaranList.push({
        id: `byr-${sppId}-1`,
        tagihanId: sppId,
        tagihanNama: 'SPP Maret 2026',
        cicilanId: `cic-${sppId}-1`,
        cicilanKe: 1,
        siswaId: student.id,
        siswaNama: student.nama,
        nis: student.nis,
        rombelNama: student.kelasNama,
        nominal: dibayarSPP,
        metode: idx % 2 === 0 ? 'QRIS' : 'TUNAI',
        referensi: idx % 2 === 0 ? `QRIS-DZ-${Date.now().toString().slice(-6)}` : 'KAS-LOKET-TU',
        status: 'VERIFIED',
        petugas: 'Siti Rohmah (Bendahara SPP)',
        kwitansiNo: `KW/SPP/2026/${kwitansiCounter++}`,
        catatan: isLunas ? 'Pelunasan SPP Maret 2026' : 'Pembayaran Cicilan Ke-1 SPP Maret 2026',
        createdAt: '2026-03-05T03:30:00.000Z',
      });
    }

    // 2. Tagihan DSP untuk kelas X
    if (student.kelasNama.startsWith('X.')) {
      const dspId = `tag-dsp-${student.id}`;
      const nominalDSP = 2500000;
      const dibayarDSP = isLunas ? 2500000 : 1500000;
      const statusDSP: StatusTagihan = isLunas ? 'LUNAS' : 'SEBAGIAN';

      tagihanList.push({
        id: dspId,
        jenisId: 'jns-gedung',
        jenisNama: 'Dana Sumbangan Pendidikan (DSP)',
        siswaId: student.id,
        siswaNama: student.nama,
        nis: student.nis,
        nisn: student.nisn,
        rombelId: student.kelasId,
        rombelNama: student.kelasNama,
        tingkat: 'X',
        tahunAjaran: '2025/2026',
        periodeLabel: 'T.A 2025/2026',
        nominal: nominalDSP,
        dibayar: dibayarDSP,
        sisa: nominalDSP - dibayarDSP,
        status: statusDSP,
        jatuhTempo: '2026-05-25',
        bolehCicil: true,
        jumlahCicilan: 5,
        cicilan: [
          {
            id: `cic-${dspId}-1`,
            tagihanId: dspId,
            ke: 1,
            nominal: 500000,
            jatuhTempo: '2025-09-25',
            status: 'DIBAYAR',
            tanggalDibayar: '2025-09-20',
          },
          {
            id: `cic-${dspId}-2`,
            tagihanId: dspId,
            ke: 2,
            nominal: 500000,
            jatuhTempo: '2025-11-25',
            status: 'DIBAYAR',
            tanggalDibayar: '2025-11-22',
          },
          {
            id: `cic-${dspId}-3`,
            tagihanId: dspId,
            ke: 3,
            nominal: 500000,
            jatuhTempo: '2026-01-25',
            status: 'DIBAYAR',
            tanggalDibayar: '2026-01-18',
          },
          {
            id: `cic-${dspId}-4`,
            tagihanId: dspId,
            ke: 4,
            nominal: 500000,
            jatuhTempo: '2026-03-25',
            status: isLunas ? 'DIBAYAR' : 'BELUM',
            tanggalDibayar: isLunas ? '2026-03-22' : undefined,
          },
          {
            id: `cic-${dspId}-5`,
            tagihanId: dspId,
            ke: 5,
            nominal: 500000,
            jatuhTempo: '2026-05-25',
            status: isLunas ? 'DIBAYAR' : 'BELUM',
            tanggalDibayar: isLunas ? '2026-05-15' : undefined,
          },
        ],
        createdAt: '2025-08-01T01:00:00.000Z',
      });
    }
  }

  return { tagihan: tagihanList, pembayaran: pembayaranList };
}

interface BillingStoreState {
  jenisTagihan: JenisTagihan[];
  tagihan: Tagihan[];
  pembayaran: Pembayaran[];
}

const initialSeed = generateInitialBilling();

const globalStore = globalThis as unknown as {
  __DZITOE_BILLING_STORE__?: BillingStoreState;
};

if (!globalStore.__DZITOE_BILLING_STORE__) {
  globalStore.__DZITOE_BILLING_STORE__ = {
    jenisTagihan: [...INITIAL_JENIS_TAGIHAN],
    tagihan: initialSeed.tagihan,
    pembayaran: initialSeed.pembayaran,
  };
}

function getStore(): BillingStoreState {
  if (!globalStore.__DZITOE_BILLING_STORE__) {
    const seed = generateInitialBilling();
    globalStore.__DZITOE_BILLING_STORE__ = {
      jenisTagihan: [...INITIAL_JENIS_TAGIHAN],
      tagihan: seed.tagihan,
      pembayaran: seed.pembayaran,
    };
  }
  return globalStore.__DZITOE_BILLING_STORE__;
}

// ------------------------------------------------------------------------------
// MODUL A14: JENIS TAGIHAN
// ------------------------------------------------------------------------------

export function getAllJenisTagihan(): JenisTagihan[] {
  return getStore().jenisTagihan;
}

export function createJenisTagihan(input: Omit<JenisTagihan, 'id' | 'createdAt'>): JenisTagihan {
  const store = getStore();
  const newItem: JenisTagihan = {
    ...input,
    id: `jns-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  store.jenisTagihan.unshift(newItem);
  return newItem;
}

export function updateJenisTagihan(id: string, updates: Partial<JenisTagihan>): JenisTagihan | null {
  const store = getStore();
  const idx = store.jenisTagihan.findIndex((j) => j.id === id);
  if (idx === -1) return null;
  store.jenisTagihan[idx] = { ...store.jenisTagihan[idx]!, ...updates };
  return store.jenisTagihan[idx]!;
}

export function deleteJenisTagihan(id: string): boolean {
  const store = getStore();
  const initLen = store.jenisTagihan.length;
  store.jenisTagihan = store.jenisTagihan.filter((j) => j.id !== id);
  return store.jenisTagihan.length < initLen;
}

// ------------------------------------------------------------------------------
// MODUL A15: TAGIHAN & GENERATE MASSAL
// ------------------------------------------------------------------------------

export function getAllTagihan(filters?: {
  rombelId?: string;
  tingkat?: string;
  status?: string;
  jenisId?: string;
  search?: string;
}): Tagihan[] {
  const store = getStore();
  let list = store.tagihan;

  if (filters?.rombelId && filters.rombelId !== 'ALL') {
    list = list.filter((t) => t.rombelId === filters.rombelId);
  }
  if (filters?.tingkat && filters.tingkat !== 'ALL') {
    list = list.filter((t) => t.tingkat === filters.tingkat);
  }
  if (filters?.status && filters.status !== 'ALL') {
    list = list.filter((t) => t.status === filters.status);
  }
  if (filters?.jenisId && filters.jenisId !== 'ALL') {
    list = list.filter((t) => t.jenisId === filters.jenisId);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (t) =>
        t.siswaNama.toLowerCase().includes(q) ||
        t.nis.includes(q) ||
        t.nisn.includes(q) ||
        t.jenisNama.toLowerCase().includes(q) ||
        t.rombelNama.toLowerCase().includes(q)
    );
  }

  return list;
}

export function getTagihanById(id: string): Tagihan | null {
  return getStore().tagihan.find((t) => t.id === id) || null;
}

export function generateTagihanMassal(params: {
  jenisId: string;
  tingkat?: 'X' | 'XI' | 'XII' | 'ALL';
  rombelId?: string;
  periodeLabel: string;
  nominalOverride?: number;
  jatuhTempo: string; // YYYY-MM-DD
  jumlahCicilan?: number;
}): { generatedCount: number; message: string } {
  const store = getStore();
  const jenis = store.jenisTagihan.find((j) => j.id === params.jenisId);
  if (!jenis) {
    throw new Error('Jenis tagihan tidak ditemukan');
  }

  const nominal = params.nominalOverride ?? jenis.defaultNominal;
  const cicilanCount = params.jumlahCicilan ?? (jenis.bolehCicil ? jenis.maxCicilan : 1);

  // Filter siswa target
  let targetStudents = SEED_STUDENTS;
  if (params.rombelId && params.rombelId !== 'ALL') {
    targetStudents = targetStudents.filter((s) => s.kelasId === params.rombelId);
  } else if (params.tingkat && params.tingkat !== 'ALL') {
    const rombelMatching = SEED_CLASSES.filter((c) => c.tingkat === params.tingkat).map((c) => c.id);
    targetStudents = targetStudents.filter((s) => rombelMatching.includes(s.kelasId));
  }

  let count = 0;
  for (const student of targetStudents) {
    // Cegah duplikasi periode yang sama
    const exists = store.tagihan.some(
      (t) => t.siswaId === student.id && t.jenisId === params.jenisId && t.periodeLabel === params.periodeLabel
    );
    if (exists) continue;

    const tagihanId = `tag-${jenis.kode.toLowerCase()}-${student.id}-${Date.now().toString().slice(-4)}-${count}`;
    const nominalPerCicilan = Math.round(nominal / cicilanCount);

    const cicilanItems: CicilanItem[] = [];
    for (let c = 1; c <= cicilanCount; c++) {
      cicilanItems.push({
        id: `cic-${tagihanId}-${c}`,
        tagihanId,
        ke: c,
        nominal: c === cicilanCount ? nominal - nominalPerCicilan * (cicilanCount - 1) : nominalPerCicilan,
        jatuhTempo: params.jatuhTempo,
        status: 'BELUM',
      });
    }

    const newTagihan: Tagihan = {
      id: tagihanId,
      jenisId: jenis.id,
      jenisNama: jenis.nama,
      siswaId: student.id,
      siswaNama: student.nama,
      nis: student.nis,
      nisn: student.nisn,
      rombelId: student.kelasId,
      rombelNama: student.kelasNama,
      tingkat: student.kelasNama.startsWith('X.') ? 'X' : student.kelasNama.startsWith('XI') ? 'XI' : 'XII',
      tahunAjaran: jenis.tahunAjaran,
      periodeLabel: params.periodeLabel,
      nominal,
      dibayar: 0,
      sisa: nominal,
      status: 'BELUM',
      jatuhTempo: params.jatuhTempo,
      bolehCicil: cicilanCount > 1,
      jumlahCicilan: cicilanCount,
      cicilan: cicilanItems,
      createdAt: new Date().toISOString(),
    };

    store.tagihan.unshift(newTagihan);
    count++;
  }

  return {
    generatedCount: count,
    message: `Berhasil menerbitkan ${count} tagihan baru untuk ${jenis.nama}`,
  };
}

// ------------------------------------------------------------------------------
// MODUL A16 & A17: CICILAN & CATAT PEMBAYARAN
// ------------------------------------------------------------------------------

export function catatPembayaran(input: {
  tagihanId: string;
  cicilanId?: string;
  nominal: number;
  metode: MetodePembayaran;
  referensi?: string;
  buktiUrl?: string;
  petugas?: string;
  catatan?: string;
}): Pembayaran {
  const store = getStore();
  const tagihan = store.tagihan.find((t) => t.id === input.tagihanId);
  if (!tagihan) {
    throw new Error('Tagihan tidak ditemukan');
  }

  let cicilanKe: number | undefined;
  if (input.cicilanId) {
    const cic = tagihan.cicilan.find((c) => c.id === input.cicilanId);
    if (cic) {
      cic.status = 'DIBAYAR';
      cic.tanggalDibayar = new Date().toISOString().split('T')[0];
      cicilanKe = cic.ke;
    }
  } else if (tagihan.cicilan.length > 0) {
    // Alokasikan ke cicilan pertama yang belum lunas
    const unpaidCic = tagihan.cicilan.find((c) => c.status !== 'DIBAYAR');
    if (unpaidCic) {
      unpaidCic.status = 'DIBAYAR';
      unpaidCic.tanggalDibayar = new Date().toISOString().split('T')[0];
      cicilanKe = unpaidCic.ke;
    }
  }

  // Update saldo tagihan
  tagihan.dibayar += input.nominal;
  tagihan.sisa = Math.max(0, tagihan.nominal - tagihan.dibayar);
  if (tagihan.sisa === 0) {
    tagihan.status = 'LUNAS';
  } else if (tagihan.dibayar > 0) {
    tagihan.status = 'SEBAGIAN';
  }

  const kwitansiNo = `KW/DZ/${new Date().getFullYear()}/${Date.now().toString().slice(-6)}`;

  const newPayment: Pembayaran = {
    id: `byr-${Date.now()}`,
    tagihanId: tagihan.id,
    tagihanNama: tagihan.jenisNama,
    cicilanId: input.cicilanId,
    cicilanKe,
    siswaId: tagihan.siswaId,
    siswaNama: tagihan.siswaNama,
    nis: tagihan.nis,
    rombelNama: tagihan.rombelNama,
    nominal: input.nominal,
    metode: input.metode,
    referensi: input.referensi || (input.metode === 'TUNAI' ? 'LOKET-TU-SMAN20' : `REF-${Date.now().toString().slice(-6)}`),
    buktiUrl: input.buktiUrl,
    status: 'VERIFIED',
    petugas: input.petugas || 'Staf Keuangan TU SMAN 20',
    kwitansiNo,
    catatan: input.catatan,
    createdAt: new Date().toISOString(),
  };

  store.pembayaran.unshift(newPayment);
  return newPayment;
}

export function getAllPembayaran(search?: string): Pembayaran[] {
  const store = getStore();
  if (!search) return store.pembayaran;
  const q = search.toLowerCase();
  return store.pembayaran.filter(
    (p) =>
      p.siswaNama.toLowerCase().includes(q) ||
      p.kwitansiNo.toLowerCase().includes(q) ||
      p.tagihanNama.toLowerCase().includes(q) ||
      p.nis.includes(q)
  );
}

// ------------------------------------------------------------------------------
// MODUL A18: TUNGGAKAN & STATISTIK REKAPITULASI
// ------------------------------------------------------------------------------

export interface TunggakanSiswaSummary {
  siswaId: string;
  siswaNama: string;
  nis: string;
  nisn: string;
  rombelNama: string;
  tingkat: 'X' | 'XI' | 'XII';
  totalTagihan: number;
  totalDibayar: number;
  totalTunggakan: number;
  jumlahItemMenunggak: number;
  items: Tagihan[];
}

export function getRekapTunggakan(): {
  totalNominalTunggakan: number;
  totalSiswaMenunggak: number;
  rekapPerRombel: { rombelNama: string; siswaMenunggak: number; nominal: number }[];
  siswaList: TunggakanSiswaSummary[];
} {
  const store = getStore();
  const unpaidBills = store.tagihan.filter((t) => t.status !== 'LUNAS' && t.status !== 'BATAL');

  const siswaMap = new Map<string, TunggakanSiswaSummary>();
  const rombelMap = new Map<string, { rombelNama: string; siswaMenunggak: Set<string>; nominal: number }>();

  let totalNominal = 0;

  for (const b of unpaidBills) {
    totalNominal += b.sisa;

    // By Siswa
    if (!siswaMap.has(b.siswaId)) {
      siswaMap.set(b.siswaId, {
        siswaId: b.siswaId,
        siswaNama: b.siswaNama,
        nis: b.nis,
        nisn: b.nisn,
        rombelNama: b.rombelNama,
        tingkat: b.tingkat,
        totalTagihan: 0,
        totalDibayar: 0,
        totalTunggakan: 0,
        jumlahItemMenunggak: 0,
        items: [],
      });
    }
    const s = siswaMap.get(b.siswaId)!;
    s.totalTagihan += b.nominal;
    s.totalDibayar += b.dibayar;
    s.totalTunggakan += b.sisa;
    s.jumlahItemMenunggak += 1;
    s.items.push(b);

    // By Rombel
    if (!rombelMap.has(b.rombelNama)) {
      rombelMap.set(b.rombelNama, {
        rombelNama: b.rombelNama,
        siswaMenunggak: new Set(),
        nominal: 0,
      });
    }
    const r = rombelMap.get(b.rombelNama)!;
    r.siswaMenunggak.add(b.siswaId);
    r.nominal += b.sisa;
  }

  const rekapPerRombel = Array.from(rombelMap.values()).map((r) => ({
    rombelNama: r.rombelNama,
    siswaMenunggak: r.siswaMenunggak.size,
    nominal: r.nominal,
  }));

  return {
    totalNominalTunggakan: totalNominal,
    totalSiswaMenunggak: siswaMap.size,
    rekapPerRombel,
    siswaList: Array.from(siswaMap.values()).sort((a, b) => b.totalTunggakan - a.totalTunggakan),
  };
}
