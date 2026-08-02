# 静韻プロトタイプ差分チェックリスト

`4a 現行×静韻.dc.html` と実装の全画面突き合わせ結果。
✅ = 対応済み / ⬜ = 未対応 / 🎯 = 意図的な逸脱 (対応しない)

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
- ✅ Prism シンタックス色: 緑系トーンを採用 (Phase 5)。プロトタイプの #93c7a9 (property/tag 系) / #7fb394 (string/attr 系) を軸に、keyword #b7d9c4 / function #d9e3d2 / operator #a9b0a4 / punctuation #8f978c / regex #c9a24a (信号ボタンの金) へ展開。コメント・行番号は #828773 (プロトタイプ相当の #6b7268 は墨帯上 3.5:1 で AA 未達のため、フッターと同じ a11y 判断で明るく) — 両テーマ実機比較の結果、標準 prism の多色 (青/赤/黄) は静韻の墨帯で明確に浮くため置換

## Phase 5 (検証・仕上げ — feat/seiin-phase5-verification ブランチ)

- ✅ Storybook 追随: `--font-kaisei` を storybook-fonts.css に追加 (未定義だと font-brand が invalid になり全見出しが sans フォールバックしていた)。NextIntlClientProvider をグローバルデコレータ化 + `next-intl/server` スタブ + `experimentalRSC` で全 85 Story のスモークテスト green 化 (Phase 4 の i18n Link 移行で 24 Story が壊れていた)
- ✅ Story 記述の Phase 4 追随: カード hover 説明 (グリーンバー/矢印/scale 撤去)、リストサムネ幅、Section alt の用途 (Related Articles)。HomeSectionHead の Story 新規追加 (Default / TabletModule / DarkMode)
- ✅ レスポンシブ不具合修正: `max-md:` と `max-[480px]:` の併用は Tailwind v4 の CSS 出力順 (480px 側が先) で 480px ルールが打ち消される。list-card のサムネ列 (80px) と About の Principles 1 カラム化が死んでいたため `min-[480px]:max-md:` で範囲を分離。※ `max-[480px]` は `width < 480px` (排他的)
- ✅ prefers-reduced-motion 検証: エミュレーションで anim-up/reveal 強制表示・長時間アニメーションゼロを確認 (float は motion-safe で不適用)
- ✅ ヒーロー LCP: ink-flow が LCP 要素 (Next.js 警告あり)。`InkPreload` (getImageProps + `media="(min-width: 1024px)"` の手動 preload、React 19 の link ホイスティング利用) を heroInk="main" に追加。デスクトップのみ light/dark 両テーマ分 (~95KB AVIF/枚、テーマは class 切替でサーバー側不明のため) を先読みし、hero カラムが非表示のモバイルでは preload が走らない (w=1200×2 ≈ 186KB の無駄フェッチを実測で排除)。`InkImage` 自体は常に lazy — display:none 側テーマはフェッチされないことを実測確認。next/image の `priority` は media なし preload を出すため不採用。dev コンソールの「LCP image, add loading=eager」警告は既知のトレードオフとして許容 (eager 化するとモバイルで非表示分を余計にフェッチする。preload 済みのため実測 LCP は 964ms と priority 時より悪化なし)
- ✅ ドキュメント: CLAUDE.md のデザインセクションを静韻の実態に全面更新、README/AGENTS.md の参照先を handoff-seiin へ変更、旧モック (v3–v12 + color-comparison) を design-mock/archive/mockups/ へ移動

## 差分監査による追随修正 (2026-08-01)

全画面再監査 (トークン/タイポ/構造/アニメーション) で検出した未記載差分の修正。

