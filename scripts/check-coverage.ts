import { readFileSync } from 'node:fs';

import { type FileCoverage, parseLcovRecords, percentage, summarize } from './lcov-summary';

/**
 * `bun test src scripts --coverage --coverage-reporter=lcov` の出力を検査し、
 * 行・関数カバレッジがともに閾値を満たすことを保証する。
 *
 * ## Issue #107 の決定事項
 *
 * 1. **行カバレッジは lcov の `DA:` レコードから数え直す。** Bun の `LF:` は物理行数なので
 *    そのまま割ると 53.51% という無意味な値になる。詳細は `lcov-summary.ts` を参照
 * 2. **行も 80% で強制する。** 是正後の実測は 86.63% で、6.6pt の余裕がある
 * 3. **プロダクトコード以外は分母から外す** (`IGNORED_PATHS`)
 *
 * ## この指標の既知の限界 (未解決)
 *
 * Bun は**ユニットテストから実際に読み込まれたモジュールだけ**を計測する。
 * 一度も import されないファイル (API routes、CMS クライアント、多くの page 等) は
 * 0% として数えられるのではなく、レポートから丸ごと消える。
 * つまりここに出る百分率は「テストされている側の半分」についての値でしかない。
 * 誤読を防ぐため、計測対象外のファイル数を必ず併記する。
 */

const LCOV_PATH = 'coverage/lcov.info';
const MIN_LINE_PERCENT = 80;
const MIN_FUNCTION_PERCENT = 80;

/** 表示する「カバレッジが低いファイル」の件数 */
const LOWEST_FILES_SHOWN = 5;

/**
 * 分母から外すパス。プロダクトコードではないものだけを入れること。
 *
 * - `src/test-setup.ts` — bunfig.toml が preload するテスト用スタブ
 * - `scripts/` — この検査スクリプト自身を含む CI ツール
 */
const IGNORED_PATHS: readonly RegExp[] = [/^src\/test-setup\.ts$/, /^scripts\//];

/** 計測対象になりうるプロダクトソース (テスト・Story は Bun が最初から除外する) */
const SOURCE_GLOB = 'src/**/*.{ts,tsx}';
const NON_SOURCE_SUFFIXES = ['.test.ts', '.test.tsx', '.stories.tsx'];

function isIgnored(file: string): boolean {
  return IGNORED_PATHS.some((pattern) => pattern.test(file));
}

function isProductSource(file: string): boolean {
  return !isIgnored(file) && !NON_SOURCE_SUFFIXES.some((suffix) => file.endsWith(suffix));
}

function countProductSources(): number {
  return [...new Bun.Glob(SOURCE_GLOB).scanSync('.')]
    .map((file) => file.replaceAll('\\', '/'))
    .filter(isProductSource).length;
}

function formatPercent(hit: number, found: number): string {
  return `${percentage(hit, found).toFixed(2)}%`;
}

function lowestCoveredFiles(files: readonly FileCoverage[]): readonly FileCoverage[] {
  return [...files]
    .filter((file) => file.linesFound > 0)
    .sort(
      (a, b) =>
        percentage(a.linesHit, a.linesFound) - percentage(b.linesHit, b.linesFound) ||
        a.file.localeCompare(b.file),
    )
    .slice(0, LOWEST_FILES_SHOWN);
}

function readLcov(): string {
  try {
    return readFileSync(LCOV_PATH, 'utf8');
  } catch {
    console.error(
      `${LCOV_PATH} が見つかりません。` +
        '先に `bun test src scripts --coverage --coverage-reporter=lcov` を実行してください。',
    );
    process.exit(1);
  }
}

const summary = summarize(parseLcovRecords(readLcov()), isIgnored);

const failures = [
  percentage(summary.linesHit, summary.linesFound) < MIN_LINE_PERCENT
    ? `Line coverage ${formatPercent(summary.linesHit, summary.linesFound)} is below required ${MIN_LINE_PERCENT.toFixed(2)}%.`
    : null,
  percentage(summary.functionsHit, summary.functionsFound) < MIN_FUNCTION_PERCENT
    ? `Function coverage ${formatPercent(summary.functionsHit, summary.functionsFound)} is below required ${MIN_FUNCTION_PERCENT.toFixed(2)}%.`
    : null,
].filter((failure): failure is string => failure !== null);

const log = failures.length > 0 ? console.error : console.log;

for (const failure of failures) {
  console.error(failure);
}

log(
  `Line coverage     ${formatPercent(summary.linesHit, summary.linesFound)} ` +
    `(${summary.linesHit}/${summary.linesFound} executable lines, required ${MIN_LINE_PERCENT}%)`,
);
log(
  `Function coverage ${formatPercent(summary.functionsHit, summary.functionsFound)} ` +
    `(${summary.functionsHit}/${summary.functionsFound} functions, required ${MIN_FUNCTION_PERCENT}%)`,
);

log(`\nLowest covered files (by executable line):`);
for (const file of lowestCoveredFiles(summary.measured)) {
  log(
    `  ${formatPercent(file.linesHit, file.linesFound).padStart(7)}  ` +
      `${file.file} (${file.linesHit}/${file.linesFound})`,
  );
}

if (summary.ignored.length > 0) {
  log(`\nExcluded from the denominator: ${summary.ignored.map((file) => file.file).join(', ')}`);
}

const productSources = countProductSources();
const uninstrumented = productSources - summary.measured.length;
if (uninstrumented > 0) {
  log(
    `\nNote: ${uninstrumented} of ${productSources} source files are never imported by a unit test, ` +
      `so Bun does not instrument them and they are absent from the figures above. ` +
      `The percentages describe the measured ${summary.measured.length} files only.`,
  );
}

if (failures.length > 0) {
  process.exit(1);
}
