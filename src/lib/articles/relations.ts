import type { ArticleDetail } from '@/types/article';

export interface ArticleRelations {
  readonly relatedArticles: readonly ArticleDetail[];
  readonly previousArticle: ArticleDetail | null;
  readonly nextArticle: ArticleDetail | null;
}

interface ArticleRelationsOptions {
  readonly relatedLimit?: number;
}

const DEFAULT_RELATED_LIMIT = 3;

export function getArticleRelations(
  currentArticle: ArticleDetail,
  articles: readonly ArticleDetail[],
  options: ArticleRelationsOptions = {},
): ArticleRelations {
  const relatedLimit = options.relatedLimit ?? DEFAULT_RELATED_LIMIT;
  const currentIndex = articles.findIndex((article) => article.slug === currentArticle.slug);

  return {
    relatedArticles: getRelatedArticles(currentArticle, articles, relatedLimit),
    previousArticle: currentIndex > 0 ? articles[currentIndex - 1]! : null,
    nextArticle:
      currentIndex >= 0 && currentIndex < articles.length - 1 ? articles[currentIndex + 1]! : null,
  };
}

function getRelatedArticles(
  currentArticle: ArticleDetail,
  articles: readonly ArticleDetail[],
  limit: number,
) {
  if (limit <= 0) return [];

  const currentTagLabels = new Set(
    currentArticle.tags.map((tag) => normalizeTagLabel(tag.label)).filter(Boolean),
  );

  return articles
    .flatMap((article) => {
      if (article.slug === currentArticle.slug) return [];

      const score = article.tags.reduce((total, tag) => {
        return currentTagLabels.has(normalizeTagLabel(tag.label)) ? total + 1 : total;
      }, 0);

      if (score === 0) return [];

      return [{ article, score }];
    })
    .toSorted((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.article.publishedAt.localeCompare(a.article.publishedAt);
    })
    .slice(0, limit)
    .map(({ article }) => article);
}

function normalizeTagLabel(value: string) {
  return value.trim().toLowerCase();
}
