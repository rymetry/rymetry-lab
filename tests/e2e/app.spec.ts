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

  await page.getByRole('button', { name: '表示言語' }).click();
  await page.getByRole('menuitemradio', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole('button', { name: 'Display language' })).toBeVisible();

  // テーマ切替は即時トグル (resolvedTheme の反対をセット)。デフォルトはライトなので dark → light の往復を検証。
  // ラベルはマウント後 "Switch to dark/light theme" に動的化されるため theme を含む名前でマッチさせる
  const themeToggle = page.getByRole('button', { name: /テーマ|theme/i });
  await themeToggle.click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await themeToggle.click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
});

/**
 * Issue #106 / WCAG 3.1.1 — `<html lang>` は配信されるロケールと一致させる。
 * `localePrefix: 'as-needed'` なので日本語の正規 URL は `/ja` ではなく `/`。
 *
 * 既知の制限: `/en/no-such-page` のようなロケール配下の未マッチ URL は root の
 * not-found が受けるため `lang="ja"` のまま。catch-all を挟むと PPR のシェルが先に
 * 200 で返り soft 404 になるため、別 Issue で扱う。
 */
test('declares the document language for the served locale', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');

  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await page.goto('/no-such-page');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');

});

test('serves security headers on HTML responses', async ({ request }) => {
  const response = await request.get('/');

  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  expect(response.headers()['x-frame-options']).toBe('DENY');
  expect(response.headers()['content-security-policy-report-only']).toContain("default-src 'self'");
});
