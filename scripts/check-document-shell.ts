import { readFileSync } from 'node:fs';

/**
 * production build の prerender 出力を検査して、ドキュメントの殻が壊れていないことを保証する。
 *
 * Issue #106 の方式検討で、この構成には **build が成功したまま壊れる** 経路が 2 つあることを
 * 実測している:
 *
 * - ルートレイアウトを pass-through にしたまま leaf 側が `<html>` を持たないと、
 *   出力から `<html>` / `<body>` が丸ごと消える (`bun run build` は exit 0)
 * - leaf が `<html>` を持つのにルートレイアウトも `<html>` を出すと入れ子になり、
 *   内側が HTML パーサに破棄されて `documentElement` が属性なしになる
 *
 * どちらも型検査・lint・SSR unit test をすり抜ける。unit test は各コンポーネントを単独で
 * 描画するため Next.js のレイアウト合成を通らず、E2E は dev server 上で動くため
 * production 固有の差分も見えない。そこで build 成果物そのものを検査する。
 */

const BUILD_OUTPUT_DIR = '.next/server/app';

/** `src/app/fonts.ts` が宣言するフォント変数の数 */
const EXPECTED_FONT_VARIABLES = 5;

interface ExpectedDocument {
  readonly file: string;
  readonly lang: string;
  readonly description: string;
}

const EXPECTED_DOCUMENTS: readonly ExpectedDocument[] = [
  { file: 'ja.html', lang: 'ja', description: '日本語ルート (/)' },
  { file: 'en.html', lang: 'en', description: '英語ルート (/en)' },
  { file: '_not-found.html', lang: 'ja', description: 'ロケール外の 404' },
];

function countTags(html: string, tag: string): number {
  return (html.match(new RegExp(`<${tag}[\\s>]`, 'g')) ?? []).length;
}

function firstHtmlTag(html: string): string | null {
  return html.match(/<html[^>]*>/)?.[0] ?? null;
}

function countFontVariables(htmlTag: string): number {
  const className = htmlTag.match(/class="([^"]*)"/)?.[1] ?? '';
  return className.split(/\s+/).filter((token) => token.endsWith('variable')).length;
}

function verify({ file, lang, description }: ExpectedDocument): readonly string[] {
  const path = `${BUILD_OUTPUT_DIR}/${file}`;
  let html: string;
  try {
    html = readFileSync(path, 'utf8');
  } catch {
    return [`${path} が見つかりません (${description})。先に \`bun run build\` を実行してください。`];
  }

  const problems: string[] = [];
  const htmlCount = countTags(html, 'html');
  const bodyCount = countTags(html, 'body');

  if (htmlCount !== 1) {
    problems.push(
      `${file}: <html> が ${htmlCount} 個 (期待 1)。0 個ならルートレイアウトと leaf の双方が ` +
        `<html> を持っていない、2 個以上なら入れ子になっている。`,
    );
  }
  if (bodyCount !== 1) {
    problems.push(`${file}: <body> が ${bodyCount} 個 (期待 1)。`);
  }

  const tag = firstHtmlTag(html);
  if (!tag) {
    // <html> が 0 個の時点で報告済みなので、ここでは属性検査を打ち切る
    return problems;
  }

  const actualLang = tag.match(/lang="([^"]*)"/)?.[1] ?? '';
  if (actualLang !== lang) {
    problems.push(
      `${file}: lang="${actualLang || '(なし)'}" (期待 "${lang}") — ${description}。` +
        `WCAG 3.1.1 Language of Page に抵触する。`,
    );
  }

  const fontVariables = countFontVariables(tag);
  if (fontVariables !== EXPECTED_FONT_VARIABLES) {
    problems.push(
      `${file}: フォント変数クラスが ${fontVariables} 個 (期待 ${EXPECTED_FONT_VARIABLES})。` +
        `<html> に fontVariables が渡っていない可能性がある。`,
    );
  }

  return problems;
}

const problems = EXPECTED_DOCUMENTS.flatMap(verify);

if (problems.length > 0) {
  console.error('Document shell check failed:');
  for (const problem of problems) {
    console.error(`  - ${problem}`);
  }
  process.exit(1);
}

console.log(
  `Document shell check passed for ${EXPECTED_DOCUMENTS.length} prerendered documents ` +
    `(single <html>/<body>, expected lang, ${EXPECTED_FONT_VARIABLES} font variables).`,
);
