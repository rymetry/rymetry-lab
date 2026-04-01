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

/** Return the project's explicit href, falling back to the /projects/:slug route convention. */
export function getProjectHref(project: Pick<Project, 'slug' | 'href'>): string {
  return project.href ?? `/projects/${project.slug}`;
}
