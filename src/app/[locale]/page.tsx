import { ArticleCard } from '@/components/article-card';
import { HeroSection } from '@/components/hero-section';
import { HomeSectionHead } from '@/components/home-section-head';
import { ProjectCard } from '@/components/project-card';
import { ScrollRevealList } from '@/components/scroll-reveal-list';
import { SectionContainer } from '@/components/section';
import { PROJECTS } from '@/data/projects';
import { createPageMetadata, getSiteUrl } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getArticlesPageContent } from './articles/articles-cache';

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
  const [t, { articles }] = await Promise.all([getTranslations('Home'), getArticlesPageContent()]);
  const recentArticles = articles.slice(0, 3);

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
            descriptionClassName="max-w-none"
          />
          {recentArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </ScrollRevealList>
      </SectionContainer>
    </>
  );
}
