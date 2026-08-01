import { HomeSectionHead } from '@/components/home-section-head';
import { InkImage } from '@/components/ink-image';
import { SectionContainer, SectionHeader } from '@/components/section';
import { cn } from '@/lib/utils';

function Skeleton({ className }: { readonly className?: string }) {
  return (
    <div className={cn('skeleton-pulse rounded-[3px] bg-muted', className)} aria-hidden="true" />
  );
}

/** サムネイル系スケルトンに薄く敷く墨テクスチャ (プロトタイプ準拠 opacity 0.05) */
function SkeletonInk() {
  return <InkImage kind="fine" className="absolute inset-0 h-full w-full object-cover opacity-5" />;
}

function CardSkeleton({ compact = false }: { readonly compact?: boolean }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[4px] border border-border bg-card',
        compact
          ? 'grid grid-cols-[110px_1fr] min-[480px]:max-md:grid-cols-[100px_1fr] max-[480px]:grid-cols-[80px_1fr]'
          : 'flex flex-col',
      )}
    >
      <div className={cn('relative overflow-hidden', compact ? 'min-h-[92px]' : 'h-[150px]')}>
        <Skeleton className="absolute inset-0 rounded-none" />
        <SkeletonInk />
      </div>
      <div className={cn('flex flex-col', compact ? 'justify-center px-4.5 py-3.5' : 'p-5')}>
        <div className="mb-3 flex gap-2.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>
        <Skeleton className={cn('mb-2.5 h-4', compact ? 'w-[82%]' : 'w-[90%]')} />
        <Skeleton className={cn('mb-4 h-4', compact ? 'w-[58%]' : 'w-[70%]')} />
        <div className="flex flex-wrap gap-[5px]">
          <Skeleton className="h-5 w-16 rounded-[2px] border border-border" />
          <Skeleton className="h-5 w-20 rounded-[2px] border border-border" />
        </div>
      </div>
    </div>
  );
}

export function HomeLoadingState() {
  return (
    <div role="status" aria-label="コンテンツを読み込み中">
      <span className="sr-only">コンテンツを読み込み中</span>
      <SectionContainer>
        <div className="grid min-h-[380px] items-center gap-12 py-8 lg:grid-cols-2">
          <div>
            <Skeleton className="mb-5 h-4 w-40" />
            <Skeleton className="mb-3 h-12 w-full max-w-[620px]" />
            <Skeleton className="mb-6 h-12 w-[82%] max-w-[520px]" />
            <Skeleton className="mb-8 h-5 w-full max-w-[560px]" />
            <div className="flex gap-3">
              <Skeleton className="h-11 w-36" />
              <Skeleton className="h-11 w-28" />
            </div>
          </div>
          <div className="relative h-[320px] overflow-hidden rounded-[5px] border border-border bg-card">
            <Skeleton className="absolute inset-0 rounded-none" />
            <SkeletonInk />
          </div>
        </div>
      </SectionContainer>

      <SectionContainer padY="compact">
        {/* 実ページ (page.tsx) と同じ 1/2/3 列グリッド + 見出しセル構成に揃えて reflow を防ぐ */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <HomeSectionHead title="Recent Articles" />
          {Array.from({ length: 3 }, (_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </SectionContainer>
    </div>
  );
}

export function ArticlesLoadingState() {
  return (
    <div role="status" aria-label="記事一覧を読み込み中">
      <span className="sr-only">記事一覧を読み込み中</span>
      <SectionContainer>
        <SectionHeader
          title="All Articles"
          descriptionEn="Field notes from the trenches of developer productivity."
          description="開発生産性の現場から得た知見。"
        />
        <div className="mb-8 grid gap-3 md:grid-cols-[1fr_auto]">
          <Skeleton className="h-[38px] max-w-[560px] border border-border bg-card" />
          <div className="flex gap-1">
            <Skeleton className="size-[34px] border border-border bg-card" />
            <Skeleton className="size-[34px] border border-border bg-card" />
          </div>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-5">
          {Array.from({ length: 6 }, (_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </SectionContainer>
    </div>
  );
}

export function ArticleDetailLoadingState() {
  return (
    <div role="status" aria-label="記事を読み込み中">
      <span className="sr-only">記事を読み込み中</span>
      <SectionContainer>
        <div className="mx-auto max-w-[1040px]">
          <Skeleton className="mb-5 h-4 w-28" />
          <Skeleton className="mb-3 h-10 w-full" />
          <Skeleton className="mb-6 h-10 w-[72%]" />
          <div className="mb-10 flex flex-wrap gap-2">
            <Skeleton className="h-5 w-20 rounded-[2px] border border-border" />
            <Skeleton className="h-5 w-24 rounded-[2px] border border-border" />
          </div>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div className="max-w-[720px] space-y-4">
              {Array.from({ length: 7 }, (_, index) => (
                <Skeleton
                  key={index}
                  className={cn('h-4', index % 3 === 2 ? 'w-[76%]' : 'w-full')}
                />
              ))}
            </div>
            <div className="rounded-[4px] border border-border bg-card p-[18px] max-lg:hidden">
              <Skeleton className="mb-3 h-4 w-20" />
              <Skeleton className="mb-2 h-3 w-full" />
              <Skeleton className="mb-2 h-3 w-[84%]" />
              <Skeleton className="h-3 w-[68%]" />
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
