import type { ArticleImage } from '@/types/article';
import type { Metadata } from 'next';

import type { SeoLocale } from './locale-url';

import {
  buildAbsoluteUrl,
  buildLanguageAlternates as buildAllLanguageAlternates,
  buildLocalizedUrl,
} from './locale-url';

const DEFAULT_SITE_NAME = 'Rymlab';
const DEFAULT_SITE_URL = 'https://rymlab.dev';
const DEFAULT_OG_IMAGE = '/ogp.png';
const SEO_DESCRIPTION_LIMIT = 160;

interface BaseMetadataInput {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly siteUrl?: string;
  readonly locale?: SeoLocale;
}

interface ArticleMetadataInput extends BaseMetadataInput {
  readonly publishedAt: string;
  readonly updatedAt?: string;
  readonly image: ArticleImage & {
    readonly alt?: string;
  };
  readonly tags?: readonly string[];
}

export function truncateForSEO(value: string, limit = SEO_DESCRIPTION_LIMIT): string {
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (normalized.length <= limit) return normalized;

  return `${normalized.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
}

export function createPageMetadata(input: BaseMetadataInput): Metadata {
  const siteUrl = normalizeSiteUrl(input.siteUrl);
  const canonical = buildCanonicalUrl(input.path, siteUrl, input.locale);
  const description = truncateForSEO(input.description);
  const title = formatTitle(input.title);
  const imageUrl = buildAbsoluteUrl(DEFAULT_OG_IMAGE, siteUrl);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(input.path, siteUrl, input.locale),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: DEFAULT_SITE_NAME,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function createArticleMetadata(input: ArticleMetadataInput): Metadata {
  const siteUrl = normalizeSiteUrl(input.siteUrl);
  const canonical = buildCanonicalUrl(input.path, siteUrl, input.locale);
  const description = truncateForSEO(input.description);
  const title = formatTitle(input.title);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(input.path, siteUrl, input.locale),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: DEFAULT_SITE_NAME,
      type: 'article',
      publishedTime: input.publishedAt,
      modifiedTime: input.updatedAt,
      tags: input.tags ? [...input.tags] : undefined,
      images: [
        {
          url: input.image.url,
          width: input.image.width,
          height: input.image.height,
          alt: input.image.alt ?? input.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [input.image.url],
    },
  };
}

export function getSiteUrl(): string {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL);
}

function normalizeSiteUrl(value: string | undefined): string {
  return (value ?? DEFAULT_SITE_URL).replace(/\/+$/, '');
}

/**
 * 呼び出し側はロケール非依存のパス (`/about`) と `locale` を別々に渡すので、canonical は
 * ここでロケール化する。ロケール化しないと `/en` 配下のページが日本語版 URL を canonical に
 * 宣言し、英語ツリーが「日本語ページの重複」として扱われる (Issue #114)。
 *
 * `locale` 未指定の呼び出し (root layout の既定値) はロケールを知らないため素通しする。
 */
function buildCanonicalUrl(path: string, siteUrl: string, locale: SeoLocale | undefined): string {
  if (!locale) return buildAbsoluteUrl(path, siteUrl);

  return buildLocalizedUrl(path, siteUrl, locale);
}

/** ロケールが分からない呼び出しでは hreflang ごと出さない */
function buildLanguageAlternates(path: string, siteUrl: string, locale: SeoLocale | undefined) {
  if (!locale) return undefined;

  return buildAllLanguageAlternates(path, siteUrl);
}

function formatTitle(title: string): string {
  return title === DEFAULT_SITE_NAME ? DEFAULT_SITE_NAME : `${title} | ${DEFAULT_SITE_NAME}`;
}
