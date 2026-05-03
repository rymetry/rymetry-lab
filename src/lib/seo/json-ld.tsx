import { getSiteUrl } from './metadata';

interface BlogJsonLdInput {
  readonly siteUrl?: string;
}

interface BreadcrumbJsonLdInput {
  readonly siteUrl?: string;
  readonly items: readonly {
    readonly name: string;
    readonly path: string;
  }[];
}

interface ArticleJsonLdInput {
  readonly siteUrl?: string;
  readonly path: string;
  readonly title: string;
  readonly description: string;
  readonly publishedAt: string;
  readonly updatedAt?: string;
  readonly imageUrl: string;
  readonly tags: readonly string[];
}

export function createBlogJsonLd({ siteUrl = getSiteUrl() }: BlogJsonLdInput = {}) {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Rymlab Articles',
    url: `${normalizedSiteUrl}/articles`,
    inLanguage: 'ja',
    publisher: createPublisher(normalizedSiteUrl),
  };
}

export function createBreadcrumbJsonLd({ siteUrl = getSiteUrl(), items }: BreadcrumbJsonLdInput) {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${normalizedSiteUrl}${normalizePath(item.path)}`,
    })),
  };
}

export function createArticleJsonLd({
  siteUrl = getSiteUrl(),
  path,
  title,
  description,
  publishedAt,
  updatedAt,
  imageUrl,
  tags,
}: ArticleJsonLdInput) {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
  const url = `${normalizedSiteUrl}${normalizePath(path)}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    image: imageUrl,
    datePublished: publishedAt,
    dateModified: updatedAt ?? publishedAt,
    author: {
      '@type': 'Person',
      name: 'Rym',
      url: normalizedSiteUrl,
    },
    publisher: createPublisher(normalizedSiteUrl),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: tags,
    inLanguage: 'ja',
  };
}

export function JsonLdScript({ data }: { readonly data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}

function createPublisher(siteUrl: string) {
  return {
    '@type': 'Organization',
    name: 'Rymlab',
    url: siteUrl,
  };
}

function normalizeSiteUrl(siteUrl: string): string {
  return siteUrl.replace(/\/+$/, '');
}

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}
