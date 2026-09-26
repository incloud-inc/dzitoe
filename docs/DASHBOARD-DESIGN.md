\# DASHBOARD-DESIGN.md — Design System \& Dashboard Admin

\## Sistem Tata Kelola Sekolah DZITOE

\### SMAN 20 Kabupaten Tangerang



> \*\*Versi:\*\* 1.0.0

> \*\*Status:\*\* Draft

> \*\*Tanggal:\*\* 2026

> \*\*Aplikasi:\*\* Dashboard Admin (Web Desktop)

> \*\*Stack UI:\*\* Radix UI (Themes, Primitives, Colors, Icons) + Tailwind CSS + shadcn/ui + Recharts

> \*\*Klasifikasi:\*\* Dokumen Internal (Non-Komersial)



\---



\## 1. Overview



\### 1.1. Deskripsi

`DASHBOARD-DESIGN.md` ini adalah panduan desain untuk \*\*Dashboard Admin DZITOE\*\* yang digunakan oleh:

\- \*\*Admin\*\* — Operator IT sekolah

\- \*\*Kepala Sekolah\*\* — Pimpinan sekolah

\- \*\*TU\*\* — Tata Usaha

\- \*\*Guru\*\* — Tenaga pendidik

\- \*\*Guru BK\*\* — Bimbingan konseling

\- \*\*Petugas PPID\*\* — Informasi publik



\### 1.2. Prinsip Desain

1\. \*\*Desktop-first\*\* — dioptimalkan untuk layar besar (1280px+)

2\. \*\*Informatif\*\* — data padat tapi mudah dibaca

3\. \*\*Cepat\*\* — load < 3 detik, navigasi instan

4\. \*\*Konsisten\*\* — design system built-in (Radix Themes)

5\. \*\*Accessible\*\* — WAI-ARIA compliant



\### 1.3. Target Perangkat

| Perangkat | Ukuran | Layout |

|---|---|---|

| \*\*Desktop Besar\*\* | 1920x1080+ | 3 kolom (sidebar + konten + panel kanan) |

| \*\*Desktop\*\* | 1440x900 | 3 kolom |

| \*\*Laptop\*\* | 1280x720 | 3 kolom |

| \*\*Tablet\*\* | 768x1024 | 2 kolom (sidebar + konten) |

| \*\*Mobile\*\* | 360x640 | 1 kolom (drawer sidebar) |



\---



\## 2. Design Tokens



\### 2.1. Warna (Radix Colors)



\#### 2.1.1. Semantic Colors

| Token | Radix Scale | Penggunaan |

|---|---|---|

| `--color-primary` | `blue-9` | Tombol aksi utama, link |

| `--color-primary-hover` | `blue-10` | Hover state |

| `--color-primary-active` | `blue-11` | Active state |

| `--color-success` | `green-9` | Status positif |

| `--color-warning` | `amber-9` | Status peringatan |

| `--color-danger` | `red-9` | Status negatif |

| `--color-info` | `cyan-9` | Informasi |

| `--color-neutral` | `slate-9` | Netral |



\#### 2.1.2. Background \& Surface

| Token | Radix Scale | Penggunaan |

|---|---|---|

| `--color-bg` | `slate-1` | Background halaman |

| `--color-card` | `white` | Background kartu |

| `--color-sidebar` | `white` | Background sidebar |

| `--color-topbar` | `white` | Background top bar |

| `--color-panel` | `white` | Background panel kanan |

| `--color-hover` | `slate-2` | Hover state |

| `--color-active` | `slate-3` | Active state |



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



\#### 2.1.5. Stat Card Colors

| Kartu | Background | Text | Radix Scale |

|---|---|---|---|

| \*\*Murid\*\* | `blue-3` | `blue-11` | Blue |

| \*\*Guru \& Tendik\*\* | `green-3` | `green-11` | Green |

| \*\*Kehadiran\*\* | `amber-3` | `amber-11` | Amber |

| \*\*Pembayaran\*\* | `purple-3` | `purple-11` | Purple |



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

| \*\*Logo/Brand\*\* | Inter | 16px | Bold (700) | 1.3 |

| \*\*Sub Brand\*\* | Inter | 11px | Regular (400) | 1.4 |

| \*\*Menu Sidebar\*\* | Inter | 13px | Medium (500) | 1.5 |

| \*\*Sub Menu\*\* | Inter | 12px | Regular (400) | 1.5 |

| \*\*Breadcrumb\*\* | Inter | 13px | Regular (400) | 1.5 |

