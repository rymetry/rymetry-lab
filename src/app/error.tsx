'use client';

import { ErrorContent } from '@/app/error-content';
import { RootDocument } from '@/components/root-document';

interface ErrorPageProps {
  readonly error: Error & { digest?: string };
  readonly unstable_retry: () => void;
}

/**
 * `[locale]` の外で発生したエラーの境界 (Issue #106)。
 *
 * ルートレイアウトは pass-through で `<html>` を供給しないため、ここで完全なドキュメントを
 * 持たないと `lang` もフォント変数も当たらない裸の文書になる (production build で実測済み)。
 * ロケールを特定できない位置なので既定ロケールの `ja` を宣言する。
 */
export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
  return (
    <RootDocument lang="ja">
      <ErrorContent error={error} unstable_retry={unstable_retry} />
    </RootDocument>
  );
}
