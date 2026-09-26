/**
 * DZITOE Admin — bootstrap entry placeholder.
 * Task: A0.1 (workspace bootstrap)
 * Implementasi Next.js 14 App Router lengkap pada task A0.2.
 */
import { APP_PORTS, assertNotReservedPort } from '@dzitoe/shared';

assertNotReservedPort(APP_PORTS.admin);

export const ADMIN_BOOTSTRAP = {
  name: '@dzitoe/admin',
  devUrl: `http://localhost:${APP_PORTS.admin}`,
  status: 'bootstrap' as const,
};

console.log(`[DZITOE] admin bootstrap -> ${ADMIN_BOOTSTRAP.devUrl}`);
