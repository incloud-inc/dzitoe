\# DESIGN.md — Design System \& Mobile App

\## Sistem Tata Kelola Sekolah DZITOE

\### SMAN 20 Kabupaten Tangerang



> \*\*Versi:\*\* 1.0.0

> \*\*Status:\*\* Draft

> \*\*Tanggal:\*\* 2026

> \*\*Aplikasi:\*\* Mobile PWA (Murid, Guru, Tendik, Orang Tua)

> \*\*Stack UI:\*\* Radix UI (Primitives, Themes, Colors, Icons) + Tailwind CSS + Framer Motion

> \*\*Klasifikasi:\*\* Dokumen Internal (Non-Komersial)



\---



\## 1. Overview



\### 1.1. Deskripsi

`DESIGN.md` ini adalah panduan desain untuk \*\*aplikasi mobile PWA DZITOE\*\* yang digunakan oleh:

\- \*\*Murid\*\* — Absensi GPS + Foto Selfie, profil, tagihan, prestasi, asesmen

\- \*\*Guru\*\* — Absensi KBM GPS + Foto Selfie, profil, kelas

\- \*\*Tenaga Kependidikan\*\* — Absensi GPS + Foto Selfie, profil

\- \*\*Orang Tua\*\* — Profil anak, tagihan, pengajuan izin, komunikasi



\### 1.2. Prinsip Desain

1\. \*\*Mobile-first\*\* — dioptimalkan untuk HP

2\. \*\*Cepat\*\* — load < 2 detik, responsif

3\. \*\*Aman\*\* — foto selfie \& GPS terenkripsi

4\. \*\*Ramah\*\* — istilah sesuai Permendikdasmen 2026

5\. \*\*Accessible\*\* — WAI-ARIA compliant (Radix UI)



\### 1.3. Target Perangkat

| Perangkat | Ukuran | Browser |

|---|---|---|

| \*\*Mobile\*\* | 360x640 - 428x926 | Chrome, Safari, Samsung Internet |

| \*\*Tablet\*\* | 768x1024 | Chrome, Safari |

| \*\*Desktop\*\* | 1280x720+ | Chrome, Firefox, Safari, Edge |



\---



\## 2. Design Tokens



\### 2.1. Warna (Radix Colors)



\#### 2.1.1. Semantic Colors

| Token | Radix Scale | Penggunaan |

|---|---|---|

| `--color-primary` | `blue-9` | Tombol aksi utama, link, highlight |

| `--color-primary-hover` | `blue-10` | Hover state |

| `--color-primary-active` | `blue-11` | Active state |

| `--color-success` | `green-9` | Status hadir, sukses |

| `--color-warning` | `amber-9` | Status terlambat |

| `--color-danger` | `red-9` | Status alpa, error |

| `--color-info` | `cyan-9` | Status izin |

| `--color-neutral` | `slate-9` | Netral |



\#### 2.1.2. Background \& Surface

| Token | Radix Scale | Penggunaan |

|---|---|---|

| `--color-bg` | `slate-1` | Background halaman |

| `--color-card` | `white` | Background kartu |

| `--color-header` | `slate-12` | Header profil (dark navy) |

| `--color-overlay` | `slate-12` (50%) | Overlay modal |



\#### 2.1.3. Text

| Token | Radix Scale | Penggunaan |

|---|---|---|

| `--color-text-primary` | `slate-12` | Teks utama |

| `--color-text-secondary` | `slate-11` | Teks sekunder |

| `--color-text-tertiary` | `slate-9` | Teks tersier |

| `--color-text-inverse` | `white` | Teks di dark background |



\#### 2.1.4. Border

| Token | Radix Scale | Penggunaan |

|---|---|---|

| `--color-border` | `slate-6` | Garis pemisah |

| `--color-border-subtle` | `slate-4` | Border halus |

| `--color-border-strong` | `slate-8` | Border tebal |



\#### 2.1.5. Heatmap Colors (Radix Green Scale)

| Token | Radix Scale | Penggunaan |

|---|---|---|

| `--heatmap-0` | `slate-3` | Tidak ada aktivitas |

| `--heatmap-1` | `green-4` | Aktivitas rendah |

| `--heatmap-2` | `green-6` | Aktivitas sedang |