| \*\*Judul Halaman\*\* | Inter | 18px | Bold (700) | 1.3 |

| \*\*Judul Kartu\*\* | Inter | 14px | SemiBold (600) | 1.4 |

| \*\*Angka Statistik\*\* | Inter | 28px | Bold (700) | 1.2 |

| \*\*Label Statistik\*\* | Inter | 12px | Regular (400) | 1.4 |

| \*\*Teks Notifikasi\*\* | Inter | 13px | Regular (400) | 1.5 |

| \*\*Waktu Notifikasi\*\* | Inter | 11px | Regular (400) | 1.4 |

| \*\*Body Text\*\* | Inter | 14px | Regular (400) | 1.6 |

| \*\*Caption\*\* | Inter | 11px | Regular (400) | 1.4 |

| \*\*Button\*\* | Inter | 13px | SemiBold (600) | 1.2 |



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

| `--radius-search` | 20px | Search bar |

| `--radius-full` | 9999px | Avatar, pill |



\### 2.5. Shadow



| Token | Nilai | Penggunaan |

|---|---|---|

| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Card halus |

| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` | Card |

| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modal, dropdown |

| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Dialog |



\### 2.6. Layout Dimensions



| Elemen | Lebar | Tinggi |

|---|---|---|

| \*\*Sidebar\*\* | 240px | 100vh |

| \*\*Sidebar Collapsed\*\* | 64px | 100vh |

| \*\*Top Bar\*\* | 100% | 64px |

| \*\*Panel Kanan\*\* | 320px | 100vh |

| \*\*Konten Utama\*\* | `calc(100% - 240px - 320px)` | `calc(100vh - 64px)` |



\### 2.7. Animation



| Token | Nilai | Penggunaan |

|---|---|---|

| `--duration-fast` | 150ms | Hover, tap |

| `--duration-normal` | 250ms | Transisi |

| `--duration-slow` | 400ms | Modal, page transition |

| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Masuk |

| `--ease-in` | `cubic-bezier(0.7, 0, 0.84, 0)` | Keluar |



\---



\## 3. Struktur Layout (Desktop)



\### 3.1. Layout Utama



```

┌──────────────┬──────────────────────────────────────────────┬─────────────────┐

│              │  Top Bar (Breadcrumb, Search, Notif, Profil) │                 │

│              ├──────────────────────────────────────────────┤                 │

│   SIDEBAR    │                                              │   PANEL KANAN   │

│   (240px)    │           KONTEN UTAMA                       │   (320px)       │

│              │           (Statistik, Grafik, Tabel)         │   (Notifikasi,  │

│              │                                              │    Aktivitas)   │

│              │                                              │                 │

└──────────────┴──────────────────────────────────────────────┴─────────────────┘

```



\### 3.2. Responsive Breakpoints



| Breakpoint | Layout |

|---|---|

| \*\*≥ 1440px\*\* | 3 kolom (sidebar + konten + panel kanan) |

| \*\*1280-1439px\*\* | 3 kolom (sidebar + konten + panel kanan) |

| \*\*1024-1279px\*\* | 2 kolom (sidebar + konten) — panel kanan jadi drawer |

| \*\*768-1023px\*\* | 2 kolom (sidebar collapsed + konten) |

| \*\*< 768px\*\* | 1 kolom — sidebar jadi hamburger menu |



\---



\## 4. Komponen Detail



\### 4.1. Sidebar Kiri (240px)



\*\*Background:\*\* `--color-sidebar` (putih)

\*\*Border kanan:\*\* 1px solid `--color-border`

\*\*Posisi:\*\* Fixed, full height



\#### 4.1.1. Struktur



```

┌─────────────────────────────┐

│  \[AVATAR] DZITOE            │  ← Logo/Brand

│  SMAN 20 Kab. Tangerang     │

├─────────────────────────────┤

│  Favorites                  │  ← Section

│  • Dashboard                │

│  • Manajemen Murid          │

├─────────────────────────────┤

│  Dashboards                 │  ← Section

│  • Dashboard                │

│  • Keuangan                 │

│  • Absensi                  │

│  • Fasilitasi Belajar       │

├─────────────────────────────┤

│  Pages                      │  ← Section

│  • Profil Murid 360°        │

│  • Asesmen                  │

│  • PPID                     │

│  • Database Alumni          │

├─────────────────────────────┤

│  Account                    │  ← Section

│  • Pengaturan               │

│  • Manajemen Murid          │

│  • Pelayanan BK             │

│  • Data Kesehatan           │

