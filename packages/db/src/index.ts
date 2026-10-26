// ==============================================================================
// DZITOE — Database Package (@dzitoe/db)
// Singleton Prisma Client instance for Next.js & Server actions
// ==============================================================================

import { PrismaClient } from './generated/client';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://postgres:root@127.0.0.1:5432/dzitoe?schema=public';
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

export default db;
export * from './generated/client';
export * from './seed-data';
export * from './attendance-store';
export * from './teacher-store';
export * from './schedule-store';
export * from './teacher-attendance-store';
export * from './user-store';
export * from './geofence-store';
export * from './verification-store';
export * from './ekskul-store';
export * from './class-store';
export * from './student-store';
export * from './parent-store';
export * from './mutation-store';
export * from './finance-store';
export type {
  PeriodeType,
  StatusTagihan,
  StatusCicilan,
  MetodePembayaran,
  StatusPembayaran,
  JenisTagihan as BillingJenisTagihan,
  Tagihan as BillingTagihan,
  CicilanItem,
  Pembayaran as BillingPembayaran,
  TunggakanSiswaSummary,
} from './billing-store';
export {
  INITIAL_JENIS_TAGIHAN,
  getAllJenisTagihan,
  createJenisTagihan,
  updateJenisTagihan,
  deleteJenisTagihan,
  getAllTagihan,
  getTagihanById,
  generateTagihanMassal,
  catatPembayaran,
  getAllPembayaran,
  getRekapTunggakan,
} from './billing-store';
export * from './schedule-conflict';
export * from './promotion-store';
export * from './alumni-store';
export type { StatusUKS, GolonganDarah, HealthRecord } from './health-store';
export {
  getAllHealthRecords,
  getHealthRecordById,
  getHealthRecordsByStudentId,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
  getHealthStats,
} from './health-store';
export type { BKRecord } from './bk-store';
export {
  getAllBKRecords,
  getBKRecordById,
  getBKRecordsByStudentId,
  createBKRecord,
  updateBKRecord,
  deleteBKRecord,
  getBKStats,
} from './bk-store';
export type { PrestasiRecord } from './achievement-store';
export {
  hitungPoinPrestasi,
  getAllAchievements,
  getAchievementById,
  getAchievementsByStudentId,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getAchievementLeaderboard,
  getAchievementStats,
} from './achievement-store';
export type {
  KategoriInformasi,
  KategoriPemohon,
  CaraMemperoleh,
  StatusPermohonan,
  DokumenPublikRecord,
  PermohonanInformasiRecord,
} from './ppid-store';
export {
  getAllDokumenPublik,
  getDokumenById,
  createDokumenPublik,
  updateDokumenPublik,
  deleteDokumenPublik,
  incrementDownloadCount,
  getAllPermohonan,
  getPermohonanByIdOrTicket,
  createPermohonan,
  updatePermohonan,
  deletePermohonan,
  getPPIDStats,
} from './ppid-store';
