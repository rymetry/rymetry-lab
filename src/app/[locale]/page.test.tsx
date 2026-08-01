import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from 'bun:test';
import { NextIntlClientProvider, createTranslator } from 'next-intl';
import { renderToString } from 'react-dom/server';

import type { Article } from '@/types/article';
import type { Tag } from '@/types/tag';

import jaMessages from '../../../messages/ja.json';

type ArticlesPageContent = {
  readonly articles: readonly Article[];
  readonly tags: readonly Tag[];
};

/**
 * microCMS 障害時のグレースフルデグラデーション検証のため、
 * articles-cache をテストごとに差し替え可能なモックへ置換する。
 * (実モジュールは 'server-only' を import するため bun test では読み込めない)
 */
let getArticlesPageContent: () => Promise<ArticlesPageContent>;

mock.module('./articles/articles-cache', () => ({
  getArticlesPageContent: () => getArticlesPageContent(),
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

function articleFixture(slug: string, title: string): Article {
  return {
    slug,
    title,
    description: `${title} description`,
    publishedAt: '2026-04-01',
    readingTime: '3 min',
    tags: [{ label: 'React', category: 'frontend' }],
  };
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
      (call: unknown[]) => typeof call[0] === 'string' && call[0].includes('recent articles'),
    );
  }

  test('renders Hero and Featured Work without Recent Articles when the CMS fetch fails', async () => {
    getArticlesPageContent = () => Promise.reject(new Error('microCMS down'));

    const html = await renderHome();

    expect(html).toContain(jaMessages.Home.featuredProjects.title);
    expect(html).not.toContain(jaMessages.Home.recentArticles.title);
    expect(homeErrorLogs()).not.toBeEmpty();
  });

  test('renders the Recent Articles section when the CMS fetch succeeds', async () => {
    getArticlesPageContent = () =>
      Promise.resolve({
        articles: [articleFixture('first-post', 'First post title')],
        tags: [],
      });

    const html = await renderHome();

    expect(html).toContain(jaMessages.Home.recentArticles.title);
    expect(html).toContain('First post title');
    expect(homeErrorLogs()).toBeEmpty();
  });
});
