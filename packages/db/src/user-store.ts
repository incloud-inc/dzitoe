// ==============================================================================
// DZITOE — User & RBAC Store (@dzitoe/db)
// Task: Modul A3 — Manajemen Pengguna & Hak Akses Akun
// Standar Permendikdasmen No. 1–6 Tahun 2026 & RBAC Sekolah Menengah Atas
// ==============================================================================

export type UserRole =
  | 'ADMIN'
  | 'KEPALA_SEKOLAH'
  | 'TU'
  | 'PETUGAS_PPID'
  | 'WAKA_KURIKULUM'
  | 'WAKA_KESISWAAN'
  | 'BENDAHARA'
  | 'OPERATOR'
  | 'GURU'
  | 'WALI_KELAS'
  | 'GURU_PIKET'
  | 'GURU_BK'
  | 'MURID'
  | 'ORANG_TUA';

export type UserStatus = 'AKTIF' | 'NONAKTIF' | 'DITANGGUHKAN';

export interface SystemUser {
  id: string;
  username: string;
  nama: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  linkedEntityId: string | null; // NIP / NISN / ID Guru / Murid / Ortu
  linkedEntityType: 'GURU' | 'MURID' | 'STAFF' | 'ORANG_TUA' | null;
  linkedEntityNama: string | null;
  jabatan: string;
  phone: string;
  permissions: string[];
  lastLogin: string | null;
  createdAt: string;
  avatarUrl: string;
}

export const ROLE_LABELS: Record<UserRole, { label: string; color: string; desc: string }> = {
  ADMIN: {
    label: 'Super Admin / IT',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    desc: 'Akses penuh ke seluruh konfigurasi, database, dan manajemen akun',
  },
  KEPALA_SEKOLAH: {
    label: 'Kepala Sekolah',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    desc: 'Monitoring eksekutif, rekapitulasi kehadiran, persetujuan kebijakan',
  },
  TU: {
    label: 'Tata Usaha (TU)',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    desc: 'Administrasi kesiswaan, mutasi, kenaikan kelas, dan persuratan',
  },
  PETUGAS_PPID: {
    label: 'Petugas PPID',
    color: 'bg-teal-100 text-teal-800 border-teal-200',
    desc: 'Keterbukaan informasi publik, permohonan informasi warga, dan publikasi',
  },
  WAKA_KURIKULUM: {
    label: 'Waka Kurikulum',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    desc: 'Manajemen jadwal KBM, pemetaan mapel, dan pembagian jam mengajar',
  },
  WAKA_KESISWAAN: {
    label: 'Waka Kesiswaan',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    desc: 'Pembinaan murid, disiplin positif, monitoring ekskul & kehadiran',
  },
  BENDAHARA: {
    label: 'Bendahara / Keuangan',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    desc: 'Pengelolaan tagihan, iuran komite, verifikasi pembayaran',
  },
  OPERATOR: {
    label: 'Operator Dapodik',
    color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    desc: 'Sinkronisasi data induk kependidikan, nomor registrasi GTK & murid',
  },
  GURU: {
    label: 'Guru Pengajar',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    desc: 'Input nilai, rekam jurnal materi harian, absensi kelas mandiri',
  },
  WALI_KELAS: {
    label: 'Wali Kelas',
    color: 'bg-teal-100 text-teal-700 border-teal-200',
    desc: 'Verifikasi izin/sakit siswa perwalian, laporan presensi kelas',
  },
  GURU_PIKET: {
    label: 'Guru Piket',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    desc: 'Pencatatan keterlambatan harian, izin keluar lingkungan sekolah',
  },
  GURU_BK: {
    label: 'Guru BK',
    color: 'bg-rose-100 text-rose-700 border-rose-200',
    desc: 'Catatan bimbingan konseling, monitoring absensi kronis murid',
  },
  MURID: {
    label: 'Siswa / Murid',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    desc: 'Akses Mobile PWA, presensi GPS selfie, lihat jadwal dan tugas',
  },
  ORANG_TUA: {
    label: 'Orang Tua / Wali',
    color: 'bg-stone-100 text-stone-700 border-stone-200',
    desc: 'Portal pemantauan kehadiran dan perkembangan akademik anak',
  },
};

