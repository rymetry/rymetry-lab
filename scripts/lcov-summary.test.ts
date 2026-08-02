import { describe, expect, test } from 'bun:test';

import {
  assertMeasurable,
  type FileCoverage,
  parseLcovRecords,
  percentage,
  summarize,
} from './lcov-summary';

/**
 * Bun が出す lcov の `LF:` は**ファイルの物理行数**であり、計測対象行数ではない。
 * このフィクスチャは `LF:`/`LH:` をわざと DA レコードと矛盾させ、
 * パーサが DA を数えていることを検証できるようにしている。
 */
const LCOV_WITH_MISLEADING_LF = `TN:
SF:src/lib/example.ts
FNF:4
FNH:3
DA:1,58
DA:3,0
DA:4,7
DA:5,0
LF:120
LH:99
end_of_record
TN:
SF:src/lib/other.ts
FNF:2
FNH:0
DA:1,0
DA:2,0
LF:40
LH:0
end_of_record
`;

function recordFor(lcov: string, file: string): FileCoverage {
  const record = parseLcovRecords(lcov).find((entry) => entry.file === file);
  if (!record) throw new Error(`fixture has no record for ${file}`);
  return record;
}

describe('parseLcovRecords', () => {
  test('counts DA records for linesFound instead of trusting LF', () => {
    // LF:120 ではなく DA レコード数 4
    expect(recordFor(LCOV_WITH_MISLEADING_LF, 'src/lib/example.ts').linesFound).toBe(4);
  });

  test('counts DA records with a non-zero hit count for linesHit instead of trusting LH', () => {
    // LH:99 ではなく hit > 0 の DA レコード数 2
    expect(recordFor(LCOV_WITH_MISLEADING_LF, 'src/lib/example.ts').linesHit).toBe(2);
  });

  test('reads function totals from FNF/FNH', () => {
    const example = recordFor(LCOV_WITH_MISLEADING_LF, 'src/lib/example.ts');

    expect(example.functionsFound).toBe(4);
    expect(example.functionsHit).toBe(3);
  });

  test('parses every record independently', () => {
    const records = parseLcovRecords(LCOV_WITH_MISLEADING_LF);

    expect(records).toHaveLength(2);
    expect(recordFor(LCOV_WITH_MISLEADING_LF, 'src/lib/other.ts')).toEqual({
      file: 'src/lib/other.ts',
      linesFound: 2,
      linesHit: 0,
      functionsFound: 2,
      functionsHit: 0,
    });
  });

  test('tolerates a record that declares no executable line', () => {
    const records = parseLcovRecords('TN:\nSF:src/types/only.ts\nFNF:0\nFNH:0\nend_of_record\n');

    expect(records).toEqual([
      {
        file: 'src/types/only.ts',
        linesFound: 0,
        linesHit: 0,
        functionsFound: 0,
        functionsHit: 0,
      },
    ]);
  });

  test('throws when the report contains no record at all', () => {
    // 空の lcov を 100% と解釈すると、計測が壊れた日にゲートが黙って通ってしまう
    expect(() => parseLcovRecords('')).toThrow(/no coverage record/i);
  });
});

const records = parseLcovRecords(LCOV_WITH_MISLEADING_LF);

describe('summarize', () => {
  test('aggregates every record when nothing is ignored', () => {
    const summary = summarize(records, () => false);

    expect(summary.measured).toHaveLength(2);
    expect(summary.ignored).toHaveLength(0);
    expect(summary.linesFound).toBe(6);
    expect(summary.linesHit).toBe(2);
    expect(summary.functionsFound).toBe(6);
    expect(summary.functionsHit).toBe(3);
  });

  test('keeps ignored files out of the totals', () => {
    const summary = summarize(records, (file) => file === 'src/lib/other.ts');

    expect(summary.measured.map((record) => record.file)).toEqual(['src/lib/example.ts']);
    expect(summary.ignored.map((record) => record.file)).toEqual(['src/lib/other.ts']);
    expect(summary.linesFound).toBe(4);
    expect(summary.linesHit).toBe(2);
    expect(summary.functionsFound).toBe(4);
    expect(summary.functionsHit).toBe(3);
  });
});

describe('assertMeasurable', () => {
  test('accepts a summary that measures at least one line and one function', () => {
    expect(() => assertMeasurable(summarize(records, () => false))).not.toThrow();
  });

  test('rejects a report whose records were all excluded', () => {
    // scripts/ と src/test-setup.ts しか計測されなかった lcov がこの形になる。
    // percentage(0, 0) === 100 なので、弾かないと 0/0 が満点として CI を通ってしまう
    const summary = summarize(records, () => true);

    expect(summary.measured).toHaveLength(0);
    expect(() => assertMeasurable(summary)).toThrow(/no measured file/i);
  });

  test('rejects a report with measured files but no executable line', () => {
    const declarationsOnly = parseLcovRecords(
      'TN:\nSF:src/types/only.ts\nFNF:0\nFNH:0\nend_of_record\n',
    );

    expect(() => assertMeasurable(summarize(declarationsOnly, () => false))).toThrow(
      /no executable line/i,
    );
  });

  test('rejects a report with executable lines but no function', () => {
    const noFunctions = parseLcovRecords(
      'TN:\nSF:src/data/table.ts\nFNF:0\nFNH:0\nDA:1,3\nDA:2,3\nend_of_record\n',
    );

    expect(() => assertMeasurable(summarize(noFunctions, () => false))).toThrow(/no function/i);
  });
});

describe('percentage', () => {
  test('divides hit by found', () => {
    expect(percentage(2, 4)).toBe(50);
  });

  test('treats an empty denominator as fully covered', () => {
    expect(percentage(0, 0)).toBe(100);
  });
});
