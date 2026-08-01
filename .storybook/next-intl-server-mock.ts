import { createTranslator } from 'next-intl';
import messages from '../messages/ja.json';

/**
 * Storybook 用の `next-intl/server` スタブ。
 * async Server Component のページ Story (Pages/About, Pages/Projects) が使う
 * サーバー専用 API を ja メッセージ固定で置き換える (main.ts の viteFinal で alias)。
 */

type Messages = typeof messages;

export function setRequestLocale(locale: string): void {
  // Storybook ではリクエストスコープがないため何もしない
  void locale;
}

export async function getLocale(): Promise<string> {
  return 'ja';
}

export async function getMessages(): Promise<Messages> {
  return messages;
}

export async function getTranslations(
  namespaceOrOptions?: string | { locale?: string; namespace?: string },
) {
  const namespace =
    typeof namespaceOrOptions === 'string' ? namespaceOrOptions : namespaceOrOptions?.namespace;

  return createTranslator({
    locale: 'ja',
    messages,
    namespace: namespace as never,
  });
}
