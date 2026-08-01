# Handoff: 静韻 (Seiin) デザイン — rymetry-lab 移植

## Overview

rymetry-lab(Next.js ポートフォリオサイト)の新ビジュアルデザイン「静韻」の実装ハンドオフ。
生成り(warm ecru)×墨(sumi ink)×抹茶グリーンのパレット、明朝体見出し(Kaisei Tokumin)、墨流しテクスチャを特徴とする和×テックのデザイン。

対象コードベース: Next.js (App Router) + Tailwind CSS v4 + shadcn/ui トークン + next-intl + next-themes。
トークンは `src/app/globals.css` に集約されており、移植の大半はトークン差し替えで完了する。

## About the Design Files

同梱の `4a 現行×静韻.dc.html` は **HTMLで作成されたデザインリファレンス(プロトタイプ)** であり、そのまま流用するプロダクションコードではない。
実装タスクは、このデザインを **rymetry-lab の既存環境(Next.js / Tailwind v4 / 既存コンポーネント群)の流儀で再現する**こと。
プロトタイプのランタイム構造(`<x-dc>`、`support.js`、インラインstyle)はコピーしないこと。

## Fidelity

**High-fidelity。** 色・タイポグラフィ・余白・角丸・ホバー挙動は最終仕様として扱い、ピクセル精度で再現する。
値はすべて本README に記載済み。迷ったら README を正とする(プロトタイプHTMLは挙動確認用)。

---

## 実装フェーズ(推奨順)

1. **Phase 1: トークン差し替え**(globals.css) — 効果の8割
2. **Phase 2: フォント追加**(layout.tsx)
3. **Phase 3: 墨アセット配置**(public/images/ink/)
4. **Phase 4: 構造変更**(Home グリッド、フッター、カード)
5. **Phase 5: 検証**(Storybook / ダークモード / タブレット幅 / e2e)

Phase 1–3 を1ブランチ、Phase 4 を別ブランチに分けると安全。

---

## Phase 1: デザイントークン(globals.css)

`:root` と `.dark` の既存トークンを以下に差し替える。**表にない既存トークンは現状維持。**

### shadcn 標準トークン

| トークン | Light | Dark |
|---|---|---|
| `--background` | `#f1eee5` | `#131714` |
| `--foreground` | `#1c1b17` | `#eae8dc` |
| `--card` | `#f7f5ec` | `#1b211c` |
| `--card-foreground` | `#1c1b17` | `#eae8dc` |
| `--popover` | `#f7f5ec` | `#1b211c` |
| `--popover-foreground` | `#1c1b17` | `#eae8dc` |
| `--primary-ch` | `0.45 0.10 152` | `0.75 0.10 154` |
| `--accent-2-ch` | `0.55 0.11 152` | `0.82 0.07 154` |
| `--primary-foreground` | `#f4f1e6` | `#09120c`(現行踏襲で可) |
| `--secondary` | `#e9e6db` | `#171c18` |
| `--secondary-foreground` | `#1c1b17` | `#eae8dc` |
| `--muted` | `#e9e6db` | `#171c18` |
| `--muted-foreground` | `#6f6b59` | `#8f947e` |
| `--border` | `#dcd7c8` | `#2a312b` |
| `--input` | `#dcd7c8` | `#2a312b` |
| `--radius` | `0.25rem`(共通。**0.5rem のままだと印象が別物になる**) | 同左 |

`--primary-ch` / `--accent-2-ch` は channel primitive なので、これを変えるだけで
`--primary` / `--accent` / `--ring` / gradient / tag / glow / dot 系が連動して抹茶グリーンに変わる。

### デザイン固有トークン

| トークン | Light | Dark |
|---|---|---|
| `--text-secondary` | `#4e4c43` | `#b2b0a1` |
| `--border-hover` | `#c6c0ab` | `#3c443c` |
| `--bg-code` | `#e9e6d8` | `#232a24` |
| `--accent-glow` | `oklch(0.45 0.10 152 / 0.08)` | `oklch(0.75 0.06 154 / 0.10)` |
| `--accent-gradient` | `linear-gradient(135deg, oklch(0.34 0.08 152), oklch(0.52 0.10 152))` | `linear-gradient(135deg, oklch(0.42 0.07 154), oklch(0.62 0.10 154))` |
| `--hero-bg` | `linear-gradient(180deg, #eceadd 0%, #f1eee5 100%)` | `linear-gradient(180deg, #11150f 0%, #131714 100%)` |
| `--card-shadow` | `0 1px 3px rgba(28,27,23,0.05), 0 1px 2px rgba(28,27,23,0.07)` | `0 1px 3px rgba(0,0,0,0.5)` |
| `--card-shadow-hover` | `0 10px 26px oklch(0.45 0.08 152 / 0.12), 0 2px 6px rgba(28,27,23,0.05)` | `0 10px 26px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.3)` |
| `--tag-bg` | `#ebe8d9` | `oklch(0.26 0.03 152)` |
| `--tag-text` | `oklch(0.38 0.09 152)` | `oklch(0.84 0.06 152)` |
| `--tag-border` | `#cbc6ae` | `oklch(0.40 0.05 152)` |
| `--dot-color` | `oklch(0.45 0.06 152 / 0.07)` | `oklch(0.75 0.05 154 / 0.06)` |

