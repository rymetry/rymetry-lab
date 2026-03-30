import type { Project } from '@/types/project';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CloudIcon, CodeIcon, MonitorIcon, ServerIcon, WrenchIcon, ZapIcon } from 'lucide-react';
import { ProjectCard } from './project-card';
import { ThemeProvider } from './theme-provider';

const sampleProject: Project = {
  slug: 'ci-cd-optimizer',
  title: 'CI/CD Pipeline Optimizer',
  description:
    'GitHub Actions ワークフローの実行時間を 60% 短縮。キャッシュ戦略、並列実行、条件分岐の最適化を自動化するツール。',
  role: 'Lead Engineer',
  icon: ZapIcon,
  tags: [
    { label: 'GitHub Actions', category: 'infra', icon: CloudIcon },
    { label: 'TypeScript', category: 'languages', icon: CodeIcon },
    { label: 'Node.js', category: 'backend', icon: ServerIcon },
  ],
};

const sampleProjects: Project[] = [
  sampleProject,
  {
    slug: 'design-system',
    title: 'Design System & Component Library',
    description:
      'Storybook + Tailwind CSS による統一されたデザインシステム。コンポーネントカタログ、テーマ切替、アクセシビリティ対応。',
    role: 'Frontend Architect',
    icon: MonitorIcon,
    tags: [
      { label: 'React', category: 'frontend', icon: MonitorIcon },
      { label: 'Tailwind', category: 'tools', icon: WrenchIcon },
    ],
  },
  {
    slug: 'api-gateway',
    title: 'API Gateway Platform',
    description:
      'マイクロサービス間のルーティング、認証、レート制限を一元管理。OpenAPI スキーマ駆動の自動バリデーション。',
    role: 'Backend Engineer',
    icon: ServerIcon,
    tags: [
      { label: 'Go', category: 'languages', icon: CodeIcon },
      { label: 'Docker', category: 'infra', icon: CloudIcon },
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
          'プロジェクトカード。アイコン + ロール + タイトル + 説明 + タグ。hover でグリーンバー + lift + 矢印表示。',
      },
    },
  },
} satisfies Meta<typeof ProjectCard>;

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
    project: sampleProject,
  },
};

export const Grid: Story = {
  args: { project: sampleProject },
  render: () => (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5 p-4">
        {sampleProjects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </ThemeProvider>
  ),
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <div className="max-w-sm rounded-lg bg-background p-4">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  args: {
    project: sampleProject,
  },
};