| `--heatmap-3` | `green-8` | Aktivitas tinggi |

| `--heatmap-4` | `green-10` | Aktivitas sangat tinggi |



\#### 2.1.6. Status Absensi

| Status | Warna | Radix Scale |

|---|---|---|

| \*\*Hadir\*\* | Hijau | `green-9` |

| \*\*Terlambat\*\* | Kuning | `amber-9` |

| \*\*Izin\*\* | Cyan | `cyan-9` |

| \*\*Sakit\*\* | Merah | `red-9` |

| \*\*Alpa\*\* | Abu-abu | `slate-9` |



\### 2.2. Tipografi



| Elemen | Font | Size | Weight | Line Height |

|---|---|---|---|---|

| \*\*Nama Pengguna\*\* | Inter | 20px | Bold (700) | 1.3 |

| \*\*Username/NIS\*\* | Inter | 14px | Regular (400) | 1.5 |

| \*\*Bio/Status\*\* | Inter | 13px | Regular (400) | 1.5 |

| \*\*Statistik Angka\*\* | Inter | 18px | Bold (700) | 1.2 |

| \*\*Statistik Label\*\* | Inter | 11px | Regular (400) | 1.4 |

| \*\*Tab Menu\*\* | Inter | 14px | Medium (500) | 1.4 |

| \*\*Judul Section\*\* | Inter | 16px | Bold (700) | 1.4 |

| \*\*Body Text\*\* | Inter | 14px | Regular (400) | 1.6 |

| \*\*Caption\*\* | Inter | 12px | Regular (400) | 1.5 |

| \*\*Button\*\* | Inter | 14px | SemiBold (600) | 1.2 |



\*\*Font Fallback:\*\* `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`



\### 2.3. Spacing



| Token | Nilai | Penggunaan |

|---|---|---|

| `--spacing-xs` | 4px | Jarak dalam komponen |

| `--spacing-sm` | 8px | Jarak antar elemen kecil |

| `--spacing-md` | 16px | Jarak antar komponen |

| `--spacing-lg` | 24px | Jarak antar section |

| `--spacing-xl` | 32px | Jarak antar halaman |

| `--spacing-2xl` | 48px | Jarak besar |



\### 2.4. Radius



| Token | Nilai | Penggunaan |

|---|---|---|

| `--radius-sm` | 4px | Badge, tag |

| `--radius-md` | 8px | Input, button |

| `--radius-lg` | 12px | Card |

| `--radius-xl` | 16px | Card besar |

| `--radius-2xl` | 24px | Button rounded |

| `--radius-full` | 9999px | Avatar, pill |



\### 2.5. Shadow



| Token | Nilai | Penggunaan |

|---|---|---|

| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Card halus |

| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` | Card |

| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modal |

| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Dialog |



\### 2.6. Animation



| Token | Nilai | Penggunaan |

|---|---|---|

| `--duration-fast` | 150ms | Hover, tap |

| `--duration-normal` | 250ms | Transisi |

| `--duration-slow` | 400ms | Modal, page transition |

| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Masuk |

| `--ease-in` | `cubic-bezier(0.7, 0, 0.84, 0)` | Keluar |



\---



\## 3. Struktur Halaman Mobile



\### 3.1. Peta Halaman



```

DZITOE Mobile

├── Auth

│   ├── Login

│   ├── Lupa Password

│   └── Onboarding (opsional)

│

├── Beranda (Home)

│   ├── Status Absensi Hari Ini

│   ├── Tombol Absen Cepat

│   ├── Statistik Kehadiran

│   └── Aktivitas Terbaru

│

├── Absensi

│   ├── Absen Masuk (GPS + Selfie)

│   ├── Absen Pulang (GPS + Selfie)

│   ├── Riwayat Absensi

│   ├── Detail Absensi

│   ├── Pengajuan Izin

│   └── Pengajuan Sakit

│

├── Profil (360°)

│   ├── Data Pribadi

│   ├── Kehadiran

│   ├── Akademik

│   ├── Kesehatan

│   ├── Prestasi

│   ├── BK

│   ├── Keuangan

│   └── Ekstrakurikuler

│

├── Tagihan

│   ├── Daftar Tagihan

