import { describe, expect, test } from 'bun:test';

import { createArticleJsonLd, createBlogJsonLd, createBreadcrumbJsonLd } from './json-ld';

describe('json-ld helpers', () => {
  test('builds Blog, BreadcrumbList, and Article schema objects', () => {
    expect(createBlogJsonLd({ siteUrl: 'https://rymlab.dev' })).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      url: 'https://rymlab.dev/articles',
    });

    expect(
      createBreadcrumbJsonLd({
        siteUrl: 'https://rymlab.dev',
        items: [
          { name: 'Home', path: '/' },
          { name: 'Articles', path: '/articles' },
        ],
      }),
    ).toMatchObject({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rymlab.dev/' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Articles',
          item: 'https://rymlab.dev/articles',
        },
      ],
    });

    expect(
      createArticleJsonLd({
        siteUrl: 'https://rymlab.dev',
        path: '/articles/test',
        title: 'Test Article',
        description: 'Description',
        publishedAt: '2026-04-01',
        updatedAt: '2026-04-02',
        imageUrl: 'https://images.microcms-assets.io/assets/test/image.png',
        tags: ['Testing'],
      }),
    ).toMatchObject({
      '@type': 'Article',
      headline: 'Test Article',
      url: 'https://rymlab.dev/articles/test',
      keywords: ['Testing'],
    });
  });
});
