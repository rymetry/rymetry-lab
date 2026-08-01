import { CalendarIcon, ClockIcon } from 'lucide-react';
import Image from 'next/image';

import { InkImage, inkThumbVariant } from '@/components/ink-image';
import { TagList } from '@/components/tag';
import { Link } from '@/i18n/navigation';
import { buildCardThumbnailUrl } from '@/lib/cms/image';
import { cn } from '@/lib/utils';
import type { Article, ArticleImage } from '@/types/article';

interface ListCardProps {
  readonly article: Article;
  readonly className?: string;
}

function ListCardThumbnail({
  slug,
  image,
}: {
  readonly slug: string;
  readonly image?: ArticleImage;
}) {
  return (
    <div className="relative min-h-[92px] overflow-hidden border-r border-border bg-secondary">
      {image ? (
        <Image
          src={buildCardThumbnailUrl(image.url, { width: 480, height: 320 })}
          alt=""
          fill
          sizes="220px"
          className="object-cover"
        />
      ) : (
        <InkImage
          kind="fine"
          className={cn(
            'absolute inset-0 h-full w-full object-cover opacity-90',
            inkThumbVariant(slug),
          )}
          sizes="120px"
        />
      )}
    </div>
  );
}

export function ListCard({ article, className }: ListCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        'group relative grid grid-cols-[minmax(140px,220px)_1fr] overflow-hidden rounded-[4px] border border-border bg-card',
        'transition-all duration-200',
        'hover:-translate-y-px hover:border-[var(--border-hover)] hover:shadow-[var(--card-shadow-hover)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        // max-md と max-[480px] は CSS 出力順で 480px 側が先になり打ち消されるため、範囲を重ねない
        'min-[480px]:max-md:grid-cols-[100px_1fr] max-[480px]:grid-cols-[80px_1fr]',
        className,
      )}
    >
      <ListCardThumbnail slug={article.slug} image={article.ogpImage} />

      <div className="flex flex-col justify-center px-4.5 py-3.5">
        {/* Title */}
        <h4 className="font-brand mb-1 text-sm font-semibold leading-[1.4]">{article.title}</h4>

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
