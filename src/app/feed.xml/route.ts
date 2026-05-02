import { getArticles } from '@/lib/cms';
import { buildRssFeed } from '@/lib/seo/rss';

export async function GET() {
  const articles = await getArticles();

  return new Response(buildRssFeed({ articles }), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  });
}
