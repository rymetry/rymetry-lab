import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  PenLineIcon,
  UserRoundIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { ListCard } from '@/components/list-card';
import { SectionContainer, SectionHeader } from '@/components/section';
import { TagList } from '@/components/tag';
import { Link } from '@/i18n/navigation';
import { processArticleContent, type ArticleTocItem } from '@/lib/articles/content';
import { getArticleRelations } from '@/lib/articles/relations';
import { getArticleBySlug, getArticles } from '@/lib/cms';
import { buildMicroCMSImageUrl } from '@/lib/cms/image';
import { createArticleJsonLd, createBreadcrumbJsonLd, JsonLdScript } from '@/lib/seo/json-ld';
import { createArticleMetadata, getSiteUrl } from '@/lib/seo/metadata';
import { cn } from '@/lib/utils';
import type { ArticleDetail } from '@/types/article';

interface ArticleDetailPageProps {
  readonly params: Promise<{
    readonly slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found | Rymlab',
    };
  }

  return createArticleMetadata({
    title: article.title,
    description: article.description ?? article.excerpt,
    path: `/articles/${article.slug}`,
    siteUrl: getSiteUrl(),
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    image: {
      url: buildMicroCMSImageUrl(article.ogpImage.url, {
        width: 1200,
        height: 630,
        format: 'webp',
        quality: 90,
      }),
      width: 1200,
      height: 630,
      alt: article.title,
    },
    tags: article.tags.map((tag) => tag.label),
  });
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const [article, articles] = await Promise.all([getArticleBySlug(slug), getArticles()]);

  if (!article) notFound();

  const [{ html, toc }, relations] = await Promise.all([
    processArticleContent(article.content),
    Promise.resolve(getArticleRelations(article, articles)),
  ]);
  const articleImageUrl = buildMicroCMSImageUrl(article.ogpImage.url, {
    width: 1200,
    height: 630,
    format: 'webp',
    quality: 90,
  });

  return (
    <>
      <JsonLdScript
        data={createArticleJsonLd({
          path: `/articles/${article.slug}`,
          title: article.title,
          description: article.description ?? article.excerpt,
          publishedAt: article.publishedAt,
          updatedAt: article.updatedAt,
          imageUrl: articleImageUrl,
          tags: article.tags.map((tag) => tag.label),
        })}
      />
      <JsonLdScript
        data={createBreadcrumbJsonLd({
          items: [
            { name: 'Home', path: '/' },
            { name: 'Articles', path: '/articles' },
            { name: article.title, path: `/articles/${article.slug}` },
          ],
        })}
      />

      <SectionContainer className="pb-12">
        <article className="mx-auto max-w-[1040px]">
          <ArticleHero article={article} />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
            <div className="min-w-0">
              <div className="article-content" dangerouslySetInnerHTML={{ __html: html }} />
            </div>

            {toc.length > 0 && <ArticleToc items={toc} />}
          </div>
        </article>
      </SectionContainer>

      <ArticleFooter
        relatedArticles={relations.relatedArticles}
        previousArticle={relations.previousArticle}
        nextArticle={relations.nextArticle}
      />
    </>
  );
}

function ArticleHero({ article }: { readonly article: ArticleDetail }) {
  return (
    <header className="mb-10">
      <Link
        href="/articles"
        className="mb-5 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ChevronLeftIcon aria-hidden="true" className="size-3.5" />
        Articles
      </Link>

      <p className="mb-2 font-mono text-xs uppercase tracking-[0.1em] text-primary">
        {'// '}Article
      </p>
      <h1 className="max-w-[860px] text-[clamp(28px,5vw,48px)] font-extrabold leading-tight tracking-[-0.03em]">
        {article.title}
      </h1>
      <p className="mt-4 max-w-[720px] text-[15px] leading-[1.8] text-text-secondary">
        {article.description ?? article.excerpt}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <UserRoundIcon aria-hidden="true" className="size-3.5" />
          Rym
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarIcon aria-hidden="true" className="size-3.5" />
          {article.publishedAt}
        </span>
        {article.updatedAt && (
          <span className="inline-flex items-center gap-1.5">
            <PenLineIcon aria-hidden="true" className="size-3.5" />
            {article.updatedAt}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <ClockIcon aria-hidden="true" className="size-3.5" />
          {article.readingTime}
        </span>
      </div>

      <TagList tags={article.tags} className="mt-5" />

      <div className="relative mt-8 h-[180px] overflow-hidden rounded-[11px] border border-border bg-secondary">
        <Image
          src={buildMicroCMSImageUrl(article.ogpImage.url, {
            width: 1040,
            height: 360,
            format: 'webp',
            quality: 75,
          })}
          alt=""
          fill
          priority
          sizes="(min-width: 1040px) 1040px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,oklch(var(--primary-ch)/0.10),transparent_58%)]" />
      </div>
    </header>
  );
}

function ArticleToc({ items }: { readonly items: readonly ArticleTocItem[] }) {
  return (
    <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto lg:block">
      <nav
        aria-label="Table of contents"
        className="rounded-[9px] border border-border bg-card p-4 shadow-[var(--card-shadow)]"
      >
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
          Contents
        </p>
        <ol className="grid gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  'block text-[13px] leading-5 text-text-secondary transition-colors hover:text-primary',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card',
                  item.level === 3 && 'pl-3 text-[12.5px]',
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}

function ArticleFooter({
  relatedArticles,
  previousArticle,
  nextArticle,
}: {
  readonly relatedArticles: readonly ArticleDetail[];
  readonly previousArticle: ArticleDetail | null;
  readonly nextArticle: ArticleDetail | null;
}) {
  return (
    <SectionContainer alt className="pt-12">
      <div className="mx-auto max-w-[1040px]">
        {(previousArticle || nextArticle) && (
          <nav aria-label="Article navigation" className="mb-12 grid gap-4 md:grid-cols-2">
            <ArticleNavLink label="Newer article" article={previousArticle} direction="previous" />
            <ArticleNavLink label="Older article" article={nextArticle} direction="next" />
          </nav>
        )}

        {relatedArticles.length > 0 && (
          <>
            <SectionHeader
              label="Related"
              title="Related Articles"
              description="同じタグを持つ記事をピックアップしています。"
              className="mb-6"
            />
            <div className="grid gap-3">
              {relatedArticles.map((article) => (
                <ListCard key={article.slug} article={article} />
              ))}
            </div>
          </>
        )}
      </div>
    </SectionContainer>
  );
}

function ArticleNavLink({
  label,
  article,
  direction,
}: {
  readonly label: string;
  readonly article: ArticleDetail | null;
  readonly direction: 'previous' | 'next';
}) {
  if (!article) {
    return <div className="hidden md:block" />;
  }

  const Icon = direction === 'previous' ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        'group rounded-[9px] border border-border bg-card p-4 shadow-[var(--card-shadow)] transition-all duration-200',
        'hover:-translate-y-px hover:border-[var(--border-hover)] hover:shadow-[var(--card-shadow-hover)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        direction === 'next' && 'text-right',
      )}
    >
      <span
        className={cn(
          'mb-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-primary',
          direction === 'next' && 'justify-end',
        )}
      >
        {direction === 'previous' && <Icon aria-hidden="true" className="size-3.5" />}
        {label}
        {direction === 'next' && <Icon aria-hidden="true" className="size-3.5" />}
      </span>
      <span className="block text-sm font-semibold leading-6 transition-colors group-hover:text-primary">
        {article.title}
      </span>
    </Link>
  );
}
