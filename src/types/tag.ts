import type { LucideIcon } from 'lucide-react';

export type TagCategory =
  | 'frontend'
  | 'backend'
  | 'infra'
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
  frontend: '#10b981',
  backend: '#3b82f6',
  infra: '#8b5cf6',
  languages: '#f59e0b',
  tools: '#ec4899',
  security: '#ef4444',
  performance: '#06b6d4',
  testing: '#f97316',
  release: '#a855f7',
} as const satisfies Record<TagCategory, string>;
