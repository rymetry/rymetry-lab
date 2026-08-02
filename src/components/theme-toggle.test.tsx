import { describe, expect, test } from 'bun:test';
import { NextIntlClientProvider } from 'next-intl';
import { renderToString } from 'react-dom/server';

import jaMessages from '../../messages/ja.json';

import { ThemeToggle } from './theme-toggle';

/**
 * SSR ではテーマが解決できないため静的ラベルを描画する (useSyncExternalStore の
 * getServerSnapshot が false を返す)。これを取り違えるとハイドレーション不一致になる。
 *
 * クリックでのテーマ反転とマウント後のラベル動的化は実 DOM が必要なため、
 * theme-toggle.stories.tsx の play 関数 (実 Chromium) で検証する。
 */
describe('ThemeToggle SSR', () => {
  test('renders the static label before hydration', () => {
    const html = renderToString(
      <NextIntlClientProvider locale="ja" messages={jaMessages} timeZone="Asia/Tokyo">
        <ThemeToggle />
      </NextIntlClientProvider>,
    );

    expect(html).toContain(jaMessages.ThemeToggle.label);
    expect(html).not.toContain(jaMessages.ThemeToggle.switchToDark);
    expect(html).not.toContain(jaMessages.ThemeToggle.switchToLight);
  });
});
