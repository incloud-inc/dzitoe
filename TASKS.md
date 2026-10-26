\# TASKS.md — Daftar Tugas DZITOE

\## Sistem Tata Kelola Sekolah DZITOE

\### SMAN 20 Kabupaten Tangerang



> \*\*Versi:\*\* 1.0.0

> \*\*Status:\*\* Aktif

> \*\*Tanggal:\*\* 2026

> \*\*Klasifikasi:\*\* Dokumen Internal (Non-Komersial)

> \*\*Total Tugas:\*\* 250+ task

> \*\*Estimasi:\*\* 17-21 bulan



\---



\## ⚠️ ATURAN UTAMA — WAJIB DIBACA



> ### 🚨 \*\*SEMUA TUGAS HARUS DIKERJAKAN OLEH DEEPSEEK.\*\*



\*\*DILARANG\*\* mengerjakan sendiri tanpa bantuan DeepSeek.

\*\*WAJIB\*\* memanggil DeepSeek untuk setiap task.



\### Cara Memanggil DeepSeek:



```

DeepSeek, kerjakan task \[A1.1] — Setup Monorepo

```



atau



```

DeepSeek, saya mau kerjakan Fase 1.

Tolong bantu saya step-by-step.

```



\### Yang Harus Dikerjakan DeepSeek:

\- ✅ Menulis kode (TypeScript, React, Prisma)

\- ✅ Membuat komponen UI (Radix UI + Tailwind)

\- ✅ Membuat API routes

\- ✅ Membuat database schema

\- ✅ Membuat dokumentasi

\- ✅ Testing

\- ✅ Debugging

\- ✅ Deployment



\### Yang Boleh Dikerjakan Manual:

\- ❌ \*\*TIDAK ADA.\*\* Semua harus lewat DeepSeek.



\---



\## 📊 Legend



| Simbol | Arti |

|---|---|

| 🔴 | Prioritas Utama |

| 🟡 | Prioritas Menengah |

| 🟢 | Prioritas Pendukung |

| ⬜ | Belum dikerjakan |

| 🟨 | Sedang dikerjakan |

| ✅ | Selesai |

| ❌ | Dibatalkan |

| 🔒 | Blocked (menunggu task lain) |



\---



\## 🎯 Ringkasan Fase



| No | Fase | Cakupan Modul | Target dan Fokus | Status Selesai | Persentase | Status Fase |
|:--:|:-----|:--------------|:-----------------|:---------------|:----------:|:-----------:|
| 1 | **Fase 1** | A0, A1–A8, B1–B2 | Fondasi & Data Master | 96 / 96 task | **100%** | Selesai Penuh ✅ |
| 2 | **Fase 2** | A9–A13, B3–B15 | Inti Absensi (GPS, Selfie, QR) | 51 / 51 task | **100%** | Selesai Penuh ✅ |
| 3 | **Fase 3** | A14–A18 | Keuangan (Tagihan, Cicilan, Bayar) | 27 / 27 task | **100%** | Selesai Penuh ✅ |
| 4 | **Fase 4** | A20 | Bank Soal Siap Cetak (Print Only) | 20 / 20 task | **100%** | Selesai Penuh ✅ |
| 5 | **Fase 5** | A21–A23 | Layanan Murid (Prestasi, UKS, BK & Restitusi) | 13 / 13 task | **100%** | Selesai Penuh ✅ |
| 6 | **Fase 6** | A24–A25 | Portal Alumni & PPID (Publik + Backoffice) | 10 / 10 task | **100%** | Selesai Penuh ✅ |
| 7 | **Fase 7** | A26–A28 | Modul Pelaporan Terpadu (Dinas & Keuangan) | 9 / 9 task | **100%** | Selesai Penuh ✅ |
| 8 | **Fase 8** | A29–A30 | Optimalisasi Performa, Redis & Keamanan | 6 / 6 task | **100%** | Selesai Penuh ✅ |

**Total:** 232 / 232 task selesai (**100%**) — Proyek DZITOE Tuntas Penuh 🎉



\---



\## 🏗️ FASE 1: Fondasi \& Data Master (2-3 bulan)



> \*\*Tujuan:\*\* Sistem dasar berjalan, data master siap.

> \*\*Output:\*\* Login, dashboard, manajemen murid \& guru.



\### A. Setup Proyek



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A0.1 | Inisialisasi monorepo dengan pnpm workspace | 🔴 | ✅ | Wajib | 1 hari |

| A0.2 | Setup Next.js 14 untuk `apps/admin` | 🔴 | ✅ | Wajib | 1 hari |

| A0.3 | Setup Next.js 14 untuk `apps/mobile` | 🔴 | ✅ | Wajib | 1 hari |

| A0.4 | Setup Tailwind CSS | 🔴 | ✅ | Wajib | 0.5 hari |

| A0.5 | Setup Radix UI (Primitives, Themes, Colors, Icons) | 🔴 | ✅ | Wajib | 1 hari |

| A0.6 | Setup Prisma + PostgreSQL | 🔴 | ✅ | Wajib | 1 hari |

| A0.7 | Setup NextAuth.js | 🔴 | ✅ | Wajib | 1 hari |

| A0.8 | Setup Docker Compose | 🔴 | ✅ | Wajib | 1 hari |

| A0.9 | Setup Nginx reverse proxy | 🔴 | ✅ | Wajib | 0.5 hari |

| A0.10 | Setup CI/CD (GitHub Actions) | 🟡 | ✅ | Wajib | 1 hari |

| A0.11 | Setup ESLint + Prettier + Husky | 🟡 | ✅ | Wajib | 0.5 hari |

