import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import MobileShell from '@/components/MobileShell';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

import './globals.css';

const APP_NAME = 'DZITOE';
const APP_DESCRIPTION =
  'Aplikasi mobile DZITOE SMAN 20 Kabupaten Tangerang untuk Murid, Guru, Tendik, dan Orang Tua.';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001',
  ),
  title: {
    default: `${APP_NAME} Mobile — SMAN 20 Kabupaten Tangerang`,
    template: `%s · ${APP_NAME} Mobile`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  generator: 'Next.js',
  keywords: [
    'DZITOE',
    'SMAN 20 Kabupaten Tangerang',
    'Murid',
    'Asesmen',
    'Disiplin Positif',
    'Fasilitasi Belajar',
  ],
  authors: [{ name: 'DZITOE Dev Team' }],
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/api/favicon', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/api/favicon',
    apple: '/api/favicon',
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#087f5b',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="font-sans">
        <MobileShell>{children}</MobileShell>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
