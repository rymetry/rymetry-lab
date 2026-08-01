'use client';

import { ActionButton } from '@/components/action-button';
import { InkImage, InkPreload, PageInk } from '@/components/ink-image';
import { Terminal } from '@/components/terminal';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface HeroSectionProps {
  /**
   * main = 墨流し画像をメインビジュアルに (プロトタイプ default)。
   * background = 透かし + ターミナル表示。
   */
  readonly heroInk?: 'main' | 'background';
  /** 日本語タグライン「作って、確かめて、書き残す。」の表示 (default OFF) */
  readonly jaLine?: boolean;
}

export function HeroSection({ heroInk = 'main', jaLine = false }: HeroSectionProps) {
  const t = useTranslations('Home.hero');

  return (
    <section
      className={cn(
        'relative overflow-hidden pt-[84px] pb-[68px]',
        '[background:var(--hero-bg)]',
        'max-lg:pt-16 max-lg:pb-12',
        'max-md:pt-12 max-md:pb-10',
        // Dot-grid overlay
        'before:absolute before:inset-0',
        'before:bg-[image:radial-gradient(circle_at_1px_1px,var(--dot-color)_1px,transparent_0)]',
        'before:bg-[size:28px_28px]',
      )}
    >
      {/* 狭幅 (<lg) は 1 カラム。main モードでは右上コーナーの墨流し透かしに切り替える */}
      {heroInk === 'main' && <PageInk className="lg:hidden" />}

      <div className="relative z-[1] mx-auto grid max-w-[1200px] grid-cols-2 items-center gap-12 px-6 max-lg:grid-cols-1 max-lg:gap-8 max-md:px-4">
        {/* Left: text */}
        <div>
          <h1 className="anim-up mb-[18px] text-[clamp(30px,4.4vw,52px)] font-bold leading-[1.28] tracking-[0.01em] max-[480px]:text-[28px]">
            {t('line1')}
            <br />
            <span className="bg-[image:var(--accent-gradient)] bg-clip-text text-transparent">
              {t('line2')}
            </span>
          </h1>

          {jaLine && (
            <p className="anim-fade mb-1 font-brand text-[clamp(17px,2vw,21px)] font-medium tracking-[0.14em] text-text-secondary">
              {t('jaLine')}
            </p>
          )}

          <p className="anim-up anim-up-2 mt-[18px] mb-7 max-w-[520px] text-[15.5px] leading-[1.85] text-text-secondary">
            {t('description')}
          </p>

          <div className="anim-up anim-up-3 flex gap-3">
            <ActionButton href="/projects" variant="primary">
              {t('projects')} →
            </ActionButton>
            <ActionButton href="/articles" variant="secondary">
              {t('articles')}
            </ActionButton>
          </div>
        </div>

        {/* Right: 墨流しメイン or ターミナル (デスクトップのみ) */}
        {heroInk === 'main' ? (
          <div aria-hidden="true" className="relative min-h-[480px] max-lg:hidden">
            {/* LCP 対策: デスクトップ (lg 以上) のみ先読み。モバイルはこのカラム自体が
                非表示 (PageInk が別サイズで出る) ため media で preload を限定する。
                dev の「LCP image, add loading=eager」警告は既知 — eager/priority にすると
                モバイルで非表示分 ~186KB を余計にフェッチするため意図的に lazy のまま */}
            <InkPreload kind="flow" sizes="1120px" media="(min-width: 1024px)" />
            <InkImage
              kind="flow"
              className={cn(
                'pointer-events-none absolute -top-[15%] -right-[10%] -z-10 h-[130%] w-[clamp(640px,60vw,1120px)] max-w-none object-contain object-[right_center]',
                'opacity-[0.98] dark:opacity-100 dark:[filter:drop-shadow(0_0_22px_rgba(234,232,220,0.16))]',
                'motion-safe:[animation:float_9s_ease-in-out_infinite]',
              )}
              sizes="1120px"
            />
          </div>
        ) : (
          <div className="relative flex min-h-[380px] items-center justify-end max-lg:min-h-0 max-lg:justify-center">
            <InkImage
              kind="flow"
              className={cn(
                'pointer-events-none absolute inset-[-6%_-4%] -z-10 h-[112%] w-[108%] object-contain object-[center_right]',
                'opacity-95 dark:opacity-100 dark:[filter:drop-shadow(0_0_22px_rgba(234,232,220,0.16))]',
              )}
              sizes="640px"
            />
            <Terminal>
              <div className="t-line">
                <span className="text-[var(--terminal-prompt)]">~</span>{' '}
                <span className="text-[var(--terminal-cmd)]">whoami</span>
              </div>
              <div className="t-line">
                <span className="text-[var(--terminal-highlight)]">Rym</span>
                {` — ${t('role')}`}
              </div>
              <div className="t-line mt-[10px]">
                <span className="text-[var(--terminal-prompt)]">~</span>{' '}
                <span className="text-[var(--terminal-cmd)]">cat {t('latestLog')}</span>
              </div>
              <div className="t-line">
                <span className="text-[var(--terminal-dim)]">[build]</span>
                {` ${t('buildMetric')} → `}
                <span className="text-[var(--terminal-success)]">{t('buildResult')}</span>
              </div>
              <div className="t-line">
                <span className="text-[var(--terminal-dim)]">[prove]</span>
                {` ${t('proveMetric')}: `}
                <span className="text-[var(--terminal-success)]">{t('proveResult')}</span>
              </div>
              <div className="t-line">
                <span className="text-[var(--terminal-dim)]">[write]</span>
                {` ${t('writeMetric')}: `}
                <span className="text-[var(--terminal-highlight)]">
                  &quot;{t('writeResult')}&quot;
                </span>
              </div>
              <div className="t-line mt-[10px]">
                <span className="text-[var(--terminal-prompt)]">~</span>{' '}
                <span className="text-[var(--terminal-cmd)]">{t('missionCommand')}</span>
              </div>
              <div className="t-line">
                <span className="text-[var(--terminal-success)]">
                  ● {t('line1')} {t('line2')}
                </span>
              </div>
              <div className="t-line mt-[10px]">
                <span className="text-[var(--terminal-prompt)]">~</span>
                <span
                  aria-hidden="true"
                  className="ml-[3px] inline-block h-[15px] w-[7px] align-middle [background:var(--terminal-cursor)] motion-safe:[animation:blink_1.2s_infinite]"
                />
              </div>
            </Terminal>
          </div>
        )}
      </div>
    </section>
  );
}