| A0.12 | Setup Vitest + Playwright | 🟡 | ✅ | Wajib | 1 hari |



\*\*Subtotal:\*\* 12 task, estimasi 11 hari



\---



\### B. Modul A1: Autentikasi \& Otorisasi



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A1.1 | Schema User \& Role (Prisma) | 🔴 | ✅ | Wajib | 0.5 hari |

| A1.2 | API login, logout, session | 🔴 | ✅ | Wajib | 1 hari |

| A1.3 | Halaman login admin | 🔴 | ✅ | Wajib | 1 hari |

| A1.4 | Halaman login mobile | 🔴 | ✅ | Wajib | 1 hari |

| A1.5 | Middleware proteksi route | 🔴 | ✅ | Wajib | 0.5 hari |

| A1.6 | Hak akses per role | 🔴 | ✅ | Wajib | 1 hari |

| A1.7 | Forgot password | 🟡 | ✅ | Wajib | 1 hari |

| A1.8 | Session management | 🟡 | ✅ | Wajib | 0.5 hari |

| A1.9 | Audit log login | 🟢 | ✅ | Wajib | 0.5 hari |



\*\*Subtotal:\*\* 9 task, estimasi 7 hari



\---



\### C. Modul A2: Pengaturan Sekolah



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A2.1 | Schema Pengaturan \& TahunAjaran | 🔴 | ✅ | Wajib | 0.5 hari |

| A2.2 | API profil sekolah | 🔴 | ✅ | Wajib | 1 hari |

| A2.3 | API tahun ajaran | 🔴 | ✅ | Wajib | 1 hari |

| A2.4 | Halaman pengaturan sekolah | 🔴 | ✅ | Wajib | 1 hari |

| A2.5 | Konfigurasi titik lokasi sekolah | 🔴 | ✅ | Wajib | 1 hari |

| A2.6 | Upload logo sekolah | 🟡 | ✅ | Wajib | 0.5 hari |

| A2.7 | Pengaturan semester aktif | 🟡 | ✅ | Wajib | 0.5 hari |



\*\*Subtotal:\*\* 7 task, estimasi 5.5 hari



\---



\### D. Modul A3: Manajemen Pengguna



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A3.1 | Schema User lengkap | 🔴 | ✅ | Wajib | 0.5 hari |

| A3.2 | API CRUD user | 🔴 | ✅ | Wajib | 2 hari |

| A3.3 | Halaman manajemen pengguna | 🔴 | ✅ | Wajib | 2 hari |

| A3.4 | Role \& permission | 🔴 | ✅ | Wajib | 1 hari |

| A3.5 | Reset password oleh admin | 🟡 | ✅ | Wajib | 0.5 hari |

| A3.6 | Aktivasi/deaktivasi user | 🟡 | ✅ | Wajib | 0.5 hari |

| A3.7 | Bulk import user (Excel) | 🟢 | ✅ | Wajib | 1 hari |



\*\*Subtotal:\*\* 7 task, estimasi 7.5 hari



\---



\### E. Modul A4: Dashboard Utama



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A4.1 | Layout dashboard (sidebar, topbar, panel kanan) | 🔴 | ✅ | Wajib | 2 hari |

| A4.2 | Komponen Sidebar (Radix NavigationMenu) | 🔴 | ✅ | Wajib | 1 hari |

| A4.3 | Komponen TopBar (Radix DropdownMenu) | 🔴 | ✅ | Wajib | 1 hari |

| A4.4 | Kartu statistik (4 kartu) | 🔴 | ✅ | Wajib | 1 hari |

| A4.5 | Grafik tren kehadiran (Recharts LineChart) | 🔴 | ✅ | Wajib | 1 hari |

| A4.6 | Grafik komposisi status (Recharts DonutChart) | 🔴 | ✅ | Wajib | 1 hari |

| A4.7 | Grafik kehadiran per kelas (BarChart) | 🟡 | ✅ | Wajib | 0.5 hari |

| A4.8 | Panel notifikasi | 🔴 | ✅ | Wajib | 1 hari |

| A4.9 | Panel aktivitas terbaru | 🔴 | ✅ | Wajib | 1 hari |

| A4.10 | Panel kontak | 🟡 | ✅ | Wajib | 0.5 hari |

| A4.11 | Filter waktu (Hari Ini, Minggu, Bulan, Tahun) | 🟡 | ✅ | Wajib | 0.5 hari |

| A4.12 | Dark mode toggle | 🟡 | ✅ | Wajib | 0.5 hari |



\*\*Subtotal:\*\* 12 task, estimasi 12 hari



\---



\### F. Modul A5: Manajemen Murid



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A5.1 | Schema Murid, Kelas, OrangTua | 🔴 | ✅ | Wajib | 1 hari |

| A5.2 | API CRUD murid | 🔴 | ✅ | Wajib | 2 hari |

| A5.3 | API CRUD kelas | 🔴 | ✅ | Wajib | 1.5 hari |

| A5.4 | API CRUD orang tua | 🔴 | ✅ | Wajib | 1.5 hari |

| A5.5 | Halaman data murid (tabel + filter) | 🔴 | ✅ | Wajib | 2 hari |

| A5.6 | Halaman detail murid | 🔴 | ✅ | Wajib | 1.5 hari |

| A5.7 | Halaman kelas | 🔴 | ✅ | Wajib | 1.5 hari |

| A5.8 | Halaman orang tua | 🔴 | ✅ | Wajib | 1.5 hari |

| A5.9 | Halaman mutasi murid | 🟡 | ✅ | Wajib | 1.5 hari |

| A5.10 | Import murid dari Excel | 🟡 | ✅ | Wajib | 1 hari |

