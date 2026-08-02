/**
 * Bun の lcov レポートを集計する。
 *
 * ## なぜ自前で数え直すのか (Issue #107)
 *
 * Bun 1.3.14 が出す lcov の `LF:` (lines found) は **ファイルの物理行数**であり、
 * 計測対象行数ではない。コメント・import・型宣言・空行がすべて分母に入る。
 * 実測では 48 レコード中 47 件で `LF:` == `wc -l` + 1 だった。
 * このため `LH / LF` は 53.51% にしかならず、実際の行カバレッジ 86.63% と一致しない。
 *
 * 一方 `DA:<line>,<hits>` レコードは計測対象行のみを列挙しており正しい。
 * `LH:` も DA の hit 数と一致する (壊れているのは `LF:` だけ)。
 * そこで **DA レコードを数えて分母を作る**。これで Bun の text reporter が出す
 * per-file の値と完全に一致し、かつ text reporter の `All files` (per-file 単純平均) と違って
 * 行数で重み付けした全体値が得られる。
 *
 * 関数側は `FNF:`/`FNH:` が正しいのでそのまま使う
 * (Bun は per-function の `FN:`/`FNDA:` レコードを出さないため、これ以外に情報源がない)。
 */

/** lcov の 1 レコード = 1 ファイル分の集計値 */
export interface FileCoverage {
  readonly file: string;
  readonly linesFound: number;
  readonly linesHit: number;
  readonly functionsFound: number;
  readonly functionsHit: number;
}

/** 計測対象ファイルの合計と、除外されたファイルの内訳 */
export interface CoverageSummary {
  readonly measured: readonly FileCoverage[];
  readonly ignored: readonly FileCoverage[];
  readonly linesFound: number;
  readonly linesHit: number;
  readonly functionsFound: number;
  readonly functionsHit: number;
}

interface RecordAccumulator {
  readonly file: string;
  readonly linesFound: number;
  readonly linesHit: number;
  readonly functionsFound: number;
  readonly functionsHit: number;
}

const EMPTY_RECORD: Omit<RecordAccumulator, 'file'> = {
  linesFound: 0,
  linesHit: 0,
  functionsFound: 0,
  functionsHit: 0,
};

function applyLine(record: RecordAccumulator, line: string): RecordAccumulator {
  if (line.startsWith('DA:')) {
    const hits = Number(line.slice(3).split(',')[1]);
    return {
      ...record,
      linesFound: record.linesFound + 1,
      linesHit: record.linesHit + (hits > 0 ? 1 : 0),
    };
  }
  if (line.startsWith('FNF:')) {
    return { ...record, functionsFound: record.functionsFound + Number(line.slice(4)) };
  }
  if (line.startsWith('FNH:')) {
    return { ...record, functionsHit: record.functionsHit + Number(line.slice(4)) };
  }
  // `LF:` / `LH:` は意図的に読まない (上のコメント参照)
  return record;
}

/**
 * lcov テキストをファイル単位のカバレッジに変換する。
 *
 * @throws レコードが 1 件もない場合。空のレポートを 100% と解釈すると、
 *   計測そのものが壊れた日にゲートが黙って通ってしまうため fail fast する。
 */
export function parseLcovRecords(lcov: string): readonly FileCoverage[] {
  const records: FileCoverage[] = [];
  let current: RecordAccumulator | null = null;

  for (const line of lcov.split('\n')) {
    if (line.startsWith('SF:')) {
      current = { file: line.slice(3).trim(), ...EMPTY_RECORD };
      continue;
    }
    if (!current) continue;
    if (line.startsWith('end_of_record')) {
      records.push(current);
      current = null;
      continue;
    }
    current = applyLine(current, line);
  }

  if (records.length === 0) {
    throw new Error(
      'lcov report contains no coverage record (no SF:/end_of_record pair). ' +
        'Coverage instrumentation is likely broken — refusing to report a passing result.',
    );
  }

  return records;
}

/** 除外判定を適用して全体の合計を出す */
export function summarize(
  records: readonly FileCoverage[],
  isIgnored: (file: string) => boolean,
): CoverageSummary {
  const measured = records.filter((record) => !isIgnored(record.file));
  const ignored = records.filter((record) => isIgnored(record.file));

  return measured.reduce<CoverageSummary>(
    (summary, record) => ({
      ...summary,
      linesFound: summary.linesFound + record.linesFound,
      linesHit: summary.linesHit + record.linesHit,
      functionsFound: summary.functionsFound + record.functionsFound,
      functionsHit: summary.functionsHit + record.functionsHit,
    }),
    { measured, ignored, ...EMPTY_RECORD },
  );
}

/**
 * 閾値判定にかける前に、集計結果が指標として成立していることを確認する。
 *
 * `percentage()` は分母 0 を 100% として扱う (per-file 表示のための仕様) ため、
 * **除外後に何も残らなかったレポートは 0/0 = 100% となり、そのままでは合格してしまう**。
 * 実際 `src` のテストが 1 件も走らないと lcov には `scripts/lcov-summary.ts` と
 * preload される `src/test-setup.ts` しか載らず、どちらも除外対象なので
 * 計測対象が空になる。この状態を満点として通すと、プロダクトコードのテストが
 * 丸ごと消えても CI が green のままになる。
 *
 * `parseLcovRecords()` の「レコードが 1 件もない」検査は生のレポートしか見ていないので、
 * ここで**除外を適用した後の合計**を検査する。
 *
 * @throws 計測対象ファイル・実行可能行・関数のいずれかが 0 件の場合
 */
export function assertMeasurable(summary: CoverageSummary): void {
  const refuse = (reason: string): never => {
    throw new Error(
      `${reason} Coverage is not measuring the product code — refusing to report a passing result. ` +
        `(ignored: ${summary.ignored.map((record) => record.file).join(', ') || 'none'})`,
    );
  };

  if (summary.measured.length === 0) {
    refuse(`lcov report has no measured file after exclusions.`);
  }
  if (summary.linesFound === 0) {
    refuse(`lcov report has no executable line across ${summary.measured.length} measured files.`);
  }
  if (summary.functionsFound === 0) {
    refuse(`lcov report has no function across ${summary.measured.length} measured files.`);
  }
}

/** 分母が 0 のファイル (型宣言のみ等) は計測対象がないので 100% として扱う */
export function percentage(hit: number, found: number): number {
  if (found === 0) return 100;
  return (hit / found) * 100;
}
