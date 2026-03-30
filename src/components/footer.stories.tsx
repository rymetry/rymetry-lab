import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Footer } from './footer';
import { ThemeProvider } from './theme-provider';

const meta = {
  title: 'Components/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'サイトフッター。ロゴ + コピーライト（左）、ソーシャルアイコン（右）。768px 以下で中央寄せ縦並び。',
      },
    },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <div className="flex min-h-[50vh] flex-col justify-end">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <div className="flex min-h-[50vh] flex-col justify-end">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};