│   ├── Detail Tagihan

│   ├── Cicilan

│   └── Riwayat Pembayaran

│

├── Prestasi

│   ├── Prestasi Akademik

│   └── Prestasi Non-Akademik

│

├── Asesmen

│   ├── Daftar Asesmen

│   └── Detail Nilai

│

└── Pengaturan

&#x20;   ├── Profil Akun

&#x20;   ├── Notifikasi

&#x20;   ├── Dark Mode

&#x20;   ├── Bahasa

&#x20;   └── Logout

```



\### 3.2. Navigasi



\#### 3.2.1. Bottom Navigation (Tab Bar)

5 tab utama di bawah:



| Tab | Ikon | Halaman |

|---|---|---|

| \*\*Beranda\*\* | `HomeIcon` | Beranda |

| \*\*Absensi\*\* | `MapPinIcon` | Absensi |

| \*\*Profil\*\* | `PersonIcon` | Profil 360° |

| \*\*Tagihan\*\* | `WalletIcon` | Tagihan |

| \*\*Lainnya\*\* | `HamburgerMenuIcon` | Menu lainnya |



\#### 3.2.2. Header

\- Back button (jika bukan halaman utama)

\- Judul halaman

\- Action button (notifikasi, profil)



\---



\## 4. Halaman Detail



\### 4.1. Halaman Login



\*\*Layout:\*\*

```

┌─────────────────────────────────────┐

│                                     │

│         \[LOGO DZITOE]               │

│      Sistem Tata Kelola Sekolah     │

│      SMAN 20 Kab. Tangerang         │

│                                     │

│  ┌───────────────────────────────┐  │

│  │  NIS / NIP / Email            │  │

│  └───────────────────────────────┘  │

│                                     │

│  ┌───────────────────────────────┐  │

│  │  Password              \[👁️]   │  │

│  └───────────────────────────────┘  │

│                                     │

│  \[ ] Ingat saya      Lupa password? │

│                                     │

│  ┌───────────────────────────────┐  │

│  │        MASUK                  │  │

│  └───────────────────────────────┘  │

│                                     │

│  Belum punya akun? Hubungi Admin    │

│                                     │

└─────────────────────────────────────┘

```



\*\*Komponen Radix:\*\*

\- `TextField` — input NIS/NIP/Email

\- `TextField` — input Password

\- `Checkbox` — Ingat saya

\- `Button` — Masuk

\- `Link` — Lupa password



\*\*Validasi (Zod):\*\*

```ts

const loginSchema = z.object({

&#x20; identifier: z.string().min(1, 'NIS/NIP/Email wajib diisi'),

&#x20; password: z.string().min(6, 'Password minimal 6 karakter'),

});

```



\---



\### 4.2. Halaman Beranda



\*\*Layout:\*\*

```

┌─────────────────────────────────────┐

│  Header Profil (Dark Mode)          │

│  ┌─────────────────────────────┐    │

│  │  \[AVATAR]  Ahmad Fauzi      │    │

│  │  @ahmadfauzi — NIS 123456   │    │

│  │  Murid Kelas XII IPA 1      │    │

│  │                             │    │

│  │  \[ TOMBOL ABSEN SEKARANG ]  │    │

│  └─────────────────────────────┘    │

├─────────────────────────────────────┤

│  Statistik Kehadiran                │

│  ┌──────┬──────┬──────┬──────┐     │

│  │ 95%  │  12  │  3   │  1   │     │

│  │Hadir │Telat │Izin  │Sakit │     │

│  └──────┴──────┴──────┴──────┘     │

├─────────────────────────────────────┤

│  Tab: \[Ringkasan] Riwayat Prestasi  │

│  ─────────                          │

├─────────────────────────────────────┤

│  Rekap Kehadiran 1 Tahun Terakhir   │

│  \[HEATMAP GRID]                     │

├─────────────────────────────────────┤

│  Aktivitas Terbaru                  │

│  ┌─────────────────────────────┐    │

│  │ 📍 Absen Masuk              │    │

│  │ Hari ini, 07:15 WIB         │    │

│  │ Status: HADIR               │    │

│  └─────────────────────────────┘    │

│  ┌─────────────────────────────┐    │

