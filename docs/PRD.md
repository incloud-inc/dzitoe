\# PRD.md — Product Requirements Document

\## Sistem Tata Kelola Sekolah DZITOE

\### SMAN 20 Kabupaten Tangerang



> \*\*Versi:\*\* 1.0.0

> \*\*Status:\*\* Draft

> \*\*Tanggal:\*\* 2026

> \*\*Pemilik Produk:\*\* SMAN 20 Kabupaten Tangerang

> \*\*Pengembang:\*\* DeepSeek (AI) + Tim IT Sekolah

> \*\*Klasifikasi:\*\* Dokumen Internal (Non-Komersial)



\---



\## 1. Latar Belakang



\### 1.1. Konteks

SMAN 20 Kabupaten Tangerang adalah sekolah menengah atas negeri yang memiliki:

\- \*\*±1.250 Murid\*\* \*(Siswa)\*

\- \*\*±85 Guru \& Tenaga Kependidikan\*\*

\- \*\*±30 Kelas\*\* (X, XI, XII — IPA \& IPS)



Saat ini, tata kelola sekolah masih dilakukan secara \*\*manual\*\* dan \*\*terpisah-pisah\*\*:

\- Absensi murid dicatat di kertas

\- Keuangan dicatat di Excel

\- Data murid tersebar di berbagai file

\- Laporan memakan waktu berhari-hari



\### 1.2. Masalah yang Dihadapi

| No | Masalah | Dampak |

|---|---|---|

| 1 | Absensi manual | Rawan kecurangan, sulit rekap |

| 2 | Keuangan terpisah | Sulit tracking tunggakan |

| 3 | Data tersebar | Sulit akses profil lengkap murid |

| 4 | Laporan lambat | Keputusan tidak real-time |

| 5 | Tidak ada tracer study | Akreditasi terhambat |

| 6 | PPID manual | Transparansi kurang |



\### 1.3. Solusi

Membangun \*\*Sistem Tata Kelola Sekolah DZITOE\*\* — aplikasi web terintegrasi yang:

\- Digitalisasi seluruh proses tata kelola

\- Absensi berbasis GPS + Foto Selfie

\- Keuangan terpusat dengan cicilan

\- Profil Murid 360°

\- Laporan real-time



\---



\## 2. Tujuan Produk



\### 2.1. Tujuan Utama

1\. \*\*Digitalisasi tata kelola sekolah\*\* — mengurangi pencatatan manual hingga 80%

2\. \*\*Absensi akurat\*\* — GPS + Foto Selfie untuk mencegah kecurangan

3\. \*\*Transparansi keuangan\*\* — tagihan, cicilan, pembayaran tercatat rapi

4\. \*\*Monitoring real-time\*\* — dashboard untuk kepala sekolah \& TU

5\. \*\*Kepatuhan regulasi\*\* — sesuai Permendikdasmen No. 1–6 Tahun 2026



\### 2.2. Tujuan Sekunder

1\. \*\*Profil Murid 360°\*\* — data lengkap dalam satu tampilan

2\. \*\*Bank Soal\*\* — memudahkan asesmen

3\. \*\*Database Alumni\*\* — tracer study \& akreditasi

4\. \*\*PPID\*\* — transparansi publik

5\. \*\*Pelayanan BK\*\* — bimbingan konseling terstruktur



\### 2.3. Bukan Tujuan (Out of Scope)

\- ❌ Bukan produk komersial (tidak dijual ke sekolah lain)

\- ❌ Tidak ada fitur pembayaran online (hanya pencatatan)

\- ❌ Tidak ada fitur video conference

\- ❌ Tidak ada fitur chat real-time

\- ❌ Tidak ada fitur AI/ML (kecuali rekomendasi sederhana)



\---



\## 3. Target Pengguna



| Role | Deskripsi | Jumlah | Akses Utama |

|---|---|---|---|

| \*\*Admin\*\* | Operator IT sekolah | 2-3 orang | Semua modul |

