import type { Tag as TagType } from '@/types/tag';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  CloudIcon,
  CodeIcon,
  FlaskConicalIcon,
  GaugeIcon,
  InfinityIcon,
  MonitorIcon,
  RocketIcon,
  ServerIcon,
  ShieldIcon,
  WrenchIcon,
} from 'lucide-react';
import { Tag, TagList } from './tag';

const sampleTags: TagType[] = [
  { label: 'React', category: 'frontend', icon: MonitorIcon },
  { label: 'Node.js', category: 'backend', icon: ServerIcon },
  { label: 'AWS', category: 'infra', icon: CloudIcon },
  { label: 'DevOps', category: 'devops', icon: InfinityIcon },
  { label: 'TypeScript', category: 'languages', icon: CodeIcon },
  { label: 'Vite', category: 'tools', icon: WrenchIcon },
  { label: 'Auth', category: 'security', icon: ShieldIcon },
  { label: 'Lighthouse', category: 'performance', icon: GaugeIcon },
  { label: 'Vitest', category: 'testing', icon: FlaskConicalIcon },
  { label: 'v2.0', category: 'release', icon: RocketIcon },
];

const defaultTag = sampleTags[0]!;

const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'カテゴリ色アイコン付きタグ。カード内で使用。default / sm の 2 サイズ。',
      },
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllCategories: Story = {
  args: { tag: defaultTag },
  render: () => (
    <div className="flex flex-wrap gap-2 p-4">
      {sampleTags.map((tag) => (
        <Tag key={tag.label} tag={tag} />
      ))}
    </div>
  ),
};

export const SmallSize: Story = {
  args: { tag: defaultTag },
  render: () => (
    <div className="flex flex-wrap gap-2 p-4">
      {sampleTags.map((tag) => (
        <Tag key={tag.label} tag={tag} size="sm" />
      ))}
    </div>
  ),
};

export const TagListExample: Story = {
  args: { tag: defaultTag },
  render: () => (
    <div className="p-4">
      <TagList tags={sampleTags.slice(0, 4)} />
    </div>
  ),
};

export const DarkMode: Story = {
  args: { tag: defaultTag },
  globals: { theme: 'dark' },
  render: () => (
    <div className="flex flex-wrap gap-2 rounded-lg bg-background p-4">
      {sampleTags.map((tag) => (
        <Tag key={tag.label} tag={tag} />
      ))}
    </div>
  ),
};
