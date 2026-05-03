import type { Article } from '@/types/article';

import { getSiteUrl } from './metadata';

interface BuildRssFeedInput {
  readonly siteUrl?: string;
  readonly articles: readonly Pick<
    Article,
    'slug' | 'title' | 'description' | 'publishedAt' | 'updatedAt'
  >[];
}

export function buildRssFeed({ siteUrl = getSiteUrl(), articles }: BuildRssFeedInput): string {
  const normalizedSiteUrl = siteUrl.replace(/\/+$/, '');
  const items = articles.map((article) => buildRssItem(article, normalizedSiteUrl)).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Rymlab</title>
    <description>Portfolio &amp; Blog by Rym — Productivity Engineer</description>
    <link>${escapeXml(normalizedSiteUrl)}</link>
    <atom:link href="${escapeXml(`${normalizedSiteUrl}/feed.xml`)}" rel="self" type="application/rss+xml" />
    <language>ja</language>
${items}
  </channel>
</rss>`;
}

function buildRssItem(
  article: Pick<Article, 'slug' | 'title' | 'description' | 'publishedAt' | 'updatedAt'>,
  siteUrl: string,
): string {
  const url = `${siteUrl}/articles/${article.slug}`;
  const publishedAt = new Date(article.publishedAt).toUTCString();
  const updatedAt = article.updatedAt ? new Date(article.updatedAt).toUTCString() : publishedAt;

  return `    <item>
      <title>${escapeXml(article.title)}</title>
      <description>${escapeXml(article.description ?? '')}</description>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${escapeXml(publishedAt)}</pubDate>
      <lastBuildDate>${escapeXml(updatedAt)}</lastBuildDate>
    </item>`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
