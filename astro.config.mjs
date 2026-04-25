import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import { readdirSync } from 'node:fs';

const briefingDates = new Map();
for (const lang of ['ko', 'en', 'ja']) {
  try {
    for (const file of readdirSync(`./src/content/${lang}`)) {
      const m = file.match(/^(briefing-(\d{4}-\d{2}-\d{2}))\.md$/);
      if (m) briefingDates.set(m[1], m[2]);
    }
  } catch {}
}
const buildTime = new Date().toISOString();

export default defineConfig({
  site: 'https://claude-news.today',
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en', 'ja'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.endsWith('/en/') &&
        !page.endsWith('/ja/') &&
        !page.includes('/subscribed'),
      i18n: {
        defaultLocale: 'ko',
        locales: {
          ko: 'ko-KR',
          en: 'en-US',
          ja: 'ja-JP',
        },
      },
      serialize(item) {
        const m = item.url.match(/\/briefings\/(briefing-\d{4}-\d{2}-\d{2})\/?$/);
        if (m) {
          const date = briefingDates.get(m[1]);
          if (date) {
            item.lastmod = `${date}T10:00:00+09:00`;
            item.changefreq = 'monthly';
            item.priority = 0.7;
            return item;
          }
        }
        item.lastmod = buildTime;
        if (item.url === 'https://claude-news.today/') {
          item.changefreq = 'daily';
          item.priority = 1.0;
        }
        return item;
      },
    }),
    pagefind(),
  ],
});
