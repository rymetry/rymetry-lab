import { isDraftModeSecret } from '@/lib/security/draft-mode';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

import { normalizeSafeRedirectPath } from '@/lib/security/safe-redirect';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('secret');

  if (!isDraftModeSecret(token)) {
    return new Response('Invalid draft secret', { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(normalizeSafeRedirectPath(url.searchParams.get('redirect'), '/'));
}
