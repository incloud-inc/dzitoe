/**
 * DZITOE — Single source of truth untuk PORT.
 * Task: A0.1
 *
 * ⛔ JANGAN pernah mengubah nilai di RESERVED_PORTS menjadi milik DZITOE.
 *    Port tersebut sudah dipakai project/service lain di laptop dev.
 */

/** Port aplikasi DZITOE yang sudah diverifikasi BEBAS. */
export const APP_PORTS = {
  admin: 3000,
  mobile: 3001,
  api: 3002,
} as const;

export type DzitoeApp = keyof typeof APP_PORTS;

/**
 * Port milik project / service lain di laptop dev.
 * DZITOE DILARANG memakai port-port ini.
 */
export const RESERVED_PORTS = {
  80: 'Web server lokal (HTTP)',
  443: 'Web server lokal (HTTPS)',
  3306: 'MySQL lokal',
  5432: 'PostgreSQL lokal',
  6379: 'Redis lokal',
  8000: 'ADZKIA — aplikasi ujian',
  5173: 'PERSOALAN — Vite dev server',
} as const;

/** Port infrastruktur milik DZITOE (selain port aplikasi). */
export const INFRA_PORTS = {
  postgres: 5433,
  redis: 6380,
} as const;

/** Daftar seluruh port yang dipakai DZITOE + labelnya. */
export const DZITOE_PORT_MAP: Readonly<Record<string, number>> = {
  admin: APP_PORTS.admin,
  mobile: APP_PORTS.mobile,
  api: APP_PORTS.api,
  postgres: INFRA_PORTS.postgres,
  redis: INFRA_PORTS.redis,
};

/** Cek apakah sebuah port termasuk RESERVED. */
export function isReservedPort(port: number): boolean {
  return Object.prototype.hasOwnProperty.call(RESERVED_PORTS, port);
}

/**
 * Melempar error bila `port` termasuk RESERVED.
 * Dipakai di entry point app supaya salah konfigurasi dicegah dari awal.
 */
export function assertNotReservedPort(port: number): void {
  if (isReservedPort(port)) {
    const owner = RESERVED_PORTS[port as keyof typeof RESERVED_PORTS];
    throw new Error(
      `[DZITOE] Port ${port} RESERVED (${owner}). ` +
        `Gunakan salah satu port resmi: ${Object.values(APP_PORTS).join(', ')}.`,
    );
  }
}
