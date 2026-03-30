import type { Article } from '@/types/article';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CloudIcon, CodeIcon, GitMergeIcon, MonitorIcon } from 'lucide-react';
import { ListCard } from './list-card';
import { ThemeProvider } from './theme-provider';

const sampleArticles: Article[] = [
  {
    slug: 'monorepo-deps',
    title: 'Monorepo における依存関係管理の設計戦略',
    publishedAt: '2026-01-22',
    readingTime: '15 min',
    thumbnailIcon: GitMergeIcon,
    tags: [
      { label: 'TypeScript', category: 'languages', icon: CodeIcon },
      { label: 'Infra', category: 'infra', icon: CloudIcon },
    ],
  },
  {
    slug: 'react-19-patterns',
    title: 'React 19 の新パターンと Server Components 活用法',
    publishedAt: '2026-02-10',
    readingTime: '10 min',
    thumbnailIcon: MonitorIcon,
    tags: [{ label: 'React', category: 'frontend', icon: MonitorIcon }],
  },
];

const meta = {
  title: 'Components/ListCard',
  component: ListCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '横型リストカード。サムネイル (120px) + タイトル + メタ + タグ。関連記事・前後ナビで使用。',
      },
    },
  },
} satisfies Meta<typeof ListCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <div className="max-w-xl p-4">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  args: {
    article: sampleArticles[0]!,
  },
};

export const Stacked: Story = {
  args: { article: sampleArticles[0]! },
  render: () => (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="flex max-w-xl flex-col gap-2.5 p-4">
        {sampleArticles.map((a) => (
          <ListCard key={a.slug} article={a} />
        ))}
      </div>
    </ThemeProvider>
  ),
};

export const DarkMode: Story = {
  args: { article: sampleArticles[0]! },
  globals: { theme: 'dark' },
  render: () => (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="flex max-w-xl flex-col gap-2.5 rounded-lg bg-background p-4">
        {sampleArticles.map((a) => (
          <ListCard key={a.slug} article={a} />
        ))}
      </div>
    </ThemeProvider>
  ),
};
