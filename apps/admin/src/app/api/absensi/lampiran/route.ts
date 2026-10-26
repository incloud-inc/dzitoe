import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada berkas lampiran yang dipilih.' },
        { status: 400 }
      );
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: 'Ukuran berkas melebihi batas 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || '.jpg';
    const filename = `lampiran-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

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