└─────────────────────────────┘

```



\#### 4.1.2. Menu Items



| Menu | Ikon (Radix) | Path | Role |

|---|---|---|---|

| \*\*Dashboard\*\* | `HomeIcon` | `/dashboard` | Semua |

| \*\*Manajemen Murid\*\* | `PersonIcon` | `/murid` | Admin, TU |

| \*\*Fasilitasi Belajar\*\* | `BookmarkIcon` | `/belajar` | Admin, Guru |

| **Bank Soal** | `FileTextIcon` | `/bank-soal` | Admin, Guru |
| **AI Generator** | `MagicWandIcon` | `/ai-generator` | Guru |
| **Kurikulum** | `BookmarkIcon` | `/kurikulum` | Admin, Guru |

| \*\*Absensi\*\* | `MapPinIcon` | `/absensi` | Admin, TU, Guru |

| \*\*Keuangan\*\* | `WalletIcon` | `/keuangan` | Admin, TU |

| \*\*Asesmen\*\* | `ClipboardIcon` | `/asesmen` | Admin, Guru |

| \*\*Pelayanan BK\*\* | `HeartIcon` | `/bk` | Admin, Guru BK |

| \*\*PPID\*\* | `FileTextIcon` | `/ppid` | Admin, Petugas PPID |

| \*\*Database Alumni\*\* | `PersonIcon` | `/alumni` | Admin, TU |

| \*\*Data Kesehatan\*\* | `ActivityLogIcon` | `/kesehatan` | Admin, Guru BK |

| \*\*Pengaturan\*\* | `GearIcon` | `/pengaturan` | Admin |



\#### 4.1.3. Style Menu



\*\*Item aktif:\*\*

\- Background: `slate-3`

\- Teks: `slate-12`, bold

\- Ikon: `blue-9`



\*\*Item tidak aktif:\*\*

\- Teks: `slate-11`

\- Hover: background `slate-2`



\*\*Sub-menu:\*\*

\- Indent: 24px

\- Teks: 12px

\- Warna: `slate-11`



\---



\### 4.2. Top Bar (64px)



\*\*Background:\*\* `--color-card` (putih)

\*\*Border bawah:\*\* 1px solid `--color-border`

\*\*Posisi:\*\* Sticky top



\#### 4.2.1. Struktur



```

┌──────────────────────────────────────────────────────────────────┐

│  \[☰] \[⭐] Dashboard / Ringkasan    \[🔍 Cari...]  \[☀️] \[🔔] \[👤]  │

└──────────────────────────────────────────────────────────────────┘

```



\#### 4.2.2. Komponen



| Komponen | Detail | Radix Component |

|---|---|---|

| \*\*Sidebar Toggle\*\* | Kiri, collapse sidebar | `Button` (icon) |

| \*\*Favorit\*\* | Bintang, tandai halaman | `Button` (icon) |

| \*\*Breadcrumb\*\* | `Dashboard / Ringkasan` | `Text` |

| \*\*Search Bar\*\* | Input rounded, placeholder "Cari murid, guru, tagihan..." | `TextField` |

| \*\*Tema Toggle\*\* | Matahari/bulan | `Button` (icon) |

| \*\*Notifikasi\*\* | Bell + badge | `DropdownMenu` |

| \*\*Profil\*\* | Avatar + nama + dropdown | `DropdownMenu` |



\---



\### 4.3. Konten Utama



\#### 4.3.1. Judul Halaman



```

┌──────────────────────────────────────────────────────┐

│  Ringkasan Kondisi Sekolah          \[Hari Ini ▼]    │

└──────────────────────────────────────────────────────┘

```



\*\*Komponen:\*\*

\- `Heading` — Judul halaman

\- `Select` — Filter waktu (Hari Ini, Minggu Ini, Bulan Ini, Tahun Ini)



\#### 4.3.2. Kartu Statistik (4 Kartu)



```

┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐

│ 👤 1.250   │ │ 👤 85      │ │ 📅 98%     │ │ 💰 Rp45jt  │

│ Murid      │ │ Guru\&Tendik│ │ Kehadiran  │ │ Pembayaran │

│ +2.5% ↑    │ │ +1.2% ↑    │ │ +0.5% ↑    │ │ -3.1% ↓    │

└────────────┘ └────────────┘ └────────────┘ └────────────┘

