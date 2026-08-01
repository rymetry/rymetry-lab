'use client';

import { ChevronDownIcon } from 'lucide-react';
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
    // DOM 上も本文より前に置く (page.tsx)。狭幅は自然順で本文上、lg はグリッドの order で右列へ —
    // 視覚順とフォーカス順を一致させる (order-first だと Tab 順が本文→TOC に逆転する)
    <aside className="lg:order-last lg:sticky lg:top-[100px] lg:max-h-[calc(100vh-7.5rem)] lg:overflow-y-auto">
      {/* 狭幅 (<1024px): 折りたたみ (デフォルト閉) を本文上に配置。
          mock は order:-1 で常時展開だが、本文を押し下げないアコーディオンを採用 */}
      <details className="group rounded-[4px] border border-border bg-card lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between p-[18px] font-mono text-xs font-semibold uppercase tracking-[0.05em] text-muted-foreground [&::-webkit-details-marker]:hidden">
          {label}
          <ChevronDownIcon
            aria-hidden="true"
            className="size-3.5 transition-transform duration-200 group-open:rotate-180"
          />
        </summary>
        <nav aria-label={label} className="px-[18px] pb-[18px]">
          <TocList items={items} activeId={activeId} />
        </nav>
      </details>

      {/* デスクトップ (lg 以上): sticky サイドバーカード */}
      <nav
        aria-label={label}
        className="hidden rounded-[4px] border border-border bg-card p-[18px] lg:block"
      >
        <p className="mb-3.5 font-mono text-xs font-semibold uppercase tracking-[0.05em] text-muted-foreground">
          {label}
        </p>
        <TocList items={items} activeId={activeId} />
      </nav>
    </aside>
  );
}

function TocList({
  items,
  activeId,
}: {
  readonly items: readonly ArticleTocItem[];
  readonly activeId: string | null;
}) {
  return (
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
                  : 'border-border text-text-secondary hover:text-foreground',
              )}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ol>
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
