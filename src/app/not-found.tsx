import { NotFoundContent } from '@/app/not-found-content';
import { RootDocument } from '@/components/root-document';

/**
 * `[locale]` にマッチしなかった URL の 404 (Issue #106)。
 *
 * ルートレイアウトは pass-through で `<html>` を供給しないため、ここで完全なドキュメントを
 * 持つ必要がある。ロケールを特定できない位置なので既定ロケールの `ja` を宣言する。
 * ロケール配下の未マッチ URL は `[locale]/[...rest]` の catch-all が受けるので、
 * ここには到達しない。
 */
export default function NotFound() {
  return (
    <RootDocument lang="ja">
      <NotFoundContent />
    </RootDocument>
  );
}
