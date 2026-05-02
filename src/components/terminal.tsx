import { cn } from '@/lib/utils';

interface TerminalProps {
  readonly children: React.ReactNode;
  readonly compact?: boolean;
  readonly className?: string;
}

export function Terminal({ children, compact = false, className }: TerminalProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'overflow-hidden rounded-[11px] border border-[var(--terminal-border)] bg-[var(--terminal-bg)]',
        !compact &&
          'w-full max-w-[460px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.03)_inset] motion-safe:[animation:float_6s_ease-in-out_infinite]',
        compact && 'rounded-[9px] px-[18px] py-[14px] font-mono text-xs leading-[1.6]',
        className,
      )}
    >
      {!compact && (
        <div className="flex gap-[7px] border-b border-[var(--terminal-border)] px-[14px] py-[10px]">
          <div className="size-[11px] rounded-full bg-[#ef4444]" />
          <div className="size-[11px] rounded-full bg-[#eab308]" />
          <div className="size-[11px] rounded-full bg-[#22c55e]" />
        </div>
      )}
      <div
        className={cn(
          'text-[var(--terminal-text)]',
          !compact && 'p-[18px] font-mono text-[12.5px] leading-[1.8]',
        )}
      >
        {children}
      </div>
    </div>
  );
}