| A5.11 | Export data murid | 🟡 | ✅ | Wajib | 0.5 hari |

| A5.12 | Upload foto murid | 🟡 | ✅ | Wajib | 0.5 hari |

| A5.13 | Wisaya Kenaikan Kelas Cerdas (Promotion Wizard) | 🔴 | ✅ | Wajib | 2 hari |

\*\*Subtotal:\*\* 13 task, estimasi 18 hari



\---



\### G. Modul A6: Tenaga Pendidik \& Kependidikan



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A6.1 | Schema Guru & Tendik | 🔴 | ✅ | Wajib | 1 hari |
| A6.2 | API CRUD guru | 🔴 | ✅ | Wajib | 2 hari |
| A6.3 | API CRUD tendik | 🔴 | ✅ | Wajib | 1.5 hari |
| A6.4 | API CRUD jabatan | 🔴 | ✅ | Wajib | 1 hari |
| A6.5 | Halaman data guru | 🔴 | ✅ | Wajib | 2 hari |
| A6.6 | Halaman data tendik | 🔴 | ✅ | Wajib | 1.5 hari |
| A6.7 | Halaman jabatan | 🔴 | ✅ | Wajib | 1 hari |

| A6.8 | Import guru dari Excel | 🟡 | ✅ | Wajib | 1 hari |

| A6.9 | Upload foto guru | 🟡 | ✅ | Wajib | 0.5 hari |



\*\*Subtotal:\*\* 9 task, estimasi 11.5 hari



\---



\### H. Modul A7: Mata Pelajaran \& Ruang



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A7.1 | Schema MataPelajaran, Ruang, Jadwal | 🔴 | ✅ | Wajib | 1 hari |
| A7.2 | API CRUD mapel | 🔴 | ✅ | Wajib | 1.5 hari |
| A7.3 | API CRUD ruang | 🔴 | ✅ | Wajib | 1 hari |
| A7.4 | API CRUD jadwal | 🔴 | ✅ | Wajib | 2 hari |
| A7.5 | Halaman mata pelajaran | 🔴 | ✅ | Wajib | 1.5 hari |
| A7.6 | Halaman ruang | 🔴 | ✅ | Wajib | 1 hari |
| A7.7 | Halaman jadwal kelas | 🔴 | ✅ | Wajib | 2 hari |
| A7.8 | Kalender jadwal | 🟡 | ✅ | Wajib | 1.5 hari |

| A7.9 | Konflik jadwal detection | 🟡 | ✅ | Wajib | 1 hari |



\*\*Subtotal:\*\* 9 task, estimasi 12.5 hari



\---



\### I. Modul A8: Ekstrakurikuler



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A8.1 | Schema Ekstrakurikuler, PesertaEkstra | 🔴 | ✅ | Wajib | 0.5 hari |

| A8.2 | API CRUD ekstrakurikuler | 🔴 | ✅ | Wajib | 1.5 hari |

| A8.3 | API peserta | 🔴 | ✅ | Wajib | 1 hari |

| A8.4 | API kehadiran | 🔴 | ✅ | Wajib | 1 hari |

| A8.5 | Halaman ekstrakurikuler | 🔴 | ✅ | Wajib | 1.5 hari |

| A8.6 | Halaman peserta | 🔴 | ✅ | Wajib | 1 hari |

| A8.7 | Halaman kehadiran | 🔴 | ✅ | Wajib | 1 hari |



\*\*Subtotal:\*\* 7 task, estimasi 7.5 hari



\---



\### J. Modul B1-B2: Mobile Fondasi



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| B1.1 | Halaman login murid | 🔴 | ✅ | Wajib | 1 hari |

| B1.2 | Halaman login guru | 🔴 | ✅ | Wajib | 1 hari |

| B1.3 | Halaman login orang tua | 🟡 | ✅ | Wajib | 1 hari |

| B1.4 | PWA manifest \& service worker | 🔴 | ✅ | Wajib | 1 hari |

| B1.5 | Bottom navigation | 🔴 | ✅ | Wajib | 1 hari |

| B2.1 | Halaman beranda murid | 🔴 | ✅ | Wajib | 2 hari |

| B2.2 | Halaman beranda guru | 🔴 | ✅ | Wajib | 2 hari |

| B2.3 | Komponen ProfileHeader | 🔴 | ✅ | Wajib | 1 hari |

| B2.4 | Komponen StatsGrid | 🔴 | ✅ | Wajib | 0.5 hari |

| B2.5 | Komponen TabMenu | 🔴 | ✅ | Wajib | 1 hari |

| B2.6 | Komponen Heatmap | 🔴 | ✅ | Wajib | 1.5 hari |

| B2.7 | Komponen ActivityCard | 🔴 | ✅ | Wajib | 0.5 hari |



\*\*Subtotal:\*\* 12 task, estimasi 13.5 hari



\---



\*\*FASE 1 TOTAL:\*\* 96 task, estimasi ±115 hari (±5 bulan)



\---



\## 🚀 FASE 2: Inti Absensi (GPS + Selfie) (3-4 bulan)



> \*\*Tujuan:\*\* Absensi GPS + Foto Selfie aktif untuk murid \& guru.

> \*\*Output:\*\* Murid \& guru bisa absen dengan GPS + selfie.



\### A. Modul A9: Absensi Murid



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A9.1 | Schema Absensi | 🔴 | ✅ | Wajib | 1 hari |

| A9.2 | API absen masuk (GPS + Selfie) | 🔴 | ✅ | Wajib | 2 hari |

| A9.3 | API absen pulang | 🔴 | ✅ | Wajib | 1.5 hari |

| A9.4 | API riwayat absensi | 🔴 | ✅ | Wajib | 1 hari |

