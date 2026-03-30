import { RssIcon } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import {
  GitHubIcon,
  LinkedInIcon,
  QiitaIcon,
  XIcon,
  ZennIcon,
} from '@/components/icons/social-icons';

const SOCIAL_LINKS = [
  { href: 'https://github.com/rymetry', label: 'GitHub', icon: GitHubIcon },
  { href: 'https://x.com/rymetry', label: 'X', icon: XIcon },
  { href: 'https://linkedin.com/in/rymetry', label: 'LinkedIn', icon: LinkedInIcon },
  { href: 'https://zenn.dev/rymetry', label: 'Zenn', icon: ZennIcon },
  { href: 'https://qiita.com/rymetry', label: 'Qiita', icon: QiitaIcon },
  { href: '/feed.xml', label: 'RSS', icon: RssIcon },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 max-md:flex-col max-md:gap-5 max-md:px-4 max-md:text-center">
        {/* Logo + Copyright */}
        <div className="flex flex-col gap-1.5">
          <div className="font-mono text-[15px] font-bold">
            Rym<span className="text-primary">lab</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; 2026 Rymlab. All rights reserved.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex gap-2 max-md:justify-center">
          {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith('/') ? undefined : '_blank'}
              rel={href.startsWith('/') ? undefined : 'noopener noreferrer'}
              className={cn(
                'flex size-[34px] items-center justify-center rounded-[7px] border border-border',
                'text-muted-foreground transition-colors duration-200',
                'hover:border-primary hover:text-primary hover:bg-[var(--accent-glow)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              )}
            >
              <Icon size={16} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
