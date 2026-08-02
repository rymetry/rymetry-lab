import { beforeEach, describe, expect, mock, test } from 'bun:test';

const SITE_URL = 'https://rymlab.dev';

// bun test は .env.local を自動で読むため、サイト URL をテスト内で固定する
process.env.NEXT_PUBLIC_SITE_URL = SITE_URL;

type SitemapArticle = {
  readonly slug: string;
  readonly publishedAt: string;
  readonly updatedAt?: string;
};

let articles: readonly SitemapArticle[] = [];

/** 実モジュールは 'server-only' を import するため bun test では読み込めない */
mock.module('@/lib/cms', () => ({
  getArticles: () => Promise.resolve(articles),
}));

async function buildSitemap() {
  const { default: sitemap } = await import('./sitemap');

  return sitemap();
}

describe('sitemap', () => {
  beforeEach(() => {
    articles = [
      {
        slug: 'first-post',
        publishedAt: '2026-04-01T00:00:00.000Z',
        updatedAt: '2026-04-02T00:00:00.000Z',
      },
    ];
  });

  test('lists every static route in both locale trees', async () => {
    const urls = (await buildSitemap()).map((entry) => entry.url);

    for (const url of [
      `${SITE_URL}/`,
      `${SITE_URL}/articles`,
      `${SITE_URL}/projects`,
      `${SITE_URL}/about`,
      `${SITE_URL}/en`,
      `${SITE_URL}/en/articles`,
      `${SITE_URL}/en/projects`,
      `${SITE_URL}/en/about`,
    ]) {
      expect(urls).toContain(url);
    }
  });

  test('lists every article in both locale trees', async () => {
    const urls = (await buildSitemap()).map((entry) => entry.url);

    expect(urls).toContain(`${SITE_URL}/articles/first-post`);
    expect(urls).toContain(`${SITE_URL}/en/articles/first-post`);
  });

  test('annotates each entry with hreflang alternates for both locales', async () => {
    const entries = await buildSitemap();
    const about = entries.filter((entry) => entry.url.endsWith('/about'));

    expect(about).toHaveLength(2);
    for (const entry of about) {
      expect(entry.alternates?.languages).toEqual({
        ja: `${SITE_URL}/about`,
        en: `${SITE_URL}/en/about`,
        'x-default': `${SITE_URL}/about`,
      });
    }
  });

  test('emits no duplicate URLs', async () => {
    const urls = (await buildSitemap()).map((entry) => entry.url);

    expect(new Set(urls).size).toBe(urls.length);
  });

  test('keeps article freshness metadata on both locale entries', async () => {
    const entries = await buildSitemap();
    const articleEntries = entries.filter((entry) => entry.url.includes('/articles/'));

    expect(articleEntries).toHaveLength(2);
    for (const entry of articleEntries) {
      expect(entry.lastModified).toEqual(new Date('2026-04-02T00:00:00.000Z'));
    }
  });
});
