import { InkImage } from '@/components/ink-image';

/**
 * 見出し背後に敷く vortex 墨流しの透かし。
 *
 * 位置はプロトタイプ準拠で **560px のコンテンツボックス基準**の absolute
 * (`top:22%` / `left:50%` / `translate(-64.5%, -40%)` / `z-index:-1`)。
 * セクション全体を基準にすると位置がずれるため、`relative` なコンテンツボックスの
 * 直下に置くこと。
 *
 * 404 とエラーページの計 4 画面 (root / `[locale]` × not-found / error) で共有する。
 */
export function VortexWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[22%] -z-[1] h-[620px] -translate-x-[64.5%] -translate-y-[40%] opacity-[0.15] dark:opacity-[0.22]"
    >
      <InkImage kind="vortex" className="h-full w-auto max-w-none" sizes="1100px" />
    </div>
  );
}
