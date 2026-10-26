\# memory.md — Catatan Progres \& Keputusan DZITOE

\## Sistem Tata Kelola Sekolah DZITOE

\### SMAN 20 Kabupaten Tangerang



> \*\*Versi:\*\* 1.0.0

> \*\*Status:\*\* Aktif

> \*\*Tanggal Dibuat:\*\* 2026

> \*\*Terakhir Diupdate:\*\* 2026

> \*\*Klasifikasi:\*\* Dokumen Internal (Non-Komersial)



\---



\## 📖 Tentang File Ini



`memory.md` adalah \*\*catatan hidup\*\* proyek DZITOE yang berisi:

\- \*\*Progres pengerjaan\*\* — task apa yang sudah/belum selesai

\- \*\*Keputusan penting\*\* — mengapa memilih A, bukan B

\- \*\*Peluang \& risiko\*\* — yang perlu diperhatikan

\- \*\*Catatan teknis\*\* — hal-hal yang perlu diingat

\- \*\*Blocker\*\* — hambatan yang sedang dihadapi

\- \*\*Next action\*\* — langkah selanjutnya



\*\*Aturan:\*\*

1\. \*\*Update setiap selesai task\*\* — catat apa yang dikerjakan

2\. \*\*Catat keputusan\*\* — jangan hanya hasil, tapi alasan

3\. \*\*Jujur\*\* — jika ada kesalahan, catat \& perbaiki

4\. \*\*Ringkas\*\* — jangan bertele-tele

5\. \*\*Kronologis\*\* — urut dari terbaru ke terlama (reverse chronological)



\---



\## 🎯 Status Proyek Saat Ini



| Aspek | Status |

|---|---|

| \*\*Fase\*\* | 🏗️ Fase 1: Fondasi & Data Master |

| \*\*Progress\*\* | 1.2% |

| \*\*Task Selesai\*\* | 3 / 250+ (A0.1, A0.2, A0.3) |

| \*\*Blocker\*\* | Tidak ada |

| \*\*Next Action\*\* | Setup Tailwind CSS & Design System (A0.4) |



\---



\## 🔒 Konteks Lingkungan Lokal & Port Guard (Wajib Dipatuhi)

| Port | Status di Laptop | Pemilik / Peruntukan | Kebijakan DZITOE |
|---|---|---|---|
| \*\*8000\*\* | Terproteksi | \*\*ADZKIA\*\* (Aplikasi Ujian) | ⛔ \*\*DILARANG DISENTUH\*\* |
| \*\*5173\*\* | Terproteksi | \*\*PERSOALAN\*\* (Vite Dev Server) | ⛔ \*\*DILARANG DISENTUH\*\* |
| \*\*5432\*\* | Terpakai | PostgreSQL lokal lain | ⛔ Jangan ditimpa |
| \*\*6379\*\* | Terpakai | Redis lokal lain | ⛔ Jangan ditimpa |
| \*\*3000\*\* | Bebas | \*\*DZITOE Admin\*\* | ✅ Resmi dipakai |
| \*\*3001\*\* | Bebas | \*\*DZITOE Mobile (PWA)\*\* | ✅ Resmi dipakai |
| \*\*5433\*\* | Bebas | \*\*DZITOE PostgreSQL\*\* | ✅ Instance khusus |
| \*\*6380\*\* | Bebas | \*\*DZITOE Redis\*\* | ✅ Instance khusus |

\---

\## 📅 Log Progres

\### 2026 — Audit Menyeluruh & Hardening RBAC Admin

#### [2026-10-06] [Audit & Hardening RBAC] Eksekusi Perbaikan P0, P1, dan Pembersihan Fitur Admin
**Status:** ✅ Selesai Penuh (Audit + P0 + P1 + Feature Cleanup)
**Oleh:** DeepSeek V4 Pro
**Yang dikerjakan:**
- **Pembersihan Fitur Non-Standar:**
  - Menghapus fitur cetak piagam penghargaan prestasi (`window.print()` modal dan tombol cetak rekap) di `apps/admin/src/app/prestasi/page.tsx`.
  - Menghapus badge shortcut `Ctrl+K` di kolom pencarian global Topbar (`apps/admin/src/components/topbar.tsx`).
- **Eksekusi Prioritas P0 (Hardening Keamanan & RBAC):**
  - **Turunkan Privilege KEPALA_SEKOLAH:** Mencabut izin akses rute `/pengguna` dan `/pengaturan` dari `KEPALA_SEKOLAH` di `packages/auth/src/rbac.ts`. Menu di sidebar otomatis tersembunyi dan role bertindak sebagai pengawas eksekutif murni.
  - **Karantina Hak Akses `/kesehatan` dari GURU:** Mengeluarkan role `GURU` dari `ROUTE_ACCESS_MAP['/kesehatan']` dan menghapus permission `kesehatan:read` dari role Guru. Modul UKS kini terlindungi khusus untuk `ADMIN`, `KEPALA_SEKOLAH`, `TU`, dan `GURU_BK`.
  - **Enforce Force-Password-Change:** Menambahkan flag `requirePasswordChange: true` pada kredensial default (`Masuk123!`) di `@dzitoe/auth` dan API login, serta menampilkan banner notifikasi wajib ganti sandi pada sesi aktif.
  - **HTTP 403 Forbidden Response:** Mengubah penolakan rute terlarang pada Next.js middleware (`apps/admin/src/middleware.ts`) dari redirect `307` menjadi status `403 Forbidden` terstandar dengan rewrite ke halaman khusus `/unauthorized` yang informatif.
- **Eksekusi Prioritas P1 (Optimasi UI & Performa):**
  - **Paginasi Server-Side Tabel Murid (`/murid`):** Mengatur limit default 25 siswa per halaman di `apps/admin/src/app/api/murid/route.ts` dan mengimplementasikan tombol navigasi halaman bernomor dinamis (`1`, `2`, `3`...).
  - **Optimasi Snapshot Kenaikan Kelas:** Melakukan pruning dan pengarsipan terhadap 32 riwayat snapshot lama ke `packages/db/data/archive/snapshots-historical.json`. Memangkas ukuran file aktif dari 7,06 MB menjadi 673 KB (reduksi 90%+), serta menerapkan auto-archiving otomatis di `packages/db/src/promotion-store.ts` maksimal 5 snapshot aktif.
  - **Restrukturisasi Dashboard (`/`):** Memindahkan `SchoolContactPanel` dari dashboard utama ke tab Profil Sekolah di `apps/admin/src/app/pengaturan/page.tsx`, serta menambahkan threshold indikator target (≥85%) dan badge status pada kartu Disiplin Positif.
- **Verifikasi Mutu & Typecheck:**
  - Typecheck: 0 error di `@dzitoe/auth`, `@dzitoe/db`, dan `@dzitoe/admin`.
  - Pengujian Langsung: Verifikasi HTTP 403 pada Kepsek & Guru, verifikasi pagination 25 siswa, dan verifikasi flag ganti kata sandi.

