import { InkImage, PageInk } from '@/components/ink-image';
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
    <div className="bg-[image:var(--page-gradient)]">
      <SectionContainer className="relative overflow-hidden">
        <PageInk />
        {/* Profile */}
        <div className="mb-14 grid grid-cols-[180px_1fr] items-start gap-9 max-md:grid-cols-1 max-md:text-center">
          {/* Avatar */}
          <div className="relative flex size-[180px] items-center justify-center overflow-hidden rounded-[4px] border border-border bg-secondary text-[52px] max-md:mx-auto">
            <InkImage
              kind="fine"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
              sizes="180px"
            />
            <span aria-hidden="true" className="relative">
              {'\u{1F468}\u200D\u{1F4BB}'}
            </span>
            <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--accent-glow)_0%,transparent_50%)]" />
          </div>

          {/* Info */}
          <div>
            <h1 className="mb-[3px] text-[32px] font-medium tracking-[0.04em]">Rym</h1>
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
          title={t('principles.title')}
          description={t('principles.description')}
          descriptionEn={
            t.has('principles.descriptionEn') ? t('principles.descriptionEn') : undefined
          }
          className="mb-6 max-md:mb-6"
        />
        {/* max-md と max-[480px] は CSS 出力順で 480px 側が先になり打ち消されるため、範囲を重ねない */}
        <ScrollRevealList className="mb-14 grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-4 min-[480px]:max-md:grid-cols-2 max-[480px]:grid-cols-1">
          {PRINCIPLES.map((principle) => (
            <PrincipleCard key={principle.title} principle={principle} />
          ))}
        </ScrollRevealList>

        {/* Tech Stack / Toolbox */}
        <SectionHeader
          title={t('toolbox.title')}
          description={t('toolbox.description')}
          descriptionEn={t.has('toolbox.descriptionEn') ? t('toolbox.descriptionEn') : undefined}
          className="mb-6 max-md:mb-6"
        />
        <ScrollRevealList className="grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-4">
          {TOOLBOX_CATEGORIES.map((category) => (
            <ToolboxCard key={category.title} category={category} />
          ))}
        </ScrollRevealList>
      </SectionContainer>
    </div>
  );
}
