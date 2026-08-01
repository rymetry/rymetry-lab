import { SocialIconBar } from '@/components/social-icon-bar';

/**
 * 静韻の墨帯フッター。ライト/ダーク共に墨色の帯 (--band-bg / --band-border) で、
 * 帯上のテキスト・アイコンは常にダーク配色 (テーマ非連動)。
 */
export function Footer() {
  return (
    <footer className="border-t border-[var(--band-border)] bg-[var(--band-bg)] px-6 py-10 max-md:px-4">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-5 max-md:flex-col max-md:text-center">
        {/* Logo + Copyright */}
        <div className="flex flex-col gap-1.5">
          <div className="font-brand text-[17px] font-bold tracking-[0.05em] text-[#eae8dc]">
            Rym<span className="text-[#93c7a9]">lab</span>
          </div>
          <p className="font-mono text-xs text-[#6b7268]">
            &copy; 2026 Rymlab. All rights reserved.
          </p>
        </div>

        {/* Social Icons */}
        <SocialIconBar variant="footer" className="max-md:justify-center" />
      </div>
    </footer>
  );
}
