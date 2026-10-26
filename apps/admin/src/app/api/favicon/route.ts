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
      const fullLogoPath = path.join(process.cwd(), 'public', logoSubpath);
      if (fs.existsSync(fullLogoPath)) {
        const buffer = fs.readFileSync(fullLogoPath);
        const ext = path.extname(fullLogoPath).toLowerCase();
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

    // Cek apakah ada file favicon.png atau icon.png di public
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

    // Default SVG emblem SMAN 20 Tangerang
    const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#087f5b" />
          <stop offset="100%" stop-color="#044b36" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="128" fill="url(#g)" />
      <circle cx="256" cy="256" r="160" fill="none" stroke="#96f2d7" stroke-width="20" stroke-dasharray="16 16"/>
      <text x="256" y="295" font-family="system-ui, sans-serif" font-size="160" font-weight="900" fill="#ffffff" text-anchor="middle">20</text>
    </svg>`;

    return new NextResponse(defaultSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (error) {
    return new NextResponse(null, { status: 404 });
  }
}
