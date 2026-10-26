import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@dzitoe/auth';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]);

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
};

function findMonorepoRoot(startDir: string): string {
  let curr = path.resolve(startDir);
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(curr, 'pnpm-workspace.yaml'))) {
      return curr;
    }
    const parent = path.dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }
  return startDir;
}

export async function POST(request: Request) {
  try {
    // 1. Verifikasi Autentikasi Pengguna
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const user = token ? await verifySessionToken(token) : null;

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Autentikasi ditolak. Silakan login terlebih dahulu untuk mengunggah dokumen.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada berkas lampiran yang dipilih.' },
        { status: 400 }
      );
    }

    // 2. Validasi Ukuran (Max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: 'Ukuran berkas melebihi batas maksimal 5MB.' },
        { status: 400 }
      );
    }

    // 3. Validasi Tipe MIME (Whitelist Aman: Gambar & PDF)
    const mimeType = file.type?.toLowerCase();
    if (!mimeType || !ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        { success: false, message: 'Format berkas tidak diizinkan. Hanya menerima berkas JPG, PNG, WebP, atau PDF.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Verifikasi Magic Bytes Sederhana
    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
    const isPdf = buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46; // %PDF
    const isRiffWebp = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46; // RIFF

    if (!isJpeg && !isPng && !isPdf && !isRiffWebp) {
      return NextResponse.json(
        { success: false, message: 'Integritas berkas tidak valid atau rusak.' },
        { status: 400 }
      );
    }

    // 5. Nama Berkas Aman (UUID Acak, tidak bergantung nama dari client)
    const safeExt = MIME_TO_EXT[mimeType] || '.jpg';
    const randomUuid = crypto.randomUUID();
    const filename = `lampiran-${user.nisn || user.username || 'user'}-${Date.now()}-${randomUuid.substring(0, 8)}${safeExt}`;

    const monorepoRoot = findMonorepoRoot(process.cwd());
    const uploadDirs = [
      path.join(monorepoRoot, 'apps', 'mobile', 'public', 'uploads', 'lampiran'),
      path.join(monorepoRoot, 'apps', 'admin', 'public', 'uploads', 'lampiran'),
    ];

    uploadDirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(path.join(dir, filename), buffer);
    });

    const fileUrl = `/uploads/lampiran/${filename}`;

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
      message: 'Berkas surat izin/surat dokter berhasil diunggah.',
    });
  } catch (error) {
    console.error('Error uploading leave attachment:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengunggah lampiran dokumen.' },
      { status: 500 }
    );
  }
}
