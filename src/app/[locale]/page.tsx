import { ArticleCard } from '@/components/article-card';
import { HeroSection } from '@/components/hero-section';
import { HomeSectionHead } from '@/components/home-section-head';
import { ProjectCard } from '@/components/project-card';
import { ScrollRevealList } from '@/components/scroll-reveal-list';
import { SectionContainer } from '@/components/section';
import { PROJECTS } from '@/data/projects';
// barrel (@/lib/cms) は articles.ts 経由で server-only を引き込み bun test が解決できないため直接 import する
import { adaptArticles } from '@/lib/cms/adapters';
import { createPageMetadata, getSiteUrl } from '@/lib/seo/metadata';
import type { Article } from '@/types/article';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { unstable_rethrow } from 'next/navigation';

import { getCachedArticlesPageContent } from './articles/articles-cache';

const RECENT_ARTICLES_COUNT = 3;

/**
 * Recent Articles は Home で唯一 CMS に依存するセクション。
 * microCMS 障害時に Home 全体を error.tsx に落とさないよう、失敗時は
 * null を返してセクションごと非表示にする (Hero / Featured Work は CMS 非依存)。
 */
async function fetchRecentArticles(): Promise<readonly Article[] | null> {
  let content;
  try {
    // 保護するのは通信・キャッシュ層のみ。ここでの失敗は microCMS 障害や設定不備であり、
    // CMS 非依存の Hero / Featured Work まで巻き添えにする理由がない
    content = await getCachedArticlesPageContent();
  } catch (error) {
    // notFound()/redirect()/PPR の prerender 中断は制御フローなので必ず再送出する。
    // 'use cache' 境界を越えたエラーはクラス識別を失うため instanceof では判別できない
    unstable_rethrow(error);
    // 本番では message が難読化されるため digest を併記する
    const digest = (error as { digest?: string })?.digest ?? 'n/a';
    console.error(
      `[Home] microCMS fetch failed; hiding recent articles (digest: ${digest})`,
      error,
    );
    return null;
  }

  // 変換・検証は保護しない。表示する記事が壊れていれば /articles と同じく明示的に失敗させる
  return adaptArticles(content.articles.slice(0, RECENT_ARTICLES_COUNT));
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
          CMS フェッチ失敗時 (null) と記事 0 件時はセクションごと非表示にする。
          後者は microCMS 未設定時に articles-cache が throw せず [] を返すため
          (見出しと View all だけが残る空セクションを防ぐ) */}
      {recentArticles?.length ? (
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
      ) : null}
    </>
  );
}