```



\*\*Detail:\*\*



| Kartu | Value | Label | Change | Background | Icon |

|---|---|---|---|---|---|

| 1 | `1.250` | \*\*Murid\*\* | +2.5% | `blue-3` | `PersonIcon` |

| 2 | `85` | \*\*Guru \& Tendik\*\* | +1.2% | `green-3` | `PersonIcon` |

| 3 | `98%` | \*\*Kehadiran Hari Ini\*\* | +0.5% | `amber-3` | `CalendarIcon` |

| 4 | `Rp 45jt` | \*\*Pembayaran Hari Ini\*\* | -3.1% | `purple-3` | `WalletIcon` |



\*\*Style:\*\*

\- Background pastel, border radius 12px, padding 16px

\- Angka besar (28px, bold)

\- Label kecil (12px, abu-abu)

\- Indikator perubahan: panah naik/turun + persentase



\#### 4.3.3. Grafik Besar (Line Chart)



```

┌────────────────────────────────────────────────────────┐

│  Tren Kehadiran Murid                                  │

│  \[Kehadiran] Terlambat  Izin  Sakit    ● Tahun Ini    │

│                                        ○ Tahun Lalu    │

│                                                        │

│  \[GRAFIK GARIS]                                        │

│                                                        │

│  Jan  Feb  Mar  Apr  May  Jun  Jul  Agu  Sep  Okt...  │

└────────────────────────────────────────────────────────┘

```



\*\*Komponen:\*\*

\- `Heading` — Judul

\- `Tabs` — Kehadiran, Terlambat, Izin, Sakit

\- `LineChart` (Recharts) — garis solid (tahun ini), dashed (tahun lalu)



\#### 4.3.4. Grafik Samping (Horizontal Bar)



```

┌────────────────────────────────────────┐

│  Kehadiran per Kelas                   │

│                                        │

│  Kelas X    ████████████ 95%          │

│  Kelas XI   ██████████ 92%            │

│  Kelas XII  █████████████ 98%         │

│  Guru       ██████████████ 99%        │

│  Tendik     ████████████ 96%          │

└────────────────────────────────────────┘

```



\*\*Komponen:\*\*

\- `Heading` — Judul

\- Custom bar (Tailwind + div)



\#### 4.3.5. Grafik Bawah (2 Kartu)



```

┌─────────────────────────┐ ┌─────────────────────────┐

│  Kehadiran per Metode   │ │  Komposisi Status       │

│                         │ │  Absensi                │

│  \[BAR CHART]            │ │  \[DONUT CHART]          │

│                         │ │  ● Hadir: 85%           │

│                         │ │  ● Terlambat: 8%        │

│                         │ │  ● Izin: 4%             │

│                         │ │  ● Sakit: 2%            │

│                         │ │  ● Alpa: 1%             │

└─────────────────────────┘ └─────────────────────────┘

```



\*\*Komponen:\*\*

\- `BarChart` (Recharts) — Kehadiran per Metode

\- `PieChart` / `DonutChart` (Recharts) — Komposisi Status



\---



\### 4.4. Panel Kanan (320px)



\*\*Background:\*\* `--color-card` (putih)

\*\*Border kiri:\*\* 1px solid `--color-border`

\*\*Posisi:\*\* Fixed, full height



\#### 4.4.1. Notifikasi



```

┌─────────────────────────────────────┐

│  Notifikasi                         │

├─────────────────────────────────────┤

│  🔔 Tagihan jatuh tempo: 25 murid   │

│      Baru saja                      │

├─────────────────────────────────────┤

│  📝 Pengajuan izin: 3 murid         │

│      5 menit lalu                   │

├─────────────────────────────────────┤

│  ⚠️  Absensi terlambat: 12 murid     │

│      1 jam lalu                     │

├─────────────────────────────────────┤

│  💰 Pembayaran diterima: Rp 2.500.000│

│      2 jam lalu                     │

└─────────────────────────────────────┘

```



\*\*Komponen:\*\*

\- `Heading` — Judul

\- List item dengan ikon, teks, waktu



\#### 4.4.2. Aktivitas Terbaru



```

┌─────────────────────────────────────┐

│  Aktivitas Terbaru                  │

├─────────────────────────────────────┤

│  \[👤] Ahmad Fauzi absen masuk       │

│       Baru saja                     │

├─────────────────────────────────────┤

│  \[👤] Siti Nurhaliza mengajukan izin│

│       5 menit lalu                  │

├─────────────────────────────────────┤

│  \[👤] Budi Santoso membayar tagihan │

│       1 jam lalu                    │

├─────────────────────────────────────┤

│  \[👤] Guru Matematika absen KBM     │

│       2 jam lalu                    │

