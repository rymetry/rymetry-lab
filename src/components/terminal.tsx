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
        'overflow-hidden rounded-[5px] border border-[var(--terminal-border)] bg-[var(--terminal-bg)] [background-image:var(--band-texture)]',
        !compact &&
          'w-full max-w-[460px] shadow-[0_25px_50px_-12px_rgba(10,14,10,0.45),0_0_0_1px_rgba(255,255,255,0.03)_inset] motion-safe:[animation:float_6s_ease-in-out_infinite]',
        compact && 'px-[18px] py-[14px] font-mono text-xs leading-[1.6]',
        className,
      )}
    >
      {!compact && (
        <div className="flex gap-[7px] border-b border-[var(--terminal-border)] px-[14px] py-[10px]">
          <div className="size-[11px] rounded-full bg-[#c0554d]" />
          <div className="size-[11px] rounded-full bg-[#c9a24a]" />
          <div className="size-[11px] rounded-full bg-[#5d9b72]" />
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
