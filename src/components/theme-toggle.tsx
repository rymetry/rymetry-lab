'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

/**
 * テーマ切替の即時トグル (プロトタイプ準拠)。
 * defaultTheme は system のままで、クリック時は現在の解決済みテーマの反対をセットする。
 * 一度クリックすると明示的な light/dark が保存され、以後 OS 設定への自動追従は外れる。
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations('ThemeToggle');

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="size-[34px] rounded-[3px] hover:bg-transparent dark:hover:bg-transparent hover:border-primary hover:text-primary"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <SunIcon className="size-4 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
      <MoonIcon className="absolute size-4 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
      <span className="sr-only">{t('label')}</span>
    </Button>
  );
}
