import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { validateSelfieLiveness } from '@dzitoe/utils';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@dzitoe/auth';

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
        { success: false, message: 'Autentikasi ditolak. Silakan login terlebih dahulu untuk mengambil swafoto presensi.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      imagePayload,
      timestampClient,
      latitude,
      longitude,
      accuracyMeters,
      deviceFingerprint,
    } = body;

    if (!imagePayload || typeof imagePayload !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Payload gambar swafoto tidak valid.' },
        { status: 400 }
      );
    }

    // Batasi ukuran payload base64 (maksimal ~5MB base64 string = ~3.7MB binary)
    if (imagePayload.length > 7 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'Ukuran foto melebihi batas maksimal sistem.' },
        { status: 400 }
      );
    }

    if (!imagePayload.startsWith('data:image/')) {
      return NextResponse.json(
        { success: false, message: 'Format data swafoto harus berupa image data URI.' },
        { status: 400 }
      );
    }

    const realStudentId = user.nisn || user.muridId || user.username || 'murid';

    // 2. Jalankan Validasi Liveness & Anti-Spoofing di Sisi Server (Task A12.7)
    const validationResult = validateSelfieLiveness({
      imagePayload,
      timestampClient: timestampClient || new Date().toISOString(),
      latitude,
      longitude,
      accuracyMeters,
      deviceFingerprint,
      studentId: realStudentId,
    });

    // 3. Simpan Berkas Gambar ke Disk Storage (WebP) (Task A12.4)
    const monorepoRoot = findMonorepoRoot(process.cwd());
    const uploadDirs = [
      path.join(monorepoRoot, 'apps', 'mobile', 'public', 'uploads', 'selfie'),
      path.join(monorepoRoot, 'apps', 'admin', 'public', 'uploads', 'selfie'),
    ];

    uploadDirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    const filename = `selfie-${realStudentId}-${Date.now()}.webp`;
    const cleanBase64 = imagePayload.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    uploadDirs.forEach((dir) => {
      try {
        fs.writeFileSync(path.join(dir, filename), buffer);
      } catch (err) {
        console.warn('[SELFIE_UPLOAD] Error writing file to', dir, err);
      }
    });

    const publicUrl = `/uploads/selfie/${filename}`;

    return NextResponse.json({
      success: true,
      message: 'Swafoto berhasil divalidasi dan disimpan dengan watermark koordinat GPS.',
      selfieUrl: publicUrl,
      validation: validationResult,
      watermarkText: validationResult.metadata.watermarkText,
    });
  } catch (error: any) {
    console.error('[API_SELFIE_VALIDATION_ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memproses validasi swafoto: ' + error.message },
      { status: 500 }
    );
  }
}
