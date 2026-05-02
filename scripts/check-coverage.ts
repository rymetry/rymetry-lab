import { readFileSync } from 'node:fs';

const LCOV_PATH = 'coverage/lcov.info';
const MIN_PERCENT = 80;

interface CoverageTotals {
  readonly linesFound: number;
  readonly linesHit: number;
  readonly functionsFound: number;
  readonly functionsHit: number;
}

function parseTotals(lcov: string): CoverageTotals {
  return lcov.split('\n').reduce(
    (totals, line) => {
      if (line.startsWith('LF:')) {
        return { ...totals, linesFound: totals.linesFound + Number(line.slice(3)) };
      }
      if (line.startsWith('LH:')) {
        return { ...totals, linesHit: totals.linesHit + Number(line.slice(3)) };
      }
      if (line.startsWith('FNF:')) {
        return { ...totals, functionsFound: totals.functionsFound + Number(line.slice(4)) };
      }
      if (line.startsWith('FNH:')) {
        return { ...totals, functionsHit: totals.functionsHit + Number(line.slice(4)) };
      }
      return totals;
    },
    { linesFound: 0, linesHit: 0, functionsFound: 0, functionsHit: 0 },
  );
}

function percentage(hit: number, found: number): number {
  if (found === 0) return 100;
  return (hit / found) * 100;
}

const totals = parseTotals(readFileSync(LCOV_PATH, 'utf8'));
const lineCoverage = percentage(totals.linesHit, totals.linesFound);
const functionCoverage = percentage(totals.functionsHit, totals.functionsFound);

if (functionCoverage < MIN_PERCENT) {
  console.error(
    `Function coverage ${functionCoverage.toFixed(2)}% is below required ${MIN_PERCENT.toFixed(2)}%.`,
  );
  process.exit(1);
}

console.log(
  `Function coverage ${functionCoverage.toFixed(2)}% meets required ${MIN_PERCENT.toFixed(2)}%.`,
);
console.log(`Line coverage reported by Bun: ${lineCoverage.toFixed(2)}%.`);
