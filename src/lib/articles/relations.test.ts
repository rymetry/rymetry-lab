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
  test('picks related articles by shared tags and keeps the current article out', () => {
    const current = article('current', '2026-04-04', ['React', 'Testing']);
    const articles = [
      article('unrelated', '2026-04-05', ['Security']),
      current,
      article('most-related', '2026-04-03', ['React', 'Testing']),
      article('newer-shared-tag', '2026-04-02', ['React']),
      article('older-shared-tag', '2026-04-01', ['Testing']),
    ];

    const relations = getArticleRelations(current, articles, { relatedLimit: 3 });

    expect(relations.relatedArticles.map((item) => item.slug)).toEqual([
      'most-related',
      'newer-shared-tag',
      'older-shared-tag',
    ]);
  });

  test('returns neighboring articles from the current list order', () => {
    const newest = article('newest', '2026-04-05', ['React']);
    const current = article('current', '2026-04-04', ['React']);
    const oldest = article('oldest', '2026-04-03', ['React']);

    const relations = getArticleRelations(current, [newest, current, oldest]);

    expect(relations.previousArticle?.slug).toBe('newest');
    expect(relations.nextArticle?.slug).toBe('oldest');
  });
});
