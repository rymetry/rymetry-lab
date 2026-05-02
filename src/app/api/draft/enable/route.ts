import { isTimingSafeEqual } from '@/lib/security/timing-safe-secret';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

import { normalizeSafeRedirectPath } from '@/lib/security/safe-redirect';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = process.env.DRAFT_MODE_SECRET ?? '';
  const token = url.searchParams.get('secret');

  if (!isTimingSafeEqual(token, secret)) {
    return new Response('Invalid draft secret', { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(normalizeSafeRedirectPath(url.searchParams.get('redirect'), '/'));
}
