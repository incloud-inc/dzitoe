import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'packages/**/*.test.ts',
      'tests/unit/**/*.test.ts',
      'apps/**/*.test.ts',
      'apps/**/*.test.tsx',
    ],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@dzitoe/db': path.resolve(import.meta.dirname || '.', './packages/db/src'),
      '@dzitoe/utils': path.resolve(import.meta.dirname || '.', './packages/utils/src'),
      '@dzitoe/shared': path.resolve(import.meta.dirname || '.', './packages/shared/src'),
      '@dzitoe/auth': path.resolve(import.meta.dirname || '.', './packages/auth/src'),
      '@dzitoe/theme': path.resolve(import.meta.dirname || '.', './packages/theme/src'),
    },
  },
});
