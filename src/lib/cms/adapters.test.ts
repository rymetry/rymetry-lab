import { describe, expect, test } from 'bun:test';
import { GaugeIcon, InfinityIcon, MonitorIcon } from 'lucide-react';

import { adaptArticle, adaptTag } from './adapters';
import type { CMSArticle, CMSTag } from './types';

const cmsTag = {
  id: 'tag_frontend',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  publishedAt: '2026-01-01T00:00:00.000Z',
  revisedAt: '2026-01-01T00:00:00.000Z',
  name: 'React',
  category: ['frontend'],
} satisfies CMSTag;

describe('adaptTag', () => {
  test('maps a CMS tag into the app tag shape', () => {
    expect(adaptTag(cmsTag)).toEqual({
      label: 'React',
      category: 'frontend',
      icon: MonitorIcon,
    });
  });

  test('rejects a tag category that is not supported by the app', () => {
    expect(() =>
      adaptTag({
        ...cmsTag,
        id: 'tag_unknown',
        category: ['unknown'],
      }),
    ).toThrow('Unsupported microCMS tag category "unknown" for tag "React"');
  });

  test('requires the planned category field on CMS tags', () => {
    expect(() =>
      adaptTag({
        ...cmsTag,
        category: [],
      }),
    ).toThrow('microCMS tag "React" is missing category');
  });

  test('rejects multiple categories because the app tag model expects one category', () => {
    expect(() =>
      adaptTag({
        ...cmsTag,
        category: ['frontend', 'tools'],
      }),
    ).toThrow('microCMS tag "React" must have exactly one category');
  });
});

describe('adaptArticle', () => {
  test('maps CMS article fields into the app article detail shape', () => {
    const article = adaptArticle({
      id: 'article_1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-04-02T00:00:00.000Z',
      publishedAt: '2026-04-01T00:00:00.000Z',
      revisedAt: '2026-04-02T00:00:00.000Z',
      slug: 'dora-metrics',
      title: 'DORA メトリクスを導入する',
      excerpt: '開発チームの健全性を可視化する方法。',
      content: '<p>DORA metrics improve delivery.</p>',
      ogpImage: {
        url: 'https://images.microcms-assets.io/assets/test/dora.png',
        width: 1200,
        height: 630,
      },
      tags: [
        { ...cmsTag, id: 'tag_performance', name: 'Metrics', category: ['performance'] },
        { ...cmsTag, id: 'tag_devops', name: 'DevOps', category: ['devops'] },
      ],
    } satisfies CMSArticle);

    expect(article).toMatchObject({
      slug: 'dora-metrics',
      title: 'DORA メトリクスを導入する',
      description: '開発チームの健全性を可視化する方法。',
      excerpt: '開発チームの健全性を可視化する方法。',
      content: '<p>DORA metrics improve delivery.</p>',
      publishedAt: '2026-04-01',
      updatedAt: '2026-04-02',
      readingTime: '1 min',
      thumbnailIcon: GaugeIcon,
      thumbnailVariant: 'v1',
      ogpImage: {
        url: 'https://images.microcms-assets.io/assets/test/dora.png',
        width: 1200,
        height: 630,
      },
      tags: [
        { label: 'Metrics', category: 'performance', icon: GaugeIcon },
        { label: 'DevOps', category: 'devops', icon: InfinityIcon },
      ],
    });
  });

  test('maps CMS article rich content body into the app article detail content', () => {
    const article = adaptArticle({
      id: 'article_rich_content',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-04-02T00:00:00.000Z',
      publishedAt: '2026-04-01T00:00:00.000Z',
      revisedAt: '2026-04-02T00:00:00.000Z',
      slug: 'rich-content',
      title: 'Rich content',
      excerpt: 'CMS rich content body.',
      content: {
        fieldId: 'richEditor',
        showToc: true,
        body: '<p>Rich body</p>',
      },
      ogpImage: {
        url: 'https://images.microcms-assets.io/assets/test/rich.png',
        width: 1200,
        height: 630,
      },
      tags: [cmsTag],
    } satisfies CMSArticle);

    expect(article.content).toBe('<p>Rich body</p>');
    expect(article.readingTime).toBe('1 min');
  });

  test('maps CMS rich content related articles when requested', () => {
    const article = adaptArticle(
      {
        id: 'article_with_related',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-04-02T00:00:00.000Z',
        publishedAt: '2026-04-01T00:00:00.000Z',
        revisedAt: '2026-04-02T00:00:00.000Z',
        slug: 'article-with-related',
        title: 'Article with related',
        excerpt: 'CMS rich content body.',
        content: {
          fieldId: 'richEditor',
          showToc: true,
          body: '<p>Rich body</p>',
          relatedArticles: [
            {
              id: 'related_article',
              createdAt: '2026-01-01T00:00:00.000Z',
              updatedAt: '2026-03-02T00:00:00.000Z',
              publishedAt: '2026-03-01T00:00:00.000Z',
              revisedAt: '2026-03-02T00:00:00.000Z',
              slug: 'related-article',
              title: 'Related article',
              excerpt: 'Related CMS article.',
              content: '<p>Related body</p>',
              ogpImage: {
                url: 'https://images.microcms-assets.io/assets/test/related.png',
                width: 1200,
                height: 630,
              },
              tags: [cmsTag],
            },
          ],
        },
        ogpImage: {
          url: 'https://images.microcms-assets.io/assets/test/rich.png',
          width: 1200,
          height: 630,
        },
        tags: [cmsTag],
      } satisfies CMSArticle,
      { includeRelatedArticles: true },
    );

    expect(article.relatedArticleSlugs).toEqual(['related-article']);
  });

  test('maps related article slugs without requiring nested related article tags to be expanded', () => {
    const article = adaptArticle(
      {
        id: 'article_with_partial_related',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-04-02T00:00:00.000Z',
        publishedAt: '2026-04-01T00:00:00.000Z',
        revisedAt: '2026-04-02T00:00:00.000Z',
        slug: 'article-with-partial-related',
        title: 'Article with partial related',
        excerpt: 'CMS rich content body.',
        content: {
          fieldId: 'richEditor',
          body: '<p>Rich body</p>',
          relatedArticles: [
            {
              id: 'related_article',
              createdAt: '2026-01-01T00:00:00.000Z',
              updatedAt: '2026-03-02T00:00:00.000Z',
              publishedAt: '2026-03-01T00:00:00.000Z',
              revisedAt: '2026-03-02T00:00:00.000Z',
              slug: 'related-article',
              title: 'Related article',
              excerpt: 'Related CMS article.',
              content: '<p>Related body</p>',
              ogpImage: {
                url: 'https://images.microcms-assets.io/assets/test/related.png',
                width: 1200,
                height: 630,
              },
              tags: [
                {
                  id: '2c6a4z6i5m',
                  createdAt: '2026-01-01T00:00:00.000Z',
                  updatedAt: '2026-01-01T00:00:00.000Z',
                  publishedAt: '2026-01-01T00:00:00.000Z',
                  revisedAt: '2026-01-01T00:00:00.000Z',
                } as CMSTag,
              ],
            },
          ],
        },
        ogpImage: {
          url: 'https://images.microcms-assets.io/assets/test/rich.png',
          width: 1200,
          height: 630,
        },
        tags: [cmsTag],
      } satisfies CMSArticle,
      { includeRelatedArticles: true },
    );

    expect(article.relatedArticleSlugs).toEqual(['related-article']);
  });
});
