import { ArticleCard } from '@/components/article-card';
import { HeroSection } from '@/components/hero-section';
import { ProjectCard } from '@/components/project-card';
import { ScrollReveal } from '@/components/scroll-reveal';
import { SectionContainer, SectionHeader } from '@/components/section';
import { ARTICLES } from '@/data/articles';
import { PROJECTS } from '@/data/projects';

// TODO #28: Replace static ARTICLES/PROJECTS with microCMS SDK fetch + adapters behind 'use cache'

export default function Home() {
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
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-5">
            {PROJECTS.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={{ ...project, href: '#' }}
                className={i >= 2 ? 'max-lg:hidden' : undefined}
              />
            ))}
          </div>
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
            {ARTICLES.map((article, i) => (
              <ArticleCard
                key={article.slug}
                article={article}
                href="#"
                className={i >= 2 ? 'max-lg:hidden' : undefined}
              />
            ))}
          </div>
        </ScrollReveal>
      </SectionContainer>
    </>
  );
}
