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



| Fase | Fokus | Modul | Durasi | Status |

|---|---|---|---|---|

| \*\*Fase 1\*\* | Fondasi \& Data Master | A1-A8, B1-B2 | 2-3 bulan | ⬜ |

| \*\*Fase 2\*\* | Inti Absensi (GPS + Selfie) | A9-A13, B3-B10 | 3-4 bulan | ⬜ |

| \*\*Fase 3\*\* | Keuangan | A14-A18 | 2 bulan | ⬜ |

| \*\*Fase 4\*\* | Asesmen \& Bank Soal | A19-A20 | 2 bulan | ⬜ |

| \*\*Fase 5\*\* | Layanan Murid | A21-A24, B16-B20 | 2-3 bulan | ⬜ |

| \*\*Fase 6\*\* | Alumni \& PPID | A25-A26 | 1-2 bulan | ⬜ |

| \*\*Fase 7\*\* | Laporan | A27-A35 | 1-2 bulan | ⬜ |

| \*\*Fase 8\*\* | Optimalisasi | Semua | 1 bulan | ⬜ |



\*\*Total:\*\* 17-21 bulan



\---



\## 🏗️ FASE 1: Fondasi \& Data Master (2-3 bulan)



> \*\*Tujuan:\*\* Sistem dasar berjalan, data master siap.

> \*\*Output:\*\* Login, dashboard, manajemen murid \& guru.



\### A. Setup Proyek



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A0.1 | Inisialisasi monorepo dengan pnpm workspace | 🔴 | ✅ | Wajib | 1 hari |

| A0.2 | Setup Next.js 14 untuk `apps/admin` | 🔴 | ⬜ | Wajib | 1 hari |

| A0.3 | Setup Next.js 14 untuk `apps/mobile` | 🔴 | ⬜ | Wajib | 1 hari |

| A0.4 | Setup Tailwind CSS | 🔴 | ⬜ | Wajib | 0.5 hari |

| A0.5 | Setup Radix UI (Primitives, Themes, Colors, Icons) | 🔴 | ⬜ | Wajib | 1 hari |

| A0.6 | Setup Prisma + PostgreSQL | 🔴 | ⬜ | Wajib | 1 hari |

| A0.7 | Setup NextAuth.js | 🔴 | ⬜ | Wajib | 1 hari |

| A0.8 | Setup Docker Compose | 🔴 | ⬜ | Wajib | 1 hari |

| A0.9 | Setup Nginx reverse proxy | 🔴 | ⬜ | Wajib | 0.5 hari |

| A0.10 | Setup CI/CD (GitHub Actions) | 🟡 | ⬜ | Wajib | 1 hari |

| A0.11 | Setup ESLint + Prettier + Husky | 🟡 | ⬜ | Wajib | 0.5 hari |

| A0.12 | Setup Vitest + Playwright | 🟡 | ⬜ | Wajib | 1 hari |



\*\*Subtotal:\*\* 12 task, estimasi 11 hari



\---



\### B. Modul A1: Autentikasi \& Otorisasi



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A1.1 | Schema User \& Role (Prisma) | 🔴 | ⬜ | Wajib | 0.5 hari |

| A1.2 | API login, logout, session | 🔴 | ⬜ | Wajib | 1 hari |

| A1.3 | Halaman login admin | 🔴 | ⬜ | Wajib | 1 hari |

| A1.4 | Halaman login mobile | 🔴 | ⬜ | Wajib | 1 hari |

| A1.5 | Middleware proteksi route | 🔴 | ⬜ | Wajib | 0.5 hari |

| A1.6 | Hak akses per role | 🔴 | ⬜ | Wajib | 1 hari |

| A1.7 | Forgot password | 🟡 | ⬜ | Wajib | 1 hari |

| A1.8 | Session management | 🟡 | ⬜ | Wajib | 0.5 hari |

| A1.9 | Audit log login | 🟢 | ⬜ | Wajib | 0.5 hari |



