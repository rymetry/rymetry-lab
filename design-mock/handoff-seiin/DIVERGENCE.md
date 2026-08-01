# 静韻プロトタイプ差分チェックリスト

`4a 現行×静韻.dc.html` と実装の全画面突き合わせ結果。
✅ = 対応済み (feat/seiin-design-tokens ブランチ) / ⬜ = Phase 4 ブランチで対応 / 🎯 = 意図的な逸脱 (対応しない)

## 対応済み (Phase 1–3 + 追随修正)

- ✅ トークン全量差し替え (Phase 1 表)・Kaisei Tokumin・墨テクスチャ配置
- ✅ 404: 明朝数字 800/+0.02em、`// NOT_FOUND` ラベル削除、ターミナル削除、中央配置 (`min-h-[calc(100vh-140px)]`)
- ✅ 記事詳細: h1 `clamp(28,4.4vw,46)/700/+0.01em/1.4`、`// ARTICLE` ラベル削除、アイキャッチ表示削除 (OGP メタは維持)、`--page-gradient` 適用
- ✅ 本文: h2 22px/600/+0.01em、インラインコード accent 色 + 角丸2px、コードブロック墨帯化 (`--band-bg`/`--band-border`、角丸4px、本文色 #cfd6c8)
- ✅ ヒーロー: h1 `clamp(30,4.4vw,52)/700/1.28/+0.01em`、説明文 15.5px/1.85/max-w-520
- ✅ ボタン (ActionButton): 明朝 14.5/500/+0.05em、角丸3px、primary 文字色 #f4f1e6
- ✅ セクション見出し: `// LABEL` モノスペースラベルを非表示化 (プロトタイプに存在しない)、tracking +0.02em、一覧ページは `size="page"` (26–38px)
- ✅ About: 名前 32px/500/+0.04em、アバター角丸4px・絵文字52px
- ✅ 角丸の統一: カード類 4px (article/list/project/principle/toolbox/スケルトン/TOC/本文画像)、チップ・ボタン・アイコン枠 3px、タグ 2px
- ✅ ページネーション: 角丸3px、アクティブ文字色 #f4f1e6
- ✅ 検索窓: 高さ38px・角丸3px / フィルタチップ角丸3px
- ✅ TOC: 角丸4px・padding 18px・Contents ラベルを muted に
- ✅ 旧色相 156° ハードコードの残骸をチャンネル変数化 (hero/error/not-found のメッシュブロブ)

## Phase 4 (構造変更 — feat/seiin-phase4-structure ブランチ)

### 4-1. Home セクショングリッド
- ✅ lg 3列 / md 2列 (見出しをグリッド1マス目に) / モバイル1列 — auto-fill をやめ明示的ブレイクポイントに
- ✅ md 時のみ「View all projects/articles →」リンク (明朝 14/500/+0.03em, accent, arrow-right 13px)

### 4-2. Recent Articles
- ✅ `bg2` 背景帯 (SectionContainer alt) の撤去 — Featured と地続きに
- ✅ セクション縦 padding を padY2 (64/52/44px) に (`SectionContainer padY="compact"`)

### 4-3. フッター (footer.tsx)
- ✅ 墨帯化: `--band-bg` 背景 + `--band-border` 上罫線、padding 40px 24px
- ✅ 常にダーク配色: ロゴ明朝 17px/700/+0.05em #eae8dc (lab=#93c7a9)、コピーライト mono 12px #6b7268
- ✅ ソーシャルアイコン: 枠 #2c332c、色 #828773、hover #93c7a9 (`SocialIconBar variant="footer"`)

### 4-4. カード hover 演出
- ✅ hover 時の緑トップバー (`before:` 3px accent-gradient) の撤去 — プロトタイプに存在しない
- ✅ タイトルの hover 矢印 (→) とアイコンの scale/rotate の撤去 (タイトル hover 色変化も撤去 — プロトタイプは border/shadow/translate のみ)
- ✅ project/article カード hover は `translateY(-2px)` (`-translate-y-0.5`)、list カードは `-1px` (プロトタイプ準拠)

### 4-5. 漢字スタンプ (オプション、デフォルト OFF)
- ✅ SectionHeader に `kanjiStamp` prop: 30×30px 角印 (accent-gradient / #f4f1e6 / rotate(-3deg) / 明朝16px)。ページ見出し (size="page") は 32×32px/17px
- ✅ 文字は呼び出し側で指定 (default OFF のため未使用。使う場合: Featured=作 / Articles=記 / Projects=作 / About=信・具)

### 4-6. ヒーロー
- ✅ ターミナルを墨帯へ: `--terminal-*` トークンを band 系へ差し替え (`--band-bg` + `--band-texture` + `--band-border`)、角丸5px、信号ボタン彩度落とし (#c0554d/#c9a24a/#5d9b72)、配色 (prompt #93c7a9 / cmd #eae8dc / highlight #b7d9c4 / success #7fc39a / dim #6b7268)
- ✅ メッシュブロブ (radial-gradient 2個) の撤去 — ドットグリッド + 墨のみ
- ✅ ink-flow 透かし (`heroInk` prop: "main" = 墨流しメイン表示 / "background" = 透かし+ターミナル、default: main)。狭幅 (<1024px) はコーナー透かしに切替
- ✅ ヒーロー padding: 84/68 (デスクトップ)、64/48、48/40
- ✅ 日本語タグライン「作って、確かめて、書き残す。」(`jaLine` prop、デフォルト OFF)
- 📝 モバイルのミニターミナル (compact) はホームから撤去 (プロトタイプに存在しない)。Terminal compact 自体は残置

### 4-7. 記事フッター (article-footer.tsx)
- ✅ Related Articles セクションを `bg2` 帯 + border-top で包む (padding 48px/64px)
- ✅ 見出し 明朝24px/700/+0.02em (`SectionHeader size="sub"`)
- ✅ PREVIOUS/NEXT ラベル: mono 10px/+0.18em/muted + arrow 11px
- ✅ リストカード内タグ: 10px/padding 1px 7px の小サイズ (`TagList size="sm"`、対応済みを確認)
- ✅ リストサムネイル幅: 110px (デスクトップ) / 100px / 80px、min-height 92px

### その他
- ✅ Articles リスト表示のサムネイル幅: `minmax(140px,220px)`、min-height 120px (480px 幅でも 2 カラム維持に変更)
- ✅ Toolbox チップ: bg2 背景 / mono 12.5px / 角丸2px / hover accent (枠+文字色のみ。bg 変化は撤去)
- ✅ noise-overlay: 撤去 (コンポーネント・CSS・layout 使用箇所)
- ✅ `--thumb-gradient-*` トークンと `thumbnailVariant`/`thumbnailIcon` フィールドを削除 (型・adapter・data・stories・tests)
- ✅ SectionHeader の deprecated `label` prop と i18n の未使用 label キーの削除
- ⬜ Prism シンタックス色: プロトタイプは緑系トーン (#93c7a9/#7fb394 等)。現行は標準 prism 色のまま — 要判断 (Phase 5 で判断)

## 🎯 意図的な逸脱 (対応しない)

- 🎯 タグアイコンはカテゴリ色を維持 (プロトタイプは全 accent 一色)。カテゴリ識別性を優先
- 🎯 モバイルのハンバーガーメニュー (Sheet): プロトタイプは常時ナビ表示だが現行 UX を維持
- 🎯 エラーページ (error.tsx): プロトタイプに対応画面なし。404 と同系の様式を踏襲
