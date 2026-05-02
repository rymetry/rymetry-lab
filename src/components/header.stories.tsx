import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../messages/ja.json';
import { Header } from './header';
import { ThemeProvider } from './theme-provider';

function ScrollArea({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <div className="h-[200vh] bg-muted/30 p-8">
        <p className="text-muted-foreground">スクロールで sticky 動作を確認</p>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Sticky ヘッダー。デスクトップではロゴ + ナビ + ThemeToggle。モバイルでは Sheet スライドイン。',
      },
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="ja" messages={messages}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <ScrollArea>
            <Story />
          </ScrollArea>
        </ThemeProvider>
      </NextIntlClientProvider>
    ),
  ],
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="ja" messages={messages}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ScrollArea>
            <Story />
          </ScrollArea>
        </ThemeProvider>
      </NextIntlClientProvider>
    ),
  ],
};