\*\*Subtotal:\*\* 9 task, estimasi 7 hari



\---



\### C. Modul A2: Pengaturan Sekolah



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A2.1 | Schema Pengaturan \& TahunAjaran | 🔴 | ⬜ | Wajib | 0.5 hari |

| A2.2 | API profil sekolah | 🔴 | ⬜ | Wajib | 1 hari |

| A2.3 | API tahun ajaran | 🔴 | ⬜ | Wajib | 1 hari |

| A2.4 | Halaman pengaturan sekolah | 🔴 | ⬜ | Wajib | 1 hari |

| A2.5 | Konfigurasi titik lokasi sekolah | 🔴 | ⬜ | Wajib | 1 hari |

| A2.6 | Upload logo sekolah | 🟡 | ⬜ | Wajib | 0.5 hari |

| A2.7 | Pengaturan semester aktif | 🟡 | ⬜ | Wajib | 0.5 hari |



\*\*Subtotal:\*\* 7 task, estimasi 5.5 hari



\---



\### D. Modul A3: Manajemen Pengguna



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A3.1 | Schema User lengkap | 🔴 | ⬜ | Wajib | 0.5 hari |

| A3.2 | API CRUD user | 🔴 | ⬜ | Wajib | 2 hari |

| A3.3 | Halaman manajemen pengguna | 🔴 | ⬜ | Wajib | 2 hari |

| A3.4 | Role \& permission | 🔴 | ⬜ | Wajib | 1 hari |

| A3.5 | Reset password oleh admin | 🟡 | ⬜ | Wajib | 0.5 hari |

| A3.6 | Aktivasi/deaktivasi user | 🟡 | ⬜ | Wajib | 0.5 hari |

| A3.7 | Bulk import user (Excel) | 🟢 | ⬜ | Wajib | 1 hari |



\*\*Subtotal:\*\* 7 task, estimasi 7.5 hari



\---



\### E. Modul A4: Dashboard Utama



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A4.1 | Layout dashboard (sidebar, topbar, panel kanan) | 🔴 | ⬜ | Wajib | 2 hari |

| A4.2 | Komponen Sidebar (Radix NavigationMenu) | 🔴 | ⬜ | Wajib | 1 hari |

| A4.3 | Komponen TopBar (Radix DropdownMenu) | 🔴 | ⬜ | Wajib | 1 hari |

| A4.4 | Kartu statistik (4 kartu) | 🔴 | ⬜ | Wajib | 1 hari |

| A4.5 | Grafik tren kehadiran (Recharts LineChart) | 🔴 | ⬜ | Wajib | 1 hari |

| A4.6 | Grafik komposisi status (Recharts DonutChart) | 🔴 | ⬜ | Wajib | 1 hari |

| A4.7 | Grafik kehadiran per kelas (BarChart) | 🟡 | ⬜ | Wajib | 0.5 hari |

| A4.8 | Panel notifikasi | 🔴 | ⬜ | Wajib | 1 hari |

| A4.9 | Panel aktivitas terbaru | 🔴 | ⬜ | Wajib | 1 hari |

| A4.10 | Panel kontak | 🟡 | ⬜ | Wajib | 0.5 hari |

| A4.11 | Filter waktu (Hari Ini, Minggu, Bulan, Tahun) | 🟡 | ⬜ | Wajib | 0.5 hari |

| A4.12 | Dark mode toggle | 🟡 | ⬜ | Wajib | 0.5 hari |



\*\*Subtotal:\*\* 12 task, estimasi 12 hari



\---



\### F. Modul A5: Manajemen Murid



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A5.1 | Schema Murid, Kelas, OrangTua | 🔴 | ⬜ | Wajib | 1 hari |

| A5.2 | API CRUD murid | 🔴 | ⬜ | Wajib | 2 hari |

| A5.3 | API CRUD kelas | 🔴 | ⬜ | Wajib | 1.5 hari |

