import { describe, it, expect } from 'vitest';
import {
  validateSelfieLiveness,
  computeImageHash,
  sendAttendanceWhatsAppNotification,
  sendLeaveWhatsAppNotification,
  normalizeWhatsAppNumber,
  createWhatsAppChatUrl,
} from '@dzitoe/utils';
import {
  recordStudentAttendance,
  SEED_STUDENTS,
} from '@dzitoe/db';

describe('Server-Side Liveness & Anti-Spoofing Suite (A12.1 – A12.8)', () => {
  // Sample valid WebP base64 image payload (>20KB to simulate realistic front camera selfie)
  const sampleWebpBase64 =
    'data:image/webp;base64,' + 'UklGRkAAAABXRUJQVlA4IDQAAADwAQCdASoBAAEAAkA4JaQAA3AA/vsGAAAEwAAAAA=='.padEnd(25000, 'A');

  it('A12.3 & A12.7: validates a clean WebP selfie with real-time server timestamp', () => {
    const result = validateSelfieLiveness({
      imagePayload: sampleWebpBase64,
      timestampClient: new Date().toISOString(),
      latitude: -6.123456,
      longitude: 106.123456,
      accuracyMeters: 12,
      deviceFingerprint: {
        userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8)',
        platform: 'Linux armv8l',
        screenWidth: 393,
        screenHeight: 852,
      },
      studentId: 'mrd-valid-1',
    });

    expect(result.isValid).toBe(true);
    expect(result.metadata.format).toBe('webp');
    expect(result.imageHash).toBeDefined();
    expect(result.metadata.watermarkText).toContain('SMAN 20 KAB. TANGERANG');
    expect(result.metadata.watermarkText).toContain('WIB');
  });

  it('A12.7: detects duplicate replay attack using identical image hash', () => {
    const hash = computeImageHash(sampleWebpBase64);
    expect(hash).toBeDefined();
    expect(hash.length).toBe(64); // SHA-256 hex string

    // 1st submission
    const res1 = validateSelfieLiveness({
      imagePayload: sampleWebpBase64,
      timestampClient: new Date().toISOString(),
      studentId: 'mrd-replay-test',
    });
    expect(res1.isValid).toBe(true);
    expect(res1.isDuplicatePhoto).toBe(false);

    // 2nd submission with exact identical image payload triggers duplicate anti-spoofing
    const res2 = validateSelfieLiveness({
      imagePayload: sampleWebpBase64,
      timestampClient: new Date().toISOString(),
      studentId: 'mrd-replay-test',
    });
    expect(res2.isDuplicatePhoto).toBe(true);
    expect(res2.warnings.some((w) => w.includes('Terdeteksi foto duplikat'))).toBe(true);
  });

  it('A12.7: rejects or flags payload with abnormal client-server clock drift (>15 minutes)', () => {
    // 30 minutes in the past
    const staleTime = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const staleResult = validateSelfieLiveness({
      imagePayload: sampleWebpBase64,
      timestampClient: staleTime,
      studentId: 'mrd-stale-time',
    });

    expect(staleResult.isTimestampFresh).toBe(false);
    expect(staleResult.warnings.some((r) => r.includes('Timestamp kamera tidak sinkron'))).toBe(true);
  });
});

describe('WhatsApp Notifications & Attendance Decoupling Suite (B11 – B15)', () => {
  it('normalizes Indonesian WhatsApp numbers to 628xxx format', () => {
    expect(normalizeWhatsAppNumber('0812-3456-7890')).toBe('6281234567890');
    expect(normalizeWhatsAppNumber('+62 812-3456-7890')).toBe('6281234567890');
    expect(normalizeWhatsAppNumber('6281234567890')).toBe('6281234567890');
  });

  it('B13.1: formats and logs automated attendance push notification to parents', () => {
    const log = sendAttendanceWhatsAppNotification({
      studentName: 'Dimas Wibowo',
      studentClass: 'X.1',
      studentNisn: '0080000001',
      parentPhone: '081298765432',
      parentName: 'Bambang Wibowo',
      timeStr: '06:55 WIB',
      dateStr: '28 September 2026',
      status: 'TEPAT',
      method: 'GPS',
      coords: { lat: -6.123456, lng: 106.123456 },
    });

    expect(log.status).toBe('SENT');
    expect(log.recipientPhone).toBe('6281298765432');
    expect(log.message).toContain('PEMBERITAHUAN PRESENSI SMAN 20');
    expect(log.message).toContain('Dimas Wibowo');
    expect(log.message).toContain('Presensi Mandiri GPS');

    const chatUrl = createWhatsAppChatUrl(log.recipientPhone, log.message);
    expect(chatUrl).toContain('https://wa.me/6281298765432?text=');
  });

  it('B12.1 & B13.1: formats and logs automated leave/sick push notification to parents', () => {
    const log = sendLeaveWhatsAppNotification({
      studentName: 'Aulia Rahmawati',
      studentClass: 'X.1',
      parentPhone: '081311223344',
      parentName: 'Hj. Siti Rahma',
      type: 'SAKIT',
      startDate: '28 September 2026',
      reason: 'Demam tinggi dan istirahat dokter',
    });

    expect(log.status).toBe('SENT');
    expect(log.recipientPhone).toBe('6281311223344');
    expect(log.message).toContain('PEMBERITAHUAN PENGAJUAN');
    expect(log.message).toContain('SAKIT');
    expect(log.message).toContain('Demam tinggi');
  });

  it('Decouples Attendance: GPS can check in without photo, and Selfie automatically records coordinates', () => {
    const student = SEED_STUDENTS[0];
    expect(student).toBeDefined();

    // 1. Check in via GPS without selfie
    const gpsResult = recordStudentAttendance({
      muridId: student.id,
      type: 'MASUK',
      method: 'GPS',
      latitude: -6.123456,
      longitude: 106.123456,
      isDemo: true,
      selfieUrl: null,
    });

    expect(gpsResult.success).toBe(true);
    expect(gpsResult.record?.method).toBe('GPS');

    // 2. Check in via Selfie with automatic coordinates and liveness verification
    const selfieResult = recordStudentAttendance({
      muridId: student.id,
      type: 'MASUK',
      method: 'SELFIE',
      latitude: -6.123456,
      longitude: 106.123456,
      isDemo: true,
      selfieUrl: '/uploads/selfie/test-selfie.webp',
      livenessVerified: true,
      imageHash: 'abcdef1234567890',
    });

    expect(selfieResult.success).toBe(true);
    expect(selfieResult.record?.method).toBe('SELFIE');
    expect(selfieResult.record?.selfieUrl).toBe('/uploads/selfie/test-selfie.webp');
    expect(selfieResult.record?.livenessVerified).toBe(true);

    // 3. Alternative QR method
    const qrResult = recordStudentAttendance({
      muridId: student.id,
      type: 'PULANG',
      method: 'QR',
      isDemo: true,
      notes: 'Presensi Pos Piket Alternatif',
    });

    expect(qrResult.success).toBe(true);
    expect(qrResult.record?.method).toBe('QR');
  });
});
