import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Ders içerik koleksiyonu.
 * Dosya yapısı: src/content/docs/seviye-<n>/<modül>/<ders>.mdx
 * id örneği: "seviye-1/linux/temel-komutlar"
 */
const docs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    level: z.number().min(0).max(5),
    module: z.string(),
    order: z.number(),
    duration: z.number(), // tahmini süre (dakika)
    objectives: z.array(z.string()),
    prerequisites: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { docs };
