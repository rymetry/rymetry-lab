import type { TagCategory } from '@/types/tag';

export interface CMSSystemFields {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly publishedAt?: string;
  readonly revisedAt?: string;
}

export interface CMSImage {
  readonly url: string;
  readonly width?: number;
  readonly height?: number;
}

export interface CMSTag extends CMSSystemFields {
  readonly name: string;
  readonly category?: TagCategory | string | readonly string[];
}

export interface CMSArticle extends CMSSystemFields {
  readonly slug: string;
  readonly title: string;
  readonly publishedAt: string;
  readonly content: string;
  readonly excerpt: string;
  readonly ogpImage: CMSImage;
  readonly tags: readonly CMSTag[];
}