| \*\*Kepala Sekolah\*\* | Pimpinan sekolah | 1 orang | Dashboard, laporan |

| \*\*TU\*\* | Tata Usaha | 3-5 orang | Keuangan, murid, absensi |

| \*\*Guru\*\* | Tenaga pendidik | 60-70 orang | Absensi KBM, asesmen, bank soal |

| \*\*Murid\*\* | Peserta didik | ±1.250 orang | Absensi, profil, tagihan |

| \*\*Orang Tua\*\* | Wali murid | ±1.250 orang | Profil anak, tagihan, izin |

| \*\*Guru BK\*\* | Bimbingan konseling | 2-3 orang | Pelayanan BK, disiplin positif |

| \*\*Petugas PPID\*\* | Informasi publik | 1-2 orang | PPID, dokumen |



\---



\## 4. Fitur Utama



\### 4.1. Dashboard Admin

\*\*Deskripsi:\*\* Pusat kendali untuk monitoring kondisi sekolah.



\*\*Fitur:\*\*

\- Ringkasan kondisi sekolah (jumlah murid, guru, tendik)

\- Statistik kehadiran hari ini

\- Statistik keuangan (tagihan, pembayaran, tunggakan)

\- Grafik tren kehadiran (line chart)

\- Komposisi status absensi (donut chart)

\- Notifikasi \& aktivitas terbaru



\*\*Pengguna:\*\* Admin, Kepala Sekolah, TU



\---



\### 4.2. Manajemen Murid

\*\*Deskripsi:\*\* Mengelola seluruh data murid.



\*\*Fitur:\*\*

\- \*\*Data Murid\*\* — NIS/NISN, nama, jenis kelamin, kelas, tahun ajaran, status

\- \*\*Kelas\*\* — nama kelas, tingkat, wali kelas, jumlah murid

\- \*\*Orang Tua/Wali\*\* — nama, hubungan, nomor HP, murid terkait

\- \*\*Mutasi Murid\*\* — jenis mutasi, tanggal, keterangan

\- \*\*Profil Murid 360°\*\* — integrasi semua data murid



\*\*Pengguna:\*\* Admin, TU



\---



\### 4.3. Tenaga Pendidik \& Kependidikan

\*\*Deskripsi:\*\* Mengelola data guru dan staf.



\*\*Fitur:\*\*

\- \*\*Data Guru\*\* — NIP/NUPTK, nama, mata pelajaran, jabatan, status

\- \*\*Data Tenaga Kependidikan\*\* — NIP, nama, jabatan, status

\- \*\*Jabatan\*\* — kepala sekolah, guru, TU, operator, dll.

\- \*\*Absensi Guru \& Tendik\*\* — GPS + Foto Selfie



\*\*Pengguna:\*\* Admin, TU



\---



\### 4.4. Absensi (GPS + Foto Selfie)

\*\*Deskripsi:\*\* Absensi berbasis lokasi dan foto selfie.



\*\*Fitur Murid:\*\*

\- \*\*Absen Masuk\*\* — waktu, lokasi, jarak dari sekolah, status, foto selfie

\- \*\*Absen Pulang\*\* — waktu, lokasi, jarak dari sekolah, status, foto selfie

\- \*\*GPS/Location\*\* — latitude, longitude, akurasi lokasi

\- \*\*Validasi Radius\*\* — jarak siswa dari titik sekolah, status valid/tidak valid

\- \*\*Status Absensi\*\* — hadir, terlambat, izin, sakit, alpa

\- \*\*Riwayat Absensi\*\* — tanggal, jam masuk, jam pulang, status

\- \*\*Detail Absensi\*\* — waktu, lokasi, jarak, status, foto selfie

\- \*\*Pengajuan Izin\*\* — tanggal, alasan, lampiran, status pengajuan

\- \*\*Pengajuan Sakit\*\* — tanggal, keterangan, lampiran, status

\- \*\*Notifikasi\*\* — berhasil absen, terlambat, izin disetujui/ditolak



\*\*Fitur Guru \& Tendik:\*\*

