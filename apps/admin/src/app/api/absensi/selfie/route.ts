import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { validateSelfieLiveness } from '@dzitoe/utils';

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
    const body = await request.json();
    const {
      imagePayload,
      timestampClient,
      latitude,
      longitude,
      accuracyMeters,
      deviceFingerprint,
      studentId = 'demo-murid-1',
    } = body;

    if (!imagePayload) {
      return NextResponse.json(
        { success: false, message: 'Payload gambar swafoto tidak ditemukan.' },
        { status: 400 }
      );
    }

    const validationResult = validateSelfieLiveness({
      imagePayload,
      timestampClient: timestampClient || new Date().toISOString(),
      latitude,
      longitude,
      accuracyMeters,
      deviceFingerprint,
      studentId,
    });

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

    const filename = `selfie-${studentId}-${Date.now()}.webp`;
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
    console.error('[API_ADMIN_SELFIE_ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memproses validasi swafoto: ' + error.message },
      { status: 500 }
    );
  }
}
