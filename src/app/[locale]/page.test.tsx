import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from 'bun:test';
import { NextIntlClientProvider, createTranslator } from 'next-intl';
import { renderToString } from 'react-dom/server';

import type { CMSArticle } from '@/lib/cms/types';

import jaMessages from '../../../messages/ja.json';

type ArticlesPageContent = {
  readonly articles: readonly CMSArticle[];
  readonly tags: readonly never[];
};

/**
 * Home のグレースフルデグラデーション検証のため、通信層をテストごとに差し替える。
 * (実モジュールは 'server-only' を import するため bun test では読み込めない)
 * 変換 (adaptArticles) はモックしない — 検証エラーが握り潰されないことも確認するため。
 */
let getCachedArticlesPageContent: () => Promise<ArticlesPageContent>;

mock.module('./articles/articles-cache', () => ({
  getCachedArticlesPageContent: () => getCachedArticlesPageContent(),
}));

mock.module('next-intl/server', () => ({
  getTranslations: (namespace?: string | { readonly namespace?: string }) =>
    Promise.resolve(
      createTranslator({
        locale: 'ja',
        messages: jaMessages,
        namespace: (typeof namespace === 'string' ? namespace : namespace?.namespace) as never,
      }),
    ),
  setRequestLocale: () => {},
}));

function cmsArticleFixture(slug: string, title: string, overrides: Partial<CMSArticle> = {}) {
  return {
    id: slug,
    createdAt: '2026-04-01T00:00:00.000Z',
    updatedAt: '2026-04-01T00:00:00.000Z',
    publishedAt: '2026-04-01T00:00:00.000Z',
    slug,
    title,
    excerpt: `${title} excerpt`,
    content: '<p>body</p>',
    ogpImage: {
      url: 'https://images.microcms-assets.io/assets/test/ogp.png',
      width: 1200,
      height: 630,
    },
    tags: [
      {
        id: 'tag-frontend',
        createdAt: '2026-04-01T00:00:00.000Z',
        updatedAt: '2026-04-01T00:00:00.000Z',
        name: 'React',
        category: 'frontend',
      },
    ],
    ...overrides,
  } as CMSArticle;
}

function resolveWith(articles: readonly CMSArticle[]) {
  return () => Promise.resolve({ articles, tags: [] as readonly never[] });
}

async function renderHome(): Promise<string> {
  const { default: Home } = await import('./page');
  const page = await Home({ params: Promise.resolve({ locale: 'ja' as const }) });

  return renderToString(
    <NextIntlClientProvider locale="ja" messages={jaMessages}>
      {page}
    </NextIntlClientProvider>,
  );
}

describe('Home graceful degradation', () => {
  let consoleErrorSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    consoleErrorSpy = spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  /** Home 実装のサーバーログのみ抽出 (React SSR 警告等の console.error と区別する) */
  function homeErrorLogs(): unknown[][] {
    return consoleErrorSpy.mock.calls.filter(
      (call: unknown[]) =>
        typeof call[0] === 'string' && call[0].startsWith('[Home] microCMS fetch failed'),
    );
  }

  test('renders Hero and Featured Work without Recent Articles when the CMS fetch fails', async () => {
    getCachedArticlesPageContent = () => Promise.reject(new Error('microCMS down'));

    const html = await renderHome();

    expect(html).toContain(jaMessages.Home.featuredProjects.title);
    expect(html).not.toContain(jaMessages.Home.recentArticles.title);
    expect(homeErrorLogs()).not.toBeEmpty();
  });

  test('hides the section when the CMS returns no articles', async () => {
    getCachedArticlesPageContent = resolveWith([]);

    const html = await renderHome();

    expect(html).toContain(jaMessages.Home.featuredProjects.title);
    expect(html).not.toContain(jaMessages.Home.recentArticles.title);
    // 空配列は障害ではないのでエラーログは出さない
    expect(homeErrorLogs()).toBeEmpty();
  });

  test('renders the Recent Articles section when the CMS fetch succeeds', async () => {
    getCachedArticlesPageContent = resolveWith([
      cmsArticleFixture('first-post', 'First post title'),
    ]);

    const html = await renderHome();

    expect(html).toContain(jaMessages.Home.recentArticles.title);
    expect(html).toContain('First post title');
    expect(homeErrorLogs()).toBeEmpty();
  });

  test('renders at most three articles even when the CMS returns more', async () => {
    getCachedArticlesPageContent = resolveWith(
      Array.from({ length: 5 }, (_, index) =>
        cmsArticleFixture(`post-${index + 1}`, `Post ${index + 1} title`),
      ),
    );

    const html = await renderHome();

    expect(html).toContain('Post 1 title');
    expect(html).toContain('Post 3 title');
    expect(html).not.toContain('Post 4 title');
  });
});

// これらのテストは例外を送出するだけで catch のログ経路に入らないため、
// console.error の spy を張らない (張ると復元漏れが後続ファイルに漏れる)
describe('Home error propagation', () => {
  /**
   * unstable_rethrow が無いと Next.js の制御フロー例外まで握り潰され、
   * prerender 中断が「セクションなしの正常な shell」として焼き込まれる。
   */
  test.each([
    ['redirect', 'NEXT_REDIRECT;replace;/elsewhere;307;'],
    ['prerender interruption', 'HANGING_PROMISE_REJECTION'],
  ])('re-throws %s control-flow errors instead of hiding the section', async (_label, digest) => {
    const controlFlowError = Object.assign(new Error('control-flow'), { digest });
    getCachedArticlesPageContent = () => Promise.reject(controlFlowError);

    await expect(renderHome()).rejects.toBe(controlFlowError);
  });

  test('propagates content validation errors instead of hiding the section', async () => {
    getCachedArticlesPageContent = resolveWith([
      cmsArticleFixture('broken', 'Broken article', {
        ogpImage: { url: '' },
      }),
    ]);

    await expect(renderHome()).rejects.toThrow(/ogpImage/);
  });
});
