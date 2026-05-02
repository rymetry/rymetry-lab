import { ProjectCard } from '@/components/project-card';
import { ScrollRevealList } from '@/components/scroll-reveal-list';
import { SectionContainer, SectionHeader } from '@/components/section';
import { PROJECTS } from '@/data/projects';
import { createPageMetadata, getSiteUrl } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

// TODO #28: Replace static PROJECTS with microCMS SDK fetch + adapters behind 'use cache'

interface ProjectsPageProps {
  readonly params: Promise<{
    readonly locale: 'ja' | 'en';
  }>;
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Projects.metadata' });

  return createPageMetadata({
    title: t('title'),
    description: t('description'),
    path: '/projects',
    siteUrl: getSiteUrl(),
    locale,
  });
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Projects.heading');

  return (
    <SectionContainer>
      <SectionHeader label={t('label')} title={t('title')} description={t('description')} />
      <ScrollRevealList className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-5">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.slug} project={{ ...project, href: '#' }} />
        ))}
      </ScrollRevealList>
    </SectionContainer>
  );
}