| A5.4 | API CRUD orang tua | 🔴 | ⬜ | Wajib | 1.5 hari |

| A5.5 | Halaman data murid (tabel + filter) | 🔴 | ⬜ | Wajib | 2 hari |

| A5.6 | Halaman detail murid | 🔴 | ⬜ | Wajib | 1.5 hari |

| A5.7 | Halaman kelas | 🔴 | ⬜ | Wajib | 1.5 hari |

| A5.8 | Halaman orang tua | 🔴 | ⬜ | Wajib | 1.5 hari |

| A5.9 | Halaman mutasi murid | 🟡 | ⬜ | Wajib | 1.5 hari |

| A5.10 | Import murid dari Excel | 🟡 | ⬜ | Wajib | 1 hari |

| A5.11 | Export data murid | 🟡 | ⬜ | Wajib | 0.5 hari |

| A5.12 | Upload foto murid | 🟡 | ⬜ | Wajib | 0.5 hari |



\*\*Subtotal:\*\* 12 task, estimasi 16 hari



\---



\### G. Modul A6: Tenaga Pendidik \& Kependidikan



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A6.1 | Schema Guru \& Tendik | 🔴 | ⬜ | Wajib | 1 hari |

| A6.2 | API CRUD guru | 🔴 | ⬜ | Wajib | 2 hari |

| A6.3 | API CRUD tendik | 🔴 | ⬜ | Wajib | 1.5 hari |

| A6.4 | API CRUD jabatan | 🔴 | ⬜ | Wajib | 1 hari |

| A6.5 | Halaman data guru | 🔴 | ⬜ | Wajib | 2 hari |

| A6.6 | Halaman data tendik | 🔴 | ⬜ | Wajib | 1.5 hari |

| A6.7 | Halaman jabatan | 🔴 | ⬜ | Wajib | 1 hari |

| A6.8 | Import guru dari Excel | 🟡 | ⬜ | Wajib | 1 hari |

| A6.9 | Upload foto guru | 🟡 | ⬜ | Wajib | 0.5 hari |



\*\*Subtotal:\*\* 9 task, estimasi 11.5 hari



\---



\### H. Modul A7: Mata Pelajaran \& Ruang



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A7.1 | Schema MataPelajaran, Ruang, Jadwal | 🔴 | ⬜ | Wajib | 1 hari |

| A7.2 | API CRUD mapel | 🔴 | ⬜ | Wajib | 1.5 hari |

| A7.3 | API CRUD ruang | 🔴 | ⬜ | Wajib | 1 hari |

| A7.4 | API CRUD jadwal | 🔴 | ⬜ | Wajib | 2 hari |

| A7.5 | Halaman mata pelajaran | 🔴 | ⬜ | Wajib | 1.5 hari |

| A7.6 | Halaman ruang | 🔴 | ⬜ | Wajib | 1 hari |

| A7.7 | Halaman jadwal kelas | 🔴 | ⬜ | Wajib | 2 hari |

| A7.8 | Kalender jadwal | 🟡 | ⬜ | Wajib | 1.5 hari |

| A7.9 | Konflik jadwal detection | 🟡 | ⬜ | Wajib | 1 hari |



\*\*Subtotal:\*\* 9 task, estimasi 12.5 hari



\---



\### I. Modul A8: Ekstrakurikuler



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A8.1 | Schema Ekstrakurikuler, PesertaEkstra | 🔴 | ⬜ | Wajib | 0.5 hari |

| A8.2 | API CRUD ekstrakurikuler | 🔴 | ⬜ | Wajib | 1.5 hari |

| A8.3 | API peserta | 🔴 | ⬜ | Wajib | 1 hari |

| A8.4 | API kehadiran | 🔴 | ⬜ | Wajib | 1 hari |

| A8.5 | Halaman ekstrakurikuler | 🔴 | ⬜ | Wajib | 1.5 hari |

| A8.6 | Halaman peserta | 🔴 | ⬜ | Wajib | 1 hari |

