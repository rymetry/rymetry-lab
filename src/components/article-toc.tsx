'use client';

import { useEffect, useState } from 'react';

import type { ArticleTocItem } from '@/lib/articles/content';
import { cn } from '@/lib/utils';

/** sticky ヘッダー (60px) + 余白ぶんのオフセット。heading 側の scroll-mt-24 と揃える */
const ACTIVE_LINE_OFFSET = 120;

interface ArticleTocProps {
  readonly items: readonly ArticleTocItem[];
  readonly label: string;
}

interface HeadingSnapshot {
  readonly id: string;
  readonly top: number;
}

interface ActiveHeadingInput {
  readonly headings: readonly HeadingSnapshot[];
  readonly viewportHeight: number;
  readonly scrollY: number;
  readonly documentHeight: number;
  readonly activeLineOffset?: number;
}

/**
 * 記事目次。スクロール位置に連動して現在読んでいる見出しをハイライトする
 * （モックの .toc-list a.active 相当)。レールは連続した左ボーダーで表現し、
 * アクティブ項目はアクセント色でレール上を移動する。
 */
export function ArticleToc({ items, label }: ArticleTocProps) {
  const activeId = useActiveHeading(items);

  return (
    <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto lg:block">
      <nav
        aria-label={label}
        className="rounded-[9px] border border-border bg-card p-4 shadow-[var(--card-shadow)]"
      >
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
          {label}
        </p>
        <ol>
          {items.map((item) => {
            const isActive = item.id === activeId;

            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  className={cn(
                    'block border-l-2 py-1 pl-3 text-[13px] leading-5 transition-colors duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card',
                    item.level === 3 && 'pl-6 text-[12.5px]',
                    isActive
                      ? 'border-primary font-medium text-primary'
                      : 'border-border text-text-secondary hover:border-[var(--border-hover)] hover:text-foreground',
                  )}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </aside>
  );
}

export function resolveActiveHeadingId({
  headings,
  viewportHeight,
  scrollY,
  documentHeight,
  activeLineOffset = ACTIVE_LINE_OFFSET,
}: ActiveHeadingInput): string | null {
  const firstHeading = headings[0];
  const lastHeading = headings[headings.length - 1];

  if (!firstHeading || !lastHeading) return null;

  const canScroll = documentHeight > viewportHeight + 2;
  const atPageBottom = canScroll && viewportHeight + scrollY >= documentHeight - 2;

  if (atPageBottom) return lastHeading.id;

  let currentId = firstHeading.id;
  for (const heading of headings) {
    if (heading.top > activeLineOffset) break;
    currentId = heading.id;
  }

  return currentId;
}

/**
 * ビューポート上部のアクティブ判定ラインを最後に通過した見出し id を返す。
 * 上下どちらのスクロールでも決定的に動くよう、rAF スロットルした
 * scroll ハンドラで見出し位置を評価する（対象は h2/h3 の数個なので軽量)。
 * ページ末尾までスクロールした場合は最後の見出しをアクティブにする。
 */
function useActiveHeading(items: readonly ArticleTocItem[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    let ticking = false;

    const updateActiveHeading = () => {
      ticking = false;

      setActiveId(
        resolveActiveHeadingId({
          headings: headings.map((heading) => ({
            id: heading.id,
            top: heading.getBoundingClientRect().top,
          })),
          viewportHeight: window.innerHeight,
          scrollY: window.scrollY,
          documentHeight: document.documentElement.scrollHeight,
        }),
      );
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateActiveHeading);
    };

    updateActiveHeading();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [items]);

  return activeId;
}
