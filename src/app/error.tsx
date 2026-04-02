'use client';

import { useEffect, useRef } from 'react';

import { ActionButton } from '@/components/action-button';
import { cn } from '@/lib/utils';

interface ErrorPageProps {
  readonly error: Error & { digest?: string };
  readonly unstable_retry: () => void;
}

export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // TODO: Replace with error reporting service (Sentry, etc.)
    console.error('[ErrorPage]', error);
  }, [error]);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section
      className={cn(
        'relative flex min-h-full items-center justify-center overflow-hidden',
        '[background:var(--hero-bg)]',
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

      <div className="relative z-[1] max-w-[560px] px-6 text-center max-md:px-4">
        {/* Label */}
        <p className="anim-up mb-1.5 font-mono text-xs uppercase tracking-[0.1em] text-primary">
          {'// '}ERROR
        </p>

        {/* Error — decorative */}
        <p
          aria-hidden="true"
          className="anim-up anim-up-2 mb-3 bg-[image:var(--accent-gradient)] bg-clip-text font-mono text-[clamp(48px,10vw,80px)] font-extrabold leading-none tracking-[-0.04em] text-transparent"
        >
          Error
        </p>

        {/* Heading + Description */}
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="anim-up anim-up-3 mb-3 text-[clamp(20px,3vw,28px)] font-bold tracking-[-0.02em]"
        >
          Something Went Wrong
        </h1>
        <p className="anim-up anim-up-3 mb-4 text-[15px] leading-[1.7] text-text-secondary">
          予期しないエラーが発生しました。しばらくしてからもう一度お試しください。
        </p>
        {error.digest && (
          <p className="anim-up anim-up-3 mb-7 font-mono text-[11px] text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}

        {/* Terminal diagnostic */}
        <div
          aria-hidden="true"
          className="anim-up anim-up-3 mx-auto mb-8 max-w-[400px] overflow-hidden rounded-[11px] border border-[var(--terminal-border)] bg-[var(--terminal-bg)] text-left shadow-[0_12px_32px_-8px_rgba(0,0,0,0.3)]"
        >
          {/* Traffic lights */}
          <div className="flex gap-[7px] border-b border-[var(--terminal-border)] px-[14px] py-[10px]">
            <div className="size-[11px] rounded-full bg-[#ef4444]" />
            <div className="size-[11px] rounded-full bg-[#eab308]" />
            <div className="size-[11px] rounded-full bg-[#22c55e]" />
          </div>
          <div className="px-[18px] py-[14px] font-mono text-xs leading-[1.8] text-[var(--terminal-text)]">
            <div className="t-line">
              <span className="text-[var(--terminal-prompt)]">~</span>{' '}
              <span className="text-[var(--terminal-cmd)]">bun run</span> start
            </div>
            <div className="t-line">
              <span className="text-[#ef4444]">Error</span>: Unexpected runtime exception
            </div>
            <div className="t-line">
              <span className="text-[var(--terminal-dim)]">{'\u2192'}</span> Process exited with
              code 1
            </div>
            <div className="t-line mt-2">
              <span className="text-[var(--terminal-prompt)]">~</span>
              <span
                aria-hidden="true"
                className="ml-[3px] inline-block h-[15px] w-[7px] align-middle [background:var(--terminal-cursor)] motion-safe:[animation:blink_1.2s_infinite]"
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="anim-up anim-up-4 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={unstable_retry}
            className="inline-flex items-center gap-2 rounded-[9px] border-none bg-[image:var(--accent-gradient)] px-[22px] py-[11px] text-sm font-semibold text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-safe:hover:-translate-y-px hover:shadow-[var(--btn-primary-shadow)]"
          >
            リトライ ↻
          </button>
          <ActionButton href="/" variant="secondary">
            ホームに戻る
          </ActionButton>
        </div>
      </div>
    </section>
  );
}
