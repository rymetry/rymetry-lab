import { describe, expect, test } from 'bun:test';
import { CodeIcon } from 'lucide-react';
import { NextIntlClientProvider } from 'next-intl';
import { renderToString } from 'react-dom/server';

import type { Article } from '@/types/article';

import { ArticleCard, type ListThumbnailProfile } from './article-card';

function article(overrides: Partial<Article> = {}): Article {
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
    ...overrides,
  };
}

function render(
  variant: 'grid' | 'list',
  options: { listThumbnailProfile?: ListThumbnailProfile; article?: Article } = {},
): string {
  return renderToString(
    <NextIntlClientProvider locale="ja" messages={{}}>
      <ArticleCard
        article={options.article ?? article()}
        variant={variant}
        {...(options.listThumbnailProfile
          ? { listThumbnailProfile: options.listThumbnailProfile }
          : {})}
      />
    </NextIntlClientProvider>,
  );
}

/** SSR は属性値の `<` `&` をエスケープするため、比較前に戻す */
function unescapeAttribute(value: string): string {
  return value.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
}

function attribute(tag: string, name: string): string {
  const match = tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'));
  return match?.[1] === undefined ? '' : unescapeAttribute(match[1]);
}

/** srcset の先頭候補が要求している microCMS のクロップ (`WxH`) を取り出す */
function requestedCrop(srcSet: string): string {
  const candidate = srcSet.split(',')[0]?.trim().split(/\s+/)[0];
  if (!candidate) throw new Error(`no srcset candidate in "${srcSet}"`);

  const optimizerUrl = new URL(candidate, 'http://localhost');
  const source = optimizerUrl.searchParams.get('url');
  if (!source) throw new Error(`no url param in "${candidate}"`);

  const params = new URL(source, 'http://localhost').searchParams;
  const width = params.get('w');
  const height = params.get('h');

  return width && height
    ? `${width}x${height}:${params.get('fit')}:${params.get('crop')}`
    : 'no-crop';
}

interface ThumbnailSource {
  readonly media: string;
  readonly sizes: string;
  readonly crop: string;
}

interface ParsedThumbnail {
  readonly sources: readonly ThumbnailSource[];
  readonly img: {
    readonly alt: string;
    readonly sizes: string;
    readonly crop: string;
    readonly loading: string;
    readonly decoding: string;
    readonly className: string;
    readonly style: string;
  };
  readonly hasPicture: boolean;
}

function parseThumbnail(html: string): ParsedThumbnail {
  const picture = html.match(/<picture>(.*?)<\/picture>/s)?.[1];
  const scope = picture ?? html;

  const imgTag = scope.match(/<img\s[^>]*>/i)?.[0];
  if (!imgTag) throw new Error('no <img> rendered');

  return {
    hasPicture: picture !== undefined,
    sources: [...scope.matchAll(/<source\s[^>]*>/gi)].map((match) => ({
      media: attribute(match[0], 'media'),
      sizes: attribute(match[0], 'sizes'),
      crop: requestedCrop(attribute(match[0], 'srcSet')),
    })),
    img: {
      alt: attribute(imgTag, 'alt'),
      sizes: attribute(imgTag, 'sizes'),
      crop: requestedCrop(attribute(imgTag, 'srcSet')),
      loading: attribute(imgTag, 'loading'),
      decoding: attribute(imgTag, 'decoding'),
      className: attribute(imgTag, 'class'),
      style: attribute(imgTag, 'style'),
    },
  };
}

/**
 * list サムネの表示ボックス比は viewport 帯ごとに違う (2026-08-02 に実入稿画像 11 件で実測)。
 * 単一 URL では両立しないため、`<picture>` + `<source media>` で帯ごとに別クロップを要求する。
 * 帯の境界は Tailwind 側の列幅 (`max-[480px]` / `max-md`) と同じ排他レンジで書く。
 */