| A8.7 | Halaman kehadiran | 🔴 | ⬜ | Wajib | 1 hari |



\*\*Subtotal:\*\* 7 task, estimasi 7.5 hari



\---



\### J. Modul B1-B2: Mobile Fondasi



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| B1.1 | Halaman login murid | 🔴 | ⬜ | Wajib | 1 hari |

| B1.2 | Halaman login guru | 🔴 | ⬜ | Wajib | 1 hari |

| B1.3 | Halaman login orang tua | 🟡 | ⬜ | Wajib | 1 hari |

| B1.4 | PWA manifest \& service worker | 🔴 | ⬜ | Wajib | 1 hari |

| B1.5 | Bottom navigation | 🔴 | ⬜ | Wajib | 1 hari |

| B2.1 | Halaman beranda murid | 🔴 | ⬜ | Wajib | 2 hari |

| B2.2 | Halaman beranda guru | 🔴 | ⬜ | Wajib | 2 hari |

| B2.3 | Komponen ProfileHeader | 🔴 | ⬜ | Wajib | 1 hari |

| B2.4 | Komponen StatsGrid | 🔴 | ⬜ | Wajib | 0.5 hari |

| B2.5 | Komponen TabMenu | 🔴 | ⬜ | Wajib | 1 hari |

| B2.6 | Komponen Heatmap | 🔴 | ⬜ | Wajib | 1.5 hari |

| B2.7 | Komponen ActivityCard | 🔴 | ⬜ | Wajib | 0.5 hari |



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

| A9.1 | Schema Absensi | 🔴 | ⬜ | Wajib | 1 hari |

| A9.2 | API absen masuk (GPS + Selfie) | 🔴 | ⬜ | Wajib | 2 hari |

| A9.3 | API absen pulang | 🔴 | ⬜ | Wajib | 1.5 hari |

| A9.4 | API riwayat absensi | 🔴 | ⬜ | Wajib | 1 hari |

| A9.5 | API rekap absensi | 🔴 | ⬜ | Wajib | 1.5 hari |

| A9.6 | Halaman absensi murid (admin) | 🔴 | ⬜ | Wajib | 2 hari |

| A9.7 | Halaman detail absensi | 🔴 | ⬜ | Wajib | 1.5 hari |

| A9.8 | Export rekap absensi | 🟡 | ⬜ | Wajib | 0.5 hari |



\*\*Subtotal:\*\* 8 task, estimasi 11 hari



\---



\### B. Modul A10: Absensi Guru \& Tendik



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A10.1 | Schema AbsensiGuru | 🔴 | ⬜ | Wajib | 1 hari |

| A10.2 | API absen masuk guru | 🔴 | ⬜ | Wajib | 2 hari |

| A10.3 | API absen pulang guru | 🔴 | ⬜ | Wajib | 1.5 hari |

| A10.4 | API riwayat absensi guru | 🔴 | ⬜ | Wajib | 1 hari |

| A10.5 | Halaman absensi guru | 🔴 | ⬜ | Wajib | 2 hari |

| A10.6 | Rekap KBM | 🟡 | ⬜ | Wajib | 1.5 hari |



\*\*Subtotal:\*\* 6 task, estimasi 9 hari



\---



\### C. Modul A11: Validasi Radius \& GPS



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A11.1 | Konfigurasi radius sekolah | 🔴 | ⬜ | Wajib | 0.5 hari |

| A11.2 | Formula Haversine (utility) | 🔴 | ⬜ | Wajib | 0.5 hari |

| A11.3 | Deteksi mock location | 🔴 | ⬜ | Wajib | 1 hari |

| A11.4 | API validasi radius | 🔴 | ⬜ | Wajib | 1.5 hari |

| A11.5 | Validasi akurasi GPS minimal | 🔴 | ⬜ | Wajib | 0.5 hari |

| A11.6 | Log percobaan absen | 🟡 | ⬜ | Wajib | 0.5 hari |



\*\*Subtotal:\*\* 6 task, estimasi 4.5 hari



