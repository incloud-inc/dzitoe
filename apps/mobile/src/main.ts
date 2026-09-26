/**
 * DZITOE Mobile — bootstrap entry placeholder.
 * Task: A0.1 (workspace bootstrap)
 * Implementasi PWA Next.js 14 lengkap pada task A0.3.
 */
import { APP_PORTS, assertNotReservedPort } from '@dzitoe/shared';

assertNotReservedPort(APP_PORTS.mobile);

export const MOBILE_BOOTSTRAP = {
  name: '@dzitoe/mobile',
  devUrl: `http://localhost:${APP_PORTS.mobile}`,
  status: 'bootstrap' as const,
};

console.log(`[DZITOE] mobile bootstrap -> ${MOBILE_BOOTSTRAP.devUrl}`);
