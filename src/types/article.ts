import type { LucideIcon } from 'lucide-react';
import type { Tag } from './tag';

export interface Article {
  readonly slug: string;
  readonly title: string;
  readonly description?: string;
  readonly publishedAt: string;
  readonly updatedAt?: string;
  readonly readingTime: string;
  readonly thumbnailIcon: LucideIcon;
  readonly thumbnailVariant?: 'v1' | 'v2' | 'v3';
  readonly tags: readonly Tag[];
}
