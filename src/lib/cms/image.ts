const MICROCMS_IMAGE_HOST = 'images.microcms-assets.io';

interface BuildMicroCMSImageUrlOptions {
  readonly width?: number;
  readonly height?: number;
  readonly format?: 'avif' | 'webp';
  readonly quality?: number;
}

export function buildMicroCMSImageUrl(
  imageUrl: string,
  { width, height, format, quality }: BuildMicroCMSImageUrlOptions,
): string {
  const url = new URL(imageUrl);
  if (url.hostname !== MICROCMS_IMAGE_HOST) {
    throw new Error(`Unsupported microCMS image URL host "${url.hostname}"`);
  }

  if (width) url.searchParams.set('w', String(width));
  if (height) url.searchParams.set('h', String(height));
  if (format) url.searchParams.set('fm', format);
  if (quality) url.searchParams.set('q', String(quality));

  return url.toString();
}
