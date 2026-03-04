import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('ko');
  posts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  return rss({
    title: 'Claude Code 데일리 브리핑',
    description: 'Claude Code, Anthropic 최신 뉴스를 매일 한국어로 전달합니다.',
    site: context.site!,
    items: posts.slice(0, 20).map(post => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      link: `/briefings/${post.id}/`,
    })),
  });
}
