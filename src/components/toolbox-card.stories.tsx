import { TOOLBOX_CATEGORIES } from '@/data/about';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ToolboxCard } from './toolbox-card';

const meta = {
  title: 'Components/ToolboxCard',
  component: ToolboxCard,
  tags: ['autodocs'],
  args: {
    category: TOOLBOX_CATEGORIES[0],
  },
  decorators: [
    (Story) => (
      <div className="max-w-[360px] p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ToolboxCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
};
