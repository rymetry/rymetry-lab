import { CalendarIcon, ClockIcon } from 'lucide-react';
import Link from 'next/link';

import { TagList } from '@/components/tag';
import { cn } from '@/lib/utils';
import type { Article } from '@/types/article';

interface ListCardProps {
  readonly article: Article;
  readonly className?: string;
}

function ListCardThumbnail({ icon: Icon }: { readonly icon: Article['thumbnailIcon'] }) {
  return (
    <div className="relative min-h-[90px] bg-secondary">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-[image:var(--thumb-gradient-sm)]" />
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:14px_14px]" />
      {/* Icon */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 text-foreground">
        <Icon size={22} />
      </div>
    </div>
  );
}

export function ListCard({ article, className }: ListCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        'group relative grid grid-cols-[120px_1fr] overflow-hidden rounded-[9px] border border-border bg-card',
        'transition-all duration-200',
        'hover:-translate-y-px hover:border-[var(--accent)] hover:shadow-[var(--card-shadow-hover)]',
        'before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-0.5 before:bg-[image:var(--accent-gradient)] before:opacity-0 before:transition-opacity before:duration-200',
        'hover:before:opacity-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'max-md:grid-cols-[100px_1fr] max-[480px]:grid-cols-[80px_1fr]',
        className,
      )}
    >
      <ListCardThumbnail icon={article.thumbnailIcon} />

      <div className="flex flex-col justify-center px-4.5 py-3.5">
        {/* Title */}
        <h4 className="mb-1 text-sm font-semibold leading-snug">{article.title}</h4>

        {/* Meta */}
        <div className="mb-1.5 flex items-center gap-2.5 font-mono text-[11.5px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CalendarIcon size={11} aria-hidden="true" />
            {article.publishedAt}
          </span>
          <span className="inline-flex items-center gap-1">
            <ClockIcon size={11} aria-hidden="true" />
            {article.readingTime}
          </span>
        </div>

        {/* Tags */}
        <TagList tags={article.tags} size="sm" className="gap-1" />
      </div>
    </Link>
  );
}
