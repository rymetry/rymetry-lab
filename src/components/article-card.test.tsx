import { describe, expect, test } from 'bun:test';
import { CodeIcon } from 'lucide-react';
import { NextIntlClientProvider } from 'next-intl';
import { renderToString } from 'react-dom/server';

import type { Article } from '@/types/article';

import { ArticleCard } from './article-card';

function article(): Article {
  return {
    slug: 'github-actions-cache',
    title: 'GitHub Actions のキャッシュ戦略を徹底的に最適化する',
    publishedAt: '2026-03-15',
    updatedAt: '2026-03-20',
    readingTime: '8 min',
    tags: [{ label: 'CI/CD', category: 'infra', icon: CodeIcon }],
    ogpImage: {
      url: 'https://images.microcms-assets.io/assets/test/github-actions-cache.png',
      width: 1200,
      height: 630,
    },
  };
}

function render(variant: 'grid' | 'list'): string {
  return renderToString(
    <NextIntlClientProvider locale="ja" messages={{}}>
      <ArticleCard article={article()} variant={variant} />
    </NextIntlClientProvider>,
  );
}

/** SSR は属性値の `<` を `&lt;` にエスケープするため、比較前に戻す */
function sizesAttribute(html: string): string {
  const match = html.match(/sizes="([^"]*)"/);
  if (!match?.[1]) throw new Error('no sizes attribute rendered');
  return match[1].replaceAll('&lt;', '<');
}

/**
 * list variant のサムネ列幅は Tailwind の `max-[480px]` / `max-md` で切り替わる。
 * Tailwind v4 の `max-*` は排他レンジ (`max-md` = `(width < 48rem)`) なので、
 * `sizes` も同じ排他レンジで書かないと境界ちょうど (768px) で申告値だけが
 * 1 段狭いまま実サムネ 220px を描くことになり、選ばれる候補が足りなくなる。
 * `max-md` は rem、`max-[480px]` は px 由来なので単位もそれぞれに合わせる。
 */
describe('ArticleCard list thumbnail sizes', () => {
  test('declares exclusive-range breakpoints matching the Tailwind column widths', () => {
    expect(sizesAttribute(render('list'))).toBe(
      '(width < 480px) 80px, (width < 48rem) 100px, 220px',
    );
  });

  test('never uses inclusive max-width boundaries at the column switch points', () => {
    const sizes = sizesAttribute(render('list'));

    expect(sizes).not.toContain('max-width: 480px');
    expect(sizes).not.toContain('max-width: 768px');
  });

  test('keeps the grid variant on its own preset', () => {
    expect(sizesAttribute(render('grid'))).toBe(
      '(width < 48rem) 100vw, (width < 64rem) 50vw, (width < 1200px) 32vw, 371px',
    );
  });
});
