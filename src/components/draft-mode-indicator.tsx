import { createDraftModeDisableToken, getDraftModeSecret } from '@/lib/security/draft-mode';
import { getTranslations } from 'next-intl/server';
import { draftMode } from 'next/headers';

export async function DraftModeIndicator() {
  const draft = await draftMode();
  if (!draft.isEnabled) return null;

  const t = await getTranslations('DraftModeIndicator');
  const token = createDraftModeDisableToken(getDraftModeSecret());

  return (
    <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-950 dark:text-amber-100">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3">
        <p className="font-medium">
          <span className="font-mono text-xs uppercase tracking-[0.1em]">{t('label')}</span>
          <span className="ml-2">{t('message')}</span>
        </p>
        <form action="/api/draft/disable" method="post">
          <input type="hidden" name="token" value={token} />
          <button
            type="submit"
            className="rounded-md border border-amber-500/40 px-2.5 py-1 font-mono text-xs transition-colors hover:bg-amber-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {t('disable')}
          </button>
        </form>
      </div>
    </div>
  );
}
