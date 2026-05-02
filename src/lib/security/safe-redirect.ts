const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f]/;

export function normalizeSafeRedirectPath(
  value: string | null | undefined,
  fallback = '/',
): string {
  const path = value?.trim();
  if (!path) return fallback;
  if (!path.startsWith('/') || path.startsWith('//')) return fallback;
  if (CONTROL_CHARACTER_PATTERN.test(path)) return fallback;

  try {
    const parsed = new URL(path, 'https://rymlab.local');
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}
