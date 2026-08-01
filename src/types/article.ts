import type { Tag } from './tag';

export interface ArticleImage {
  readonly url: string;
  readonly width?: number;
  readonly height?: number;
}

export interface Article {
  readonly slug: string;
  readonly title: string;
  readonly description?: string;
  readonly publishedAt: string;
  readonly updatedAt?: string;
  readonly readingTime: string;
  readonly tags: readonly Tag[];
}

export interface ArticleDetail extends Article {
  readonly excerpt: string;
  readonly content: string;
  readonly ogpImage: ArticleImage;
  readonly relatedArticleSlugs?: readonly string[];
}
