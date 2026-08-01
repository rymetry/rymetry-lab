import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { afterAll, beforeEach, describe, expect, mock, test } from 'bun:test';
import { NextIntlClientProvider } from 'next-intl';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import jaMessages from '../../messages/ja.json';

GlobalRegistrator.register();
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** next-themes をモックし、resolvedTheme をテストごとに切替える */
let mockResolvedTheme: 'light' | 'dark' | undefined;
const setThemeMock = mock((_theme: string) => {});

mock.module('next-themes', () => ({
  useTheme: () => ({
    resolvedTheme: mockResolvedTheme,
    setTheme: setThemeMock,
  }),
}));

async function loadThemeToggle() {
  const { ThemeToggle } = await import('./theme-toggle');
  return ThemeToggle;
}

function withIntl(children: React.ReactNode) {
  return (
    <NextIntlClientProvider locale="ja" messages={jaMessages} timeZone="Asia/Tokyo">
      {children}
    </NextIntlClientProvider>
  );
}

async function mountToggle(): Promise<{ container: HTMLElement; root: Root }> {
  const ThemeToggle = await loadThemeToggle();
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(withIntl(<ThemeToggle />));
  });

  return { container, root };
}

async function unmount(container: HTMLElement, root: Root): Promise<void> {
  await act(async () => {
    root.unmount();
  });
  container.remove();
}

async function clickButton(container: HTMLElement): Promise<void> {
  const button = container.querySelector('button');
  if (!button) throw new Error('ThemeToggle button not found');

  await act(async () => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    setThemeMock.mockClear();
  });

  afterAll(() => {
    GlobalRegistrator.unregister();
  });

  test('sets the opposite theme (light) when clicked while dark', async () => {
    mockResolvedTheme = 'dark';
    const { container, root } = await mountToggle();

    await clickButton(container);

    expect(setThemeMock).toHaveBeenCalledTimes(1);
    expect(setThemeMock).toHaveBeenCalledWith('light');
    await unmount(container, root);
  });

  test('sets the opposite theme (dark) when clicked while light', async () => {
    mockResolvedTheme = 'light';
    const { container, root } = await mountToggle();

    await clickButton(container);

    expect(setThemeMock).toHaveBeenCalledTimes(1);
    expect(setThemeMock).toHaveBeenCalledWith('dark');
    await unmount(container, root);
  });

  test('renders the static label on the server and switches to switchToLight after mount while dark', async () => {
    mockResolvedTheme = 'dark';
    const ThemeToggle = await loadThemeToggle();

    const ssrHtml = renderToString(withIntl(<ThemeToggle />));
    expect(ssrHtml).toContain(jaMessages.ThemeToggle.label);
    expect(ssrHtml).not.toContain(jaMessages.ThemeToggle.switchToLight);

    const { container, root } = await mountToggle();
    expect(container.textContent).toContain(jaMessages.ThemeToggle.switchToLight);
    await unmount(container, root);
  });

  test('switches the label to switchToDark after mount while light', async () => {
    mockResolvedTheme = 'light';
    const { container, root } = await mountToggle();

    expect(container.textContent).toContain(jaMessages.ThemeToggle.switchToDark);
    await unmount(container, root);
  });
});
