import { ArticleCard } from '@/components/article-card';
import { HeroSection } from '@/components/hero-section';
import { ProjectCard } from '@/components/project-card';
import { ScrollRevealList } from '@/components/scroll-reveal-list';
import { SectionContainer, SectionHeader } from '@/components/section';
import { ARTICLES } from '@/data/articles';
import { PROJECTS } from '@/data/projects';
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
        <SectionHeader
          label={t('featuredProjects.label')}
          title={t('featuredProjects.title')}
          description={t('featuredProjects.description')}
        />
        <ScrollRevealList className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-5">
          {PROJECTS.slice(0, 3).map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={{ ...project, href: '#' }}
              className={i >= 2 ? 'max-lg:hidden' : undefined}
            />
          ))}
        </ScrollRevealList>
      </SectionContainer>

      {/* #26: Recent Articles */}
      <SectionContainer alt>
        <SectionHeader
          label={t('recentArticles.label')}
          title={t('recentArticles.title')}
          description={t('recentArticles.description')}
        />
        <ScrollRevealList className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-5">
          {ARTICLES.map((article, i) => (
            <ArticleCard
              key={article.slug}
              article={article}
              href="#"
              className={i >= 2 ? 'max-lg:hidden' : undefined}
            />
          ))}
        </ScrollRevealList>
      </SectionContainer>
    </>
  );
}
