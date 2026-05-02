'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { LanguagesIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { startTransition } from 'react';

export function LangToggle() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('LanguageToggle');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label={t('label')}
          className="h-8 gap-1.5 rounded-[6px] px-2.5 py-1.5 font-mono text-[11px] uppercase hover:border-primary hover:bg-transparent hover:text-primary dark:hover:bg-transparent"
        >
          <LanguagesIcon aria-hidden="true" className="size-3.5" />
          <span aria-hidden="true">{locale.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(nextLocale) => {
            startTransition(() => {
              router.replace(pathname, { locale: nextLocale as AppLocale });
            });
          }}
        >
          {routing.locales.map((item) => (
            <DropdownMenuRadioItem key={item} value={item}>
              {t(item)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
