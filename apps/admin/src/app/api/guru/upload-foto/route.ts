// ==============================================================================
// DZITOE — API Upload Foto Guru (@apps/admin)
// Task: Modul A6.9 — Upload Foto Guru
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { updateTeacher, getAllTeachers } from '@dzitoe/db';
import { recordAuditLog } from '@dzitoe/auth';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let teacherId = '';
    let buffer: Buffer;
    let mimeType = 'image/jpeg';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      teacherId = (formData.get('teacherId') as string) || '';
      const file = formData.get('photo') as File | null;

      if (!teacherId) {
        return NextResponse.json({ success: false, message: 'ID Guru wajib disertakan.' }, { status: 400 });
      }

      if (!file) {
        return NextResponse.json({ success: false, message: 'File foto guru tidak ditemukan.' }, { status: 400 });
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ success: false, message: 'Ukuran foto melebihi batas 2 MB.' }, { status: 400 });
      }

      mimeType = file.type || 'image/jpeg';
      if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        return NextResponse.json(
          { success: false, message: 'Format foto harus berupa JPG, PNG, atau WebP.' },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      const body = await request.json();
      teacherId = body.teacherId || '';
      const dataUri = body.dataUri || '';

      if (!teacherId || !dataUri) {
        return NextResponse.json({ success: false, message: 'teacherId dan dataUri wajib diisi.' }, { status: 400 });
      }

      const match = dataUri.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (!match) {
        return NextResponse.json({ success: false, message: 'Format dataUri tidak valid.' }, { status: 400 });
      }

      mimeType = match[1];
      buffer = Buffer.from(match[2], 'base64');
      if (buffer.length > MAX_FILE_SIZE) {
        return NextResponse.json({ success: false, message: 'Ukuran foto melebihi batas 2 MB.' }, { status: 400 });
      }
    }

    const all = getAllTeachers();
    const teacher = all.find((t) => t.id === teacherId);
    if (!teacher) {
      return NextResponse.json({ success: false, message: 'Data guru tidak ditemukan.' }, { status: 404 });
    }

    // Save to public/uploads/guru/
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'guru');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = mimeType.split('/')[1] || 'jpg';
    const fileName = `${teacher.nip || teacherId}-${Date.now()}.${ext}`;
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/guru/${fileName}`;

    // Update in teacher store
    const updated = updateTeacher(teacher.id, { avatar: publicUrl });

    // Record audit log
    recordAuditLog({
      userName: 'Administrator',
      identifier: 'admin',
      action: 'SYSTEM_CONFIG_UPDATED',
      status: 'SUCCESS',
      details: `Foto profil resmi guru "${teacher.nama}" (NIP: ${teacher.nip}) berhasil diperbarui.`,
    });

    return NextResponse.json({
      success: true,
      message: `Foto guru ${teacher.nama} berhasil diperbarui!`,
      avatarUrl: publicUrl,
      teacher: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Gagal mengunggah foto guru: ${error?.message || 'Internal error'}` },
      { status: 500 }
    );
  }
}
