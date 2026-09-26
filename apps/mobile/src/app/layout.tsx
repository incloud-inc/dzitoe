import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import BottomNav from '@/components/BottomNav';
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
  themeColor: '#0a9066',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="font-sans">
        <MobileShell>
          <main className="flex-1 pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))]">
            {children}
          </main>
          <BottomNav />
        </MobileShell>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