└─────────────────────────────────────┘

```



\*\*Komponen:\*\*

\- `Heading` — Judul

\- `Avatar` + teks + waktu



\#### 4.4.3. Kontak (Guru/Staf)



```

┌─────────────────────────────────────┐

│  Kontak                             │

├─────────────────────────────────────┤

│  \[👤] Drs. H. Ahmad, M.Pd           │

│       Kepala Sekolah                │

├─────────────────────────────────────┤

│  \[👤] Siti Aminah, S.Pd             │

│       Wali Kelas XII                │

├─────────────────────────────────────┤

│  \[👤] Budi Santoso, S.Kom           │

│       Operator                      │

├─────────────────────────────────────┤

│  \[👤] Dewi Lestari, S.Psi           │

│       Guru BK                       │

└─────────────────────────────────────┘

```



\*\*Komponen:\*\*

\- `Heading` — Judul

\- `Avatar` + nama + role (`Badge`)



\---



\## 5. Halaman Detail



\### 5.1. Halaman Dashboard



\*\*Path:\*\* `/dashboard`

\*\*Role:\*\* Semua



\*\*Layout:\*\*

```

┌──────────────────────────────────────────────────────┐

│  Ringkasan Kondisi Sekolah          \[Hari Ini ▼]    │

├──────────────────────────────────────────────────────┤

│  \[Statistik Cards — 4 kartu]                        │

├──────────────────────────────────────────────────────┤

│  \[Line Chart — Tren Kehadiran]  \[Bar — per Kelas]   │

├──────────────────────────────────────────────────────┤

│  \[Bar Chart]                    \[Donut Chart]       │

└──────────────────────────────────────────────────────┘

```



\---



\### 5.2. Halaman Manajemen Murid



\*\*Path:\*\* `/murid`

\*\*Role:\*\* Admin, TU



\*\*Layout:\*\*

```

┌──────────────────────────────────────────────────────┐

│  Manajemen Murid                    \[+ Tambah Murid]│

├──────────────────────────────────────────────────────┤

│  \[🔍 Cari...]  \[Kelas ▼] \[Status ▼] \[Tahun Ajaran ▼]│

├──────────────────────────────────────────────────────┤

│  Tabel Murid                                         │

│  ┌────┬────────┬──────┬──────┬────────┬────────┐   │

│  │ NIS│ Nama   │Kelas │ JK   │ Status │ Aksi   │   │

│  ├────┼────────┼──────┼──────┼────────┼────────┤   │

│  │123 │Ahmad   │XII-1 │ L    │ Aktif  │ \[👁️]   │   │

│  │124 │Siti    │XII-1 │ P    │ Aktif  │ \[👁️]   │   │

│  └────┴────────┴──────┴──────┴────────┴────────┘   │

├──────────────────────────────────────────────────────┤

│  \[< 1 2 3 ... 10 >]                                 │

└──────────────────────────────────────────────────────┘

```



\*\*Komponen:\*\*

\- `Heading` + `Button` (Tambah)

\- `TextField` (search) + `Select` (filter)

\- `Table` — data murid

\- `Pagination`



\---



\### 5.3. Halaman Absensi



\*\*Path:\*\* `/absensi`

\*\*Role:\*\* Admin, TU, Guru



\*\*Layout:\*\*

```

┌──────────────────────────────────────────────────────┐

│  Absensi                            \[Export ▼]      │

├──────────────────────────────────────────────────────┤

│  \[Tabs: Murid | Guru | Tendik]                       │

├──────────────────────────────────────────────────────┤

│  \[📅 Tanggal ▼] \[Kelas ▼] \[Status ▼]                │

├──────────────────────────────────────────────────────┤

│  Rekap Absensi                                       │

│  ┌────────┬────────┬────────┬────────┬────────┐    │

│  │ Hadir  │ Telat  │ Izin   │ Sakit  │ Alpa   │    │

│  │ 1.150  │ 45     │ 30     │ 20     │ 5      │    │

│  └────────┴────────┴────────┴────────┴────────┘    │

├──────────────────────────────────────────────────────┤

│  Tabel Absensi                                       │

│  ┌────┬────────┬──────┬──────┬────────┬────────┐   │

│  │ NIS│ Nama   │Kelas │ Jam  │ Status │ Foto   │   │

│  ├────┼────────┼──────┼──────┼────────┼────────┤   │

│  │123 │Ahmad   │XII-1 │07:15 │ Hadir  │ \[📷]   │   │

│  └────┴────────┴──────┴──────┴────────┴────────┘   │

