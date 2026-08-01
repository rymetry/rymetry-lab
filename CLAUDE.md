# Rymlab — Portfolio & Blog

## Overview

Productivity Engineer "Rym" のポートフォリオ & 技術ブログ。Site: Rymlab / Handle: rymetry / Deploy: Vercel / CMS: microCMS

## Tech Stack

| Category  | Technology                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------ |
| Framework | Next.js 16 (App Router, `'use cache'`)                                                           |
| Runtime   | React 19, TypeScript 6 (strict), Bun                                                             |
| Styling   | Tailwind CSS v4, shadcn/ui (New York), Iconify (lucide + simple-icons)                           |
| CMS       | microCMS → unified (rehype-sanitize, rehype-prism-plus)                                          |
| Testing   | Vitest (unit/component via Storybook) + Playwright (E2E) + Storybook 10 (@storybook/nextjs-vite) |
| Lint      | ESLint 9 (flat config) + Prettier 3                                                              |
| i18n      | next-intl (Phase 3) / Dark Mode: next-themes                                                     |

## Fonts

- **Brand/見出し**: Kaisei Tokumin (`next/font/google`, 400/500/700/800) → `--font-kaisei` (composited as `--font-brand`)。h1-h3、ナビ、カードタイトル、View all リンクに適用
- **Display/EN**: Geist (`next/font/google`) → `--font-display`
- **JP**: Noto Sans JP (`next/font/google`) → `--font-sans-jp`
- **Code**: PlemolJP HS (`next/font/local`, fallback: Geist Mono) → `--font-plemol` (composited as `--font-mono`)

## Design System — 静韻 (Seiin)

生成り (warm ecru) × 墨 (sumi ink) × 抹茶グリーンの和×テックデザイン。
仕様書: `design-mock/handoff-seiin/README.md` (トークン全量・タイポ・構造仕様) / プロトタイプ実物: `design-mock/handoff-seiin/4a 現行×静韻.dc.html` / 差分台帳: `design-mock/handoff-seiin/DIVERGENCE.md` (**意図的逸脱 🎯 はここに記録。プロトタイプとの差分を「修正」する前に必ず参照**)

### Colors — 抹茶グリーン 152°/154° (oklch channel primitives)

