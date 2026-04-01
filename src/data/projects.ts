import {
  BarChart3Icon,
  CloudIcon,
  CodeIcon,
  ContainerIcon,
  DatabaseIcon,
  FlaskConicalIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  MonitorIcon,
  PackageIcon,
  ServerIcon,
  TerminalIcon,
  WrenchIcon,
  ZapIcon,
} from 'lucide-react';

import type { Project } from '@/types/project';

export const PROJECTS: readonly [Project, ...Project[]] = [
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
  {
    slug: 'iac-template-generator',
    title: 'IaC Template Generator',
    description:
      'Terraformモジュールを対話的に生成するCLIツール。社内標準に準拠したインフラ構成を数分でセットアップ。',
    role: 'Infrastructure Engineer',
    icon: TerminalIcon,
    tags: [
      { label: 'Terraform', category: 'infra', icon: CloudIcon },
      { label: 'Go', category: 'backend', icon: ServerIcon },
      { label: 'AWS', category: 'infra', icon: CloudIcon },
    ],
  },
  {
    slug: 'incident-response-bot',
    title: 'Incident Response Bot',
    description:
      'Slack連携のインシデント対応Bot。アラート集約、エスカレーション、ポストモーテム自動生成。',
    role: 'Full-stack Developer',
    icon: MessageCircleIcon,
    tags: [
      { label: 'TypeScript', category: 'languages', icon: CodeIcon },
      { label: 'Slack API', category: 'tools', icon: WrenchIcon },
      { label: 'PostgreSQL', category: 'backend', icon: DatabaseIcon },
    ],
  },
  {
    slug: 'config-validator',
    title: 'Config Validator',
    description:
      'ゼロ依存の設定ファイルバリデーションライブラリ。YAML/TOML/JSON対応、CI組み込み可能。',
    role: 'OSS Author',
    icon: PackageIcon,
    tags: [
      { label: 'TypeScript', category: 'languages', icon: CodeIcon },
      { label: 'Vitest', category: 'testing', icon: FlaskConicalIcon },
    ],
  },
];
