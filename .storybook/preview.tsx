import type { Preview } from '@storybook/nextjs-vite';
import type { ReactRenderer } from '@storybook/react';
import type { DecoratorFunction } from 'storybook/internal/types';
import { useEffect } from 'react';
import '../src/app/globals.css';

const WithThemeClass: DecoratorFunction<ReactRenderer> = (Story, context) => {
  const theme = context.globals.theme ?? 'light';
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return <Story />;
};

const preview: Preview = {
  parameters: {
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
  decorators: [WithThemeClass],
};

export default preview;
