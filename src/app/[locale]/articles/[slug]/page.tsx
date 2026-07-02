import { CalendarIcon, ChevronLeftIcon, ClockIcon, PenLineIcon, UserRoundIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { ArticleToc } from '@/components/article-toc';
import { SectionContainer } from '@/components/section';
import { TagList } from '@/components/tag';
import { Link } from '@/i18n/navigation';
import { processArticleContent } from '@/lib/articles/content';
import { getArticleRelations } from '@/lib/articles/relations';
import { getArticleBySlug, getArticles } from '@/lib/cms';
import { buildMicroCMSImageUrl } from '@/lib/cms/image';
import { createArticleJsonLd, createBreadcrumbJsonLd, JsonLdScript } from '@/lib/seo/json-ld';
import { createArticleMetadata, getSiteUrl } from '@/lib/seo/metadata';
import type { ArticleDetail } from '@/types/article';
import { ArticleFooter } from './article-footer';

interface ArticleDetailPageProps {
  readonly params: Promise<{
    readonly locale: 'ja' | 'en';
    readonly slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    const t = await getTranslations({ locale, namespace: 'Articles.detail' });

    return {
      title: t('notFoundTitle'),
    };
  }

  return createArticleMetadata({
    title: article.title,
    description: article.description ?? article.excerpt,
    path: `/articles/${article.slug}`,
    siteUrl: getSiteUrl(),
    locale,
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
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Articles.detail');
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
          <ArticleHero article={article} backLabel={t('back')} articleLabel={t('label')} />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
            <div className="min-w-0">
              <div className="article-content" dangerouslySetInnerHTML={{ __html: html }} />
            </div>

            {toc.length > 0 && <ArticleToc items={toc} label={t('toc')} />}
          </div>
        </article>
      </SectionContainer>

      <ArticleFooter
        relatedArticles={relations.relatedArticles}
        previousArticle={relations.previousArticle}
        nextArticle={relations.nextArticle}
        navigationLabel={t('navigation')}
        previousLabel={t('previous')}
        nextLabel={t('next')}
        relatedLabel={t('relatedLabel')}
        relatedTitle={t('relatedTitle')}
        relatedDescription={t('relatedDescription')}
      />
    </>
  );
}

function ArticleHero({
  article,
  backLabel,
  articleLabel,
}: {
  readonly article: ArticleDetail;
  readonly backLabel: string;
  readonly articleLabel: string;
}) {
  return (
    <header className="mb-10">
      <Link
        href="/articles"
        className="mb-5 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ChevronLeftIcon aria-hidden="true" className="size-3.5" />
        {backLabel}
      </Link>

      <p className="mb-2 font-mono text-xs uppercase tracking-[0.1em] text-primary">
        {'// '}
        {articleLabel}
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
