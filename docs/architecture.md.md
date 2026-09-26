\# architecture.md — Technical Design

\## Sistem Tata Kelola Sekolah DZITOE

\### SMAN 20 Kabupaten Tangerang



> \*\*Versi:\*\* 1.0.0

> \*\*Status:\*\* Draft

> \*\*Tanggal:\*\* 2026

> \*\*Arsitektur:\*\* Opsi 1 — Monolith Sederhana

> \*\*Deployment:\*\* Docker Compose

> \*\*Klasifikasi:\*\* Dokumen Internal (Non-Komersial)



\---



\## 1. Ringkasan Arsitektur



DZITOE menggunakan arsitektur \*\*monolith sederhana\*\* dengan \*\*monorepo\*\*:

\- \*\*1 repo\*\* — mudah di-clone

\- \*\*1 perintah\*\* — `docker compose up`

\- \*\*2 aplikasi Next.js\*\* — Admin \& Mobile (PWA)

\- \*\*1 database\*\* — PostgreSQL

\- \*\*1 reverse proxy\*\* — Nginx



\*\*Tujuan:\*\* Sekolah cukup `git clone` + `docker compose up` untuk deploy.



\*\*Prinsip:\*\*

1\. \*\*Sederhana\*\* — mudah dipahami \& dipelihara

2\. \*\*Mandiri\*\* — tidak tergantung cloud

3\. \*\*Aman\*\* — data sensitif di server sekolah

4\. \*\*Gratis\*\* — semua open source

5\. \*\*Offline-friendly\*\* — PWA dengan service worker



\---



\## 2. Diagram Arsitektur



\### 2.1. High-Level Architecture



```

┌─────────────────────────────────────────────────────────────────┐

│                        DOCKER COMPOSE                            │

│                                                                  │

│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │

│  │   ADMIN      │  │   MOBILE     │  │   POSTGRESQL         │  │

│  │   (Next.js)  │  │   (PWA)      │  │   (Database)         │  │

│  │   :3000      │  │   :3001      │  │   :5432              │  │

│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │

│         │                 │                      │              │

│         └────────┬────────┘                      │              │

│                  │                               │              │

│         ┌────────▼────────┐              ┌───────▼───────┐     │

│         │   API ROUTES    │              │   REDIS       │     │

│         │   (Next.js)     │              │   (Cache)     │     │

│         └────────┬────────┘              └───────────────┘     │

│                  │                                              │

│         ┌────────▼────────┐              ┌───────────────┐     │

│         │   PRISMA ORM    │              │   STORAGE     │     │

│         │   (DB Client)   │              │   (Volume)    │     │

│         └────────┬────────┘              │   /uploads    │     │

│                  │                       └───────────────┘     │

│                  │                                              │

│         ┌────────▼────────┐                                    │

│         │   NEXTAUTH      │                                    │

│         │   (Auth)        │                                    │

│         └─────────────────┘                                    │

│                                                                  │

└─────────────────────────────────────────────────────────────────┘

&#x20;                             │

&#x20;                             ▼

&#x20;                   ┌─────────────────┐

&#x20;                   │   NGINX         │

&#x20;                   │   (Reverse      │

&#x20;                   │    Proxy)       │

&#x20;                   │   :80 / :443    │

&#x20;                   └─────────────────┘

&#x20;                             │

&#x20;                             ▼

&#x20;                   ┌─────────────────┐

&#x20;                   │   SEKOLAH       │

&#x20;                   │   (LAN/WiFi)    │

&#x20;                   └─────────────────┘

```



\### 2.2. Alur Data Absensi GPS + Selfie



```

\[MURID] Buka PWA

&#x20;   │

&#x20;   ▼

\[PWA] Request GPS + Kamera

&#x20;   │

&#x20;   ▼

\[PWA] Validasi Radius (Haversine)

&#x20;   │

&#x20;   ├── Di luar radius → Error

&#x20;   │

&#x20;   ▼

\[PWA] Ambil Foto Selfie

&#x20;   │

&#x20;   ▼

\[PWA] Generate Watermark (Canvas)

&#x20;   │

&#x20;   ▼

\[PWA] Kompres Foto (WebP, 80%)

&#x20;   │

&#x20;   ▼

\[PWA] POST /api/absensi/masuk

&#x20;   │  (multipart/form-data)

&#x20;   ▼

\[API] Validasi JWT + Role

&#x20;   │

&#x20;   ▼

\[API] Validasi Mock Location

&#x20;   │

&#x20;   ▼

\[API] Simpan Foto ke /uploads

&#x20;   │

&#x20;   ▼

\[API] Simpan Data ke PostgreSQL

&#x20;   │

&#x20;   ▼

\[API] Return Success

&#x20;   │

&#x20;   ▼

\[PWA] Tampilkan Notifikasi

```



\---



\## 3. Stack Teknologi



\### 3.1. Frontend



| Layer | Teknologi | Versi | Alasan |

|---|---|---|---|

| \*\*Framework Admin\*\* | Next.js | 14 (App Router) | SSR, SEO, mudah deploy |

| \*\*Framework Mobile\*\* | Next.js | 14 (PWA) | Satu codebase, install di HP |

| \*\*Bahasa\*\* | TypeScript | 5.4+ | Type-safe |

| \*\*Styling\*\* | Tailwind CSS | 3.4+ | Utility-first |

| \*\*UI Primitives\*\* | Radix UI Primitives | Latest | Headless, accessible |

| \*\*UI Themes\*\* | Radix UI Themes | Latest | Siap pakai |

| \*\*UI Colors\*\* | Radix UI Colors | Latest | Palet accessible |

| \*\*UI Icons\*\* | Radix UI Icons | Latest | Ikon minimalis |

| \*\*Charts\*\* | Recharts | 2.12+ | Line, bar, donut |

