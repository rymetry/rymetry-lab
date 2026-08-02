import { mock } from 'bun:test';

/**
 * `next/font` は Next.js のコンパイラが行うビルド時変換であり、`bun:test` からは
 * 解決できない (`Geist` 等が undefined になり、呼び出した時点で落ちる)。
 *
 * ルート直下の error / not-found は `<html>` を自前で描画する都合上フォント変数
 * クラスを import するため、SSR テストを回すにはここでスタブに差し替える必要がある。
 * 返す `variable` は実装が `<html className>` に流し込む値なので、テスト側は
 * 「フォント変数が当たっているか」をこのスタブ名で検証できる。
 */
const fontStub = (options?: { readonly variable?: string }) => ({
  className: 'mock-font',
  variable: options?.variable ?? '--mock-font',
  style: { fontFamily: 'mock-font' },
});

mock.module('next/font/google', () => ({
  Geist: fontStub,
  Geist_Mono: fontStub,
  Noto_Sans_JP: fontStub,
  Kaisei_Tokumin: fontStub,
}));

mock.module('next/font/local', () => ({
  default: fontStub,
}));
