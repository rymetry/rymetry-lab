import type { Article } from '@/types/article';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  BarChart3Icon,
  BotIcon,
  GaugeIcon,
  GitBranchIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
} from 'lucide-react';
import { ArticleCard } from './article-card';
import { ThemeProvider } from './theme-provider';

const sampleArticle: Article = {
  slug: 'github-actions-cache',
  title: 'GitHub Actions のキャッシュ戦略を徹底的に最適化する',
  publishedAt: '2026-03-15',
  updatedAt: '2026-03-20',
  readingTime: '8 min',
  thumbnailIcon: ZapIcon,
  thumbnailVariant: 'v1',
  tags: [
    { label: 'CI/CD', category: 'infra', icon: GitBranchIcon },
    { label: 'Performance', category: 'performance', icon: GaugeIcon },
  ],
};

const sampleArticles: Article[] = [
  sampleArticle,
  {
    slug: 'developer-onboarding',
    title: '開発者オンボーディングを自動化して定着率を改善した話',
    publishedAt: '2026-03-01',
    updatedAt: '2026-03-05',
    readingTime: '12 min',
    thumbnailIcon: UsersIcon,
    thumbnailVariant: 'v2',
    tags: [
      { label: 'DevEx', category: 'tools', icon: SparklesIcon },
      { label: 'Automation', category: 'infra', icon: BotIcon },
    ],
  },
  {
    slug: 'dora-metrics',
    title: 'DORA メトリクスを導入して開発チームの健全性を可視化する',
    publishedAt: '2026-02-18',
    updatedAt: '2026-02-22',
    readingTime: '10 min',
    thumbnailIcon: BarChart3Icon,
    thumbnailVariant: 'v3',
    tags: [
      { label: 'Metrics', category: 'performance', icon: BarChart3Icon },
      { label: 'DevOps', category: 'infra', icon: GitBranchIcon },
    ],
  },
];

const meta = {
  title: 'Components/ArticleCard',
  component: ArticleCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '記事カード。サムネイル (3 バリエーション) + メタ情報 + タイトル + タグ。hover でグリーンバー + lift。',
      },
    },
  },
} satisfies Meta<typeof ArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <div className="max-w-sm p-4">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  args: {
    article: sampleArticle,
  },
};

export const ThumbnailVariants: Story = {
  args: { article: sampleArticle },
  render: () => (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5 p-4">
        {sampleArticles.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </ThemeProvider>
  ),
};

export const DarkMode: Story = {
  args: { article: sampleArticle },
  globals: { theme: 'dark' },
  render: () => (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5 rounded-lg bg-background p-4">
        {sampleArticles.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </ThemeProvider>
  ),
};
