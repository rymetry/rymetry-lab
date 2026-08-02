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

/**
 * ArticleCard variant="list" が使う制限付き表示。max を超えた分は「+N」チップ 1 個に畳まれる。
 * 記事一覧のリスト表示・Related・Prev/Next はすべて max={3}。
 */
export const TagListOverflow: Story = {
  args: { tag: defaultTag },
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <p className="mb-1.5 font-mono text-[11px] text-muted-foreground">
          max=3 / tags=3 (畳まれない)
        </p>
        <TagList tags={sampleTags.slice(0, 3)} max={3} />
      </div>
      <div>
        <p className="mb-1.5 font-mono text-[11px] text-muted-foreground">max=3 / tags=4 → +1</p>
        <TagList tags={sampleTags.slice(0, 4)} max={3} />
      </div>
      <div>
        <p className="mb-1.5 font-mono text-[11px] text-muted-foreground">max=3 / tags=10 → +7</p>
        <TagList tags={sampleTags} max={3} />
      </div>
      <div>
        <p className="mb-1.5 font-mono text-[11px] text-muted-foreground">
          size=&quot;sm&quot; / max=3 / tags=10 → +7 (Prev/Next 内の実寸)
        </p>
        <TagList tags={sampleTags} max={3} size="sm" />
      </div>
    </div>
  ),
};

export const TagListOverflowDarkMode: Story = {
  args: { tag: defaultTag },
  globals: { theme: 'dark' },
  render: () => (
    <div className="flex flex-col gap-4 rounded-lg bg-background p-4">
      <TagList tags={sampleTags} max={3} />
      <TagList tags={sampleTags} max={3} size="sm" />
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
