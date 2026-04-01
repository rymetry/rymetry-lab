import { PrincipleCard } from '@/components/principle-card';
import { ScrollRevealList } from '@/components/scroll-reveal-list';
import { SectionContainer, SectionHeader } from '@/components/section';
import { SocialIconBar } from '@/components/social-icon-bar';
import { ToolboxCard } from '@/components/toolbox-card';
import { PRINCIPLES, TOOLBOX_CATEGORIES } from '@/data/about';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Rymlab',
  description: 'Productivity Engineer Rym のプロフィール、エンジニアリング哲学、技術スタック。',
};

export default function AboutPage() {
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
          <p className="mb-4 font-mono text-[13px] text-primary">
            Productivity Engineer &mdash; Tokyo, Japan
          </p>

          {/* Bio */}
          <div className="mb-5 text-[14.5px] leading-[1.8] text-text-secondary max-md:text-left">
            <p className="mb-2.5">
              開発チームの生産性を最大化することに情熱を注いでいます。
              <strong className="font-semibold text-foreground">CI/CDパイプラインの最適化</strong>、
              <strong className="font-semibold text-foreground">開発者ツールの設計</strong>、
              <strong className="font-semibold text-foreground">インフラ自動化</strong>
              を通じて、エンジニアがコードに集中できる環境を構築します。
            </p>
            <p>
              「計測し、自動化し、改善する」を信条に、日々の開発ワークフローをより良くすることが私のミッションです。
            </p>
          </div>

          {/* Social Links */}
          <SocialIconBar className="max-md:justify-center" />
        </div>
      </div>

      {/* Engineering Principles */}
      <SectionHeader
        label="Engineering Principles"
        title="What I Value"
        descriptionEn="The compass that guides my engineering decisions."
        description="エンジニアリングにおいて大切にしていること。"
        className="mb-6 max-md:mb-6"
      />
      <ScrollRevealList className="mb-14 grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-4 max-md:grid-cols-2 max-[480px]:grid-cols-1">
        {PRINCIPLES.map((principle) => (
          <PrincipleCard key={principle.title} principle={principle} />
        ))}
      </ScrollRevealList>

      {/* Tech Stack / Toolbox */}
      <SectionHeader
        label="Toolbox"
        title="Tech Stack"
        descriptionEn="Tools of the trade."
        description="日々の開発で使っている技術とツール。"
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
