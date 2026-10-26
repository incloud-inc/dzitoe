import { test, expect } from '@playwright/test';

test.describe('DZITOE Admin E2E Suite', () => {
  test('Admin dashboard loads and displays navigation elements', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/DZITOE|SMAN 20/i);
    // Verify topbar search input exists
    const searchInput = page.locator('input[placeholder*="Cari"]');
    await expect(searchInput).toBeVisible();
  });

  test('Pengaturan Sekolah loads with tabs and controls', async ({ page }) => {
    await page.goto('/pengaturan');
    // Verify heading
    await expect(page.locator('h1')).toContainText(/Pengaturan/i);
    // Verify Reset and Simpan buttons
    await expect(page.locator('button:has-text("Reset")')).toBeVisible();
    await expect(page.locator('button:has-text("Simpan")')).toBeVisible();
  });
});

test.describe('DZITOE Mobile PWA E2E Suite', () => {
  test('Mobile home loads with Bottom Navigation', async ({ page }) => {
    await page.goto('http://localhost:3001/');
    // Verify bottom nav items
    const bottomNav = page.locator('nav');
    await expect(bottomNav).toBeVisible();
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=Jadwal')).toBeVisible();
    await expect(page.locator('text=Ekstra')).toBeVisible();
    await expect(page.locator('text=Profil')).toBeVisible();
  });
});