| A9.5 | API rekap absensi | 🔴 | ✅ | Wajib | 1.5 hari |

| A9.6 | Halaman absensi murid (admin) | 🔴 | ✅ | Wajib | 2 hari |

| A9.7 | Halaman detail absensi | 🔴 | ✅ | Wajib | 1.5 hari |

| A9.8 | Export rekap absensi | 🟡 | ✅ | Wajib | 0.5 hari |



\*\*Subtotal:\*\* 8 task, estimasi 11 hari



\---



\### B. Modul A10: Absensi Guru \& Tendik



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A10.1 | Schema AbsensiGuru | 🔴 | ✅ | Wajib | 1 hari |
| A10.2 | API absen masuk guru | 🔴 | ✅ | Wajib | 2 hari |
| A10.3 | API absen pulang guru | 🔴 | ✅ | Wajib | 1.5 hari |
| A10.4 | API riwayat absensi guru | 🔴 | ✅ | Wajib | 1 hari |
| A10.5 | Halaman absensi guru | 🔴 | ✅ | Wajib | 2 hari |
| A10.6 | Rekap KBM | 🟡 | ✅ | Wajib | 1.5 hari |



\*\*Subtotal:\*\* 6 task, estimasi 9 hari



\---



\### C. Modul A11: Validasi Radius \& GPS



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A11.1 | Konfigurasi radius sekolah | 🔴 | ✅ | Wajib | 0.5 hari |

| A11.2 | Formula Haversine (utility) | 🔴 | ✅ | Wajib | 0.5 hari |

| A11.3 | Deteksi mock location | 🔴 | ✅ | Wajib | 1 hari |

| A11.4 | API validasi radius | 🔴 | ✅ | Wajib | 1.5 hari |

| A11.5 | Validasi akurasi GPS minimal | 🔴 | ✅ | Wajib | 0.5 hari |

| A11.6 | Log percobaan absen | 🟡 | ✅ | Wajib | 0.5 hari |



\*\*Subtotal:\*\* 6 task, estimasi 4.5 hari



\---



\### D. Modul A12: Validasi Foto Selfie



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A12.1 | Komponen kamera selfie | 🔴 | ✅ | Wajib | 2 hari |
| A12.2 | Watermark koordinat (Canvas) | 🔴 | ✅ | Wajib | 2 hari |
| A12.3 | Kompresi foto (WebP) | 🔴 | ✅ | Wajib | 1 hari |
| A12.4 | Upload foto ke server | 🔴 | ✅ | Wajib | 1.5 hari |
| A12.5 | Thumbnail generation | 🔴 | ✅ | Wajib | 1 hari |
| A12.6 | Preview foto + watermark | 🔴 | ✅ | Wajib | 1 hari |
| A12.7 | Timestamp server | 🔴 | ✅ | Wajib | 0.5 hari |
| A12.8 | Device fingerprint | 🟡 | ✅ | Wajib | 1 hari |



\*\*Subtotal:\*\* 8 task, estimasi 10 hari



\---



\### E. Modul A13: Verifikasi Absensi



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A13.1 | API verifikasi manual | 🔴 | ✅ | Wajib | 1.5 hari |

| A13.2 | Halaman verifikasi absensi | 🔴 | ✅ | Wajib | 2 hari |

| A13.3 | Riwayat validasi | 🟡 | ✅ | Wajib | 1 hari |

| A13.4 | Notifikasi ke murid/guru | 🟡 | ✅ | Wajib | 1 hari |



\*\*Subtotal:\*\* 4 task, estimasi 5.5 hari



\---



\### F. Modul B3-B10: Mobile Absensi



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| B3.1 | Halaman absen masuk | 🔴 | ✅ | Wajib | 2 hari |

| B3.2 | Halaman absen pulang | 🔴 | ✅ | Wajib | 1.5 hari |

| B4.1 | GPS location hook | 🔴 | ✅ | Wajib | 1.5 hari |

| B4.2 | Validasi radius hook | 🔴 | ✅ | Wajib | 1 hari |

| B5.1 | Kamera selfie komponen | 🔴 | ✅ | Wajib | 2 hari |

| B5.2 | Watermark generator | 🔴 | ✅ | Wajib | 2 hari |

| B5.3 | Kompresi \& upload foto | 🔴 | ✅ | Wajib | 1.5 hari |

| B6.1 | Status absensi logic | 🔴 | ✅ | Wajib | 1 hari |

| B7.1 | Dialog konfirmasi absen | 🔴 | ✅ | Wajib | 1 hari |

| B8.1 | Toast notifikasi | 🔴 | ✅ | Wajib | 0.5 hari |

| B9.1 | Progress upload | 🟡 | ✅ | Wajib | 0.5 hari |

| B10.1 | Error handling | 🔴 | ✅ | Wajib | 1 hari |



\*\*Subtotal:\*\* 12 task, estimasi 15.5 hari



\---



\### G. Modul B11-B15: Riwayat \& Pengajuan



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| B11.1 | Halaman riwayat absensi | 🔴 | ✅ | Wajib | 2 hari |
| B11.2 | Halaman detail absensi | 🔴 | ✅ | Wajib | 1.5 hari |
| B12.1 | Halaman pengajuan izin | 🔴 | ✅ | Wajib | 2 hari |
| B12.2 | Halaman pengajuan sakit | 🔴 | ✅ | Wajib | 2 hari |
| B13.1 | Upload lampiran | 🔴 | ✅ | Wajib | 1 hari |
| B14.1 | Notifikasi in-app | 🟡 | ✅ | Wajib | 1 hari |
| B15.1 | Push notification (PWA) | 🟡 | ✅ | Wajib | 1.5 hari |



