import { ProjectCard } from '@/components/project-card';
import { ScrollRevealList } from '@/components/scroll-reveal-list';
import { SectionContainer, SectionHeader } from '@/components/section';
import { PROJECTS } from '@/data/projects';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Rymlab',
  description: 'チームの速度を加速させるために設計・構築したツール群。',
};

// TODO #28: Replace static PROJECTS with microCMS SDK fetch + adapters behind 'use cache'

export default function ProjectsPage() {
  return (
    <SectionContainer>
      <SectionHeader
        label="Projects"
        title="All Projects"
        descriptionEn="Tools engineered to multiply team velocity."
        description="チームの速度を加速させるために設計・構築したツール群。"
      />
      <ScrollRevealList className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-5">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.slug} project={{ ...project, href: '#' }} />
        ))}
      </ScrollRevealList>
    </SectionContainer>
  );
}
