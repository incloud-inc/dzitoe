// ==============================================================================
// DZITOE — API Anti-Fake GPS & Geofence Security (@apps/admin)
// Task: Modul A11 — Validasi Radius & Fake GPS Geofencing
// Permendikdasmen No. 1–6 Tahun 2026 Compliant
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  getAllFraudLogs,
  getGeofenceConfig,
  updateGeofenceConfig,
  validatePresenceLocation,
  clearFraudLogs,
} from '@dzitoe/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filterReason = searchParams.get('reason');

    let logs = getAllFraudLogs();
    if (filterReason) {
      logs = logs.filter((l) => l.reason === filterReason);
    }

    const config = getGeofenceConfig();

    // Summary stats
    const totalFraud = logs.length;
    const mockAppCount = logs.filter((l) => l.reason === 'MOCK_GPS_DETECTED' || l.reason === 'SUSPICIOUS_ACCURACY_ZERO').length;
    const outOfRadiusCount = logs.filter((l) => l.reason === 'OUT_OF_RADIUS').length;
    const accuracyDriftCount = logs.filter((l) => l.reason === 'ACCURACY_TOO_LOW' || l.reason === 'TIMESTAMP_DRIFT').length;

    return NextResponse.json({
      success: true,
      config,
      logs,
      summary: {
        totalFraud,
        mockAppCount,
        outOfRadiusCount,
        accuracyDriftCount,
      },
    });
  } catch (error: any) {
    console.error('[API /api/presensi/antifake GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil log keamanan: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Action: Update config geofence
    if (action === 'update_config') {
      const { radiusMeters, toleranceMeters, maxAllowedAccuracyMeters } = body;
      const updated = updateGeofenceConfig({
        ...(radiusMeters ? { radiusMeters: Number(radiusMeters) } : {}),
        ...(toleranceMeters ? { toleranceMeters: Number(toleranceMeters) } : {}),
        ...(maxAllowedAccuracyMeters ? { maxAllowedAccuracyMeters: Number(maxAllowedAccuracyMeters) } : {}),
      });
      return NextResponse.json({
        success: true,
        message: 'Konfigurasi perimeter geofence sekolah berhasil diperbarui!',
        config: updated,
      });
    }

    // Action: Test verification coordinate
    if (action === 'test_verification') {
      const { latitude, longitude, accuracy, isMockLocation, userType, userId, userName, identifier, kelasOrJabatan } = body;
      const result = validatePresenceLocation({
        latitude: Number(latitude),
        longitude: Number(longitude),
        accuracy: accuracy !== undefined ? Number(accuracy) : 10,
        isMockLocation: Boolean(isMockLocation),
        userType: userType || 'MURID',
        userId: userId || 'test-user',
        userName: userName || 'Tester Akun',
        identifier: identifier || '0000000000',
        kelasOrJabatan: kelasOrJabatan || 'X.1',
        deviceInfo: 'Simulasi Keamanan Admin',
      });

      return NextResponse.json({
        success: true,
        result,
      });
    }

    // Action: Clear logs
    if (action === 'clear_logs') {
      clearFraudLogs();
      return NextResponse.json({
        success: true,
        message: 'Riwayat log anomali geofence berhasil dibersihkan.',
      });
    }

    return NextResponse.json({ success: false, message: 'Aksi tidak dikenali.' }, { status: 400 });
  } catch (error: any) {
    console.error('[API /api/presensi/antifake POST] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memproses validasi keamanan: ' + error.message },
      { status: 500 }
    );
  }
}