└──────────────────────────────────────────────────────┘

```



\*\*Komponen:\*\*

\- `Tabs` — Murid, Guru, Tendik

\- `Select` — filter

\- Statistik cards

\- `Table` — data absensi + foto selfie thumbnail

\- `Dialog` — preview foto selfie



\---



\### 5.4. Halaman Keuangan



\*\*Path:\*\* `/keuangan`

\*\*Role:\*\* Admin, TU



\*\*Layout:\*\*

```

┌──────────────────────────────────────────────────────┐

│  Keuangan                           \[+ Buat Tagihan]│

├──────────────────────────────────────────────────────┤

│  \[Tabs: Tagihan | Cicilan | Pembayaran | Tunggakan] │

├──────────────────────────────────────────────────────┤

│  Ringkasan Keuangan                                  │

│  ┌────────────┬────────────┬────────────┐           │

│  │ Total      │ Sudah      │ Tunggakan  │           │

│  │ Tagihan    │ Bayar      │            │           │

│  │ Rp 500jt   │ Rp 450jt   │ Rp 50jt    │           │

│  └────────────┴────────────┴────────────┘           │

├──────────────────────────────────────────────────────┤

│  Tabel Tagihan                                       │

│  ┌────┬────────┬────────┬────────┬────────┬──────┐  │

│  │NIS │ Nama   │Tagihan │Nominal │ Jatuh  │Status│  │

│  ├────┼────────┼────────┼────────┼────────┼──────┤  │

│  │123 │Ahmad   │SPP Jan │Rp500rb │31 Jan  │Lunas │  │

│  │124 │Siti    │Uang Ged│Rp2jt   │30 Jun  │Cicil │  │

│  └────┴────────┴────────┴────────┴────────┴──────┘  │

└──────────────────────────────────────────────────────┘

```



\*\*Komponen:\*\*

\- `Tabs` — Tagihan, Cicilan, Pembayaran, Tunggakan

\- Statistik cards

\- `Table` — data tagihan

\- `Badge` — status (Lunas, Cicilan, Tunggakan)

\- `Progress` — progress cicilan



\---



\### 5.5. Halaman Asesmen



\*\*Path:\*\* `/asesmen`

\*\*Role:\*\* Admin, Guru



\*\*Layout:\*\*

```

┌──────────────────────────────────────────────────────┐

│  Asesmen                            \[+ Input Asesmen]│

├──────────────────────────────────────────────────────┤

│  \[Tabs: Asesmen | Bank Soal | Ujian | Hasil]         │

├──────────────────────────────────────────────────────┤

│  \[Semester ▼] \[Mapel ▼] \[Kelas ▼]                   │

├──────────────────────────────────────────────────────┤

│  Tabel Asesmen                                       │

│  ┌────┬────────┬────────┬────────┬────────┐         │

│  │NIS │ Nama   │Mapel   │Nilai   │Peringkat│         │

│  ├────┼────────┼────────┼────────┼────────┤         │

│  │123 │Ahmad   │Matematik│95     │3       │         │

│  └────┴────────┴────────┴────────┴────────┘         │

└──────────────────────────────────────────────────────┘

```



\---



\### 5.6. Halaman Laporan



\*\*Path:\*\* `/laporan`

\*\*Role:\*\* Admin, Kepala Sekolah, TU



\*\*Layout:\*\*

```

┌──────────────────────────────────────────────────────┐

│  Laporan                                             │

├──────────────────────────────────────────────────────┤

│  \[Tabs: Murid | Absensi | Guru | Pembayaran | ...]  │

├──────────────────────────────────────────────────────┤

│  \[Periode ▼] \[Kelas ▼] \[Format ▼]   \[Export PDF]   │

├──────────────────────────────────────────────────────┤

│  \[PREVIEW LAPORAN]                                   │

│                                                      │

│  ┌────────────────────────────────────────────┐     │

│  │  LAPORAN KEHADIRAN MURID                   │     │

│  │  SMAN 20 Kab. Tangerang                    │     │

│  │  Periode: Januari 2026                     │     │

│  │                                            │     │

│  │  \[TABEL DATA]                              │     │

│  │                                            │     │

│  │  \[GRAFIK]                                  │     │

│  └────────────────────────────────────────────┘     │

└──────────────────────────────────────────────────────┘

```



\*\*Komponen:\*\*

\- `Tabs` — jenis laporan

\- `Select` — filter

\- `Button` — export PDF/Excel

\- Preview laporan



\---



\## 6. Komponen UI (Reusable)



\### 6.1. Sidebar



```tsx

