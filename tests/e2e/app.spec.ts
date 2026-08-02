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

/**
 * Issue #114 — canonical / og:url は「いま配信しているロケール」の URL を指す必要がある。
 * ロケール化を忘れると `/en` 配下が日本語版 URL を canonical に宣言し、英語ツリーが
 * 日本語ページの重複として自己申告される。
 *
 * `localePrefix: 'as-needed'` なので日本語の正規 URL は無印 (`/about`)、英語だけ `/en` が付く。
 * 絶対 URL の origin は `NEXT_PUBLIC_SITE_URL` 次第なので pathname だけを比較する。
 */
const LOCALIZED_PAGES = [
  { path: '/', canonicalPath: '/' },
  { path: '/en', canonicalPath: '/en' },
  { path: '/about', canonicalPath: '/about' },
  { path: '/en/about', canonicalPath: '/en/about' },
] as const;

/** `<head>` のリンク/メタが持つ絶対 URL を pathname に落とす */
async function headPathname(
  page: import('@playwright/test').Page,
  selector: string,
  attribute: string,
): Promise<string> {
  const value = await page.locator(selector).getAttribute(attribute);
  expect(value, `${selector} が見つからない`).toBeTruthy();

  return new URL(value!).pathname;
}

test('declares the served locale URL as canonical', async ({ page }) => {
  for (const { path, canonicalPath } of LOCALIZED_PAGES) {
    await page.goto(path);

    expect(await headPathname(page, 'link[rel="canonical"]', 'href'), path).toBe(canonicalPath);
    expect(await headPathname(page, 'meta[property="og:url"]', 'content'), path).toBe(canonicalPath);
  }
});

test('keeps hreflang alternates pointing at both locale trees', async ({ page }) => {
  for (const path of ['/about', '/en/about']) {
    await page.goto(path);

    expect(await headPathname(page, 'link[hreflang="ja"]', 'href'), path).toBe('/about');
    expect(await headPathname(page, 'link[hreflang="en"]', 'href'), path).toBe('/en/about');
    expect(await headPathname(page, 'link[hreflang="x-default"]', 'href'), path).toBe('/about');
  }
});

test('localizes the canonical URL on article detail pages', async ({ page }) => {
  await page.goto('/articles');
  const firstArticle = page.locator('a[href^="/articles/"]').first();
  // CI の E2E ジョブは microCMS の資格情報を持たず `/articles` が空状態で描画される
  test.skip(
    (await firstArticle.count()) === 0,
    'microCMS の記事が無いため詳細ページを開けない',
  );

  const articlePath = await firstArticle.getAttribute('href');
  expect(articlePath).toBeTruthy();

  for (const path of [articlePath!, `/en${articlePath}`]) {
    await page.goto(path);

    expect(await headPathname(page, 'link[rel="canonical"]', 'href'), path).toBe(path);
    expect(await headPathname(page, 'meta[property="og:url"]', 'content'), path).toBe(path);
  }
});

test('serves security headers on HTML responses', async ({ request }) => {
  const response = await request.get('/');

  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  expect(response.headers()['x-frame-options']).toBe('DENY');
  expect(response.headers()['content-security-policy-report-only']).toContain("default-src 'self'");
});
