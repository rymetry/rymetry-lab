import { createHmac } from 'node:crypto';

import { isTimingSafeEqual } from './timing-safe-secret';

const DRAFT_MODE_DISABLE_CONTEXT = 'draft-mode:disable:v1';

type DraftModeEnv =
  | NodeJS.ProcessEnv
  | Partial<Record<'DRAFT_MODE_SECRET' | 'MICROCMS_PREVIEW_SECRET', string | undefined>>;

export function getDraftModeSecret(env: DraftModeEnv = process.env): string {
  return env.DRAFT_MODE_SECRET?.trim() || env.MICROCMS_PREVIEW_SECRET?.trim() || '';
}

export function isDraftModeSecret(
  token: string | null | undefined,
  env: DraftModeEnv = process.env,
): boolean {
  return isTimingSafeEqual(token, getDraftModeSecret(env));
}

export function createDraftModeDisableToken(secret: string): string {
  if (!secret) return '';

  return createHmac('sha256', secret).update(DRAFT_MODE_DISABLE_CONTEXT).digest('hex');
}

export function isDraftModeDisableToken(
  token: string | null | undefined,
  secret = getDraftModeSecret(),
): boolean {
  return isTimingSafeEqual(token, createDraftModeDisableToken(secret));
}