\- \*\*Absen KBM\*\* — GPS + Foto Selfie

\- \*\*Rekap Absensi\*\* — kehadiran mengajar

\- \*\*Riwayat Absensi\*\* — detail absensi guru



\*\*Fitur Admin:\*\*

\- \*\*Rekap Absensi\*\* — tanggal, kelas, jumlah hadir, terlambat, izin, sakit, alpa

\- \*\*Verifikasi Absensi\*\* — approval manual jika diperlukan

\- \*\*Konfigurasi Radius\*\* — titik sekolah, radius, akurasi maksimal

\- \*\*Deteksi Mock Location\*\* — anti-fake GPS



\*\*Pengguna:\*\* Murid, Guru, Tendik, Admin



\---



\### 4.5. Keuangan

\*\*Deskripsi:\*\* Mengelola tagihan dan pembayaran.



\*\*Fitur:\*\*

\- \*\*Jenis Tagihan\*\* — nama tagihan, nominal, periode, jatuh tempo

\- \*\*Tagihan\*\* — murid, jenis tagihan, nominal, jatuh tempo, status

\- \*\*Tagihan Cicilan\*\* — tagihan yang dapat dicicil

\- \*\*Tagihan Bulanan\*\* — tagihan rutin bulanan

\- \*\*Pembayaran\*\* — nomor transaksi, murid, tagihan, nominal, tanggal, metode

\- \*\*Pembayaran Cicilan\*\* — cicilan ke-, nominal, sisa, tanggal, metode

\- \*\*Tunggakan\*\* — murid, kelas, tagihan, nominal, jatuh tempo

\- \*\*Riwayat Pembayaran\*\* — murid, tanggal, jenis pembayaran, nominal, status



\*\*Pengguna:\*\* TU, Admin



\---



### 4.6. Asesmen & Bank Soal

#### 4.6.1. Asesmen
- Asesmen Formatif
- Asesmen Sumatif
- Asesmen Diagnostik
- Asesmen Proyek
- Analisis hasil asesmen

#### 4.6.2. Bank Soal Manual
- Input soal manual oleh guru
- Kategori soal berdasarkan:
  - Kelas (X, XI, XII)
  - Semester (Ganjil, Genap)
  - Mata Pelajaran
  - Bab/Materi (Kurikulum Merdeka)
  - Tingkat kesulitan (Mudah, Sedang, Sulit)
- 9 jenis soal:
  1. Pilihan Ganda (single answer)
  2. Pilihan Ganda Multi (multiple answers)
  3. Benar-Salah
  4. Mencocokkan (matching)
  5. Isian Singkat
  6. Mengurutkan (ordering)
  7. Jawaban Berbasis Poin (poin-based)
  8. Jawaban Panjang/Uraian
  9. Soal dengan Paragraf (1 paragraf untuk beberapa soal)

#### 4.6.3. Bank Soal dengan AI
- Generate soal otomatis dengan AI
- Parameter:
  - Kelas
  - Semester
  - Mata Pelajaran
  - Bab/Materi
  - Jenis soal (9 tipe)
  - Jumlah soal
  - Tingkat kesulitan
  - Ada paragraf / tidak
- Preview & edit sebelum simpan
- Simpan ke bank soal

#### 4.6.4. Database Kurikulum Merdeka
- Struktur lengkap: Kelas → Mapel → Bab → Materi
- Terintegrasi dengan:
  - Capaian Pembelajaran (CP)
  - Tujuan Pembelajaran (TP)
  - Alur Tujuan Pembelajaran (ATP)
- Guru tinggal pilih-pilih saat buat soal

#### 4.6.5. Paket Soal
- Gabungkan soal dari bank soal
- Atur urutan & bobot
- Generate paket ujian

#### 4.6.6. Ujian
- Jadwalkan ujian
- Pilih peserta
- Mode ujian (online/offline)
- Anti-cheat

#### 4.6.7. Hasil Ujian
- Nilai otomatis (untuk soal objektif)
- Penilaian manual (untuk uraian)
- Analisis butir soal
- Statistik



