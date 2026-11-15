// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// DevOps Yolculuğu — interaktif DevOps öğrenme platformu
export default defineConfig({
  // GitHub Pages proje sitesi: https://sysrootfile.github.io/devops-yolculugu/
  // Not: base ayarı sayesinde tüm çıktı /devops-yolculugu/ altına üretilir;
  // yerel geliştirme de aynı yol altında çalışır (localhost:4321/devops-yolculugu/).
  // Kendi alan adına geçersen base satırını sil.
  site: 'https://sysrootfile.github.io',
  base: '/devops-yolculugu',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      // Açık/koyu tema için çift Shiki teması — CSS ile değiştiriliyor
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