describe('ArticleCard list thumbnail art direction', () => {
  test('renders a picture with one source per narrow band and a fallback img', () => {
    const thumbnail = parseThumbnail(render('list'));

    expect(thumbnail.hasPicture).toBe(true);
    expect(thumbnail.sources).toHaveLength(2);
  });

  test('requests a crop matching each band measured display-box ratio', () => {
    const thumbnail = parseThumbnail(render('list'));

    // <480px は箱比 0.43-0.59、480-767px は 0.83、>=768px は 1.83 (実測)
    expect(thumbnail.sources[0]).toEqual({
      media: '(width < 480px)',
      sizes: '80px',
      crop: '240x400:crop:entropy',
    });
    expect(thumbnail.sources[1]).toEqual({
      media: '(width >= 480px) and (width < 48rem)',
      sizes: '100px',
      crop: '300x360:crop:entropy',
    });
    expect(thumbnail.img.sizes).toBe('220px');
    expect(thumbnail.img.crop).toBe('660x360:crop:entropy');
  });

  test('declares non-overlapping media conditions so source order cannot silently change the crop', () => {
    const { sources } = parseThumbnail(render('list'));
    const boundaries = [320, 375, 479, 480, 600, 767, 768, 1280];

    for (const width of boundaries) {
      const matching = sources.filter((source) => matchesWidth(source.media, width));
      expect({ width, matching: matching.length }).toEqual({
        width,
        matching: width < 768 ? 1 : 0,
      });
    }
  });

  test('never uses inclusive max-width boundaries at the column switch points', () => {
    const thumbnail = parseThumbnail(render('list'));
    const declarations = [...thumbnail.sources.map((s) => s.media), thumbnail.img.sizes].join(' ');

    expect(declarations).not.toContain('max-width: 480px');
    expect(declarations).not.toContain('max-width: 768px');
  });

  test('keeps the fallback img absolute-fill, lazy and decorative', () => {
    const { img } = parseThumbnail(render('list'));

    expect(img.alt).toBe('');
    expect(img.loading).toBe('lazy');
    expect(img.decoding).toBe('async');
    expect(img.className).toContain('object-cover');
    expect(img.style).toContain('position:absolute');
    expect(img.style).toContain('height:100%');
    expect(img.style).toContain('width:100%');
  });

  /**
   * Prev/Next だけは `max-w-[1040px]` 内の `md:grid-cols-2` で圧縮され、>=768px でも箱比が
   * 0.92-1.83 と content 依存で揺れる (実測)。密度 = (配信幅/箱幅) × min(1, 箱比/要求比) なので
   * 「どの箱比でも現行を下回らない」条件は要求比 <= 1.5。よって広帯は現行 480x320 を維持する。
   */
  describe('split-nav profile', () => {
    test('keeps the current 1.5 crop on the wide band', () => {
      const thumbnail = parseThumbnail(render('list', { listThumbnailProfile: 'split-nav' }));

      expect(thumbnail.img.sizes).toBe('220px');
      expect(thumbnail.img.crop).toBe('480x320:crop:entropy');
    });

    test('shares the narrow bands with the standard profile', () => {
      const standard = parseThumbnail(render('list'));
      const splitNav = parseThumbnail(render('list', { listThumbnailProfile: 'split-nav' }));

      expect(splitNav.sources).toHaveLength(2);
      expect(splitNav.sources).toEqual(standard.sources);
    });
  });

  test('passes non-microCMS sources through unchanged on every band', () => {
    const thumbnail = parseThumbnail(
      render('list', {
        article: article({
          ogpImage: { url: '/images/ink/ink-fine-light.png', width: 1200, height: 630 },
        }),
      }),
    );

    expect(thumbnail.sources.map((source) => source.crop)).toEqual(['no-crop', 'no-crop']);
    expect(thumbnail.img.crop).toBe('no-crop');
  });
});

describe('ArticleCard thumbnails outside the list art direction', () => {
  test('keeps the grid variant on a single img with its own sizes preset', () => {
    const thumbnail = parseThumbnail(render('grid'));

    expect(thumbnail.hasPicture).toBe(false);
    expect(thumbnail.sources).toHaveLength(0);
    expect(thumbnail.img.sizes).toBe(
      '(width < 48rem) 100vw, (width < 64rem) 50vw, (width < 1200px) 32vw, 371px',
    );
    expect(thumbnail.img.crop).toBe('960x400:crop:entropy');
  });

  test('keeps the ink fallback when the article has no ogpImage', () => {
    const html = render('list', { article: article({ ogpImage: undefined }) });

    // InkImage は next/image 経由なので最適化 URL にエンコードされて出る
    expect(html).not.toContain('<picture>');
    expect(html).toContain(encodeURIComponent('/images/ink/ink-fine-light.png'));
    expect(html).toContain(encodeURIComponent('/images/ink/ink-fine-dark.png'));
  });
});

/** `(width < 480px)` / `(width >= 480px) and (width < 48rem)` を評価する (1rem = 16px) */
function matchesWidth(media: string, width: number): boolean {
  const toPx = (value: string): number =>
    value.endsWith('rem') ? Number.parseFloat(value) * 16 : Number.parseFloat(value);

  return media
    .split(' and ')
    .map((clause) => clause.trim().replace(/^\(|\)$/g, ''))
    .every((clause) => {
      const parsed = clause.match(/^width\s*(<=|>=|<|>)\s*(\S+)$/);
      if (!parsed?.[1] || !parsed[2]) throw new Error(`unsupported media clause "${clause}"`);

      const bound = toPx(parsed[2]);
      if (parsed[1] === '<') return width < bound;
      if (parsed[1] === '<=') return width <= bound;
      if (parsed[1] === '>') return width > bound;
      return width >= bound;
    });
}