│  │ 🏆 Prestasi: Juara 1 OSN    │    │

│  │ Tingkat Kabupaten, 2026     │    │

│  └─────────────────────────────┘    │

└─────────────────────────────────────┘

│  Bottom Navigation                  │

│  \[🏠] \[📍] \[👤] \[💰] \[☰]           │

└─────────────────────────────────────┘

```



\*\*Komponen Radix:\*\*

\- `Avatar` — foto profil

\- `Button` — Absen Sekarang

\- `Tabs` — Ringkasan, Riwayat, Prestasi, Asesmen

\- `Card` — Aktivitas

\- `Badge` — Status



\*\*Data yang Ditampilkan:\*\*

\- Nama, NIS, Kelas

\- Statistik: Hadir %, Terlambat, Izin, Sakit

\- Heatmap kehadiran 1 tahun

\- Aktivitas terbaru (absensi, prestasi, asesmen)



\---



\### 4.3. Halaman Absensi (GPS + Selfie)



\*\*Alur:\*\*

```

1\. Klik "Absen Sekarang"

2\. Dialog konfirmasi

3\. Aktifkan GPS

4\. Validasi GPS

5\. Validasi Radius

6\. Ambil Foto Selfie

7\. Generate Watermark

8\. Preview \& Konfirmasi

9\. Upload

10\. Notifikasi Berhasil

```



\*\*Layout Dialog:\*\*

```

┌─────────────────────────────────────┐

│  ✕              Absen Masuk         │

├─────────────────────────────────────┤

│                                     │

│  Pastikan Anda berada di area       │

│  sekolah                            │

│                                     │

│  ✅ GPS: -6.123456, 106.123456      │

│  ✅ Akurasi: ±5m                    │

│  ✅ Jarak: 25m dari sekolah         │

│                                     │

│  ┌─────────────────────────────┐    │

│  │                             │    │

│  │      \[PREVIEW KAMERA]       │    │

│  │                             │    │

│  │                             │    │

│  └─────────────────────────────┘    │

│                                     │

│  ┌─────────────────────────────┐    │

│  │  📷 Ambil Foto Selfie       │    │

│  └─────────────────────────────┘    │

│                                     │

│  ┌─────────────────────────────┐    │

│  │  Konfirmasi Absen           │    │

│  └─────────────────────────────┘    │

│                                     │

└─────────────────────────────────────┘

```



\*\*Komponen Radix:\*\*

\- `Dialog` — modal absensi

\- `Button` — trigger, ambil foto, konfirmasi

\- `Progress` — loading upload



\*\*Validasi GPS:\*\*

```ts

// Haversine Formula

function calculateDistance(lat1, lon1, lat2, lon2) {

&#x20; const R = 6371e3; // radius bumi (meter)

&#x20; const φ1 = lat1 \* Math.PI / 180;

&#x20; const φ2 = lat2 \* Math.PI / 180;

&#x20; const Δφ = (lat2 - lat1) \* Math.PI / 180;

&#x20; const Δλ = (lon2 - lon1) \* Math.PI / 180;



&#x20; const a = Math.sin(Δφ/2) \* Math.sin(Δφ/2) +

&#x20;           Math.cos(φ1) \* Math.cos(φ2) \*

&#x20;           Math.sin(Δλ/2) \* Math.sin(Δλ/2);

&#x20; const c = 2 \* Math.atan2(Math.sqrt(a), Math.sqrt(1-a));



&#x20; return R \* c; // jarak dalam meter

}

```



\*\*Watermark Foto:\*\*

```

┌─────────────────────────────────────┐

│  DZITOE — SMAN 20 KAB. TANGERANG    │

│                                     │

│         \[FOTO SELFIE MURID]         │

│                                     │

│  ┌───────────────────────────────┐  │

│  │ Nama: Ahmad Fauzi             │  │

│  │ NIS: 1234567890               │  │

│  │ Kelas: XII IPA 1              │  │

│  │ ───────────────────────────── │  │

│  │ Lat: -6.123456                │  │

│  │ Long: 106.123456              │  │

│  │ Akurasi: ±5m                  │  │

│  │ Jarak: 25m dari sekolah       │  │

│  │ ───────────────────────────── │  │

