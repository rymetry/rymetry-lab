/**
 * ロケール付き URL の組み立て。canonical / hreflang (`./metadata`) と sitemap
 * (`@/app/sitemap`) が同じ変換を共有するための単一の置き場所。
 *
 * ここが surface ごとに分岐すると「canonical は `/en/about` なのに sitemap は `/about` しか
 * 載せていない」のような自己矛盾したシグナルを検索エンジンに送ることになる (Issue #114)。
 *
 * `src/i18n/routing.ts` の `localePrefix: 'as-needed'` に合わせ、既定ロケール (ja) の URL は
 * 接頭辞を持たない。`/ja/about` は `/about` にリダイレクトされるため正規 URL たり得ない。
 */

export const LOCALES = ['ja', 'en'] as const;

export type SeoLocale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: SeoLocale = 'ja';

export function buildAbsoluteUrl(path: string, siteUrl: string): string {
  if (/^https?:\/\//.test(path)) return path;

  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

/** ロケール非依存のパス (`/about`) を、そのロケールの正規 URL に変換する */
export function buildLocalizedUrl(path: string, siteUrl: string, locale: SeoLocale): string {
  return buildAbsoluteUrl(localizePath(stripLocalePrefix(path), locale), siteUrl);
}

/** 全ロケール分の hreflang マップ。Google の要求どおり自ロケールも含める */
export function buildLanguageAlternates(path: string, siteUrl: string): Record<string, string> {
  const languages = Object.fromEntries(
    LOCALES.map((locale) => [locale, buildLocalizedUrl(path, siteUrl, locale)]),
  );

  return {
    ...languages,
    'x-default': buildLocalizedUrl(path, siteUrl, DEFAULT_LOCALE),
  };
}

function stripLocalePrefix(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  for (const locale of LOCALES) {
    if (normalizedPath === `/${locale}`) return '/';
    if (normalizedPath.startsWith(`/${locale}/`)) return normalizedPath.slice(locale.length + 1);
  }

  return normalizedPath;
}

function localizePath(path: string, locale: SeoLocale): string {
  if (locale === DEFAULT_LOCALE) return path;
  if (path === '/') return `/${locale}`;

  return `/${locale}${path}`;
}