// 12 Initial Real Users SMAN 20 Kabupaten Tangerang
export const SEED_SYSTEM_USERS: SystemUser[] = [
  {
    id: 'usr-admin-01',
    username: 'admin',
    nama: 'Administrator Sistem IT SMAN 20',
    email: 'admin@sman20kabtangerang.sch.id',
    role: 'ADMIN',
    status: 'AKTIF',
    linkedEntityId: null,
    linkedEntityType: 'STAFF',
    linkedEntityNama: 'Tim Pengelola TI & Jaringan',
    jabatan: 'Koordinator Sistem IT',
    phone: '081298765430',
    permissions: ['all'],
    lastLogin: '2026-09-28 04:30 WIB',
    createdAt: '2026-01-05',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: 'usr-kepsek-01',
    username: 'kepsek',
    nama: 'Drs. H. Ahmad Fauzi, M.Pd.',
    email: 'ahmad.fauzi@sman20kabtangerang.sch.id',
    role: 'KEPALA_SEKOLAH',
    status: 'AKTIF',
    linkedEntityId: '197005121995031001',
    linkedEntityType: 'GURU',
    linkedEntityNama: 'Drs. H. Ahmad Fauzi, M.Pd.',
    jabatan: 'Kepala Sekolah',
    phone: '081287654321',
    permissions: ['read:all', 'approve:permits', 'view:reports', 'audit:presensi'],
    lastLogin: '2026-09-27 19:45 WIB',
    createdAt: '2026-01-05',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 'usr-tu-01',
    username: 'tu',
    nama: 'Hj. Nurul Anisa, S.E.',
    email: 'tu@sman20kabtangerang.sch.id',
    role: 'TU',
    status: 'AKTIF',
    linkedEntityId: null,
    linkedEntityType: 'STAFF',
    linkedEntityNama: 'Bagian Tata Usaha SMAN 20',
    jabatan: 'Staf Tata Usaha & Kesiswaan',
    phone: '085712345679',
    permissions: ['manage:students', 'manage:mutasi', 'manage:promotion', 'view:reports'],
    lastLogin: '2026-10-01 08:00 WIB',
    createdAt: '2026-01-10',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  },
  {
    id: 'usr-ppid-01',
    username: 'ppid',
    nama: 'Rahmat Hidayat, S.Kom.',
    email: 'ppid@sman20kabtangerang.sch.id',
    role: 'PETUGAS_PPID',
    status: 'AKTIF',
    linkedEntityId: null,
    linkedEntityType: 'STAFF',
    linkedEntityNama: 'Layanan PPID SMAN 20',
    jabatan: 'Petugas Pengelola Informasi dan Dokumentasi (PPID)',
    phone: '087812345678',
    permissions: ['manage:ppid', 'view:reports', 'publish:documents'],
    lastLogin: '2026-10-02 09:30 WIB',
    createdAt: '2026-01-10',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    id: 'usr-kurikulum-01',
    username: 'kurikulum',
    nama: 'Siti Rahmawati, M.Pd.',
    email: 'siti.rahmawati@sman20kabtangerang.sch.id',
    role: 'WAKA_KURIKULUM',
    status: 'AKTIF',
    linkedEntityId: '197408252000032002',
    linkedEntityType: 'GURU',
    linkedEntityNama: 'Siti Rahmawati, M.Pd.',
    jabatan: 'Wakil Kepala Sekolah Bidang Kurikulum',
    phone: '081398765432',
    permissions: ['manage:schedule', 'manage:mapel', 'view:teachers', 'view:reports'],
    lastLogin: '2026-09-27 21:15 WIB',
    createdAt: '2026-01-05',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  },
  {
    id: 'usr-kesiswaan-01',
    username: 'kesiswaan',
    nama: 'Supriyadi, S.Pd.',
    email: 'supriyadi@sman20kabtangerang.sch.id',
    role: 'WAKA_KESISWAAN',
    status: 'AKTIF',
    linkedEntityId: '198103152006041005',
    linkedEntityType: 'GURU',
    linkedEntityNama: 'Supriyadi, S.Pd.',
    jabatan: 'Wakil Kepala Sekolah Bidang Kesiswaan',
    phone: '081234567894',
    permissions: ['manage:students', 'manage:ekskul', 'approve:permits', 'view:presensi'],
    lastLogin: '2026-09-27 18:20 WIB',
    createdAt: '2026-01-05',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
  },
  {
    id: 'usr-tu-01',
    username: 'bendahara',
    nama: 'Hj. Nurul Anisa, S.E.',
    email: 'keuangan@sman20kabtangerang.sch.id',
    role: 'BENDAHARA',
    status: 'AKTIF',
    linkedEntityId: null,
    linkedEntityType: 'STAFF',
    linkedEntityNama: 'Tata Usaha Keuangan',
    jabatan: 'Bendahara Sekolah / Kepala Urusan Keuangan',
    phone: '085712345678',
    permissions: ['manage:finance', 'view:students', 'view:reports'],
    lastLogin: '2026-09-26 14:00 WIB',
    createdAt: '2026-01-10',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  },
  {
    id: 'usr-op-01',
    username: 'operator',
    nama: 'Rahmat Hidayat, S.Kom.',
    email: 'operator@sman20kabtangerang.sch.id',
    role: 'OPERATOR',
    status: 'AKTIF',
    linkedEntityId: null,
    linkedEntityType: 'STAFF',
    linkedEntityNama: 'Staf Operator Data Pokok Pendidikan',
    jabatan: 'Operator Utama Dapodik',
    phone: '087812345670',
    permissions: ['manage:students', 'manage:teachers', 'sync:dapodik', 'export:data'],
    lastLogin: '2026-09-27 16:10 WIB',
    createdAt: '2026-01-10',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    id: 'usr-piket-01',
    username: 'piket',
    nama: 'Tim Guru Piket Harian SMAN 20',
    email: 'piket@sman20kabtangerang.sch.id',
    role: 'GURU_PIKET',
    status: 'AKTIF',
    linkedEntityId: null,
    linkedEntityType: 'STAFF',
    linkedEntityNama: 'Meja Piket Gerbang Utama',
    jabatan: 'Petugas Piket Kehadiran',
    phone: '081299988877',
    permissions: ['manage:attendance', 'approve:permits', 'record:keterlambatan'],
    lastLogin: '2026-09-28 06:15 WIB',
    createdAt: '2026-01-15',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  },
  {
    id: 'usr-bk-01',
    username: 'guru.bk',
    nama: 'Indah Permatasari, S.Psi.',
    email: 'indah.permatasari@sman20kabtangerang.sch.id',
    role: 'GURU_BK',
    status: 'AKTIF',
    linkedEntityId: '198709142011012004',
    linkedEntityType: 'GURU',
    linkedEntityNama: 'Indah Permatasari, S.Psi.',
    jabatan: 'Koordinator Bimbingan Konseling',
    phone: '085211223344',
    permissions: ['view:students', 'view:attendance', 'manage:counseling', 'approve:permits'],
    lastLogin: '2026-09-27 11:20 WIB',
    createdAt: '2026-01-15',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  },
  {
    id: 'usr-guru-x1',
    username: 'budi.santoso',
    nama: 'Budi Santoso, S.Pd.',
    email: 'budi.santoso@sman20kabtangerang.sch.id',
    role: 'WALI_KELAS',
    status: 'AKTIF',
    linkedEntityId: '197801122002121003',
    linkedEntityType: 'GURU',
    linkedEntityNama: 'Budi Santoso, S.Pd.',
    jabatan: 'Wali Kelas X.1 & Guru Matematika',
    phone: '081234567891',
    permissions: ['view:class_students', 'approve:class_permits', 'input:grades', 'record:kbm'],
    lastLogin: '2026-09-27 20:30 WIB',
    createdAt: '2026-01-15',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
  },
  {
    id: 'usr-guru-pjok',
    username: 'rizky.pratama',
    nama: 'Rizky Pratama, S.Pd.',
    email: 'rizky.pratama@sman20kabtangerang.sch.id',
    role: 'GURU',
    status: 'AKTIF',
    linkedEntityId: '199004122015041002',
    linkedEntityType: 'GURU',
    linkedEntityNama: 'Rizky Pratama, S.Pd.',
    jabatan: 'Guru PJOK & Pembina Basket',
    phone: '081399887766',
    permissions: ['input:grades', 'record:kbm', 'manage:ekskul_basket'],
    lastLogin: '2026-09-25 15:45 WIB',
    createdAt: '2026-01-15',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
  },
  {
    id: 'usr-siswa-01',
    username: '0080000001',
    nama: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@siswa.sman20.sch.id',
    role: 'MURID',
    status: 'AKTIF',
    linkedEntityId: '0080000001',
    linkedEntityType: 'MURID',
    linkedEntityNama: 'Ahmad Fauzi (Kelas X.1)',
    jabatan: 'Ketua Kelas X.1',
    phone: '081211110001',
    permissions: ['student:attendance', 'student:schedule', 'student:profile'],
    lastLogin: '2026-09-27 22:10 WIB',
    createdAt: '2026-02-01',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
  },
  {
    id: 'usr-siswa-02',
    username: '0080000002',
    nama: 'Aisyah Putri',
    email: 'aisyah.putri@siswa.sman20.sch.id',
    role: 'MURID',
    status: 'AKTIF',
    linkedEntityId: '0080000002',
    linkedEntityType: 'MURID',
    linkedEntityNama: 'Aisyah Putri (Kelas X.1)',
    jabatan: 'Siswa Kelas X.1',
    phone: '081211110002',
    permissions: ['student:attendance', 'student:schedule', 'student:profile'],
    lastLogin: '2026-09-27 21:50 WIB',
    createdAt: '2026-02-01',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
  },
];

