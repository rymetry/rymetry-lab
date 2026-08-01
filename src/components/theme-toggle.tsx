'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

import { Button } from '@/components/ui/button';

const emptySubscribe = () => () => {};

/** SSR では false、クライアントでは true を返すハイドレーション安全な mounted 判定 */
function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/**
 * テーマ切替の即時トグル (プロトタイプ準拠)。
 * defaultTheme は system のままで、クリック時は現在の解決済みテーマの反対をセットする。
 * 一度クリックすると明示的な light/dark が保存され、以後 OS 設定への自動追従は外れる。
 * ラベルはマウント後に「◯◯テーマに切り替える」へ動的化し、SR に押下結果を伝える
 * (SSR はテーマ不明のため静的ラベルでレンダリングし、ハイドレーション不一致を避ける)。
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations('ThemeToggle');
  const mounted = useMounted();

  const isDark = resolvedTheme === 'dark';
  const label = mounted ? (isDark ? t('switchToLight') : t('switchToDark')) : t('label');

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="size-[34px] rounded-[3px] hover:bg-transparent dark:hover:bg-transparent hover:border-primary hover:text-primary"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <SunIcon className="size-4 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
      <MoonIcon className="absolute size-4 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
      <span className="sr-only">{label}</span>
    </Button>
  );
}
