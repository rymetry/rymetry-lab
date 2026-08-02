import { NotFoundContent } from '@/app/not-found-content';
import { RootDocument } from '@/components/root-document';

/**
 * `[locale]` にマッチしなかった URL の 404 (Issue #106)。
 *
 * ルートレイアウトは pass-through で `<html>` を供給しないため、ここで完全なドキュメントを
 * 持つ必要がある。ロケールを特定できない位置なので既定ロケールの `ja` を宣言する。
 *
 * 既知の制限 (#111): `/en/no-such-page` のようなロケール配下の未マッチ URL も
 * `[locale]` の外にあるこのページに到達するため、英語ツリーでも `lang="ja"` になる。
 * `[locale]/[...rest]` の catch-all を挟めば解決するが、未マッチ URL が PPR ルートになり
 * HTTP ステータスが 404 → 200 (soft 404) に退行するため見送っている。
 */
export default function NotFound() {
  return (
    <RootDocument lang="ja">
      <NotFoundContent />
    </RootDocument>
  );
}
