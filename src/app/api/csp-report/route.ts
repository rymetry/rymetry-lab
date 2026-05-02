import { readSafeJson } from '@/lib/security/safe-json';

export async function POST(request: Request) {
  await readSafeJson(request);

  return new Response(null, { status: 204 });
}