- ✅ focus-visible をグローバル一括適用: `a/button/input/summary:focus-visible` に `outline: 2px solid var(--accent)` + offset 2px (globals.css)。summary は TOC アコーディオン用に追加。shadcn 系は `outline-none` + 独自 ring が優先されるため二重表示なし
- ✅ `--btn-primary-shadow` を `var(--accent-glow)` 参照に (alpha 0.3/0.2 → プロトタイプの 0.08/0.10)
- ✅ body にテーマ切替 transition 0.3s (background-color/color)
- ✅ ListCard タイトル (h4) に font-brand 適用 + line-height 1.4 (h1–h3 のみの brand 適用から漏れて sans に落ちていた)
- ✅ ProjectCard タイトル line-height 1.7 (leading-tight 1.25 は旧デザイン残骸)
- ✅ ArticleCard: list padding 20px、リストサムネ 100px 化を <768px に (max-[1024px] は 768–1024px 帯で幅が過小)、Tag sm アイコン 10px
- ✅ ヒーロー: Projects ボタンの「→」撤去 (mock は矢印なし。404 の CTA 矢印も同時撤去 — messages/story 含む)、stagger 0.15s/0.3s (`anim-up-hero-*`。404/error は 0.12s 刻みの `anim-up-N` のまま)、`max-[480px]:text-[28px]` 上書き撤去 (clamp 下限 30px)
- ✅ ActionButton secondary hover: 枠色変化を撤去 (bg accent-glow のみ)
- ✅ ヘッダー: nav gap 26px / nav↔actions 24px、backdrop saturate 160%、アクティブ下線を単色 accent に (グラデ廃止)、HeaderFallback ロゴを本物と同じ font-brand 21px に
- ✅ ヘッダー操作系を 34px・角丸 3px に統一 (ThemeToggle/ハンバーガー 36px/6px、LangToggle 32px/6px → mock 準拠。LangToggle は mono 12px に)
- ✅ Articles: 検索窓 max-width 560px、ViewToggle を検索窓直後に (ml-auto 右端寄せ撤去)・角丸 3px、グリッド min 320px (max-md 280px 緩和撤去)、リスト gap 14px、見出し下 32px・検索行下 14px・チップ行下 36px、空状態カード角丸 4px、placeholder #8a8577 (テーマ非依存。ライトのカード地上で約 3.4:1 と AA 未達だが、placeholder は補助表示で input に aria-label があるため mock 準拠を優先)
- ✅ 記事詳細: 本文カラム max-width 720px、TOC sticky top 100px・hover は文字色のみ (枠色変化撤去)、関連リスト gap 10px、前後ナビ gap 14px / mt 40px
- ✅ 記事本文: h2 直後の余白 14px、インラインコード 12.5px 固定・padding 2px 5px・枠線なし (0.88em + border は旧様式)、pre 横 padding 18px
- ✅ About: bio max-width 640px、ソーシャルを RSS 抜き 5 件に (`SocialIconBar links` prop)、アバターの accent-glow グラデオーバーレイ撤去
- ✅ error/global-error: リトライボタンを ActionButton 様式 (角丸 3px・明朝 14.5/500/+0.05em・#f4f1e6) に (rounded-[9px]/text-white/sans は旧残骸)、error のターミナル角丸 5px、global-error のグラデをダーク実値 (0.42/0.62 154°) に統一
- ✅ root not-found に vortex 墨流し追加 ([locale] 版と統一)
- ✅ Loading: `skeletonPulse` keyframe 移植 (opacity 0.62↔1、animate-pulse 代用をやめる)、バー角丸 3px (タグのみ 2px)、記事詳細のアイキャッチスケルトン撤去 (実ページ非表示のためロード後に跳ねていた)・本文 720px/コンテナ 1040px/TOC カード枠を実ページに整合、Articles の検索/トグルスケルトンを実寸 (38px/34px) に、Home ヒーローを grid-cols-2/min-h 380px に

## 判断反映 (2026-08-01)

- ✅ 404/error のメッシュブロブ 2 個を撤去 (mock の 404 はドットグリッド + vortex のみ。ヒーローの撤去と整合)
- ✅ 404 の vortex 位置を mock 準拠に: 560px コンテンツボックス内の absolute (`top:22%/left:50%/translate(-64.5%,-40%)`、`z-index:-1`)。従来はセクション全体基準で位置がずれていた
- ✅ 404 CTA を mock の英語表記に統一: "Back to Home" / "Browse Articles" (ja/en 両ロケール + root 版ハードコード)
- ✅ Principle/Toolbox カードの絵文字を削除 (data の emoji フィールドごと撤去)
- ✅ Home の Recent Articles を microCMS 実データの上位 3 件 + 実リンクに (静的 ARTICLES + `href="#"` を撤去)
- ✅ TOC の <1024px 挙動: 本文上に配置しつつ折りたたみ (details/summary、デフォルト閉) に。mock の常時展開 (`order:-1`) は本文を押し下げるため不採用
- ✅ ヘッダーの言語切替アイコンを mock 準拠の globe に (LanguagesIcon → GlobeIcon)
- ✅ ハンバーガー Sheet に横 padding 24px (リンクが左端に張り付いていた)
- 🎯 記事カード/リストカードのサムネイル: microCMS の ogpImage を優先表示し、未設定時のみ ink-fine 墨テクスチャにフォールバック (mock は墨テクスチャ固定だが実データの視認性を優先)

## 🎯 意図的な逸脱 (対応しない)

- 🎯 フッターのコピーライト文字色: プロトタイプの #6b7268 は墨帯上でコントラスト 3.5:1 (WCAG AA 未達) のため #828773 (4.7:1) に変更。アイコン色と同一
- 🎯 タグアイコンはカテゴリ色を維持 (プロトタイプは全 accent 一色)。カテゴリ識別性を優先
- 🎯 モバイルのハンバーガーメニュー: プロトタイプも <768px はハンバーガー式だが、展開 UI が異なる (mock = ヘッダー直下のインライン縦並び / 実装 = shadcn Sheet の右ドロワー)。フォーカストラップ・スクロールロックを備えた Sheet を維持
- 🎯 エラーページ (error.tsx): プロトタイプに対応画面なし。404 と同系の様式を踏襲。CTA は 404 と同じ英語統一 ("Retry" / "Back to Home"。root error.tsx / global-error.tsx / ErrorPages.error の ja/en 全て。見出し英語 + 説明日本語のトーンも 404 と同一)。装飾グリフ ↻ は撤去 — 出自は旧 v12 モック (`design-mock/archive/mockups/design-mockup-v12.html`) で、静韻モックにエラー画面は存在せず、同モック由来の CTA 矢印「→」は既に撤去済み。ボタンのアクセシブル名に "clockwise open circle arrow" が混入するのも避ける
- 🎯 セクション説明文の 1 行化: About principles / Home Recent Articles の説明は `max-w-none` (mock は max-width 600px で折返し)。`SectionHeader descriptionClassName` prop で個別指定
- 🎯 PrincipleCard (What I Value) の hover 演出撤去: mock は border-hover+shadow だが、非リンク要素のため無効に
- 🎯 Related/Prev-Next のカードを ArticleCard variant="list" に完全統一し、専用 ListCard コンポーネントを削除 (mock はコンパクトな別型: サムネ 110px / min-height 92px / タイトル 14px / hover accent 枠 + -1px)。記事一覧リストと同一の見た目 (140-220px サムネ / 120px / 16px / border-hover + -2px) になる
- 🎯 TOC ラベルは "INDEX" (mock は "Contents")。mono 大文字ラベルの言語に統一
- 📝 テーマ切替は即時トグル化で mock 準拠に (resolvedTheme の反対をセット、defaultTheme=system 維持)。アイコンの rotate/scale 演出のみ実装独自
- 📝 カードサムネイルは `buildCardThumbnailUrl` で表示ボックス比の imgix `fit=crop&crop=entropy` (grid 960×400 / list 480×320、情報量の多い領域を自動で残すスマートクロップ) を要求。microCMS 画像 API は imgix Rendering API 準拠 (公式ドキュメント明記・実アセットで検証済み)。運用ルール: アイキャッチは 1200×630・中央セーフエリア推奨。クロップ比のズレ (要求は grid 2.4 / list 1.5 だが、実表示ボックスは grid が 1.92–4.90 = viewport 320px 以上、list は `h-full min-h-[120px]` で行高に追従するため比率は上限値で `<480px: 0.67` / `480–767px: 0.83` / `>=768px: 1.83` となり、本文量によりさらに縦長になる → object-cover がブラウザ側で再クロップ) は 2026-08-02 に実入稿画像 (1200×630 ×10 + 1024×1024 ×1) で **grid の 1〜3 カラム帯**を目視評価し、見切れ・不自然な切り出しなし — 許容とする。**list のモバイル帯 (<768px、縦長ボックスに横長クロップを要求) は 2026-08-02 に実入稿画像で目視評価済み — 下記参照**
- 📝 list サムネのモバイル帯クロップ (2026-08-02 実測・**未修正の既知の劣化**): `/articles?view=list` を実入稿画像で目視した結果、`buildCardThumbnailUrl` が要求する 1.5 の横長クロップを `object-cover` が縦長ボックスへ再クロップし、**ソース幅の大部分が捨てられる**。viewport 375px → サムネ 80×137 (比 0.58、ソース幅の 39% のみ可視)、600px → 100×121 (比 0.83、55% 可視)。テキストを含むアイキャッチでは中央の一片だけが写り、サムネイルとして判読できない。>=768px は 220×121 (比 1.82) でソース高の 82% 可視 — 横長側は許容範囲。**単一 URL では両立しない** (list のサムネ URL はブレイクポイント分岐を持たず、モバイル向けに縦長クロップへ変えるとデスクトップが悪化する)。両立には `getImageProps()` + `<picture><source media>` による Art Direction が必要で、構造と通信挙動が変わるため Owner 判断待ち — このリポジトリでは `src/components/ink-image.tsx` に `getImageProps()` の使用前例がある
- 📝 list サムネの `sizes` 境界を range 構文に統一 (`(width < 480px) 80px, (width < 48rem) 100px, 220px`)。Tailwind v4 の `max-*` は排他レンジなので、旧 `(max-width: 768px)` だと 768px ちょうどで `/articles?view=list` の実サムネ 220px に対し 100px を申告し、候補が 1 段足りなかった。単位も Tailwind 側 (`max-md` = rem / `max-[480px]` = px) に合わせる。**220px は `minmax(140px,220px)` の上限であって surface ごとに実寸が違う** — `/articles?view=list` は常に 220px だが、記事詳細の Prev/Next は `max-w-[1040px]` 内の `md:grid-cols-2` で圧縮され innerWidth 768px で 145px / 1280px で 220px (2026-08-02 実測)。`sizes` は共有なので広い側 (220px) に合わせる。Prev/Next では過大申告になるが、狭い側に合わせると一覧が過小申告でぼやけるため
- 🎯 リスト型カードのタグは 3 個 + 「+N」チップに制限、タイトルは line-clamp-2 (mock は無制限)。Prev/Next はラッパー flex + flex-1 で常に等高 — コンテンツ量差による高さ暴発の防止
- ✅ TOC パネルの card-shadow 撤去 (mock は影なし — 監査漏れの追随。ライトで浮いて見えていた)
- 🎯 Home の記事カードにも更新日 (pen-line) を表示 (mock は Home では公開日+読了時間のみ)。情報の一貫性を優先
- 🎯 `.reveal` スクロール連動フェード (IntersectionObserver) と `scroll-behavior: smooth`: プロトタイプに存在しない実装側の追加演出 (CLAUDE.md 記載済み)。prefers-reduced-motion で無効化される
- 🎯 Articles 空状態カード・Home ローディングの見出しセル: プロトタイプに対応 UI がない実装独自要素。様式は実ページに整合させる
