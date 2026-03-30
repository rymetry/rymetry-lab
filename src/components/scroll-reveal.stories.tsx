import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ScrollReveal } from './scroll-reveal';
import { ThemeProvider } from './theme-provider';

const meta = {
  title: 'Components/ScrollReveal',
  component: ScrollReveal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'IntersectionObserver による scroll reveal アニメーション。要素がビューポートに入ると fadeUp で表示。prefers-reduced-motion 対応。',
      },
    },
  },
} satisfies Meta<typeof ScrollReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
  },
  render: () => (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="p-8">
        <p className="mb-8 text-muted-foreground">下にスクロールしてください</p>
        <div className="h-[80vh]" />
        {[1, 2, 3].map((i) => (
          <ScrollReveal key={i} className="mb-8">
            <div className="rounded-lg border border-border bg-card p-8">
              <h3 className="mb-2 text-lg font-bold">セクション {i}</h3>
              <p className="text-muted-foreground">このカードはスクロールで表示されます。</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </ThemeProvider>
  ),
};
