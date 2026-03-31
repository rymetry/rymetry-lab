import { ActionButton } from '@/components/action-button';
import { cn } from '@/lib/utils';

export function HeroSection() {
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
            Build it. Prove it.
            <br />
            <span className="bg-[image:var(--accent-gradient)] bg-clip-text text-transparent">
              Write about it.
            </span>
          </h1>

          <p className="anim-up anim-up-2 mb-7 text-base leading-[1.8] text-text-secondary">
            開発したツールや検証した技術、そこから得た学びを、再現性のあるナレッジとして発信しています。プロダクティビティエンジニアリングの現場から、実践的な知見をお届けします。
          </p>

          <div className="anim-up anim-up-3 flex gap-3">
            <ActionButton href="/projects" variant="primary">
              Projects →
            </ActionButton>
            <ActionButton href="/articles" variant="secondary">
              Articles
            </ActionButton>
          </div>

          {/* Mobile mini terminal — visible only below md */}
          <div
            aria-hidden="true"
            className="anim-up anim-up-4 mt-6 hidden rounded-[9px] border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-[18px] py-[14px] font-mono text-xs leading-[1.6] text-[var(--terminal-text)] max-md:block"
          >
            <span className="text-[var(--terminal-prompt)]">~</span>{' '}
            <span className="text-[var(--terminal-highlight)]">Rym</span>
            {' — Productivity Engineer'}
            <br />
            <span className="text-[var(--terminal-prompt)]">~</span>
            {' Build it. Prove it. Write about it.'}
          </div>
        </div>

        {/* Right: terminal — hidden below md */}
        <div className="flex justify-end max-md:hidden">
          <div
            aria-hidden="true"
            className="w-full max-w-[460px] overflow-hidden rounded-[11px] border border-[var(--terminal-border)] bg-[var(--terminal-bg)] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.03)_inset] motion-safe:[animation:float_6s_ease-in-out_infinite]"
          >
            {/* Traffic lights */}
            <div className="flex gap-[7px] border-b border-[var(--terminal-border)] px-[14px] py-[10px]">
              <div className="size-[11px] rounded-full bg-[#ef4444]" />
              <div className="size-[11px] rounded-full bg-[#eab308]" />
              <div className="size-[11px] rounded-full bg-[#22c55e]" />
            </div>

            <div className="p-[18px] font-mono text-[12.5px] leading-[1.8] text-[var(--terminal-text)]">
              <div className="t-line">
                <span className="text-[var(--terminal-prompt)]">~</span>{' '}
                <span className="text-[var(--terminal-cmd)]">whoami</span>
              </div>
              <div className="t-line">
                <span className="text-[var(--terminal-highlight)]">Rym</span>
                {' — Productivity Engineer'}
              </div>
              <div className="t-line mt-[10px]">
                <span className="text-[var(--terminal-prompt)]">~</span>{' '}
                <span className="text-[var(--terminal-cmd)]">cat latest.log</span>
              </div>
              <div className="t-line">
                <span className="text-[var(--terminal-dim)]">[build]</span>
                {' CI/CD Pipeline Optimizer → '}
                <span className="text-[var(--terminal-success)]">70% faster</span>
              </div>
              <div className="t-line">
                <span className="text-[var(--terminal-dim)]">[prove]</span>
                {' Cache hit rate: '}
                <span className="text-[var(--terminal-success)]">94.2%</span>
              </div>
              <div className="t-line">
                <span className="text-[var(--terminal-dim)]">[write]</span>
                {' Published: '}
                <span className="text-[var(--terminal-highlight)]">
                  &quot;GitHub Actions Cache Guide&quot;
                </span>
              </div>
              <div className="t-line mt-[10px]">
                <span className="text-[var(--terminal-prompt)]">~</span>{' '}
                <span className="text-[var(--terminal-cmd)]">echo $MISSION</span>
              </div>
              <div className="t-line">
                <span className="text-[var(--terminal-success)]">
                  ● Build it. Prove it. Write about it.
                </span>
              </div>
              <div className="t-line mt-[10px]">
                <span className="text-[var(--terminal-prompt)]">~</span>
                <span
                  aria-hidden="true"
                  className="ml-[3px] inline-block h-[15px] w-[7px] align-middle [background:var(--terminal-cursor)] motion-safe:[animation:blink_1.2s_infinite]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
