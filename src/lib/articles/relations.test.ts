import { describe, expect, test } from 'bun:test';
import { CodeIcon } from 'lucide-react';

import type { ArticleDetail } from '@/types/article';

import { getArticleRelations } from './relations';

function article(slug: string, publishedAt: string, tags: readonly string[]): ArticleDetail {
  return {
    slug,
    title: slug,
    description: `${slug} description`,
    excerpt: `${slug} excerpt`,
    content: '<p>body</p>',
    ogpImage: {
      url: `https://images.microcms-assets.io/assets/test/${slug}.png`,
      width: 1200,
      height: 630,
    },
    publishedAt,
    updatedAt: publishedAt,
    readingTime: '1 min',
    thumbnailIcon: CodeIcon,
    tags: tags.map((label) => ({
      label,
      category: 'frontend',
      icon: CodeIcon,
    })),
  };
}

describe('getArticleRelations', () => {
  test('uses the related articles registered on the current article', () => {
    const mostRelated = article('most-related', '2026-04-03', ['React', 'Testing']);
    const newerSharedTag = article('newer-shared-tag', '2026-04-02', ['React']);
    const current = {
      ...article('current', '2026-04-04', ['React', 'Testing']),
      relatedArticleSlugs: ['most-related', 'newer-shared-tag'],
    } satisfies ArticleDetail;
    const articles = [
      article('unrelated', '2026-04-05', ['Security']),
      current,
      mostRelated,
      newerSharedTag,
      article('older-shared-tag', '2026-04-01', ['Testing']),
    ];

    const relations = getArticleRelations(current, articles, { relatedLimit: 3 });

    expect(relations.relatedArticles.map((item) => item.slug)).toEqual([
      'most-related',
      'newer-shared-tag',
    ]);
  });

  test('does not synthesize related articles from shared tags when none are registered', () => {
    const current = article('current', '2026-04-04', ['React', 'Testing']);
    const articles = [
      article('newer-shared-tag', '2026-04-05', ['React']),
      current,
      article('older-shared-tag', '2026-04-03', ['Testing']),
    ];

    const relations = getArticleRelations(current, articles, { relatedLimit: 3 });

    expect(relations.relatedArticles).toEqual([]);
  });

  test('limits related articles registered on the current article', () => {
    const first = article('first-related', '2026-04-03', ['React']);
    const second = article('second-related', '2026-04-02', ['Testing']);
    const current = {
      ...article('current', '2026-04-04', ['React', 'Testing']),
      relatedArticleSlugs: ['first-related', 'second-related'],
    } satisfies ArticleDetail;

    const relations = getArticleRelations(current, [current, first, second], { relatedLimit: 1 });

    expect(relations.relatedArticles.map((item) => item.slug)).toEqual(['first-related']);
  });

  test('resolves related article slugs from the complete article list', () => {
    const second = article('second-related', '2026-04-02', ['Testing']);
    const first = article('first-related', '2026-04-03', ['React']);
    const current = {
      ...article('current', '2026-04-04', ['React', 'Testing']),
      relatedArticleSlugs: ['second-related', 'missing-related', 'current', 'first-related'],
    } satisfies ArticleDetail;

    const relations = getArticleRelations(current, [first, current, second]);

    expect(relations.relatedArticles.map((item) => item.slug)).toEqual([
      'second-related',
      'first-related',
    ]);
  });

  test('maps previous to the older article and next to the newer article', () => {
    const newest = article('newest', '2026-04-05', ['React']);
    const current = article('current', '2026-04-04', ['React']);
    const oldest = article('oldest', '2026-04-03', ['React']);

    const relations = getArticleRelations(current, [newest, current, oldest]);

    expect(relations.previousArticle?.slug).toBe('oldest');
    expect(relations.nextArticle?.slug).toBe('newest');
  });

  test('shows only previous article for the newest article', () => {
    const newest = article('newest', '2026-04-05', ['React']);
    const middle = article('middle', '2026-04-04', ['React']);
    const oldest = article('oldest', '2026-04-03', ['React']);

    const relations = getArticleRelations(newest, [newest, middle, oldest]);

    expect(relations.previousArticle?.slug).toBe('middle');
    expect(relations.nextArticle).toBeNull();
  });

  test('shows only next article for the oldest article', () => {
    const newest = article('newest', '2026-04-05', ['React']);
    const middle = article('middle', '2026-04-04', ['React']);
    const oldest = article('oldest', '2026-04-03', ['React']);

    const relations = getArticleRelations(oldest, [newest, middle, oldest]);

    expect(relations.previousArticle).toBeNull();
    expect(relations.nextArticle?.slug).toBe('middle');
  });
});
