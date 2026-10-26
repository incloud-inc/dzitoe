// ==============================================================================
// DZITOE — Security Audit Log API Route
// Task: Modul A1.9 — Audit Log Login & Keamanan
// ==============================================================================

import { NextResponse } from 'next/server';
import { getAllAuditLogs } from '@dzitoe/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const action = searchParams.get('action') || '';
    const status = searchParams.get('status') || '';

    let logs = getAllAuditLogs();

    if (search) {
      logs = logs.filter(
        (l) =>
          l.userName.toLowerCase().includes(search) ||
          l.identifier.toLowerCase().includes(search) ||
          l.ipAddress.toLowerCase().includes(search) ||
          l.details.toLowerCase().includes(search) ||
          l.browser.toLowerCase().includes(search)
      );
    }

    if (action) {
      logs = logs.filter((l) => l.action === action);
    }

    if (status) {
      logs = logs.filter((l) => l.status === status);
    }

    const totalLogs = getAllAuditLogs();
    const summary = {
      total: totalLogs.length,
      success: totalLogs.filter((l) => l.status === 'SUCCESS').length,
      failed: totalLogs.filter((l) => l.status === 'FAILED').length,
      warning: totalLogs.filter((l) => l.status === 'WARNING').length,
    };

    return NextResponse.json({
      success: true,
      data: logs,
      summary,
    });
  } catch (error) {
    console.error('[API_AUTH_AUDIT_LOG_GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat catatan audit log.' },
      { status: 500 }
    );
  }
}
