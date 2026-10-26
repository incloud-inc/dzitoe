import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'Admin Desktop (Chromium)',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
      },
    },
    {
      name: 'Mobile PWA (Pixel 5)',
      use: {
        ...devices['Pixel 5'],
        baseURL: 'http://localhost:3001',
      },
    },
    {
      name: 'Mobile PWA (iPhone 12)',
      use: {
        ...devices['iPhone 12'],
        baseURL: 'http://localhost:3001',
      },
    },
  ],
  webServer: [
    {
      command: 'pnpm dev:admin',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: 'pnpm dev:mobile',
      url: 'http://localhost:3001',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
});