追加トークン(新設):

| トークン | Light | Dark | 用途 |
|---|---|---|---|
| `--page-gradient` | `linear-gradient(180deg, #eceadd 0, rgba(236,234,221,0) 340px)` | `linear-gradient(180deg, #11150f 0, rgba(17,21,15,0) 340px)` | Articles / Projects / About / 記事詳細ページの上部フェード背景 |
| `--band-bg` | `#151b16` | `#0e120f` | フッター帯・コードブロック背景 |
| `--band-border` | `#2c332c` | `#242b25` | 同上の罫線 |
| `--band-texture` | `repeating-radial-gradient(circle at 15% -30%, rgba(214,226,210,0.03) 0 2px, transparent 2px 30px)` | 同左 | ヒーロー内ターミナルの質感 |

補足:
- **ダークのフッター帯(`--band-bg` #0e120f)は地(#131714)より一段深い**。「下端で墨が深まる」意図。地より明るくしないこと(浮いて見える)。
- Terminal 系トークン(`--terminal-*`)は現状維持。band とは分離しておく。
- `--thumb-gradient-*` は Phase 4 で削除済み (墨サムネイル移行で未使用化。DIVERGENCE.md「その他」参照)。
- インラインコード背景は `--bg-code`、input placeholder は `#8a8577`(light)。

## Phase 2: フォント(layout.tsx)

1. `next/font/google` で **Kaisei Tokumin**(weights: 400, 500, 700, 800)を追加し、CSS変数 `--font-brand` として注入。
2. `@theme` に `--font-brand: var(--font-kaisei), var(--font-sans-jp), serif;` を登録(Tailwind の `font-brand` ユーティリティ化)。
3. 適用箇所: h1/h2/h3 見出し、ナビリンク、カードタイトル、「View all →」リンク、ヒーローのブランド名。
4. 既存の Geist / Noto Sans JP / PlemolJP HS はそのまま(本文 = sans、コード = mono)。

タイポ仕様(プロトタイプ準拠):
- ページ見出し h2: `font-brand` 700 / `clamp(26px, 3.4vw, 38px)` / `letter-spacing: 0.02em`
- セクション見出し h2(Home): `font-brand` 700 / `clamp(22px, 3vw, 32px)` / `letter-spacing: 0.02em`
- カードタイトル h3: `font-brand` 700 / 17px(グリッド)、16px(リスト)
- リード文: sans 15px / `line-height: 1.7` / `color: var(--text-secondary)` / 冒頭センテンスのみ `font-weight: 500; color: var(--foreground)`
- meta(日付・ロール等): mono 11.5–12px / `color: var(--accent)` または `var(--muted-foreground)`
- 本文(記事): 15.5px / `line-height: 1.85`

## Phase 3: 墨アセット(assets/ → public/images/ink/)

同梱 `assets/` の6枚を `public/images/ink/` へコピー:

| ファイル | 用途 |
|---|---|
| `ink-flow-{light,dark}.png` | ヒーロー右(heroInk="main"時)、各一覧ページ見出し背後の透かし(右上、opacity 0.5 程度、pointer-events:none) |
| `ink-fine-{light,dark}.png` | 記事カードサムネイル、About アバター背景(opacity 0.8)、スケルトンのプレースホルダ |
| `ink-vortex-{light,dark}.png` | ローディング画面 |

- ライト/ダークで別画像。`<Image>` 2枚 + `dark:hidden` / `hidden dark:block` が最小実装(next-themes の hydration 問題を回避できる)。
- カードサムネイルは同一画像を `object-position` / `scale` / `scaleX(-1)` の組み合わせで変化をつける(記事ごとに固定値を割り当て、一覧で隣り合っても同じ絵に見えないように)。プロトタイプの値: `20% 30% / 1.0`、`80% 40% / 1.5 flip`、`50% 60% / 1.2`、`35% 75% / 1.8 flip`、`65% 20% / 1.35`、`90% 65% / 1.6 flip`。opacity 0.9。

## Phase 4: 構造変更

### 4-1. Home セクショングリッド(重要・今回の主変更)

対象: Home の Featured Projects / Recent Articles セクション(`section.tsx` + Home ページ)。

列数を明示的にブレイクポイントへ紐づける(auto-fill をやめる):
- `lg`(≥1024px): 3列 — 見出しブロックは従来通りグリッドの上(全幅)
- `md`(768–1023px): 2列 — **見出し+リード文+「View all →」リンクをグリッドの1マス目に入れ、カード3枚と合わせて 2×2 の完結モジュールにする**
- `<768px`: 1列 — 見出しは全幅、View all リンクは非表示

md 時の見出しセル仕様:
- `display:flex; flex-direction:column; justify-content:center`、右パディング 12px、下 20px
- 「View all projects →」/「View all articles →」リンク: `font-brand` 500 / 14px / `letter-spacing:0.03em` / `color:var(--accent)` / 矢印アイコン(lucide arrow-right 13px)/ gap 6px / margin-top 16px
- このリンクが表示されるのは **md(2列)時のみ**

グリッド: `gap: 20px`、カード幅は `minmax(0, 1fr)`。

### 4-2. Recent Articles の背景帯を撤去

Home の Recent Articles セクションの `bg2` 帯(背景色ブロック+border-top)を**削除**し、Featured と地続きの `--background` にする。セクション区切りは余白と見出しのみで表現する(追加の余白は入れない。現行のセクションパディングのまま)。

### 4-3. フッター(footer.tsx)

- 背景 `var(--band-bg)`、上罫線 `1px solid var(--band-border)`、padding `40px 24px`
- フッターはライト/ダーク共に墨色の帯(ライト #151b16 / ダーク #0e120f)
- フッター内は常にダーク配色: テキスト `#828773` 系、ソーシャルアイコン枠 `1px solid #2c332c` / 34×34px / radius 3px、ホバーで `color: var(--accent-2)` + `border-color` 明るく

### 4-4. カード共通仕様

- 背景 `var(--card)`、`border: 1px solid var(--border)`、`border-radius: 4px`
- hover: `border-color: var(--border-hover)`、`box-shadow: var(--card-shadow-hover)`、`transform: translateY(-2px)`、`transition: transform .25s, box-shadow .25s, border-color .25s`
- プロジェクトカード: アイコンチップ 38×38px(`--accent-glow` 背景 + `--tag-border` 枠 + radius 3px)→ ロール(mono 11.5px, accent)→ タイトル(brand 17px)→ 説明(13.5px / 1.6)→ タグ列
- 記事カード: 墨サムネイル(高さ150px、`--secondary` 背景、下罫線)→ 本文 padding 20px
- タグチップ: `padding: 3px 9px` / `--tag-bg` / `1px solid --tag-border` / radius 2px / mono 11px / `--tag-text` / アイコン 11px accent

### 4-5. 見出しの漢字スタンプ(オプション)

`section.tsx` にオプション prop として追加(デフォルトOFF、プロトタイプの `kanjiStamp` トグルに対応):
- 見出し先頭に 30×30px の角印: `background: var(--accent-gradient)`、文字色 `#f4f1e6`、radius 3px、`transform: rotate(-3deg)`、明朝 16px、右マージン 12px
- 文字: Featured Work=「作」、Recent/Articles=「記」、Projects=「作」、About=「道」

### 4-6. ヒーロー(hero-section.tsx)

- 背景 `var(--hero-bg)` + ドットグリッド(`radial-gradient(circle at 1px 1px, var(--dot-color) 1px, transparent 0)` / `background-size: 28px 28px`)
- 右側ターミナル: `--band-bg` 背景 + `--band-texture` + `--band-border` 枠(既存 Terminal コンポーネントの配色をこの帯系トークンに寄せる)
- ヒーロー背後に ink-flow 透かし(オプション `heroInk`: "background" = 透かし+ターミナル / "main" = 墨流し画像をメインに)

## Interactions & Behavior

- カード hover: 上記 4-4(浮き上がり)。ナビ現在地: `color: var(--accent)` + 下線(2px、リンク下 2px オフセット)
- ページ遷移時はスクロールトップへ
- スクロールリベール(既存 `scroll-reveal` / fadeUp 24px)は現状維持
- スケルトン: `--secondary` ベース + pulse、カードサムネ部に ink-fine を薄く敷く
- レスポンシブ: 1024 / 768 / 480 の3段(4-1 参照)。モバイルは padding-x 16px

## State Management

既存のまま(theme = next-themes、locale = next-intl)。新規 state は不要。
4-1 の列切替は CSS(Tailwind の `md:` / `lg:`)のみで実装し、JS での幅判定はしない。

## Design Tokens まとめ

- 色: 上記 Phase 1 の表が全量
- 角丸: カード 4px / チップ・ボタン 3px / タグ 2px(`--radius: 0.25rem` 基準)
- 余白: セクション縦 72px(デスクトップ)/ 56px(タブレット)/ 48px(モバイル)、グリッド gap 20px、カード内 padding 24px(プロジェクト)/ 20px(記事)
- 最大幅: 1200px、横 padding 24px(モバイル 16px)

## Assets

- `assets/ink-*.png` 6枚(本パッケージ同梱、生成済みテクスチャ。ライセンス制約なし)
- アイコン: lucide(既存)+ simple-icons(ソーシャル)。プロトタイプは iconify CDN だが、実装では既存の `src/components/icons` / lucide-react を使うこと
- フォント: Kaisei Tokumin(Google Fonts / OFL)

## Files

- `デザインリファレンスHTML`(4a 現行×静韻.dc.html)— 確定版。検討過程の死にコードは除去済み
- `assets/ink-*.png` — 墨テクスチャ 6枚
- `support.js` — プロトタイプのランタイム(参照用に同梱。**実装には使わない**)