\### 4.7. Prestasi

\*\*Deskripsi:\*\* Mengelola prestasi murid.



\*\*Fitur:\*\*

\- \*\*Prestasi Akademik\*\* — nama siswa, jenis lomba, tingkat, peringkat, tahun

\- \*\*Prestasi Non-Akademik\*\* — nama siswa, bidang, jenis lomba, tingkat, peringkat, tahun

\- \*\*Rekap Prestasi\*\* — siswa, jenis, tingkat, tahun, poin



\*\*Pengguna:\*\* Admin, TU, Guru



\---



\### 4.8. Data Kesehatan Murid

\*\*Deskripsi:\*\* Mengelola data kesehatan murid.



\*\*Fitur:\*\*

\- \*\*Riwayat Kesehatan\*\* — siswa, penyakit, alergi, obat, catatan

\- \*\*Pemeriksaan\*\* — siswa, tanggal, hasil, tindakan

\- \*\*Imunisasi\*\* — siswa, jenis imunisasi, tanggal

\- \*\*Catatan Medis\*\* — siswa, kondisi, penanganan



\*\*Pengguna:\*\* Admin, Guru BK, Petugas UKS



\---



\### 4.9. Pelayanan BK

\*\*Deskripsi:\*\* Bimbingan konseling dan disiplin positif.



\*\*Fitur:\*\*

\- \*\*Jenis Layanan\*\* — nama layanan, deskripsi

\- \*\*Konseling\*\* — siswa, konselor, tanggal, permasalahan, solusi, status

\- \*\*Kasus Siswa\*\* — siswa, jenis kasus, tindakan, status

\- \*\*Rujukan\*\* — siswa, tujuan rujukan, alasan, status

\- \*\*Disiplin Positif\*\* — pembinaan perilaku tanpa hukuman



\*\*Pengguna:\*\* Guru BK, Admin



\---



\### 4.10. Ekstrakurikuler

\*\*Deskripsi:\*\* Mengelola kegiatan ekstrakurikuler.



\*\*Fitur:\*\*

\- \*\*Data Ekstrakurikuler\*\* — nama kegiatan, pembina, jadwal, lokasi

\- \*\*Peserta\*\* — nama murid, kelas, ekstrakurikuler

\- \*\*Kehadiran\*\* — tanggal, kegiatan, peserta, status hadir



\*\*Pengguna:\*\* Admin, Pembina Ekstra



\---



\### 4.11. Database Alumni

\*\*Deskripsi:\*\* Mengelola data lulusan.



\*\*Fitur:\*\*

\- \*\*Data Alumni\*\* — NISN, nama, tahun lulus, kelas terakhir, kontak

\- \*\*Tracer Study\*\* — status lanjutan, institusi/instansi, tahun

\- \*\*Kegiatan Alumni\*\* — nama kegiatan, tanggal, peserta, keterangan



\*\*Pengguna:\*\* Admin, TU



\---



\### 4.12. PPID

\*\*Deskripsi:\*\* Informasi publik dan permohonan informasi.



\*\*Fitur:\*\*

\- \*\*Informasi Publik\*\* — judul, kategori, tanggal, file

\- \*\*Permohonan Informasi\*\* — pemohon, informasi diminta, status

\- \*\*Dokumen\*\* — nama dokumen, kategori, tanggal upload



\*\*Pengguna:\*\* Petugas PPID, Admin, Publik



\---



\### 4.13. Laporan

\*\*Deskripsi:\*\* Rekap dan analisis data.



\*\*Fitur:\*\*

\- \*\*Laporan Murid\*\* — rekap per kelas/tingkat/status

\- \*\*Laporan Absensi\*\* — rekap kehadiran, rekap foto selfie

\- \*\*Laporan Guru\*\* — rekap kepegawaian

\- \*\*Laporan Pembayaran\*\* — tagihan, pembayaran, tunggakan

\- \*\*Laporan Ekstrakurikuler\*\* — kegiatan, peserta

