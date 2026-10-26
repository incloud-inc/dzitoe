// ==============================================================================
// DZITOE — Sessions Management API Route
// Task: Modul A1.8 — Manajemen Sesi
// ==============================================================================

import { NextResponse } from 'next/server';
import {
  getAllSessions,
  revokeSession,
  revokeAllOtherSessions,
  recordAuditLog,
} from '@dzitoe/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const filterStatus = searchParams.get('status'); // 'active' | 'revoked'

    let sessions = getAllSessions();

    if (userId) {
      sessions = sessions.filter((s) => s.userId === userId);
    }

    if (filterStatus === 'active') {
      sessions = sessions.filter((s) => !s.isRevoked);
    } else if (filterStatus === 'revoked') {
      sessions = sessions.filter((s) => s.isRevoked);
    }

    const totalActive = sessions.filter((s) => !s.isRevoked).length;
    const totalRevoked = sessions.filter((s) => s.isRevoked).length;

    return NextResponse.json({
      success: true,
      data: sessions,
      summary: {
        total: sessions.length,
        active: totalActive,
        revoked: totalRevoked,
      },
    });
  } catch (error) {
    console.error('[API_AUTH_SESSIONS_GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat sesi aktif.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, sessionId, userId } = body;

    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = (forwarded ? forwarded.split(',')[0]?.trim() : null) || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Browser Web';

    if (action === 'REVOKE_ONE' && sessionId) {
      const ok = revokeSession(sessionId);
      if (!ok) {
        return NextResponse.json(
          { success: false, message: 'Sesi tidak ditemukan atau sudah dicabut.' },
          { status: 404 }
        );
      }

      recordAuditLog({
        userName: 'Administrator',
        identifier: 'admin',
        action: 'SESSION_REVOKED',
        status: 'WARNING',
        ipAddress,
        userAgent,
        details: `Sesi ID ${sessionId} dicabut secara paksa (force logout)`,
      });

      return NextResponse.json({
        success: true,
        message: 'Sesi perangkat berhasil dicabut. Pengguna telah dipaksa logout.',
      });
    }

    if (action === 'REVOKE_ALL' && userId) {
      const count = revokeAllOtherSessions(userId);

      recordAuditLog({
        userId,
        userName: 'Pengguna',
        identifier: userId,
        action: 'SESSION_REVOKED',
        status: 'WARNING',
        ipAddress,
        userAgent,
        details: `${count} sesi perangkat lain berhasil dicabut serentak`,
      });

      return NextResponse.json({
        success: true,
        message: `${count} sesi perangkat lain berhasil dicabut.`,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Aksi sesi tidak valid.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[API_AUTH_SESSIONS_POST] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memproses sesi.' },
      { status: 500 }
    );
  }
}
