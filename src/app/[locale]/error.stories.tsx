import type { Meta, StoryObj } from '@storybook/nextjs-vite';
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
    unstable_retry: () => {},
  },
} satisfies Meta<typeof LocaleErrorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** digest なし — Error ID 行が出ないことの確認用 */
export const WithoutDigest: Story = {
  args: {
    error: new Error('Unexpected runtime exception'),
  },
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
};
