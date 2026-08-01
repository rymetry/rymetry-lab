import Link from 'next/link';

import { SOCIAL_LINKS } from '@/data/social-links';
import { cn } from '@/lib/utils';

interface SocialIconBarProps {
  readonly className?: string;
  /** footer = 墨帯上の常時ダーク配色 (テーマ非連動)。default = ページ配色 */
  readonly variant?: 'default' | 'footer';
}

/** Renders a horizontal row of icon links from SOCIAL_LINKS. External links open in a new tab. */
export function SocialIconBar({ className, variant = 'default' }: SocialIconBarProps) {
  return (
    <div className={cn('flex gap-2', className)}>
      {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => {
        const isExternal = !href.startsWith('/');
        return (
          <Link
            key={label}
            href={href}
            aria-label={label}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className={cn(
              'flex size-[34px] items-center justify-center rounded-[3px] border',
              'transition-colors duration-200',
              variant === 'footer'
                ? 'border-[#2c332c] text-[#828773] hover:border-[#93c7a9] hover:text-[#93c7a9] focus-visible:ring-offset-[var(--band-bg)]'
                : 'border-border text-muted-foreground hover:border-primary hover:bg-[var(--accent-glow)] hover:text-primary focus-visible:ring-offset-background',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            )}
          >
            <Icon size={16} />
          </Link>
        );
      })}
    </div>
  );
}
