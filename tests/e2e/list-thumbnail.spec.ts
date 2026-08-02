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
 * この spec だけは実入稿画像を必要とする。CI の E2E ジョブは microCMS の資格情報を
 * 持たず `/articles` が空状態で描画されるため、記事が 1 件も無ければスキップする
 * (帯ごとのクロップ定義そのものは bun:test と Storybook browser test が担保する)。
 */
async function skipWithoutPublishedArticles(page: import('@playwright/test').Page): Promise<void> {
  const cards = page.locator('a[href^="/articles/"]');
  await page.waitForLoadState('domcontentloaded');
  test.skip((await cards.count()) === 0, 'microCMS の記事が無いため実画像で検証できない');
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
  await skipWithoutPublishedArticles(page);

  for (const band of BANDS) {
    await page.setViewportSize({ width: band.width, height: 900 });
    await page.goto('/articles?view=list');
    const thumbnail = page.locator('a[href^="/articles/"] img').first();

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
  await skipWithoutPublishedArticles(page);

  const firstArticle = await page
    .locator('a[href^="/articles/"]')
    .first()
    .getAttribute('href');
  expect(firstArticle).toBeTruthy();

  await page.goto(firstArticle!);
  const navThumbnail = page.locator('nav a[href^="/articles/"] img').first();

  expect(await requestedCrop(navThumbnail)).toBe('w=480&h=320');
});