| \*\*Animation\*\* | Framer Motion | 11+ | Animasi halus |

| \*\*Form\*\* | React Hook Form + Zod | Latest | Validasi |

| \*\*State\*\* | Zustand | 4+ | State management ringan |



\### 3.2. Backend



| Layer | Teknologi | Versi | Alasan |

|---|---|---|---|

| \*\*Runtime\*\* | Node.js | 20 LTS | Stabil |

| \*\*Framework\*\* | Next.js API Routes | 14 | Tidak perlu server terpisah |

| \*\*ORM\*\* | Prisma | 5+ | Type-safe, migrasi mudah |

| \*\*Database\*\* | PostgreSQL | 16 | Relasional, gratis |

| \*\*Auth\*\* | NextAuth.js | 5+ | Built-in, support role |

| \*\*Validasi\*\* | Zod | 3+ | Schema validation |

| \*\*Password\*\* | bcrypt | 5+ | Hashing |

| \*\*JWT\*\* | jose | 5+ | Token |

| \*\*Cache\*\* | Redis | 7 | Session \& rate limit |

| \*\*Queue\*\* | BullMQ | 5+ | Background job (opsional) |



\### 3.3. DevOps



| Layer | Teknologi | Versi | Alasan |

|---|---|---|---|

| \*\*Container\*\* | Docker | 24+ | Isolasi |

| \*\*Orchestrasi\*\* | Docker Compose | 2+ | Satu perintah |

| \*\*Reverse Proxy\*\* | Nginx | 1.25+ | SSL, routing |

| \*\*SSL\*\* | Let's Encrypt | - | Gratis |

| \*\*Monitoring\*\* | Uptime Kuma | Latest | Self-hosted |

| \*\*Log\*\* | Dozzle | Latest | Log viewer |

| \*\*Backup\*\* | pg\_dump + cron | - | Otomatis |



\### 3.4. Development Tools



| Layer | Teknologi | Versi | Alasan |

|---|---|---|---|

| \*\*Package Manager\*\* | pnpm | 9+ | Cepat, hemat disk |

| \*\*Monorepo\*\* | pnpm workspace | - | Built-in |

| \*\*Linter\*\* | ESLint | 8+ | Code quality |

| \*\*Formatter\*\* | Prettier | 3+ | Konsisten |

| \*\*Test Unit\*\* | Vitest | 1+ | Cepat |

| \*\*Test E2E\*\* | Playwright | 1.40+ | Browser test |

| \*\*Git Hook\*\* | Husky | 9+ | Pre-commit |

| \*\*Commit\*\* | Commitlint | 18+ | Conventional commits |

### 3.5. AI Service
| Layer | Teknologi | Alasan |
|---|---|---|
| **AI Provider** | DeepSeek API / OpenAI API / Ollama (lokal) | Generate soal |
| **Prompt Management** | LangChain / Custom | Kelola prompt |
| **Queue** | BullMQ + Redis | Async generation |
| **Cache** | Redis | Cache hasil AI |
| **Rate Limit** | Upstash / Custom | Batasi request |

\---



\## 4. Struktur Repo (Monorepo)