│  │ 2026-01-15 07:15:23 WIB       │  │

│  │ Status: HADIR                 │  │

│  └───────────────────────────────┘  │

│                                     │

└─────────────────────────────────────┘

```



\*\*Anti-Kecurangan:\*\*

| Fitur | Implementasi |

|---|---|

| Deteksi Mock Location | `isFromMockProvider()` |

| Validasi Radius | Haversine Formula |

| Foto Selfie Wajib | Camera API |

| Watermark Koordinat | Canvas API |

| Timestamp Server | NTP Server |

| Device Fingerprint | Device Info API |

| Akurasi GPS Minimal | Tolak jika > 50m |

| Satu Absen per Hari | Database Constraint |



\---



\### 4.4. Halaman Profil 360°



\*\*Layout:\*\*

```

┌─────────────────────────────────────┐

│  ←              Profil              │

├─────────────────────────────────────┤

│  \[AVATAR]                           │

│  Ahmad Fauzi                        │

│  NIS: 1234567890                    │

│  Kelas: XII IPA 1                   │

│  Status: Aktif                      │

├─────────────────────────────────────┤

│  Tab: \[Kehadiran] Akademik Kesehatan│

│       Prestasi BK Keuangan          │

│  ─────────                          │

├─────────────────────────────────────┤

│  Kehadiran                          │

│  ┌─────────────────────────────┐    │

│  │ Hadir: 95%                  │    │

│  │ Terlambat: 12 hari          │    │

│  │ Izin: 3 hari                │    │

│  │ Sakit: 1 hari               │    │

│  │ Alpa: 0 hari                │    │

│  └─────────────────────────────┘    │

│                                     │

│  Grafik Kehadiran Bulanan           │

│  \[BAR CHART]                        │

│                                     │

│  Riwayat Absensi Terbaru            │

│  ┌─────────────────────────────┐    │

│  │ 15 Jan 2026 — Hadir         │    │

│  │ 14 Jan 2026 — Hadir         │    │

│  │ 13 Jan 2026 — Terlambat     │    │

│  └─────────────────────────────┘    │

└─────────────────────────────────────┘

```



\*\*Tab Profil 360°:\*\*

1\. \*\*Kehadiran\*\* — rekap absensi, heatmap, riwayat

2\. \*\*Akademik\*\* — nilai, asesmen, rapor

3\. \*\*Kesehatan\*\* — riwayat penyakit, alergi, imunisasi

4\. \*\*Prestasi\*\* — akademik \& non-akademik

5\. \*\*BK\*\* — riwayat konseling, disiplin positif

6\. \*\*Keuangan\*\* — tagihan, pembayaran, tunggakan



\---



\### 4.5. Halaman Tagihan



\*\*Layout:\*\*

```

┌─────────────────────────────────────┐

│  ←              Tagihan             │

├─────────────────────────────────────┤

│  Ringkasan                          │

│  ┌─────────────────────────────┐    │

│  │ Total Tagihan: Rp 2.500.000 │    │

│  │ Sudah Bayar:   Rp 1.500.000 │    │

│  │ Sisa:          Rp 1.000.000 │    │

│  └─────────────────────────────┘    │

├─────────────────────────────────────┤

│  Daftar Tagihan                     │

│  ┌─────────────────────────────┐    │

│  │ SPP Januari 2026            │    │

│  │ Rp 500.000                  │    │

│  │ Jatuh tempo: 31 Jan 2026    │    │

│  │ Status: LUNAS               │    │

│  └─────────────────────────────┘    │

│  ┌─────────────────────────────┐    │

│  │ Uang Gedung                 │    │

│  │ Rp 2.000.000                │    │

│  │ Cicilan 1/4                 │    │

│  │ Status: CICILAN             │    │

│  └─────────────────────────────┘    │

├─────────────────────────────────────┤

│  Riwayat Pembayaran                 │

│  ┌─────────────────────────────┐    │

│  │ 15 Jan 2026 — Rp 500.000    │    │

│  │ Metode: Transfer            │    │

│  └─────────────────────────────┘    │

└─────────────────────────────────────┘

