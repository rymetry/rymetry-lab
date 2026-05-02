import { toCspReportLog } from '@/lib/security/csp-report';
import { readSafeJson } from '@/lib/security/safe-json';

export async function POST(request: Request) {
  const payload = await readSafeJson(request);
  const report = toCspReportLog(payload);

  if (report) {
    console.warn('[csp-report]', report);
  }

  return new Response(null, { status: 204 });
}
