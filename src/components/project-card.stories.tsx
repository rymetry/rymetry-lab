import type { Project } from '@/types/project';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  BarChart3Icon,
  CloudIcon,
  CodeIcon,
  LayoutDashboardIcon,
  MonitorIcon,
  ServerIcon,
  ZapIcon,
} from 'lucide-react';
import { ProjectCard } from './project-card';

const sampleProject: Project = {
  slug: 'ci-cd-optimizer',
  title: 'CI/CD Pipeline Optimizer',
  description:
    'ビルド時間を70%短縮するCI/CDパイプライン最適化ツール。キャッシュ戦略と並列実行の自動チューニング。',
  role: 'Lead Engineer',
  icon: ZapIcon,
  tags: [
    { label: 'GitHub Actions', category: 'infra', icon: CloudIcon },
    { label: 'TypeScript', category: 'languages', icon: CodeIcon },
    { label: 'Docker', category: 'infra', icon: CloudIcon },
  ],
};

const sampleProjects: Project[] = [
  sampleProject,
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

const meta = {
  title: 'Components/ProjectCard',
  component: ProjectCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'プロジェクトカード。アイコン + ロール + タイトル + 説明 + タグ。hover でグリーンバー + lift + 矢印 + アイコン scale/rotate。',
      },
    },
  },
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    project: sampleProject,
  },
};

export const Grid: Story = {
  args: { project: sampleProject },
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5 p-4">
      {sampleProjects.map((p) => (
        <ProjectCard key={p.slug} project={p} />
      ))}
    </div>
  ),
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  decorators: [
    (Story) => (
      <div className="max-w-sm rounded-lg bg-background p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    project: sampleProject,
  },
};
