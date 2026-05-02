import {
  CodeIcon,
  FlaskConicalIcon,
  GaugeIcon,
  GitBranchIcon,
  InfinityIcon,
  MonitorIcon,
  RocketIcon,
  ServerIcon,
  ShieldIcon,
  SparklesIcon,
  WrenchIcon,
  type LucideIcon,
} from 'lucide-react';

import type { ArticleDetail } from '@/types/article';
import type { Tag, TagCategory } from '@/types/tag';
import { TAG_CATEGORY_COLORS } from '@/types/tag';

import type { CMSArticle, CMSTag } from './types';

const TAG_CATEGORY_ICONS = {
  frontend: MonitorIcon,
  backend: ServerIcon,
  infra: GitBranchIcon,
  devops: InfinityIcon,
  languages: CodeIcon,
  tools: WrenchIcon,
  security: ShieldIcon,
  performance: GaugeIcon,
  testing: FlaskConicalIcon,
  release: RocketIcon,
} as const satisfies Record<TagCategory, LucideIcon>;

const TAG_NAME_ICONS: Partial<Record<string, LucideIcon>> = {
  devex: SparklesIcon,
};

const THUMBNAIL_VARIANTS = ['v1', 'v2', 'v3'] as const;
const READING_CHARS_PER_MINUTE = 500;

interface AdaptArticleOptions {
  readonly index?: number;
}

export function adaptTag(tag: CMSTag): Tag {
  const label = requireNonEmpty(tag.name, `microCMS tag "${tag.id}" is missing name`);
  const category = requireTagCategory(tag.category, label);

  return {
    label,
    category,
    icon: TAG_NAME_ICONS[label.toLowerCase()] ?? TAG_CATEGORY_ICONS[category],
  };
}

export function adaptArticle(
  article: CMSArticle,
  options: AdaptArticleOptions = {},
): ArticleDetail {
  const tags = article.tags.map(adaptTag);
  const primaryTag = tags[0];
  const content = extractArticleContent(article);

  return {
    slug: requireNonEmpty(article.slug, `microCMS article "${article.id}" is missing slug`),
    title: requireNonEmpty(article.title, `microCMS article "${article.id}" is missing title`),
    description: requireNonEmpty(
      article.excerpt,
      `microCMS article "${article.id}" is missing excerpt`,
    ),
    excerpt: article.excerpt,
    content,
    ogpImage: {
      url: requireNonEmpty(
        article.ogpImage?.url,
        `microCMS article "${article.id}" is missing ogpImage.url`,
      ),
      width: article.ogpImage.width,
      height: article.ogpImage.height,
    },
    publishedAt: formatDate(article.publishedAt, article.id, 'publishedAt'),
    updatedAt: formatDate(article.revisedAt ?? article.updatedAt, article.id, 'updatedAt'),
    readingTime: calculateReadingTime(content),
    thumbnailIcon: primaryTag?.icon ?? SparklesIcon,
    thumbnailVariant: pickThumbnailVariant(options.index),
    tags,
  };
}

export function adaptArticles(articles: readonly CMSArticle[]): readonly ArticleDetail[] {
  return articles.map((article, index) => adaptArticle(article, { index }));
}

function requireTagCategory(
  category: TagCategory | string | readonly string[] | undefined,
  label: string,
): TagCategory {
  if (Array.isArray(category) && category.length > 1) {
    throw new Error(`microCMS tag "${label}" must have exactly one category`);
  }

  const normalized = Array.isArray(category) ? category[0] : category;

  if (!normalized) {
    throw new Error(`microCMS tag "${label}" is missing category`);
  }

  if (normalized in TAG_CATEGORY_COLORS) {
    return normalized as TagCategory;
  }

  throw new Error(`Unsupported microCMS tag category "${normalized}" for tag "${label}"`);
}

function requireNonEmpty(value: string | undefined, message: string): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(message);
  }

  return trimmed;
}

function extractArticleContent(article: CMSArticle): string {
  const content = article.content;

  if (typeof content === 'string') {
    return requireNonEmpty(content, `microCMS article "${article.id}" is missing content`);
  }

  return requireNonEmpty(content?.body, `microCMS article "${article.id}" is missing content.body`);
}

function formatDate(value: string, articleId: string, field: string): string {
  if (Number.isNaN(Date.parse(value))) {
    throw new Error(`microCMS article "${articleId}" has invalid ${field}`);
  }

  return value.slice(0, 10);
}

function calculateReadingTime(content: string): string {
  const text = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, '');
  const minutes = Math.max(1, Math.ceil(text.length / READING_CHARS_PER_MINUTE));

  return `${minutes} min`;
}

function pickThumbnailVariant(index: number | undefined): (typeof THUMBNAIL_VARIANTS)[number] {
  if (typeof index !== 'number') return 'v1';

  return THUMBNAIL_VARIANTS[index % THUMBNAIL_VARIANTS.length] ?? 'v1';
}
