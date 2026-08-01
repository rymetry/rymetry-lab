import { ArticleCard } from '@/components/article-card';
import { HeroSection } from '@/components/hero-section';
import { HomeSectionHead } from '@/components/home-section-head';
import { ProjectCard } from '@/components/project-card';
import { ScrollRevealList } from '@/components/scroll-reveal-list';
import { SectionContainer } from '@/components/section';
import { PROJECTS } from '@/data/projects';
import { createPageMetadata, getSiteUrl } from '@/lib/seo/metadata';
import type { Article } from '@/types/article';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getArticlesPageContent } from './articles/articles-cache';

const RECENT_ARTICLES_COUNT = 3;

/**
 * Recent Articles は Home で唯一 CMS に依存するセクション。
 * microCMS 障害時に Home 全体を error.tsx に落とさないよう、失敗時は
 * null を返してセクションごと非表示にする (Hero / Featured Work は CMS 非依存)。
 */
async function fetchRecentArticles(): Promise<readonly Article[] | null> {
  try {
    const { articles } = await getArticlesPageContent();
    return articles.slice(0, RECENT_ARTICLES_COUNT);
  } catch (error) {
    console.error('[Home] Failed to load recent articles; hiding the section', error);
    return null;
  }
}

// TODO #28: Replace static PROJECTS with microCMS SDK fetch + adapters behind 'use cache'

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
  const [t, recentArticles] = await Promise.all([getTranslations('Home'), fetchRecentArticles()]);

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

      {/* #26: Recent Articles — Featured と地続き (背景帯なし)、縦 padding は padY2。
          CMS フェッチ失敗時 (null) はセクションごと非表示にして Home の他セクションを守る */}
      {recentArticles !== null && (
        <SectionContainer padY="compact">
          <ScrollRevealList className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <HomeSectionHead
              title={t('recentArticles.title')}
              description={t('recentArticles.description')}
              descriptionEn={
                t.has('recentArticles.descriptionEn')
                  ? t('recentArticles.descriptionEn')
                  : undefined
              }
              viewAllHref="/articles"
              viewAllLabel={t('recentArticles.viewAll')}
              descriptionClassName="max-w-none"
            />
            {recentArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </ScrollRevealList>
        </SectionContainer>
      )}
    </>
  );
}