#### [2026-10-04] [Fase 5 & Fase 6] Penyelesaian Penuh 100% Modul Prestasi (A21) & Portal Keterbukaan Informasi Publik (PPID A25)
**Status:** ✅ Selesai Penuh (Fase 5: 13/13 Task ✅, Fase 6: 10/10 Task ✅)
**Oleh:** DeepSeek V4 Pro
**Yang dikerjakan:**
- **Modul A21: Prestasi & Portofolio Siswa (5 Task — 100% Selesai):**
  - Mesin kalkulasi poin kejuaraan otomatis berjenjang Kemendikdasmen (`hitungPoinPrestasi` di `packages/db/src/achievement-store.ts`): Internasional (100-60 poin), Nasional (75-40 poin), Provinsi (50-20 poin), Kabupaten (30-10 poin), Kecamatan (15-5 poin), Sekolah (10-3 poin).
  - API Routes Lengkap: `apps/admin/src/app/api/prestasi/route.ts` (GET filter/search/leaderboard, POST) & `[id]/route.ts` (GET detail, PUT update poin live, DELETE).
  - Antarmuka Prestasi & Hall of Fame (`apps/admin/src/app/prestasi/page.tsx`):
    - Banner Metrik: Total Prestasi, Akumulasi Poin Talenta, Prestasi Nasional/Internasional, Siswa Terbaik (Top MVP Grand Champion).
    - Tab 1: Tabel Direktori Prestasi dengan filter jenis (Akademik/Non-Akademik) dan jenjang lomba, pencarian cerdas, badge poin instan, dan pratinjau sertifikat.
    - Tab 2: Hall of Fame / Leaderboard Podium: Podium visual emas, perak, dan perunggu (#1, #2, #3) untuk siswa terbaik + tabel peringkat 4–10 dengan kalkulasi agregat.
    - Modal Piagam Penghargaan: Templat piagam resmi berkop SMAN 20 Kabupaten Tangerang dengan cap digital dan tombol cetak langsung (`window.print()`).
    - Modal Form Prestasi Baru: Live point calculator preview yang mengkalkulasi skor secara real-time saat pengguna memilih tingkat dan peringkat juara.
- **Modul A25: Portal Keterbukaan Informasi Publik (PPID) (5 Task — 100% Selesai):**
  - Store Dokumen & Permohonan (`packages/db/src/ppid-store.ts`): Sesuai UU No. 14 Tahun 2008 (KIP), mendukung 4 kategori statutori: Berkala, Serta-merta, Setiap saat, dan Dikecualikan (Pasal 17).
  - API Routes Lengkap:
    - `apps/admin/src/app/api/ppid/dokumen/route.ts` & `[id]/route.ts`: CRUD publikasi dokumen publik, pelacak jumlah unduhan warga secara otomatis (`incrementDownloadCount`).
    - `apps/admin/src/app/api/ppid/permohonan/route.ts` & `[id]/route.ts`: Alur tiket permohonan daring, nomor tiket registrasi unik (`REG-PPID-YYYY-XXX`), dan disposisi status petugas PPID.
  - Antarmuka Portal PPID Publik & Pengelola:
    - **Portal Terbuka Publik Tanpa Login (`apps/admin/src/app/publik/ppid/page.tsx`):** Dapat diakses langsung oleh masyarakat, wali murid, jurnalis, dan LSM tanpa akun login. Dilengkapi Maklumat Pelayanan KIP, katalog unduhan dokumen publik, formulir pengajuan permohonan daring, pelacak nomor tiket instan, dan SOP standar waktu pelayanan (SLA 10+7 hari kerja).
    - **Dashboard Pengelola Admin (`apps/admin/src/app/ppid/page.tsx`):** Area khusus petugas PPID/Admin untuk memverifikasi permohonan, memperbarui disposisi status, menerbitkan dokumen baru, dan tautan langsung ke pratinjau portal publik.
    - **Middleware Redirection (`apps/admin/src/middleware.ts`):** Mengizinkan rute `/publik` bebas tanpa autentikasi, serta otomatis mengarahkan pengunjung umum yang membuka `/ppid` ke `/publik/ppid`.
- **RBAC & Sidebar Navigation Integration:**
  - Route map & hak akses di `packages/auth/src/rbac.ts`: Rute `/prestasi` dapat diakses oleh `ADMIN`, `KEPALA_SEKOLAH`, `TU`, `GURU`, `GURU_BK`. Rute `/ppid` dapat diakses oleh `ADMIN`, `KEPALA_SEKOLAH`, `PETUGAS_PPID`, `TU`.
  - Sidebar di `apps/admin/src/components/sidebar.tsx`: Menambahkan menu `Prestasi Siswa` (ikon Medal, badge Poin) di kelompok Layanan Murid, dan menu `Portal PPID` (ikon FileText, badge Publik) di kelompok Keterbukaan Informasi.
- **Pengujian & Verifikasi Mutu:**
  - Vitest Unit Test: `tests/unit/prestasi-ppid.test.ts` (9 pengujian baru). Total seluruh 9 test files / 66 tes lulus 100% green.
  - TypeScript Typecheck: `pnpm --filter @dzitoe/admin typecheck` lulus 100% dengan 0 error.
  - Port Guard: `pnpm ports:check` memverifikasi port 3000 & 3001 aman dan port 8000 (ADZKIA) serta 5173 (PERSOALAN) tetap terisolasi.

### 2026 — Fase 1: Fondasi & Data Master

\#### [2026-10-04] [RBAC & UI/UX] Integrasi Granular Sidebar RBAC & Taste Skill Overhaul Modul Kesehatan UKS
**Status:** ✅ Selesai
**Oleh:** DeepSeek V4 Pro
**Yang dikerjakan:**
- **Dynamic RBAC Sidebar Filtering & Route Guard (`packages/auth/src/rbac.ts` & `apps/admin/src/components/sidebar.tsx`):**
  - Mengintegrasikan mesin RBAC ke antarmuka navigasi admin (`canAccessRoute` via subpath export `@dzitoe/auth/rbac`).
  - Menghubungkan sistem sesi aktif (`AuthProvider` & `useAuth`) ke `Sidebar` dan `Topbar`. Navigasi disaring otomatis secara dinamis sesuai peran pengguna:
    - `GURU`: Menu Kenaikan Kelas, Mutasi, Manajemen Pengguna, Pengaturan, Layanan BK disembunyikan. Menu yang berhak diakses (Dashboard, Murid, Orang Tua, Guru, Jadwal & Mapel, Kesehatan UKS, Presensi, Ekskul) tampil rapi.
    - `GURU_BK`: Akses eksklusif ke Layanan BK (Restitusi), Kesehatan UKS, Alumni & Tracer, Murid, Orang Tua, dan Presensi.
    - `TU`: Akses kesiswaan lengkap (Kenaikan Kelas Wizard, Mutasi, Alumni & Tracer, Kesehatan UKS, Murid, Orang Tua, Guru, Jadwal, Presensi, Ekskul).
    - `ADMIN` & `KEPALA_SEKOLAH`: Akses penuh ke seluruh fitur sekolah.
  - Menambahkan indikator peran aktif (*Active Role Pill*) di footer sidebar dan profil dinamis di Topbar dengan inisial cerdas.
  - Live UKS Bed occupancy badge di sidebar (`X UKS` beranimasi pulsasi saat ada murid yang sedang dirawat di UKS).
- **Taste Skill & Modern Web Guidance Overhaul Modul Kesehatan Siswa & UKS (`apps/admin/src/app/kesehatan/page.tsx`):**
  - **Design Read:** *Modern School Medical Clinic (UKS) & Student Health Record system for SMAN 20 Kabupaten Tangerang, with a clinical trust visual language, high-contrast vital telemetry badges, responsive drawer preview, and instant status comprehension.*
  - Dial configuration: `VARIANCE: 5`, `MOTION: 4`, `DENSITY: 5`.
  - **Banner Peringatan Ranjang UKS (Live Bed Occupancy):** Menampilkan banner peringatan cerdas jika ada siswa yang sedang rawat tidur di ruang UKS lengkap dengan tombol aksi langsung.
  - **Quick Filter Tabs:** Tab navigasi kilat (*Semua*, *Sedang di UKS*, *Perhatian & Rujukan*, *Alergi & Bawaan*, *Skrining & Vaksin*) dengan badge kuota real-time.
  - **Telemetry Tanda Vital Klinis Berwarna:** Indikator suhu tubuh otomatis berkode warna (Normal `< 37.3°C` hijau/netral, Subfebril `37.3–37.9°C` amber, Demam Tinggi `≥ 38.0°C` merah dengan ikon termometer beranimasi), badge golongan darah bold, dan chip peringatan alergi yang mencolok.
  - **Slide-Over Medical Dossier Drawer:** Panel detail rekam medis murid lengkap dengan anamnesis, terapi obat, tindakan pertolongan pertama, serta 3 aksi cepat sekolah:
    1. *Cetak Surat Keterangan / Izin UKS* resmi kop sekolah SMAN 20 Kab. Tangerang (print-ready).
    2. *Kirim Notifikasi WhatsApp Resmi ke Wali Murid* secara instan.
    3. *Tandai Pulih ke Kelas / Selesai Istirahat* dalam 1-klik.
  - **Skeleton Loaders & Empty State:** Mengganti string teks biasa dengan skeletal loader 4-baris dan ilustrasi ramah saat pencarian nihil.
- **Verifikasi & Pengujian:**
  - Menambahkan test case baru di `tests/unit/auth-rbac-sessions.test.ts` (9/9 tests passed).
  - Seluruh test suite unit monorepo (`57/57 tests passed 100%`).
  - Monorepo Port Guard tetap terjaga aman.

---

\#### [2026-10-04] [Scope Adjustment] Eliminasi Sub-Modul A20.3 (AI Bank Soal)
**Status:** ✅ Selesai
**Oleh:** DeepSeek (Mode Pro)
**Keputusan Arsitektur:**
- Sub-modul A20.3 (AI Bank Soal - 12 task) dihapus dari lingkup DZITOE.
- Pembuatan dan pengelolaan butir soal di DZITOE difokuskan murni pada Kurikulum Merdeka Manual dan Paket Naskah Siap Cetak (A4/Folio).
- Modul A20 kini memiliki 20 task (A20.1 Database Kurikulum Merdeka 5 task, A20.2 Bank Soal Manual 10 task, A20.3 Paket Naskah Cetak 5 task).
- Total tugas keseluruhan sistem disesuaikan menjadi **232 Task** (estimasi 14-17 bulan).

---

#### [2026-10-04] [Scope Adjustment] Penyesuaian Ruang Lingkup Fase 4 — Fokus Bank Soal Siap Cetak (Hapus Modul Asesmen & Ujian CBT)
**Status:** ✅ Selesai
**Oleh:** DeepSeek (Mode Pro)
**Keputusan Arsitektur & Ruang Lingkup:**
- **Eliminasi Fitur Ujian & Asesmen:** Modul A19 (Asesmen) dan sub-modul A20.5 (Pelaksanaan Ujian CBT, Live Proctoring, Auto-Grading) dihapus sepenuhnya dari DZITOE. Aplikasi ujian daring telah ditangani oleh sistem terpisah (ADZKIA di Port 8000).
- **Refokus Fase 4 pada Bank Soal Siap Cetak (32 Task):**
  - Database Kurikulum Merdeka (A20.1 - 5 Task): Capaian Pembelajaran (CP), Bab, Materi Pokok.
  - Bank Soal Manual (A20.2 - 10 Task): Input 9 jenis soal, stimulus teks bersama, preview cetak.
  - AI Bank Soal (A20.3 - 12 Task): Generator soal AI terarah Kurikulum Merdeka untuk bank cetak.
  - Paket Naskah Soal & Tata Letak Cetak (A20.4 - 5 Task): Kop resmi sekolah, opsi naskah 1/2 kolom, drag & drop nomor, lembar kunci jawaban & rubrik penilaian cetak terpisah (Word / PDF).
- Total tugas keseluruhan sistem diperbarui menjadi **244 Task** (estimasi 15-18 bulan).

---

#### [2026-10-04] [Roadmap & Tasks Update] Harmonisasi Fase 4 (Asesmen & CBT), Fase 5 (Layanan Murid), dan Roadmap Tahap Akhir (Fase 6-8)
**Status:** ✅ Selesai
**Oleh:** DeepSeek (Mode Pro)
**Yang dikerjakan:**
- **Fase 4: Asesmen & Bank Soal (+ Modul CBT 40 Task):**
  - Database Kurikulum Merdeka (A20.1 - 5 Task): CRUD Capaian Pembelajaran (CP), Bab, Materi Pokok, dan seeding materi mapel.
  - Bank Soal Manual (A20.2 - 10 Task): Form input 9 jenis soal (PG, PG Kompleks, B/S, Jodohkan, Isian Singkat, Uraian, Skala Likert, dll.) serta stimulus teks paragraf bersama.
  - AI Bank Soal (A20.3 - 12 Task): AI generation, asynchronous queue worker, dan prompt engineering Kurikulum Merdeka.
  - Paket Soal & Bobot (A20.4 - 5 Task): Pengelompokan paket ujian, drag & drop urutan butir soal, dan bobot skor.
  - Ujian CBT & Penilaian (A20.5 - 8 Task): Pelaksanaan CBT, auto-grading, scoring esai manual, dan analitika butir soal.
- **Fase 5: Layanan Murid (13 Task):**
  - Modul A21 (Prestasi & Portofolio - 5 Task): Pencatatan prestasi akademik/non-akademik, jenjang lomba, sertifikat, dan akumulasi poin prestasi.
  - Modul A22 (Kesehatan Murid - 5 Task): Rekam medis UKS, alergi/penyakit bawaan, tracking vaksinasi & skrining berkala.
  - Modul A23 (Bimbingan Konseling / BK - 3 Task): Form konseling, catatan pendampingan & disiplin positif (pengganti sistem poin pelanggaran lama), penjadwalan tatap muka.
- **Roadmap Tahap Akhir (Sesuai PRD & Arsitektur):**
  - Fase 6: Portal Alumni (Tracer Study kelulusan/kampus) & Portal Keterbukaan Informasi Publik (PPID) — 10 task.
  - Fase 7: Modul Pelaporan Terpadu (Rekap Absensi Bulanan Dinas, Rekap Mutasi Murid, Laporan Keuangan Tahunan) — 9 task.
  - Fase 8: Optimalisasi Performa, Caching Redis (port 6380), dan Audit Keamanan — 6 task.
- Total task keseluruhan sistem diselaraskan menjadi 259 task.

---

#### [2026-10-04] [UI/UX] Taste Skill & Modern Web Guidance Overhaul — Tindakan Opsional Kelas XII (Wisaya Kenaikan Kelas)
\*\*Status:\*\* ✅ Selesai
\*\*Oleh:\*\* DeepSeek (Mode Pro / Mendalam)
\*\*Yang dikerjakan:\*\*
\- **Tindakan Opsional Kelas XII:**
  \- Menyediakan 3 opsi tindakan ketika switch kelulusan massal dinonaktifkan:
    1. **Tunda Kelulusan Semua (Tetap di Kelas XII):** Seluruh murid kelas XII tetap berstatus AKTIF di rombel lamanya (untuk kasus ujian susulan atau menunggu SK kelulusan dinas).
    2. **Kelulusan Selektif (Pilih Rombel / Murid):** Filter rombel XII.1-XII.10 instan, pencarian nama murid, dan checklist seleksi kelulusan dengan penghitung kuota real-time. Siswa yang tidak dicentang otomatis ditunda.
    3. **Alihkan ke Status Mutasi Keluar:** Siswa dialihkan ke status MUTASI keluar jika tidak menyelesaikan studi di SMAN 20.
  \- Menyesuaikan kalkulasi mesin simulasi *Dry-Run* dan *executePromotion* di `@dzitoe/db` dengan parameter `tindakanKelas12` dan `siswaKelas12LulusIds`.
\- **Peremajaan UI dengan Taste Skill & Modern Web Guidance:**
  \- Penerapan dial design: `VARIANCE: 5`, `MOTION: 4`, `DENSITY: 5` untuk antarmuka enterprise edukasi modern.
  \- Interaksi sentuh tactile (`active:scale-[0.98]`), spring transition pada tombol dan kartu opsi radio.
  \- Filter pills per rombel dengan count chip dan master toggle ("Luluskan Semua di Filter Ini" / "Batal Semua").
  \- High-contrast status badges (WCAG AA compliant) dan layout bento yang bernapas.
\- **Verifikasi & Pengujian:**
  \- Unit test diperbarui di `tests/unit/promotion-wizard.test.ts` (5/5 passed).
  \- Seluruh suite vitest (`48/48 unit tests passed 100%`).
  \- `pnpm typecheck` lulus 0 error.

\---

\#### [2026-10-04] [A5.13] Wisaya Kenaikan Kelas Cerdas (Smart Promotion Wizard) — Jalur Cepat & 1-Click Rollback
\*\*Status:\*\* ✅ Selesai
\*\*Oleh:\*\* DeepSeek (Mode Pro)
\*\*Yang dikerjakan:\*\*
\- \*\*Skema Database Prisma:\*\*
  \- Menambahkan model `RiwayatKelas` (mencatat histori multi-tahun: muridId, kelasId, tahunAjaranId, statusKenaikan NAIK/TINGGAL/LULUS/MUTASI) agar histori absensi dan nilai tahun lalu tidak hilang saat naik kelas.
  \- Menambahkan model `PromotionSnapshot` untuk proteksi pencadangan otomatis (automated snapshot before execution).
  \- Menghubungkan relasi `riwayatKelas` ke model `Murid`, `Kelas`, dan `TahunAjaran`.
\- \*\*Backend & Store Service (@dzitoe/db):\*\*
  \- Membuat `packages/db/src/promotion-store.ts`:
    \- `getPromotionStatus`: Mendeteksi tahun ajaran aktif vs tahun ajaran baru, statistik per jenjang (X, XI, XII), dan memetakan otomatis rombel secara paralel (Jalur Cepat: X.1 -> XI.1, XI.1 -> XII.1).
    \- `generatePromotionPreview`: Mesin simulasi *Dry-Run* tanpa mengubah data database (menghitung calon alumni, proyeksi kuota kelas baru, dan deteksi peringatan overload rombel > 36 murid).
    \- `executePromotion`: Transaksi pencadangan snapshot otomatis, pencatatan `RiwayatKelas`, migrasi status kelas murid, dan pembaruan counter `jumlahMurid` rombel.
    \- `rollbackPromotion`: Tombol darurat 1-klik untuk membatalkan kenaikan kelas dan memulihkan formasi murid ke snapshot sebelum promosi.
\- \*\*API Endpoints (apps/admin):\*\*
  \- `GET /api/kenaikan-kelas/status`
  \- `POST /api/kenaikan-kelas/preview` (Dry-Run Preview)
  \- `POST /api/kenaikan-kelas/execute` (Snapshot + Batch Promotion)
  \- `POST /api/kenaikan-kelas/rollback` (1-Click Rollback)
\- \*\*Frontend Dashboard Admin (apps/admin):\*\*
  \- Membuat antarmuka 4-Langkah terpadu di `apps/admin/src/app/murid/kenaikan-kelas/page.tsx` sesuai standar Modern Web Guidance:
    \- \*\*Langkah 1 (Kelulusan XII):\*\* Otomatisasi kelulusan massal murid kelas XII menjadi LULUS (Alumni) dan pengosongan kuota kelas XII.
    \- \*\*Langkah 2 (Pemetaan Jalur Cepat):\*\* Tabel pemetaan paralel otomatis X->XI dan XI->XII dengan dropdown override fleksibel.
    \- \*\*Langkah 3 (Pengecualian Murid):\*\* Pencarian murid cepat untuk menandai murid tinggal kelas atau mutasi keluar.
    \- \*\*Langkah 4 (Simulasi & Eksekusi):\*\* Kartu ringkasan dry-run, tabel visualisasi kapasitas rombel baru, dan konfirmasi pengaman dengan mengetik `KONFIRMASI` sebelum eksekusi.
  \- Menambahkan navigasi akses cepat di Sidebar Admin dan tombol aksi di Halaman Data Murid (`apps/admin/src/app/murid/page.tsx`).
\- \*\*Verifikasi & Pengujian:\*\*
  \- Menambahkan unit test di `tests/unit/promotion-wizard.test.ts` (4/4 tests passed 100%).
  \- Menjalankan seluruh test suite unit (`47/47 tests passed 100%`).
  \- Menjalankan `pnpm typecheck` lintas monorepo (`0 error`).
  \- Port Guard tetap terjaga aman.

\---

\#### [2026-09-27] [UI/UX] Modern Web Guidance Enhancement — Dashboard Admin & Mobile PWA

\*\*Status:\*\* ✅ Selesai

\*\*Oleh:\*\* DeepSeek

\*\*Yang dikerjakan:\*\*
- Melakukan audit mendalam (scan) tampilan `apps/admin` dan `apps/mobile` menggunakan standar **Modern Web Guidance (Google Chrome / W3C)** dan `DASHBOARD-DESIGN.md`.
- **apps/admin (Dashboard Web Desktop - Port 3000):**
  - Mengimplementasikan **Layout 3 Kolom Responsif** sesuai spesifikasi `DASHBOARD-DESIGN.md`: Sidebar Kiri (272px), Konten Utama terpusat, dan Panel Kanan Terpadu (`ActivityPanel.tsx`, 320px) yang sticky di desktop lebar (≥1440px) serta berupa drawer halus di tablet/laptop (<1440px) dengan toggle di Topbar.
  - Menampilkan notifikasi real-time, live activity feed guru/murid/operator, dan indikator status sistem & port.
  - Memperbarui `Topbar.tsx`: Glassmorphism (`backdrop-blur-md bg-white/80`), search bar dengan shortcut keyboard (`Ctrl + K`), dan toggle panel notifikasi.
  - Memperbarui `globals.css`: Token semantik OKLCH, tipografi modern dengan `text-wrap: balance` pada headings dan `text-wrap: pretty` pada body, scrollbar modern (`scrollbar-gutter: stable`, `scrollbar-width: thin`), dan kurva fisika `var(--ease-out-spring)`.
  - Meningkatkan aksesibilitas `StatCard.tsx` dengan `role="region"`, `aria-label`, dan micro-interaction hover elevation.
- **apps/mobile (Mobile PWA - Port 3001):**
  - Mengoptimalkan `MobileShell.tsx` dengan `100dvh` dynamic viewport, `overscroll-behavior-y: contain` (mencegah pull-to-refresh liar), dan frame smartphone premium saat diakses via desktop.
  - Menyempurnakan `AppHeader.tsx`: Identitas resmi SMAN 20 Kab. Tangerang, indikator status online murid, badge unread count, dan touch target minimum 44px.
  - Meningkatkan `QuickAbsenCard.tsx`: Touch target minimum 48px (WCAG 2.5.5 AAA), simulasi haptic feedback saat tap (`navigator.vibrate`), status radius sekolah (geofencing 15m), dan indikator visual status presensi.
  - Menyempurnakan `BottomNav.tsx`: Safe-area bottom padding (`env(safe-area-inset-bottom)`), active indicator pill dengan spring transition, dan feedback haptic saat berganti tab.
  - Menyempurnakan `ScheduleCard.tsx`: Indikator real-time "Aktif Sekarang" dengan pulsating live dot.
- Verifikasi lulus:
  - `pnpm --filter @dzitoe/admin build` ✅ (Compiled successfully, 0 error)
  - `pnpm --filter @dzitoe/mobile build` ✅ (10 static routes generated, 0 error)
  - Port Guard: Port 3000 & 3001 terisolasi aman, Port 8000 (ADZKIA) & 5173 (PERSOALAN) tetap terlindungi 100%.

---

\#### [2026-09-27] [A0.3] Setup Next.js 14 untuk apps/mobile (PWA)

\*\*Status:\*\* ✅ Selesai

\*\*Oleh:\*\* DeepSeek

\*\*Yang dikerjakan:\*\*

\- Menginisialisasi aplikasi Mobile PWA Next.js 14 App Router di `apps/mobile` dengan TypeScript dan Tailwind CSS.

\- Mengunci dev server di port 3001 (`next dev -p 3001`) dan mengisolasi penuh dari port 8000 (ADZKIA) serta 5173 (PERSOALAN).

\- Mengimplementasikan seluruh komponen UI mobile PWA sesuai DESIGN.md: Frame MobileShell (mobile-first, centered di layar lebar), AppHeader dengan avatar dan status kehadiran, 5 Tab Bottom Navigation (Beranda, Absensi, Profil, Tagihan, Lainnya), QuickAbsenCard (simulasi tahapan GPS + Swafoto), StatGrid, ScheduleCard, dan AnnouncementList.

\- Menyiapkan manifest PWA (`manifest.ts`), service worker (`public/sw.js`), icon SVG adaptif & maskable.

\- Menyiapkan 5 halaman mobile utama: Beranda (`/`), Absensi (`/absensi`), Profil 360° (`/profil`), Tagihan (`/tagihan`), dan Menu Layanan (`/lainnya`).

\- Menerapkan istilah Permendikdasmen 2026: Murid (Siswa), Fasilitasi Belajar (Pembelajaran), Perkembangan Murid, Asesmen, Disiplin Positif.

\- Verifikasi lulus 100%: `pnpm typecheck` (0 error) ✅, `next build` (10 route statis berhasil dioptimalkan) ✅, Port Guard ✅.

\---

#### [2026-09-27] [A0.2] Setup Next.js 14 untuk apps/admin

\*\*Status:\*\* ✅ Selesai

\*\*Oleh:\*\* DeepSeek

\*\*Yang dikerjakan:\*\*

\- Menginisialisasi aplikasi Next.js 14 App Router di `apps/admin` dengan TypeScript dan Tailwind CSS.

\- Mengunci dev server di port 3000 (`next dev -p 3000`) dan memastikan tidak terjadi interferensi dengan port 8000 (ADZKIA) maupun 5173 (PERSOALAN).

\- Mengimplementasikan seluruh komponen UI dashboard admin sesuai DASHBOARD-DESIGN.md: Shell layout responsif (Topbar, Sidebar drawer mobile + fixed desktop), 4 Stat Cards utama (Total Murid: 1.250, Total Guru: 85, Kehadiran Hari Ini: 94,6%, Asesmen Berjalan: 12).

\- Menerapkan istilah resmi Permendikdasmen 2026 pada UI: Murid (Siswa), Fasilitasi Belajar (Pembelajaran), Perkembangan Murid, Asesmen, Disiplin Positif.

\- Verifikasi lulus 100%: `pnpm typecheck` (0 error) ✅, `next build` (compiled successfully) ✅, Port Guard ✅.

\---

#### [2026-09-27] [A0.1] Inisialisasi Monorepo dengan pnpm workspace

\*\*Status:\*\* ✅ Selesai

\*\*Oleh:\*\* DeepSeek

\*\*Yang dikerjakan:\*\*

\- Membuat struktur monorepo pnpm workspace (apps/admin, apps/mobile, packages/shared, packages/ui, packages/config, packages/db, packages/auth, packages/theme, packages/utils, scripts/)

\- Menyiapkan konfigurasi root (pnpm-workspace.yaml, package.json, tsconfig.base.json, .gitignore, .editorconfig, .npmrc, .env.example, README.md)

\- Memasang sistem Port Guard (scripts/check-ports.mjs & @dzitoe/shared/ports.ts) untuk memastikan dev server berjalan di port 3000 (admin) & 3001 (mobile) tanpa pernah bertabrakan dengan port 8000 (ADZKIA) dan 5173 (PERSOALAN)

\- Memetakan database PostgreSQL DZITOE ke port 5433 dan Redis ke 6380 agar port 5432 & 6379 lokal tetap aman

\- Verifikasi lulus 100%: pnpm install ✅, pnpm ports:check ✅, pnpm typecheck ✅

\---

\### 2026 — Planning



\#### \[2026-XX-XX] Inisialisasi Proyek

\*\*Status:\*\* ✅ Selesai

\*\*Oleh:\*\* DeepSeek + Tim IT Sekolah



\*\*Yang dikerjakan:\*\*

\- Membuat dokumen `PRD.md` — Product Requirements Document

\- Membuat dokumen `architecture.md` — Technical Design

\- Membuat dokumen `DESIGN.md` — Design Mobile App

\- Membuat dokumen `DASHBOARD-DESIGN.md` — Design Dashboard Admin

\- Membuat dokumen `TASKS.md` — Daftar Tugas (250+ task)

\- Membuat dokumen `RULES.md` — Aturan Pengerjaan

\- Membuat dokumen `memory.md` — Catatan Progres (file ini)



\*\*Keputusan:\*\*

\- ✅ Menggunakan arsitektur \*\*Opsi 1: Monolith Sederhana\*\* (bukan Headless/Serverless)

\- ✅ Menggunakan \*\*Next.js 14\*\* + \*\*PostgreSQL\*\* + \*\*Prisma\*\*

\- ✅ Menggunakan \*\*Radix UI\*\* (Primitives, Themes, Colors, Icons) untuk UI

\- ✅ Menggunakan \*\*Docker Compose\*\* untuk deployment

\- ✅ Menggunakan \*\*PWA\*\* untuk mobile (bukan native app)

\- ✅ Menggunakan \*\*istilah Permendikdasmen 2026\*\* di semua UI

\- ✅ Format penulisan: \*\*ISTILAH BARU\*\* \*(istilah lama)\*



\*\*Alasan:\*\*

\- Monolith sederhana → mudah di-clone \& di-deploy sekolah

\- Radix UI → accessible, customizable, konsisten

\- PWA → tidak perlu Play Store/App Store, install dari browser

\- Istilah 2026 → kepatuhan regulasi



\*\*Catatan:\*\*

\- Aplikasi \*\*bukan produk komersial\*\* — hanya untuk SMAN 20 Kab. Tangerang

\- Target pengguna: 1.250 murid, 85 guru, 30 kelas

\- Estimasi total: 17-21 bulan



\---



\## 🧠 Keputusan Penting (Decision Log)



\### D-001: Arsitektur Monolith Sederhana

\*\*Tanggal:\*\* 2026

\*\*Status:\*\* ✅ Diputuskan



\*\*Konteks:\*\*

Sekolah butuh aplikasi yang mudah di-deploy \& dipelihara.



\*\*Opsi yang Dipertimbangkan:\*\*

1\. \*\*Opsi 1: Monolith Sederhana\*\* — 1 repo, 1 server, 1 perintah

2\. \*\*Opsi 2: Headless\*\* — Backend + Frontend terpisah

3\. \*\*Opsi 3: Serverless\*\* — Vercel + Supabase



\*\*Keputusan:\*\* \*\*Opsi 1 (Monolith Sederhana)\*\*



\*\*Alasan:\*\*

\- ✅ Data sensitif (keuangan, kesehatan) tetap di sekolah

\- ✅ Internet tidak stabil → aplikasi tetap jalan di LAN

\- ✅ Maintenance mudah → satu repo, satu bahasa

\- ✅ Biaya minimal → tidak ada biaya bulanan cloud

\- ✅ Offline-friendly → PWA dengan service worker



\*\*Konsekuensi:\*\*

\- Butuh server fisik/mini PC (Rp 5-10 juta sekali beli)

\- Tidak skalabel horizontal (tapi tidak perlu untuk 1 sekolah)



\---



\### D-002: PWA vs Native Mobile App

\*\*Tanggal:\*\* 2026

\*\*Status:\*\* ✅ Diputuskan



\*\*Konteks:\*\*

Murid \& guru perlu akses dari HP.



\*\*Opsi yang Dipertimbangkan:\*\*

1\. \*\*PWA\*\* — install dari browser, update otomatis

2\. \*\*Native Android\*\* — Play Store, butuh build

3\. \*\*Native iOS\*\* — App Store, butuh Mac + Apple Developer



\*\*Keputusan:\*\* \*\*PWA (Progressive Web App)\*\*



\*\*Alasan:\*\*

\- ✅ Tidak perlu Play Store/App Store

\- ✅ Update otomatis (tanpa download ulang)

\- ✅ Ukuran kecil (< 5MB)

\- ✅ Bisa akses kamera \& GPS

\- ✅ Bisa offline (service worker)

\- ✅ Satu codebase dengan web



\*\*Konsekuensi:\*\*

\- Tidak bisa di-publish di Play Store (kecuali pakai Capacitor)

\- Terbatas pada browser API



\---



\### D-003: Radix UI vs MUI/Ant Design

\*\*Tanggal:\*\* 2026

\*\*Status:\*\* ✅ Diputuskan



\*\*Konteks:\*\*

Butuh UI library yang accessible \& customizable.



\*\*Opsi yang Dipertimbangkan:\*\*

1\. \*\*Radix UI\*\* — headless, accessible, customizable

2\. \*\*MUI\*\* — opinionated, besar

3\. \*\*Ant Design\*\* — opinionated, enterprise



\*\*Keputusan:\*\* \*\*Radix UI\*\* (Primitives + Themes + Colors + Icons)



\*\*Alasan:\*\*

\- ✅ WAI-ARIA compliant

\- ✅ Tree-shakeable, bundle kecil

\- ✅ Dark mode otomatis (Radix Colors)

\- ✅ Bisa dikombinasikan dengan Tailwind

\- ✅ shadcn/ui pakai Radix di baliknya



\*\*Konsekuensi:\*\*

\- Perlu styling sendiri (tapi ini fleksibilitas)



\---



\### D-004: Istilah Permendikdasmen 2026

\*\*Tanggal:\*\* 2026

\*\*Status:\*\* ✅ Diputuskan



\*\*Konteks:\*\*

Ada regulasi baru tentang istilah pendidikan.



\*\*Keputusan:\*\* \*\*Gunakan istilah baru\*\* di semua UI.



\*\*Format:\*\*

\- Di UI: \*\*ISTILAH BARU\*\* (bold)

\- Di tooltip: \*\*ISTILAH BARU\*\* \*(istilah lama)\*

\- Di database: field netral (English)



\*\*Contoh:\*\*

\- \*\*Murid\*\* \*(Siswa)\*

\- \*\*Asesmen\*\* \*(Penilaian)\*

\- \*\*Fasilitasi Belajar\*\* \*(Pengajaran)\*

\- \*\*Disiplin Positif\*\* \*(Hukuman)\*



\*\*Alasan:\*\*

\- ✅ Kepatuhan regulasi

\- ✅ Menempatkan anak sebagai manusia seutuhnya

\- ✅ Paradigma baru pendidikan



\---



\### D-005: Absensi GPS + Foto Selfie

\*\*Tanggal:\*\* 2026

\*\*Status:\*\* ✅ Diputuskan



\*\*Konteks:\*\*

Absensi manual rawan kecurangan.



\*\*Keputusan:\*\* \*\*Validasi ganda: GPS + Foto Selfie\*\*



\*\*Detail:\*\*

\- GPS + Radius → murid harus di area sekolah

\- Foto Selfie → bukti visual kehadiran

\- Watermark → koordinat tertanam di foto

\- Deteksi Mock Location → anti-fake GPS

\- Timestamp Server → waktu tidak bisa dimanipulasi



\*\*Alasan:\*\*

\- ✅ Mencegah kecurangan

\- ✅ Bukti visual yang kuat

\- ✅ Data valid \& akurat



\*\*Konsekuensi:\*\*

\- Butuh kamera depan yang berfungsi

\- Butuh GPS yang akurat

\- Storage lebih besar (foto)



\---



\### D-006: Deployment Docker Compose

\*\*Tanggal:\*\* 2026

\*\*Status:\*\* ✅ Diputuskan



\*\*Konteks:\*\*

Sekolah butuh deploy yang mudah.



\*\*Keputusan:\*\* \*\*Docker Compose\*\*



\*\*Alasan:\*\*

\- ✅ Satu perintah: `docker compose up -d`

\- ✅ Isolasi environment

\- ✅ Mudah di-rollback

\- ✅ Bisa jalan di server lokal



\*\*Konsekuensi:\*\*

\- Butuh Docker terinstall

\- Butuh server dengan RAM minimal 4GB



\---



\## 🚧 Blocker \& Hambatan



\### Blocker Aktif

| No | Blocker | Dampak | Solusi | Status |

|---|---|---|---|---|

| - | Tidak ada | - | - | - |



\### Blocker yang Sudah Teratasi

| No | Blocker | Solusi | Tanggal |

|---|---|---|---|

| - | Tidak ada | - | - |



\---



\## 💡 Peluang \& Ide



\### Ide yang Sedang Dipertimbangkan

| No | Ide | Prioritas | Status |

|---|---|---|---|

| 1 | Push notification untuk tagihan jatuh tempo | 🟡 | ⬜ |

| 2 | WhatsApp integration untuk notifikasi | 🟢 | ⬜ |

| 3 | QR code untuk absensi cepat | 🟢 | ⬜ |

| 4 | Export laporan ke Excel \& PDF | 🔴 | ⬜ |

| 5 | Dashboard khusus kepala sekolah | 🟡 | ⬜ |

| 6 | Tracer study alumni via form online | 🟢 | ⬜ |

| 7 | Integrasi dengan Dapodik | 🟢 | ⬜ |

| 8 | Chat konseling BK (anonim) | 🟢 | ⬜ |



\### Ide yang Ditolak

| No | Ide | Alasan |

|---|---|---|

| 1 | Video conference | Tidak perlu, bukan tujuan |

| 2 | Chat real-time | Kompleks, tidak perlu |

| 3 | AI/ML recommendation | Terlalu advanced |

| 4 | Payment gateway online | Hanya pencatatan, bukan pembayaran |



\---



\## ⚠️ Risiko



| No | Risiko | Dampak | Mitigasi | Status |

|---|---|---|---|---|

| 1 | Internet tidak stabil | Absensi gagal | PWA offline + sync | ⬜ |

| 2 | GPS tidak akurat | Validasi gagal | Akurasi minimal 50m | ⬜ |

| 3 | Mock location | Kecurangan | Deteksi mock location | ⬜ |

| 4 | Server down | Layanan terganggu | Backup server + monitoring | ⬜ |

| 5 | Data hilang | Kehilangan data | Backup otomatis harian | ⬜ |

| 6 | Adopsi rendah | Sistem tidak dipakai | Training \& sosialisasi | ⬜ |

| 7 | Perubahan regulasi | Istilah tidak sesuai | Update berkala | ⬜ |

| 8 | Biaya server | Beban sekolah | Server lokal (mini PC) | ⬜ |

| 9 | Kamera HP rusak | Absensi gagal | Fallback ke webcam | ⬜ |

| 10 | Storage penuh | Foto tidak tersimpan | Kompresi + cleanup | ⬜ |



\---



\## 🔧 Catatan Teknis



\### Setup Development

```bash

\# Clone repo

git clone https://github.com/sekolah/dzitoe.git

cd dzitoe



\# Install dependencies

pnpm install



\# Setup environment

cp .env.example .env

nano .env



\# Migrasi database

pnpm prisma migrate dev



\# Seed data awal

pnpm seed



\# Jalankan development

pnpm dev

```



\### Port Default

| Aplikasi | Port |

|---|---|

| \*\*Admin\*\* | 3000 |

| \*\*Mobile\*\* | 3001 |

| \*\*PostgreSQL\*\* | 5432 |

| \*\*Redis\*\* | 6379 |

| \*\*Prisma Studio\*\* | 5555 |

| \*\*Nginx\*\* | 80/443 |



\### Environment Variables

```env

\# Database

DATABASE\_URL="postgresql://dzitoe:password@localhost:5432/dzitoe"



\# Auth

NEXTAUTH\_URL="http://localhost:3000"

NEXTAUTH\_SECRET="random\_string\_32\_chars"



\# Redis

REDIS\_URL="redis://localhost:6379"



\# Upload

UPLOAD\_DIR="/uploads"

MAX\_FILE\_SIZE=5242880  # 5MB



\# Radius Sekolah

SCHOOL\_LATITUDE=-6.123456

SCHOOL\_LONGITUDE=106.123456

SCHOOL\_RADIUS=100  # meter

MAX\_GPS\_ACCURACY=50  # meter

```



\### Konfigurasi Radius Sekolah

| Parameter | Nilai Default | Keterangan |

|---|---|---|

| Radius Sekolah | 100 meter | Dapat diubah admin |

| Akurasi GPS Maksimal | 50 meter | Tolak jika lebih |

| Waktu Absen Masuk | 06:00 - 08:00 | Dapat diubah |

| Batas Terlambat | 07:15 | Dapat diubah |

| Waktu Absen Pulang | 12:00 - 17:00 | Dapat diubah |

| Wajib Foto Selfie | Ya | Tidak bisa dimatikan |

| Deteksi Mock Location | Ya | Tidak bisa dimatikan |



\---



\## 📊 Statistik Proyek



\### Jumlah Task per Fase

| Fase | Jumlah Task | Selesai | Progress |

|---|---|---|---|

| \*\*Fase 1\*\* | 96 | 0 | 0% |

| \*\*Fase 2\*\* | 51 | 0 | 0% |

| \*\*Fase 3\*\* | 27 | 0 | 0% |

| \*\*Fase 4\*\* | 16 | 0 | 0% |

| \*\*Fase 5\*\* | ±30 | 0 | 0% |

| \*\*Fase 6\*\* | ±10 | 0 | 0% |

| \*\*Fase 7\*\* | ±15 | 0 | 0% |

| \*\*Fase 8\*\* | ±5 | 0 | 0% |

| \*\*Total\*\* | \*\*250+\*\* | \*\*0\*\* | \*\*0%\*\* |



\### Timeline

| Fase | Durasi | Mulai | Selesai |

|---|---|---|---|

| \*\*Fase 1\*\* | 2-3 bulan | 2026 | 2026 |

| \*\*Fase 2\*\* | 3-4 bulan | 2026 | 2027 |

| \*\*Fase 3\*\* | 2 bulan | 2027 | 2027 |

| \*\*Fase 4\*\* | 2 bulan | 2027 | 2027 |

| \*\*Fase 5\*\* | 2-3 bulan | 2027 | 2027 |

| \*\*Fase 6\*\* | 1-2 bulan | 2027 | 2027 |

| \*\*Fase 7\*\* | 1-2 bulan | 2027 | 2027 |

| \*\*Fase 8\*\* | 1 bulan | 2027 | 2028 |



\---



\## 🎓 Pembelajaran



\### Yang Sudah Dipelajari

| No | Pelajaran | Tanggal |

|---|---|---|

| 1 | Monolith lebih cocok untuk sekolah daripada microservices | 2026 |

| 2 | PWA lebih praktis daripada native app untuk sekolah | 2026 |

| 3 | Radix UI lebih fleksibel daripada MUI | 2026 |

| 4 | Istilah Permendikdasmen 2026 wajib diterapkan | 2026 |

| 5 | Validasi ganda (GPS + Selfie) lebih aman | 2026 |



\### Yang Perlu Diperbaiki

| No | Perbaikan | Prioritas |

|---|---|---|

| 1 | Dokumentasi API perlu dilengkapi | 🟡 |

| 2 | Test coverage perlu ditingkatkan | 🟡 |

| 3 | Monitoring perlu disetup | 🟡 |

| 4 | Training untuk guru \& TU perlu disiapkan | 🔴 |



\---



\## 🔄 Next Action



\### Immediate (Minggu Ini)

\- \[ ] Setup monorepo (A0.1)

\- \[ ] Setup Next.js admin (A0.2)

\- \[ ] Setup Next.js mobile (A0.3)

\- \[ ] Setup Tailwind (A0.4)

\- \[ ] Setup Radix UI (A0.5)



\### Short-term (Bulan Ini)

\- \[ ] Setup Prisma + PostgreSQL (A0.6)

\- \[ ] Setup NextAuth (A0.7)

\- \[ ] Setup Docker Compose (A0.8)

\- \[ ] Schema User \& Role (A1.1)

\- \[ ] API login (A1.2)



\### Medium-term (3 Bulan)

\- \[ ] Selesaikan Fase 1 (Fondasi)

\- \[ ] Mulai Fase 2 (Absensi GPS + Selfie)



\---



\## 📞 Kontak \& Komunikasi



\### Tim Proyek

| Peran | Nama | Kontak | Tanggung Jawab |

|---|---|---|---|

| \*\*AI Developer\*\* | \*\*DeepSeek\*\* | - | Semua kode \& dokumentasi |

| \*\*Pemilik Produk\*\* | Kepala SMAN 20 Kab. Tangerang | - | Requirement \& approval |

| \*\*Project Manager\*\* | TU | - | Koordinasi \& timeline |

| \*\*Support\*\* | Admin IT | - | Maintenance \& support |



\### Jadwal Komunikasi

| Kegiatan | Frekuensi | Peserta |

|---|---|---|

| \*\*Daily Standup\*\* | Harian | DeepSeek + Tim IT |

| \*\*Weekly Review\*\* | Mingguan | DeepSeek + PM |

| \*\*Monthly Report\*\* | Bulanan | DeepSeek + Stakeholder |



\---



\## 🔗 Referensi



\### Dokumen Proyek

\- \*\*PRD.md\*\* — Product Requirements Document

\- \*\*architecture.md\*\* — Technical Design

\- \*\*DESIGN.md\*\* — Design Mobile App

\- \*\*DASHBOARD-DESIGN.md\*\* — Design Dashboard Admin

\- \*\*TASKS.md\*\* — Daftar Tugas

\- \*\*RULES.md\*\* — Aturan Pengerjaan

\- \*\*memory.md\*\* — Catatan Progres (file ini)



\### Referensi Eksternal

\- \*\*Permendikdasmen No. 1–6 Tahun 2026\*\* — Istilah baru pendidikan

\- \*\*Radix UI\*\* — https://www.radix-ui.com

\- \*\*Next.js\*\* — https://nextjs.org

\- \*\*Prisma\*\* — https://www.prisma.io

\- \*\*Docker\*\* — https://www.docker.com

\- \*\*PostgreSQL\*\* — https://www.postgresql.org



\---



\## 📝 Template Update



Setiap kali ada progres, update dengan format:



```markdown

\#### \[YYYY-MM-DD] Judul Task

\*\*Status:\*\* ✅ Selesai / 🟨 Sedang / ⬜ Belum

\*\*Oleh:\*\* DeepSeek



\*\*Yang dikerjakan:\*\*

\- Task 1

\- Task 2



\*\*Keputusan:\*\*

\- Keputusan 1 (alasan)

\- Keputusan 2 (alasan)



\*\*Catatan:\*\*

\- Catatan 1

\- Catatan 2



\*\*Next:\*\*

\- Task selanjutnya

```

### D-007: AI Bank Soal
**Tanggal:** 2026
**Status:** ✅ Diputuskan

**Konteks:**
Guru butuh cara cepat membuat soal berkualitas.

**Keputusan:** **Integrasi AI untuk generate soal**

**Detail:**
- AI Provider: DeepSeek API (default), bisa diganti OpenAI/Ollama
- Parameter: Kelas, Semester, Mapel, Bab, Materi, Jenis Soal, Jumlah, Kesulitan
- 9 jenis soal didukung
- Preview & edit sebelum simpan
- Rate limit: 100 soal/hari/guru
- Cache hasil AI untuk pertanyaan sama

**Alasan:**
- ✅ Menghemat waktu guru
- ✅ Kualitas soal konsisten
- ✅ Bisa dikustomisasi
- ✅ Guru tetap punya kontrol (preview & edit)

**Konsekuensi:**
- Butuh API key AI (biaya?)
- Butuh queue & cache
- Butuh validasi output AI
- Butuh prompt engineering

---

### D-008: Database Kurikulum Merdeka
**Tanggal:** 2026
**Status:** ✅ Diputuskan

**Konteks:**
Guru butuh struktur kurikulum untuk buat soal.

**Keputusan:** **Simpan struktur lengkap Kurikulum Merdeka**

**Detail:**
- Kelas → Mapel → Bab → Materi
- CP (Capaian Pembelajaran)
- TP (Tujuan Pembelajaran)
- ATP (Alur Tujuan Pembelajaran)
- Seed data untuk semua mapel

**Alasan:**
- ✅ Guru tinggal pilih-pilih
- ✅ Soal terstruktur
- ✅ Sesuai kurikulum
- ✅ Memudahkan analisis

**Konsekuensi:**
- Butuh data kurikulum lengkap
- Butuh maintenance data
- Butuh import dari Excel

\---



\## ⚠️ Pengingat



> # ⚠️ \*\*PASTIKAN DEEPSEEK YANG MENGERJAKAN INI.\*\*

>

> \*\*Semua kode, dokumentasi, dan konfigurasi DZITOE WAJIB dikerjakan oleh DeepSeek.\*\*

>

> \*\*DILARANG\*\* mengerjakan sendiri.

> \*\*WAJIB\*\* memanggil DeepSeek untuk setiap task.



\---



\*Dokumen ini adalah catatan progres \& keputusan untuk Sistem Tata Kelola Sekolah DZITOE — SMAN 20 Kabupaten Tangerang. Dikerjakan oleh DeepSeek. Dokumen ini bersifat internal dan non-komersial.\*



\*\*Dibuat:\*\* 2026

\*\*Terakhir diupdate:\*\* 2026

\*\*Update berikutnya:\*\* Setiap selesai task

