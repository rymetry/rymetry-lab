import 'server-only';

import { getArticles, getTags } from '@/lib/cms';

export async function getArticlesPageContent() {
  const [articles, tags] = await Promise.all([getArticles(), getTags()]);

  return {
    articles,
    tags,
  };
}