```



\*\*Komponen Radix:\*\*

\- `Card` — kartu tagihan

\- `Badge` — status (Lunas, Cicilan, Tunggakan)

\- `Progress` — progress cicilan

\- `Tabs` — Daftar, Riwayat



\---



\### 4.6. Halaman Prestasi



\*\*Layout:\*\*

```

┌─────────────────────────────────────┐

│  ←              Prestasi            │

├─────────────────────────────────────┤

│  Tab: \[Akademik] Non-Akademik       │

│  ─────────                          │

├─────────────────────────────────────┤

│  Prestasi Akademik                  │

│  ┌─────────────────────────────┐    │

│  │ 🏆 Juara 1 OSN Matematika   │    │

│  │ Tingkat Kabupaten, 2026     │    │

│  │ Penyelenggara: Dinas Pendidikan│  │

│  └─────────────────────────────┘    │

│  ┌─────────────────────────────┐    │

│  │ 🏆 Juara 2 Lomba Fisika     │    │

│  │ Tingkat Provinsi, 2025      │    │

│  └─────────────────────────────┘    │

├─────────────────────────────────────┤

│  Prestasi Non-Akademik              │

│  ┌─────────────────────────────┐    │

│  │ 🏆 Juara 1 Futsal           │    │

│  │ Tingkat Kabupaten, 2025     │    │

│  └─────────────────────────────┘    │

└─────────────────────────────────────┘

```



\---



\### 4.7. Halaman Asesmen



\*\*Layout:\*\*

```

┌─────────────────────────────────────┐

│  ←              Asesmen             │

├─────────────────────────────────────┤

│  Filter: \[Semester ▼] \[Mapel ▼]    │

├─────────────────────────────────────┤

│  Daftar Asesmen                     │

│  ┌─────────────────────────────┐    │

│  │ Matematika — Sumatif 1      │    │

│  │ Nilai: 95                   │    │

│  │ Peringkat: 3 dari 30        │    │

│  │ Tanggal: 10 Jan 2026        │    │

│  └─────────────────────────────┘    │

│  ┌─────────────────────────────┐    │

│  │ Fisika — Formatif 2         │    │

│  │ Nilai: 88                   │    │

│  │ Peringkat: 5 dari 30        │    │

│  └─────────────────────────────┘    │

├─────────────────────────────────────┤

│  Grafik Nilai per Mapel             │

│  \[BAR CHART]                        │

└─────────────────────────────────────┘

```



\---



\## 5. Komponen UI (Reusable)



\### 5.1. ProfileHeader



```tsx

// components/profil/ProfileHeader.tsx

import \* as Avatar from '@radix-ui/react-avatar';

import \* as Dialog from '@radix-ui/react-dialog';

import { CameraIcon, CheckCircledIcon } from '@radix-ui/react-icons';



interface ProfileHeaderProps {

&#x20; user: {

&#x20;   name: string;

&#x20;   username: string;

&#x20;   nis?: string;

&#x20;   nip?: string;

&#x20;   bio: string;

&#x20;   avatar?: string;

&#x20; };

&#x20; buttonText: string;

&#x20; onButtonClick?: () => void;

}



export function ProfileHeader({ user, buttonText, onButtonClick }: ProfileHeaderProps) {

&#x20; return (

&#x20;   <div className="bg-slate-12 text-white p-6 rounded-b-3xl relative overflow-hidden">

&#x20;     {/\* Ilustrasi dekoratif \*/}

&#x20;     <div className="absolute inset-0 opacity-20 pointer-events-none">

&#x20;       {/\* Planet, bintang, orbit (SVG) \*/}

&#x20;     </div>



&#x20;     <div className="flex flex-col items-center relative z-10">

&#x20;       <div className="relative">

&#x20;         <Avatar.Root className="w-24 h-24 rounded-full border-4 border-white">

&#x20;           <Avatar.Image

&#x20;             src={user.avatar}

&#x20;             alt={user.name}

&#x20;             className="w-full h-full rounded-full object-cover"

&#x20;           />

&#x20;           <Avatar.Fallback className="bg-blue-9 text-white flex items-center justify-center text-2xl font-bold">

&#x20;             {user.name\[0]}

&#x20;           </Avatar.Fallback>

&#x20;         </Avatar.Root>

&#x20;         <CheckCircledIcon className="absolute bottom-0 right-0 w-6 h-6 text-blue-9 bg-white rounded-full" />

&#x20;       </div>



&#x20;       <h1 className="text-xl font-bold mt-3">{user.name}</h1>

&#x20;       <p className="text-sm text-slate-11">

&#x20;         @{user.username} {user.nis \&\& `— NIS ${user.nis}`}

&#x20;         {user.nip \&\& `— NIP ${user.nip}`}

&#x20;       </p>

&#x20;       <p className="text-xs text-slate-11 mt-1 text-center">{user.bio}</p>



&#x20;       <button

&#x20;         onClick={onButtonClick}

&#x20;         className="mt-4 bg-green-9 hover:bg-green-10 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-colors"

&#x20;       >

&#x20;         <CameraIcon /> {buttonText}

&#x20;       </button>

&#x20;     </div>

&#x20;   </div>

&#x20; );

}

