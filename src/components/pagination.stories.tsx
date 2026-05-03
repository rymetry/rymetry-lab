import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Pagination } from './pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    label: 'Articles pagination',
    summary: '7-12 / 18 articles',
    items: [
      {
        href: '/articles?page=1',
        label: 'Previous page',
        content: <ChevronLeftIcon aria-hidden="true" className="size-3.5" />,
      },
      { href: '/articles?page=1', label: 'Page 1', content: 1 },
      { href: '/articles?page=2', label: 'Page 2', content: 2, active: true },
      { href: '/articles?page=3', label: 'Page 3', content: 3 },
      {
        href: '/articles?page=3',
        label: 'Next page',
        content: <ChevronRightIcon aria-hidden="true" className="size-3.5" />,
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDisabledEdges: Story = {
  args: {
    summary: '0-0 / 0 articles',
    items: [
      {
        href: '/articles?page=1',
        label: 'Previous page',
        content: <ChevronLeftIcon aria-hidden="true" className="size-3.5" />,
        disabled: true,
      },
      { href: '/articles?page=1', label: 'Page 1', content: 1, active: true },
      {
        href: '/articles?page=1',
        label: 'Next page',
        content: <ChevronRightIcon aria-hidden="true" className="size-3.5" />,
        disabled: true,
      },
    ],
  },
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
};