```

dzitoe/

├── apps/

│   ├── admin/                      # Dashboard Admin (Next.js)

│   │   ├── src/

│   │   │   ├── app/                # App Router

│   │   │   │   ├── (auth)/

│   │   │   │   │   ├── login/

│   │   │   │   │   └── layout.tsx

│   │   │   │   ├── (dashboard)/

│   │   │   │   │   ├── dashboard/

│   │   │   │   │   ├── murid/

│   │   │   │   │   ├── guru/

│   │   │   │   │   ├── absensi/

│   │   │   │   │   ├── keuangan/

│   │   │   │   │   ├── asesmen/

│   │   │   │   │   ├── bk/

│   │   │   │   │   ├── ppid/

│   │   │   │   │   ├── alumni/

│   │   │   │   │   ├── laporan/

│   │   │   │   │   └── pengaturan/

│   │   │   │   ├── api/            # API Routes

│   │   │   │   │   ├── auth/

│   │   │   │   │   ├── murid/

│   │   │   │   │   ├── absensi/

│   │   │   │   │   ├── keuangan/

│   │   │   │   │   └── ...

│   │   │   │   ├── layout.tsx

│   │   │   │   └── page.tsx

│   │   │   ├── components/

│   │   │   │   ├── ui/             # shadcn/ui + Radix

│   │   │   │   ├── layout/         # Sidebar, TopBar

│   │   │   │   ├── charts/         # Recharts

│   │   │   │   └── forms/          # React Hook Form

│   │   │   ├── lib/

│   │   │   │   ├── auth.ts

│   │   │   │   ├── db.ts

│   │   │   │   └── utils.ts

│   │   │   └── styles/

│   │   │       └── globals.css

│   │   ├── public/

│   │   ├── next.config.js

│   │   ├── tailwind.config.js

│   │   ├── tsconfig.json

│   │   └── package.json

│   │

│   └── mobile/                     # PWA Murid \& Guru (Next.js)

│       ├── src/

│       │   ├── app/

│       │   │   ├── (auth)/

│       │   │   ├── (app)/

│       │   │   │   ├── beranda/

│       │   │   │   ├── absensi/

│       │   │   │   ├── riwayat/

│       │   │   │   ├── profil/

│       │   │   │   ├── tagihan/

│       │   │   │   ├── prestasi/

│       │   │   │   └── asesmen/

│       │   │   ├── api/

│       │   │   ├── manifest.json   # PWA manifest

│       │   │   ├── sw.js           # Service worker

│       │   │   └── layout.tsx

│       │   ├── components/

│       │   │   ├── ui/             # Radix Primitives

│       │   │   ├── absensi/        # GPS + Selfie

│       │   │   │   ├── AbsenDialog.tsx

│       │   │   │   ├── CameraView.tsx

│       │   │   │   ├── WatermarkCanvas.tsx

│       │   │   │   ├── GPSValidator.tsx

│       │   │   │   └── RadiusValidator.tsx

│       │   │   ├── profil/

│       │   │   └── layout/

│       │   ├── lib/

│       │   │   ├── auth.ts

│       │   │   ├── gps.ts          # Haversine

│       │   │   ├── camera.ts       # Camera API

│       │   │   ├── watermark.ts    # Canvas

│       │   │   └── upload.ts       # Upload foto

│       │   └── styles/

│       ├── public/

│       │   ├── icons/              # PWA icons

│       │   └── images/

│       ├── next.config.js

│       ├── tailwind.config.js

│       ├── tsconfig.json

│       └── package.json

│

├── packages/

│   ├── ui/                         # Shared components

│   │   ├── src/

│   │   │   ├── button.tsx

│   │   │   ├── dialog.tsx

│   │   │   ├── tabs.tsx

│   │   │   ├── avatar.tsx

│   │   │   ├── toast.tsx

│   │   │   ├── select.tsx

│   │   │   ├── checkbox.tsx

│   │   │   ├── card.tsx

│   │   │   ├── badge.tsx

│   │   │   └── index.ts

│   │   ├── package.json

│   │   └── tsconfig.json

│   │

│   ├── db/                         # Prisma schema \& client

│   │   ├── prisma/

│   │   │   ├── schema.prisma

│   │   │   ├── migrations/

│   │   │   └── seed.ts

│   │   ├── src/

│   │   │   └── index.ts

│   │   ├── package.json

│   │   └── tsconfig.json

│   │

│   ├── auth/                       # NextAuth config

│   │   ├── src/

│   │   │   ├── config.ts

│   │   │   ├── providers.ts

│   │   │   ├── callbacks.ts

│   │   │   └── index.ts

│   │   ├── package.json

│   │   └── tsconfig.json

│   │

│   ├── theme/                      # Shared theme (Radix Colors)

│   │   ├── src/

│   │   │   ├── colors.ts

│   │   │   ├── tokens.ts

│   │   │   └── index.ts

│   │   ├── package.json

│   │   └── tsconfig.json

│   │

│   └── utils/                      # Helper functions

│       ├── src/

│       │   ├── format.ts           # Format tanggal, uang

│       │   ├── validation.ts       # Zod schemas

│       │   ├── constants.ts        # Konstanta

│       │   └── index.ts

│       ├── package.json

│       └── tsconfig.json

│

├── docker/

│   ├── Dockerfile.admin

│   ├── Dockerfile.mobile

│   ├── docker-compose.yml

│   ├── docker-compose.prod.yml

│   ├── nginx.conf

│   ├── .env.example

│   └── entrypoint.sh

│

├── docs/

│   ├── PRD.md

│   ├── architecture.md

│   ├── DESIGN.md

│   └── DASHBOARD-DESIGN.md

│

├── .github/

│   └── workflows/

│       ├── ci.yml

│       └── deploy.yml

│

├── TASKS.md

├── RULES.md

├── memory.md

├── package.json

├── pnpm-workspace.yaml

├── .gitignore

├── .env.example

├── .eslintrc.js

├── .prettierrc

├── README.md

└── LICENSE

```



\---



\## 5. URL Strategy



\### 5.1. Produksi (Subdomain)



| Aplikasi | URL | Pengguna |

|---|---|---|

| \*\*Landing\*\* | `https://dzitoe.sman20tangerang.sch.id` | Publik |

| \*\*Admin\*\* | `https://admin.dzitoe.sman20tangerang.sch.id` | Kepsek, TU, Admin |

| \*\*Mobile\*\* | `https://app.dzitoe.sman20tangerang.sch.id` | Murid, Guru, Ortu |

| \*\*API\*\* | `https://api.dzitoe.sman20tangerang.sch.id` | Internal |

| \*\*PPID\*\* | `https://ppid.dzitoe.sman20tangerang.sch.id` | Publik |



\### 5.2. Development (Localhost)



| Aplikasi | URL |

|---|---|

| \*\*Admin\*\* | `http://localhost:3000` |

| \*\*Mobile\*\* | `http://localhost:3001` |

| \*\*API\*\* | `http://localhost:3000/api` |

| \*\*Prisma Studio\*\* | `http://localhost:5555` |



\### 5.3. LAN (Tanpa Internet)



| Aplikasi | URL |

|---|---|

| \*\*Admin\*\* | `http://192.168.1.100:3000` |

| \*\*Mobile\*\* | `http://192.168.1.100:3001` |

| \*\*Local DNS\*\* | `http://dzitoe.local` |



\---



\## 6. Database Schema (Prisma)



\### 6.1. Auth \& User



```prisma

model User {

&#x20; id            String    @id @default(cuid())

&#x20; email         String    @unique

&#x20; username      String    @unique

&#x20; password      String    // bcrypt

&#x20; name          String

&#x20; role          Role      @default(MURID)

&#x20; avatar        String?

&#x20; isActive      Boolean   @default(true)

&#x20; createdAt     DateTime  @default(now())

&#x20; updatedAt     DateTime  @updatedAt



&#x20; murid         Murid?

&#x20; guru          Guru?

&#x20; sessions      Session\[]



&#x20; @@index(\[email])

&#x20; @@index(\[username])

&#x20; @@index(\[role])

}



enum Role {

&#x20; ADMIN

&#x20; KEPALA\_SEKOLAH

&#x20; TU

&#x20; GURU

&#x20; MURID

&#x20; ORANG\_TUA

&#x20; GURU\_BK

&#x20; PETUGAS\_PPID

}



model Session {

&#x20; id           String   @id @default(cuid())

&#x20; userId       String

&#x20; token        String   @unique

&#x20; expiresAt    DateTime

&#x20; createdAt    DateTime @default(now())



&#x20; user         User     @relation(fields: \[userId], references: \[id], onDelete: Cascade)



&#x20; @@index(\[userId])

&#x20; @@index(\[token])

}

```



