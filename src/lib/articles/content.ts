import type { Element, Root } from 'hast';
import type { Schema } from 'hast-util-sanitize';
import { toString } from 'hast-util-to-string';
import rehypeParse from 'rehype-parse';
import rehypePrism from 'rehype-prism-plus';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

export interface ArticleTocItem {
  readonly id: string;
  readonly level: 2 | 3;
  readonly text: string;
}

export interface ProcessedArticleContent {
  readonly html: string;
  readonly toc: readonly ArticleTocItem[];
}

const ARTICLE_SANITIZE_SCHEMA: Schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': [
      ...(defaultSchema.attributes?.['*'] ?? []),
      'className',
      'aria-hidden',
      'aria-label',
      'title',
    ],
    a: [
      ...(defaultSchema.attributes?.a ?? []),
      ['target', '_blank', '_self'],
      ['rel', 'nofollow', 'noopener', 'noreferrer'],
    ],
    code: [...(defaultSchema.attributes?.code ?? []), 'className', 'data-language'],
    h2: [...(defaultSchema.attributes?.h2 ?? []), 'id'],
    h3: [...(defaultSchema.attributes?.h3 ?? []), 'id'],
    img: [
      ...(defaultSchema.attributes?.img ?? []),
      'alt',
      'height',
      'loading',
      'src',
      'title',
      'width',
    ],
    pre: [
      ...(defaultSchema.attributes?.pre ?? []),
      'className',
      'data-filename',
      'data-language',
      'title',
    ],
    span: [
      ...(defaultSchema.attributes?.span ?? []),
      'className',
      'data-line',
      'data-line-number',
      'line',
    ],
  },
  protocols: {
    ...defaultSchema.protocols,
    src: ['http', 'https'],
  },
  tagNames: [...(defaultSchema.tagNames ?? []), 'figure', 'figcaption', 'picture', 'source'],
};

export async function processArticleContent(content: string): Promise<ProcessedArticleContent> {
  const toc: ArticleTocItem[] = [];

  const file = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSanitize, ARTICLE_SANITIZE_SCHEMA)
    .use(() => (tree: Root) => {
      addHeadingIdsAndCollectToc(tree, toc);
    })
    .use(rehypePrism, {
      ignoreMissing: true,
      showLineNumbers: true,
    })
    .use(rehypeStringify)
    .process(content);

  return {
    html: String(file),
    toc,
  };
}

function addHeadingIdsAndCollectToc(tree: Root, toc: ArticleTocItem[]) {
  const slugCounts = new Map<string, number>();

  visit(tree, 'element', (node: Element) => {
    if (node.tagName !== 'h2' && node.tagName !== 'h3') return;

    const text = toString(node).trim();
    if (!text) return;

    const baseSlug = slugifyHeading(text);
    const count = slugCounts.get(baseSlug) ?? 0;
    slugCounts.set(baseSlug, count + 1);

    const id = count === 0 ? baseSlug : `${baseSlug}-${count + 1}`;
    node.properties.id = id;

    toc.push({
      id,
      level: node.tagName === 'h2' ? 2 : 3,
      text,
    });
  });
}

function slugifyHeading(value: string) {
  const slug = value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'section';
}
