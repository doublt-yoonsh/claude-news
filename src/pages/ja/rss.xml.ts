import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('ja');
  posts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  return rss({
    title: 'Claude Code デイリーブリーフィング',
    description: 'Claude Code、Anthropicの最新ニュースを毎日日本語でお届けします。',
    site: context.site!,
    items: posts.slice(0, 20).map(post => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      link: `/ja/briefings/${post.id}/`,
    })),
  });
}
