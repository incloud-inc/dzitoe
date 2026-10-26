// ==============================================================================
// DZITOE — API Manajemen Pengguna & Hak Akses Akun (@apps/admin)
// Task: Modul A3 — API CRUD User & RBAC SMAN 20 Kab Tangerang
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  type UserRole,
  type UserStatus,
} from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const role = searchParams.get('role') as UserRole | null;
    const status = searchParams.get('status') as UserStatus | null;

    let users = getAllUsers();

    if (search) {
      users = users.filter(
        (u) =>
          u.nama.toLowerCase().includes(search) ||
          u.username.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          u.jabatan.toLowerCase().includes(search) ||
          (u.linkedEntityNama && u.linkedEntityNama.toLowerCase().includes(search))
      );
    }

    if (role) {
      users = users.filter((u) => u.role === role);
    }

    if (status) {
      users = users.filter((u) => u.status === status);
    }

    // Summary stats
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === 'AKTIF').length;
    const gtkUsers = users.filter((u) => ['GURU', 'WALI_KELAS', 'KEPALA_SEKOLAH', 'WAKA_KURIKULUM', 'WAKA_KESISWAAN'].includes(u.role)).length;
    const studentUsers = users.filter((u) => u.role === 'MURID').length;

    return NextResponse.json({
      success: true,
      data: users,
      summary: {
        total: totalUsers,
        aktif: activeUsers,
        gtk: gtkUsers,
        murid: studentUsers,
      },
    });
  } catch (error: any) {
    console.error('[API /api/pengguna GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data pengguna: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, nama, email, role, phone, jabatan, linkedEntityId, linkedEntityType, linkedEntityNama } = body;

    if (!username || !nama || !email || !role) {
      return NextResponse.json(
        { success: false, message: 'Field username, nama, email, dan role wajib diisi!' },
        { status: 400 }
      );
    }

    const result = createUser({
      username,
      nama,
      email,
      role,
      phone,
      jabatan,
      linkedEntityId,
      linkedEntityType,
      linkedEntityNama,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.user,
    });
  } catch (error: any) {
    console.error('[API /api/pengguna POST] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal membuat pengguna: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID pengguna wajib disertakan!' },
        { status: 400 }
      );
    }

    const result = updateUser(id, updates);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.user,
    });
  } catch (error: any) {
    console.error('[API /api/pengguna PUT] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui pengguna: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Parameter id wajib disertakan!' },
        { status: 400 }
      );
    }

    const result = deleteUser(id);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error('[API /api/pengguna DELETE] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus pengguna: ' + error.message },
      { status: 500 }
    );
  }
}