\### 6.2. Murid



```prisma

model Murid {

&#x20; id            String    @id @default(cuid())

&#x20; userId        String    @unique

&#x20; nis           String    @unique

&#x20; nisn          String?   @unique

&#x20; nama          String

&#x20; jenisKelamin  JenisKelamin

&#x20; tempatLahir   String?

&#x20; tanggalLahir  DateTime?

&#x20; alamat        String?

&#x20; foto          String?

&#x20; kelasId       String?

&#x20; status        StatusMurid @default(AKTIF)

&#x20; createdAt     DateTime  @default(now())

&#x20; updatedAt     DateTime  @updatedAt



&#x20; user          User      @relation(fields: \[userId], references: \[id])

&#x20; kelas         Kelas?    @relation(fields: \[kelasId], references: \[id])

&#x20; orangTua      OrangTua\[]

&#x20; absensi       Absensi\[]

&#x20; asesmen       Asesmen\[]

&#x20; prestasi      Prestasi\[]

&#x20; kesehatan     Kesehatan\[]

&#x20; bk            PelayananBK\[]

&#x20; tagihan       Tagihan\[]

&#x20; pembayaran    Pembayaran\[]

&#x20; ekstrakurikuler PesertaEkstra\[]



&#x20; @@index(\[nis])

&#x20; @@index(\[nisn])

&#x20; @@index(\[kelasId])

&#x20; @@index(\[status])

}



enum JenisKelamin {

&#x20; LAKI\_LAKI

&#x20; PEREMPUAN

}



enum StatusMurid {

&#x20; AKTIF

&#x20; LULUS

&#x20; MUTASI

&#x20; KELUAR

}

```



\### 6.3. Guru \& Tendik



```prisma

model Guru {

&#x20; id            String    @id @default(cuid())

&#x20; userId        String    @unique

&#x20; nip           String?   @unique

&#x20; nuptk         String?   @unique

&#x20; nama          String

&#x20; jenisKelamin  JenisKelamin

&#x20; jabatan       String?

&#x20; mataPelajaran String?

&#x20; status        StatusGuru @default(AKTIF)

&#x20; createdAt     DateTime  @default(now())

&#x20; updatedAt     DateTime  @updatedAt



&#x20; user          User      @relation(fields: \[userId], references: \[id])

&#x20; absensi       AbsensiGuru\[]

&#x20; kelasWali     Kelas\[]



&#x20; @@index(\[nip])

&#x20; @@index(\[nuptk])

&#x20; @@index(\[status])

}



enum StatusGuru {

&#x20; AKTIF

&#x20; CUTI

&#x20; PENSIUN

&#x20; MUTASI

}

```



\### 6.4. Kelas



```prisma

model Kelas {

&#x20; id            String    @id @default(cuid())

&#x20; nama          String    // "XII IPA 1"

&#x20; tingkat       String    // "XII"

&#x20; waliKelasId   String?

&#x20; jumlahMurid   Int       @default(0)

&#x20; createdAt     DateTime  @default(now())



&#x20; waliKelas     Guru?     @relation(fields: \[waliKelasId], references: \[id])

&#x20; murid         Murid\[]

&#x20; jadwal        Jadwal\[]



&#x20; @@index(\[tingkat])

}

```



\### 6.5. Orang Tua



```prisma

model OrangTua {

&#x20; id            String    @id @default(cuid())

&#x20; muridId       String

&#x20; nama          String

&#x20; hubungan      Hubungan

&#x20; nomorHp       String

&#x20; email         String?

&#x20; pekerjaan     String?

&#x20; alamat        String?

&#x20; createdAt     DateTime  @default(now())



&#x20; murid         Murid     @relation(fields: \[muridId], references: \[id], onDelete: Cascade)



&#x20; @@index(\[muridId])

}



enum Hubungan {

&#x20; AYAH

&#x20; IBU

&#x20; WALI

}

```



\### 6.6. Absensi (GPS + Foto Selfie)



```prisma

model Absensi {

&#x20; id                String    @id @default(cuid())

&#x20; muridId           String

&#x20; tanggal           DateTime  @db.Date

&#x20; jamMasuk          DateTime?

&#x20; jamPulang         DateTime?

&#x20; status            StatusAbsensi

&#x20; latitude          Float?

&#x20; longitude         Float?

&#x20; accuracy          Float?

&#x20; distanceFromSchool Float?

&#x20; isWithinRadius    Boolean   @default(false)

&#x20; isMockLocation    Boolean   @default(false)

&#x20; selfieUrl         String?

&#x20; selfieThumbnail   String?

&#x20; watermarkText     String?

&#x20; deviceInfo        Json?

&#x20; verifiedBy        String?

&#x20; verifiedAt        DateTime?

&#x20; notes             String?

&#x20; createdAt         DateTime  @default(now())



&#x20; murid             Murid     @relation(fields: \[muridId], references: \[id], onDelete: Cascade)



&#x20; @@unique(\[muridId, tanggal])

&#x20; @@index(\[tanggal])

&#x20; @@index(\[status])

&#x20; @@index(\[isWithinRadius])

}



enum StatusAbsensi {

&#x20; HADIR

&#x20; TERLAMBAT

&#x20; IZIN

&#x20; SAKIT

&#x20; ALPA

}

```



\### 6.7. Absensi Guru



