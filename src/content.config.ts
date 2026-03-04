import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const briefingSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  lang: z.enum(['ko', 'en', 'ja']),
});

const ko = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/ko' }),
  schema: briefingSchema,
});

const en = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/en' }),
  schema: briefingSchema,
});

const ja = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/ja' }),
  schema: briefingSchema,
});

export const collections = { ko, en, ja };
