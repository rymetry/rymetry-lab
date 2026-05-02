import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ArticleDetailLoadingState, ArticlesLoadingState, HomeLoadingState } from './loading-state';

const meta = {
  title: 'Components/LoadingState',
  component: HomeLoadingState,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'microCMS 導入時の App Router loading.tsx で使う skeleton states。',
      },
    },
  },
} satisfies Meta<typeof HomeLoadingState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {};

export const Articles: Story = {
  render: () => <ArticlesLoadingState />,
};

export const ArticleDetail: Story = {
  render: () => <ArticleDetailLoadingState />,
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
};
