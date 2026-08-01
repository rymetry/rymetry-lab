import { ArrowRightIcon } from 'lucide-react';

import { ArticleCard } from '@/components/article-card';
import { HeroSection } from '@/components/hero-section';
import { ProjectCard } from '@/components/project-card';
import { ScrollRevealList } from '@/components/scroll-reveal-list';
import { SectionContainer, SectionHeader } from '@/components/section';
import { ARTICLES } from '@/data/articles';
import { PROJECTS } from '@/data/projects';
import { Link } from '@/i18n/navigation';
import { createPageMetadata, getSiteUrl } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

// TODO #28: Replace static ARTICLES/PROJECTS with microCMS SDK fetch + adapters behind 'use cache'

interface HomePageProps {
  readonly params: Promise<{
    readonly locale: 'ja' | 'en';
  }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home.metadata' });

  return createPageMetadata({
    title: 'Rymlab',
    description: t('description'),
    path: '/',
    siteUrl: getSiteUrl(),
    locale,
  });
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Home');

  return (
    <>
      {/* #24 */}
      <HeroSection />

      {/* #25: Featured Work */}
      <SectionContainer>
        <ScrollRevealList className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <HomeSectionHead
            title={t('featuredProjects.title')}
            description={t('featuredProjects.description')}
            descriptionEn={
              t.has('featuredProjects.descriptionEn')
                ? t('featuredProjects.descriptionEn')
                : undefined
            }
            viewAllHref="/projects"
            viewAllLabel={t('featuredProjects.viewAll')}
          />
          {PROJECTS.slice(0, 3).map((project) => (
            <ProjectCard key={project.slug} project={{ ...project, href: '#' }} />
          ))}
        </ScrollRevealList>
      </SectionContainer>

      {/* #26: Recent Articles — Featured と地続き (背景帯なし)、縦 padding は padY2 */}
      <SectionContainer padY="compact">
        <ScrollRevealList className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <HomeSectionHead
            title={t('recentArticles.title')}
            description={t('recentArticles.description')}
            descriptionEn={
              t.has('recentArticles.descriptionEn') ? t('recentArticles.descriptionEn') : undefined
            }
            viewAllHref="/articles"
            viewAllLabel={t('recentArticles.viewAll')}
          />
          {ARTICLES.slice(0, 3).map((article) => (
            <ArticleCard key={article.slug} article={article} href="#" />
          ))}
        </ScrollRevealList>
      </SectionContainer>
    </>
  );
}

/**
 * Home セクションの見出しセル。lg (3列)・モバイル (1列) では全幅の行、
 * md (2列) ではグリッド1マス目に入りカード3枚と 2×2 モジュールを構成する。
 * View all リンクは md 時のみ表示 (プロトタイプ準拠)。
 */
function HomeSectionHead({
  title,
  description,
  descriptionEn,
  viewAllHref,
  viewAllLabel,
}: {
  readonly title: string;
  readonly description?: string;
  readonly descriptionEn?: string;
  readonly viewAllHref: string;
  readonly viewAllLabel: string;
}) {
  return (
    <div className="col-span-full mb-5 md:max-lg:col-span-1 md:max-lg:mb-0 md:max-lg:flex md:max-lg:flex-col md:max-lg:justify-center md:max-lg:pb-5 md:max-lg:pr-3">
      <SectionHeader
        title={title}
        description={description}
        descriptionEn={descriptionEn}
        className="mb-0 max-md:mb-0"
      />
      <Link
        href={viewAllHref}
        className="mt-4 hidden items-center gap-1.5 font-brand text-sm font-medium tracking-[0.03em] text-primary transition-colors hover:text-foreground md:max-lg:inline-flex"
      >
        {viewAllLabel}
        <ArrowRightIcon size={13} aria-hidden="true" />
      </Link>
    </div>
  );
}
