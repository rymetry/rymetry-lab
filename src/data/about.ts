export interface Principle {
  readonly emoji: string;
  readonly title: string;
  readonly description: string;
}

export interface ToolboxCategory {
  readonly emoji: string;
  readonly title: string;
  readonly items: readonly string[];
}

export const PRINCIPLES: readonly [Principle, ...Principle[]] = [
  {
    emoji: '\u26A1',
    title: 'Automate Relentlessly',
    description:
      '手作業を見つけたら自動化を考える。繰り返しの作業はシステムに任せ、人はクリエイティブな仕事に集中する。',
  },
  {
    emoji: '\u{1F4A1}',
    title: 'Question Assumptions',
    description:
      '前提を常に疑う。「なぜそうなっているのか」を問い続けることで、本質的な課題と最適な解決策が見えてくる。',
  },
  {
    emoji: '\u2728',
    title: 'Developer Experience',
    description:
      '開発者の生産性を最大化するツールと環境を提供する。優れた DX は、優れたプロダクトにつながる。',
  },
  {
    emoji: '\u{1F680}',
    title: 'Continuous Improvement',
    description: '小さな改善を積み重ねる。1%の改善を100回繰り返せば、劇的な変化が生まれる。',
  },
];

export const TOOLBOX_CATEGORIES: readonly [ToolboxCategory, ...ToolboxCategory[]] = [
  {
    emoji: '\u26A1',
    title: 'Platform & CI/CD',
    items: ['GitHub Actions', 'Terraform', 'Docker', 'AWS', 'Vercel'],
  },
  {
    emoji: '\u{1F4BB}',
    title: 'Languages',
    items: ['TypeScript', 'Go', 'Python', 'Bash'],
  },
  {
    emoji: '\u2699',
    title: 'Frontend & Backend',
    items: ['Next.js', 'React', 'Hono', 'PostgreSQL', 'Redis'],
  },
  {
    emoji: '\u{1F6E0}',
    title: 'Tools & Observability',
    items: ['Grafana', 'Datadog', 'Linear', 'Neovim', 'Claude Code'],
  },
];
