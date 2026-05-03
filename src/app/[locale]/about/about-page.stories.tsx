import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AboutPage from './page';

const meta = {
  title: 'Pages/About',
  component: AboutPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'About ページ。Profile + Engineering Principles + Tech Stack / Toolbox。',
      },
    },
  },
  args: {
    params: Promise.resolve({ locale: 'ja' }),
  },
} satisfies Meta<typeof AboutPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkMode: Story = {
  args: {
    params: Promise.resolve({ locale: 'ja' }),
  },
  globals: { theme: 'dark' },
};
