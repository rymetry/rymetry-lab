import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Terminal } from './terminal';

const terminalLines = (
  <>
    <div className="t-line">
      <span className="text-[var(--terminal-prompt)]">~</span>{' '}
      <span className="text-[var(--terminal-cmd)]">whoami</span>
    </div>
    <div className="t-line">
      <span className="text-[var(--terminal-highlight)]">Rym</span> — Productivity Engineer
    </div>
    <div className="t-line mt-[10px]">
      <span className="text-[var(--terminal-dim)]">[build]</span> CI/CD Pipeline Optimizer →{' '}
      <span className="text-[var(--terminal-success)]">70% faster</span>
    </div>
  </>
);

const meta = {
  title: 'Components/Terminal',
  component: Terminal,
  tags: ['autodocs'],
  args: {
    children: terminalLines,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[520px] p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Terminal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    compact: true,
  },
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
};
