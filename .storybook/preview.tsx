import type { Preview } from '@storybook/nextjs-vite';
import type { ReactRenderer } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import { useEffect } from 'react';
import type { DecoratorFunction } from 'storybook/internal/types';
import messages from '../messages/ja.json';
import '../src/app/globals.css';
import './storybook-fonts.css';

const WithThemeClass: DecoratorFunction<ReactRenderer> = (Story, context) => {
  const theme = context.globals.theme ?? 'light';
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return <Story />;
};

/* next-intl の Link (@/i18n/navigation) は intl コンテキスト必須。
   Link を使うコンポーネントがどの Story でも壊れないようグローバルに供給する */
const WithIntl: DecoratorFunction<ReactRenderer> = (Story) => (
  <NextIntlClientProvider locale="ja" messages={messages}>
    <Story />
  </NextIntlClientProvider>
);

const preview: Preview = {
  parameters: {
    // App Router のモックを有効化 (useRouter/usePathname を使う Header/LangToggle 用)
    nextjs: {
      appDirectory: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  globalTypes: {
    theme: {
      description: 'Theme switcher',
      toolbar: {
        title: 'Theme',
        icon: 'moon',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [WithThemeClass, WithIntl],
};

export default preview;