\- \*\*Laporan Prestasi\*\* — akademik \& non-akademik

\- \*\*Laporan Kesehatan\*\* — riwayat kesehatan

\- \*\*Laporan BK\*\* — layanan BK

\- \*\*Laporan Alumni\*\* — data alumni



\*\*Pengguna:\*\* Admin, Kepala Sekolah, TU



\---



\### 4.14. Pengaturan

\*\*Deskripsi:\*\* Konfigurasi sistem.



\*\*Fitur:\*\*

\- \*\*Profil Sekolah\*\* — nama, alamat, logo, kontak, titik lokasi sekolah

\- \*\*Tahun Ajaran\*\* — tahun ajaran, semester, status aktif

\- \*\*Pengguna\*\* — nama, username, role, status

\- \*\*Hak Akses\*\* — menu/fitur yang dapat diakses



\*\*Pengguna:\*\* Admin

### 4.15. AI Bank Soal
- Integrasi dengan AI (DeepSeek API / OpenAI / lokal)
- Generate soal berdasarkan parameter
- Preview & edit
- Simpan ke bank soal
- Feedback untuk improve AI

\---



\## 5. Kebutuhan Non-Fungsional



| Aspek | Kebutuhan |

|---|---|

| \*\*Platform\*\* | Web (Desktop) + PWA (Mobile) |

| \*\*Browser\*\* | Chrome, Firefox, Safari, Edge (versi terbaru) |

| \*\*Bahasa\*\* | Indonesia |

| \*\*Istilah\*\* | Sesuai Permendikdasmen No. 1–6 Tahun 2026 |

| \*\*Keamanan\*\* | HTTPS, bcrypt, JWT, audit log |

| \*\*Performa\*\* | < 3 detik load time |

| \*\*Skalabilitas\*\* | 1.250 murid, 85 guru, 30 kelas |

| \*\*Backup\*\* | Otomatis harian |

| \*\*Offline\*\* | PWA dengan service worker |

| \*\*Aksesibilitas\*\* | WAI-ARIA compliant |

| \*\*Responsif\*\* | Mobile-first, tablet, desktop |

| \*\*Dark Mode\*\* | Ya (Radix Colors) |



\---



\## 6. Batasan (Out of Scope)



\- ❌ Bukan produk komersial (tidak dijual)

\- ❌ Tidak ada fitur pembayaran online (hanya pencatatan)

\- ❌ Tidak ada fitur video conference

\- ❌ Tidak ada fitur chat real-time

\- ❌ Tidak ada fitur AI/ML (kecuali rekomendasi sederhana)

\- ❌ Tidak ada fitur SMS gateway (kecuali notifikasi in-app)

\- ❌ Tidak ada fitur WhatsApp integration (kecuali link)



\---



\## 7. Metrik Keberhasilan



| Metrik | Target | Cara Ukur |

|---|---|---|

| \*\*Adopsi Murid\*\* | 90% murid menggunakan absensi GPS | Log absensi |

| \*\*Adopsi Guru\*\* | 100% guru menggunakan absensi KBM | Log absensi |

| \*\*Akurasi Absensi\*\* | 99% akurat (validasi GPS + foto) | Audit sample |

| \*\*Pengurangan Kertas\*\* | 80% pengurangan pencatatan manual | Survey |

| \*\*Kepuasan Pengguna\*\* | 4.5/5 dari survei | Survei |

| \*\*Waktu Laporan\*\* | < 5 menit untuk generate laporan | Benchmark |

| \*\*Uptime\*\* | 99% (jam sekolah) | Monitoring |

| \*\*Response Time\*\* | < 2 detik untuk API | Monitoring |



\---



\## 8. Roadmap



| Fase | Fokus | Modul | Durasi | Output |

|---|---|---|---|---|

| \*\*Fase 1\*\* | Fondasi \& Data Master | A1-A8, B1-B2 | 2-3 bulan | Sistem dasar berjalan |

