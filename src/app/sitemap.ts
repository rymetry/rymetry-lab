import type { MetadataRoute } from 'next';

import { getArticles } from '@/lib/cms';
import { LOCALES, buildLanguageAlternates, buildLocalizedUrl } from '@/lib/seo/locale-url';
import { getSiteUrl } from '@/lib/seo/metadata';

const STATIC_ROUTES = ['/', '/articles', '/projects', '/about'] as const;

/** ロケール非依存のパスと、そのパスに共通する更新頻度メタ */
interface SitemapRoute {
  readonly path: string;
  readonly lastModified: Date;
  readonly changeFrequency: 'weekly' | 'monthly';
  readonly priority: number;
}

/**
 * 各パスをロケールごとに 1 エントリへ展開する。canonical が `/en/about` を指す以上、
 * sitemap も英語ツリーを列挙しないと「canonical はあるが sitemap に無い」状態になる。
 * hreflang は自ロケールを含む全ロケール分を各エントリに付ける (Google の要求)。
 */
function expandToLocaleEntries(route: SitemapRoute, siteUrl: string): MetadataRoute.Sitemap {
  const { path, ...freshness } = route;
  const languages = buildLanguageAlternates(path, siteUrl);

  return LOCALES.map((locale) => ({
    ...freshness,
    url: buildLocalizedUrl(path, siteUrl, locale),
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const articles = await getArticles();

  const routes: readonly SitemapRoute[] = [
    ...STATIC_ROUTES.map((path) => ({
      path,
      lastModified: new Date(),
      changeFrequency: path === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '/' ? 1 : 0.8,
    })),
    ...articles.map((article) => ({
      path: `/articles/${article.slug}`,
      lastModified: new Date(article.updatedAt ?? article.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  return routes.flatMap((route) => expandToLocaleEntries(route, siteUrl));
}
