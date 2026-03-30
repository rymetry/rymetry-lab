import Link from 'next/link';

import { cn } from '@/lib/utils';

interface ActionButtonProps {
  readonly href: string;
  readonly variant?: 'primary' | 'secondary';
  readonly children: React.ReactNode;
  readonly className?: string;
}

export function ActionButton({ href, variant = 'primary', children, className }: ActionButtonProps) {
  const isExternal = href.startsWith('http');

  return (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={cn(
        'inline-flex items-center gap-2 rounded-[9px] px-[22px] py-[11px] text-sm font-semibold transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        variant === 'primary' && [
          'border-none bg-[image:var(--accent-gradient)] text-white',
          'motion-safe:hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(4,120,87,0.3)] dark:hover:shadow-[0_4px_16px_rgba(92,216,200,0.2)]',
        ],
        variant === 'secondary' && [
          'border-[1.5px] border-primary bg-card text-primary',
          'hover:border-[var(--accent-2)] hover:bg-[var(--accent-glow)]',
        ],
        className,
      )}
    >
      {children}
    </Link>
  );
}
