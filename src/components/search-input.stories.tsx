import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SearchInput } from './search-input';

const meta = {
  title: 'Components/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  args: {
    ariaLabel: 'Search articles',
    placeholder: 'Search articles...',
  },
  decorators: [
    (Story) => (
      <div className="relative max-w-[320px] p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithValue: Story = {
  args: {
    defaultValue: 'cache',
  },
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
};
