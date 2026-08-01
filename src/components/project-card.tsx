import { TagList } from '@/components/tag';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/project';
import { getProjectHref } from '@/types/project';

interface ProjectCardProps {
  readonly project: Project;
  readonly className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const Icon = project.icon;
  const href = getProjectHref(project);

  return (
    <Link
      href={href}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-[4px] border border-border bg-card p-6',
        'transition-all duration-[250ms]',
        'hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:shadow-[var(--card-shadow-hover)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      {/* Icon */}
      <div className="mb-3.5">
        <div className="flex size-[38px] items-center justify-center rounded-[3px] border border-[var(--tag-border)] bg-[var(--accent-glow)] text-primary">
          <Icon size={18} />
        </div>
      </div>

      {/* Role */}
      <div className="mb-3 font-mono text-[11.5px] text-primary">{project.role}</div>

      {/* Title */}
      <h3 className="mb-1.5 text-[17px] font-bold leading-tight tracking-[-0.01em]">
        {project.title}
      </h3>

      {/* Description */}
      <p className="mb-4 grow text-[13.5px] leading-relaxed text-text-secondary">
        {project.description}
      </p>

      {/* Tags */}
      <TagList tags={project.tags} className="mt-auto" />
    </Link>
  );
}
