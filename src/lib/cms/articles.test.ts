import { beforeEach, describe, expect, mock, test } from 'bun:test';

import type { CMSArticle } from './types';

const getList = mock(async (): Promise<{ contents: CMSArticle[] }> => ({ contents: [] }));

mock.module('server-only', () => ({}));
mock.module('next/cache', () => ({
  cacheLife: () => undefined,
  cacheTag: () => undefined,
}));
mock.module('lucide-react', () => {
  const Icon = () => null;

  return {
    CodeIcon: Icon,
    FlaskConicalIcon: Icon,
    GaugeIcon: Icon,
    GitBranchIcon: Icon,
    InfinityIcon: Icon,
    MonitorIcon: Icon,
    RocketIcon: Icon,
    ServerIcon: Icon,
    ShieldIcon: Icon,
    SparklesIcon: Icon,
    WrenchIcon: Icon,
  };
});

mock.module('./microcms', () => ({
  getMicroCMSClient: () => ({ getList }),
  getMicroCMSEndpoints: () => ({ articles: 'articles', tags: 'tags' }),
  isMicroCMSConfigured: () => true,
  toMicroCMSFetchError: (_endpoint: string, _action: string, error: unknown) => error,
}));

const { getArticleBySlug } = await import('./articles');

const cmsArticle = {
  id: 'article_1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-04-02T00:00:00.000Z',
  publishedAt: '2026-04-01T00:00:00.000Z',
  revisedAt: '2026-04-02T00:00:00.000Z',
  slug: 'valid-slug-123',
  title: 'Valid slug',
  excerpt: 'Valid slug excerpt.',
  content: '<p>Valid slug body.</p>',
  ogpImage: {
    url: 'https://images.microcms-assets.io/assets/test/valid.png',
    width: 1200,
    height: 630,
  },
  tags: [],
} satisfies CMSArticle;

describe('getArticleBySlug', () => {
  beforeEach(() => {
    getList.mockClear();
  });

  test('uses the validated slug when building the microCMS filter', async () => {
    getList.mockResolvedValueOnce({ contents: [cmsArticle] });

    const article = await getArticleBySlug('valid-slug-123');

    expect(article?.slug).toBe('valid-slug-123');
    expect(getList).toHaveBeenCalledWith({
      endpoint: 'articles',
      queries: {
        depth: 1,
        filters: 'slug[equals]valid-slug-123',
        limit: 2,
      },
    });
  });

  test.each(['', 'Invalid-Slug', 'valid/slug', '-valid-slug', 'valid-slug-', 'valid--slug'])(
    'rejects invalid slug "%s" before building a microCMS filter',
    async (slug) => {
      await expect(getArticleBySlug(slug)).resolves.toBeNull();
      expect(getList).not.toHaveBeenCalled();
    },
  );
});
