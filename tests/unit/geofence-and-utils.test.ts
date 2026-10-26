import { describe, it, expect } from 'vitest';
import { formatRupiah } from '../../packages/utils/src';
import {
  DEFAULT_GEOFENCE_CONFIG,
  REASON_LABELS,
  FraudReason,
} from '../../packages/db/src/geofence-store';
import { calculateDistanceMeters, SCHOOL_COORDINATES } from '../../packages/db/src/seed-data';

describe('DZITOE Utils Suite', () => {
  it('correctly formats IDR currency in Rupiah', () => {
    expect(formatRupiah(50000)).toMatch(/Rp\s?50\.000/);
    expect(formatRupiah(1250000)).toMatch(/Rp\s?1\.250\.000/);
    expect(formatRupiah(0)).toMatch(/Rp\s?0/);
  });
});

describe('Geofence & Haversine Distance Suite', () => {
  it('calculates zero distance for identical coordinates', () => {
    const dist = calculateDistanceMeters(
      SCHOOL_COORDINATES.lat,
      SCHOOL_COORDINATES.lng,
      SCHOOL_COORDINATES.lat,
      SCHOOL_COORDINATES.lng
    );
    expect(dist).toBe(0);
  });

  it('correctly calculates distance within SMAN 20 school gate', () => {
    // Offset very slightly (~10-15 meters)
    const slightlyOffsetLat = SCHOOL_COORDINATES.lat + 0.0001;
    const slightlyOffsetLng = SCHOOL_COORDINATES.lng + 0.0001;
    const dist = calculateDistanceMeters(
      SCHOOL_COORDINATES.lat,
      SCHOOL_COORDINATES.lng,
      slightlyOffsetLat,
      slightlyOffsetLng
    );

    expect(dist).toBeGreaterThan(0);
    expect(dist).toBeLessThan(50); // within 50 meters
  });

  it('flags out of radius when user is far away (e.g., Monas Jakarta)', () => {
    const monasLat = -6.175392;
    const monasLng = 106.827153;
    const dist = calculateDistanceMeters(
      SCHOOL_COORDINATES.lat,
      SCHOOL_COORDINATES.lng,
      monasLat,
      monasLng
    );

    // SMAN 20 Pakuhaji to Monas is > 20 km
    expect(dist).toBeGreaterThan(20000);
    expect(dist).toBeGreaterThan(DEFAULT_GEOFENCE_CONFIG.radiusMeters);
  });

  it('contains valid fraud reason labels and severity descriptions', () => {
    const reasons: FraudReason[] = [
      'OUT_OF_RADIUS',
      'MOCK_GPS_DETECTED',
      'SUSPICIOUS_ACCURACY_ZERO',
      'ACCURACY_TOO_LOW',
      'TIMESTAMP_DRIFT',
      'IMPOSSIBLE_SPEED',
    ];

    reasons.forEach((reason) => {
      expect(REASON_LABELS[reason]).toBeDefined();
      expect(REASON_LABELS[reason].label).toBeTruthy();
      expect(['medium', 'high', 'critical']).toContain(REASON_LABELS[reason].severity);
    });
  });
});
