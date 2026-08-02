import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NextIntlClientProvider } from 'next-intl';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import messages from '../../messages/ja.json';
import { ThemeProvider } from './theme-provider';
import { ThemeToggle } from './theme-toggle';

/**
 * ThemeProvider は Story ごとに用意し、localStorage のキーも分離する。
 * meta 側で共有すると Story 間でテーマが持ち越され、play が不安定になるため。
 */
function ThemeStoryFrame({
  defaultTheme,
  storageKey,
  className = 'flex items-center justify-center p-8',
  children,
}: {
  readonly defaultTheme: 'light' | 'dark';
  readonly storageKey: string;
  readonly className?: string;
  readonly children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={false}
      storageKey={storageKey}
    >
      <div className={className}>{children}</div>
    </ThemeProvider>
  );
}

const TOGGLE_STORY_STORAGE_KEY = 'theme-toggle-story';

const meta = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="ja" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'テーマ切替の即時トグルボタン (プロトタイプ準拠)。defaultTheme は system のまま、クリックで resolvedTheme の反対に切り替える。next-themes の useTheme フックを使用。',
      },
    },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <ThemeStoryFrame defaultTheme="light" storageKey="theme-toggle-default">
        <Story />
      </ThemeStoryFrame>
    ),
  ],
};

export const OnDarkBackground: Story = {
  globals: { theme: 'dark' },
  decorators: [
    (Story) => (
      <ThemeStoryFrame
        defaultTheme="dark"
        storageKey="theme-toggle-dark"
        className="flex items-center justify-center rounded-lg bg-background p-8"
      >
        <Story />
      </ThemeStoryFrame>
    ),
  ],
};

/**
 * クリックで resolvedTheme の反対がセットされ、sr-only ラベルが押下結果を示すこと。
 * 初期テーマに依存しないよう 2 回クリックして「反転 → 復帰」を確認する。
 */
export const TogglesTheme: Story = {
  decorators: [
    (Story) => (
      <ThemeStoryFrame defaultTheme="light" storageKey={TOGGLE_STORY_STORAGE_KEY}>
        <Story />
      </ThemeStoryFrame>
    ),
  ],
  beforeEach: () => {
    localStorage.removeItem(TOGGLE_STORY_STORAGE_KEY);
    return () => localStorage.removeItem(TOGGLE_STORY_STORAGE_KEY);
  },
  // Storybook の instrumenter は文脈により matcher が Promise を返しうるので、
  // 公式ガイドどおり play 内の expect は常に await する
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button');

    // マウント後は静的ラベルから「押すとどうなるか」を示すラベルへ動的化される
    await waitFor(async () => {
      await expect(button).toHaveAccessibleName(messages.ThemeToggle.switchToDark);
    });

    await userEvent.click(button);
    await waitFor(async () => {
      await expect(document.documentElement).toHaveClass('dark');
      await expect(button).toHaveAccessibleName(messages.ThemeToggle.switchToLight);
    });

    await userEvent.click(button);
    await waitFor(async () => {
      await expect(document.documentElement).not.toHaveClass('dark');
      await expect(button).toHaveAccessibleName(messages.ThemeToggle.switchToDark);
    });
  },
};
