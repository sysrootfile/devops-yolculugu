import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Türkçe ders içerik koleksiyonu (varsayılan locale).
 * Dosya yapısı: src/content/docs/seviye-<n>/<modül>/<ders>.mdx
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

/**
 * İngilizce ders koleksiyonu — id'ler tr koleksiyonunu aynalar
 * (dil değiştirici 1:1 eşleme yapar). Henüz çevrilmemiş dersler yoktur.
 */
const docsEn = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/docs-en' }),
  schema: docs.schema,
});

export const collections = { docs, docsEn };
