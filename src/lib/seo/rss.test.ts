import { describe, expect, test } from 'bun:test';

import { buildRssFeed } from './rss';

describe('buildRssFeed', () => {
  test('builds escaped RSS 2.0 XML for articles', () => {
    const xml = buildRssFeed({
      siteUrl: 'https://rymlab.dev',
      articles: [
        {
          slug: 'safe-rss',
          title: 'Safe <RSS>',
          description: 'Escapes & keeps XML valid.',
          publishedAt: '2026-04-01',
          updatedAt: '2026-04-02',
        },
      ],
    });

    expect(xml).toStartWith('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('<title>Safe &lt;RSS&gt;</title>');
    expect(xml).toContain('<description>Escapes &amp; keeps XML valid.</description>');
    expect(xml).toContain('<link>https://rymlab.dev/articles/safe-rss</link>');
    expect(xml).toContain('<guid isPermaLink="true">https://rymlab.dev/articles/safe-rss</guid>');
  });
});
