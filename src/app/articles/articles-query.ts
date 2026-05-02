export type ArticlesView = 'grid' | 'list';

export interface ArticlesQuery {
  readonly q: string;
  readonly tag: string;
  readonly page: number;
  readonly view: ArticlesView;
}

export type RawArticlesSearchParams = Record<string, string | readonly string[] | undefined>;

const DEFAULT_ARTICLES_QUERY = {
  q: '',
  tag: '',
  page: 1,
  view: 'grid',
} as const satisfies ArticlesQuery;

const PAGE_PATTERN = /^[1-9]\d*$/;

export function normalizeArticlesQuery(searchParams: RawArticlesSearchParams): ArticlesQuery {
  const q = firstValue(searchParams.q).trim();
  const tag = firstValue(searchParams.tag).trim();
  const pageValue = firstValue(searchParams.page);
  const viewValue = firstValue(searchParams.view);

  return {
    q,
    tag,
    page: PAGE_PATTERN.test(pageValue) ? Number(pageValue) : DEFAULT_ARTICLES_QUERY.page,
    view: viewValue === 'list' ? 'list' : DEFAULT_ARTICLES_QUERY.view,
  };
}

export function buildArticlesHref(query: ArticlesQuery, patch: Partial<ArticlesQuery> = {}) {
  const nextQuery = normalizeArticlesQuery({
    q: patch.q ?? query.q,
    tag: patch.tag ?? query.tag,
    page: String(patch.page ?? query.page),
    view: patch.view ?? query.view,
  });

  const shouldResetPage =
    patch.q !== undefined || patch.tag !== undefined || patch.view !== undefined;
  const page = shouldResetPage ? DEFAULT_ARTICLES_QUERY.page : nextQuery.page;
  const params = new URLSearchParams();

  if (nextQuery.q) params.set('q', nextQuery.q);
  if (nextQuery.tag) params.set('tag', nextQuery.tag);
  if (page !== DEFAULT_ARTICLES_QUERY.page) params.set('page', String(page));
  if (nextQuery.view !== DEFAULT_ARTICLES_QUERY.view) params.set('view', nextQuery.view);

  const queryString = params.toString();
  return queryString ? `/articles?${queryString}` : '/articles';
}

function firstValue(value: string | readonly string[] | undefined): string {
  if (typeof value === 'string') return value;
  return value?.[0] ?? '';
}
