import { NextRequest, NextResponse } from 'next/server';
import { cache, getSecurityAuditLogs, logSecurityAudit } from '@dzitoe/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'overview';

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Browser';

    if (action === 'logs') {
      const logs = getSecurityAuditLogs(100);
      return NextResponse.json({ success: true, data: logs });
    }

    logSecurityAudit({
      action: 'LOGIN_SUCCESS',
      resource: '/api/settings/security-audit',
      ipAddress: ip,
      userAgent,
      level: 'INFO',
      details: { action },
    });

    if (action === 'test-cache') {
      // Benchmark performa cache multi-layer
      const t0 = performance.now();
      const cached = await cache.remember(
        'perf:benchmark:test',
        async () => {
          return {
            timestamp: new Date().toISOString(),
            status: 'Data Segar Berhasil Di-Cache',
            items: 30,
          };
        },
        { ttlSeconds: 60 }
      );
      const latencyMs = Math.round((performance.now() - t0) * 100) / 100;

      return NextResponse.json({
        success: true,
        data: cached,
        latencyMs,
        cacheStats: cache.getStats(),
      });
    }

    // Default overview performa & status hardening
    return NextResponse.json({
      success: true,
      data: {
        redisPort: 6380,
        cachingTier: 'Multi-Layer (Tier-1 Memory LRU + Tier-2 Redis Ready)',
        cacheStats: cache.getStats(),
        security: {
          rateLimiting: 'Aktif (15 auth/min, 120 general/min)',
          headers: [
            'Strict-Transport-Security (HSTS)',
            'X-Content-Type-Options: nosniff',
            'X-Frame-Options: SAMEORIGIN',
            'X-XSS-Protection',
            'Referrer-Policy: strict-origin-when-cross-origin',
            'Permissions-Policy (camera/geolocation restricted)',
          ],
          auditLogging: 'Centralized in-memory ring-buffer aktif',
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Browser';

    const recorded = logSecurityAudit({
      action: body.action || 'MUTASI_DATA',
      resource: body.resource || 'SystemSettings',
      ipAddress: ip,
      userAgent,
      level: body.level || 'INFO',
      userName: body.userName || 'Administrator',
      role: body.role || 'ADMIN',
      details: body.details,
    });

    return NextResponse.json({ success: true, data: recorded });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
