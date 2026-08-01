import { PROJECTS } from '@/data/projects';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HomeSectionHead } from './home-section-head';
import { ProjectCard } from './project-card';

const sampleProjects = PROJECTS.slice(0, 3).map((p) => ({ ...p, href: '#' }));

const featuredWorkArgs = {
  title: 'Featured Work',
  descriptionEn: 'Less friction, more flow.',
  description: '開発者のワークフローを加速するために構築したツール群。',
  viewAllHref: '/projects',
  viewAllLabel: 'View all projects',
} as const;

const meta = {
  title: 'Components/HomeSectionHead',
  component: HomeSectionHead,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Home セクションの見出しセル。lg (3列)・モバイル (1列) では全幅の行、md (768–1023px, 2列) ではグリッド1マス目に入りカード3枚と 2×2 モジュールを構成する。「View all →」リンクは md 時のみ表示。',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <Story />
      </div>
    ),
  ],
  args: featuredWorkArgs,
} satisfies Meta<typeof HomeSectionHead>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Home ページと同じグリッド内に置き、ブラウザ幅で 1/2/3 列の挙動を確認する */
const renderInHomeGrid = (args: Story['args']) => (
  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
    <HomeSectionHead {...featuredWorkArgs} {...args} />
    {sampleProjects.map((p) => (
      <ProjectCard key={p.slug} project={p} />
    ))}
  </div>
);

export const Default: Story = {
  render: renderInHomeGrid,
};

/* md (768–1023px) では見出しがグリッド1マス目に入り、カード3枚と 2×2 モジュールを構成。
   View all リンクはこの幅でのみ表示される */
export const TabletModule: Story = {
  globals: { viewport: { value: 'tablet', isRotated: false } },
  render: renderInHomeGrid,
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: renderInHomeGrid,
};
