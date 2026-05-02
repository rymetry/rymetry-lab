import { timingSafeEqual } from 'node:crypto';

export function isTimingSafeEqual(value: string | null | undefined, expected: string): boolean {
  if (!value || !expected) return false;

  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(valueBuffer, expectedBuffer);
}
