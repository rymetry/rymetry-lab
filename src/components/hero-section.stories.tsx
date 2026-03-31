import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HeroSection } from './hero-section';

const meta = {
  title: 'Components/HeroSection',
  component: HeroSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Hero セクション。h1 staggered fadeUp + ターミナル typewriter + float アニメーション + mesh gradient 背景。モバイルではミニターミナルに切替。',
      },
    },
  },
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
};
