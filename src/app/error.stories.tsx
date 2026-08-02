import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ErrorContent } from './error-content';

const meta = {
  title: 'Pages/Error',
  component: ErrorContent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'ランタイムエラーページの本文 (route の error.tsx は RootDocument で包むだけ)。レイアウトは 404 (Pages/NotFound) と同一で、差分は文言と Error ID (digest) のみ。リトライ + ホームへの CTA。',
      },
    },
  },
  args: {
    error: Object.assign(new Error('Unexpected runtime exception'), { digest: 'MOCK_DIGEST' }),
    unstable_retry: () => {},
  },
} satisfies Meta<typeof ErrorContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
};
