import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { draftMode } from 'next/headers';

export async function DraftModeIndicator() {
  const draft = await draftMode();
  if (!draft.isEnabled) return null;

  const t = await getTranslations('DraftModeIndicator');

  return (
    <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-950 dark:text-amber-100">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3">
        <p className="font-medium">
          <span className="font-mono text-xs uppercase tracking-[0.1em]">{t('label')}</span>
          <span className="ml-2">{t('message')}</span>
        </p>
        <Link
          href="/api/draft/disable"
          className="rounded-md border border-amber-500/40 px-2.5 py-1 font-mono text-xs transition-colors hover:bg-amber-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t('disable')}
        </Link>
      </div>
    </div>
  );
}
