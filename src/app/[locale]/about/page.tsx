import { PrincipleCard } from '@/components/principle-card';
import { ScrollRevealList } from '@/components/scroll-reveal-list';
import { SectionContainer, SectionHeader } from '@/components/section';
import { SocialIconBar } from '@/components/social-icon-bar';
import { ToolboxCard } from '@/components/toolbox-card';
import { PRINCIPLES, TOOLBOX_CATEGORIES } from '@/data/about';
import { createPageMetadata, getSiteUrl } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

interface AboutPageProps {
  readonly params: Promise<{
    readonly locale: 'ja' | 'en';
  }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'About.metadata' });

  return createPageMetadata({
    title: t('title'),
    description: t('description'),
    path: '/about',
    siteUrl: getSiteUrl(),
    locale,
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('About');

  return (
    <SectionContainer>
      {/* Profile */}
      <div className="mb-14 grid grid-cols-[180px_1fr] items-start gap-9 max-md:grid-cols-1 max-md:text-center">
        {/* Avatar */}
        <div className="relative flex size-[180px] items-center justify-center overflow-hidden rounded-[14px] border border-border bg-secondary text-[56px] max-md:mx-auto">
          <span aria-hidden="true">{'\u{1F468}\u200D\u{1F4BB}'}</span>
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, var(--accent-glow) 0%, transparent 50%)',
            }}
          />
        </div>

        {/* Info */}
        <div>
          <h1 className="mb-[3px] text-[28px] font-extrabold">Rym</h1>
          <p className="mb-4 font-mono text-[13px] text-primary">{t('profile.role')}</p>

          {/* Bio */}
          <div className="mb-5 text-[14.5px] leading-[1.8] text-text-secondary max-md:text-left">
            <p className="mb-2.5">{t('profile.bio1')}</p>
            <p>{t('profile.bio2')}</p>
          </div>

          {/* Social Links */}
          <SocialIconBar className="max-md:justify-center" />
        </div>
      </div>

      {/* Engineering Principles */}
      <SectionHeader
        label={t('principles.label')}
        title={t('principles.title')}
        description={t('principles.description')}
        className="mb-6 max-md:mb-6"
      />
      <ScrollRevealList className="mb-14 grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-4 max-md:grid-cols-2 max-[480px]:grid-cols-1">
        {PRINCIPLES.map((principle) => (
          <PrincipleCard key={principle.title} principle={principle} />
        ))}
      </ScrollRevealList>

      {/* Tech Stack / Toolbox */}
      <SectionHeader
        label={t('toolbox.label')}
        title={t('toolbox.title')}
        description={t('toolbox.description')}
        className="mb-6 max-md:mb-6"
      />
      <ScrollRevealList className="grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-4">
        {TOOLBOX_CATEGORIES.map((category) => (
          <ToolboxCard key={category.title} category={category} />
        ))}
      </ScrollRevealList>
    </SectionContainer>
  );
}
