'use client';

import { useEffect, useRef } from 'react';

import { ActionButton } from '@/components/action-button';
import { VortexWatermark } from '@/components/vortex-watermark';
import { cn } from '@/lib/utils';

interface ErrorContentProps {
  readonly error: Error & { digest?: string };
  readonly unstable_retry: () => void;
}

/**
 * root エラーページの本文。`error.tsx` は `RootDocument` で包むだけの薄い殻にしてある。
 *
 * **レイアウトは 404 (`not-found-content.tsx`) と同一で、差し替えるのは文言のみ。**
 * ラベル行 (`// ERROR`) とターミナル診断ブロックは 404 に無いので持たない。
 * 唯一 404 に無い要素が Error ID (digest) で、これは障害調査に必要なので残す。
 *
 * 本文を分けているのは Story のため。route コンポーネントを直接描画すると `<html>` が
 * Storybook のルート `<div>` の子になり、ハイドレーションエラーになる。
 */
export function ErrorContent({ error, unstable_retry }: ErrorContentProps) {
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
        'relative flex min-h-[calc(100vh-140px)] items-center justify-center overflow-hidden px-6 py-16',
        '[background:var(--hero-bg)]',
        // Dot-grid overlay
        'before:absolute before:inset-0',
        'before:bg-[image:radial-gradient(circle_at_1px_1px,var(--dot-color)_1px,transparent_0)]',
        'before:bg-[size:28px_28px]',
      )}
    >
      <div className="relative z-[1] max-w-[560px] px-6 text-center max-md:px-4">
        {/* 墨流し (vortex) — 見出し背後の透かし。404 とエラーページで共有 */}
        <VortexWatermark />

        {/* Error — decorative */}
        <p
          aria-hidden="true"
          className="anim-up anim-up-2 mb-3 bg-[image:var(--accent-gradient)] bg-clip-text font-brand text-[clamp(80px,15vw,140px)] font-extrabold leading-none tracking-[0.02em] text-transparent"
        >
          Error
        </p>

        {/* Heading + Description */}
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="anim-up anim-up-3 mb-3 text-[clamp(20px,3vw,28px)] font-bold tracking-[0.02em]"
        >
          Something Went Wrong
        </h1>
        <p
          className={cn(
            'anim-up anim-up-3 text-[15px] leading-[1.7] text-text-secondary',
            // digest がある時は Error ID 側が CTA 前の間隔を持つ
            error.digest ? 'mb-4' : 'mb-7',
          )}
        >
          予期しないエラーが発生しました。しばらくしてからもう一度お試しください。
        </p>
        {error.digest && (
          <p className="anim-up anim-up-3 mb-7 font-mono text-[11px] text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}

        {/* CTA */}
        <div className="anim-up anim-up-4 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={unstable_retry}
            className="font-brand inline-flex items-center gap-2 rounded-[3px] border-none bg-[image:var(--accent-gradient)] px-6 py-[11px] text-[14.5px] font-medium tracking-[0.05em] text-[#f4f1e6] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-safe:hover:-translate-y-px hover:shadow-[var(--btn-primary-shadow)]"
          >
            Retry
          </button>
          <ActionButton href="/" variant="secondary" localeAware={false}>
            Back to Home
          </ActionButton>
        </div>
      </div>
    </section>
  );
}
