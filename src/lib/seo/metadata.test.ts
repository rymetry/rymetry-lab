import { describe, expect, test } from 'bun:test';

import { createArticleMetadata, createPageMetadata, truncateForSEO } from './metadata';

const SITE_URL = 'https://rymlab.dev';

describe('truncateForSEO', () => {
  test('keeps short descriptions unchanged', () => {
    expect(truncateForSEO('Short description')).toBe('Short description');
  });

  test('trims long descriptions to the SEO limit with an ellipsis', () => {
    const text = 'a'.repeat(200);

    expect(truncateForSEO(text)).toBe(`${'a'.repeat(159)}…`);
  });
});

describe('createPageMetadata', () => {
  test('builds canonical, Open Graph, and Twitter metadata for a static page', () => {
    const metadata = createPageMetadata({
      title: 'Articles',
      description: 'Developer productivity notes.',
      path: '/articles',
      siteUrl: SITE_URL,
    });

    expect(metadata.title).toBe('Articles | Rymlab');
    expect(metadata.description).toBe('Developer productivity notes.');
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/articles`);
    expect(metadata.openGraph?.url).toBe(`${SITE_URL}/articles`);
    expect(metadata.openGraph?.siteName).toBe('Rymlab');
    expect((metadata.twitter as { card?: string } | undefined)?.card).toBe('summary_large_image');
  });

  test('builds hreflang alternates for localized pages', () => {
    const metadata = createPageMetadata({
      title: 'Articles',
      description: 'Developer productivity notes.',
      path: '/articles',
      siteUrl: SITE_URL,
      locale: 'ja',
    });

    expect(metadata.alternates?.languages).toEqual({
      ja: `${SITE_URL}/articles`,
      en: `${SITE_URL}/en/articles`,
      'x-default': `${SITE_URL}/articles`,
    });
  });
});

describe('createArticleMetadata', () => {
  test('builds article metadata with article-specific Open Graph fields', () => {
    const metadata = createArticleMetadata({
      title: 'Article title',
      description: 'Article description',
      path: '/articles/article-title',
      siteUrl: SITE_URL,
      publishedAt: '2026-04-01',
      updatedAt: '2026-04-02',
      image: {
        url: 'https://images.microcms-assets.io/assets/test/image.png',
        width: 1200,
        height: 630,
        alt: 'Article title',
      },
      tags: ['Security', 'Testing'],
    });

    expect(metadata.title).toBe('Article title | Rymlab');
    const openGraph = metadata.openGraph as
      | {
          readonly type?: string;
          readonly publishedTime?: string;
          readonly modifiedTime?: string;
          readonly tags?: readonly string[];
          readonly images?: unknown;
        }
      | undefined;

    expect(openGraph?.type).toBe('article');
    expect(openGraph?.publishedTime).toBe('2026-04-01');
    expect(openGraph?.modifiedTime).toBe('2026-04-02');
    expect(openGraph?.tags).toEqual(['Security', 'Testing']);
    expect(openGraph?.images).toEqual([
      {
        url: 'https://images.microcms-assets.io/assets/test/image.png',
        width: 1200,
        height: 630,
        alt: 'Article title',
      },
    ]);
  });
});
