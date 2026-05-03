'use client';

import { LangToggle } from '@/components/lang-toggle';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { MenuIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

const NAV_ITEMS = [
  { href: '/', labelKey: 'home' },
  { href: '/articles', labelKey: 'articles' },
  { href: '/projects', labelKey: 'projects' },
  { href: '/about', labelKey: 'about' },
] as const;

/** Exact match for home ("/"), segment-boundary prefix match for other routes. */
function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const t = useTranslations('Header');

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-lg backdrop-saturate-[180%] transition-colors duration-300">
      <div className="mx-auto flex h-15 max-w-[1200px] items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          aria-label={t('homeAria')}
          className="font-mono text-lg font-extrabold tracking-tighter"
        >
          Rym<span className="text-primary">lab</span>
        </Link>

        <div className="flex items-center gap-7 max-lg:gap-5">
          {/* Desktop Nav */}
          <nav aria-label={t('mainNavigation')} className="max-md:hidden">
            <ul className="flex gap-7 max-lg:gap-5">
              {NAV_ITEMS.map(({ href, labelKey }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'relative text-sm font-medium transition-colors duration-200',
                      isActive(pathname, href)
                        ? 'text-primary after:absolute after:-bottom-[19px] after:left-0 after:right-0 after:h-0.5 after:rounded-[1px] after:bg-[image:var(--accent-gradient)]'
                        : 'text-text-secondary hover:text-foreground',
                    )}
                  >
                    {t(`nav.${labelKey}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <LangToggle />
            <ThemeToggle />

            {/* Mobile Menu */}
            <Sheet key={pathname}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="md:hidden hover:bg-transparent dark:hover:bg-transparent hover:border-primary hover:text-primary"
                >
                  <MenuIcon className="size-[18px]" />
                  <span className="sr-only">{t('openMenu')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] pt-12">
                <SheetTitle className="sr-only">{t('navigationMenu')}</SheetTitle>
                <nav aria-label={t('mobileNavigation')} className="flex flex-col gap-1">
                  {NAV_ITEMS.map(({ href, labelKey }) => (
                    <SheetClose asChild key={href}>
                      <Link
                        href={href}
                        className={cn(
                          'block border-b border-border px-0 py-2.5 text-[15px] font-medium transition-colors duration-200 last:border-b-0',
                          isActive(pathname, href)
                            ? 'text-primary'
                            : 'text-text-secondary hover:text-primary',
                        )}
                      >
                        {t(`nav.${labelKey}`)}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
