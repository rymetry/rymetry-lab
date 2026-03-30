import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NoiseOverlay } from './noise-overlay';

const meta = {
  title: 'Components/NoiseOverlay',
  component: NoiseOverlay,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'SVG fractalNoise による grain テクスチャオーバーレイ。opacity 1.8%, mix-blend-mode overlay。',
      },
    },
  },
} satisfies Meta<typeof NoiseOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="relative min-h-[50vh] bg-background p-8">
      <NoiseOverlay />
      <h2 className="mb-4 text-2xl font-bold">Noise Overlay Demo</h2>
      <p className="text-muted-foreground">
        微細な grain テクスチャが画面全体に適用されています（opacity 1.8%）。
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-primary p-8 text-primary-foreground">Primary</div>
        <div className="rounded-lg bg-secondary p-8 text-secondary-foreground">Secondary</div>
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="relative min-h-[50vh] bg-background p-8">
      <NoiseOverlay />
      <h2 className="mb-4 text-2xl font-bold">Noise Overlay (Dark)</h2>
      <p className="text-muted-foreground">ダークモードでも同じ grain テクスチャが適用されます。</p>
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-primary p-8 text-primary-foreground">Primary</div>
        <div className="rounded-lg bg-secondary p-8 text-secondary-foreground">Secondary</div>
      </div>
    </div>
  ),
};