**Light** — bg: #f1eee5 / card: #f7f5ec / `--primary-ch: 0.45 0.10 152` / `--accent-2-ch: 0.55 0.11 152`
**Dark** — bg: #131714 / card: #1b211c / `--primary-ch: 0.75 0.10 154` / `--accent-2-ch: 0.82 0.07 154` (Hunt 効果補正 +2°)
`--primary-ch` / `--accent-2-ch` (L C H) が channel primitive で、accent / ring / gradient / glow / dot 系はここから導出。ニュートラルは hex 維持。
デザイン固有トークン: `--text-secondary` `--border-hover` `--bg-code` `--accent-gradient` `--hero-bg` `--card-shadow(-hover)` `--tag-*` `--dot-color` `--page-gradient` (一覧・詳細ページ上部フェード)。
**墨帯 (band)**: `--band-bg` / `--band-border` / `--band-texture` — フッター・コードブロック・ヒーロー内ターミナルが共有する「墨の帯」言語。ライトでも常に墨色、ダークの band-bg (#0e120f) は地より一段深くする (地より明るくしないこと)。`--terminal-*` は band 系を参照。
コードブロックは両テーマ共通の墨帯面 (`--band-bg` / `--band-border`、本文 #cfd6c8)。Prism シンタックス色は緑系トーン (#93c7a9 / #7fb394 軸、コメント #828773 = 4.7:1)。ファイル名付きコード (microCMS `data-filename`) は `figure.code-block` + `figcaption.code-filename` に変換して表示する。

### 墨テクスチャ (public/images/ink/)

- `ink-flow`: ヒーロー右のメインビジュアル (`heroInk="main"`, priority 付き)、一覧ページ見出し背後の透かし (`PageInk`)
- `ink-fine`: 記事カード・リストカードのサムネイルのフォールバック (microCMS の ogpImage を優先し、未設定時のみ slug から決定的に 6 バリエーション選択)、About アバター
- `ink-vortex`: ローディング画面
- ライト/ダークで別画像。`InkImage` が 2 枚描画し CSS (`dark:hidden` / `hidden dark:block`) で切替。常に lazy — 非表示側テーマはフェッチされない。LCP になる画像は `InkPreload` (media 限定 preload) を併用する。next/image の `priority` は使わない (preload に media が付かず、非表示ビューポートでも両テーマ分ダウンロードされるため)

### Tags

タグチップ本体は緑系 (`--tag-bg` / `--tag-text` / `--tag-border`)。アイコンのみ下表のカテゴリ色を維持 (🎯 意図的逸脱: プロトタイプは全 accent 一色だがカテゴリ識別性を優先)。

| Category     | Color                | Icon                       |
| ------------ | -------------------- | -------------------------- |
| Frontend     | oklch(0.70 0.15 156) | lucide:monitor             |
| Backend      | oklch(0.62 0.19 260) | lucide:server / database   |
| Infra        | oklch(0.61 0.22 293) | lucide:cloud / git-branch  |
| DevOps       | oklch(0.69 0.15 190) | lucide:infinity            |
| Languages    | oklch(0.77 0.16 70)  | lucide:code                |
| Tools/DX     | oklch(0.66 0.21 354) | lucide:wrench / sparkles   |
| Security     | oklch(0.64 0.21 25)  | lucide:shield              |
| Perf/Metrics | oklch(0.71 0.13 215) | lucide:gauge / bar-chart-3 |
| Testing      | oklch(0.70 0.19 48)  | lucide:flask-conical       |
| Release      | oklch(0.63 0.23 304) | lucide:rocket              |

### Animations

- Hero: staggered fadeUp (anim-up, 0s/0.12s/0.24s) + 墨流し float (9s)。ターミナル typewriter (typeReveal) は `heroInk="background"` 時のみ
- Cards: hover は border-color + shadow + translateY(-2px) のみ。グリーントップバー・矢印・アイコン変形は撤去済み — 復元しないこと。Related/Prev-Next も ArticleCard variant="list" に統一済み (専用 ListCard は削除)
- Scroll: IntersectionObserver → .reveal → .visible
- `prefers-reduced-motion` で全アニメーション無効化 (reveal/anim-up/anim-fade/t-line は強制表示)

### Responsive

- 1024px: Home グリッド 3列→2列 (見出しセルがグリッド1マス目に入り 2×2 モジュール、「View all →」リンクは md のみ表示)、TOC は本文上のアコーディオン (details、デフォルト閉) に切替
- 768px: ハンバーガー (Sheet)、1カラム、padding 16px
- 480px 未満: リストカードのサムネイル列 80px (`max-[480px]` は排他的 `width < 480px`。`max-md` と併用する場合は CSS 出力順で打ち消されるため `min-[480px]:max-md:` で範囲を重ねない)

### Social Links

GitHub, X, LinkedIn, Zenn, Qiita, RSS — simple-icons:\* + lucide:rss

## Pages

| Route              | Content                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------ |
| `/`                | Hero (墨流しメイン, `heroInk="main"`) + Featured Work (3カード) + Recent Articles (帯なし・地続き) |
| `/projects`        | プロジェクトグリッド (auto-fill)                                                           |
| `/articles`        | 検索 + タグフィルタ + ページネーション + Grid/List切替                                     |
| `/articles/[slug]` | シェルレイアウト (戻りリンク + リード文。アイキャッチ表示なし、OGP メタは維持) + TOC (sticky 240px, スクロール連動) + 関連記事 → 前後ナビ (alt 帯) |
| `/about`           | Profile + Engineering Principles (4カード) + Tech Stack                                    |

## Architecture

```
microCMS → SDK → adaptArticle()/adaptTag() → 'use cache' (cacheLife 300s) → Component
                                                ↓
                                    rehype (sanitize → highlight → TOC)
```

- Adapter パターンで CMS スキーマとアプリ型を分離
- テンプレート参照: github.com/rymetry/nextjs-portfolio-blog-template

## Accessibility

focus-visible (緑アウトライン), aria-label (全アイコンボタン), skip link, 検索 aria-label

## GitHub Issues

Epics #1-#10 (`epic`), Tasks #11-#44 (`task`)

- Phase 1 (Core): #1,#2,#3,#4,#6 → #11-#27,#32,#42-#44
- Phase 2 (Content): #5,#7,#9 → #28-#31,#33-#35,#38,#39
- Phase 3 (Polish): #8,#10 → #36,#37,#40,#41

## Claude Code / Agent Config

- **Agent entrypoint**: `AGENTS.md` — Codex/agent 向けの短い作業ルール。詳細仕様はこの `CLAUDE.md` を source of truth とする
- **Permissions example**: `.claude/settings.example.json` — コピーして `.claude/settings.local.json` として使う。個人設定は commit しない
- **Skills**: `.agents/skills/` — shadcn, react-best-practices, composition-patterns, web-design-guidelines, browser-use
- **Rules**: project-specific rules は `AGENTS.md` と `.agents/skills/*/rules` に集約する。unsupported な独自 rules ディレクトリは増やさない
- **Hooks example**: `.claude/settings.example.json` に PostToolUse Prettier 自動フォーマットと PreToolUse `.env` 保護の例を含める

## Implementation Notes

- 実装順: セットアップ (#11-#16,#42) → Story 先行 → コンポーネント → ページ組み立て
- Storybook: @storybook/nextjs-vite v10.3.x (Next.js 16 対応済), Tailwind v4 は @tailwindcss/vite で統合
- lefthook: pre-commit で `format:check` + `lint` を自動実行
- Iconify: 実装時は @iconify/json でバンドル (CDN は FOUC リスク)。現状は lucide-react + インライン SVG (social icons) で統一

## Storybook Story ルール

- **データはプロトタイプ準拠**: Story のサンプルデータ（タイトル、説明、日付等）は `design-mock/handoff-seiin/4a 現行×静韻.dc.html` または実装の messages/ja.json・data/ からコピーする。適当なプレースホルダーを使わない
- **ThemeProvider は最小限**: `useTheme()` を直接/間接的に使用するコンポーネント (ThemeToggle, および ThemeToggle を内包する Header) のみ ThemeProvider でラップ。他は `preview.tsx` の `WithThemeClass` デコレータ + `globals: { theme: 'dark' }` でテーマ制御
- **intl はグローバル供給**: `preview.tsx` の `WithIntl` デコレータが NextIntlClientProvider (ja) を全 Story に供給する。`next-intl/server` API を使う async ページ Story は `.storybook/next-intl-server-mock.ts` (viteFinal alias) + `experimentalRSC` で描画
- **DarkMode Story**: 全コンポーネントに DarkMode variant を用意し、`globals: { theme: 'dark' }` を必ず設定する
- **プロトタイプ変更時は双方更新**: 実装の CSS 変数やスタイルを変更したら DIVERGENCE.md に記録する (プロトタイプ HTML は原則編集しない)
- フォント: 実装は next/font、Storybook は `.storybook/storybook-fonts.css` (Kaisei Tokumin は Google Fonts CDN 代用。`--font-kaisei` 未定義だと見出しが sans にフォールバックするので注意)
- プロトタイプ確認: `python3 -m http.server 8234` → localhost:8234/design-mock/handoff-seiin/4a%20現行×静韻.dc.html

## Hooks Setup

Claude Code hooks are opt-in local settings. To enable the documented permissions and hooks:

```bash
mkdir -p .claude
cp .claude/settings.example.json .claude/settings.local.json
```

`.claude/settings.local.json` is ignored and must not be committed.

## Commands

```bash
bun run dev / bun run build / bun run storybook / bun run lint / bun run format
bun run typecheck / bun run check
```

`bun run test` is intentionally disabled until Epic #10 completes.