```prisma

model AbsensiGuru {

&#x20; id                String    @id @default(cuid())

&#x20; guruId            String

&#x20; tanggal           DateTime  @db.Date

&#x20; jamMasuk          DateTime?

&#x20; jamPulang         DateTime?

&#x20; status            StatusAbsensi

&#x20; latitude          Float?

&#x20; longitude         Float?

&#x20; accuracy          Float?

&#x20; distanceFromSchool Float?

&#x20; isWithinRadius    Boolean   @default(false)

&#x20; isMockLocation    Boolean   @default(false)

&#x20; selfieUrl         String?

&#x20; selfieThumbnail   String?

&#x20; watermarkText     String?

&#x20; deviceInfo        Json?

&#x20; keterangan        String?

&#x20; createdAt         DateTime  @default(now())



&#x20; guru              Guru      @relation(fields: \[guruId], references: \[id], onDelete: Cascade)



&#x20; @@unique(\[guruId, tanggal])

&#x20; @@index(\[tanggal])

&#x20; @@index(\[status])

}

```



\### 6.8. Jadwal



```prisma

model Jadwal {

&#x20; id            String    @id @default(cuid())

&#x20; kelasId       String

&#x20; mataPelajaran String

&#x20; guruId        String?

&#x20; hari          Hari

&#x20; jamMulai      String    // "07:00"

&#x20; jamSelesai    String    // "08:30"

&#x20; ruang         String?

&#x20; createdAt     DateTime  @default(now())



&#x20; kelas         Kelas     @relation(fields: \[kelasId], references: \[id], onDelete: Cascade)



&#x20; @@index(\[kelasId])

&#x20; @@index(\[hari])

}



enum Hari {

&#x20; SENIN

&#x20; SELASA

&#x20; RABU

&#x20; KAMIS

&#x20; JUMAT

&#x20; SABTU

}

```



\### 6.9. Asesmen



```prisma

model Asesmen {

&#x20; id            String    @id @default(cuid())

&#x20; muridId       String

&#x20; jenis         JenisAsesmen

&#x20; mataPelajaran String

&#x20; nilai         Float

&#x20; tanggal       DateTime

&#x20; semester      String

&#x20; tahunAjaran   String

&#x20; catatan       String?

&#x20; createdAt     DateTime  @default(now())



&#x20; murid         Murid     @relation(fields: \[muridId], references: \[id], onDelete: Cascade)



&#x20; @@index(\[muridId])

&#x20; @@index(\[tanggal])

&#x20; @@index(\[mataPelajaran])

}



enum JenisAsesmen {

&#x20; FORMATIF

&#x20; SUMATIF

&#x20; DIAGNOSTIK

&#x20; PROYEK

}

```



\### 6.10. Prestasi



```prisma

model Prestasi {

&#x20; id            String    @id @default(cuid())

&#x20; muridId       String

&#x20; jenis         JenisPrestasi

&#x20; nama          String

&#x20; tingkat       Tingkat

&#x20; peringkat     String?

&#x20; tahun         Int

&#x20; penyelenggara String?

&#x20; sertifikat    String?

&#x20; createdAt     DateTime  @default(now())



&#x20; murid         Murid     @relation(fields: \[muridId], references: \[id], onDelete: Cascade)



&#x20; @@index(\[muridId])

&#x20; @@index(\[jenis])

&#x20; @@index(\[tingkat])

}



enum JenisPrestasi {

&#x20; AKADEMIK

&#x20; NON\_AKADEMIK

}



enum Tingkat {

&#x20; SEKOLAH

&#x20; KECAMATAN

&#x20; KABUPATEN

&#x20; PROVINSI

&#x20; NASIONAL

&#x20; INTERNASIONAL

}

```



\### 6.11. Kesehatan



```prisma

model Kesehatan {

&#x20; id            String    @id @default(cuid())

&#x20; muridId       String

&#x20; jenis         JenisKesehatan

&#x20; keterangan    String

&#x20; tanggal       DateTime?

&#x20; penanganan    String?

&#x20; createdAt     DateTime  @default(now())



&#x20; murid         Murid     @relation(fields: \[muridId], references: \[id], onDelete: Cascade)



&#x20; @@index(\[muridId])

&#x20; @@index(\[jenis])

}



enum JenisKesehatan {

&#x20; RIWAYAT\_PENYAKIT

&#x20; ALERGI

&#x20; OBAT

&#x20; IMUNISASI

&#x20; PEMERIKSAAN

&#x20; CATATAN\_MEDIS

}

```



\### 6.12. Pelayanan BK



```prisma

model PelayananBK {

&#x20; id            String    @id @default(cuid())

&#x20; muridId       String

&#x20; jenis         JenisBK

&#x20; konselor      String

&#x20; tanggal       DateTime

&#x20; permasalahan  String

&#x20; solusi        String?

&#x20; status        StatusBK    @default(OPEN)

&#x20; createdAt     DateTime  @default(now())



&#x20; murid         Murid     @relation(fields: \[muridId], references: \[id], onDelete: Cascade)



&#x20; @@index(\[muridId])

&#x20; @@index(\[jenis])

&#x20; @@index(\[status])

}



enum JenisBK {

&#x20; KONSELING\_INDIVIDU

&#x20; KONSELING\_KELOMPOK

&#x20; BIMBINGAN\_KARIR

&#x20; DISIPLIN\_POSITIF

&#x20; RUJUKAN

}



enum StatusBK {

&#x20; OPEN

&#x20; IN\_PROGRESS

&#x20; RESOLVED

&#x20; CLOSED

}

```



\### 6.13. Keuangan



