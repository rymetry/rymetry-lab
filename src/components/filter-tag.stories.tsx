import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { GaugeIcon, LayersIcon } from 'lucide-react';
import { FilterTag } from './filter-tag';

const meta = {
  title: 'Components/FilterTag',
  component: FilterTag,
  tags: ['autodocs'],
  args: {
    href: '/articles',
    active: false,
    children: (
      <>
        <LayersIcon aria-hidden="true" className="size-[13px]" />
        All
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div className="flex gap-2 p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FilterTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: {
    active: true,
    children: (
      <>
        <GaugeIcon aria-hidden="true" className="size-[13px]" />
        Performance
      </>
    ),
  },
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
};
