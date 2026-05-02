'use client';

import { ActionButton } from '@/components/action-button';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

interface LocaleErrorPageProps {
  readonly error: Error & { digest?: string };
  readonly unstable_retry: () => void;
}

export default function LocaleErrorPage({ error, unstable_retry }: LocaleErrorPageProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const t = useTranslations('ErrorPages.error');

  useEffect(() => {
    console.error('[LocaleErrorPage]', error);
  }, [error]);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section
      className={cn(
        'relative flex min-h-full items-center justify-center overflow-hidden',
        '[background:var(--hero-bg)]',
        'before:absolute before:inset-0',
        'before:bg-[image:radial-gradient(circle_at_1px_1px,var(--dot-color)_1px,transparent_0)]',
        'before:bg-[size:28px_28px]',
        'after:pointer-events-none after:absolute after:-top-[30%] after:-right-[10%]',
        'after:h-[600px] after:w-[600px]',
        'after:bg-[radial-gradient(ellipse,oklch(0.52_0.11_156/0.08)_0%,transparent_60%)]',
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[20%] -left-[10%] h-[500px] w-[500px] bg-[radial-gradient(ellipse,oklch(0.55_0.12_156/0.05)_0%,transparent_60%)]"
      />

      <div className="relative z-[1] max-w-[560px] px-6 text-center max-md:px-4">
        <p className="anim-up mb-1.5 font-mono text-xs uppercase tracking-[0.1em] text-primary">
          {'// '}
          {t('label')}
        </p>
        <p
          aria-hidden="true"
          className="anim-up anim-up-2 mb-3 bg-[image:var(--accent-gradient)] bg-clip-text font-mono text-[clamp(48px,10vw,80px)] font-extrabold leading-none tracking-[-0.04em] text-transparent"
        >
          Error
        </p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="anim-up anim-up-3 mb-3 text-[clamp(20px,3vw,28px)] font-bold tracking-[-0.02em]"
        >
          {t('title')}
        </h1>
        <p className="anim-up anim-up-3 mb-4 text-[15px] leading-[1.7] text-text-secondary">
          {t('description')}
        </p>
        {error.digest && (
          <p className="anim-up anim-up-3 mb-7 font-mono text-[11px] text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}

        <div className="anim-up anim-up-4 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={unstable_retry}
            className="inline-flex items-center gap-2 rounded-[9px] border-none bg-[image:var(--accent-gradient)] px-[22px] py-[11px] text-sm font-semibold text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-safe:hover:-translate-y-px hover:shadow-[var(--btn-primary-shadow)]"
          >
            {t('retry')}
          </button>
          <ActionButton href="/" variant="secondary">
            {t('home')}
          </ActionButton>
        </div>
      </div>
    </section>
  );
}