```prisma

model JenisTagihan {

&#x20; id            String    @id @default(cuid())

&#x20; nama          String    // "SPP", "Uang Gedung", "Seragam"

&#x20; nominal       Decimal   @db.Decimal(12, 2)

&#x20; periode       Periode

&#x20; jatuhTempo    DateTime?

&#x20; createdAt     DateTime  @default(now())



&#x20; tagihan       Tagihan\[]



&#x20; @@index(\[periode])

}



enum Periode {

&#x20; SEKALI

&#x20; BULANAN

&#x20; SEMESTER

&#x20; TAHUNAN

}



model Tagihan {

&#x20; id            String    @id @default(cuid())

&#x20; muridId       String

&#x20; jenisTagihanId String

&#x20; nominal       Decimal   @db.Decimal(12, 2)

&#x20; sisa          Decimal   @db.Decimal(12, 2)

&#x20; jatuhTempo    DateTime

&#x20; status        StatusTagihan @default(BELUM\_LUNAS)

&#x20; bisaCicil     Boolean   @default(false)

&#x20; jumlahCicilan Int?

&#x20; createdAt     DateTime  @default(now())



&#x20; murid         Murid     @relation(fields: \[muridId], references: \[id], onDelete: Cascade)

&#x20; jenisTagihan  JenisTagihan @relation(fields: \[jenisTagihanId], references: \[id])

&#x20; pembayaran    Pembayaran\[]



&#x20; @@index(\[muridId])

&#x20; @@index(\[status])

&#x20; @@index(\[jatuhTempo])

}



enum StatusTagihan {

&#x20; BELUM\_LUNAS

&#x20; CICILAN

&#x20; LUNAS

&#x20; TUNGGAKAN

}



model Pembayaran {

&#x20; id            String    @id @default(cuid())

&#x20; tagihanId     String

&#x20; muridId       String

&#x20; nominal       Decimal   @db.Decimal(12, 2)

&#x20; metode        MetodePembayaran

&#x20; cicilanKe     Int?

&#x20; tanggal       DateTime  @default(now())

&#x20; bukti         String?

&#x20; verifiedBy    String?

&#x20; verifiedAt    DateTime?

&#x20; createdAt     DateTime  @default(now())



&#x20; tagihan       Tagihan   @relation(fields: \[tagihanId], references: \[id], onDelete: Cascade)

&#x20; murid         Murid     @relation(fields: \[muridId], references: \[id], onDelete: Cascade)



&#x20; @@index(\[tagihanId])

&#x20; @@index(\[muridId])

&#x20; @@index(\[tanggal])

}



enum MetodePembayaran {

&#x20; TUNAI

&#x20; TRANSFER

&#x20; QRIS

&#x20; VA

}

```



\### 6.14. Ekstrakurikuler



```prisma

model Ekstrakurikuler {

&#x20; id            String    @id @default(cuid())

&#x20; nama          String

&#x20; pembina       String?

&#x20; jadwal        String?

&#x20; lokasi        String?

&#x20; createdAt     DateTime  @default(now())



&#x20; peserta       PesertaEkstra\[]



&#x20; @@index(\[nama])

}



model PesertaEkstra {

&#x20; id                String    @id @default(cuid())

&#x20; muridId           String

&#x20; ekstrakurikulerId String

&#x20; createdAt         DateTime  @default(now())



&#x20; murid             Murid     @relation(fields: \[muridId], references: \[id], onDelete: Cascade)

&#x20; ekstrakurikuler   Ekstrakurikuler @relation(fields: \[ekstrakurikulerId], references: \[id], onDelete: Cascade)



&#x20; @@unique(\[muridId, ekstrakurikulerId])

&#x20; @@index(\[muridId])

&#x20; @@index(\[ekstrakurikulerId])

}

```



\### 6.15. Alumni



```prisma

model Alumni {

&#x20; id            String    @id @default(cuid())

&#x20; nisn          String    @unique

&#x20; nama          String

&#x20; tahunLulus    Int

&#x20; kelasTerakhir String

&#x20; nomorHp       String?

&#x20; email         String?

&#x20; lanjutanStudi String?

&#x20; pekerjaan     String?

&#x20; createdAt     DateTime  @default(now())



&#x20; @@index(\[tahunLulus])

&#x20; @@index(\[nisn])

}

```



\### 6.16. PPID



```prisma

model InformasiPublik {

&#x20; id            String    @id @default(cuid())

&#x20; judul         String

&#x20; kategori      String

&#x20; deskripsi     String?

&#x20; file          String?

&#x20; tanggal       DateTime  @default(now())

&#x20; createdAt     DateTime  @default(now())



&#x20; @@index(\[kategori])

&#x20; @@index(\[tanggal])

}



model PermohonanInformasi {

&#x20; id            String    @id @default(cuid())

&#x20; pemohon       String

&#x20; kontak        String

&#x20; informasi     String

&#x20; status        StatusPermohonan @default(PENDING)

&#x20; tanggal       DateTime  @default(now())

&#x20; createdAt     DateTime  @default(now())



&#x20; @@index(\[status])

&#x20; @@index(\[tanggal])

}



enum StatusPermohonan {

&#x20; PENDING

&#x20; DIPROSES

&#x20; SELESAI

&#x20; DITOLAK

}

```



\### 6.17. Pengaturan



```prisma

model Pengaturan {

&#x20; id            String    @id @default(cuid())

&#x20; key           String    @unique

&#x20; value         String

&#x20; updatedAt     DateTime  @updatedAt



&#x20; @@index(\[key])

}



model TahunAjaran {

&#x20; id            String    @id @default(cuid())

&#x20; tahun         String    // "2025/2026"

&#x20; semester      Semester

&#x20; isActive      Boolean   @default(false)

&#x20; createdAt     DateTime  @default(now())



&#x20; @@index(\[tahun])

&#x20; @@index(\[isActive])

}



enum Semester {

&#x20; GANJIL

&#x20; GENAP

}

```

