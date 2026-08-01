const MICROCMS_IMAGE_HOST = 'images.microcms-assets.io';

interface BuildMicroCMSImageUrlOptions {
  readonly width?: number;
  readonly height?: number;
  readonly format?: 'avif' | 'webp';
  readonly quality?: number;
  /** imgix の fit。crop = w/h のアスペクト比でクロップ */
  readonly fit?: 'crop';
  /** imgix の crop (fit=crop 時の切り出し位置)。entropy = 情報量の多い領域を自動で残す */
  readonly crop?: 'entropy' | 'faces' | 'focalpoint';
}

export function buildMicroCMSImageUrl(
  imageUrl: string,
  { width, height, format, quality, fit, crop }: BuildMicroCMSImageUrlOptions,
): string {
  const url = new URL(imageUrl);
  if (url.hostname !== MICROCMS_IMAGE_HOST) {
    throw new Error(`Unsupported microCMS image URL host "${url.hostname}"`);
  }

  if (width) url.searchParams.set('w', String(width));
  if (height) url.searchParams.set('h', String(height));
  if (fit) url.searchParams.set('fit', fit);
  if (crop) url.searchParams.set('crop', crop);
  if (format) url.searchParams.set('fm', format);
  if (quality) url.searchParams.set('q', String(quality));

  return url.toString();
}

interface BuildCardThumbnailUrlOptions {
  readonly width: number;
  readonly height: number;
}

/**
 * カードサムネイル用: 表示ボックスに合わせた fit=crop + crop=entropy
 * (情報量の多い領域を自動で残すスマートクロップ) 付き URL を返す。
 * microCMS 以外のホストや不正な URL は加工せずそのまま返す
 * (Story の静的データ等がクラッシュしないためのフォールバック)。
 */
export function buildCardThumbnailUrl(
  imageUrl: string,
  { width, height }: BuildCardThumbnailUrlOptions,
): string {
  let hostname: string;
  try {
    hostname = new URL(imageUrl).hostname;
  } catch {
    return imageUrl;
  }

  if (hostname !== MICROCMS_IMAGE_HOST) return imageUrl;

  return buildMicroCMSImageUrl(imageUrl, { width, height, fit: 'crop', crop: 'entropy' });
}
