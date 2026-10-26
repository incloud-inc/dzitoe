// ==============================================================================
// DZITOE — Rate Limiting, Brute Force Guard & Centralized Security Audit (@dzitoe/utils)
// Modul A30: Proteksi Keamanan Berlapis & Hardening OWASP (Task A30.1 & A30.2)
// ==============================================================================

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  totalHits: number;
}

interface Bucket {
  hits: number;
  resetAt: number;
}

// In-Memory Token Bucket / Sliding Window for Edge & Node runtimes
const rateLimitBuckets = new Map<string, Bucket>();

/**
 * Membatasi frekuensi request berdasarkan IP/Identifier (Rate Limiting Bertingkat)
 * @param identifier IP atau User ID
 * @param maxHits Batas maksimum permintaan
 * @param windowSeconds Jendela waktu (detik)
 */
export function checkRateLimit(
  identifier: string,
  maxHits: number = 60,
  windowSeconds: number = 60
): RateLimitResult {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(identifier);

  if (!bucket || bucket.resetAt < now) {
    const newBucket: Bucket = {
      hits: 1,
      resetAt: now + windowSeconds * 1000,
    };
    rateLimitBuckets.set(identifier, newBucket);
    return {
      allowed: true,
      remaining: maxHits - 1,
      resetSeconds: windowSeconds,
      totalHits: 1,
    };
  }

  bucket.hits += 1;
  const remaining = Math.max(0, maxHits - bucket.hits);
  const resetSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));

  return {
    allowed: bucket.hits <= maxHits,
    remaining,
    resetSeconds,
    totalHits: bucket.hits,
  };
}

// ------------------------------------------------------------------------------
// CENTRALIZED AUDIT LOGGING (Task A30.2)
// ------------------------------------------------------------------------------

export interface SecurityAuditRecord {
  id: string;
  timestamp: string;
  action: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'MUTASI_DATA' | 'AKSES_DITOLAK' | 'EKSPOR_LAPORAN';
  userId?: string;
  userName?: string;
  role?: string;
  ipAddress: string;
  userAgent: string;
  deviceSignature?: string;
  resource: string;
  details?: Record<string, any>;
  level: 'INFO' | 'WARN' | 'CRITICAL';
}

const auditLogs: SecurityAuditRecord[] = [];

export function logSecurityAudit(record: Omit<SecurityAuditRecord, 'id' | 'timestamp'>): SecurityAuditRecord {
  const fullRecord: SecurityAuditRecord = {
    ...record,
    id: `sec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
  };

  auditLogs.unshift(fullRecord);
  if (auditLogs.length > 500) {
    auditLogs.pop(); // Pertahankan 500 catatan log keamanan terkini
  }

  return fullRecord;
}

export function getSecurityAuditLogs(limit: number = 50): SecurityAuditRecord[] {
  return auditLogs.slice(0, limit);
}