// ============ KURIKULUM MERDEKA ============
model KelasKurikulum {
  id            String    @id @default(cuid())
  kelas         String    // "X", "XI", "XII"
  semester      Semester
  mapelId       String
  createdAt     DateTime  @default(now())

  mapel         MataPelajaran @relation(fields: [mapelId], references: [id])
  bab           Bab[]

  @@unique([kelas, semester, mapelId])
  @@index([kelas])
}

model MataPelajaran {
  id            String    @id @default(cuid())
  nama          String    // "Matematika", "Fisika"
  kode          String    @unique
  deskripsi     String?
  createdAt     DateTime  @default(now())

  kelasKurikulum KelasKurikulum[]
  bankSoal      BankSoal[]

  @@index([kode])
}

model Bab {
  id            String    @id @default(cuid())
  kelasKurikulumId String
  nama          String    // "Bilangan Berpangkat"
  urutan        Int
  deskripsi     String?
  createdAt     DateTime  @default(now())

  kelasKurikulum KelasKurikulum @relation(fields: [kelasKurikulumId], references: [id], onDelete: Cascade)
  materi        Materi[]
  bankSoal      BankSoal[]

  @@index([kelasKurikulumId])
  @@index([urutan])
}

model Materi {
  id            String    @id @default(cuid())
  babId         String
  nama          String    // "Sifat-sifat Bilangan Berpangkat"
  deskripsi     String?
  capaianPembelajaran (CP) String?
  tujuanPembelajaran (TP) String?
  alurTujuanPembelajaran (ATP) String?
  createdAt     DateTime  @default(now())

  bab           Bab       @relation(fields: [babId], references: [id], onDelete: Cascade)
  bankSoal      BankSoal[]

  @@index([babId])
}

enum Semester {
  GANJIL
  GENAP
}

// ============ BANK SOAL ============
model BankSoal {
  id            String    @id @default(cuid())
  guruId        String
  kelasKurikulumId String
  babId         String?
  materiId      String?
  mapelId       String
  jenisSoal     JenisSoal
  tingkatKesulitan TingkatKesulitan
  pertanyaan    String    @db.Text
  jawaban       Json      // Struktur sesuai jenis soal
  pembahasan    String?   @db.Text
  paragraf      String?   @db.Text  // Untuk soal dengan paragraf
  paragrafId    String?   // Group soal dalam 1 paragraf
  sumber        SumberSoal // MANUAL, AI, IMPORT
  aiPrompt      String?   @db.Text
  aiModel       String?   // "deepseek-chat", "gpt-4", dll
  aiGeneratedAt DateTime?
  tags          String[]
  isPublished   Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  guru          Guru      @relation(fields: [guruId], references: [id])
  kelasKurikulum KelasKurikulum @relation(fields: [kelasKurikulumId], references: [id])
  bab           Bab?      @relation(fields: [babId], references: [id])
  materi        Materi?   @relation(fields: [materiId], references: [id])
  mapel         MataPelajaran @relation(fields: [mapelId], references: [id])
  paketSoal     PaketSoalItem[]
  jawabanMurid  JawabanUjian[]

  @@index([guruId])
  @@index([mapelId])
  @@index([jenisSoal])
  @@index([sumber])
  @@index([paragrafId])
}

enum JenisSoal {
  PILIHAN_GANDA           // Single answer
  PILIHAN_GANDA_MULTI     // Multiple answers
  BENAR_SALAH
  MENCOCOKKAN             // Matching
  ISIAN_SINGKAT
  MENGURUTKAN             // Ordering
  JAWABAN_BERBASIS_POIN   // Point-based
  JAWABAN_PANJANG         // Essay
}

enum TingkatKesulitan {
  MUDAH
  SEDANG
  SULIT
}

enum SumberSoal {
  MANUAL
  AI
  IMPORT
}

// ============ PARAGRAF (untuk soal dengan paragraf) ============
model Paragraf {
  id            String    @id @default(cuid())
  guruId        String
  judul         String?
  konten        String    @db.Text
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  bankSoal      BankSoal[]

  @@index([guruId])
}

// ============ PAKET SOAL ============
model PaketSoal {
  id            String    @id @default(cuid())
  guruId        String
  nama          String
  mapelId       String
  kelas         String
  semester      Semester
  jumlahSoal    Int
  durasi        Int       // menit
  createdAt     DateTime  @default(now())

  guru          Guru      @relation(fields: [guruId], references: [id])
  mapel         MataPelajaran @relation(fields: [mapelId], references: [id])
  items         PaketSoalItem[]
  ujian         Ujian[]
}

model PaketSoalItem {
  id            String    @id @default(cuid())
  paketSoalId   String
  bankSoalId    String
  urutan        Int
  bobot         Float     @default(1.0)
  createdAt     DateTime  @default(now())

  paketSoal     PaketSoal @relation(fields: [paketSoalId], references: [id], onDelete: Cascade)
  bankSoal      BankSoal  @relation(fields: [bankSoalId], references: [id])

  @@unique([paketSoalId, urutan])
  @@index([paketSoalId])
}

// ============ UJIAN ============
model Ujian {
  id            String    @id @default(cuid())
  paketSoalId   String
  nama          String
  tanggalMulai  DateTime
  tanggalSelesai DateTime
  durasi        Int       // menit
  mode          ModeUjian
  status        StatusUjian @default(DRAFT)
  createdAt     DateTime  @default(now())

  paketSoal     PaketSoal @relation(fields: [paketSoalId], references: [id])
  peserta       PesertaUjian[]
  jawaban       JawabanUjian[]
}

enum ModeUjian {
  ONLINE
  OFFLINE
}

enum StatusUjian {
  DRAFT
  PUBLISHED
  ONGOING
  COMPLETED
  CANCELLED
}