\---



\### D. Modul A12: Validasi Foto Selfie



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A12.1 | Komponen kamera selfie | 🔴 | ⬜ | Wajib | 2 hari |

| A12.2 | Watermark koordinat (Canvas) | 🔴 | ⬜ | Wajib | 2 hari |

| A12.3 | Kompresi foto (WebP) | 🔴 | ⬜ | Wajib | 1 hari |

| A12.4 | Upload foto ke server | 🔴 | ⬜ | Wajib | 1.5 hari |

| A12.5 | Thumbnail generation | 🔴 | ⬜ | Wajib | 1 hari |

| A12.6 | Preview foto + watermark | 🔴 | ⬜ | Wajib | 1 hari |

| A12.7 | Timestamp server | 🔴 | ⬜ | Wajib | 0.5 hari |

| A12.8 | Device fingerprint | 🟡 | ⬜ | Wajib | 1 hari |



\*\*Subtotal:\*\* 8 task, estimasi 10 hari



\---



\### E. Modul A13: Verifikasi Absensi



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A13.1 | API verifikasi manual | 🔴 | ⬜ | Wajib | 1.5 hari |

| A13.2 | Halaman verifikasi absensi | 🔴 | ⬜ | Wajib | 2 hari |

| A13.3 | Riwayat validasi | 🟡 | ⬜ | Wajib | 1 hari |

| A13.4 | Notifikasi ke murid/guru | 🟡 | ⬜ | Wajib | 1 hari |



\*\*Subtotal:\*\* 4 task, estimasi 5.5 hari



\---



\### F. Modul B3-B10: Mobile Absensi



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| B3.1 | Halaman absen masuk | 🔴 | ⬜ | Wajib | 2 hari |

| B3.2 | Halaman absen pulang | 🔴 | ⬜ | Wajib | 1.5 hari |

| B4.1 | GPS location hook | 🔴 | ⬜ | Wajib | 1.5 hari |

| B4.2 | Validasi radius hook | 🔴 | ⬜ | Wajib | 1 hari |

| B5.1 | Kamera selfie komponen | 🔴 | ⬜ | Wajib | 2 hari |

| B5.2 | Watermark generator | 🔴 | ⬜ | Wajib | 2 hari |

| B5.3 | Kompresi \& upload foto | 🔴 | ⬜ | Wajib | 1.5 hari |

| B6.1 | Status absensi logic | 🔴 | ⬜ | Wajib | 1 hari |

| B7.1 | Dialog konfirmasi absen | 🔴 | ⬜ | Wajib | 1 hari |

| B8.1 | Toast notifikasi | 🔴 | ⬜ | Wajib | 0.5 hari |

| B9.1 | Progress upload | 🟡 | ⬜ | Wajib | 0.5 hari |

| B10.1 | Error handling | 🔴 | ⬜ | Wajib | 1 hari |



\*\*Subtotal:\*\* 12 task, estimasi 15.5 hari



\---



\### G. Modul B11-B15: Riwayat \& Pengajuan



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| B11.1 | Halaman riwayat absensi | 🔴 | ⬜ | Wajib | 2 hari |

| B11.2 | Halaman detail absensi | 🔴 | ⬜ | Wajib | 1.5 hari |

| B12.1 | Halaman pengajuan izin | 🔴 | ⬜ | Wajib | 2 hari |

| B12.2 | Halaman pengajuan sakit | 🔴 | ⬜ | Wajib | 2 hari |

| B13.1 | Upload lampiran | 🔴 | ⬜ | Wajib | 1 hari |

| B14.1 | Notifikasi in-app | 🟡 | ⬜ | Wajib | 1 hari |

| B15.1 | Push notification (PWA) | 🟡 | ⬜ | Wajib | 1.5 hari |



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

| A14.1 | Schema JenisTagihan | 🔴 | ⬜ | Wajib | 0.5 hari |

