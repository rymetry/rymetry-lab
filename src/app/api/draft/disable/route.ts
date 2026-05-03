import { getDraftModeSecret, isDraftModeDisableToken } from '@/lib/security/draft-mode';
import { normalizeSafeRedirectPath } from '@/lib/security/safe-redirect';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const formData = await request.formData();
  const token = String(formData.get('token') ?? '');

  if (!isDraftModeDisableToken(token, getDraftModeSecret())) {
    return new Response('Invalid draft token', { status: 401 });
  }

  return disableDraftMode(url);
}

async function disableDraftMode(url: URL): Promise<never> {
  const draft = await draftMode();
  draft.disable();

  redirect(normalizeSafeRedirectPath(url.searchParams.get('redirect'), '/'));
}
