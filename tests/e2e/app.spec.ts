import { expect, test } from '@playwright/test';

test('renders localized core pages and preserves navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /Rymlab/ })).toBeVisible();

  const mainNav = page.getByRole('navigation', { name: 'メインナビゲーション' });
  await mainNav.getByRole('link', { name: 'Projects' }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();

  await mainNav.getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole('heading', { name: 'Rym' })).toBeVisible();
});

test('switches theme and locale from the header controls', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');

  await page.getByRole('button', { name: '表示言語' }).click();
  await page.getByRole('menuitemradio', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('button', { name: 'Display language' })).toBeVisible();

  await page.getByRole('button', { name: /テーマを切り替え|Toggle theme/ }).click();
  await page.getByRole('menuitemradio', { name: /Dark|ダーク/ }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
});

test('serves security headers on HTML responses', async ({ request }) => {
  const response = await request.get('/');

  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  expect(response.headers()['x-frame-options']).toBe('DENY');
  expect(response.headers()['content-security-policy-report-only']).toContain("default-src 'self'");
});
