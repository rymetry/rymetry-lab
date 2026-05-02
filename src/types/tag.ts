import type { LucideIcon } from 'lucide-react';

export type TagCategory =
  | 'frontend'
  | 'backend'
  | 'infra'
  | 'devops'
  | 'languages'
  | 'tools'
  | 'security'
  | 'performance'
  | 'testing'
  | 'release';

export interface Tag {
  readonly label: string;
  readonly category: TagCategory;
  readonly icon?: LucideIcon;
}

export const TAG_CATEGORY_COLORS = {
  frontend: 'oklch(0.70 0.15 156)',
  backend: 'oklch(0.62 0.19 260)',
  infra: 'oklch(0.61 0.22 293)',
  devops: 'oklch(0.69 0.15 190)',
  languages: 'oklch(0.77 0.16 70)',
  tools: 'oklch(0.66 0.21 354)',
  security: 'oklch(0.64 0.21 25)',
  performance: 'oklch(0.71 0.13 215)',
  testing: 'oklch(0.70 0.19 48)',
  release: 'oklch(0.63 0.23 304)',
} as const satisfies Record<TagCategory, string>;

export const TAG_CATEGORY_TEXT_CLASSES = {
  frontend: 'text-[oklch(0.70_0.15_156)]',
  backend: 'text-[oklch(0.62_0.19_260)]',
  infra: 'text-[oklch(0.61_0.22_293)]',
  devops: 'text-[oklch(0.69_0.15_190)]',
  languages: 'text-[oklch(0.77_0.16_70)]',
  tools: 'text-[oklch(0.66_0.21_354)]',
  security: 'text-[oklch(0.64_0.21_25)]',
  performance: 'text-[oklch(0.71_0.13_215)]',
  testing: 'text-[oklch(0.70_0.19_48)]',
  release: 'text-[oklch(0.63_0.23_304)]',
} as const satisfies Record<TagCategory, string>;
