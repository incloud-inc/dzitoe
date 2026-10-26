import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { recordAuditLog } from '@dzitoe/auth';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let buffer: Buffer;
    let fileName: string;
    let mimeType: string;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('logo') as File | null;
      if (!file) {
        return NextResponse.json({ success: false, message: 'File logo tidak ditemukan dalam request.' }, { status: 400 });
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ success: false, message: 'Ukuran file logo melebihi batas maksimal 2 MB.' }, { status: 400 });
      }

      mimeType = file.type || 'image/png';
      if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        return NextResponse.json(
          { success: false, message: 'Format file tidak didukung. Harap gunakan format PNG, JPG, WebP, atau SVG.' },
          { status: 400 }
        );
      }

      const ext = mimeType === 'image/svg+xml' ? 'svg' : mimeType.split('/')[1] || 'png';
      fileName = `logo-sekolah-${Date.now()}.${ext}`;
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      // JSON with base64
      const body = await request.json();
      const { dataUri } = body;
      if (!dataUri || !dataUri.startsWith('data:image/')) {
        return NextResponse.json({ success: false, message: 'Data logo (dataUri) tidak valid.' }, { status: 400 });
      }

      const match = dataUri.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (!match) {
        return NextResponse.json({ success: false, message: 'Format base64 tidak valid.' }, { status: 400 });
      }

      mimeType = match[1];
      const base64Data = match[2];
      buffer = Buffer.from(base64Data, 'base64');

      if (buffer.length > MAX_FILE_SIZE) {
        return NextResponse.json({ success: false, message: 'Ukuran file logo melebihi batas maksimal 2 MB.' }, { status: 400 });
      }

      const ext = mimeType === 'image/svg+xml' ? 'svg' : mimeType.split('/')[1] || 'png';
      fileName = `logo-sekolah-${Date.now()}.${ext}`;
    }

    // Save to public/uploads/logo/
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'logo');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const targetPath = path.join(uploadsDir, fileName);
    fs.writeFileSync(targetPath, buffer);

    const publicUrl = `/uploads/logo/${fileName}`;

    // Sinkronisasi logo sebagai FAVICON ke domain utama (admin) dan subdomain (mobile)
    try {
      const monorepoRoot = path.resolve(process.cwd(), '..', '..');
      
      // 1. Salin ke apps/admin/public/favicon.* & icon.*
      const adminPublicDir = path.join(monorepoRoot, 'apps', 'admin', 'public');
      if (fs.existsSync(adminPublicDir)) {
        fs.writeFileSync(path.join(adminPublicDir, 'favicon.ico'), buffer);
        fs.writeFileSync(path.join(adminPublicDir, 'favicon.png'), buffer);
        fs.writeFileSync(path.join(adminPublicDir, 'icon.png'), buffer);
      }

      // 2. Salin ke apps/mobile/public/favicon.* & icon.* (subdomain)
      const mobilePublicDir = path.join(monorepoRoot, 'apps', 'mobile', 'public');
      if (fs.existsSync(mobilePublicDir)) {
        fs.writeFileSync(path.join(mobilePublicDir, 'favicon.ico'), buffer);
        fs.writeFileSync(path.join(mobilePublicDir, 'favicon.png'), buffer);
        fs.writeFileSync(path.join(mobilePublicDir, 'icon.png'), buffer);
      }

      // 3. Simpan state logo & favicon di runtime-settings.json
      const settingsDir = path.join(monorepoRoot, 'packages', 'db', 'data');
      if (!fs.existsSync(settingsDir)) {
        fs.mkdirSync(settingsDir, { recursive: true });
      }
      const settingsFile = path.join(settingsDir, 'runtime-settings.json');
      let curSettings: any = {};
      if (fs.existsSync(settingsFile)) {
        try {
          curSettings = JSON.parse(fs.readFileSync(settingsFile, 'utf-8'));
        } catch {}
      }
      curSettings.logoUrl = publicUrl;
      curSettings.faviconUrl = publicUrl;
      curSettings.faviconHash = Date.now().toString();
      curSettings.updatedAt = new Date().toISOString();
      fs.writeFileSync(settingsFile, JSON.stringify(curSettings, null, 2), 'utf-8');
    } catch (copyErr) {
      console.warn('[LOGO_UPLOAD] Gagal menyalin favicon ke domain/subdomain:', copyErr);
    }

    // Record audit log
    recordAuditLog({
      userName: 'Administrator',
      identifier: 'admin',
      action: 'SYSTEM_CONFIG_UPDATED',
      status: 'SUCCESS',
      details: `Logo resmi sekolah berhasil diunggah dan diperbarui (${fileName}, ${(buffer.length / 1024).toFixed(1)} KB)`,
    });

    return NextResponse.json({
      success: true,
      message: 'Logo sekolah berhasil diunggah!',
      logoUrl: publicUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Gagal mengunggah logo: ${error?.message || 'Internal server error'}` },
      { status: 500 }
    );
  }
}
