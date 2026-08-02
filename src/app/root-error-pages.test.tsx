import { describe, expect, test } from 'bun:test';

import { renderToString } from 'react-dom/server';

import enMessages from '../../messages/en.json';
import jaMessages from '../../messages/ja.json';
import ErrorPage from './error';
import GlobalError from './global-error';
import NotFound from './not-found';

/**
 * Regression: app/not-found.tsx / app/error.tsx render OUTSIDE the [locale]
 * segment, so NextIntlClientProvider is not available. They must not depend on
 * next-intl (e.g. Link from @/i18n/navigation), otherwise every unmatched URL
 * throws "No intl context found" and falls back to global-error.
 */
describe('root error pages render without NextIntlClientProvider', () => {
  test('not-found.tsx renders standalone', () => {
    const html = renderToString(<NotFound />);

    expect(html).toContain('404');
    expect(html).toContain('href="/"');
    expect(html).toContain('href="/articles"');
  });

  test('error.tsx renders standalone', () => {
    const html = renderToString(
      <ErrorPage
        error={Object.assign(new Error('boom'), { digest: 'TEST_DIGEST' })}
        unstable_retry={() => undefined}
      />,
    );

    expect(html).toContain('Something Went Wrong');
    expect(html).toContain('TEST_DIGEST');
    expect(html).toContain('href="/"');
  });
});

/**
 * Issue #106: ルートレイアウトは pass-through (`return children`) なので `<html>` を
 * 供給しない。`[locale]` の外で描画される root の not-found / error は自前で完全な
 * ドキュメントを持たないと、`lang` もフォント変数も当たらない裸の文書になる
 * (production build で `lang=""` / フォント変数 0 個を実測済み)。
 *
 * `<html>` / `<body>` は必ず 1 個ずつ。2 個になる構成は HTML パーサに内側を破棄され、
 * `documentElement` が属性なしになるため退行と同じ。
 */
describe('root error pages own a complete HTML document', () => {
  const countTags = (html: string, tag: string) =>
    (html.match(new RegExp(`<${tag}[\\s>]`, 'g')) ?? []).length;

  /**
   * `src/app/fonts.ts` が宣言する CSS 変数名。本番では next/font がハッシュ付きクラス名を
   * 生成するが、`src/test-setup.ts` のスタブは渡された `variable` をそのまま返すため、
   * ここでは「fontVariables が `<html className>` に配線されているか」を検証できる。
   */
  const FONT_VARIABLES = [
    '--font-display',
    '--font-geist-mono',
    '--font-sans-jp',
    '--font-plemol',
    '--font-kaisei',
  ] as const;

  test('not-found.tsx renders a single documented shell with lang and fonts', () => {
    const html = renderToString(<NotFound />);

    expect(html).toContain('<html lang="ja"');
    expect(countTags(html, 'html')).toBe(1);
    expect(countTags(html, 'body')).toBe(1);
    for (const variable of FONT_VARIABLES) {
      expect(html).toContain(variable);
    }
  });

  test('error.tsx renders a single documented shell with lang and fonts', () => {
    const html = renderToString(
      <ErrorPage error={new Error('boom')} unstable_retry={() => undefined} />,
    );

    expect(html).toContain('<html lang="ja"');
    expect(countTags(html, 'html')).toBe(1);
    expect(countTags(html, 'body')).toBe(1);
    for (const variable of FONT_VARIABLES) {
      expect(html).toContain(variable);
    }
  });
});

/**
 * WCAG 3.1.1 (Language of Page) / 3.1.2 (Language of Parts):
 * global-error は見出し・CTA が英語で、日本語は説明文 1 段落のみ。ページ全体は `en` を
 * 宣言し、日本語の段落だけ `lang="ja"` で上書きする。
 */
describe('global-error declares the page and part languages', () => {
  test('global-error.tsx is an English document with a Japanese part', () => {
    const html = renderToString(
      <GlobalError error={new Error('boom')} unstable_retry={() => undefined} />,
    );

    expect(html).toContain('<html lang="en"');
    expect(html).not.toContain('<html lang="ja"');
    expect(html).toMatch(/lang="ja"[^>]*>[^<]*予期しないエラー/);
  });
});

/**
 * Error 系 CTA は 404 (not-found.tsx の "Back to Home" / "Browse Articles") と
 * 同じ英語表記に統一する。見出し英語 + 説明日本語のトーンは 404 と同一。
 *
 * 装飾グリフ (↻) は入れない。CTA からの矢印撤去 (DIVERGENCE.md) と同じ判断で、
 * ボタンのアクセシブル名に "clockwise open circle arrow" が混入するのを避ける。
 */
describe('error page CTAs match the 404 English wording', () => {
  test('error.tsx uses English CTAs without a decorative glyph', () => {
    const html = renderToString(
      <ErrorPage error={new Error('boom')} unstable_retry={() => undefined} />,
    );

    expect(html).toContain('Retry');
    expect(html).toContain('Back to Home');
    expect(html).not.toContain('リトライ');
    expect(html).not.toContain('ホームに戻る');
    expect(html).not.toContain('↻');
  });

  test('global-error.tsx uses English CTAs without a decorative glyph', () => {
    const html = renderToString(
      <GlobalError error={new Error('boom')} unstable_retry={() => undefined} />,
    );

    expect(html).toContain('Retry');
    expect(html).toContain('Back to Home');
    expect(html).not.toContain('リトライ');
    expect(html).not.toContain('ホームに戻る');
    expect(html).not.toContain('↻');
  });

  test('ErrorPages.error messages use the unified English CTAs in both locales', () => {
    for (const messages of [jaMessages, enMessages]) {
      expect(messages.ErrorPages.error.retry).toBe('Retry');
      expect(messages.ErrorPages.error.home).toBe('Back to Home');
    }
  });
});
