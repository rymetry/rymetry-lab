import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LayersIcon,
  LayoutGridIcon,
  ListIcon,
} from 'lucide-react';
import type { Metadata } from 'next';

import { ArticleCard } from '@/components/article-card';
import { ListCard } from '@/components/list-card';
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

export const metadata: Metadata = createPageMetadata({
  title: 'Articles',
  description: '生産性・自動化・エンジニアリングの最前線から。',
  path: '/articles',
  siteUrl: getSiteUrl(),
});

const ARTICLES_PER_PAGE = 6;

interface ArticlesPageProps {
  readonly searchParams?: Promise<RawArticlesSearchParams>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
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
          label="Articles"
          title="All Articles"
          descriptionEn="Insights on developer productivity, automation, and modern engineering."
          description="生産性・自動化・エンジニアリングの最前線から。"
        />

        <div className="mb-7 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <SearchForm query={currentQuery} />
            <ViewToggle query={currentQuery} />
          </div>
          <TagFilter tags={tags} query={currentQuery} />
        </div>

        {pageArticles.length > 0 ? (
          <ArticlesList articles={pageArticles} view={query.view} />
        ) : (
          <EmptyArticlesState query={currentQuery} />
        )}

        <Pagination
          query={currentQuery}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredArticles.length}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
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

function ViewToggle({ query }: { readonly query: ArticlesQuery }) {
  return (
    <div className="ml-auto flex gap-1" aria-label="Article view">
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
        <Link href={buildArticlesHref(query, { view: 'grid' })} aria-label="Grid view">
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
        <Link href={buildArticlesHref(query, { view: 'list' })} aria-label="List view">
          <ListIcon aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );
}

function TagFilter({
  tags,
  query,
}: {
  readonly tags: readonly Tag[];
  readonly query: ArticlesQuery;
}) {
  return (
    <div
      className="flex gap-1.5 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible md:pb-0"
      aria-label="Filter articles by tag"
    >
      <FilterTagLink href={buildArticlesHref(query, { tag: '' })} active={!query.tag}>
        <LayersIcon aria-hidden="true" className="size-[13px]" />
        All
      </FilterTagLink>
      {tags.map((tag) => {
        const Icon = tag.icon;

        return (
          <FilterTagLink
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
          </FilterTagLink>
        );
      })}
    </div>
  );
}

function FilterTagLink({
  href,
  active,
  children,
}: {
  readonly href: string;
  readonly active: boolean;
  readonly children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[7px] border border-border px-3.5 text-[12.5px] text-text-secondary transition-colors',
        'hover:border-primary hover:text-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        active && 'border-[var(--tag-border)] bg-[var(--tag-bg)] text-[var(--tag-text)]',
      )}
      aria-current={active ? 'true' : undefined}
    >
      {children}
    </Link>
  );
}

function Pagination({
  query,
  currentPage,
  totalPages,
  totalItems,
  rangeStart,
  rangeEnd,
}: {
  readonly query: ArticlesQuery;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly rangeStart: number;
  readonly rangeEnd: number;
}) {
  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-1.5"
      aria-label="Articles pagination"
    >
      <PaginationLink
        href={buildArticlesHref(query, { page: Math.max(1, currentPage - 1) })}
        disabled={currentPage === 1 || totalItems === 0}
        ariaLabel="Previous page"
      >
        <ChevronLeftIcon aria-hidden="true" className="size-3.5" />
      </PaginationLink>

      {pages.map((page) => (
        <PaginationLink
          key={page}
          href={buildArticlesHref(query, { page })}
          active={page === currentPage}
          ariaLabel={`Page ${page}`}
        >
          {page}
        </PaginationLink>
      ))}

      <PaginationLink
        href={buildArticlesHref(query, { page: Math.min(totalPages, currentPage + 1) })}
        disabled={currentPage === totalPages || totalItems === 0}
        ariaLabel="Next page"
      >
        <ChevronRightIcon aria-hidden="true" className="size-3.5" />
      </PaginationLink>

      <span className="mx-2 font-mono text-xs text-muted-foreground">
        {rangeStart}-{rangeEnd} / {totalItems} articles
      </span>
    </nav>
  );
}

function PaginationLink({
  href,
  active = false,
  disabled = false,
  ariaLabel,
  children,
}: {
  readonly href: string;
  readonly active?: boolean;
  readonly disabled?: boolean;
  readonly ariaLabel: string;
  readonly children: React.ReactNode;
}) {
  const className = cn(
    'flex size-9 items-center justify-center rounded-[7px] border border-border text-[13px] text-text-secondary transition-colors',
    'hover:border-primary hover:text-primary',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    active && 'border-transparent bg-[image:var(--accent-gradient)] text-white hover:text-white',
    disabled && 'pointer-events-none opacity-45',
  );

  if (disabled) {
    return (
      <span className={className} aria-label={ariaLabel} aria-disabled="true">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}

function EmptyArticlesState({ query }: { readonly query: ArticlesQuery }) {
  const hasFilters = Boolean(query.q || query.tag);

  return (
    <div className="rounded-[11px] border border-border bg-card px-5 py-12 text-center">
      <h3 className="mb-2 text-base font-semibold">No articles found</h3>
      <p className="mx-auto max-w-[460px] text-sm leading-6 text-text-secondary">
        {hasFilters
          ? '検索条件に一致する記事はありません。キーワードやタグを変更してください。'
          : '記事はまだ公開されていません。'}
      </p>
      {hasFilters && (
        <Button asChild variant="outline" size="sm" className="mt-5">
          <Link href={buildArticlesHref(query, { q: '', tag: '' })}>Clear filters</Link>
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
