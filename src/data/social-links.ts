import type { ComponentType, SVGProps } from 'react';

import { RssIcon } from 'lucide-react';

import {
  GitHubIcon,
  LinkedInIcon,
  QiitaIcon,
  XIcon,
  ZennIcon,
} from '@/components/icons/social-icons';

export interface SocialLink {
  readonly href: string;
  readonly label: string;
  readonly icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;
}

export const SOCIAL_LINKS: readonly [SocialLink, ...SocialLink[]] = [
  { href: 'https://github.com/rymetry', label: 'GitHub', icon: GitHubIcon },
  { href: 'https://x.com/rymetry', label: 'X', icon: XIcon },
  { href: 'https://linkedin.com/in/rymetry', label: 'LinkedIn', icon: LinkedInIcon },
  { href: 'https://zenn.dev/rymetry', label: 'Zenn', icon: ZennIcon },
  { href: 'https://qiita.com/rymetry', label: 'Qiita', icon: QiitaIcon },
  { href: '/feed.xml', label: 'RSS', icon: RssIcon },
];
