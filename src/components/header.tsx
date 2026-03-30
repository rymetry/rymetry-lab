'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/articles', label: 'Articles' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
] as const;

/** Exact match for home ("/"), segment-boundary prefix match for other routes. */
function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-lg backdrop-saturate-[180%] transition-colors duration-300">
      <div className="mx-auto flex h-15 max-w-[1200px] items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Rymlab — ホームへ"
          className="font-mono text-lg font-extrabold tracking-tighter"
        >
          Rym<span className="text-primary">lab</span>
        </Link>

        <div className="flex items-center gap-7 max-lg:gap-5">
          {/* Desktop Nav */}
          <nav aria-label="メインナビゲーション" className="max-md:hidden">
            <ul className="flex gap-7 max-lg:gap-5">
              {NAV_ITEMS.map(({ href, label }) => (
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
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
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
                  <span className="sr-only">メニューを開く</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] pt-12">
                <SheetTitle className="sr-only">ナビゲーションメニュー</SheetTitle>
                <nav aria-label="モバイルナビゲーション" className="flex flex-col gap-1">
                  {NAV_ITEMS.map(({ href, label }) => (
                    <SheetClose asChild key={href}>
                      <Link
                        href={href}
                        className={cn(
                          'block border-b border-border px-0 py-2.5 text-[15px] font-medium transition-colors duration-200 last:border-b-0',
                          isActive(pathname, href)
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-primary',
                        )}
                      >
                        {label}
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
