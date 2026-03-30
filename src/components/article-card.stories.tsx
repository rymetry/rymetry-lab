import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CloudIcon, CodeIcon, MonitorIcon, WrenchIcon, ZapIcon } from 'lucide-react';
import { ThemeProvider } from './theme-provider';
import { ArticleCard } from './article-card';
import type { Article } from '@/types/article';

const sampleArticle: Article = {
  slug: 'nextjs-cache-strategy',
  title: 'Next.js 16 の use cache ディレクティブで ISR を超える',
  publishedAt: '2026-03-15',
  updatedAt: '2026-03-20',
  readingTime: '8 min',
  thumbnailIcon: ZapIcon,
  thumbnailVariant: 'v1',
  tags: [
    { label: 'Next.js', category: 'frontend', icon: MonitorIcon },
    { label: 'TypeScript', category: 'languages', icon: CodeIcon },
  ],
};

const sampleArticles: Article[] = [
  sampleArticle,
  {
    slug: 'tailwind-v4-migration',
    title: 'Tailwind CSS v4 移行ガイド — @theme inline と CSS-first 設定',
    publishedAt: '2026-03-10',
    readingTime: '12 min',
    thumbnailIcon: WrenchIcon,
    thumbnailVariant: 'v2',
    tags: [
      { label: 'Tailwind', category: 'tools', icon: WrenchIcon },
      { label: 'CSS', category: 'frontend', icon: MonitorIcon },
    ],
  },
  {
    slug: 'aws-ecs-deploy',
    title: 'ECS Fargate で Next.js をゼロダウンタイムデプロイする',
    publishedAt: '2026-02-28',
    readingTime: '15 min',
    thumbnailIcon: CloudIcon,
    thumbnailVariant: 'v3',
    tags: [
      { label: 'AWS', category: 'infra', icon: CloudIcon },
      { label: 'Docker', category: 'infra', icon: CloudIcon },
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
