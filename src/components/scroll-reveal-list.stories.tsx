import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ScrollRevealList } from './scroll-reveal-list';

const meta = {
  title: 'Components/ScrollRevealList',
  component: ScrollRevealList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '1つの IntersectionObserver で子要素を個別に scroll reveal。グリッドアイテム等に最適。prefers-reduced-motion 対応。',
      },
    },
  },
} satisfies Meta<typeof ScrollRevealList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
  },
  render: () => (
    <div className="p-8">
      <p className="mb-8 text-muted-foreground">下にスクロールしてください</p>
      <div className="h-[80vh]" />
      <ScrollRevealList className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-8">
            <h3 className="mb-2 text-lg font-bold">カード {i}</h3>
            <p className="text-muted-foreground">このカードは個別にスクロールで表示されます。</p>
          </div>
        ))}
      </ScrollRevealList>
    </div>
  ),
};

export const DarkMode: Story = {
  args: {
    children: null,
  },
  globals: { theme: 'dark' },
  render: () => (
    <div className="p-8">
      <p className="mb-8 text-muted-foreground">下にスクロールしてください</p>
      <div className="h-[80vh]" />
      <ScrollRevealList className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-8">
            <h3 className="mb-2 text-lg font-bold">カード {i}</h3>
            <p className="text-muted-foreground">このカードは個別にスクロールで表示されます。</p>
          </div>
        ))}
      </ScrollRevealList>
    </div>
  ),
};
