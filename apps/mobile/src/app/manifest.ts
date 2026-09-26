import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DZITOE — SMAN 20 Kabupaten Tangerang',
    short_name: 'DZITOE Mobile',
    description:
      'Aplikasi mobile DZITOE untuk Murid, Guru, Tendik, dan Orang Tua SMAN 20 Kabupaten Tangerang.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f1f5f9',
    theme_color: '#0a9066',
    lang: 'id-ID',
    dir: 'ltr',
    categories: ['education', 'productivity'],
    icons: [
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/maskable.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Absensi',
        short_name: 'Absensi',
        description: 'Ambil kehadiran hari ini',
        url: '/absensi',
      },
      {
        name: 'Profil',
        short_name: 'Profil',
        description: 'Lihat profil Murid',
        url: '/profil',
      },
      {
        name: 'Tagihan',
        short_name: 'Tagihan',
        description: 'Lihat daftar tagihan',
        url: '/tagihan',
      },
    ],
  };
}
