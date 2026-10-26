import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const monorepoRoot = path.resolve(process.cwd(), '..', '..');
    const settingsFile = path.join(monorepoRoot, 'packages', 'db', 'data', 'runtime-settings.json');

    let logoSubpath: string | null = null;
    if (fs.existsSync(settingsFile)) {
      try {
        const settings = JSON.parse(fs.readFileSync(settingsFile, 'utf-8'));
        if (settings.logoUrl) {
          logoSubpath = settings.logoUrl;
        }
      } catch {}
    }

    if (logoSubpath) {
      // Periksa file di admin public uploads atau mobile public uploads
      const adminLogoPath = path.join(monorepoRoot, 'apps', 'admin', 'public', logoSubpath);
      const mobileLogoPath = path.join(process.cwd(), 'public', logoSubpath);
      const targetPath = fs.existsSync(mobileLogoPath)
        ? mobileLogoPath
        : fs.existsSync(adminLogoPath)
        ? adminLogoPath
        : null;

      if (targetPath) {
        const buffer = fs.readFileSync(targetPath);
        const ext = path.extname(targetPath).toLowerCase();
        const contentType =
          ext === '.svg'
            ? 'image/svg+xml'
            : ext === '.webp'
            ? 'image/webp'
            : ext === '.jpg' || ext === '.jpeg'
            ? 'image/jpeg'
            : 'image/png';

        return new NextResponse(buffer, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400',
          },
        });
      }
    }

    // Cek favicon.png di public mobile
    const publicIcon = path.join(process.cwd(), 'public', 'favicon.png');
    if (fs.existsSync(publicIcon)) {
      const buffer = fs.readFileSync(publicIcon);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=60',
        },
      });
    }

    // Default icon svg mobile
    const defaultIcon = path.join(process.cwd(), 'public', 'icon.svg');
    if (fs.existsSync(defaultIcon)) {
      const buffer = fs.readFileSync(defaultIcon);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=60',
        },
      });
    }

    return new NextResponse(null, { status: 404 });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
