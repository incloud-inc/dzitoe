/**
 * DZITOE — Helper pembacaan environment variable.
 * Task: A0.1
 */
import { APP_PORTS, INFRA_PORTS, assertNotReservedPort } from './ports.js';

export function readPort(raw: string | undefined, fallback: number): number {
  const value = raw === undefined || raw === '' ? fallback : Number.parseInt(raw, 10);

  if (!Number.isInteger(value) || value < 1 || value > 65535) {
    throw new Error(`[DZITOE] Nilai port tidak valid: "${raw}" (fallback: ${fallback}).`);
  }

  assertNotReservedPort(value);
  return value;
}

export function readString(raw: string | undefined, fallback: string): string {
  return raw === undefined || raw === '' ? fallback : raw;
}

export function readBoolean(raw: string | undefined, fallback = false): boolean {
  if (raw === undefined || raw === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(raw.toLowerCase());
}

export interface DzitoePortConfig {
  readonly admin: number;
  readonly mobile: number;
  readonly api: number;
  readonly postgres: number;
  readonly redis: number;
}

export function resolvePorts(env: NodeJS.ProcessEnv = process.env): DzitoePortConfig {
  return {
    admin: readPort(env.ADMIN_PORT, APP_PORTS.admin),
    mobile: readPort(env.MOBILE_PORT, APP_PORTS.mobile),
    api: readPort(env.API_PORT, APP_PORTS.api),
    postgres: readPort(env.DB_PORT, INFRA_PORTS.postgres),
    redis: readPort(env.REDIS_PORT, INFRA_PORTS.redis),
  };
}
