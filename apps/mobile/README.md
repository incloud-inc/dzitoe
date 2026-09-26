# DZITOE Mobile (`apps/mobile`)

PWA **Next.js 14 (App Router)** untuk **Murid, Guru, Tendik, dan Orang Tua** SMAN 20 Kabupaten Tangerang.

> **Port wajib: 3001**
> Dilarang menggunakan port `8000` (ADZKIA) atau `5173` (PERSOALAN).

## Menjalankan

```bash
# dari root monorepo
pnpm dev:mobile
```

Buka <http://localhost:3001>.

## Skrip

| Skrip | Fungsi |
|---|---|
| `pnpm --filter @dzitoe/mobile run dev` | Dev server di port **3001** |
| `pnpm --filter @dzitoe/mobile run build` | Build produksi PWA |
| `pnpm --filter @dzitoe/mobile run start` | Jalankan hasil build di port **3001** |
| `pnpm --filter @dzitoe/mobile run typecheck` | Pemeriksaan tipe TypeScript |

## Fitur PWA

- Manifest: `src/app/manifest.ts` → `/manifest.webmanifest`
- Service Worker: `public/sw.js` (caching offline & background update)
- Theme Color: `#0a9066`
- Ikon PWA: `public/icons/icon.svg`, `public/icons/maskable.svg`

## Struktur Navigasi (5 Tab Bottom Bar)

| Tab | Rute | Keterangan |
|---|---|---|
| **Beranda** | `/` | Ringkasan kehadiran, absen cepat, jadwal, pengumuman |
| **Absensi** | `/absensi` | Verifikasi GPS + Swafoto, riwayat kehadiran |
| **Profil** | `/profil` | Profil 360° Murid, NISN, kelas, wali kelas |
| **Tagihan** | `/tagihan` | Administrasi keuangan & status pembayaran |
| **Lainnya** | `/lainnya` | Fasilitasi Belajar, Asesmen, Disiplin Positif |