| \*\*Fase 2\*\* | Inti Absensi (GPS + Selfie) | A9-A13, B3-B10 | 3-4 bulan | Absensi GPS + Foto aktif |

| \*\*Fase 3\*\* | Keuangan | A14-A18 | 2 bulan | Keuangan terkelola |

| **Fase 4** | Asesmen & Bank Soal + AI | A19-A20 | 3-4 bulan | Evaluasi belajar + AI |

| \*\*Fase 5\*\* | Layanan (Kesehatan, BK, Prestasi) | A21-A23, B16-B20 | 2-3 bulan | Layanan murid lengkap |

| \*\*Fase 6\*\* | Alumni \& PPID | A25-A26 | 1-2 bulan | Data lulusan \& publik |

| \*\*Fase 7\*\* | Laporan | A27-A35 | 1-2 bulan | Reporting lengkap |

| \*\*Fase 8\*\* | Optimalisasi | Semua | 1 bulan | Sistem matang |



\*\*Total Estimasi:\*\* 15-18 bulan (dapat dipercepat dengan tim paralel)



\---



\## 9. Risiko \& Mitigasi



| No | Risiko | Dampak | Mitigasi |

|---|---|---|---|

| 1 | Internet tidak stabil | Absensi gagal | PWA offline + sync |

| 2 | GPS tidak akurat | Validasi gagal | Akurasi minimal 50m |

| 3 | Mock location | Kecurangan | Deteksi mock location |

| 4 | Server down | Layanan terganggu | Backup server + monitoring |

| 5 | Data hilang | Kehilangan data | Backup otomatis harian |

| 6 | Adopsi rendah | Sistem tidak dipakai | Training \& sosialisasi |

| 7 | Perubahan regulasi | Istilah tidak sesuai | Update berkala |

| 8 | Biaya server | Beban sekolah | Server lokal (mini PC) |



\---



\## 10. Referensi



\- \*\*Permendikdasmen No. 1–6 Tahun 2026\*\* — Istilah baru pendidikan

\- \*\*Radix UI\*\* — Komponen UI (Primitives, Themes, Colors, Icons)

\- \*\*Next.js 14\*\* — Framework

\- \*\*PostgreSQL 16\*\* — Database

\- \*\*Prisma\*\* — ORM

\- \*\*Docker\*\* — Deployment

\- \*\*Let's Encrypt\*\* — SSL



\---



\## 11. Lampiran



\### 11.1. Kamus Istilah (Permendikdasmen 2026)



| Istilah Lama \*(konteks)\* | \*\*Istilah Baru (Wajib)\*\* |

|---|---|

| \*Siswa / Peserta Didik\* | \*\*Murid\*\* |

| \*Pengajaran\* | \*\*Fasilitasi Belajar\*\* |

| \*Kegiatan Pembelajaran\* | \*\*Pengalaman Belajar\*\* |

| \*Proses Pembelajaran\* | \*\*Proses Memuliakan Murid\*\* |

| \*Hasil Belajar\* | \*\*Perkembangan Murid\*\* |

| \*Penilaian / Formatif-Sumatif\* | \*\*Asesmen\*\* |

| \*Hukuman / Sanksi\* | \*\*Disiplin Positif\*\* |

| \*Lingkungan Sekolah\* | \*\*Budaya Sekolah Aman dan Nyaman\*\* |

| \*Pelibatan Orang Tua / Komite\* | \*\*PSPB\*\* |



\### 11.2. Kontak



| Peran | Nama | Kontak |

|---|---|---|

| \*\*Pemilik Produk\*\* | Kepala SMAN 20 Kab. Tangerang | - |

| \*\*Project Manager\*\* | TU | - |

| \*\*Developer\*\* | DeepSeek (AI) + Tim IT | - |

| \*\*Support\*\* | Admin IT | - |



\---



\*Dokumen ini adalah PRD untuk Sistem Tata Kelola Sekolah DZITOE — SMAN 20 Kabupaten Tangerang. Dikerjakan oleh DeepSeek. Dokumen ini bersifat internal dan non-komersial.\*

