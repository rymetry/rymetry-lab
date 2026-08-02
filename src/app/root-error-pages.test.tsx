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
