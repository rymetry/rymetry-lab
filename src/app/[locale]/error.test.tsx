import { describe, expect, test } from 'bun:test';
import { NextIntlClientProvider } from 'next-intl';
import { renderToString } from 'react-dom/server';

import enMessages from '../../../messages/en.json';
import jaMessages from '../../../messages/ja.json';
import LocaleErrorPage from './error';

type Messages = typeof jaMessages;

function render(messages: Messages, locale: 'ja' | 'en', digest?: string): string {
  return renderToString(
    // timeZone を渡さないと next-intl が ENVIRONMENT_FALLBACK を投げてログを汚す
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Tokyo">
      <LocaleErrorPage
        error={digest ? Object.assign(new Error('boom'), { digest }) : new Error('boom')}
        unstable_retry={() => undefined}
      />
    </NextIntlClientProvider>,
  );
}

/**
 * next-intl は未定義キーを投げずにキー名そのものを描画するため、`t('retry')` を
 * `t('retryy')` に間違えてもレンダリングは通ってしまう。実メッセージの値と
 * 突き合わせて、キー取り違えを落とせるようにする。
 */
describe('[locale]/error.tsx', () => {
  test('renders every ErrorPages.error key from the ja messages', () => {
    const html = render(jaMessages, 'ja');

    expect(html).toContain(jaMessages.ErrorPages.error.label);
    expect(html).toContain(jaMessages.ErrorPages.error.title);
    expect(html).toContain(jaMessages.ErrorPages.error.description);
    expect(html).toContain(jaMessages.ErrorPages.error.retry);
    expect(html).toContain(jaMessages.ErrorPages.error.home);
  });

  test('renders every ErrorPages.error key from the en messages', () => {
    const html = render(enMessages as Messages, 'en');

    expect(html).toContain(enMessages.ErrorPages.error.label);
    expect(html).toContain(enMessages.ErrorPages.error.title);
    expect(html).toContain(enMessages.ErrorPages.error.description);
    expect(html).toContain(enMessages.ErrorPages.error.retry);
    expect(html).toContain(enMessages.ErrorPages.error.home);
  });

  test('never leaks a raw message key into the markup', () => {
    const html = render(jaMessages, 'ja');

    for (const key of Object.keys(jaMessages.ErrorPages.error)) {
      expect(html).not.toContain(`ErrorPages.error.${key}`);
    }
  });

  // `renderToString` はクリックを起こさないので、ここで検証できるのは文言だけ。
  // onClick が unstable_retry に繋がっていることは error.stories.tsx の play で担保する
  test('renders the Retry CTA wording without a decorative glyph', () => {
    const html = render(jaMessages, 'ja');

    expect(html).toContain('Retry');
    expect(html).toContain('Back to Home');
    expect(html).not.toContain('↻');
    expect(html).not.toContain('リトライ');
  });

  test('shows the digest only when the error carries one', () => {
    // React はテキストノードの境界に `<!-- -->` を挿入するため、素の連結では一致しない
    expect(render(jaMessages, 'ja', 'LOCALE_TEST_DIGEST')).toMatch(
      /Error ID: (<!-- -->)?LOCALE_TEST_DIGEST/,
    );
    expect(render(jaMessages, 'ja')).not.toContain('Error ID:');
  });
});