// Global memory cache for cross-module consistency
const globalUserStore = globalThis as unknown as {
  __DZITOE_USERS__?: SystemUser[];
};

if (!globalUserStore.__DZITOE_USERS__) {
  globalUserStore.__DZITOE_USERS__ = [...SEED_SYSTEM_USERS];
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
      const dataFile = path.join(dataDir, 'runtime-users.json');
      return { fs, dataDir, dataFile };
    }
  } catch {
    // browser or edge fallback
  }
  return null;
}

function ensureDataFile(): void {
  const io = getFileIo();
  if (!io) return;
  try {
    if (!io.fs.existsSync(io.dataDir)) {
      io.fs.mkdirSync(io.dataDir, { recursive: true });
    }
    if (!io.fs.existsSync(io.dataFile)) {
      io.fs.writeFileSync(io.dataFile, JSON.stringify(SEED_SYSTEM_USERS, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[UserStore] Could not write to data file, using in-memory only', err);
  }
}

export function getAllUsers(): SystemUser[] {
  ensureDataFile();
  const io = getFileIo();
  if (io) {
    try {
      if (io.fs.existsSync(io.dataFile)) {
        const content = io.fs.readFileSync(io.dataFile, 'utf-8');
        const parsed = JSON.parse(content) as SystemUser[];
        let changed = false;
        for (const seed of SEED_SYSTEM_USERS) {
          if (!parsed.some((u) => u.username === seed.username)) {
            parsed.push(seed);
            changed = true;
          }
        }
        if (changed) {
          io.fs.writeFileSync(io.dataFile, JSON.stringify(parsed, null, 2), 'utf-8');
        }
        globalUserStore.__DZITOE_USERS__ = parsed;
        return parsed;
      }
    } catch (err) {
      console.warn('[UserStore] Error reading data file', err);
    }
  }
  return globalUserStore.__DZITOE_USERS__ || [...SEED_SYSTEM_USERS];
}

function persistStore(items: SystemUser[]): void {
  globalUserStore.__DZITOE_USERS__ = items;
  const io = getFileIo();
  if (!io) return;
  try {
    ensureDataFile();
    io.fs.writeFileSync(io.dataFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[UserStore] Error persisting to data file', err);
  }
}

export function getUserById(id: string): SystemUser | null {
  const users = getAllUsers();
  return users.find((u) => u.id === id || u.username === id) || null;
}

export interface CreateUserInput {
  username: string;
  nama: string;
  email: string;
  role: UserRole;
  phone?: string;
  jabatan?: string;
  linkedEntityId?: string | null;
  linkedEntityType?: 'GURU' | 'MURID' | 'STAFF' | null;
  linkedEntityNama?: string | null;
}

export function createUser(input: CreateUserInput): { success: boolean; user?: SystemUser; message: string } {
  const users = getAllUsers();
  const cleanUsername = input.username.trim().toLowerCase();
  
  if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
    return { success: false, message: `Username "${input.username}" sudah digunakan!` };
  }
  if (users.some((u) => u.email.toLowerCase() === input.email.trim().toLowerCase())) {
    return { success: false, message: `Email "${input.email}" sudah terdaftar!` };
  }

  const defaultRolePermissions: Record<UserRole, string[]> = {
    ADMIN: ['all'],
    KEPALA_SEKOLAH: ['read:all', 'approve:permits', 'view:reports'],
    TU: ['manage:students', 'manage:mutasi', 'manage:promotion', 'view:reports'],
    PETUGAS_PPID: ['manage:ppid', 'view:reports', 'publish:documents'],
    WAKA_KURIKULUM: ['manage:schedule', 'manage:mapel', 'view:reports'],
    WAKA_KESISWAAN: ['manage:students', 'manage:ekskul', 'approve:permits'],
    BENDAHARA: ['manage:finance', 'view:reports'],
    OPERATOR: ['manage:students', 'manage:teachers', 'sync:dapodik'],
    GURU: ['input:grades', 'record:kbm'],
    WALI_KELAS: ['view:class_students', 'approve:class_permits', 'input:grades'],
    GURU_PIKET: ['manage:attendance', 'approve:permits'],
    GURU_BK: ['view:students', 'manage:counseling'],
    MURID: ['student:attendance', 'student:schedule'],
    ORANG_TUA: ['parent:view_child'],
  };

  const newUser: SystemUser = {
    id: `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    username: cleanUsername,
    nama: input.nama.trim(),
    email: input.email.trim(),
    role: input.role,
    status: 'AKTIF',
    linkedEntityId: input.linkedEntityId || null,
    linkedEntityType: input.linkedEntityType || null,
    linkedEntityNama: input.linkedEntityNama || null,
    jabatan: input.jabatan || ROLE_LABELS[input.role].label,
    phone: input.phone || '081234567890',
    permissions: defaultRolePermissions[input.role] || ['view:basic'],
    lastLogin: null,
    createdAt: new Date().toISOString().split('T')[0] ?? '2026-09-28',
    avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + (users.length % 10)}?w=150`,
  };

  users.unshift(newUser);
  persistStore(users);
  return { success: true, user: newUser, message: `Pengguna "${newUser.nama}" (@${newUser.username}) berhasil ditambahkan!` };
}

export function updateUser(id: string, input: Partial<CreateUserInput & { status: UserStatus; permissions: string[] }>): {
  success: boolean;
  user?: SystemUser;
  message: string;
} {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) {
    return { success: false, message: 'Pengguna tidak ditemukan.' };
  }

  const existing = users[idx]!;
  if (input.username && input.username.toLowerCase() !== existing.username.toLowerCase()) {
    if (users.some((u) => u.id !== id && u.username.toLowerCase() === input.username!.toLowerCase())) {
      return { success: false, message: `Username "${input.username}" sudah digunakan!` };
    }
    existing.username = input.username.trim().toLowerCase();
  }

  if (input.email && input.email.toLowerCase() !== existing.email.toLowerCase()) {
    if (users.some((u) => u.id !== id && u.email.toLowerCase() === input.email!.toLowerCase())) {
      return { success: false, message: `Email "${input.email}" sudah digunakan!` };
    }
    existing.email = input.email.trim();
  }

  if (input.nama) existing.nama = input.nama.trim();
  if (input.role) existing.role = input.role;
  if (input.status) existing.status = input.status;
  if (input.phone) existing.phone = input.phone;
  if (input.jabatan) existing.jabatan = input.jabatan;
  if (input.linkedEntityId !== undefined) existing.linkedEntityId = input.linkedEntityId;
  if (input.linkedEntityType !== undefined) existing.linkedEntityType = input.linkedEntityType;
  if (input.linkedEntityNama !== undefined) existing.linkedEntityNama = input.linkedEntityNama;
  if (input.permissions) existing.permissions = input.permissions;

  users[idx] = existing;
  persistStore(users);
  return { success: true, user: existing, message: `Data pengguna "${existing.nama}" berhasil diperbarui!` };
}

export function deleteUser(id: string): { success: boolean; message: string } {
  let users = getAllUsers();
  const user = users.find((u) => u.id === id);
  if (!user) {
    return { success: false, message: 'Pengguna tidak ditemukan.' };
  }
  if (user.username === 'admin') {
    return { success: false, message: 'Akun Superadmin IT utama tidak boleh dihapus!' };
  }

  users = users.filter((u) => u.id !== id);
  persistStore(users);
  return { success: true, message: `Pengguna "${user.nama}" telah berhasil dihapus dari sistem.` };
}

export function resetUserPassword(id: string, customPass?: string): { success: boolean; message: string; tempPass: string } {
  const users = getAllUsers();
  const user = users.find((u) => u.id === id);
  if (!user) {
    return { success: false, message: 'Pengguna tidak ditemukan.', tempPass: '' };
  }

  const generatedPass = customPass || `Sman20#${Math.floor(1000 + Math.random() * 9000)}`;
  // Note: di production hash disimpan di DB/User table. Disini tercatat reset sukses untuk admin
  return {
    success: true,
    message: `Kata sandi akun @${user.username} berhasil direset! Berikan kata sandi sementara ini kepada pengguna.`,
    tempPass: generatedPass,
  };
}

export function toggleUserStatus(id: string): { success: boolean; status?: UserStatus; message: string } {
  const users = getAllUsers();
  const user = users.find((u) => u.id === id);
  if (!user) {
    return { success: false, message: 'Pengguna tidak ditemukan.' };
  }
  if (user.username === 'admin') {
    return { success: false, message: 'Status akun Superadmin IT tidak dapat dinonaktifkan.' };
  }

  user.status = user.status === 'AKTIF' ? 'NONAKTIF' : 'AKTIF';
  persistStore(users);
  return {
    success: true,
    status: user.status,
    message: `Status akun @${user.username} berhasil diubah menjadi ${user.status}.`,
  };
}
