/**
 * DZITOE Config — helper tooling bersama.
 * Task: A0.1
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));

export const MONOREPO_ROOT = path.resolve(HERE, '..', '..', '..');
export const TSCONFIG_BASE_PATH = path.join(MONOREPO_ROOT, 'tsconfig.base.json');
