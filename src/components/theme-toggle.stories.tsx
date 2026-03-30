import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ThemeProvider } from './theme-provider';
import { ThemeToggle } from './theme-toggle';

const meta = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <div className="flex items-center justify-center p-8">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Light / Dark / System を切り替えるドロップダウンメニュー。next-themes の useTheme フックを使用。',
      },
    },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnDarkBackground: Story = {
  globals: { theme: 'dark' },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <div className="flex items-center justify-center rounded-lg bg-background p-8">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};
