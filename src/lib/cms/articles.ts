import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import type { ArticleDetail } from '@/types/article';
import type { Tag } from '@/types/tag';

import { adaptArticle, adaptArticles, adaptTag } from './adapters';
import {
  getMicroCMSClient,
  getMicroCMSEndpoints,
  isMicroCMSConfigured,
  toMicroCMSFetchError,
} from './microcms';
import type { CMSArticle, CMSTag } from './types';

const CMS_CACHE_LIFE = {
  stale: 300,
  revalidate: 300,
  expire: 3600,
} as const;

type CMSArticleContent = Omit<CMSArticle, 'id' | 'createdAt' | 'updatedAt' | 'revisedAt'>;
type CMSTagContent = Omit<CMSTag, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'revisedAt'>;

export async function getArticles(): Promise<readonly ArticleDetail[]> {
  const articles = await getCachedArticles();

  return adaptArticles(articles);
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const article = await getCachedArticleBySlug(slug);

  return article ? adaptArticle(article) : null;
}

export async function getTags(): Promise<readonly Tag[]> {
  const tags = await getCachedTags();

  return tags.map((tag) => adaptTag(tag));
}

async function getCachedArticles(): Promise<readonly CMSArticle[]> {
  'use cache';
  cacheLife(CMS_CACHE_LIFE);
  cacheTag('articles');

  if (!isMicroCMSConfigured()) return [];

  const endpoint = getMicroCMSEndpoints().articles;

  try {
    const articles = await getMicroCMSClient().getAllContents<CMSArticleContent>({
      endpoint,
      queries: {
        depth: 1,
        orders: '-publishedAt',
      },
    });

    return articles as readonly CMSArticle[];
  } catch (error) {
    throw toMicroCMSFetchError(endpoint, 'fetch articles', error);
  }
}

async function getCachedArticleBySlug(slug: string): Promise<CMSArticle | null> {
  'use cache';
  cacheLife(CMS_CACHE_LIFE);
  cacheTag('articles', `article:${slug}`);

  if (!isMicroCMSConfigured()) return null;

  const endpoint = getMicroCMSEndpoints().articles;

  try {
    const response = await getMicroCMSClient().getList<CMSArticleContent>({
      endpoint,
      queries: {
        depth: 1,
        filters: `slug[equals]${slug}`,
        limit: 2,
      },
    });

    if (response.contents.length === 0) return null;
    if (response.contents.length > 1) {
      throw new Error(`microCMS returned duplicate articles for slug "${slug}"`);
    }

    return response.contents[0]! as CMSArticle;
  } catch (error) {
    throw toMicroCMSFetchError(endpoint, `fetch article "${slug}"`, error);
  }
}

async function getCachedTags(): Promise<readonly CMSTag[]> {
  'use cache';
  cacheLife(CMS_CACHE_LIFE);
  cacheTag('tags');

  if (!isMicroCMSConfigured()) return [];

  const endpoint = getMicroCMSEndpoints().tags;

  try {
    const tags = await getMicroCMSClient().getAllContents<CMSTagContent>({
      endpoint,
      queries: {
        orders: 'name',
      },
    });

    return tags as readonly CMSTag[];
  } catch (error) {
    throw toMicroCMSFetchError(endpoint, 'fetch tags', error);
  }
}
