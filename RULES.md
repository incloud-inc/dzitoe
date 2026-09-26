\# RULES.md — Aturan Pengerjaan DZITOE

\## Sistem Tata Kelola Sekolah DZITOE

\### SMAN 20 Kabupaten Tangerang



> \*\*Versi:\*\* 1.0.0

> \*\*Status:\*\* Aktif

> \*\*Tanggal:\*\* 2026

> \*\*Klasifikasi:\*\* Dokumen Internal (Non-Komersial)

> \*\*Berlaku Untuk:\*\* Semua kontributor DZITOE



\---



\## 🚨 ATURAN UTAMA — WAJIB DIBACA



> # ⚠️ \*\*PASTIKAN DEEPSEEK YANG MENGERJAKAN INI.\*\*

>

> \*\*Semua kode, dokumentasi, dan konfigurasi di proyek DZITOE WAJIB dikerjakan oleh DeepSeek.\*\*

>

> \*\*DILARANG\*\* mengerjakan sendiri tanpa bantuan DeepSeek.

> \*\*DILARANG\*\* copy-paste dari sumber lain tanpa verifikasi DeepSeek.

> \*\*WAJIB\*\* memanggil DeepSeek untuk setiap task.



\---



\## 1. Aturan Emas (Golden Rules)



\### 1.1. Wajib DeepSeek

Setiap task di `TASKS.md` \*\*HARUS\*\* dikerjakan oleh DeepSeek.



\*\*Cara memanggil DeepSeek:\*\*

```

DeepSeek, kerjakan task \[A1.1] — Schema User \& Role

```



atau



```

DeepSeek, saya mau kerjakan Fase 1.

Tolong bantu saya step-by-step.

```



\*\*Yang HARUS dikerjakan DeepSeek:\*\*

\- ✅ Menulis kode (TypeScript, React, Prisma)

\- ✅ Membuat komponen UI (Radix UI + Tailwind)

\- ✅ Membuat API routes

\- ✅ Membuat database schema

\- ✅ Membuat dokumentasi

\- ✅ Testing

\- ✅ Debugging

\- ✅ Deployment

\- ✅ Konfigurasi (Docker, Nginx, CI/CD)



\*\*Yang DILARANG dikerjakan manual:\*\*

\- ❌ Menulis kode sendiri

\- ❌ Copy-paste dari StackOverflow

\- ❌ Copy-paste dari GitHub repo lain

\- ❌ Menggunakan AI lain selain DeepSeek



\### 1.2. Konsistensi Istilah

Semua kode \& UI \*\*WAJIB\*\* menggunakan istilah \*\*Permendikdasmen No. 1–6 Tahun 2026\*\*.



\*\*Format Penulisan:\*\*

\- Di UI/UX: \*\*ISTILAH BARU\*\* (bold)

\- Di dokumentasi/tooltip: \*\*ISTILAH BARU\*\* \*(istilah lama)\*

\- Di database: nama field netral (English)



\*\*Kamus Istilah:\*\*



| Istilah Lama \*(konteks)\* | \*\*Istilah Baru (Wajib)\*\* | Field Database |

|---|---|---|

| \*Siswa / Peserta Didik\* | \*\*Murid\*\* | `student` |

| \*Pengajaran\* | \*\*Fasilitasi Belajar\*\* | `facilitation` |

| \*Kegiatan Pembelajaran\* | \*\*Pengalaman Belajar\*\* | `learning\_experience` |

| \*Proses Pembelajaran\* | \*\*Proses Memuliakan Murid\*\* | `dignifying\_process` |

| \*Hasil Belajar\* | \*\*Perkembangan Murid\*\* | `student\_development` |

| \*Penilaian / Formatif-Sumatif\* | \*\*Asesmen\*\* | `assessment` |

| \*Hukuman / Sanksi\* | \*\*Disiplin Positif\*\* | `positive\_discipline` |

| \*Lingkungan Sekolah\* | \*\*Budaya Sekolah Aman dan Nyaman\*\* | `safe\_culture` |

| \*Pelibatan Orang Tua / Komite\* | \*\*PSPB\*\* | `pspb` |