```



\### 5.2. StatsGrid



```tsx

// components/profil/StatsGrid.tsx

interface StatItem {

&#x20; value: string;

&#x20; label: string;

&#x20; color: string;

}



interface StatsGridProps {

&#x20; items: StatItem\[];

}



export function StatsGrid({ items }: StatsGridProps) {

&#x20; return (

&#x20;   <div className="grid grid-cols-4 gap-4 p-4">

&#x20;     {items.map((item, i) => (

&#x20;       <div key={i} className="text-center">

&#x20;         <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>

&#x20;         <div className="text-xs text-slate-11 mt-1">{item.label}</div>

&#x20;       </div>

&#x20;     ))}

&#x20;   </div>

&#x20; );

}

```



\### 5.3. TabMenu



```tsx

// components/profil/TabMenu.tsx

import \* as Tabs from '@radix-ui/react-tabs';



interface TabMenuProps {

&#x20; tabs: { value: string; label: string; content: React.ReactNode }\[];

&#x20; defaultValue?: string;

}



export function TabMenu({ tabs, defaultValue }: TabMenuProps) {

&#x20; return (

&#x20;   <Tabs.Root defaultValue={defaultValue || tabs\[0].value}>

&#x20;     <Tabs.List className="flex border-b border-slate-6 overflow-x-auto">

&#x20;       {tabs.map((tab) => (

&#x20;         <Tabs.Trigger

&#x20;           key={tab.value}

&#x20;           value={tab.value}

&#x20;           className="px-4 py-2 text-sm font-medium text-slate-11 whitespace-nowrap

&#x20;                      data-\[state=active]:text-green-9

&#x20;                      data-\[state=active]:border-b-2

&#x20;                      data-\[state=active]:border-green-9

&#x20;                      transition-colors"

&#x20;         >

&#x20;           {tab.label}

&#x20;         </Tabs.Trigger>

&#x20;       ))}

&#x20;     </Tabs.List>



&#x20;     {tabs.map((tab) => (

&#x20;       <Tabs.Content key={tab.value} value={tab.value} className="p-4">

&#x20;         {tab.content}

&#x20;       </Tabs.Content>

&#x20;     ))}

&#x20;   </Tabs.Root>

&#x20; );

}

```



\### 5.4. Heatmap



```tsx

// components/profil/Heatmap.tsx

interface HeatmapDay {

&#x20; date: string;

&#x20; level: 0 | 1 | 2 | 3 | 4;

&#x20; status: string;

}



interface HeatmapProps {

&#x20; data: HeatmapDay\[];

}



const colorScale = \[

&#x20; 'var(--slate-3)',

&#x20; 'var(--green-4)',

&#x20; 'var(--green-6)',

&#x20; 'var(--green-8)',

&#x20; 'var(--green-10)',

];



