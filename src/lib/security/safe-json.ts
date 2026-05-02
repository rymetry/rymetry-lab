const DEFAULT_MAX_BYTES = 64 * 1024;
const JSON_CONTENT_TYPES = new Set(['application/json', 'application/csp-report']);

interface ReadSafeJsonOptions {
  readonly maxBytes?: number;
}

export async function readSafeJson(
  request: Request,
  { maxBytes = DEFAULT_MAX_BYTES }: ReadSafeJsonOptions = {},
): Promise<unknown | null> {
  const contentType = request.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();
  if (contentType && !JSON_CONTENT_TYPES.has(contentType)) return null;

  const contentLength = request.headers.get('content-length');
  if (contentLength && Number(contentLength) > maxBytes) return null;

  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > maxBytes) return null;
    if (!text.trim()) return null;

    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}
