import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ProjectsPage from './page';

const meta = {
  title: 'Pages/Projects',
  component: ProjectsPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Projects ページ。全プロジェクトを auto-fill グリッドで表示。',
      },
    },
  },
  args: {
    params: Promise.resolve({ locale: 'ja' }),
  },
} satisfies Meta<typeof ProjectsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkMode: Story = {
  args: {
    params: Promise.resolve({ locale: 'ja' }),
  },
  globals: { theme: 'dark' },
};