export function Heatmap({ data }: HeatmapProps) {

&#x20; return (

&#x20;   <div className="p-4">

&#x20;     <h3 className="text-sm font-bold mb-3">Rekap Kehadiran 1 Tahun Terakhir</h3>



&#x20;     {/\* Label bulan \*/}

&#x20;     <div className="flex justify-between text-xs text-slate-11 mb-2">

&#x20;       <span>Nov</span>

&#x20;       <span>Des</span>

&#x20;       <span>Jan</span>

&#x20;       <span>Feb</span>

&#x20;       <span>Mar</span>

&#x20;       <span>Apr</span>

&#x20;     </div>



&#x20;     {/\* Grid \*/}

&#x20;     <div className="grid grid-cols-52 gap-1">

&#x20;       {data.map((day, i) => (

&#x20;         <div

&#x20;           key={i}

&#x20;           className="w-2.5 h-2.5 rounded-sm"

&#x20;           style={{ backgroundColor: colorScale\[day.level] }}

&#x20;           title={`${day.date}: ${day.status}`}

&#x20;         />

&#x20;       ))}

&#x20;     </div>



&#x20;     {/\* Legenda \*/}

&#x20;     <div className="flex items-center gap-2 mt-3 text-xs text-slate-11">

&#x20;       <span>Sedikit</span>

&#x20;       <div className="flex gap-0.5">

&#x20;         {colorScale.map((color, i) => (

&#x20;           <div

&#x20;             key={i}

&#x20;             className="w-3 h-3 rounded-sm"

&#x20;             style={{ backgroundColor: color }}

&#x20;           />

&#x20;         ))}

&#x20;       </div>

&#x20;       <span>Banyak</span>

&#x20;     </div>

&#x20;   </div>

&#x20; );

}

```



\### 5.5. ActivityCard



```tsx

// components/profil/ActivityCard.tsx

import { MapPinIcon, TrophyIcon, ClipboardIcon } from '@radix-ui/react-icons';



interface ActivityCardProps {

&#x20; icon: React.ReactNode;

&#x20; title: string;

&#x20; subtitle: string;

&#x20; status?: string;

&#x20; statusColor?: string;

&#x20; extra?: string;

}



export function ActivityCard({

&#x20; icon,

&#x20; title,

&#x20; subtitle,

&#x20; status,

&#x20; statusColor = 'green',

&#x20; extra,

}: ActivityCardProps) {

&#x20; const statusColorMap = {

&#x20;   green: 'bg-green-3 text-green-11',

&#x20;   amber: 'bg-amber-3 text-amber-11',

&#x20;   red: 'bg-red-3 text-red-11',

&#x20;   cyan: 'bg-cyan-3 text-cyan-11',

&#x20;   slate: 'bg-slate-3 text-slate-11',

&#x20; };



&#x20; return (

&#x20;   <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-3">

&#x20;     <div className="flex items-start gap-3">

&#x20;       <div className="text-2xl">{icon}</div>

&#x20;       <div className="flex-1">

&#x20;         <h4 className="font-bold text-sm">{title}</h4>

&#x20;         <p className="text-xs text-slate-11 mt-1">{subtitle}</p>



&#x20;         {status \&\& (

&#x20;           <span

&#x20;             className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${

&#x20;               statusColorMap\[statusColor as keyof typeof statusColorMap]

&#x20;             }`}

&#x20;           >

&#x20;             {status}

&#x20;           </span>

&#x20;         )}



&#x20;         {extra \&\& <p className="text-xs text-slate-11 mt-2">{extra}</p>}

&#x20;       </div>

&#x20;     </div>

&#x20;   </div>

&#x20; );

}

```



\### 5.6. AbsenDialog (GPS + Selfie)



```tsx

// components/absensi/AbsenDialog.tsx

'use client';



import \* as Dialog from '@radix-ui/react-dialog';

import \* as Toast from '@radix-ui/react-toast';

import { CameraIcon, Cross2Icon, CheckIcon } from '@radix-ui/react-icons';

import { useState } from 'react';



interface AbsenDialogProps {

&#x20; type: 'masuk' | 'pulang';

&#x20; onSuccess?: () => void;

}



export function AbsenDialog({ type, onSuccess }: AbsenDialogProps) {

&#x20; const \[open, setOpen] = useState(false);

&#x20; const \[step, setStep] = useState<'gps' | 'camera' | 'preview'>('gps');

&#x20; const \[location, setLocation] = useState<any>(null);

&#x20; const \[photo, setPhoto] = useState<string | null>(null);



&#x20; const handleAbsen = async () => {

&#x20;   // 1. Validasi GPS

&#x20;   // 2. Ambil foto selfie

&#x20;   // 3. Generate watermark

&#x20;   // 4. Upload

&#x20;   // 5. Not

