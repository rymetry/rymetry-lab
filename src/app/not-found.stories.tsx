import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NotFound from './not-found';

const meta = {
  title: 'Pages/NotFound',
  component: NotFound,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '404 Not Found ページ。ターミナル風診断ブロック + ホームへの CTA。デザインシステム準拠。',
      },
    },
  },
} satisfies Meta<typeof NotFound>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
};
