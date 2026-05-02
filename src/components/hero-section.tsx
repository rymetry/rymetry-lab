'use client';

import { ActionButton } from '@/components/action-button';
import { Terminal } from '@/components/terminal';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('Home.hero');

  return (
    <section
      className={cn(
        'relative overflow-hidden pt-20 pb-16',
        '[background:var(--hero-bg)]',
        'max-lg:pt-16 max-lg:pb-12',
        'max-md:pt-12 max-md:pb-10',
        // Dot-grid overlay
        'before:absolute before:inset-0',
        'before:bg-[image:radial-gradient(circle_at_1px_1px,var(--dot-color)_1px,transparent_0)]',
        'before:bg-[size:28px_28px]',
        // Top-right mesh blob
        'after:pointer-events-none after:absolute after:-top-[30%] after:-right-[10%]',
        'after:h-[600px] after:w-[600px]',
        'after:bg-[radial-gradient(ellipse,oklch(0.52_0.11_156/0.08)_0%,transparent_60%)]',
      )}
    >
      {/* Bottom-left mesh blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[20%] -left-[10%] h-[500px] w-[500px] bg-[radial-gradient(ellipse,oklch(0.55_0.12_156/0.05)_0%,transparent_60%)]"
      />

      <div className="relative z-[1] mx-auto grid max-w-[1200px] grid-cols-2 items-center gap-12 px-6 max-lg:gap-8 max-md:grid-cols-1 max-md:px-4">
        {/* Left: text */}
        <div>
          <h1 className="anim-up mb-[18px] text-[clamp(34px,4.5vw,54px)] font-extrabold leading-[1.12] tracking-[-0.035em] max-[480px]:text-[28px]">
            {t('line1')}
            <br />
            <span className="bg-[image:var(--accent-gradient)] bg-clip-text text-transparent">
              {t('line2')}
            </span>
          </h1>

          <p className="anim-up anim-up-2 mb-7 text-base leading-[1.8] text-text-secondary">
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

          {/* Mobile mini terminal — visible only below md */}
          <Terminal compact className="anim-up anim-up-4 mt-6 hidden max-md:block">
            <span className="text-[var(--terminal-prompt)]">~</span>{' '}
            <span className="text-[var(--terminal-highlight)]">Rym</span>
            {` — ${t('role')}`}
            <br />
            <span className="text-[var(--terminal-prompt)]">~</span>
            {` ${t('line1')} ${t('line2')}`}
          </Terminal>
        </div>

        {/* Right: terminal — hidden below md */}
        <div className="flex justify-end max-md:hidden">
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
      </div>
    </section>
  );
}