\*\*Subtotal:\*\* 7 task, estimasi 11 hari



\---



\*\*FASE 2 TOTAL:\*\* 51 task, estimasi ±76 hari (±3.5 bulan)



\---



\## 💰 FASE 3: Keuangan (2 bulan)



> \*\*Tujuan:\*\* Tagihan, cicilan, pembayaran terkelola.

> \*\*Output:\*\* TU bisa kelola keuangan dengan mudah.



\### A. Modul A14: Jenis Tagihan

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A14.1 | Schema JenisTagihan | 🔴 | ✅ | Wajib | 0.5 hari |
| A14.2 | API CRUD jenis tagihan | 🔴 | ✅ | Wajib | 1.5 hari |
| A14.3 | Halaman jenis tagihan | 🔴 | ✅ | Wajib | 1.5 hari |
| A14.4 | Konfigurasi periode (sekali, bulanan, semester) | 🔴 | ✅ | Wajib | 1 hari |

**Subtotal:** 4 task, estimasi 4.5 hari (Status: 4/4 ✅ Selesai Penuh)

---

### B. Modul A15: Tagihan

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A15.1 | Schema Tagihan | 🔴 | ✅ | Wajib | 1 hari |
| A15.2 | API CRUD tagihan | 🔴 | ✅ | Wajib | 2 hari |
| A15.3 | API generate tagihan massal | 🔴 | ✅ | Wajib | 2 hari |
| A15.4 | Halaman tagihan | 🔴 | ✅ | Wajib | 2 hari |
| A15.5 | Filter tagihan (kelas, status, periode) | 🔴 | ✅ | Wajib | 1 hari |
| A15.6 | Export tagihan | 🟡 | ✅ | Wajib | 0.5 hari |

**Subtotal:** 6 task, estimasi 8.5 hari (Status: 6/6 ✅ Selesai Penuh)

---

### C. Modul A16: Cicilan

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A16.1 | Schema cicilan | 🔴 | ✅ | Wajib | 1 hari |
| A16.2 | API skema cicilan | 🔴 | ✅ | Wajib | 2 hari |
| A16.3 | Halaman cicilan | 🔴 | ✅ | Wajib | 2 hari |
| A16.4 | Progress cicilan | 🔴 | ✅ | Wajib | 1 hari |
| A16.5 | Notifikasi jatuh tempo cicilan | 🟡 | ✅ | Wajib | 1 hari |

**Subtotal:** 5 task, estimasi 7 hari (Status: 5/5 ✅ Selesai Penuh)

---

### D. Modul A17: Pembayaran

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A17.1 | Schema Pembayaran | 🔴 | ✅ | Wajib | 1 hari |
| A17.2 | API catat pembayaran | 🔴 | ✅ | Wajib | 2 hari |
| A17.3 | API verifikasi pembayaran | 🔴 | ✅ | Wajib | 1.5 hari |
| A17.4 | Halaman pembayaran | 🔴 | ✅ | Wajib | 2 hari |
| A17.5 | Upload bukti pembayaran | 🔴 | ✅ | Wajib | 1 hari |
| A17.6 | Metode pembayaran (tunai, transfer, QRIS, VA) | 🔴 | ✅ | Wajib | 1 hari |
| A17.7 | Cetak kwitansi | 🟡 | ✅ | Wajib | 1 hari |

**Subtotal:** 7 task, estimasi 9.5 hari (Status: 7/7 ✅ Selesai Penuh)

---

### E. Modul A18: Tunggakan & Riwayat

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A18.1 | API tunggakan | 🔴 | ✅ | Wajib | 1.5 hari |
| A18.2 | API riwayat pembayaran | 🔴 | ✅ | Wajib | 1 hari |
| A18.3 | Halaman tunggakan | 🔴 | ✅ | Wajib | 2 hari |
| A18.4 | Halaman riwayat pembayaran | 🔴 | ✅ | Wajib | 1.5 hari |
| A18.5 | Notifikasi tunggakan | 🟡 | ✅ | Wajib | 1 hari |

**Subtotal:** 5 task, estimasi 7 hari (Status: 5/5 ✅ Selesai Penuh)

---

**FASE 3 TOTAL:** 27 task, estimasi ±36.5 hari (Status: 27/27 ✅ Selesai Penuh)

---

## 🖨️ FASE 4: Bank Soal Siap Cetak (Tanpa Ujian / Asesmen) (1.5-2 bulan)

> **Tujuan:** Pembuatan dan pengelolaan bank soal berbasis Kurikulum Merdeka yang siap dicetak (*print ready* / PDF / Word) untuk keperluan ujian fisik mandiri sekolah. Sistem **tidak melayani** asesmen, ujian daring (CBT), atau penilaian murid (fitur ujian daring dikelola oleh sistem terpisah/ADZKIA).
> **Output:** Repositori bank soal 9 jenis manual, dan paket naskah soal cetak lengkap dengan kop sekolah serta lembar kunci jawaban.

### Modul A20: Bank Soal Siap Cetak (20 Task)

#### A20.1. Database Kurikulum Merdeka (5 Task)
> **Fokus:** CRUD capaian pembelajaran (CP), bab, materi pokok, dan seed materi mapel.

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A20.1.1 | Schema KelasKurikulum, MataPelajaran, Bab, Materi, Capaian Pembelajaran (CP) | 🔴 | ✅ | Wajib | 2 hari |
| A20.1.2 | API CRUD kurikulum, capaian pembelajaran, bab & materi pokok | 🔴 | ✅ | Wajib | 3 hari |
| A20.1.3 | Seed data kurikulum & materi pokok mapel (semua jenjang X, XI, XII) | 🔴 | ✅ | Wajib | 3 hari |
| A20.1.4 | Halaman kurikulum merdeka (manajemen CP, TP, ATP) | 🔴 | ✅ | Wajib | 2 hari |
| A20.1.5 | Import & sinkronisasi kurikulum dari Excel | 🟡 | ✅ | Wajib | 2 hari |