| A14.2 | API CRUD jenis tagihan | 🔴 | ⬜ | Wajib | 1.5 hari |

| A14.3 | Halaman jenis tagihan | 🔴 | ⬜ | Wajib | 1.5 hari |

| A14.4 | Konfigurasi periode (sekali, bulanan, semester) | 🔴 | ⬜ | Wajib | 1 hari |



\*\*Subtotal:\*\* 4 task, estimasi 4.5 hari



\---



\### B. Modul A15: Tagihan



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A15.1 | Schema Tagihan | 🔴 | ⬜ | Wajib | 1 hari |

| A15.2 | API CRUD tagihan | 🔴 | ⬜ | Wajib | 2 hari |

| A15.3 | API generate tagihan massal | 🔴 | ⬜ | Wajib | 2 hari |

| A15.4 | Halaman tagihan | 🔴 | ⬜ | Wajib | 2 hari |

| A15.5 | Filter tagihan (kelas, status, periode) | 🔴 | ⬜ | Wajib | 1 hari |

| A15.6 | Export tagihan | 🟡 | ⬜ | Wajib | 0.5 hari |



\*\*Subtotal:\*\* 6 task, estimasi 8.5 hari



\---



\### C. Modul A16: Cicilan



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A16.1 | Schema cicilan | 🔴 | ⬜ | Wajib | 1 hari |

| A16.2 | API skema cicilan | 🔴 | ⬜ | Wajib | 2 hari |

| A16.3 | Halaman cicilan | 🔴 | ⬜ | Wajib | 2 hari |

| A16.4 | Progress cicilan | 🔴 | ⬜ | Wajib | 1 hari |

| A16.5 | Notifikasi jatuh tempo cicilan | 🟡 | ⬜ | Wajib | 1 hari |



\*\*Subtotal:\*\* 5 task, estimasi 7 hari



\---



\### D. Modul A17: Pembayaran



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A17.1 | Schema Pembayaran | 🔴 | ⬜ | Wajib | 1 hari |

| A17.2 | API catat pembayaran | 🔴 | ⬜ | Wajib | 2 hari |

| A17.3 | API verifikasi pembayaran | 🔴 | ⬜ | Wajib | 1.5 hari |

| A17.4 | Halaman pembayaran | 🔴 | ⬜ | Wajib | 2 hari |

| A17.5 | Upload bukti pembayaran | 🔴 | ⬜ | Wajib | 1 hari |

| A17.6 | Metode pembayaran (tunai, transfer, QRIS, VA) | 🔴 | ⬜ | Wajib | 1 hari |

| A17.7 | Cetak kwitansi | 🟡 | ⬜ | Wajib | 1 hari |



\*\*Subtotal:\*\* 7 task, estimasi 9.5 hari



\---



\### E. Modul A18: Tunggakan \& Riwayat



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A18.1 | API tunggakan | 🔴 | ⬜ | Wajib | 1.5 hari |

| A18.2 | API riwayat pembayaran | 🔴 | ⬜ | Wajib | 1 hari |

| A18.3 | Halaman tunggakan | 🔴 | ⬜ | Wajib | 2 hari |

| A18.4 | Halaman riwayat pembayaran | 🔴 | ⬜ | Wajib | 1.5 hari |

| A18.5 | Notifikasi tunggakan | 🟡 | ⬜ | Wajib | 1 hari |



\*\*Subtotal:\*\* 5 task, estimasi 7 hari



\---



\*\*FASE 3 TOTAL:\*\* 27 task, estimasi ±36.5 hari (±2 bulan)



\---



\## 📝 FASE 4: Asesmen \& Bank Soal (2 bulan)



> \*\*Tujuan:\*\* Asesmen \& bank soal terkelola.

> \*\*Output:\*\* Guru bisa input asesmen, bank soal siap.



\### A. Modul A19: Asesmen



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A19.1 | Schema Asesmen | 🔴 | ⬜ | Wajib | 1 hari |

