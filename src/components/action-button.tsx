import NextLink from 'next/link';

import { Link as LocaleLink } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  readonly href: string;
  readonly variant?: 'primary' | 'secondary';
  readonly children: React.ReactNode;
  readonly className?: string;
  /**
   * ルート直下の app/not-found.tsx / app/error.tsx は [locale] セグメント外で
   * 描画され NextIntlClientProvider が存在しないため、next-intl の Link は
   * "No intl context found" を throw する。そこでは false を指定して
   * ロケール接頭辞なしの素の next/link にフォールバックする。
   */
  readonly localeAware?: boolean;
}

export function ActionButton({
  href,
  variant = 'primary',
  children,
  className,
  localeAware = true,
}: ActionButtonProps) {
  const isExternal = href.startsWith('http');
  const Link = localeAware ? LocaleLink : NextLink;

  return (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={cn(
        'font-brand inline-flex items-center gap-2 rounded-[3px] px-6 py-[11px] text-[14.5px] font-medium tracking-[0.05em] transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        variant === 'primary' && [
          'border-none bg-[image:var(--accent-gradient)] text-[#f4f1e6]',
          'motion-safe:hover:-translate-y-px hover:shadow-[var(--btn-primary-shadow)]',
        ],
        variant === 'secondary' && [
          'border-[1.5px] border-primary bg-card text-primary',
          'hover:bg-[var(--accent-glow)]',
        ],
        className,
      )}
    >
      {children}
    </Link>
  );
}