**Subtotal:** 5 task, estimasi 12 hari

---

#### A20.2. Bank Soal Manual (10 Task)
> **Fokus:** Form input 9 jenis soal (Pilihan Ganda, Pilihan Ganda Kompleks, Benar/Salah, Menjodohkan, Isian Singkat, Uraian, Skala Likert, dll.) serta soal dengan stimulus teks paragraf bersama.

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A20.2.1 | Schema BankSoal & Paragraf stimulus bersama | 🔴 | ✅ | Wajib | 2 hari |
| A20.2.2 | API CRUD bank soal & stimulus teks paragraf bersama | 🔴 | ✅ | Wajib | 3 hari |
| A20.2.3 | API struktur & validasi 9 jenis soal (PG, PGK, B/S, Menjodohkan, Isian, Uraian, Likert, dll.) | 🔴 | ✅ | Wajib | 4 hari |
| A20.2.4 | Halaman repositori & filter bank soal (mapel, bab, materi, tingkat kesulitan) | 🔴 | ✅ | Wajib | 3 hari |
| A20.2.5 | Form input manual 9 jenis soal interaktif (LaTeX matematika, simbol, media gambar) | 🔴 | ✅ | Wajib | 5 hari |
| A20.2.6 | Form input stimulus teks paragraf bersama (1 stimulus paragraf untuk multi-butir soal) | 🔴 | ✅ | Wajib | 3 hari |
| A20.2.7 | Preview tata letak soal naskah sebelum cetak (simulasi tampilan kertas) | 🟡 | ✅ | Wajib | 1 hari |
| A20.2.8 | Import soal massal dari Excel / Word / format standar | 🟡 | ✅ | Wajib | 2 hari |
| A20.2.9 | Export bank soal per topik ke Word / PDF siap cetak | 🟡 | ✅ | Wajib | 1 hari |
| A20.2.10 | Klasifikasi kategori, tingkat kesulitan & tagging HOTS / Taksonomi Bloom | 🟡 | ✅ | Wajib | 1 hari |

**Subtotal:** 10 task, estimasi 25 hari

---

#### A20.3. Paket Naskah Soal & Tata Letak Cetak (5 Task)
> **Fokus:** Pengelompokan soal menjadi paket naskah siap cetak, kop naskah ujian sekolah, drag & drop susunan nomor soal, serta lembar kunci jawaban & rubrik penilaian cetak terpisah.

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A20.3.1 | Schema PaketSoal, KopNaskah & PetunjukPengerjaan (layout cetak A4 / Folio) | 🔴 | ✅ | Wajib | 1 hari |
| A20.3.2 | API CRUD paket naskah soal & pengelompokan butir soal cetak | 🔴 | ✅ | Wajib | 2 hari |
| A20.3.3 | Halaman editor tata letak naskah soal (kop resmi sekolah, opsi 1 atau 2 kolom, spasi) | 🔴 | ✅ | Wajib | 2 hari |
| A20.3.4 | Komponen Drag & drop urutan butir soal & penomoran otomatis | 🟡 | ✅ | Wajib | 1 hari |
| A20.3.5 | Generator lembar kunci jawaban & rubrik penilaian cetak terpisah (Word & PDF) | 🟡 | ✅ | Wajib | 1.5 hari |

**Subtotal:** 5 task, estimasi 7.5 hari

---

**FASE 4 TOTAL:** 20 task, estimasi ±44.5 hari (±1.5 bulan)

---

## 🏥 FASE 5: Layanan Murid (13 Task)

> **Tujuan:** Pelayanan komprehensif murid mencakup portofolio prestasi, kesehatan terintegrasi UKS, dan bimbingan konseling berbasis disiplin positif.
> **Output:** Modul Prestasi & Portofolio, Rekam Medis UKS, dan Konseling Disiplin Positif aktif.

### A. Modul A21: Prestasi & Portofolio (5 Task)
> **Fokus:** Pencatatan prestasi akademik & non-akademik, jenjang lomba, unggah sertifikat, dan akumulasi poin prestasi.

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A21.1 | Schema Prestasi, Portofolio & Tingkat Kejuaraan | 🔴 | ✅ | Wajib | 1 hari |
| A21.2 | API CRUD pencatatan prestasi akademik & non-akademik (jenjang lomba) | 🔴 | ✅ | Wajib | 1.5 hari |
| A21.3 | Halaman portofolio prestasi murid & leaderboard apresiasi | 🔴 | ✅ | Wajib | 2 hari |
| A21.4 | Upload berkas sertifikat & validasi bukti prestasi | 🟡 | ✅ | Wajib | 1 hari |
| A21.5 | Rekapitulasi & kalkulasi akumulasi poin prestasi murid | 🟡 | ✅ | Wajib | 1 hari |

**Subtotal:** 5 task, estimasi 6.5 hari (Status: 5/5 ✅ Selesai)

---