| A19.2 | API CRUD asesmen | 🔴 | ⬜ | Wajib | 2 hari |

| A19.3 | API analisis asesmen | 🟡 | ⬜ | Wajib | 2 hari |

| A19.4 | Halaman asesmen | 🔴 | ⬜ | Wajib | 2 hari |

| A19.5 | Input nilai massal | 🔴 | ⬜ | Wajib | 1.5 hari |

| A19.6 | Grafik nilai per mapel | 🟡 | ⬜ | Wajib | 1 hari |

| A19.7 | Export nilai | 🟡 | ⬜ | Wajib | 0.5 hari |



\*\*Subtotal:\*\* 7 task, estimasi 10 hari



\---



\### B. Modul A20: Bank Soal



### B. Modul A20: Bank Soal Manual (EXPAND)

#### B.1. Database Kurikulum Merdeka
| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A20.1.1 | Schema KelasKurikulum, MataPelajaran, Bab, Materi | 🔴 | ⬜ | Wajib | 2 hari |
| A20.1.2 | API CRUD kurikulum | 🔴 | ⬜ | Wajib | 3 hari |
| A20.1.3 | Seed data kurikulum (semua mapel) | 🔴 | ⬜ | Wajib | 3 hari |
| A20.1.4 | Halaman kurikulum merdeka | 🔴 | ⬜ | Wajib | 2 hari |
| A20.1.5 | Import kurikulum dari Excel | 🟡 | ⬜ | Wajib | 2 hari |

#### B.2. Bank Soal Manual
| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A20.2.1 | Schema BankSoal, Paragraf | 🔴 | ⬜ | Wajib | 2 hari |
| A20.2.2 | API CRUD bank soal | 🔴 | ⬜ | Wajib | 3 hari |
| A20.2.3 | API untuk 9 jenis soal | 🔴 | ⬜ | Wajib | 4 hari |
| A20.2.4 | Halaman bank soal | 🔴 | ⬜ | Wajib | 3 hari |
| A20.2.5 | Form input soal manual (9 jenis) | 🔴 | ⬜ | Wajib | 5 hari |
| A20.2.6 | Form input paragraf (1 paragraf untuk beberapa soal) | 🔴 | ⬜ | Wajib | 3 hari |
| A20.2.7 | Preview soal | 🟡 | ⬜ | Wajib | 1 hari |
| A20.2.8 | Import soal dari Excel | 🟡 | ⬜ | Wajib | 2 hari |
| A20.2.9 | Export soal | 🟡 | ⬜ | Wajib | 1 hari |
| A20.2.10 | Kategori soal & tingkat kesulitan | 🟡 | ⬜ | Wajib | 1 hari |

#### B.3. AI Bank Soal (BARU)
| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A20.3.1 | Integrasi AI Provider (DeepSeek/OpenAI/Ollama) | 🔴 | ⬜ | Wajib | 3 hari |
| A20.3.2 | Prompt engineering untuk 9 jenis soal | 🔴 | ⬜ | Wajib | 4 hari |
| A20.3.3 | API generate soal | 🔴 | ⬜ | Wajib | 3 hari |
| A20.3.4 | Queue & async generation (BullMQ) | 🔴 | ⬜ | Wajib | 2 hari |
| A20.3.5 | Cache hasil AI (Redis) | 🟡 | ⬜ | Wajib | 1 hari |
| A20.3.6 | Rate limit per guru | 🟡 | ⬜ | Wajib | 1 hari |
| A20.3.7 | Halaman AI Generator | 🔴 | ⬜ | Wajib | 3 hari |
| A20.3.8 | Preview & edit hasil AI | 🔴 | ⬜ | Wajib | 2 hari |
| A20.3.9 | Simpan hasil AI ke bank soal | 🔴 | ⬜ | Wajib | 1 hari |
| A20.3.10 | Regenerate soal | 🟡 | ⬜ | Wajib | 1 hari |
| A20.3.11 | Feedback untuk improve AI | 🟢 | ⬜ | Wajib | 2 hari |
| A20.3.12 | Audit log AI | 🟡 | ⬜ | Wajib | 1 hari |

