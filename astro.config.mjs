// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// DevOps Yolculuğu — interaktif DevOps öğrenme platformu
export default defineConfig({
  site: 'https://devops-yolculugu.local',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      // Açık/koyu tema için çift Shiki teması — CSS ile değiştiriliyor
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
