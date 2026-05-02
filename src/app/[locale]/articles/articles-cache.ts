import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { adaptArticles, adaptTag, getMicroCMSClient, getMicroCMSEndpoints } from '@/lib/cms';
import { isMicroCMSConfigured, toMicroCMSFetchError } from '@/lib/cms/microcms';
import type { CMSArticle, CMSTag } from '@/lib/cms/types';

const ARTICLES_PAGE_CACHE_LIFE = {
  stale: 300,
  revalidate: 300,
  expire: 3600,
} as const;

export async function getArticlesPageContent() {
  const { articles, tags } = await getCachedArticlesPageContent();

  return {
    articles: adaptArticles(articles),
    tags: tags.map(adaptTag),
  };
}

type CMSArticleContent = Omit<CMSArticle, 'id' | 'createdAt' | 'updatedAt' | 'revisedAt'>;
type CMSTagContent = Omit<CMSTag, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'revisedAt'>;

async function getCachedArticlesPageContent() {
  'use cache';
  cacheLife(ARTICLES_PAGE_CACHE_LIFE);
  cacheTag('articles', 'tags');

  if (!isMicroCMSConfigured()) {
    return {
      articles: [],
      tags: [],
    };
  }

  const endpoints = getMicroCMSEndpoints();

  try {
    const [articles, tags] = await Promise.all([
      getMicroCMSClient().getAllContents<CMSArticleContent>({
        endpoint: endpoints.articles,
        queries: {
          depth: 1,
          orders: '-publishedAt',
        },
      }),
      getMicroCMSClient().getAllContents<CMSTagContent>({
        endpoint: endpoints.tags,
        queries: {
          orders: 'name',
        },
      }),
    ]);

    return {
      articles: articles as readonly CMSArticle[],
      tags: tags as readonly CMSTag[],
    };
  } catch (error) {
    throw toMicroCMSFetchError(endpoints.articles, 'fetch article index content', error);
  }
}
