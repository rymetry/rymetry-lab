import { SocialIconBar } from '@/components/social-icon-bar';

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 max-md:flex-col max-md:gap-5 max-md:px-4 max-md:text-center">
        {/* Logo + Copyright */}
        <div className="flex flex-col gap-1.5">
          <div className="font-mono text-[15px] font-bold">
            Rym<span className="text-primary">lab</span>
          </div>
          <p className="text-xs text-muted-foreground">&copy; 2026 Rymlab. All rights reserved.</p>
        </div>

        {/* Social Icons */}
        <SocialIconBar className="max-md:justify-center" />
      </div>
    </footer>
  );
}
