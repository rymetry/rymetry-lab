import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SectionContainer, SectionHeader } from './section';

const meta = {
  title: 'Components/Section',
  component: SectionHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'セクションレイアウト。SectionContainer (max-width + padding) + SectionHeader (label + title + desc)。',
      },
    },
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Featured Projects',
    title: 'Featured Work',
    descriptionEn: 'Less friction, more flow.',
    description: '開発者のワークフローを加速するために構築したツール群。',
  },
  decorators: [
    (Story) => (
      <SectionContainer>
        <Story />
        <div className="h-32 rounded-lg border border-dashed border-border bg-muted/30 p-4 text-muted-foreground">
          Section content area
        </div>
      </SectionContainer>
    ),
  ],
};

export const AltBackground: Story = {
  args: {
    label: 'Latest Articles',
    title: 'Recent Articles',
    descriptionEn: 'Field notes from the trenches of developer productivity.',
    description: '開発生産性の現場から得た知見。',
  },
  decorators: [
    (Story) => (
      <SectionContainer alt>
        <Story />
        <div className="h-32 rounded-lg border border-dashed border-border bg-background/50 p-4 text-muted-foreground">
          Alt section content area
        </div>
      </SectionContainer>
    ),
  ],
};

export const DarkMode: Story = {
  args: {
    label: 'Featured Projects',
    title: 'Featured Work',
    descriptionEn: 'Less friction, more flow.',
    description: '開発者のワークフローを加速するために構築したツール群。',
  },
  globals: { theme: 'dark' },
  decorators: [
    (Story) => (
      <SectionContainer>
        <Story />
        <div className="h-32 rounded-lg border border-dashed border-border bg-muted/30 p-4 text-muted-foreground">
          Section content area
        </div>
      </SectionContainer>
    ),
  ],
};
