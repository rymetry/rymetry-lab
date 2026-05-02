import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LayersIcon,
  LayoutGridIcon,
  ListIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ArticleCard } from '@/components/article-card';
import { FilterTag } from '@/components/filter-tag';
import { ListCard } from '@/components/list-card';
import { Pagination, type PaginationItem } from '@/components/pagination';
import { ScrollRevealList } from '@/components/scroll-reveal-list';
import { SectionContainer, SectionHeader } from '@/components/section';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { createBlogJsonLd, createBreadcrumbJsonLd, JsonLdScript } from '@/lib/seo/json-ld';
import { createPageMetadata, getSiteUrl } from '@/lib/seo/metadata';
import { cn } from '@/lib/utils';
import type { ArticleDetail } from '@/types/article';
import type { Tag } from '@/types/tag';
import { TAG_CATEGORY_COLORS } from '@/types/tag';

import { getArticlesPageContent } from './articles-cache';
import {
  buildArticlesHref,
  normalizeArticlesQuery,
  type ArticlesQuery,
  type ArticlesView,
  type RawArticlesSearchParams,
} from './articles-query';
import { SearchForm } from './search-form';

const ARTICLES_PER_PAGE = 6;

interface ArticlesPageProps {
  readonly params: Promise<{
    readonly locale: 'ja' | 'en';
  }>;
  readonly searchParams?: Promise<RawArticlesSearchParams>;
}

export async function generateMetadata({ params }: ArticlesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Articles.metadata' });

  return createPageMetadata({
    title: t('title'),
    description: t('description'),
    path: '/articles',
    siteUrl: getSiteUrl(),
    locale,
  });
}

export default async function ArticlesPage({ params, searchParams }: ArticlesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Articles');
  const query = normalizeArticlesQuery((await searchParams) ?? {});
  const { articles, tags } = await getArticlesPageContent();
  const filteredArticles = filterArticles(articles, query);
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE));
  const currentPage = Math.min(query.page, totalPages);
  const currentQuery = { ...query, page: currentPage };
  const pageArticles = paginateArticles(filteredArticles, currentPage);
  const rangeStart = filteredArticles.length === 0 ? 0 : (currentPage - 1) * ARTICLES_PER_PAGE + 1;
  const rangeEnd = Math.min(currentPage * ARTICLES_PER_PAGE, filteredArticles.length);

  return (
    <>
      <JsonLdScript data={createBlogJsonLd()} />
      <JsonLdScript
        data={createBreadcrumbJsonLd({
          items: [
            { name: 'Home', path: '/' },
            { name: 'Articles', path: '/articles' },
          ],
        })}
      />

      <SectionContainer>
        <SectionHeader
          label={t('heading.label')}
          title={t('heading.title')}
          description={t('heading.description')}
        />

        <div className="mb-7 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <SearchForm query={currentQuery} />
            <ViewToggle
              query={currentQuery}
              label={t('view.label')}
              gridLabel={t('view.grid')}
              listLabel={t('view.list')}
            />
          </div>
          <TagFilter
            tags={tags}
            query={currentQuery}
            label={t('filter.label')}
            allLabel={t('filter.all')}
          />
        </div>

        {pageArticles.length > 0 ? (
          <ArticlesList articles={pageArticles} view={query.view} />
        ) : (
          <EmptyArticlesState
            query={currentQuery}
            title={t('empty.title')}
            filteredDescription={t('empty.filtered')}
            unfilteredDescription={t('empty.unfiltered')}
            clearLabel={t('empty.clear')}
          />
        )}

        <ArticlesPagination
          query={currentQuery}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredArticles.length}
          label={t('pagination.label')}
          previousLabel={t('pagination.previous')}
          nextLabel={t('pagination.next')}
          pageLabel={(page) => t('pagination.page', { page })}
          summary={t('pagination.summary', {
            rangeStart,
            rangeEnd,
            totalItems: filteredArticles.length,
          })}
        />
      </SectionContainer>
    </>
  );
}

function ArticlesList({
  articles,
  view,
}: {
  readonly articles: readonly ArticleDetail[];
  readonly view: ArticlesView;
}) {
  if (view === 'list') {
    return (
      <ScrollRevealList className="grid gap-3">
        {articles.map((article) => (
          <ListCard key={article.slug} article={article} />
        ))}
      </ScrollRevealList>
    );
  }

  return (
    <ScrollRevealList className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-5 max-md:grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))]">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </ScrollRevealList>
  );
}

