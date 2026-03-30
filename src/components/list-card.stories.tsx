import type { Article } from '@/types/article';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CodeIcon, GitBranchIcon, GitMergeIcon, RocketIcon } from 'lucide-react';
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
      { label: 'CI/CD', category: 'infra', icon: GitBranchIcon },
    ],
  },
  {
    slug: 'feature-flags',
    title: 'Feature Flags で安全にリリースする仕組みを構築する',
    publishedAt: '2026-01-10',
    readingTime: '7 min',
    thumbnailIcon: RocketIcon,
    tags: [
      { label: 'DevOps', category: 'infra', icon: GitBranchIcon },
      { label: 'Release', category: 'release', icon: RocketIcon },
    ],
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