// components/layout/Sidebar.tsx

'use client';



import \* as NavigationMenu from '@radix-ui/react-navigation-menu';

import {

&#x20; HomeIcon,

&#x20; PersonIcon,

&#x20; BookmarkIcon,

&#x20; MapPinIcon,

&#x20; WalletIcon,

&#x20; ClipboardIcon,

&#x20; HeartIcon,

&#x20; FileTextIcon,

&#x20; GearIcon,

&#x20; ActivityLogIcon,

} from '@radix-ui/react-icons';

import { usePathname } from 'next/navigation';

import Link from 'next/link';



const menus = \[

&#x20; { label: 'Dashboard', icon: HomeIcon, path: '/dashboard' },

&#x20; { label: 'Manajemen Murid', icon: PersonIcon, path: '/murid' },

&#x20; { label: 'Fasilitasi Belajar', icon: BookmarkIcon, path: '/belajar' },

&#x20; { label: 'Absensi', icon: MapPinIcon, path: '/absensi' },

&#x20; { label: 'Keuangan', icon: WalletIcon, path: '/keuangan' },

&#x20; { label: 'Asesmen', icon: ClipboardIcon, path: '/asesmen' },

&#x20; { label: 'Pelayanan BK', icon: HeartIcon, path: '/bk' },

&#x20; { label: 'PPID', icon: FileTextIcon, path: '/ppid' },

&#x20; { label: 'Database Alumni', icon: PersonIcon, path: '/alumni' },

&#x20; { label: 'Data Kesehatan', icon: ActivityLogIcon, path: '/kesehatan' },

&#x20; { label: 'Pengaturan', icon: GearIcon, path: '/pengaturan' },

];



export function Sidebar() {

&#x20; const pathname = usePathname();



&#x20; return (

&#x20;   <aside className="w-60 bg-white border-r border-slate-6 h-screen flex flex-col">

&#x20;     {/\* Brand \*/}

&#x20;     <div className="p-4 border-b border-slate-6">

&#x20;       <div className="flex items-center gap-3">

&#x20;         <div className="w-10 h-10 rounded-full bg-blue-9 flex items-center justify-center text-white font-bold">

&#x20;           D

&#x20;         </div>

&#x20;         <div>

&#x20;           <h1 className="font-bold text-sm">DZITOE</h1>

&#x20;           <p className="text-xs text-slate-11">SMAN 20 Kab. Tangerang</p>

&#x20;         </div>

&#x20;       </div>

&#x20;     </div>



&#x20;     {/\* Menu \*/}

&#x20;     <nav className="flex-1 overflow-y-auto p-2">

&#x20;       <NavigationMenu.Root orientation="vertical">

&#x20;         <NavigationMenu.List className="space-y-1">

&#x20;           {menus.map((menu) => {

&#x20;             const Icon = menu.icon;

&#x20;             const isActive = pathname === menu.path;



&#x20;             return (

&#x20;               <NavigationMenu.Item key={menu.path}>

&#x20;                 <Link

&#x20;                   href={menu.path}

&#x20;                   className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${

&#x20;                     isActive

&#x20;                       ? 'bg-slate-3 text-slate-12 font-semibold'

&#x20;                       : 'text-slate-11 hover:bg-slate-2'

&#x20;                   }`}

&#x20;                 >

&#x20;                   <Icon

&#x20;                     className={`w-4 h-4 ${isActive ? 'text-blue-9' : ''}`}

&#x20;                   />

&#x20;                   <span>{menu.label}</span>

&#x20;                 </Link>

&#x20;               </NavigationMenu.Item>

&#x20;             );

&#x20;           })}

&#x20;         </NavigationMenu.List>

&#x20;       </NavigationMenu.Root>

&#x20;     </nav>

&#x20;   </aside>

&#x20; );

}

```



\### 6.2. TopBar



```tsx

// components/layout/TopBar.tsx

'use client';



import \* as DropdownMenu from '@radix-ui/react-dropdown-menu';

import \* as Avatar from '@radix-ui/react-avatar';

import {

&#x20; HamburgerMenuIcon,

&#x20; StarIcon,

&#x20; MagnifyingGlassIcon,

&#x20; SunIcon,

&#x20; BellIcon,

} from '@radix-ui/react-icons';



interface TopBarProps {

&#x20; breadcrumb: string\[];

&#x20; user: { name: string; avatar?: string };

}



