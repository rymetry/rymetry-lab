import { expect, test } from '@playwright/test';

/**
 * list サムネの Art Direction は `<source media>` の一致順で決まるため、SSR 文字列テストでは
 * 「どの帯でどのクロップが実際に選ばれるか」を保証できない。実ブラウザで境界幅ごとの
 * `currentSrc` を検証する (Issue #108)。
 */
const BANDS = [
  { width: 375, crop: 'w=240&h=400' },
  { width: 479, crop: 'w=240&h=400' },
  { width: 480, crop: 'w=300&h=360' },
  { width: 767, crop: 'w=300&h=360' },
  { width: 768, crop: 'w=660&h=360' },
  { width: 1280, crop: 'w=660&h=360' },
] as const;

/**
 * この spec だけは実入稿画像を必要とする。CI の E2E ジョブは microCMS の資格情報を持たず
 * `/articles` が空状態で描画されるほか、記事 1 件だけ (Prev/Next が出ない) や ogpImage 未設定
 * (ink フォールバックになり `<picture>` が出ない) も正当な構成なので、検証対象の `<picture>`
 * が無ければ理由付きでスキップする。帯ごとのクロップ定義そのものは bun:test と
 * Storybook browser test が担保する。
 */
async function skipWithoutArtDirectedThumbnail(
  scope: import('@playwright/test').Locator,
  reason: string,
): Promise<void> {
  await scope.page().waitForLoadState('domcontentloaded');
  test.skip((await scope.locator('picture source').count()) === 0, reason);
}

/** 実際に選ばれた画像から microCMS へ要求したクロップを取り出す (lazy 読み込み完了を待つ) */
async function requestedCrop(image: import('@playwright/test').Locator): Promise<string> {
  await image.scrollIntoViewIfNeeded();
  await expect
    .poll(() => image.evaluate((img) => (img as HTMLImageElement).currentSrc))
    .not.toBe('');

  const currentSrc = await image.evaluate((img) => (img as HTMLImageElement).currentSrc);
  const source = new URL(currentSrc).searchParams.get('url') ?? '';
  const params = new URL(source, 'http://localhost').searchParams;

  return `w=${params.get('w')}&h=${params.get('h')}`;
}

test('selects the crop matching each viewport band on the articles list', async ({ page }) => {
  // 6 帯ぶんナビゲートし、その都度 lazy 画像の読み込みを待つ。dev サーバーがコールドだと
  // 既定の 30s に収まらないことがある
  test.slow();
  await page.goto('/articles?view=list');
  await skipWithoutArtDirectedThumbnail(
    page.locator('main'),
    'microCMS 由来のサムネを持つ記事が無いため実画像で検証できない',
  );

  for (const band of BANDS) {
    await page.setViewportSize({ width: band.width, height: 900 });
    await page.goto('/articles?view=list');
    const thumbnail = page.locator('a[href^="/articles/"] picture img').first();

    expect(await requestedCrop(thumbnail), `viewport ${band.width}px`).toBe(band.crop);
  }
});

/**
 * Prev/Next は `md:grid-cols-2` で圧縮され、>=768px でも表示ボックス比が本文量で 0.92-1.83 と
 * 揺れる。広帯に 1.83 を要求すると実効密度が現行を下回るため、この surface だけ 1.5 を保つ。
 */
test('keeps the narrower wide-band crop on the prev/next navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/articles?view=list');
  await skipWithoutArtDirectedThumbnail(
    page.locator('main'),
    'microCMS 由来のサムネを持つ記事が無いため実画像で検証できない',
  );

  const firstArticle = await page.locator('a[href^="/articles/"]').first().getAttribute('href');
  expect(firstArticle).toBeTruthy();

  await page.goto(firstArticle!);
  // 記事が 1 件だけなら Prev/Next は描画されない
  await skipWithoutArtDirectedThumbnail(
    page.locator('nav:has(a[href^="/articles/"])'),
    'Prev/Next にサムネ付きのカードが無いため検証できない',
  );

  const navThumbnail = page.locator('nav a[href^="/articles/"] picture img').first();

  expect(await requestedCrop(navThumbnail)).toBe('w=480&h=320');
});
