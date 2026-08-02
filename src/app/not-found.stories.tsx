import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NotFoundContent } from './not-found-content';

const meta = {
  title: 'Pages/NotFound',
  component: NotFoundContent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '404 Not Found ページの本文 (route の not-found.tsx は RootDocument で包むだけ)。ドットグリッド + 見出し背後の vortex 墨流し + ホーム/記事一覧への CTA。デザインシステム準拠。',
      },
    },
  },
} satisfies Meta<typeof NotFoundContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
};
