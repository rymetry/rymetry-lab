import type { LucideIcon } from 'lucide-react';
import type { Tag } from './tag';

export interface Project {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly role: string;
  readonly icon: LucideIcon;
  readonly tags: readonly Tag[];
  readonly href?: string;
}
