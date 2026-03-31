import { ArticleCard } from '@/components/article-card';
import { HeroSection } from '@/components/hero-section';
import { ProjectCard } from '@/components/project-card';
import { ScrollReveal } from '@/components/scroll-reveal';
import { SectionContainer, SectionHeader } from '@/components/section';
import { ARTICLES } from '@/data/articles';
import { PROJECTS } from '@/data/projects';

// TODO #28: Replace static ARTICLES/PROJECTS with microCMS SDK fetch + adapters behind 'use cache'

const FEATURED_COUNT = 3;

export default function Home() {
  const featuredProjects = PROJECTS.slice(0, FEATURED_COUNT);

  return (
    <>
      {/* #24 */}
      <HeroSection />

      {/* #25: Featured Work */}
      <SectionContainer>
        <SectionHeader
          label="Featured Projects"
          title="Featured Work"
          descriptionEn="Less friction, more flow."
          description="開発者のワークフローを加速するために構築したツール群。"
        />
        <ScrollReveal>
          {featuredProjects.length === FEATURED_COUNT ? (
            <div className="grid grid-cols-[1.3fr_1fr] grid-rows-2 gap-5 max-[480px]:grid-cols-1 max-[480px]:[grid-template-rows:none]">
              {featuredProjects.map((project, i) => (
                <ProjectCard
                  key={project.slug}
                  project={{ ...project, href: '#' }}
                  className={i === 0 ? 'row-span-2 max-[480px]:row-auto' : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-5">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.slug} project={{ ...project, href: '#' }} />
              ))}
            </div>
          )}
        </ScrollReveal>
      </SectionContainer>

      {/* #26: Recent Articles */}
      <SectionContainer alt>
        <SectionHeader
          label="Latest Articles"
          title="Recent Articles"
          descriptionEn="Field notes from the trenches of developer productivity."
          description="開発生産性の現場から得た知見。"
        />
        <ScrollReveal>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-5">
            {ARTICLES.map((article) => (
              <ArticleCard key={article.slug} article={article} href="#" />
            ))}
          </div>
        </ScrollReveal>
      </SectionContainer>
    </>
  );
}
