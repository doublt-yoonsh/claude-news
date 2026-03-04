import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('en');
  posts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  return rss({
    title: 'Claude Code Daily Briefing',
    description: 'Daily AI news covering Claude Code updates, Anthropic releases, and developer ecosystem.',
    site: context.site!,
    items: posts.slice(0, 20).map(post => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      link: `/en/briefings/${post.id}/`,
    })),
  });
}
