import { describe, expect, test } from 'bun:test';
import { CodeIcon } from 'lucide-react';
import { NextIntlClientProvider } from 'next-intl';
import { renderToString } from 'react-dom/server';

import type { ArticleDetail } from '@/types/article';

import enMessages from '../../../../../messages/en.json';
import jaMessages from '../../../../../messages/ja.json';
import { ArticleFooter } from './article-footer';

function article(slug: string, title: string, publishedAt: string): ArticleDetail {
  return {
    slug,
    title,
    description: `${title} description`,
    excerpt: `${title} excerpt`,
    content: '<p>body</p>',
    ogpImage: {
      url: `https://images.microcms-assets.io/assets/test/${slug}.png`,
      width: 1200,
      height: 630,
    },
    publishedAt,
    updatedAt: publishedAt,
    readingTime: '1 min',
    tags: [
      {
        label: 'React',
        category: 'frontend',
        icon: CodeIcon,
      },
    ],
  };
}

describe('ArticleFooter', () => {
  test('renders previous and next article labels from the design mock', () => {
    const html = renderToString(
      <NextIntlClientProvider locale="en" messages={{}}>
        <ArticleFooter
          relatedArticles={[]}
          previousArticle={article('older', 'Older article title', '2026-04-03')}
          nextArticle={article('newer', 'Newer article title', '2026-04-05')}
          navigationLabel="Article navigation"
          previousLabel="Previous Article"
          nextLabel="Next Article"
          relatedTitle="Related Articles"
          relatedDescription="Selected articles"
        />
      </NextIntlClientProvider>,
    );

    expect(html).toContain('Previous Article');
    expect(html).toContain('Next Article');
    expect(html).toContain('Older article title');
    expect(html).toContain('Newer article title');
    expect(html).not.toContain('Newer article</span>');
    expect(html).not.toContain('Older article</span>');
  });

  test('renders nav entries with the same thumbnail card structure as related articles', () => {
    const html = renderToString(
      <NextIntlClientProvider locale="en" messages={{}}>
        <ArticleFooter
          relatedArticles={[]}
          previousArticle={article('previous', 'Previous title', '2026-04-05')}
          nextArticle={article('next', 'Next title', '2026-04-03')}
          navigationLabel="Article navigation"
          previousLabel="Previous Article"
          nextLabel="Next Article"
          relatedTitle="Related Articles"
          relatedDescription="Selected articles"
        />
      </NextIntlClientProvider>,
    );

    expect(html.match(/grid-cols-\[minmax\(140px,220px\)_1fr\]/g)).toHaveLength(2);
    expect(html.match(/min-h-\[120px\] border-r border-border/g)).toHaveLength(2);
  });

  /**
   * Prev/Next だけ `md:grid-cols-2` で圧縮され、>=768px の箱比が 0.92-1.83 と content 依存で
   * 揺れる。広帯に 1.83 を要求すると密度が現行を下回るため、この surface だけ現行の 1.5
   * (480x320) を保つ split-nav プロファイルを使う。Related は標準 (660x360) のまま。
   */
  test('uses the split-nav thumbnail profile only for the prev/next cards', () => {
    const html = renderToString(
      <NextIntlClientProvider locale="en" messages={{}}>
        <ArticleFooter
          relatedArticles={[article('related', 'Related title', '2026-04-01')]}
          previousArticle={article('previous', 'Previous title', '2026-04-05')}
          nextArticle={article('next', 'Next title', '2026-04-03')}
          navigationLabel="Article navigation"
          previousLabel="Previous Article"
          nextLabel="Next Article"
          relatedTitle="Related Articles"
          relatedDescription="Selected articles"
        />
      </NextIntlClientProvider>,
    );

    // <picture> ごとに切り出してから探す (カードを跨いで正規表現を貪欲に伸ばさないため)
    const wideCropBySlug = new Map(
      html
        .split('<picture>')
        .slice(1)
        .map((block) => block.split('</picture>')[0] ?? '')
        .map((picture) => {
          const slug = picture.match(/assets%2Ftest%2F([a-z]+)\.png/)?.[1];
          const fallbackImg = picture.match(/<img\s[^>]*>/)?.[0].replaceAll('&amp;', '&');
          const crop = fallbackImg
            ?.match(/%3Fw%3D(\d+)%26h%3D(\d+)/)
            ?.slice(1, 3)
            .join('x');
          return [slug, crop] as const;
        }),
    );
    const wideCrop = (slug: string): string | undefined => wideCropBySlug.get(slug);

    expect(wideCrop('related')).toBe('660x360');
    expect(wideCrop('previous')).toBe('480x320');
    expect(wideCrop('next')).toBe('480x320');
  });

  test('describes related articles as manually selected entries, not tag matches', () => {
    expect(jaMessages.Articles.detail.relatedDescription).toBe(
      'この記事に関連して選択された記事をピックアップしています。',
    );
    expect(enMessages.Articles.detail.relatedDescription).toBe(
      'Curated articles selected for this post.',
    );
  });
});
