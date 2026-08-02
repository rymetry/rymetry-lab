import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import messages from '../../../messages/ja.json';
import LocaleErrorPage from './error';

/**
 * root の `app/error.tsx` (英語固定・ターミナル付き) とは別物で、こちらは
 * `[locale]` セグメント配下の翻訳版。文言は `ErrorPages.error` から引く。
 * preview.tsx の WithIntl デコレータが ja メッセージを供給する。
 */
const meta = {
  title: 'Pages/LocaleError',
  component: LocaleErrorPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '[locale] 配下のランタイムエラーページ。next-intl の ErrorPages.error を使う翻訳版で、ターミナル演出は持たない。',
      },
    },
  },
  args: {
    error: Object.assign(new Error('Unexpected runtime exception'), { digest: 'MOCK_DIGEST' }),
    unstable_retry: fn(),
  },
} satisfies Meta<typeof LocaleErrorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * Retry ボタンが `unstable_retry` に繋がっていることの担保。
 * SSR 文字列を見る `error.test.tsx` ではクリックが起きないため、配線はここでしか落とせない
 * (onClick を消しても SSR のテストは通ってしまう)。
 *
 * Storybook の instrumenter は文脈により matcher が Promise を返しうるので、
 * 公式ガイドどおり play 内の expect は常に await する。
 */
export const RetryInvokesCallback: Story = {
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: messages.ErrorPages.error.retry,
    });

    await userEvent.click(button);

    await expect(args.unstable_retry).toHaveBeenCalledTimes(1);
  },
};

/** digest なし — Error ID 行が出ないことの確認用 */
export const WithoutDigest: Story = {
  args: {
    error: new Error('Unexpected runtime exception'),
  },
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
};
