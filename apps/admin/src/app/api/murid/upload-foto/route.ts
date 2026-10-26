// ==============================================================================
// DZITOE — API Upload Foto Murid (@apps/admin)
// Task: Modul A5.12 — Upload Foto Murid
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { updateStudent, getStudentById } from '@dzitoe/db';
import { recordAuditLog } from '@dzitoe/auth';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let studentId = '';
    let buffer: Buffer;
    let mimeType = 'image/jpeg';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      studentId = (formData.get('studentId') as string) || '';
      const file = formData.get('photo') as File | null;

      if (!studentId) {
        return NextResponse.json({ success: false, message: 'ID Murid wajib disertakan.' }, { status: 400 });
      }

      if (!file) {
        return NextResponse.json({ success: false, message: 'File foto murid tidak ditemukan.' }, { status: 400 });
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
      studentId = body.studentId || '';
      const dataUri = body.dataUri || '';

      if (!studentId || !dataUri) {
        return NextResponse.json({ success: false, message: 'studentId dan dataUri wajib diisi.' }, { status: 400 });
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

    const student = getStudentById(studentId);
    if (!student) {
      return NextResponse.json({ success: false, message: 'Data murid tidak ditemukan.' }, { status: 404 });
    }

    // Save to public/uploads/murid/
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'murid');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = mimeType.split('/')[1] || 'jpg';
    const fileName = `${student.nisn || studentId}-${Date.now()}.${ext}`;
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/murid/${fileName}`;

    // Update in student store
    const updated = updateStudent(student.id, { avatar: publicUrl });

    // Record audit log
    recordAuditLog({
      userName: 'Administrator',
      identifier: 'admin',
      action: 'SYSTEM_CONFIG_UPDATED',
      status: 'SUCCESS',
      details: `Foto resmi murid "${student.nama}" (NISN: ${student.nisn}) berhasil diperbarui.`,
    });

    return NextResponse.json({
      success: true,
      message: `Foto murid ${student.nama} berhasil diperbarui!`,
      avatarUrl: publicUrl,
      student: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Gagal mengunggah foto murid: ${error?.message || 'Internal error'}` },
      { status: 500 }
    );
  }
}