model PesertaUjian {
  id            String    @id @default(cuid())
  ujianId       String
  muridId       String
  status        StatusPeserta @default(BELUM_MULAI)
  nilai         Float?
  mulaiAt       DateTime?
  selesaiAt     DateTime?
  createdAt     DateTime  @default(now())

  ujian         Ujian     @relation(fields: [ujianId], references: [id], onDelete: Cascade)
  murid         Murid     @relation(fields: [muridId], references: [id])

  @@unique([ujianId, muridId])
  @@index([ujianId])
}

enum StatusPeserta {
  BELUM_MULAI
  MENGERJAKAN
  SELESAI
  TERLAMBAT
}

model JawabanUjian {
  id            String    @id @default(cuid())
  ujianId       String
  muridId       String
  bankSoalId    String
  jawaban       Json
  isBenar       Boolean?
  poin          Float?
  feedback      String?
  createdAt     DateTime  @default(now())

  ujian         Ujian     @relation(fields: [ujianId], references: [id], onDelete: Cascade)
  murid         Murid     @relation(fields: [muridId], references: [id])
  bankSoal      BankSoal  @relation(fields: [bankSoalId], references: [id])

  @@unique([ujianId, muridId, bankSoalId])
  @@index([ujianId])
  @@index([muridId])
}

\---



\## 7. API Endpoints



\### 7.1. Auth



| Method | Endpoint | Deskripsi | Role |

|---|---|---|---|

| POST | `/api/auth/login` | Login | Public |

| POST | `/api/auth/logout` | Logout | Auth |

| GET | `/api/auth/session` | Session | Auth |

| POST | `/api/auth/register` | Register (admin only) | Admin |



\### 7.2. Murid



| Method | Endpoint | Deskripsi | Role |

|---|---|---|---|

| GET | `/api/murid` | List murid | Admin, TU, Guru |

| POST | `/api/murid` | Tambah murid | Admin, TU |

| GET | `/api/murid/:id` | Detail murid | Admin, TU, Guru |

| PUT | `/api/murid/:id` | Update murid | Admin, TU |

| DELETE | `/api/murid/:id` | Hapus murid | Admin |

| GET | `/api/murid/:id/profil-360` | Profil 360° | Admin, TU, Guru, Ortu |



\### 7.3. Absensi



| Method | Endpoint | Deskripsi | Role |

|---|---|---|---|

| POST | `/api/absensi/masuk` | Absen masuk (GPS + Selfie) | Murid |

| POST | `/api/absensi/pulang` | Absen pulang | Murid |

| GET | `/api/absensi/riwayat` | Riwayat absensi | Murid, Ortu |

| GET | `/api/absensi/rekap` | Rekap absensi | Admin, TU, Guru |

| POST | `/api/absensi/verifikasi` | Verifikasi manual | Admin, TU |

| GET | `/api/absensi/lokasi` | Lokasi absensi | Admin,


### 7.6. Bank Soal
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| GET | `/api/bank-soal` | List bank soal | Guru, Admin |
| POST | `/api/bank-soal` | Tambah soal manual | Guru |
| GET | `/api/bank-soal/:id` | Detail soal | Guru |
| PUT | `/api/bank-soal/:id` | Update soal | Guru |
| DELETE | `/api/bank-soal/:id` | Hapus soal | Guru |
| POST | `/api/bank-soal/import` | Import soal Excel | Guru |
| GET | `/api/bank-soal/export` | Export soal | Guru |

### 7.7. AI Bank Soal
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| POST | `/api/ai/generate-soal` | Generate soal dengan AI | Guru |
| GET | `/api/ai/generate-soal/:jobId` | Cek status generate | Guru |
| POST | `/api/ai/generate-soal/:jobId/save` | Simpan hasil ke bank soal | Guru |
| POST | `/api/ai/regenerate` | Regenerate soal | Guru |
| POST | `/api/ai/feedback` | Feedback untuk improve AI | Guru |

### 7.8. Kurikulum Merdeka
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| GET | `/api/kurikulum/kelas` | List kelas | Semua |
| GET | `/api/kurikulum/mapel` | List mapel | Semua |
| GET | `/api/kurikulum/bab` | List bab | Semua |
| GET | `/api/kurikulum/materi` | List materi | Semua |
| GET | `/api/kurikulum/cp` | Capaian Pembelajaran | Semua |
| GET | `/api/kurikulum/tp` | Tujuan Pembelajaran | Semua |
| GET | `/api/kurikulum/atp` | Alur Tujuan Pembelajaran | Semua |

### 7.9. Paket Soal
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| GET | `/api/paket-soal` | List paket soal | Guru |
| POST | `/api/paket-soal` | Buat paket soal | Guru |
| POST | `/api/paket-soal/:id/items` | Tambah soal ke paket | Guru |
| DELETE | `/api/paket-soal/:id/items/:itemId` | Hapus soal dari paket | Guru |

### 7.10. Ujian
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| GET | `/api/ujian` | List ujian | Guru, Admin |
| POST | `/api/ujian` | Buat ujian | Guru |
| PUT | `/api/ujian/:id` | Update ujian | Guru |
| POST | `/api/ujian/:id/publish` | Publish ujian | Guru |
| GET | `/api/ujian/:id/hasil` | Hasil ujian | Guru |
| GET | `/api/ujian/:id/analisis` | Analisis butir soal | Guru |


### 8.1. Keamanan AI
| Aspek | Implementasi |
|---|---|
| **API Key** | Simpan di environment variable, jangan di kode |
| **Rate Limit** | Batasi request AI per guru (misal: 100 soal/hari) |
| **Prompt Injection** | Sanitasi input guru |
| **Output Validation** | Validasi hasil AI sebelum simpan |
| **Cache** | Cache hasil AI untuk pertanyaan sama |
| **Audit** | Log semua request AI |
| **Cost Control** | Batasi token per request |


