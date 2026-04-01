import Link from 'next/link';

import { SOCIAL_LINKS } from '@/data/social-links';
import { cn } from '@/lib/utils';

interface SocialIconBarProps {
  readonly className?: string;
}

/** Renders a horizontal row of icon links from SOCIAL_LINKS. External links open in a new tab. */
export function SocialIconBar({ className }: SocialIconBarProps) {
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
              'flex size-[34px] items-center justify-center rounded-[7px] border border-border',
              'text-muted-foreground transition-colors duration-200',
              'hover:border-primary hover:bg-[var(--accent-glow)] hover:text-primary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            )}
          >
            <Icon size={16} />
          </Link>
        );
      })}
    </div>
  );
}