#### B.4. Paket Soal
| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A20.4.1 | Schema PaketSoal, PaketSoalItem | 🔴 | ⬜ | Wajib | 1 hari |
| A20.4.2 | API CRUD paket soal | 🔴 | ⬜ | Wajib | 2 hari |
| A20.4.3 | Halaman paket soal | 🔴 | ⬜ | Wajib | 2 hari |
| A20.4.4 | Drag & drop urutan soal | 🟡 | ⬜ | Wajib | 2 hari |
| A20.4.5 | Atur bobot soal | 🟡 | ⬜ | Wajib | 1 hari |

#### B.5. Ujian & Hasil
| No | Task | Prioritas | Status | DeepSeek | Estimasi |
|---|---|---|---|---|---|
| A20.5.1 | Schema Ujian, PesertaUjian, JawabanUjian | 🔴 | ⬜ | Wajib | 2 hari |
| A20.5.2 | API CRUD ujian | 🔴 | ⬜ | Wajib | 3 hari |
| A20.5.3 | Halaman ujian | 🔴 | ⬜ | Wajib | 3 hari |
| A20.5.4 | Penilaian otomatis (objektif) | 🔴 | ⬜ | Wajib | 2 hari |
| A20.5.5 | Penilaian manual (uraian) | 🔴 | ⬜ | Wajib | 2 hari |
| A20.5.6 | Analisis butir soal | 🟡 | ⬜ | Wajib | 3 hari |
| A20.5.7 | Statistik ujian | 🟡 | ⬜ | Wajib | 2 hari |
| A20.5.8 | Export hasil ujian | 🟡 | ⬜ | Wajib | 1 hari |



\*\*Subtotal:\*\* 9 task, estimasi 15 hari



\---



\*\*FASE 4 TOTAL:\*\* 16 task, estimasi ±25 hari (±1.5 bulan)



\---



\## 🏥 FASE 5: Layanan Murid (2-3 bulan)



> \*\*Tujuan:\*\* Kesehatan, BK, Prestasi, Profil 360° aktif.

> \*\*Output:\*\* Layanan murid lengkap.



\### A. Modul A21: Prestasi



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A21.1 | Schema Prestasi | 🟢 | ⬜ | Wajib | 0.5 hari |

| A21.2 | API CRUD prestasi | 🟢 | ⬜ | Wajib | 1.5 hari |

| A21.3 | Halaman prestasi | 🟢 | ⬜ | Wajib | 2 hari |

| A21.4 | Rekap prestasi | 🟢 | ⬜ | Wajib | 1 hari |

| A21.5 | Upload sertifikat | 🟢 | ⬜ | Wajib | 0.5 hari |



\*\*Subtotal:\*\* 5 task, estimasi 5.5 hari



\---



\### B. Modul A22: Data Kesehatan



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A22.1 | Schema Kesehatan | 🟢 | ⬜ | Wajib | 1 hari |

| A22.2 | API CRUD kesehatan | 🟢 | ⬜ | Wajib | 2 hari |

| A22.3 | Halaman kesehatan | 🟢 | ⬜ | Wajib | 2 hari |

| A22.4 | Riwayat pemeriksaan | 🟢 | ⬜ | Wajib | 1 hari |

| A22.5 | Imunisasi tracking | 🟢 | ⬜ | Wajib | 1 hari |



\*\*Subtotal:\*\* 5 task, estimasi 7 hari



\---



\### C. Modul A23: Pelayanan BK



| No | Task | Prioritas | Status | DeepSeek | Estimasi |

|---|---|---|---|---|---|

| A23.1 | Schema PelayananBK | 🟢 | ⬜ | Wajib | 1 hari |

| A23.2 | API CRUD BK | 🟢 | ⬜ | Wajib | 2 hari |

| A23.3 | Halaman BK | 🟢 |

