import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ErrorPage from './error';

const meta = {
  title: 'Pages/Error',
  component: ErrorPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'ランタイムエラーページ。リトライボタン + ホームへの CTA。デザインシステム準拠。',
      },
    },
  },
  args: {
    error: Object.assign(new Error('Unexpected runtime exception'), { digest: 'MOCK_DIGEST' }),
    unstable_retry: () => {},
  },
} satisfies Meta<typeof ErrorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
};