function ViewToggle({
  query,
  label,
  gridLabel,
  listLabel,
}: {
  readonly query: ArticlesQuery;
  readonly label: string;
  readonly gridLabel: string;
  readonly listLabel: string;
}) {
  return (
    <div className="ml-auto flex gap-1" aria-label={label}>
      <Button
        asChild
        variant="outline"
        size="icon"
        className={cn(
          'size-[34px] rounded-md bg-transparent text-muted-foreground shadow-none hover:border-primary hover:text-primary',
          query.view === 'grid' &&
            'border-[var(--tag-border)] bg-[var(--tag-bg)] text-[var(--tag-text)]',
        )}
      >
        <Link href={buildArticlesHref(query, { view: 'grid' })} aria-label={gridLabel}>
          <LayoutGridIcon aria-hidden="true" />
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        size="icon"
        className={cn(
          'size-[34px] rounded-md bg-transparent text-muted-foreground shadow-none hover:border-primary hover:text-primary',
          query.view === 'list' &&
            'border-[var(--tag-border)] bg-[var(--tag-bg)] text-[var(--tag-text)]',
        )}
      >
        <Link href={buildArticlesHref(query, { view: 'list' })} aria-label={listLabel}>
          <ListIcon aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );
}

function TagFilter({
  tags,
  query,
  label,
  allLabel,
}: {
  readonly tags: readonly Tag[];
  readonly query: ArticlesQuery;
  readonly label: string;
  readonly allLabel: string;
}) {
  return (
    <div
      className="flex gap-1.5 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible md:pb-0"
      aria-label={label}
    >
      <FilterTag href={buildArticlesHref(query, { tag: '' })} active={!query.tag}>
        <LayersIcon aria-hidden="true" className="size-[13px]" />
        {allLabel}
      </FilterTag>
      {tags.map((tag) => {
        const Icon = tag.icon;

        return (
          <FilterTag
            key={`${tag.category}-${tag.label}`}
            href={buildArticlesHref(query, { tag: tag.label })}
            active={query.tag === tag.label}
          >
            {Icon && (
              <Icon
                aria-hidden="true"
                className="size-[13px]"
                style={{ color: TAG_CATEGORY_COLORS[tag.category] }}
              />
            )}
            {tag.label}
          </FilterTag>
        );
      })}
    </div>
  );
}

function ArticlesPagination({
  query,
  currentPage,
  totalPages,
  totalItems,
  label,
  previousLabel,
  nextLabel,
  pageLabel,
  summary,
}: {
  readonly query: ArticlesQuery;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly label: string;
  readonly previousLabel: string;
  readonly nextLabel: string;
  readonly pageLabel: (page: number) => string;
  readonly summary: string;
}) {
  const pages = getVisiblePages(currentPage, totalPages);
  const items: PaginationItem[] = [
    {
      href: buildArticlesHref(query, { page: Math.max(1, currentPage - 1) }),
      disabled: currentPage === 1 || totalItems === 0,
      label: previousLabel,
      content: <ChevronLeftIcon aria-hidden="true" className="size-3.5" />,
    },
    ...pages.map((page) => ({
      href: buildArticlesHref(query, { page }),
      active: page === currentPage,
      label: pageLabel(page),
      content: page,
    })),
    {
      href: buildArticlesHref(query, { page: Math.min(totalPages, currentPage + 1) }),
      disabled: currentPage === totalPages || totalItems === 0,
      label: nextLabel,
      content: <ChevronRightIcon aria-hidden="true" className="size-3.5" />,
    },
  ];

  return <Pagination label={label} items={items} summary={summary} />;
}

function EmptyArticlesState({
  query,
  title,
  filteredDescription,
  unfilteredDescription,
  clearLabel,
}: {
  readonly query: ArticlesQuery;
  readonly title: string;
  readonly filteredDescription: string;
  readonly unfilteredDescription: string;
  readonly clearLabel: string;
}) {
  const hasFilters = Boolean(query.q || query.tag);

  return (
    <div className="rounded-[11px] border border-border bg-card px-5 py-12 text-center">
      <h3 className="mb-2 text-base font-semibold">{title}</h3>
      <p className="mx-auto max-w-[460px] text-sm leading-6 text-text-secondary">
        {hasFilters ? filteredDescription : unfilteredDescription}
      </p>
      {hasFilters && (
        <Button asChild variant="outline" size="sm" className="mt-5">
          <Link href={buildArticlesHref(query, { q: '', tag: '' })}>{clearLabel}</Link>
        </Button>
      )}
    </div>
  );
}

function filterArticles(articles: readonly ArticleDetail[], query: ArticlesQuery) {
  const normalizedQuery = normalizeSearchValue(query.q);
  const normalizedTag = normalizeSearchValue(query.tag);

  return articles.filter((article) => {
    const matchesTag =
      !normalizedTag ||
      article.tags.some((tag) => normalizeSearchValue(tag.label) === normalizedTag);

    if (!matchesTag) return false;
    if (!normalizedQuery) return true;

    const searchableText = [
      article.title,
      article.description,
      article.excerpt,
      ...article.tags.map((tag) => tag.label),
    ].join(' ');

    return normalizeSearchValue(searchableText).includes(normalizedQuery);
  });
}

function paginateArticles(articles: readonly ArticleDetail[], page: number) {
  const startIndex = (page - 1) * ARTICLES_PER_PAGE;
  return articles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function normalizeSearchValue(value: string | undefined) {
  return value?.trim().toLowerCase() ?? '';
}