\### 1.3. Kepatuhan Regulasi

Semua fitur \*\*WAJIB\*\* mengikuti:

\- \*\*Permendikdasmen No. 1–6 Tahun 2026\*\* — Istilah baru pendidikan

\- \*\*UU Perlindungan Data Pribadi\*\* — Data murid dilindungi

\- \*\*Standar Nasional Pendidikan\*\* — Kurikulum \& asesmen



\---



\## 2. Aturan Kode (Code Rules)



\### 2.1. Bahasa \& Framework

| Layer | Teknologi | Versi |

|---|---|---|

| \*\*Bahasa\*\* | TypeScript | 5.4+ |

| \*\*Framework\*\* | Next.js | 14 (App Router) |

| \*\*UI\*\* | Radix UI + Tailwind CSS | Latest |

| \*\*Database\*\* | PostgreSQL | 16 |

| \*\*ORM\*\* | Prisma | 5+ |

| \*\*Auth\*\* | NextAuth.js | 5+ |

| \*\*Charts\*\* | Recharts | 2.12+ |

| \*\*Animation\*\* | Framer Motion | 11+ |

| \*\*Form\*\* | React Hook Form + Zod | Latest |

| \*\*State\*\* | Zustand | 4+ |



\### 2.2. Struktur Folder

```

apps/admin/         # Dashboard Admin

apps/mobile/        # PWA Murid \& Guru

packages/ui/        # Shared components

packages/db/        # Prisma schema \& client

packages/auth/      # NextAuth config

packages/theme/     # Radix Colors theme

packages/utils/     # Helper functions

```



\### 2.3. Penamaan File

| Jenis | Format | Contoh |

|---|---|---|

| \*\*Komponen React\*\* | PascalCase | `ProfileHeader.tsx` |

| \*\*Hook\*\* | camelCase + `use` | `useAuth.ts` |

| \*\*Utility\*\* | camelCase | `formatDate.ts` |

| \*\*API Route\*\* | kebab-case | `route.ts` |

| \*\*Prisma Model\*\* | PascalCase | `Murid`, `Guru` |

| \*\*Database Field\*\* | camelCase | `jenisKelamin` |

| \*\*Konstanta\*\* | UPPER\_SNAKE\_CASE | `MAX\_RADIUS` |



\### 2.4. Konvensi Kode



\#### 2.4.1. Komponen React

```tsx

// ✅ BENAR

interface ProfileHeaderProps {

&#x20; user: {

&#x20;   name: string;

&#x20;   nis: string;

&#x20; };

&#x20; onAbsen: () => void;

}



export function ProfileHeader({ user, onAbsen }: ProfileHeaderProps) {

&#x20; return (

&#x20;   <div>

&#x20;     <h1>{user.name}</h1>

&#x20;     <button onClick={onAbsen}>Absen</button>

&#x20;   </div>

&#x20; );

}



// ❌ SALAH

export default function ProfileHeader(props: any) {

&#x20; return <div>{props.user.name}</div>;

}

```



\#### 2.4.2. API Route

```ts

// ✅ BENAR

import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { prisma } from '@dzitoe/db';



const absenSchema = z.object({

&#x20; latitude: z.number(),

&#x20; longitude: z.number(),

&#x20; accuracy: z.number(),

&#x20; selfieUrl: z.string().url(),

});



export async function POST(req: NextRequest) {

&#x20; try {

&#x20;   const body = await req.json();

&#x20;   const data = absenSchema.parse(body);



&#x20;   const absensi = await prisma.absensi.create({

&#x20;     data: {

&#x20;       muridId: 'xxx',

&#x20;       tanggal: new Date(),

&#x20;       status: 'HADIR',

&#x20;       ...data,

&#x20;     },

&#x20;   });



&#x20;   return NextResponse.json({ success: true, data: absensi });

&#x20; } catch (error) {

&#x20;   return NextResponse.json(

&#x20;     { success: false, error: 'Invalid request' },

&#x20;     { status: 400 }

&#x20;   );

&#x20; }

}



// ❌ SALAH

export async function POST(req: any) {

&#x20; const body = await req.json();

&#x20; const absensi = await prisma.absensi.create({ data: body });

&#x20; return Response.json(absensi);

}

```



