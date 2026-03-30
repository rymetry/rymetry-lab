import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ActionButton } from './action-button';

const meta = {
  title: 'Components/ActionButton',
  component: ActionButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'CTA ボタン。primary (グラデーション背景) と secondary (アウトライン + アクセントボーダー) の 2 バリエーション。',
      },
    },
  },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    href: '/projects',
    variant: 'primary',
    children: 'Projects →',
  },
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
};

export const Secondary: Story = {
  args: {
    href: '/articles',
    variant: 'secondary',
    children: 'Articles',
  },
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
};

export const ButtonGroup: Story = {
  args: { href: '/projects', children: 'Projects →' },
  render: () => (
    <div className="flex gap-3 p-8">
      <ActionButton href="/projects" variant="primary">
        Projects →
      </ActionButton>
      <ActionButton href="/articles" variant="secondary">
        Articles
      </ActionButton>
    </div>
  ),
};

export const DarkMode: Story = {
  args: { href: '/projects', children: 'Projects →' },
  globals: { theme: 'dark' },
  render: () => (
    <div className="flex gap-3 rounded-lg bg-background p-8">
      <ActionButton href="/projects" variant="primary">
        Projects →
      </ActionButton>
      <ActionButton href="/articles" variant="secondary">
        Articles
      </ActionButton>
    </div>
  ),
};
