import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DZITOE Admin — SMAN 20 Kabupaten Tangerang",
    template: "%s · DZITOE Admin",
  },
  description:
    "Dashboard admin DZITOE untuk tata kelola Murid (Siswa), Guru, Fasilitasi Belajar (Pembelajaran), Asesmen, Perkembangan Murid, dan Disiplin Positif.",
  applicationName: "DZITOE Admin",
  authors: [{ name: "DZITOE Dev Team" }],
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
