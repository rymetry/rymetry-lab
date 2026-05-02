import type { MetadataRoute } from 'next';

import { getArticles } from '@/lib/cms';
import { getSiteUrl } from '@/lib/seo/metadata';

const STATIC_ROUTES = ['', '/articles', '/projects', '/about'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const articles = await getArticles();

  return [
    ...STATIC_ROUTES.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: path === '' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? 1 : 0.8,
    })),
    ...articles.map((article) => ({
      url: `${siteUrl}/articles/${article.slug}`,
      lastModified: new Date(article.updatedAt ?? article.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