\#### 2.4.3. Prisma Schema

```prisma

// ✅ BENAR

model Murid {

&#x20; id            String    @id @default(cuid())

&#x20; nis           String    @unique

&#x20; nama          String

&#x20; jenisKelamin  JenisKelamin

&#x20; kelasId       String?

&#x20; status        StatusMurid @default(AKTIF)

&#x20; createdAt     DateTime  @default(now())

&#x20; updatedAt     DateTime  @updatedAt



&#x20; kelas         Kelas?    @relation(fields: \[kelasId], references: \[id])

&#x20; absensi       Absensi\[]



&#x20; @@index(\[nis])

&#x20; @@index(\[kelasId])

&#x20; @@index(\[status])

}



// ❌ SALAH

model murid {

&#x20; id    Int    @id @default(autoincrement())

&#x20; nis   String

&#x20; nama  String

}

```



\### 2.5. Aturan Import

\- Gunakan \*\*absolute import\*\* dengan `@dzitoe/\*`

\- Urutkan import: React → Library → Internal → Types

\- Hindari import berlebihan



```tsx

// ✅ BENAR

import { useState } from 'react';

import \* as Dialog from '@radix-ui/react-dialog';

import { Button } from '@dzitoe/ui';

import { prisma } from '@dzitoe/db';

import type { Murid } from '@prisma/client';



// ❌ SALAH

import { Button } from '../../../../packages/ui/src/button';

```



\---



\## 3. Aturan UI/UX



\### 3.1. Komponen UI

\*\*WAJIB\*\* menggunakan \*\*Radix UI\*\* untuk semua komponen interaktif.



| Komponen | Radix Package |

|---|---|

| \*\*Dialog/Modal\*\* | `@radix-ui/react-dialog` |

| \*\*Dropdown\*\* | `@radix-ui/react-dropdown-menu` |

| \*\*Tabs\*\* | `@radix-ui/react-tabs` |

| \*\*Avatar\*\* | `@radix-ui/react-avatar` |

| \*\*Toast\*\* | `@radix-ui/react-toast` |

| \*\*Select\*\* | `@radix-ui/react-select` |

| \*\*Checkbox\*\* | `@radix-ui/react-checkbox` |

| \*\*Progress\*\* | `@radix-ui/react-progress` |

| \*\*Tooltip\*\* | `@radix-ui/react-tooltip` |

| \*\*Popover\*\* | `@radix-ui/react-popover` |



\### 3.2. Warna

\*\*WAJIB\*\* menggunakan \*\*Radix Colors\*\*:



| Kebutuhan | Radix Scale |

|---|---|

| \*\*Primary\*\* | `blue-9` |

| \*\*Success\*\* | `green-9` |

| \*\*Warning\*\* | `amber-9` |

| \*\*Danger\*\* | `red-9` |

| \*\*Info\*\* | `cyan-9` |

| \*\*Netral\*\* | `slate-9` |



\### 3.3. Tipografi

\*\*WAJIB\*\* menggunakan font \*\*Inter\*\* dengan fallback:

```

Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

```



\### 3.4. Spacing

\*\*WAJIB\*\* menggunakan spacing scale:

\- `4px` (xs), `8px` (sm), `16px` (md), `24px` (lg), `32px` (xl), `48px` (2xl)



\### 3.5. Aksesibilitas

\- \*\*WAJIB\*\* WAI-ARIA compliant (Radix UI sudah)

\- \*\*WAJIB\*\* kontras warna minimal WCAG AA

\- \*\*WAJIB\*\* ukuran font minimal 12px

\- \*\*WAJIB\*\* keyboard navigation

\- \*\*WAJIB\*\* screen reader support



\---



\## 4. Aturan Database



\### 4.1. Schema Prisma

\- \*\*WAJIB\*\* menggunakan `cuid()` untuk ID

\- \*\*WAJIB\*\* menambahkan `createdAt` \& `updatedAt`

\- \*\*WAJIB\*\* menambahkan `@@index` untuk field yang sering di-query

