export interface Principle {
  readonly title: string;
  readonly description: string;
}

export interface ToolboxCategory {
  readonly title: string;
  readonly items: readonly string[];
}

export const PRINCIPLES: readonly [Principle, ...Principle[]] = [
  {
    title: 'Automate Relentlessly',
    description:
      '手作業を見つけたら自動化を考える。繰り返しの作業はシステムに任せ、人はクリエイティブな仕事に集中する。',
  },
  {
    title: 'Question Assumptions',
    description:
      '前提を常に疑う。「なぜそうなっているのか」を問い続けることで、本質的な課題と最適な解決策が見えてくる。',
  },
  {
    title: 'Developer Experience',
    description:
      '開発者の生産性を最大化するツールと環境を提供する。優れた DX は、優れたプロダクトにつながる。',
  },
  {
    title: 'Continuous Improvement',
    description: '小さな改善を積み重ねる。1%の改善を100回繰り返せば、劇的な変化が生まれる。',
  },
];

export const TOOLBOX_CATEGORIES: readonly [ToolboxCategory, ...ToolboxCategory[]] = [
  {
    title: 'Platform & CI/CD',
    items: ['GitHub Actions', 'Terraform', 'Docker', 'AWS', 'Vercel'],
  },
  {
    title: 'Languages',
    items: ['TypeScript', 'Go', 'Python', 'Bash'],
  },
  {
    title: 'Frontend & Backend',
    items: ['Next.js', 'React', 'Hono', 'PostgreSQL', 'Redis'],
  },
  {
    title: 'Tools & Observability',
    items: ['Grafana', 'Datadog', 'Linear', 'Neovim', 'Claude Code'],
  },
];
