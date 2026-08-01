import { CalendarIcon, ClockIcon, PenLineIcon } from 'lucide-react';
import Image from 'next/image';

import { InkImage, inkThumbVariant } from '@/components/ink-image';
import { TagList } from '@/components/tag';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { Article, ArticleImage } from '@/types/article';

interface ArticleCardProps {
  readonly article: Article;
  readonly href?: string;
  readonly className?: string;
  readonly variant?: 'grid' | 'list';
}

function ArticleThumbnail({
  slug,
  image,
  layout,
}: {
  readonly slug: string;
  readonly image?: ArticleImage;
  readonly layout: ArticleCardProps['variant'];
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-secondary',
        layout === 'list'
          ? 'h-full min-h-[120px] border-r border-border'
          : 'h-[150px] border-b border-border',
      )}
    >
      {image ? (
        <Image
          src={image.url}
          alt=""
          fill
          sizes="(max-width: 480px) 100vw, 320px"
          className="object-cover"
        />
      ) : (
        <InkImage
          kind="fine"
          className={cn(
            'absolute inset-0 h-full w-full object-cover opacity-90',
            inkThumbVariant(slug),
          )}
          sizes="(max-width: 480px) 100vw, 320px"
        />
      )}
    </div>
  );
}

export function ArticleCard({ article, href, className, variant = 'grid' }: ArticleCardProps) {
  const isList = variant === 'list';

  return (
    <Link
      href={href ?? `/articles/${article.slug}`}
      className={cn(
        'group relative overflow-hidden rounded-[4px] border border-border bg-card',
        isList
          ? // max-md と max-[480px] は CSS 出力順で 480px 側が先になり打ち消されるため、範囲を重ねない
            'grid grid-cols-[minmax(140px,220px)_1fr] min-[480px]:max-md:grid-cols-[100px_1fr] max-[480px]:grid-cols-[80px_1fr]'
          : 'flex flex-col',
        'transition-all duration-[250ms]',
        'hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:shadow-[var(--card-shadow-hover)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      <ArticleThumbnail slug={article.slug} image={article.ogpImage} layout={variant} />

      <div className={cn(isList ? 'flex flex-col justify-center p-5' : 'p-5')}>
        {/* Meta */}
        <div className="mb-2.5 flex items-center gap-3.5 font-mono text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CalendarIcon size={12} aria-hidden="true" />
            {article.publishedAt}
          </span>
          {article.updatedAt && (
            <span className="inline-flex items-center gap-1">
              <PenLineIcon size={12} aria-hidden="true" />
              {article.updatedAt}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <ClockIcon size={12} aria-hidden="true" />
            {article.readingTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-base font-bold leading-snug tracking-[-0.01em]">
          {article.title}
        </h3>

        {/* Tags */}
        <TagList tags={article.tags} />
      </div>
    </Link>
  );
}
