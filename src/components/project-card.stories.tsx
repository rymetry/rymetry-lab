import { PROJECTS } from '@/data/projects';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProjectCard } from './project-card';

const sampleProject = { ...PROJECTS[0], href: '#' };
const sampleProjects = PROJECTS.slice(0, 3).map((p) => ({ ...p, href: '#' }));

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
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-5 p-4">
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
