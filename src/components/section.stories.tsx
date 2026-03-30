import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SectionContainer, SectionHeader } from './section';
import { ThemeProvider } from './theme-provider';

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
    title: 'Selected Work',
    descriptionEn: 'Projects that showcase my engineering approach.',
    description: '技術的なアプローチを示すプロジェクト集。',
  },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <SectionContainer>
          <Story />
          <div className="h-32 rounded-lg border border-dashed border-border bg-muted/30 p-4 text-muted-foreground">
            Section content area
          </div>
        </SectionContainer>
      </ThemeProvider>
    ),
  ],
};

export const AltBackground: Story = {
  args: {
    label: 'Latest Articles',
    title: 'Recent Articles',
    descriptionEn: 'Thoughts on engineering and productivity.',
    description: 'エンジニアリングと生産性についての考察。',
  },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <SectionContainer alt>
          <Story />
          <div className="h-32 rounded-lg border border-dashed border-border bg-background/50 p-4 text-muted-foreground">
            Alt section content area
          </div>
        </SectionContainer>
      </ThemeProvider>
    ),
  ],
};

export const DarkMode: Story = {
  args: {
    label: 'Featured Projects',
    title: 'Selected Work',
    descriptionEn: 'Projects that showcase my engineering approach.',
    description: '技術的なアプローチを示すプロジェクト集。',
  },
  globals: { theme: 'dark' },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <SectionContainer>
          <Story />
          <div className="h-32 rounded-lg border border-dashed border-border bg-muted/30 p-4 text-muted-foreground">
            Section content area
          </div>
        </SectionContainer>
      </ThemeProvider>
    ),
  ],
};
