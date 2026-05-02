interface RawCspReport {
  readonly 'document-uri'?: unknown;
  readonly 'violated-directive'?: unknown;
  readonly 'blocked-uri'?: unknown;
}

interface CspReportEnvelope {
  readonly 'csp-report'?: RawCspReport;
}

export interface CspReportLog {
  readonly documentUri: string;
  readonly violatedDirective: string;
  readonly blockedUri: string;
}

export function toCspReportLog(payload: unknown): CspReportLog | null {
  if (!isRecord(payload)) return null;

  const report = (payload as CspReportEnvelope)['csp-report'];
  if (!isRecord(report)) return null;

  const documentUri = readString(report, 'document-uri');
  const violatedDirective = readString(report, 'violated-directive');
  const blockedUri = readString(report, 'blocked-uri');

  if (!documentUri || !violatedDirective || !blockedUri) return null;

  return {
    documentUri,
    violatedDirective,
    blockedUri,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === 'string' ? value : '';
}
