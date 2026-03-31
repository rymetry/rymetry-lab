import {
  BarChart3Icon,
  BotIcon,
  GaugeIcon,
  GitBranchIcon,
  InfinityIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
} from 'lucide-react';

import type { Article } from '@/types/article';

export const ARTICLES: readonly Article[] = [
  {
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
  },
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
      { label: 'DevOps', category: 'infra', icon: InfinityIcon },
    ],
  },
];
