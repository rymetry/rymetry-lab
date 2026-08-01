import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../messages/ja.json';
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
          'Hero セクション (静韻)。h1 staggered fadeUp + ドットグリッド + 墨流し。heroInk="main" (default) は墨流しメイン、"background" はターミナル + 透かし。jaLine で日本語タグライン表示。',
      },
    },
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="ja" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
};

export const TerminalBackground: Story = {
  args: { heroInk: 'background' },
};

export const TerminalBackgroundDarkMode: Story = {
  args: { heroInk: 'background' },
  globals: { theme: 'dark' },
};

export const WithJaLine: Story = {
  args: { jaLine: true },
};

export const WithJaLineDarkMode: Story = {
  args: { jaLine: true },
  globals: { theme: 'dark' },
};
