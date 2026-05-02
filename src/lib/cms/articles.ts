import 'server-only';

import { cacheLife } from 'next/cache';

import type { ArticleDetail } from '@/types/article';
import type { Tag } from '@/types/tag';

import { adaptArticle, adaptArticles, adaptTag } from './adapters';
import { getMicroCMSClient, getMicroCMSEndpoints, toMicroCMSFetchError } from './microcms';
import type { CMSArticle, CMSTag } from './types';

const CMS_CACHE_LIFE = {
  stale: 300,
  revalidate: 300,
  expire: 3600,
} as const;

type CMSArticleContent = Omit<CMSArticle, 'id' | 'createdAt' | 'updatedAt' | 'revisedAt'>;
type CMSTagContent = Omit<CMSTag, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'revisedAt'>;

export async function getArticles(): Promise<readonly ArticleDetail[]> {
  'use cache';
  cacheLife(CMS_CACHE_LIFE);

  const endpoint = getMicroCMSEndpoints().articles;

  try {
    const articles = await getMicroCMSClient().getAllContents<CMSArticleContent>({
      endpoint,
      queries: {
        depth: 1,
        orders: '-publishedAt',
      },
    });

    return adaptArticles(articles as readonly CMSArticle[]);
  } catch (error) {
    throw toMicroCMSFetchError(endpoint, 'fetch articles', error);
  }
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  'use cache';
  cacheLife(CMS_CACHE_LIFE);

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

    return adaptArticle(response.contents[0]! as CMSArticle);
  } catch (error) {
    throw toMicroCMSFetchError(endpoint, `fetch article "${slug}"`, error);
  }
}

export async function getTags(): Promise<readonly Tag[]> {
  'use cache';
  cacheLife(CMS_CACHE_LIFE);

  const endpoint = getMicroCMSEndpoints().tags;

  try {
    const tags = await getMicroCMSClient().getAllContents<CMSTagContent>({
      endpoint,
      queries: {
        orders: 'name',
      },
    });

    return tags.map((tag) => adaptTag(tag as CMSTag));
  } catch (error) {
    throw toMicroCMSFetchError(endpoint, 'fetch tags', error);
  }
}