export function TopBar({ breadcrumb, user }: TopBarProps) {

&#x20; return (

&#x20;   <header className="h-16 bg-white border-b border-slate-6 flex items-center px-6 gap-4 sticky top-0 z-40">

&#x20;     {/\* Sidebar toggle \*/}

&#x20;     <button className="p-2 hover:bg-slate-2 rounded-md">

&#x20;       <HamburgerMenuIcon className="w-5 h-5 text-slate-11" />

&#x20;     </button>



&#x20;     {/\* Favorit \*/}

&#x20;     <button className="p-2 hover:bg-slate-2 rounded-md">

&#x20;       <StarIcon className="w-5 h-5 text-slate-11" />

&#x20;     </button>



&#x20;     {/\* Breadcrumb \*/}

&#x20;     <div className="flex items-center gap-2 text-sm">


B. Halaman Baru: Bank Soal
┌──────────────────────────────────────────────────────┐
│  Bank Soal                        [+ Tambah] [🤖 AI] │
├──────────────────────────────────────────────────────┤
│  [🔍 Cari...] [Kelas ▼] [Mapel ▼] [Bab ▼] [Jenis ▼] │
├──────────────────────────────────────────────────────┤
│  Tabel Bank Soal                                     │
│  ┌────┬──────────────┬────────┬────────┬────────┐   │
│  │ No │ Pertanyaan   │ Jenis  │ Bab    │ Sumber │   │
│  ├────┼──────────────┼────────┼────────┼────────┤   │
│  │ 1  │ Hasil dari.. │ PG     │ Bab 1  │ Manual │   │
│  │ 2  │ Jelaskan...  │ Uraian │ Bab 2  │ AI     │   │
│  └────┴──────────────┴────────┴────────┴────────┘   │
├──────────────────────────────────────────────────────┤
│  [< 1 2 3 ... 10 >]                                 │
└──────────────────────────────────────────────────────┘


C. Halaman Baru: AI Generator
┌──────────────────────────────────────────────────────┐
│  🤖 AI Generator Soal                                │
├──────────────────────────────────────────────────────┤
│  Parameter:                                          │
│  ┌────────────────────────────────────────────┐     │
│  │ Kelas:        [XII ▼]                      │     │
│  │ Semester:     [Ganjil ▼]                   │     │
│  │ Mata Pelajaran: [Matematika ▼]             │     │
│  │ Bab:          [Bilangan Berpangkat ▼]      │     │
│  │ Materi:       [Sifat-sifat ▼]              │     │
│  │ Jenis Soal:   [Pilihan Ganda ▼]            │     │
│  │ Jumlah:       [10]                         │     │
│  │ Kesulitan:    [Sedang ▼]                   │     │
│  │ Dengan Paragraf: [ ] Ya  [x] Tidak         │     │
│  └────────────────────────────────────────────┘     │
│                                                      │
│  [🤖 Generate Soal]                                 │
├──────────────────────────────────────────────────────┤
│  Preview Hasil:                                      │
│  ┌────────────────────────────────────────────┐     │
│  │ 1. Hasil dari 2³ × 2⁴ adalah...            │     │
│  │    A. 2⁶  B. 2⁷  C. 2¹²  D. 2¹⁴            │     │
│  │    Jawaban: B                               │     │
│  │    Pembahasan: 2³ × 2⁴ = 2^(3+4) = 2⁷      │     │
│  │    [Edit] [Hapus] [Regenerate]              │     │
│  └────────────────────────────────────────────┘     │
│                                                      │
│  [💾 Simpan Semua] [💾 Simpan Terpilih]             │
└──────────────────────────────────────────────────────┘


D. Halaman Baru: Kurikulum Merdeka
┌──────────────────────────────────────────────────────┐
│  Kurikulum Merdeka                                   │
├──────────────────────────────────────────────────────┤
│  [Kelas ▼] [Mapel ▼] [Semester ▼]                   │
├──────────────────────────────────────────────────────┤
│  Struktur Kurikulum:                                 │
│  ┌────────────────────────────────────────────┐     │
│  │ 📚 Matematika Kelas XII - Semester Ganjil  │     │
│  │ ├── Bab 1: Bilangan Berpangkat             │     │
│  │ │   ├── Materi 1: Sifat-sifat             │     │
│  │ │   ├── Materi 2: Operasi                 │     │
│  │ │   └── Materi 3: Aplikasi                │     │
│  │ ├── Bab 2: Logaritma                       │     │
│  │ └── Bab 3: Barisan & Deret                 │     │
│  └────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────┘



