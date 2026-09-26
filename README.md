# DZITOE — Sistem Tata Kelola Sekolah

### SMAN 20 Kabupaten Tangerang

Sistem tata kelola sekolah terintegrasi dengan arsitektur monorepo sederhana berbasis **pnpm workspace**, **Next.js 14**, **PostgreSQL**, dan **Radix UI**, dirancang sesuai regulasi **Permendikdasmen No. 1–6 Tahun 2026**.

---

## 🔒 Konfigurasi Port & Proteksi Bentrok

Port resmi yang digunakan oleh DZITOE:
- **Admin Panel:** `http://localhost:3000`
- **Mobile (PWA):** `http://localhost:3001`
- **Database PostgreSQL:** `localhost:5433` (terisolasi dari postgres lokal)
- **Redis Cache:** `localhost:6380`

### ⛔ Port Terproteksi (Reserved - Tidak Disentuh DZITOE)
- `8000`: **ADZKIA** (Aplikasi Ujian)
- `5173`: **PERSOALAN** (Vite Dev Server)
- `5432`: PostgreSQL lokal lain
- `6379`: Redis lokal lain

Untuk memverifikasi status port kapan saja:
```bash
pnpm ports:check
```

---

## 📁 Struktur Monorepo

```
d:/GITHUB/DZITOE/
├── apps/
│   ├── admin/       # Dashboard Web Admin (Next.js 14) - Port 3000
│   └── mobile/      # PWA Murid & Guru (Next.js 14) - Port 3001
├── packages/
│   ├── shared/      # Konstanta, Port Guard, dan Environment Helpers
│   ├── ui/          # Radix UI + Tailwind Design System
│   ├── config/      # Tooling presets
│   ├── db/          # Prisma schema & Database Client
│   ├── auth/        # NextAuth.js
│   ├── theme/       # Radix Colors & Themes
│   └── utils/       # Formatters (Rupiah, tanggal) & Validasi
├── scripts/
│   └── check-ports.mjs # Script Port Guard otomatis
├── docs/            # Dokumen arsitektur, PRD, dan UI/UX
├── TASKS.md         # Daftar roadmap & task tracking
├── RULES.md         # Standar kode & konvensi penamaan
└── memory.md        # Catatan progres hidup & keputusan arsitektur
```

---

## 🚀 Perintah Dasar

```bash
# Install dependencies
pnpm install

# Validasi port
pnpm ports:check

# Periksa tipe TypeScript
pnpm typecheck

# Jalankan dev server admin
pnpm dev:admin

# Jalankan dev server mobile
pnpm dev:mobile
```