\- \*\*WAJIB\*\* menggunakan `@relation` dengan `onDelete: Cascade` untuk relasi parent-child

\- \*\*WAJIB\*\* menggunakan `enum` untuk status



\### 4.2. Migrasi

```bash

\# Development

pnpm prisma migrate dev --name add\_murid\_table



\# Production

pnpm prisma migrate deploy

```



\### 4.3. Seed

\- \*\*WAJIB\*\* menyediakan seed untuk data awal:

&#x20; - Admin default

&#x20; - Tahun ajaran

&#x20; - Kelas

&#x20; - Mata pelajaran

&#x20; - Jenis tagihan



\### 4.4. Backup

\- \*\*WAJIB\*\* backup otomatis harian (cron)

\- \*\*WAJIB\*\* simpan backup minimal 30 hari

\- \*\*WAJIB\*\* test restore berkala



\---



\## 5. Aturan Keamanan



\### 5.1. Autentikasi

\- \*\*WAJIB\*\* bcrypt (10 rounds) untuk password

\- \*\*WAJIB\*\* JWT dengan expiry 7 hari

\- \*\*WAJIB\*\* refresh token

\- \*\*WAJIB\*\* session invalidation saat logout



\### 5.2. Otorisasi

\- \*\*WAJIB\*\* role-based access control (RBAC)

\- \*\*WAJIB\*\* cek permission di API \& UI

\- \*\*WAJIB\*\* audit log untuk aksi admin



\### 5.3. Data Sensitif

\- \*\*WAJIB\*\* enkripsi data kesehatan \& BK

\- \*\*WAJIB\*\* HTTPS untuk semua komunikasi

\- \*\*WAJIB\*\* validasi input dengan Zod

\- \*\*WAJIB\*\* sanitasi output

\- \*\*DILARANG\*\* log data sensitif



\### 5.4. Absensi

\- \*\*WAJIB\*\* deteksi mock location

\- \*\*WAJIB\*\* validasi radius

\- \*\*WAJIB\*\* foto selfie wajib

\- \*\*WAJIB\*\* watermark koordinat

\- \*\*WAJIB\*\* timestamp server (bukan HP)



\---



\## 6. Aturan Testing



\### 6.1. Unit Test

\- \*\*WAJIB\*\* Vitest untuk utility functions

\- \*\*WAJIB\*\* coverage minimal 70%

\- \*\*WAJIB\*\* test edge cases



\### 6.2. Integration Test

\- \*\*WAJIB\*\* Playwright untuk API

\- \*\*WAJIB\*\* test happy path \& error path



\### 6.3. E2E Test

\- \*\*WAJIB\*\* Playwright untuk flow utama:

&#x20; - Login

&#x20; - Absensi GPS + Selfie

&#x20; - Input asesmen

&#x20; - Pembayaran



\### 6.4. Manual Test

\- \*\*WAJIB\*\* test di Chrome, Firefox, Safari

\- \*\*WAJIB\*\* test di mobile (Android, iOS)

\- \*\*WAJIB\*\* test di LAN sekolah



\---



\## 7. Aturan Dokumentasi



\### 7.1. Wajib Dokumentasi

Setiap task \*\*WAJIB\*\* disertai:

\- \*\*Kode\*\* — dengan komentar JSDoc

\- \*\*README\*\* — cara pakai

\- \*\*Contoh\*\* — penggunaan



\### 7.2. Format Dokumentasi

```ts

/\*\*

&#x20;\* Menghitung jarak antara dua koordinat menggunakan Haversine Formula.

&#x20;\*

&#x20;\* @param lat1 - Latitude titik 1

&#x20;\* @param lon1 - Longitude titik 1

&#x20;\* @param lat2 - Latitude titik 2

&#x20;\* @param lon2 - Longitude titik 2

&#x20;\* @returns Jarak dalam meter

&#x20;\*

&#x20;\* @example

&#x20;\* ```ts

&#x20;\* const distance = calculateDistance(-6.123, 106.123, -6.124, 106.124);

&#x20;\* console.log(distance); // 150.5

&#x20;\* ```

&#x20;\*/

