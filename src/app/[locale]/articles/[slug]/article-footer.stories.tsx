import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  BarChart3Icon,
  BotIcon,
  CodeIcon,
  GitBranchIcon,
  GitMergeIcon,
  InfinityIcon,
  RocketIcon,
  SparklesIcon,
  UsersIcon,
} from 'lucide-react';
import { NextIntlClientProvider } from 'next-intl';

import type { ArticleDetail } from '@/types/article';

import { ArticleFooter } from './article-footer';

const articles = {
  relatedMonorepo: {
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
  relatedFeatureFlags: {
    slug: 'feature-flags',
    title: 'Feature Flags で安全にリリースする仕組みを構築する',
    publishedAt: '2026-01-10',
    readingTime: '7 min',
    thumbnailIcon: RocketIcon,
    tags: [
      { label: 'DevOps', category: 'devops', icon: InfinityIcon },
      { label: 'Release', category: 'release', icon: RocketIcon },
    ],
  },
  previousOnboarding: {
    slug: 'developer-onboarding',
    title: '開発者オンボーディングを自動化して定着率を改善した話',
    publishedAt: '2026-03-01',
    readingTime: '12 min',
    thumbnailIcon: UsersIcon,
    tags: [
      { label: 'DevEx', category: 'tools', icon: SparklesIcon },
      { label: 'Automation', category: 'infra', icon: BotIcon },
    ],
  },
  nextDora: {
    slug: 'dora-metrics',
    title: 'DORA メトリクスを導入して開発チームの健全性を可視化する',
    publishedAt: '2026-02-18',
    readingTime: '10 min',
    thumbnailIcon: BarChart3Icon,
    tags: [
      { label: 'Metrics', category: 'performance', icon: BarChart3Icon },
      { label: 'DevOps', category: 'devops', icon: InfinityIcon },
    ],
  },
} as const satisfies Record<string, Partial<ArticleDetail>>;

function article(key: keyof typeof articles): ArticleDetail {
  const base = articles[key];

  return {
    slug: base.slug!,
    title: base.title!,
    description: `${base.title} description`,
    excerpt: `${base.title} excerpt`,
    content: '<p>body</p>',
    ogpImage: {
      url: `https://images.microcms-assets.io/assets/test/${base.slug}.png`,
      width: 1200,
      height: 630,
    },
    publishedAt: base.publishedAt!,
    updatedAt: base.publishedAt,
    readingTime: base.readingTime!,
    thumbnailIcon: base.thumbnailIcon!,
    tags: base.tags!,
  };
}

const footerLabels = {
  navigationLabel: '記事ナビゲーション',
  previousLabel: 'Previous Article',
  nextLabel: 'Next Article',
  relatedLabel: 'Related',
  relatedTitle: 'Related Articles',
  relatedDescription: 'この記事に関連して選択された記事をピックアップしています。',
} as const;

const meta = {
  title: 'Pages/ArticleDetail/ArticleFooter',
  component: ArticleFooter,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '記事詳細下部の関連記事と前後ナビ。microCMS の関連記事登録と時系列の Previous / Next を表示する。',
      },
    },
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="ja" messages={{}}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
  args: {
    relatedArticles: [article('relatedMonorepo'), article('relatedFeatureFlags')],
    previousArticle: article('previousOnboarding'),
    nextArticle: article('nextDora'),
    ...footerLabels,
  },
} satisfies Meta<typeof ArticleFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NewestArticle: Story = {
  args: {
    relatedArticles: [],
    previousArticle: article('previousOnboarding'),
    nextArticle: null,
  },
};

export const OldestArticle: Story = {
  args: {
    relatedArticles: [],
    previousArticle: null,
    nextArticle: article('nextDora'),
  },
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
};
