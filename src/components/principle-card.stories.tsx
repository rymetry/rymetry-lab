import { PRINCIPLES } from '@/data/about';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PrincipleCard } from './principle-card';

const meta = {
  title: 'Components/PrincipleCard',
  component: PrincipleCard,
  tags: ['autodocs'],
  args: {
    principle: PRINCIPLES[0],
  },
  decorators: [
    (Story) => (
      <div className="max-w-[280px] p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PrincipleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
};
