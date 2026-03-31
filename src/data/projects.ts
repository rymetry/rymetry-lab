import {
  BarChart3Icon,
  CloudIcon,
  CodeIcon,
  ContainerIcon,
  LayoutDashboardIcon,
  MonitorIcon,
  ServerIcon,
  ZapIcon,
} from 'lucide-react';

import type { Project } from '@/types/project';

export const PROJECTS: readonly Project[] = [
  {
    slug: 'ci-cd-optimizer',
    title: 'CI/CD Pipeline Optimizer',
    description:
      'ビルド時間を70%短縮するCI/CDパイプライン最適化ツール。キャッシュ戦略と並列実行の自動チューニング。',
    role: 'Lead Engineer',
    icon: ZapIcon,
    tags: [
      { label: 'GitHub Actions', category: 'infra', icon: CloudIcon },
      { label: 'TypeScript', category: 'languages', icon: CodeIcon },
      { label: 'Docker', category: 'infra', icon: ContainerIcon },
    ],
  },
  {
    slug: 'developer-portal',
    title: 'Developer Portal',
    description:
      '社内開発者ポータル。サービスカタログ、ドキュメント検索、オンボーディング自動化を統合。',
    role: 'Platform Engineer',
    icon: LayoutDashboardIcon,
    tags: [
      { label: 'Next.js', category: 'frontend', icon: MonitorIcon },
      { label: 'Go', category: 'backend', icon: ServerIcon },
      { label: 'Backstage', category: 'infra', icon: CloudIcon },
    ],
  },
  {
    slug: 'devmetrics-dashboard',
    title: 'DevMetrics Dashboard',
    description:
      'DORA メトリクス可視化ダッシュボード。デプロイ頻度、リードタイム、MTTR、変更失敗率を自動計測。',
    role: 'OSS Author',
    icon: BarChart3Icon,
    tags: [
      { label: 'React', category: 'frontend', icon: MonitorIcon },
      { label: 'Python', category: 'languages', icon: CodeIcon },
      { label: 'Grafana', category: 'performance', icon: BarChart3Icon },
    ],
  },
];
