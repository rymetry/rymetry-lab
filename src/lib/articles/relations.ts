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
    previousArticle:
      currentIndex >= 0 && currentIndex < articles.length - 1 ? articles[currentIndex + 1]! : null,
    nextArticle: currentIndex > 0 ? articles[currentIndex - 1]! : null,
  };
}

function getRelatedArticles(
  currentArticle: ArticleDetail,
  articles: readonly ArticleDetail[],
  limit: number,
) {
  if (limit <= 0) return [];
  if (!currentArticle.relatedArticleSlugs?.length) return [];

  const articlesBySlug = new Map(articles.map((article) => [article.slug, article]));

  return currentArticle.relatedArticleSlugs
    .flatMap((slug) => {
      if (slug === currentArticle.slug) return [];

      const article = articlesBySlug.get(slug);

      return article ? [article] : [];
    })
    .slice(0, limit)
    .map((article) => article);
}