### B. Modul A22: Kesehatan Murid (5 Task)
> **Fokus:** Rekam medis fisik/UKS, riwayat alergi/penyakit bawaan, tracking vaksinasi & pemeriksaan berkala.

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A22.1 | Schema Kesehatan Murid & Rekam Medis UKS | 🔴 | ✅ | Wajib | 1 hari |
| A22.2 | API rekam medis fisik/UKS & riwayat kunjungan murid ke ruang UKS | 🔴 | ✅ | Wajib | 1.5 hari |
| A22.3 | Pencatatan riwayat alergi, golongan darah & penyakit bawaan | 🔴 | ✅ | Wajib | 1 hari |
| A22.4 | Tracking vaksinasi / imunisasi & skrining kesehatan berkala (Puskesmas) | 🟡 | ✅ | Wajib | 1 hari |
| A22.5 | Halaman monitoring kesehatan murid & rekapitulasi berkala UKS | 🟡 | ✅ | Wajib | 1.5 hari |

**Subtotal:** 5 task, estimasi 6 hari (Status: 5/5 ✅ Selesai)

---

### C. Modul A23: Bimbingan Konseling / BK (3 Task)
> **Fokus:** Form konseling murid, catatan pendampingan & disiplin positif (pengganti sistem poin pelanggaran lama), penjadwalan konseling tatap muka.

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A23.1 | Schema Konseling, SesiBK & Catatan Pendampingan Disiplin Positif | 🔴 | ✅ | Wajib | 1 hari |
| A23.2 | API form konseling murid, catatan pendampingan & pembinaan disiplin positif | 🔴 | ✅ | Wajib | 1.5 hari |
| A23.3 | Halaman bimbingan konseling, penjadwalan konseling tatap muka & catatan disiplin positif | 🔴 | ✅ | Wajib | 2 hari |

**Subtotal:** 3 task, estimasi 4.5 hari (Status: 3/3 ✅ Selesai)

---

**FASE 5 TOTAL:** 13 task, estimasi ±17 hari (Status: 13/13 ✅ Selesai Penuh)

---

## 🏛️ FASE 6: Portal Alumni & Portal PPID (Roadmap Tahap Akhir) (1-2 bulan)

> **Tujuan:** Tracer study kelulusan/kampus murid dan keterbukaan informasi publik sekolah (PPID) sesuai regulasi.
> **Output:** Portal Tracer Study alumni & Portal Keterbukaan Informasi Publik siap akses.

### A. Modul A24: Portal Alumni & Tracer Study (5 Task)
> **Fokus:** Tracer study kelulusan/kampus, direktori alumni, dan sebaran karir lulusan.

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A24.1 | Schema Alumni & Tracer Study (perguruan tinggi, dunia kerja, wirausaha) | 🔴 | ✅ | Wajib | 1 hari |
| A24.2 | API CRUD direktori alumni & survei tracer study berkala | 🔴 | ✅ | Wajib | 1.5 hari |
| A24.3 | Halaman portal alumni, direktori angkatan & sinkronisasi kelulusan murid | 🔴 | ✅ | Wajib | 2 hari |
| A24.4 | Dashboard analitik statistik sebaran kelulusan (PTN/PTS/Kerja/Wirausaha) | 🟡 | ✅ | Wajib | 1.5 hari |
| A24.5 | Export laporan tracer study untuk akreditasi sekolah & BPS/Dinas | 🟡 | ✅ | Wajib | 1 hari |

**Subtotal:** 5 task, estimasi 7 hari (Status: 5/5 ✅ Selesai)

---

### B. Modul A25: Portal Keterbukaan Informasi Publik (PPID) (5 Task)
> **Fokus:** Publikasi dokumen berkala, permohonan informasi daring masyarakat, dan regulasi keterbukaan informasi.

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A25.1 | Schema InformasiPublik & PermohonanInformasi | 🔴 | ✅ | Wajib | 1 hari |
| A25.2 | API publikasi dokumen publik & alur tiket permohonan informasi | 🔴 | ✅ | Wajib | 1.5 hari |
| A25.3 | Halaman portal PPID publik (dokumen berkala, serta-merta, profil & anggaran) | 🔴 | ✅ | Wajib | 2 hari |
| A25.4 | Form pengajuan permohonan informasi online & tracking status disposisi | 🟡 | ✅ | Wajib | 1.5 hari |
| A25.5 | Dashboard admin/petugas PPID untuk verifikasi & penyelesaian permohonan | 🟡 | ✅ | Wajib | 1.5 hari |

**Subtotal:** 5 task, estimasi 7.5 hari (Status: 5/5 ✅ Selesai)

---

**FASE 6 TOTAL:** 10 task, estimasi ±14.5 hari (Status: 10/10 ✅ Selesai Penuh)

---

## 📊 FASE 7: Modul Pelaporan Terpadu (Roadmap Tahap Akhir) (1-2 bulan)

> **Tujuan:** Pelaporan berkala ke Dinas Pendidikan, buku induk mutasi murid, dan pertanggungjawaban keuangan tahunan.
> **Output:** Modul laporan dinas resmi, rekapitulasi mutasi, dan pembukuan tahunan terverifikasi.

### A. Modul A26: Rekap Absensi Bulanan Dinas (3 Task)
> **Fokus:** Rekap absensi bulanan standar format Dinas Pendidikan Banten / Kab. Tangerang.

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A26.1 | API agregasi kehadiran bulanan murid & guru sesuai template resmi dinas | 🔴 | ✅ | Wajib | 1.5 hari |
| A26.2 | Halaman modul pelaporan absensi bulanan dinas (filter bulan, jenjang & rombel) | 🔴 | ✅ | Wajib | 1.5 hari |
| A26.3 | Export laporan resmi absensi dinas (format Excel & PDF berkop resmi + QR barcode) | 🟡 | ✅ | Wajib | 1 hari |

**Subtotal:** 3 task, estimasi 4 hari (Status: 3/3 ✅ Selesai Penuh)

---

