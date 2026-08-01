import { ActionButton } from '@/components/action-button';
import { InkImage } from '@/components/ink-image';
import { cn } from '@/lib/utils';

export default function NotFound() {
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
        {/* 墨流し (vortex) — 見出し背後の透かし (mock 準拠: コンテンツボックス基準。[locale] 版と同一) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[22%] -z-[1] h-[620px] -translate-x-[64.5%] -translate-y-[40%] opacity-[0.15] dark:opacity-[0.22]"
        >
          <InkImage kind="vortex" className="h-full w-auto max-w-none" sizes="1100px" />
        </div>

        {/* 404 — decorative */}
        <p
          aria-hidden="true"
          className="anim-up anim-up-2 mb-3 bg-[image:var(--accent-gradient)] bg-clip-text font-brand text-[clamp(80px,15vw,140px)] font-extrabold leading-none tracking-[0.02em] text-transparent"
        >
          404
        </p>

        {/* Heading + Description */}
        <h1
          tabIndex={-1}
          autoFocus
          className="anim-up anim-up-3 mb-3 text-[clamp(20px,3vw,28px)] font-bold tracking-[0.02em]"
        >
          Page Not Found
        </h1>
        <p className="anim-up anim-up-3 mb-7 text-[15px] leading-[1.7] text-text-secondary">
          お探しのページは存在しないか、移動された可能性があります。
        </p>

        {/* CTA */}
        <div className="anim-up anim-up-4 flex flex-wrap justify-center gap-3">
          <ActionButton href="/" variant="primary" localeAware={false}>
            Back to Home
          </ActionButton>
          <ActionButton href="/articles" variant="secondary" localeAware={false}>
            Browse Articles
          </ActionButton>
        </div>
      </div>
    </section>
  );
}
