import { normalizeSafeRedirectPath } from '@/lib/security/safe-redirect';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const draft = await draftMode();
  draft.disable();

  redirect(normalizeSafeRedirectPath(url.searchParams.get('redirect'), '/'));
}