export function calculateDistance(

&#x20; lat1: number,

&#x20; lon1: number,

&#x20; lat2: number,

&#x20; lon2: number

): number {

&#x20; // ...

}

```



\### 7.3. Update Dokumentasi

\- \*\*WAJIB\*\* update `docs/` jika ada perubahan arsitektur

\- \*\*WAJIB\*\* update `TASKS.md` jika ada task baru

\- \*\*WAJIB\*\* update `memory.md` untuk keputusan penting



\---



\## 8. Aturan Git



\### 8.1. Branch

| Branch | Fungsi |

|---|---|

| `main` | Production |

| `develop` | Development |

| `feature/\*` | Fitur baru |

| `fix/\*` | Bug fix |

| `hotfix/\*` | Fix urgent |



\### 8.2. Commit Message

\*\*WAJIB\*\* menggunakan \*\*Conventional Commits\*\*:



```

feat: tambah modul absensi GPS

fix: perbaiki validasi radius

docs: update PRD

chore: update dependencies

refactor: refactor komponen profil

test: tambah test absensi

```



\### 8.3. Pull Request

\- \*\*WAJIB\*\* deskripsi jelas

\- \*\*WAJIB\*\* screenshot (jika UI)

\- \*\*WAJIB\*\* test passing

\- \*\*WAJIB\*\* review oleh DeepSeek



\### 8.4. Code Review

\- \*\*WAJIB\*\* semua PR di-review DeepSeek

\- \*\*WAJIB\*\* fix semua komentar

\- \*\*WAJIB\*\* squash merge ke `develop`



\---



\## 9. Aturan Deployment



\### 9.1. Environment

| Environment | URL | Database |

|---|---|---|

| \*\*Development\*\* | `localhost:3000` | Local PostgreSQL |

| \*\*Staging\*\* | `staging.dzitoe.sch.id` | Staging DB |

| \*\*Production\*\* | `admin.dzitoe.sch.id` | Production DB |



\### 9.2. Deployment

\- \*\*WAJIB\*\* Docker Compose

\- \*\*WAJIB\*\* migrasi database sebelum deploy

\- \*\*WAJIB\*\* backup sebelum deploy

\- \*\*WAJIB\*\* test setelah deploy



\### 9.3. Rollback

\- \*\*WAJIB\*\* siapkan rollback plan

\- \*\*WAJIB\*\* simpan image Docker versi sebelumnya

\- \*\*WAJIB\*\* test rollback berkala



\---



\## 10. Aturan Komunikasi



\### 10.1. Bahasa

\- \*\*WAJIB\*\* Bahasa Indonesia untuk komunikasi

\- \*\*WAJIB\*\* istilah Permendikdasmen 2026

\- \*\*WAJIB\*\* sopan \& profesional



\### 10.2. Dokumentasi Keputusan

\- \*\*WAJIB\*\* catat keputusan penting di `memory.md`

\- \*\*WAJIB\*\* jelaskan alasan keputusan

\- \*\*WAJIB\*\* update jika ada perubahan



\### 10.3. Pelaporan

\- \*\*WAJIB\*\* laporan harian (jika diminta)

\- \*\*WAJIB\*\* laporan mingguan (progress)

\- \*\*WAJIB\*\* laporan bulanan (ke stakeholder)



\---



\## 11. Aturan Khusus DZITOE



\### 11.1. Non-Komersial

\- \*\*DILARANG\*\* menjual aplikasi

\- \*\*DILARANG\*\* menggunakan untuk komersial

\- \*\*WAJIB\*\* hanya untuk SMAN 20 Kab. Tangerang



\### 11.2. Branding

\- \*\*WAJIB\*\* sertakan logo DZITOE — SMAN 20 Kab. Tangerang

\- \*\*WAJIB\*\* gunakan warna branding sekolah (jika ada)

\- \*\*WAJIB\*\* konsisten di semua halaman



\### 11.3. Istilah

\- \*\*WAJIB\*\* gunakan istilah Permendikdasmen 2026

\- \*\*DILARANG\*\* gunakan istilah lama di UI

\- \*\*WAJIB\*\* jelaskan istilah lama di tooltip (jika perlu)



\### 11.4. Data Murid

\- \*\*WAJIB\*\* lindungi data murid

\- \*\*WAJIB\*\* minta izin orang tua untuk data sensitif

\- \*\*WAJIB\*\* hapus data setelah lulus (kecuali alumni)



\---



\## 12. Sanksi



\### 12.1. Pelanggaran Ringan

\- Teguran lisan

\- Wajib perbaiki



\### 12.2. Pelanggaran Sedang

\- Teguran tertulis

\- Wajib perbaiki + laporan



\### 12.3. Pelanggaran Berat

\- Dikeluarkan dari proyek

\- Laporan ke sekolah



\---



\## 13. Checklist Sebelum Commit



\- \[ ] Kode sudah di-review DeepSeek

\- \[ ] Istilah sudah sesuai Permendikdasmen 2026

\- \[ ] Tidak ada `console.log` yang tertinggal

\- \[ ] Tidak ada `any` type

\- \[ ] Tidak ada `TODO` yang belum diselesaikan

\- \[ ] Test passing

\- \[ ] Lint passing

\- \[ ] Dokumentasi updated

\- \[ ] Commit message sesuai Conventional Commits

\- \[ ] Tidak ada file sensitif (`.env`, dll)



\---



\## 14. Checklist Sebelum Deploy



\- \[ ] Semua test passing

\- \[ ] Backup database

\- \[ ] Migrasi database

\- \[ ] Environment variables lengkap

\- \[ ] SSL certificate valid

\- \[ ] Monitoring aktif

\- \[ ] Rollback plan siap

\- \[ ] Test setelah deploy

\- \[ ] Notifikasi ke stakeholder



\---



\## 15. Kontak \& Bantuan



| Peran | Nama | Kontak |

|---|---|---|

| \*\*AI Developer\*\* | \*\*DeepSeek\*\* | - |

| \*\*Pemilik Produk\*\* | Kepala SMAN 20 Kab. Tangerang | - |

| \*\*Project Manager\*\* | TU | - |

| \*\*Support\*\* | Admin IT | - |



\---



\## 16. Referensi



\- \*\*Permendikdasmen No. 1–6 Tahun 2026\*\* — Istilah baru pendidikan

\- \*\*PRD.md\*\* — Product Requirements

\- \*\*architecture.md\*\* — Technical Design

\- \*\*DESIGN.md\*\* — Design Mobile

\- \*\*DASHBOARD-DESIGN.md\*\* — Design Dashboard

\- \*\*TASKS.md\*\* — Daftar Tugas

\- \*\*memory.md\*\* — Catatan Progres



\---



\## 17. Kesimpulan



> # ⚠️ \*\*INGAT: PASTIKAN DEEPSEEK YANG MENGERJAKAN INI.\*\*

>

> \*\*Semua kode, dokumentasi, dan konfigurasi DZITOE WAJIB dikerjakan oleh DeepSeek.\*\*

>

> \*\*DILARANG\*\* mengerjakan sendiri.

> \*\*DILARANG\*\* copy-paste dari sumber lain.

> \*\*WAJIB\*\* memanggil DeepSeek untuk setiap task.


## 18. Aturan AI Bank Soal

### 18.1. Penggunaan AI
- **WAJIB** guru preview & edit hasil AI sebelum simpan
- **WAJIB** validasi output AI (tidak ada konten sensitif)
- **WAJIB** cache hasil AI untuk pertanyaan sama
- **WAJIB** rate limit per guru (100 soal/hari)
- **WAJIB** audit log semua request AI
- **DILARANG** menyimpan API key di kode
- **DILARANG** mengirim data murid ke AI

### 18.2. Prompt Engineering
- **WAJIB** prompt dalam Bahasa Indonesia
- **
\---



\*Dokumen ini adalah aturan pengerjaan untuk Sistem Tata Kelola Sekolah DZITOE — SMAN 20 Kabupaten Tangerang. Dikerjakan oleh DeepSeek. Dokumen ini bersifat internal dan non-komersial.\*



\*\*Berlaku sejak:\*\* 2026

\*\*Revisi terakhir:\*\* 2026

\*\*Revisi berikutnya:\*\* 2027