### B. Modul A27: Rekap Mutasi Murid (3 Task)
> **Fokus:** Buku induk mutasi murid (masuk, keluar, drop-out) & pelaporan pengawas sekolah.

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A27.1 | API rekapitulasi riwayat mutasi murid masuk, keluar, dan drop-out | 🔴 | ✅ | Wajib | 1.5 hari |
| A27.2 | Halaman laporan buku induk mutasi murid & riwayat kepindahan | 🔴 | ✅ | Wajib | 1.5 hari |
| A27.3 | Cetak surat keterangan mutasi resmi & rekapitulasi periodik pengawas dinas | 🟡 | ✅ | Wajib | 1 hari |

**Subtotal:** 3 task, estimasi 4 hari (Status: 3/3 ✅ Selesai Penuh)

---

### C. Modul A28: Laporan Keuangan Tahunan (3 Task)
> **Fokus:** Pembukuan neraca keuangan tahunan, realisasi tagihan/cicilan, dan transparansi komite.

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A28.1 | API agregasi keuangan tahunan (penerimaan tagihan, realisasi, cicilan, sisa tunggakan) | 🔴 | ✅ | Wajib | 1.5 hari |
| A28.2 | Halaman laporan neraca keuangan tahunan sekolah & arus kas komparatif | 🔴 | ✅ | Wajib | 2 hari |
| A28.3 | Export laporan keuangan tahunan untuk komite sekolah & inspektorat pengawas | 🟡 | ✅ | Wajib | 1 hari |

**Subtotal:** 3 task, estimasi 4.5 hari (Status: 3/3 ✅ Selesai Penuh)

---

**FASE 7 TOTAL:** 9 task, estimasi ±12.5 hari (Status: 9/9 ✅ Selesai Penuh)

---

## ⚡ FASE 8: Optimalisasi Performa, Caching Redis, dan Audit Keamanan (Roadmap Tahap Akhir) (1 bulan)

> **Tujuan:** Skalabilitas tinggi, caching multi-layer instan, dan hardening keamanan siber menyeluruh.
> **Output:** Latensi respons < 100ms, query optimal, bebas celah keamanan enterprise.

### A. Modul A29: Optimalisasi Performa & Caching Redis (3 Task)
> **Fokus:** Caching Redis (port 6380), optimasi kueri Prisma, dan static asset pipeline.

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A29.1 | Integrasi caching Redis multi-layer untuk data master, jadwal kbm & sesi auth (port 6380) | 🔴 | ✅ | Wajib | 2 hari |
| A29.2 | Optimasi query Prisma, database index profiling & connection pooling | 🔴 | ✅ | Wajib | 2 hari |
| A29.3 | Pipeline kompresi WebP gambar, font sub-setting & dynamic CDN edge caching | 🟡 | ✅ | Wajib | 1.5 hari |

**Subtotal:** 3 task, estimasi 5.5 hari (Status: 3/3 ✅ Selesai Penuh)

---

### B. Modul A30: Audit Keamanan & Hardening (3 Task)
> **Fokus:** Proteksi rate-limiting, audit logging terpusat, dan pengujian penetrasi keamanan.

| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A30.1 | Rate limiting bertingkat (Upstash/Redis), proteksi brute-force login & CSRF/XSS guard | 🔴 | ✅ | Wajib | 1.5 hari |
| A30.2 | Centralized audit log untuk setiap mutasi data sensitif (RBAC, IP logger, device signature) | 🔴 | ✅ | Wajib | 1.5 hari |
| A30.3 | Hardening security headers (CSP, HSTS, X-Content-Type-Options) & audit kepatuhan ISO/OWASP | 🔴 | ✅ | Wajib | 2 hari |

**Subtotal:** 3 task, estimasi 5 hari (Status: 3/3 ✅ Selesai Penuh)

---

**FASE 8 TOTAL:** 6 task, estimasi ±10.5 hari (Status: 6/6 ✅ Selesai Penuh)

---

## 📈 Rekapitulasi Keseluruhan Proyek

| Fase | Fokus Utama | Jumlah Task | Estimasi Durasi | Status Saat Ini |
|---|---|---|---|---|
| **Fase 1** | Fondasi & Data Master | 96 task | ±5 bulan (115 hari) | ✅ Selesai (96/96 Task) |
| **Fase 2** | Inti Absensi (GPS, Selfie, QR) | 51 task | ±3.5 bulan (76 hari) | ✅ Selesai (51/51 Task) |
| **Fase 3** | Keuangan (Tagihan, Cicilan, Bayar) | 27 task | ±2 bulan (36.5 hari) | ✅ Selesai (27/27 Task) |
| **Fase 4** | Bank Soal Siap Cetak (Tanpa AI & Ujian) | 20 task | ±1.5 bulan (44.5 hari) | ✅ Selesai (20/20 Task) |
| **Fase 5** | Layanan Murid (Prestasi, UKS, BK) | 13 task | ±1 bulan (17 hari) | ✅ Selesai (13/13 Task) |
| **Fase 6** | Alumni & PPID | 10 task | ±1-1.5 bulan (14.5 hari) | ✅ Selesai (10/10 Task) |
| **Fase 7** | Modul Pelaporan Terpadu Dinas & Keuangan | 9 task | ±1 bulan (12.5 hari) | ✅ Selesai (9/9 Task) |
| **Fase 8** | Optimalisasi Performa, Redis & Keamanan | 6 task | ±1 bulan (10.5 hari) | ✅ Selesai (6/6 Task) |
| **TOTAL** | **8 FASE KESELURUHAN** | **232 TASK** | **±14-17 BULAN** | **Progres: 232/232 Task Selesai (100% Tuntas Penuh 🎉)** |
