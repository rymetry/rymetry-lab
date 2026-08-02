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
 * エラーページは 404 と**同じレイアウト**を使い、文言だけをエラー用に差し替える。
 * ラベル行 (`// ERROR`) とターミナル診断ブロックは 404 に無いので持たない。
 */
describe('error pages reuse the 404 layout', () => {
  const renderError = () =>
    renderToString(<ErrorPage error={new Error('boom')} unstable_retry={() => undefined} />);

  test('error.tsx has no terminal diagnostic block', () => {
    const html = renderError();

    expect(html).not.toContain('t-line');
    expect(html).not.toContain('--terminal-border');
  });

  test('error.tsx has no label line above the decorative glyph', () => {
    // ラベルは大文字 (`// ERROR`)。装飾グリフの "Error" と取り違えないよう大文字で見る
    expect(renderError()).not.toContain('ERROR');
  });

  test('error.tsx decorative glyph uses the 404 brand-font style', () => {
    expect(renderError()).toMatch(/font-brand text-\[clamp\(80px,15vw,140px\)\]/);
  });
});

/**
 * 見出し背後の vortex 墨流しを 404 と共有し、4 画面 (404 / error の root・[locale]) で揃える。
 */
describe('error and 404 share the vortex ink watermark', () => {
  test('not-found.tsx renders the vortex watermark', () => {
    expect(renderToString(<NotFound />)).toContain('ink-vortex');
  });

  test('error.tsx renders the vortex watermark', () => {
    const html = renderToString(
      <ErrorPage error={new Error('boom')} unstable_retry={() => undefined} />,
    );

    expect(html).toContain('ink-vortex');
  });
});

/**
 * WCAG 3.1.1 (Language of Page):
 * root の fallback ページ (not-found / error / global-error) は、ロケールを特定できない位置に
 * あるため既定ロケールの `ja` を宣言する。`[locale]` 配下の ja ページも同じ構成
 * (英語の見出し・CTA + 日本語の説明文) で `ja` を宣言しており、サイト全体で揃える。
 *
 * 「英語見出し + 日本語本文」はサイト共通のトーン (DIVERGENCE.md 🎯)。英語部分への
 * `lang="en"` 付与 (WCAG 3.1.2 Language of Parts) は messages と `[locale]` 配下を含む
 * サイト全体の変更になるため、ここでは扱わない。
 */
describe('root fallback pages declare the default locale', () => {
  test('all three root fallback documents declare lang="ja"', () => {
    const documents = [
      renderToString(<NotFound />),
      renderToString(<ErrorPage error={new Error('boom')} unstable_retry={() => undefined} />),
      renderToString(<GlobalError error={new Error('boom')} unstable_retry={() => undefined} />),
    ];

    for (const html of documents) {
      expect(html).toContain('<html lang="ja"');
      expect(html).not.toContain('lang="en"');
    }
  });
});

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
