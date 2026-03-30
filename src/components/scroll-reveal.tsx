'use client';

import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly as?: 'div' | 'section';
  readonly threshold?: number;
}

export function ScrollReveal({
  children,
  className,
  as: Tag = 'div',
  threshold,
}: ScrollRevealProps) {
  const ref = useScrollReveal<HTMLElement>({ threshold });

  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} className={cn('reveal', className)}>
      {children}
    </Tag>
  );
}
